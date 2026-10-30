type RobotsTxtDirective = { key: string; value: string };

/**
 * A parsed robots.txt file and a matcher for crawl decisions.
 *
 * This is a faithful port of Google's reference parser
 * ({@link https://github.com/google/robotstxt | google/robotstxt}, `robots.cc`):
 * the same grouping/typo handling, `*`/`$` matching, longest-pattern precedence
 * (allow wins ties), prefix user-agent matching, `MaybeEscapePattern`
 * canonicalization and the `index.htm[l]`->`/` Allow quirk.
 *
 * It is dependency-free and transport-agnostic: construct it from robots.txt
 * text you fetched yourself, then ask {@link RobotsTxt.isCrawlAllowed}. Fetching,
 * caching and logging are deliberately left to the caller.
 *
 * @example
 * ```ts
 * const robots = new RobotsTxt(await (await fetch(robotsUrl)).text());
 * if (robots.isCrawlAllowed(new URL("https://example.com/page"), "googlebot")) {
 *   // crawl it
 * }
 * ```
 */
export class RobotsTxt {
	private static removeLineComments(line: string): string {
		const commentStartIndex = line.indexOf("#");
		return commentStartIndex === -1 ? line : line.slice(0, commentStartIndex).trim();
	}

	/**
	 * Split a directive line into key/value on the FIRST colon, trimming both
	 * sides — mirrors Google's `GetKeyAndValueFrom`. The whole remainder after the
	 * colon is the value (values may legally contain spaces, e.g. a UA like
	 * "Foo Bar" or a sitemap URL), so we must not stop at the first token.
	 */
	private static parseLineDirective(line: string): RobotsTxtDirective {
		const colonIndex = line.indexOf(":");
		if (colonIndex === -1) {
			return { key: "", value: "" };
		}
		return {
			key: line.slice(0, colonIndex).trim(),
			value: line.slice(colonIndex + 1).trim(),
		};
	}

	/**
	 * Canonicalize a path or pattern the way Google's `MaybeEscapePattern` does:
	 * percent-escape any byte with the high bit set (non-ASCII, as UTF-8 octets)
	 * and upper-case the hex of existing `%xx` escapes. Both the rule patterns and
	 * the URL path are run through this so they compare on the same footing.
	 * https://github.com/google/robotstxt/blob/master/robots.cc (MaybeEscapePattern)
	 */
	private static canonicalizePath(path: string): string {
		let out = "";
		for (let i = 0; i < path.length; i++) {
			const ch = path[i];
			console.assert(ch !== undefined, "index in range", i, path);
			if (
				ch === "%" &&
				RobotsTxt.isHexDigit(path[i + 1]) &&
				RobotsTxt.isHexDigit(path[i + 2])
			) {
				out += "%" + (path[i + 1] ?? "").toUpperCase() + (path[i + 2] ?? "").toUpperCase();
				i += 2;
			} else {
				const code = path.charCodeAt(i);
				// Non-ASCII: emit UTF-8 bytes as %XX (encodeURIComponent gives exactly that).
				out += code > 0x7f ? encodeURIComponent(ch as string).toUpperCase() : (ch as string);
			}
		}
		return out;
	}

	private static isHexDigit(ch: string | undefined): boolean {
		return ch !== undefined && /^[0-9a-fA-F]$/.test(ch);
	}

