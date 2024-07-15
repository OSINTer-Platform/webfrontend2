export function typewriter(
  node: HTMLElement,
  config: { duration: number; delay?: number } = { duration: 1000 }
) {
  const text = node.textContent;
  const valid =
    node.childNodes.length === 1 &&
    node.childNodes[0].nodeType === Node.TEXT_NODE;

  if (!valid) {
    console.error(
      `This transition only works on elements with a single text node child`
    );
    return {};
  }

  if (!text) return {};

  return {
    delay: config.delay,
    duration: config.duration,
    tick: (t: number) => {
      const i = Math.trunc(text.length * t);
      node.textContent = text.slice(0, i);
    },
  };
}
