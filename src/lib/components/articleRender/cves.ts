import type { CVEBase } from "$shared/types/api";
import { PUBLIC_API_BASE } from "$env/static/public";
import { tooltip } from "$shared/state/state";

export const CVERegex = /([cC][vV][eE])-([0-9]{4}-[0-9]{4,9})/;

const cachedCVEs: { [key: string]: CVEBase } = {};

function summarizeCVE(cve: CVEBase) {
  if (cve.cvss3)
    return {
      title: cve.title,
      description: `Base: ${cve.cvss3.cvss_data.base_score} | Exploitability: ${cve.cvss3.exploitability_score} | Impact: ${cve.cvss3.impact_score} | Articles: ${cve.document_count}`,
    };
  else if (cve.cvss2)
    return {
      title: cve.title,
      description: `Base: ${cve.cvss2.cvss_data.base_score} | Exploitability: ${cve.cvss2.exploitability_score} | Impact: ${cve.cvss2.impact_score} | Articles: ${cve.document_count}`,
    };
  else return cve.title;
}

function pointerIn(e: PointerEvent) {
  const cveId = (e.target as HTMLAnchorElement).text;

  if (!(cveId in cachedCVEs)) return;

  const cve = cachedCVEs[cveId];

  tooltip.set({ text: summarizeCVE(cve), x: e.x, y: e.y });
}

function pointerMove(e: PointerEvent) {
  tooltip.update(($tooltip) => {
    if (!$tooltip) return null;
    $tooltip.x = e.x;
    $tooltip.y = e.y;
    return $tooltip;
  });
}

const pointerOut = () => tooltip.set(null);

export async function mountCVEPreview() {
  const getCVEDetails = async (cves: string[]): Promise<CVEBase[]> => {
    const r = await fetch(`${PUBLIC_API_BASE}/cves/search?complete=false`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ cves }),
    });

    return r.ok ? await r.json() : [];
  };
  const anchors = document
    .querySelector(".article-content-render")
    ?.querySelectorAll("a");

  if (!anchors) return;

  const cves = Array.from(anchors).map((el) => el.text);
  const cveDetails = await getCVEDetails(cves);
  cveDetails.forEach((cve) => {
    cachedCVEs[cve.cve] = cve;
  });

  anchors.forEach((anchor) => {
    if (!anchor.text.match(CVERegex)) return;

    anchor.setAttribute("target", "_blank");
    anchor.setAttribute("rel", "noopener noreferrer");
    anchor.setAttribute("data-sveltekit-preload-data", "tap");
    anchor.addEventListener("pointerenter", pointerIn);
    anchor.addEventListener("pointermove", pointerMove);
    anchor.addEventListener("pointerleave", pointerOut);
  });
}

export function cleanUp() {
  if (typeof document === "undefined") return;

  document
    .querySelector(".article-content-render")
    ?.querySelectorAll("a")
    .forEach((anchor) => {
      if (!anchor.text.match(CVERegex)) return;

      anchor.removeEventListener("pointerenter", pointerIn);
      anchor.removeEventListener("pointermove", pointerMove);
      anchor.removeEventListener("pointerleave", pointerOut);
    });
}
