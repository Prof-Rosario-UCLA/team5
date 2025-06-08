export function render(src: string): string {
    let out = "";
    const lines = src.split("\n");
    let inCode = false;
    for (let l of lines) {
      if (l.startsWith("```")) {
        inCode = !inCode;
        out += inCode ? "<pre><code>" : "</code></pre>";
      } else if (inCode) {
        out += l.replace(/&/g, "&amp;") + "\n";
      } else if (l.startsWith("# ")) {
        out += "<h1>" + l.substr(2) + "</h1>";
      } else {
        out += "<p>" + l + "</p>";
      }
    }
    return out;
  }
  