	/**
	 * Faithful port of Google's `RobotsMatchStrategy::Matches`. Returns true if
	 * `path` matches `pattern`. The pattern is anchored at the start of the path;
	 * `*` matches any run of characters and `$` is special only at the very end of
	 * the pattern (anchors to the end of the path). Everything else is literal and
	 * case-sensitive. https://github.com/google/robotstxt/blob/master/robots.cc
	 */
	private static matches(path: string, pattern: string): boolean {
		const pathLen = path.length;
		// pos[] holds the sorted path offsets reachable by the pattern prefix so far.
		const pos = new Int32Array(pathLen + 1);
		pos[0] = 0;
		let numPos = 1;

		for (let p = 0; p < pattern.length; p++) {
			const pc = pattern[p];
			if (pc === "$" && p + 1 === pattern.length) {
				return pos[numPos - 1] === pathLen;
			}
			if (pc === "*") {
				// From the smallest reachable offset, every larger offset is reachable.
				const start = pos[0] ?? 0;
				numPos = pathLen - start + 1;
				for (let i = 1; i < numPos; i++) {
					pos[i] = (pos[i - 1] ?? 0) + 1;
				}
			} else {
				// Literal char (including a '$' that is not at the end).
				let newNumPos = 0;
				for (let i = 0; i < numPos; i++) {
					const at = pos[i] ?? 0;
					if (at < pathLen && path[at] === pc) {
						pos[newNumPos++] = at + 1;
					}
				}
				numPos = newNumPos;
				if (numPos === 0) return false;
			}
		}
		return true;
	}

	// https://github.com/google/robotstxt/blob/master/robots.cc#L717-L719
	private static readonly validUseragentKeys = new Set([
		"user-agent",
		"useragent",
		"user agent",
	]);
	private static isUserAgentKey(key: string) {
		return RobotsTxt.validUseragentKeys.has(key);
	}

	private static readonly validDisallowKeys = new Set([
		"disallow",
		"dissallow",
		"dissalow",
		"disalow",
		"diasllow",
		"disallaw",
	]);
	private static isDisallowKey(key: string) {
		return RobotsTxt.validDisallowKeys.has(key);
	}

	private static readonly validAllowKeys = new Set(["allow", "alow", "allw"]);
	private static isAllowKey(key: string) {
		return RobotsTxt.validAllowKeys.has(key);
	}

	private static readonly validSitemapKeys = new Set(["sitemap", "site-map"]);
	private static isSitemapKey(key: string) {
		return RobotsTxt.validSitemapKeys.has(key);
	}

	/**
	 * Google truncates each robots.txt line at `8 * 2083` bytes before parsing it
	 * (`kBrowserMaxLineLen * 8` in `robots.cc`). Measured in UTF-8 octets, not
	 * UTF-16 code units, so we count bytes with the universally-available
	 * `TextEncoder`. https://github.com/google/robotstxt/blob/master/robots.cc (Parse)
	 */
	private static readonly maxLineBytes = 8 * 2083;
	private static readonly utf8 = new TextEncoder();

	/** Truncate `line` to at most `maxLineBytes` UTF-8 bytes, never splitting a code point. */
	private static capLineBytes(line: string): string {
		// Fast path: ASCII-or-shorter strings can't exceed the cap (1 byte/char here).
		if (line.length <= RobotsTxt.maxLineBytes) {
			return line;
		}
		const bytes = RobotsTxt.utf8.encode(line);
		if (bytes.length <= RobotsTxt.maxLineBytes) {
			return line;
		}
		// Back off to a code-point boundary: UTF-8 continuation bytes are 0b10xxxxxx.
		let end = RobotsTxt.maxLineBytes;
		while (end > 0 && ((bytes[end] ?? 0) & 0xc0) === 0x80) {
			end--;
		}
		return new TextDecoder().decode(bytes.subarray(0, end));
	}

	/**
	 * Parse robots.txt content. Pass the decoded text you fetched; this class
	 * performs no I/O. Each line is capped at Google's per-line byte limit.
	 */
	constructor(robotsTxtContent: string) {
		const osAgnosticNewline = /\s*[\n\r]+\s*/gu;

		for (const rawLine of robotsTxtContent.split(osAgnosticNewline)) {
			const line = RobotsTxt.capLineBytes(rawLine);
			const withoutComments = RobotsTxt.removeLineComments(line);
			if (withoutComments.length === 0) {
				continue;
			}

			const directive = RobotsTxt.parseLineDirective(withoutComments);
			if (directive.key === "") {
				continue;
			}

			this.addDirective(directive);
		}
	}

