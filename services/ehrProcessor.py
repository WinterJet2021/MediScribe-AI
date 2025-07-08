# services/ehrProcessor.py

import re
import docx
import sys
import json
import ollama

def extract_text(doc_path):
    
    doc = docx.Document(doc_path)
    return "\n".join(p.text.strip() for p in doc.paragraphs if p.text.strip())

def regex_extract(text):
    def find(pattern, default="Not Mentioned", flags=re.IGNORECASE):
        try:
            match = re.search(pattern, text, flags)
            return match.group(1).strip() if match else default
        except (IndexError, AttributeError):
            return default

    return {
        "Specimen Label": find(r"labeled as “([^”]+)”"),
        "Specimen Length": find(r"specimen.*?measures (\d+(\.\d+)? ?cm)"),
        "Colon Max Circumference": find(r"maximal circumference of the colon measures (\d+(\.\d+)? ?cm)"),
        "Terminal Ileum Max Circumference": find(r"maximal circumference of the terminal ileum measures (\d+(\.\d+)? ?cm)"),
        "Transverse Colon Max Circumference": find(r"transverse colon.*?maximal circumference.*?(\d+(\.\d+)? ?cm)"),
        "Descending Colon Max Circumference": find(r"descending colon.*?maximal circumference.*?(\d+(\.\d+)? ?cm)"),
        "Sigmoid Colon Max Circumference": find(r"sigmoid colon.*?maximal circumference.*?(\d+(\.\d+)? ?cm)"),
        "Cecum Length": find(r"cecum.*?measuring (\d+(\.\d+)? ?cm)"),
        "Ascending Colon Length": find(r"ascending colon.*?measuring (\d+(\.\d+)? ?cm)"),
        "Transverse Colon Length": find(r"transverse colon.*?measuring (\d+(\.\d+)? ?cm)"),
        "Descending Colon Length": find(r"descending colon.*?measuring (\d+(\.\d+)? ?cm)"),
        "Sigmoid Colon Length": find(r"sigmoid colon.*?measuring (\d+(\.\d+)? ?cm)"),
        "Terminal Ileum Length": find(r"terminal ileum.*?measuring (\d+(\.\d+)? ?cm)"),
        "Appendix Length": find(r"appendix.*?measuring (\d+(\.\d+)? ?cm)"),
        "Appendix Diameter": find(r"appendix.*?diameter.*?(\d+(\.\d+)? ?cm)"),
        "Tumor Size": find(r"measuring (\d+(\.\d+)? ?x ?\d+(\.\d+)? ?x ?\d+(\.\d+)? ?cm)"),
        "Tumor Type": find(r"(adenocarcinoma|mucinous carcinoma|signet ring)", "Adenocarcinoma"),
        "Tumor Appearance": find(r"appearance.*?, (friable|soft|firm|rubbery|necrotic|hemorrhagic)"),
        "Tumor Color & Consistency": find(r"tumor.*?is (gray[\w\s]*|light brown|dark brown).+?(soft|rubbery|firm)"),
        "Tumor Location": find(r"located in the ([\w\s]+)[\.,]"),
        "Tumor Shape": find(r"(ulcerative|ulceroproliferative|polypoid) lesion"),
        "Tumor Thickness": find(r"infiltrative tumor.*?measuring (\d+(\.\d+)? ?cm) in thickness"),
        "Tumor Wall Side": find(r"circumference at (mesocolic|anti[- ]?mesocolic|posterior wall|anterior wall)"),
        "Tumor Invasion Level": find(r"tumor.*?invad(?:es|ing).*?(into|through).*?(submucosa|muscularis propria|pericolic.*?|serosal surface|retroperitoneal surface)", flags=re.IGNORECASE),
        "Serosal Surface Status": find(r"serosal.*?(smooth.*?|irregular.*?|perforated.*?)\."),
        "Retroperitoneal Surface Status": find(r"retroperitoneal.*?(smooth.*?|irregular.*?|perforated.*?)\."),
        "Margins Proximal": find(r"proximal margin.*?(\d+(\.\d+)? ?cm)"),
        "Margins Distal": find(r"distal margin.*?(\d+(\.\d+)? ?cm)"),
        "Margins Radial": find(r"radial margin.*?(\d+(\.\d+)? ?cm)"),
        "Margins Mesenteric": find(r"mesenteric margin.*?(\d+(\.\d+)? ?cm)"),
        "Distance from Proximal Margin": find(r"located.*?(\d+(\.\d+)? ?cm) from (?:the )?proximal margin"),
        "Distance from Distal Margin": find(r"(\d+(\.\d+)? ?cm) from (?:the )?distal margin"),
        "Distance from Mesenteric Margin": find(r"(\d+(\.\d+)? ?cm) from mesenteric margin"),
        "Distance from Retroperitoneal Margin": find(r"(\d+(\.\d+)? ?cm) from retroperitoneal margin"),
        "Lymph Nodes Found": find(r"(\d+)\s+lymph nodes"),
        "Positive Nodes": find(r"(\d+)\s+positive"),
        "Nodes Examined": find(r"/\s*(\d+)\s+nodes"),
        "Node Positions": find(r"(apical|pericolic|mesenteric)"),
        "Extranodal Extension": find(r"with extranodal extension", "Yes" if "extranodal extension" in text.lower() else "No"),
        "Lymphovascular Invasion": find(r"lymphovascular invasion.*?(present|absent)"),
        "Perineural Invasion": find(r"perineural invasion.*?(present|absent)"),
        "Extramural Vascular Invasion": find(r"extramural vascular invasion.*?(present|absent)"),
        "Tumor Budding": find(r"tumor budding.*?(present|absent)"),
        "Polyp Presence": find(r"(sessile|pedunculated) polyp"),
        "Polyp Size": find(r"polyp.*?measuring (\d+(\.\d+)? ?cm)"),
        "Polyp Distance from Main Lesion": find(r"located (\d+(\.\d+)? ?cm) from (?:the )?(main lesion|proximal margin|distal margin)"),
        "pT Stage": find(r"(pT[0-9a-z]+)"),
        "pN Stage": find(r"(pN[0-9a-z]+)"),
        "pM Stage": find(r"(pM[0-9a-z]+)"),
        "Distance to Serosa": find(r"distance.*?(serosa|peritoneal).*?(\d+(\.\d+)? ?mm)"),
        "Synchronous Polyps": find(r"synchronous (lesions|polyps).*?(present|absent)"),
        "Omentum Findings": find(r"omentum.*?(no grossly identifiable lesion|no nodule or mass|unremarkable|shows.*?)\."),
        "Other Findings": find(r"ileum.*?unremarkable|appendix.*?unremarkable", "Not Mentioned"),
        "Pathologist": find(r"Pathologist\s*:\s*(Dr\.\s*\w+.*)"),
        "Diagnosis Date": find(r"Date\s*of\s*Diagnosis\s*:\s*(\d{1,2}/\d{1,2}/\d{2,4})"),
        "Block Count": find(r"Total\s*blocks\s*taken\s*:\s*(\d+)"),
        "Report Conclusion": find(r"(Final diagnosis[:\s].+)", default="", flags=re.IGNORECASE | re.DOTALL)
    }

