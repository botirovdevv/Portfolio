import "server-only";
import { Marked } from "marked";

const marked = new Marked({ gfm: true, breaks: true });

// Posts are written only by the admin, but raw HTML is still dropped as a precaution.
marked.use({
  renderer: {
    html() {
      return "";
    },
    link({ href, text }) {
      const external = /^https?:\/\//.test(href);
      return `<a href="${href}"${external ? ' target="_blank" rel="noopener noreferrer"' : ""}>${text}</a>`;
    },
  },
});

export function renderMarkdown(md: string): string {
  return marked.parse(md, { async: false }) as string;
}
