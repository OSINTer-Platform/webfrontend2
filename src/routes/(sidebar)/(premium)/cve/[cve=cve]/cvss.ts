import type { CVSS2, CVSS3 } from "$shared/types/api";

export function processCvss2(
  cvss: CVSS2
): { title: string; content: string; mono: boolean }[][] {
  const b = (content: boolean) => (content ? "Yes" : "No");

  const data = cvss.cvss_data;
  return [
    [
      { title: "Version", content: data.version, mono: false },
      { title: "Source", content: cvss.source, mono: false },
      { title: "Vector String", content: data.vector_string, mono: false },
    ],
    [
      {
        title: "Obtain All Privilege",
        content: b(cvss.obtain_all_privilege),
        mono: false,
      },
      {
        title: "Obtain User Privilege",
        content: b(cvss.obtain_user_privilege),
        mono: false,
      },
      {
        title: "Obtain Other Privilege",
        content: b(cvss.obtain_other_privilege),
        mono: false,
      },
      {
        title: "User Interaction Required",
        content: cvss.user_interaction_required
          ? b(cvss.user_interaction_required)
          : "Unknown",
        mono: false,
      },
      {
        title: "AC Insufficient Information",
        content: b(cvss.ac_insuf_info),
        mono: false,
      },
    ],
    [
      { title: "Access Vector", content: data.access_vector, mono: false },
      {
        title: "Access Complexity",
        content: data.access_complexity,
        mono: false,
      },
      {
        title: "Authentication",
        content: data.authentication,
        mono: false,
      },
    ],
    [
      {
        title: "Confidentiality Impact",
        content: data.confidentiality_impact,
        mono: false,
      },
      {
        title: "Integrity Impact",
        content: data.integrity_impact,
        mono: false,
      },
      {
        title: "Availability Impact",
        content: data.availability_impact,
        mono: false,
      },
    ],
    [
      {
        title: "Base Score",
        content: data.base_score.toString(),
        mono: false,
      },
      {
        title: "Exploitability Score",
        content: cvss.exploitability_score.toString(),
        mono: false,
      },
      {
        title: "Impact Score",
        content: cvss.impact_score.toString(),
        mono: false,
      },
    ],
  ];
}

export function processCvss3(
  cvss: CVSS3
): { title: string; content: string; mono: boolean }[][] {
  const data = cvss.cvss_data;

  return [
    [
      { title: "Version", content: data.version, mono: false },
      { title: "Source", content: cvss.source, mono: false },
      { title: "Vector String", content: data.vector_string, mono: false },
    ],
    [
      { title: "Attack Vector", content: data.attack_vector, mono: false },
      {
        title: "Attack Complexity",
        content: data.attack_complexity,
        mono: false,
      },
      {
        title: "Privileges Required",
        content: data.privileges_required,
        mono: false,
      },
      {
        title: "User Interaction",
        content: data.user_interaction,
        mono: false,
      },
      { title: "Scope", content: data.scope, mono: false },
    ],
    [
      {
        title: "Confidentiality Impact",
        content: data.confidentiality_impact,
        mono: false,
      },
      {
        title: "Integrity Impact",
        content: data.integrity_impact,
        mono: false,
      },
      {
        title: "Availability Impact",
        content: data.availability_impact,
        mono: false,
      },
    ],
    [
      {
        title: "Base Score",
        content: data.base_score.toString(),
        mono: false,
      },
      {
        title: "Exploitability Score",
        content: cvss.exploitability_score.toString(),
        mono: false,
      },
      {
        title: "Impact Score",
        content: cvss.impact_score.toString(),
        mono: false,
      },
    ],
  ];
}
