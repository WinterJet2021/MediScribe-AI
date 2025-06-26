# services/ehrExtractionService.py

from .ehrProcessor import regex_extract, llama_extract_field

def hybrid_extract(text):
    regex_data = regex_extract(text)
    final_data = {}
    for field in regex_data:
        val = regex_data[field]
        if val in ["Not Mentioned", "", None]:
            final_data[field] = llama_extract_field(text, field)
        else:
            final_data[field] = val
    return final_data
