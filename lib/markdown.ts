export function renderMarkdown(md: string): string {
  let html = md
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (_m, _lang, code) => {
    const c = code
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">");
    return `<pre><code>${c}</code></pre>`;
  });

  html = html.replace(/`([^`]+)`/g, "<code>$1</code>");

  html = html.replace(/^### (.+)$/gm, "<h3>$1</h3>");
  html = html.replace(/^## (.+)$/gm, "<h2>$1</h2>");

  html = html.replace(/^> (.+)$/gm, (_m, content) =>
    `<blockquote class="border-l-2 border-muted-foreground/30 pl-3 italic text-muted-foreground">${content}</blockquote>`
  );

  html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/\*(.+?)\*/g, "<em>$1</em>");

  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_m, text, url) => {
    const safeUrl = url.startsWith("http") ? url : `https://github.com${url}`;
    return `<a href="${safeUrl}" class="text-primary underline underline-offset-2 hover:text-primary/80" target="_blank" rel="noopener noreferrer">${text}</a>`;
  });

  html = html.replace(/\n\n/g, "</p><p>");

  html = html.replace(/^(\d+)\. (.+)$/gm, "<li data-list='ol'>$2</li>");
  html = html.replace(/^- (.+)$/gm, "<li data-list='ul'>$1</li>");

  html = html.replace(/\n/g, " ");

  const olRegex = /<li data-list='ol'>.*?<\/li>(?:\s*<li data-list='ol'>.*?<\/li>)*/g;
  html = html.replace(olRegex, (match) => {
    const items = match.replace(/ data-list='ol'/g, "");
    return `<ol>${items}</ol>`;
  });

  const ulRegex = /<li data-list='ul'>.*?<\/li>(?:\s*<li data-list='ul'>.*?<\/li>)*/g;
  html = html.replace(ulRegex, (match) => {
    const items = match.replace(/ data-list='ul'/g, "");
    return `<ul>${items}</ul>`;
  });

  html = html.replace(/<\/ol>\s*<ol>/g, "");
  html = html.replace(/<\/ul>\s*<ul>/g, "");

  html = "<p>" + html + "</p>";

  html = html.replace(/<p><\/p>/g, "");

  return html;
}
