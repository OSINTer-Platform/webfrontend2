<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { v4 as uuid } from "uuid";

  let classes: string = "";
  export { classes as class };

  export let tag: string;
  export let content: string;
  export let id: string = uuid();

  const dispatch = createEventDispatcher<{ commit: string }>();
  let previouslyCommitted = content;

  function commit(
    e: (KeyboardEvent | FocusEvent) & { currentTarget: HTMLElement }
  ) {
    const newText = e.currentTarget.innerText.trim();
    if (newText.length < 1) {
      e.currentTarget.innerText = previouslyCommitted;
    } else if (newText !== previouslyCommitted) {
      previouslyCommitted = newText;
      content = newText;
      dispatch("commit", newText);
    }
  }

  function keydown(e: KeyboardEvent & { currentTarget: HTMLElement }) {
    if (e.key === "Enter") {
      e.preventDefault();
      e.currentTarget.blur();
    }
  }

  function paste(e: ClipboardEvent & { currentTarget: HTMLElement }) {
    let currentText = e.currentTarget.innerText;

    e.preventDefault();
    const pasteContents = e.clipboardData
      ?.getData("text/plain")
      .trim()
      .replaceAll(/\r?\n|\r/g, " ");
    if (!pasteContents) return;

    const selections = window.getSelection();
    if (!selections || selections.rangeCount < 1) return;

    for (let i = selections.rangeCount - 1; i >= 0; i--) {
      const range = selections.getRangeAt(i);
      if (
        range.commonAncestorContainer.parentNode?.isSameNode(e.currentTarget)
      ) {
        currentText =
          currentText.slice(0, range.startOffset) +
          currentText.slice(range.endOffset);
      } else if (range.commonAncestorContainer.isSameNode(e.currentTarget)) {
        currentText = "";
        break;
      }
    }

    const firstCursorPos = selections.getRangeAt(0).startOffset;

    e.currentTarget.innerText =
      currentText.slice(0, firstCursorPos) +
      pasteContents +
      currentText.slice(firstCursorPos);

    const textNode = Array.from(e.currentTarget.childNodes).filter(
      (node) => node.nodeType == Node.TEXT_NODE
    )[0];

    const newRange = document.createRange();
    newRange.selectNode(textNode);
    newRange.setStart(textNode, firstCursorPos + pasteContents.length);
    newRange.setEnd(textNode, firstCursorPos + pasteContents.length);

    selections.removeAllRanges();
    selections.addRange(newRange);
  }
</script>

<svelte:element
  this={tag}
  role="heading"
  on:keydown={keydown}
  on:blur={commit}
  on:paste={paste}
  on:drop|preventDefault
  on:click
  {id}
  class="{classes} focus:outline-none"
  contenteditable="true"
  autocorrect="off"
  autocapitalize="off"
  spellcheck="false"
  data-gramm="false"
  draggable="false"
>
  {content}
</svelte:element>
