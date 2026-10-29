// Every JSON-LD <script> tag on this site (Organization/WebSite in the
// root layout, Product/Breadcrumb/FAQ schemas per-page) embeds
// `JSON.stringify(schema)` via `dangerouslySetInnerHTML`. Plain
// `JSON.stringify` never escapes `<`, so if any CMS-editable field
// feeding one of these schemas (a product title, SEO description, etc.)
// ever contained the literal text `</script>`, the browser's HTML parser
// would close the script tag early — regardless of it sitting inside a
// JSON string — and execute whatever HTML/script follows. That requires
// control over CMS content (an Editor/Admin account), not a random
// visitor, but it's a real stored-XSS path with zero mitigation before
// this (confirmed 2026-10-29 pre-launch audit).
//
// `<` is the standard fix: valid JSON (a unicode escape for `<`
// inside a string is just `<` once parsed — doesn't change the data),
// but invisible to the HTML parser scanning for a literal `<` to start a
// tag, so `</script>` can never appear in the raw output.
export function safeJsonLd(schema: unknown): string {
  return JSON.stringify(schema).replace(/</g, "\\u003c");
}