	/** Maintains a record of all user-agents and their applicable rules. */
	readonly ruleGroupByUserAgent = new Map<string, RuleGroup>();
	readonly sitemapHrefs: string[] = [];
	readonly #targetedUseragents = new Set<string>();
	private rulesHaveBeenDeclared = false;
	private addDirective({ key, value }: RobotsTxtDirective): void {
		const formattedKey = key.toLowerCase();

		if (RobotsTxt.isUserAgentKey(formattedKey)) {
			// new user agent directive. Google stores the token up to the first
			// non-[a-zA-Z_-] char (ExtractUserAgent), so "Foo Bar" and "Googlebot/2.1"
			// both reduce to their leading name. '*' is the global group and is kept
			// verbatim. Match that when keying the group.
			const trimmed = value.trim();
			const useragent =
				trimmed === "*"
					? "*"
					: (trimmed.match(/^[a-z_-]*/i)?.[0] ?? "").toLowerCase();

			if (this.#targetedUseragents.size > 0 && this.rulesHaveBeenDeclared) {
				this.#targetedUseragents.clear();
				this.rulesHaveBeenDeclared = false;
			}

			this.#targetedUseragents.add(useragent);
			for (const currentUserAgent of this.#targetedUseragents) {
				if (!this.ruleGroupByUserAgent.get(currentUserAgent)) {
					this.ruleGroupByUserAgent.set(currentUserAgent, {
						disallow: [],
						allow: [],
					});
				}
			}
		} else if (RobotsTxt.isDisallowKey(formattedKey)) {
			this.rulesHaveBeenDeclared = true;
			for (const ua of this.#targetedUseragents) {
				const uaRules = this.ruleGroupByUserAgent.get(ua);
				// A group is always created for every targeted UA above before any
				// rule line is processed, so this is an unreachable-invariant guard.
				console.assert(uaRules !== undefined, "RuleGroup missing for UA", ua);
				if (!uaRules) {
					continue;
				}

				uaRules.disallow.push(RobotsTxt.canonicalizePath(value));
			}
		} else if (RobotsTxt.isAllowKey(formattedKey)) {
			this.rulesHaveBeenDeclared = true;
			for (const ua of this.#targetedUseragents) {
				const uaRules = this.ruleGroupByUserAgent.get(ua);
				console.assert(uaRules !== undefined, "RuleGroup missing for UA", ua);
				if (!uaRules) {
					continue;
				}

				uaRules.allow.push(RobotsTxt.canonicalizePath(value));
			}
		} else if (RobotsTxt.isSitemapKey(formattedKey)) {
			this.sitemapHrefs.push(value);
		}
	}

	/**
	 * Match priority of a single pattern against `path`: the pattern's own length
	 * if it matches, else -1 (Google's Match*). An empty pattern matches with
	 * priority 0. `allow` enables Google's `index.htm[l]` quirk, which lives only
	 * on the Allow side of `HandleAllow`: when a pattern ending in a final path
	 * segment of `/index.htm...` does NOT match literally, it is retried as the
	 * directory it names — everything up to and including the last `/`, anchored
	 * with `$` (so `/x/index.html` behaves like `/x/$`).
	 */
	private static matchPriority(path: string, pattern: string, allow: boolean): number {
		if (RobotsTxt.matches(path, pattern)) {
			return pattern.length;
		}
		if (allow) {
			const slashPos = pattern.lastIndexOf("/");
			if (slashPos !== -1 && pattern.slice(slashPos).startsWith("/index.htm")) {
				const rewritten = pattern.slice(0, slashPos + 1) + "$";
				if (RobotsTxt.matches(path, rewritten)) {
					return rewritten.length;
				}
			}
		}
		return -1;
	}

	/**
	 * Highest match priority among a rule list, i.e. the length of the longest
	 * pattern that matches `path`. A non-match contributes nothing; 0 means "only
	 * empty/zero-length matches".
	 */
	private static highestMatchPriority(path: string, patterns: string[], allow: boolean): number {
		let best = 0;
		for (const pattern of patterns) {
			const priority = RobotsTxt.matchPriority(path, pattern, allow);
			if (priority > best) {
				best = priority;
			}
		}
		return best;
	}

