const ALLOWED_TAGS = new Set([
  "p", "br", "hr", "b", "strong", "i", "em", "u", "s", "a",
  "h1", "h2", "h3", "h4", "h5", "ul", "ol", "li",
  "code", "pre", "blockquote", "span",
]);

const DROP_CONTENT_TAGS = new Set([
  "script", "style", "iframe", "object", "embed",
  "noscript", "template", "svg", "math", "form", "textarea", "title",
]);
const VOID_TAGS = new Set(["br", "hr", "img", "input", "meta", "link", "source"]);

function extractHref(tag) {
  const m = tag.match(/href\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/i);
  const href = m ? String(m[1] ?? m[2] ?? m[3] ?? "").trim() : "";
  if (/^(https?:\/\/|mailto:|tel:|\/|#)/i.test(href)) return href.replace(/"/g, "&quot;");
  return "";
}

export function sanitizeHtml(input) {
  if (!input) return "";
  const tokens = String(input).match(/<[^>]*>?|[^<]+/g) || [];
  const out = [];
  const stack = [];
  let dropName = null;
  let dropDepth = 0;

  for (const raw of tokens) {
    const isTag = raw[0] === "<";
    const tagMatch = isTag ? raw.match(/^<\s*(\/)?\s*([a-zA-Z0-9]+)/) : null;
    const tagName = tagMatch ? tagMatch[2].toLowerCase() : "";

    if (dropName) {
      if (tagName === dropName) {
        if (tagMatch[1]) {
          dropDepth--;
          if (dropDepth <= 0) {
            dropName = null;
            dropDepth = 0;
          }
        } else {
          dropDepth++;
        }
      }
      continue;
    }

    if (!isTag) {
      out.push(raw);
      continue;
    }
    if (!tagMatch) continue;

    const isClose = !!tagMatch[1];
    const name = tagName;

    if (!ALLOWED_TAGS.has(name)) {
      if (!isClose && !VOID_TAGS.has(name) && DROP_CONTENT_TAGS.has(name)) {
        dropName = name;
        dropDepth = 1;
      }
      continue;
    }

    if (name === "br") {
      if (!isClose) out.push("<br>");
      continue;
    }
    if (name === "hr") {
      if (!isClose) out.push("<hr>");
      continue;
    }
    if (isClose) {
      const idx = stack.lastIndexOf(name);
      if (idx === -1) continue;
      const closers = stack.splice(idx).reverse();
      for (const n of closers) out.push(`</${n}>`);
    } else {
      stack.push(name);
      if (name === "a") {
        const href = extractHref(raw);
        out.push(href ? `<a href="${href}" target="_blank" rel="noopener noreferrer nofollow">` : "<a>");
      } else {
        out.push(`<${name}>`);
      }
    }
  }
  while (stack.length) out.push(`</${stack.pop()}>`);
  return out.join("");
}

export function clampHtml(html, limit = 40) {
  const tokens = String(html || "").match(/<[^>]*>?|[^<]+/g) || [];
  const stack = [];
  let words = 0;
  let out = "";
  let truncated = false;

  outer: for (const raw of tokens) {
    if (raw[0] !== "<") {
      for (const part of raw.split(/(\s+)/)) {
        if (!part) continue;
        if (/^\s+$/.test(part)) {
          out += part;
          continue;
        }
        if (words >= limit) {
          truncated = true;
          break outer;
        }
        out += part;
        words++;
      }
      continue;
    }
    const m = raw.match(/^<\s*(\/)?\s*([a-zA-Z0-9]+)/);
    out += raw;
    if (m) {
      const name = m[2].toLowerCase();
      if (name !== "br" && name !== "hr" && name !== "img") {
        if (m[1]) {
          const idx = stack.lastIndexOf(name);
          if (idx > -1) stack.length = idx;
        } else {
          stack.push(name);
        }
      }
    }
  }

  out = out.replace(/\s+$/, "");
  while (stack.length) out += `</${stack.pop()}>`;
  return { html: out, truncated };
}