def clean_llama_output(value):
    if not value or value.strip() == "":
        return "Not Mentioned"
    remove_phrases = [r"(?i)the value for the field .*? is[:\-]?\s*", r"(?i)based on.*"]
    for pattern in remove_phrases:
        value = re.sub(pattern, "", value, flags=re.IGNORECASE).strip()
    if value.lower() in ["", "is", "are", ":", "-", "the", "value"]:
        return "Not Mentioned"
    return value

def llama_extract_field(text, field_name):
    prompt = f"""You are a medical summarizer. Extract the value for the field below from the pathology report.

Field: {field_name}

Rules:
- Return only the value.
- If not found, return: Not Mentioned.
- DO NOT explain or justify.
- DO NOT include Based on the pathology reports provided or something similar.
- DO NOT include any extra text or context.
- Keep the response concise, ideally under 120 characters.

Report:
{text}
"""
    try:
        response = ollama.chat(model="llama3", messages=[{"role": "user", "content": prompt}])
        result = response["message"]["content"].strip().split("\n")[0]
        return clean_llama_output(result)
    except Exception:
        return "Not Mentioned"

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"error": "No file path provided"}))
        sys.exit(1)

    doc_path = sys.argv[1]
    try:
        text = extract_text(doc_path)
        result = regex_extract(text)
        print(json.dumps(result))
    except Exception as e:
        print(json.dumps({"error": str(e)}))
        sys.exit(1)