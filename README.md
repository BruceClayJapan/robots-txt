# @bruce-clay/robots-txt

A dependency-free, faithful TypeScript port of
[Google's reference robots.txt parser](https://github.com/google/robotstxt)
(`robots.cc`). It parses a robots.txt file and decides whether a given crawler
may fetch a given URL, matching Googlebot's behavior — including the parts of
[RFC 9309](https://www.rfc-editor.org/rfc/rfc9309.html) and Google's documented
extensions that most naive parsers get wrong.

- **Zero runtime dependencies.** One class, no I/O, no transport, no logging.
- **Faithful to Google.** Grouping and typo tolerance, `*`/`$` wildcards,
  longest-pattern precedence (allow wins ties), prefix user-agent matching,
  `MaybeEscapePattern` path canonicalization, and the `index.htm[l]`→`/` Allow
  quirk. Validated against a port of Google's own `robots_test.cc` suite.
- **You own fetching.** Hand it the robots.txt text; it never makes a network
  request, so caching, retries and logging stay under your control.

## Install

```sh
npm install @bruce-clay/robots-txt
```

Requires Node 18+ (uses the global WHATWG `URL`).

## Usage

```ts
import { RobotsTxt } from "@bruce-clay/robots-txt";

// Fetch the text yourself — this library performs no I/O.
const res = await fetch("https://example.com/robots.txt");
const robots = new RobotsTxt(res.ok ? await res.text() : "");

robots.isCrawlAllowed(new URL("https://example.com/private"), "googlebot");
// => false (if disallowed)

robots.isCrawlDisallowed(new URL("https://example.com/"), "my-bot");
// => convenience inverse of isCrawlAllowed

robots.sitemapHrefs;
// => ["https://example.com/sitemap.xml", ...]
```

An empty string (the right thing to pass on a 4xx/5xx or network failure, per
RFC 9309 §2.3.1.3 "unavailable" handling) parses to a robots.txt that allows
everything.

### Matching a specific crawler

The user-agent you pass is matched the way Google matches it: against the
leading `[a-zA-Z_-]` run of the name, case-insensitively, choosing the
longest group token that is a prefix of it. So `"Googlebot-Image"` and
`"Googlebot/2.1"` both resolve to a `User-agent: Googlebot` group, falling back
to the `User-agent: *` group when no specific group matches.

## API

### `new RobotsTxt(content: string)`

Parse robots.txt `content` (already-decoded UTF-8 text).

### `isCrawlAllowed(urlOrPath: URL | string, userAgent: string): boolean`

Whether `userAgent` may crawl the target. Pass either:

- a **`URL`** — its path and query are matched (scheme, host and fragment are
  ignored, matching Google's `GetPathParamsQuery`). The `URL` constructor has
  already percent-encoded the path per RFC 9309, so this is the convenient,
  spec-correct path.
- a **path string** — matched byte-for-byte exactly as Google's reference does
  (you supply it already percent-encoded, the `GetPathParamsQuery` contract).
  Use this when you need Googlebot-identical handling of a path you encoded
  yourself and do not want WHATWG `URL` normalization in the way.

### `isCrawlDisallowed(urlOrPath: URL | string, userAgent: string): boolean`

Inverse of `isCrawlAllowed`.

### `rulesForUserAgent(userAgent: string): RuleGroup | undefined`

The `allow`/`disallow` rule group that actually governs `userAgent`, resolved
the same way `isCrawlAllowed` resolves it: the most specific matching group
(longest user-agent token that is a prefix of the crawler name), else the global
`*` group, else `undefined`. So `rulesForUserAgent("Googlebot-Image")` returns
the `User-agent: Googlebot` group even though it is keyed under `"googlebot"`.
Use it to inspect which rules apply to a crawler; use `isCrawlAllowed` to make a
per-URL decision. The returned object is the live group — treat it as read-only.

```ts
robots.rulesForUserAgent("Googlebot/2.1");
// => { allow: ["/public"], disallow: ["/private", "/tmp"] }
```

### `sitemapHrefs: string[]`

Every `Sitemap:` value found, in file order (sitemaps are global, not scoped to
a user-agent group).

### `ruleGroupByUserAgent: Map<string, RuleGroup>`

The parsed groups, keyed by normalized user-agent token (`"*"` for the global
group). Exposed for inspection; `isCrawlAllowed` is the supported decision path.

## Runtime support

Pure, standard JavaScript — no Node built-ins, no `Buffer`, no filesystem, no
`process`. It uses only `URL`, `TextEncoder`/`TextDecoder`, typed arrays and
regex, which are present in every modern runtime, so it runs unchanged on
**Node 18+, Deno, Bun, Cloudflare Workers / other edge runtimes, and browsers**.
The published package is ESM with bundled `.d.ts`.

## Google-reference fidelity notes

- **Per-line length cap.** Each line is truncated at Google's `8 * 2083` UTF-8
  bytes before parsing (never splitting a code point), matching `robots.cc`.
  Cap the whole document yourself if you also need Google's 500 KiB file limit.
- **URL encoding.** A `URL` argument is compared after WHATWG normalization (the
  RFC-9309-correct form); pass a pre-encoded path string for byte-exact
  Googlebot behavior on a path you encoded yourself.

## License

[Apache-2.0](./LICENSE). Behavioral port of Google's `robots.cc`
(Apache-2.0, Copyright 1999 Google LLC).
