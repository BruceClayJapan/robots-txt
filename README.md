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

### `isCrawlAllowed(url: URL, userAgent: string): boolean`

Whether `userAgent` may crawl `url`. Pass a parsed `URL`; only its path and
query participate in matching (scheme, host and fragment are ignored, matching
Google's `GetPathParamsQuery`). The caller is responsible for percent-encoding
the URL, which the WHATWG `URL` constructor already does.

### `isCrawlDisallowed(url: URL, userAgent: string): boolean`

Inverse of `isCrawlAllowed`.

### `sitemapHrefs: string[]`

Every `Sitemap:` value found, in file order (sitemaps are global, not scoped to
a user-agent group).

### `ruleGroupByUserAgent: Map<string, RuleGroup>`

The parsed groups, keyed by normalized user-agent token (`"*"` for the global
group). Exposed for inspection; `isCrawlAllowed` is the supported decision path.

## Known divergences from Google's C++ reference

- **URL encoding.** Google treats the caller's URL as pre-encoded and does not
  re-encode raw non-ASCII, whereas the WHATWG `URL` you pass here has already
  normalized it (e.g. `ツ` → `%E3%83%84`). This is the RFC-9309-correct
  comparison and only differs for callers who deliberately pass a raw,
  unencoded path.
- **Per-line length cap.** Google truncates each line at `8 * 2083` bytes. This
  library does not cap line length; cap the whole document yourself before
  parsing if you need Google's exact behavior (Google ignores content past
  500 KiB).

## License

[Apache-2.0](./LICENSE). Behavioral port of Google's `robots.cc`
(Apache-2.0, Copyright 1999 Google LLC).
