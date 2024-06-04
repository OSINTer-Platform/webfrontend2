import { tooltip } from "$shared/state/state";
import { PUBLIC_API_BASE } from "$env/static/public";

export const CVERegex = /^[cC][vV][eE]-[0-9]{4}-[0-9]{4,9}$/;

type CVEOverview = { cve: string; title: string; details: string };

const cachedCVEs: { [key: string]: CVEOverview } = {};

function pointerIn(e: PointerEvent) {
  const cveId = (e.target as HTMLAnchorElement).text;

  if (!(cveId in cachedCVEs)) return;

  const cve = cachedCVEs[cveId];

  tooltip.set({
    text:
      cve.details.length > 0
        ? { title: cve.title, description: cve.details }
        : cve.title,
    x: e.x,
    y: e.y,
  });
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

async function cacheCves(cveIds: string[]) {
  async function query(ids: string[]): Promise<CVEOverview[]> {
    const url = new URL(`${PUBLIC_API_BASE}/cves/overview`);
    ids.forEach((id) => url.searchParams.append("cves", id));
    const r = await fetch(url);
    return r.ok ? await r.json() : [];
  }

  const newCveIds = cveIds.filter((id) => !(id in cachedCVEs));
  if (newCveIds.length < 1) return;

  const newCves = await query(newCveIds);

  newCves.forEach((cve) => (cachedCVEs[cve.cve] = cve));
}

export async function mountCVEPreview(containerSelector: string) {
  const anchors = document
    .querySelector(containerSelector)
    ?.querySelectorAll("a");

  if (!anchors) return;

  const cveAnchors = Array.from(anchors).filter((el) =>
    el.text.match(CVERegex)
  );
  if (cveAnchors.length < 1) return;

  const cves = cveAnchors.map((el) => el.text);
  const uniqueCves = [...new Set(cves)];
  await cacheCves(uniqueCves);

  cveAnchors.forEach((anchor) => {
    if (!(anchor.text in cachedCVEs) && anchor.title === "OSINTer-CVE") {
      const textEl = document.createElement("p");
      textEl.innerHTML = anchor.innerHTML;
      textEl.style.display = "inline";
      anchor.parentNode?.replaceChild(textEl, anchor);
      return;
    }

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
