/* eslint no-unused-vars:0 */
let wasmRender: ((_md: string) => string) | null = null;

export function renderMarkdown(_md: string): string {
  if (wasmRender) return wasmRender(_md);

  return _md
    .replace(/^### (.*$)/gim, "<h3>$1</h3>")
    .replace(/^## (.*$)/gim, "<h2>$1</h2>")
    .replace(/^# (.*$)/gim, "<h1>$1</h1>")
    .replace(/\*\*(.*?)\*\*/gim, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/gim, "<em>$1</em>")
    .replace(/\n$/gim, "<br>");

}