	/**
	 * Google matches a crawler to a group whose user-agent token is a
	 * case-insensitive prefix of the crawler name's leading `[a-zA-Z_-]` run, and
	 * picks the longest such token. `*` is the global group and never a specific
	 * match. https://github.com/google/robotstxt/blob/master/robots.cc (HandleUserAgent)
	 */
	private matchSpecificGroup(userAgent: string): RuleGroup | undefined {
		const name = (userAgent.match(/^[a-z_-]*/i)?.[0] ?? "").toLowerCase();
		let best: RuleGroup | undefined;
		let bestLen = -1;
		for (const [token, group] of this.ruleGroupByUserAgent) {
			if (token === "*") continue;
			if (name.startsWith(token) && token.length > bestLen) {
				best = group;
				bestLen = token.length;
			}
		}
		return best;
	}

	/**
	 * The `allow`/`disallow` rule group that actually governs `userAgent`, resolved
	 * exactly as {@link RobotsTxt.isCrawlAllowed} resolves it: the most specific
	 * matching group (longest user-agent-token prefix of the crawler name), else
	 * the global `*` group, else `undefined` when neither exists. So
	 * `rulesForUserAgent("Googlebot-Image")` returns the `User-agent: Googlebot`
	 * group's rules even though it is keyed under `"googlebot"`.
	 *
	 * The returned object is the live group (shared with `ruleGroupByUserAgent`);
	 * treat it as read-only. Use this to inspect which rules apply to a crawler;
	 * use `isCrawlAllowed` to make a per-URL decision.
	 */
	rulesForUserAgent(userAgent: string): RuleGroup | undefined {
		return this.matchSpecificGroup(userAgent) ?? this.ruleGroupByUserAgent.get("*");
	}

	/**
	 * Decide whether `userAgent` may crawl `url`. Faithful port of Google's
	 * `RobotsMatcher::disallow()`: allow wins ties, only priorities strictly > 0
	 * decide (an empty `Disallow:` does not block), and a specific group that was
	 * selected but matched nothing still binds the crawler (returns allowed)
	 * rather than falling through to the `*` group.
	 *
	 * `urlOrPath` may be a WHATWG {@link URL} (its path + query are used, and the
	 * `URL` constructor has already percent-encoded them per RFC 9309) or a raw
	 * path string. A string is matched byte-for-byte as Google's reference does —
	 * i.e. you supply it already percent-encoded, exactly the `GetPathParamsQuery`
	 * contract — so pass a string when you need Googlebot-identical handling of a
	 * path you encoded yourself, and a `URL` for the convenient, RFC-correct case.
	 */
	isCrawlAllowed(urlOrPath: URL | string, userAgent: string): boolean {
		const rawPath =
			typeof urlOrPath === "string" ? urlOrPath : urlOrPath.pathname + urlOrPath.search;
		const path = RobotsTxt.canonicalizePath(rawPath);

		const specific = this.matchSpecificGroup(userAgent);
		if (specific) {
			const allow = RobotsTxt.highestMatchPriority(path, specific.allow, true);
			const disallow = RobotsTxt.highestMatchPriority(path, specific.disallow, false);
			if (allow > 0 || disallow > 0) {
				return disallow <= allow;
			}
			return true;
		}

		const wildcard = this.ruleGroupByUserAgent.get("*");
		if (wildcard) {
			const allow = RobotsTxt.highestMatchPriority(path, wildcard.allow, true);
			const disallow = RobotsTxt.highestMatchPriority(path, wildcard.disallow, false);
			if (allow > 0 || disallow > 0) {
				return disallow <= allow;
			}
		}

		// No applicable rules, assume crawlable.
		return true;
	}

	isCrawlDisallowed(urlOrPath: URL | string, userAgent: string): boolean {
		return !this.isCrawlAllowed(urlOrPath, userAgent);
	}
}

export interface RuleGroup {
	disallow: string[];
	allow: string[];
}
