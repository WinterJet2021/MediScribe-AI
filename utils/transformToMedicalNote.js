// transformToMedicalNote.js

function safeParseFloat(value) {
  const num = parseFloat(value);
  return isNaN(num) ? undefined : num;
}

export function transformEHRFields(flatData, meta = {}) {
  return {
    patient_name: meta.patient_name || "Unknown",
    doctor_id: meta.doctor_id || "Unknown",
    visit_date: new Date(),

    specimen: {
      label: flatData["Specimen Label"],
      length_cm: safeParseFloat(flatData["Specimen Length"]),
      colon_max_circumference_cm: safeParseFloat(flatData["Colon Max Circumference"]),
      terminal_ileum_max_circumference_cm: safeParseFloat(flatData["Terminal Ileum Max Circumference"]),
      transverse_colon_max_circumference_cm: safeParseFloat(flatData["Transverse Colon Max Circumference"]),
      descending_colon_max_circumference_cm: flatData["Descending Colon Max Circumference"],
      sigmoid_colon_max_circumference_cm: safeParseFloat(flatData["Sigmoid Colon Max Circumference"]),
      cecum_length_cm: safeParseFloat(flatData["Cecum Length"]),
      ascending_colon_length_cm: safeParseFloat(flatData["Ascending Colon Length"]),
      transverse_colon_length_cm: safeParseFloat(flatData["Transverse Colon Length"]),
      descending_colon_length_cm: safeParseFloat(flatData["Descending Colon Length"]),
      sigmoid_colon_length_cm: safeParseFloat(flatData["Sigmoid Colon Length"]),
      terminal_ileum_length_cm: safeParseFloat(flatData["Terminal Ileum Length"]),
      appendix_length_cm: safeParseFloat(flatData["Appendix Length"]),
      appendix_diameter_cm: safeParseFloat(flatData["Appendix Diameter"])
    },

    tumor: {
      size_cm: flatData["Tumor Size"],
      type: flatData["Tumor Type"],
      appearance: flatData["Tumor Appearance"],
      color_consistency: flatData["Tumor Color & Consistency"],
      location: flatData["Tumor Location"],
      shape: flatData["Tumor Shape"],
      thickness_cm: safeParseFloat(flatData["Tumor Thickness"]),
      wall_side: flatData["Tumor Wall Side"],
      invasion_level: flatData["Tumor Invasion Level"]
    },

    margins: {
      proximal_cm: safeParseFloat(flatData["Margins Proximal"]),
      distal_cm: safeParseFloat(flatData["Margins Distal"]),
      radial_cm: safeParseFloat(flatData["Margins Radial"]),
      mesenteric_cm: safeParseFloat(flatData["Margins Mesenteric"]),
      distance_from_proximal_margin_cm: safeParseFloat(flatData["Distance from Proximal Margin"]),
      distance_from_distal_margin_cm: safeParseFloat(flatData["Distance from Distal Margin"]),
      distance_from_mesenteric_margin_cm: safeParseFloat(flatData["Distance from Mesenteric Margin"]),
      distance_from_retroperitoneal_margin_cm: safeParseFloat(flatData["Distance from Retroperitoneal Margin"])
    },

    lymph_nodes: {
      found: flatData["Lymph Nodes Found"],
      positive: flatData["Positive Nodes"],
      examined: flatData["Nodes Examined"],
      positions: flatData["Node Positions"],
      extranodal_extension: flatData["Extranodal Extension"],
      lymphovascular_invasion: flatData["Lymphovascular Invasion"],
      perineural_invasion: flatData["Perineural Invasion"],
      extramural_vascular_invasion: flatData["Extramural Vascular Invasion"],
      tumor_budding: flatData["Tumor Budding"]
    },

    polyp: {
      presence: flatData["Polyp Presence"],
      size_cm: safeParseFloat(flatData["Polyp Size"]),
      distance_from_main_lesion_cm: safeParseFloat(flatData["Polyp Distance from Main Lesion"])
    },

    staging: {
      pT: flatData["pT Stage"],
      pN: flatData["pN Stage"],
      pM: flatData["pM Stage"],
      distance_to_serosa: flatData["Distance to Serosa"],
      synchronous_polyps: flatData["Synchronous Polyps"]
    },

    tissue_surfaces: {
      serosal_surface: flatData["Serosal Surface Status"],
      retroperitoneal_surface: flatData["Retroperitoneal Surface Status"],
      omentum_findings: flatData["Omentum Findings"],
      other_findings: flatData["Other Findings"]
    },

    admin: {
      pathologist: flatData["Pathologist"],
      diagnosis_date: flatData["Diagnosis Date"],
      block_count: flatData["Block Count"],
      report_conclusion: flatData["Report Conclusion"]
    },

    status: "draft"
  };
}