import assert from "node:assert/strict";
import { suite, test } from "node:test";

import { RobotsTxt } from "./RobotsTxt.ts";

const exampleRobots = `# some comment
User-agent: Amazonbot
Disallow: /

User-agent: Applebot-Extended
Disallow: /

User-agent: ClaudeBot
Disallow: /

User-agent: Google-Extended
Disallow: /

User-agent: GPTBot
Disallow: /

User-agent: PetalBot
Disallow: /

User-agent: viberbot
Disallow: /

User-agent: YaK
Disallow: /

User-agent: Yandex
Disallow: /

User-agent: Applebot
Disallow: /*/plugins/*
Disallow: /?*next=
Disallow: /a/bz?
Disallow: /ajax/
Disallow: /album.php
Disallow: /checkpoint/
Disallow: /contact_importer/
Disallow: /dialog/
Disallow: /fbml/ajax/dialog/
Disallow: /feeds/
Disallow: /file_download.php
Disallow: /job_application/
Disallow: /l.php
Disallow: /login.php*&next=
Disallow: /login.php/?next=
Disallow: /login.php?next=
Disallow: /login/*&next=
Disallow: /login/?next=
Disallow: /login/device-based/regular/login/*&next=
Disallow: /login/device-based/regular/login/?next=
Disallow: /moments_app/
Disallow: /p.php
Disallow: /photos.php
Disallow: /plugins/
Disallow: /share.php
Disallow: /share/
Disallow: /sharer.php
Disallow: /sharer/
Disallow: /tr/
Disallow: /tr?
Disallow: /ufi/reaction/profile/browser/
Disallow: /x/oauth/
Allow: /ajax/bootloader-endpoint/
Allow: /ajax/pagelet/generic.php/PagePostsSectionPagelet
Allow: /careers/
Allow: /safetycheck/

User-agent: Bingbot
Disallow: /*/plugins/*
Disallow: /?*next=
Disallow: /a/bz?
Disallow: /ajax/
Disallow: /album.php
Disallow: /checkpoint/
Disallow: /contact_importer/
Disallow: /dialog/
Disallow: /fbml/ajax/dialog/
Disallow: /feeds/
Disallow: /file_download.php
Disallow: /job_application/
Disallow: /l.php
Disallow: /login.php*&next=
Disallow: /login.php/?next=
Disallow: /login.php?next=
Disallow: /login/*&next=
Disallow: /login/?next=
Disallow: /login/device-based/regular/login/*&next=
Disallow: /login/device-based/regular/login/?next=
Disallow: /moments_app/
Disallow: /p.php
Disallow: /photos.php
Disallow: /plugins/
Disallow: /share.php
Disallow: /share/
Disallow: /sharer.php
Disallow: /sharer/
Disallow: /tr/
Disallow: /tr?
Disallow: /ufi/reaction/profile/browser/
Disallow: /x/oauth/
Allow: /ajax/bootloader-endpoint/
Allow: /ajax/pagelet/generic.php/PagePostsSectionPagelet
Allow: /careers/
Allow: /safetycheck/

User-agent: Discordbot
Disallow: /*/plugins/*
Disallow: /?*next=
Disallow: /a/bz?
Disallow: /ajax/
Disallow: /album.php
Disallow: /checkpoint/
Disallow: /contact_importer/
Disallow: /dialog/
Disallow: /fbml/ajax/dialog/
Disallow: /feeds/
Disallow: /file_download.php
Disallow: /job_application/
Disallow: /l.php
Disallow: /login.php*&next=
Disallow: /login.php/?next=
Disallow: /login.php?next=
Disallow: /login/*&next=
Disallow: /login/?next=
Disallow: /login/device-based/regular/login/*&next=
Disallow: /login/device-based/regular/login/?next=
Disallow: /moments_app/
Disallow: /p.php
Disallow: /photos.php
Disallow: /plugins/
Disallow: /share.php
Disallow: /share/
Disallow: /sharer.php
Disallow: /sharer/
Disallow: /tr/
Disallow: /tr?
Disallow: /ufi/reaction/profile/browser/
Disallow: /x/oauth/
Allow: /ajax/bootloader-endpoint/
Allow: /ajax/pagelet/generic.php/PagePostsSectionPagelet
Allow: /careers/
Allow: /safetycheck/

User-agent: DuckDuckBot
Disallow: /*/plugins/*
Disallow: /?*next=
Disallow: /a/bz?
Disallow: /ajax/
Disallow: /album.php
Disallow: /checkpoint/
Disallow: /contact_importer/
Disallow: /dialog/
Disallow: /fbml/ajax/dialog/
Disallow: /feeds/
Disallow: /file_download.php
Disallow: /job_application/
Disallow: /l.php
Disallow: /login.php*&next=
Disallow: /login.php/?next=
Disallow: /login.php?next=
Disallow: /login/*&next=
Disallow: /login/?next=
Disallow: /login/device-based/regular/login/*&next=
Disallow: /login/device-based/regular/login/?next=
Disallow: /moments_app/
Disallow: /p.php
Disallow: /photos.php
Disallow: /plugins/
Disallow: /share.php
Disallow: /share/
Disallow: /sharer.php
Disallow: /sharer/
Disallow: /tr/
Disallow: /tr?
Disallow: /ufi/reaction/profile/browser/
Disallow: /x/oauth/
Allow: /ajax/bootloader-endpoint/
Allow: /ajax/pagelet/generic.php/PagePostsSectionPagelet
Allow: /careers/
Allow: /safetycheck/

User-agent: facebookexternalhit
Disallow: /*/plugins/*
Disallow: /?*next=
Disallow: /a/bz?
Disallow: /ajax/
Disallow: /album.php
Disallow: /checkpoint/
Disallow: /contact_importer/
Disallow: /dialog/
Disallow: /fbml/ajax/dialog/
Disallow: /feeds/
Disallow: /file_download.php
Disallow: /job_application/
Disallow: /l.php
Disallow: /login.php*&next=
Disallow: /login.php/?next=
Disallow: /login.php?next=
Disallow: /login/*&next=
Disallow: /login/?next=
Disallow: /login/device-based/regular/login/*&next=
Disallow: /login/device-based/regular/login/?next=
Disallow: /moments_app/
Disallow: /p.php
Disallow: /photos.php
Disallow: /plugins/
Disallow: /share.php
Disallow: /share/
Disallow: /sharer.php
Disallow: /sharer/
Disallow: /tr/
Disallow: /tr?
Disallow: /ufi/reaction/profile/browser/
Disallow: /x/oauth/
Allow: /ajax/bootloader-endpoint/
Allow: /ajax/pagelet/generic.php/PagePostsSectionPagelet
Allow: /careers/
Allow: /safetycheck/

User-agent: Googlebot
Disallow: /*/plugins/*
Disallow: /?*next=
Disallow: /a/bz?
Disallow: /ajax/
Disallow: /album.php
Disallow: /checkpoint/
Disallow: /contact_importer/
Disallow: /dialog/
Disallow: /fbml/ajax/dialog/
Disallow: /feeds/
Disallow: /file_download.php
Disallow: /job_application/
Disallow: /l.php
Disallow: /login.php*&next=
Disallow: /login.php/?next=
Disallow: /login.php?next=
Disallow: /login/*&next=
Disallow: /login/?next=
Disallow: /login/device-based/regular/login/*&next=
Disallow: /login/device-based/regular/login/?next=
Disallow: /moments_app/
Disallow: /p.php
Disallow: /photos.php
Disallow: /plugins/
Disallow: /share.php
Disallow: /share/
Disallow: /sharer.php
Disallow: /sharer/
Disallow: /tr/
Disallow: /tr?
Disallow: /ufi/reaction/profile/browser/
Disallow: /x/oauth/
Allow: /ajax/bootloader-endpoint/
Allow: /ajax/pagelet/generic.php/PagePostsSectionPagelet
Allow: /careers/
Allow: /safetycheck/

User-agent: Googlebot-Image
Disallow: /*/plugins/*
Disallow: /?*next=
Disallow: /a/bz?
Disallow: /ajax/
Disallow: /album.php
Disallow: /checkpoint/
Disallow: /contact_importer/
Disallow: /dialog/
Disallow: /fbml/ajax/dialog/
Disallow: /feeds/
Disallow: /file_download.php
Disallow: /job_application/
Disallow: /l.php
Disallow: /login.php*&next=
Disallow: /login.php/?next=
Disallow: /login.php?next=
Disallow: /login/*&next=
Disallow: /login/?next=
Disallow: /login/device-based/regular/login/*&next=
Disallow: /login/device-based/regular/login/?next=
Disallow: /map_tile.php
Disallow: /moments_app/
Disallow: /p.php
Disallow: /photos.php
Disallow: /plugins/
Disallow: /share.php
Disallow: /share/
Disallow: /sharer.php
Disallow: /sharer/
Disallow: /static_map.php
Disallow: /tr/
Disallow: /tr?
Disallow: /ufi/reaction/profile/browser/
Disallow: /x/oauth/
Allow: /ajax/bootloader-endpoint/
Allow: /ajax/pagelet/generic.php/PagePostsSectionPagelet
Allow: /careers/
Allow: /safetycheck/

User-agent: LinkedInBot
Disallow: /*/plugins/*
Disallow: /?*next=
Disallow: /a/bz?
Disallow: /ajax/
Disallow: /album.php
Disallow: /checkpoint/
Disallow: /contact_importer/
Disallow: /dialog/
Disallow: /fbml/ajax/dialog/
Disallow: /feeds/
Disallow: /file_download.php
Disallow: /job_application/
Disallow: /l.php
Disallow: /login.php*&next=
Disallow: /login.php/?next=
Disallow: /login.php?next=
Disallow: /login/*&next=
Disallow: /login/?next=
Disallow: /login/device-based/regular/login/*&next=
Disallow: /login/device-based/regular/login/?next=
Disallow: /moments_app/
Disallow: /p.php
Disallow: /photos.php
Disallow: /plugins/
Disallow: /share.php
Disallow: /share/
Disallow: /sharer.php
Disallow: /sharer/
Disallow: /tr/
Disallow: /tr?
Disallow: /ufi/reaction/profile/browser/
Disallow: /x/oauth/
Allow: /ajax/bootloader-endpoint/
Allow: /ajax/pagelet/generic.php/PagePostsSectionPagelet
Allow: /careers/
Allow: /safetycheck/

User-agent: msnbot
Disallow: /*/plugins/*
Disallow: /?*next=
Disallow: /a/bz?
Disallow: /ajax/
Disallow: /album.php
Disallow: /checkpoint/
Disallow: /contact_importer/
Disallow: /dialog/
Disallow: /fbml/ajax/dialog/
Disallow: /feeds/
Disallow: /file_download.php
Disallow: /job_application/
Disallow: /l.php
Disallow: /login.php*&next=
Disallow: /login.php/?next=
Disallow: /login.php?next=
Disallow: /login/*&next=
Disallow: /login/?next=
Disallow: /login/device-based/regular/login/*&next=
Disallow: /login/device-based/regular/login/?next=
Disallow: /moments_app/
Disallow: /p.php
Disallow: /photos.php
Disallow: /plugins/
Disallow: /share.php
Disallow: /share/
Disallow: /sharer.php
Disallow: /sharer/
Disallow: /tr/
Disallow: /tr?
Disallow: /ufi/reaction/profile/browser/
Disallow: /x/oauth/
Allow: /ajax/bootloader-endpoint/
Allow: /ajax/pagelet/generic.php/PagePostsSectionPagelet
Allow: /careers/
Allow: /safetycheck/

User-agent: Naverbot
Disallow: /*/plugins/*
Disallow: /?*next=
Disallow: /a/bz?
Disallow: /ajax/
Disallow: /album.php
Disallow: /checkpoint/
Disallow: /contact_importer/
Disallow: /dialog/
Disallow: /fbml/ajax/dialog/
Disallow: /feeds/
Disallow: /file_download.php
Disallow: /job_application/
Disallow: /l.php
Disallow: /login.php*&next=
Disallow: /login.php/?next=
Disallow: /login.php?next=
Disallow: /login/*&next=
Disallow: /login/?next=
Disallow: /login/device-based/regular/login/*&next=
Disallow: /login/device-based/regular/login/?next=
Disallow: /moments_app/
Disallow: /p.php
Disallow: /photos.php
Disallow: /plugins/
Disallow: /share.php
Disallow: /share/
Disallow: /sharer.php
Disallow: /sharer/
Disallow: /tr/
Disallow: /tr?
Disallow: /ufi/reaction/profile/browser/
Disallow: /x/oauth/
Allow: /ajax/bootloader-endpoint/
Allow: /ajax/pagelet/generic.php/PagePostsSectionPagelet
Allow: /careers/
Allow: /safetycheck/

User-agent: Pinterestbot
Disallow: /*/plugins/*
Disallow: /?*next=
Disallow: /a/bz?
Disallow: /ajax/
Disallow: /album.php
Disallow: /checkpoint/
Disallow: /contact_importer/
Disallow: /dialog/
Disallow: /fbml/ajax/dialog/
Disallow: /feeds/
Disallow: /file_download.php
Disallow: /job_application/
Disallow: /l.php
Disallow: /login.php*&next=
Disallow: /login.php/?next=
Disallow: /login.php?next=
Disallow: /login/*&next=
Disallow: /login/?next=
Disallow: /login/device-based/regular/login/*&next=
Disallow: /login/device-based/regular/login/?next=
Disallow: /moments_app/
Disallow: /p.php
Disallow: /photos.php
Disallow: /plugins/
Disallow: /share.php
Disallow: /share/
Disallow: /sharer.php
Disallow: /sharer/
Disallow: /tr/
Disallow: /tr?
Disallow: /ufi/reaction/profile/browser/
Disallow: /x/oauth/
Allow: /ajax/bootloader-endpoint/
Allow: /ajax/pagelet/generic.php/PagePostsSectionPagelet
Allow: /careers/
Allow: /safetycheck/

User-agent: Screaming Frog SEO Spider
Disallow: /*/plugins/*
Disallow: /?*next=
Disallow: /a/bz?
Disallow: /ajax/
Disallow: /album.php
Disallow: /checkpoint/
Disallow: /contact_importer/
Disallow: /dialog/
Disallow: /fbml/ajax/dialog/
Disallow: /feeds/
Disallow: /file_download.php
Disallow: /job_application/
Disallow: /l.php
Disallow: /login.php*&next=
Disallow: /login.php/?next=
Disallow: /login.php?next=
Disallow: /login/*&next=
Disallow: /login/?next=
Disallow: /login/device-based/regular/login/*&next=
Disallow: /login/device-based/regular/login/?next=
Disallow: /moments_app/
Disallow: /p.php
Disallow: /photos.php
Disallow: /plugins/
Disallow: /share.php
Disallow: /share/
Disallow: /sharer.php
Disallow: /sharer/
Disallow: /tr/
Disallow: /tr?
Disallow: /ufi/reaction/profile/browser/
Disallow: /x/oauth/
Allow: /ajax/bootloader-endpoint/
Allow: /ajax/pagelet/generic.php/PagePostsSectionPagelet
Allow: /careers/
Allow: /safetycheck/

User-agent: seznambot
Disallow: /*/plugins/*
Disallow: /?*next=
Disallow: /a/bz?
Disallow: /ajax/
Disallow: /album.php
Disallow: /checkpoint/
Disallow: /contact_importer/
Disallow: /dialog/
Disallow: /fbml/ajax/dialog/
Disallow: /feeds/
Disallow: /file_download.php
Disallow: /job_application/
Disallow: /l.php
Disallow: /login.php*&next=
Disallow: /login.php/?next=
Disallow: /login.php?next=
Disallow: /login/*&next=
Disallow: /login/?next=
Disallow: /login/device-based/regular/login/*&next=
Disallow: /login/device-based/regular/login/?next=
Disallow: /moments_app/
Disallow: /p.php
Disallow: /photos.php
Disallow: /plugins/
Disallow: /share.php
Disallow: /share/
Disallow: /sharer.php
Disallow: /sharer/
Disallow: /tr/
Disallow: /tr?
Disallow: /ufi/reaction/profile/browser/
Disallow: /x/oauth/
Allow: /ajax/bootloader-endpoint/
Allow: /ajax/pagelet/generic.php/PagePostsSectionPagelet
Allow: /careers/
Allow: /safetycheck/

User-agent: Slurp
Disallow: /*/plugins/*
Disallow: /?*next=
Disallow: /a/bz?
Disallow: /ajax/
Disallow: /album.php
Disallow: /checkpoint/
Disallow: /contact_importer/
Disallow: /dialog/
Disallow: /fbml/ajax/dialog/
Disallow: /feeds/
Disallow: /file_download.php
Disallow: /job_application/
Disallow: /l.php
Disallow: /login.php*&next=
Disallow: /login.php/?next=
Disallow: /login.php?next=
Disallow: /login/*&next=
Disallow: /login/?next=
Disallow: /login/device-based/regular/login/*&next=
Disallow: /login/device-based/regular/login/?next=
Disallow: /moments_app/
Disallow: /p.php
Disallow: /photos.php
Disallow: /plugins/
Disallow: /share.php
Disallow: /share/
Disallow: /sharer.php
Disallow: /sharer/
Disallow: /tr/
Disallow: /tr?
Disallow: /ufi/reaction/profile/browser/
Disallow: /x/oauth/
Allow: /ajax/bootloader-endpoint/
Allow: /ajax/pagelet/generic.php/PagePostsSectionPagelet
Allow: /careers/
Allow: /safetycheck/

User-agent: teoma
Disallow: /*/plugins/*
Disallow: /?*next=
Disallow: /a/bz?
Disallow: /ajax/
Disallow: /album.php
Disallow: /checkpoint/
Disallow: /contact_importer/
Disallow: /dialog/
Disallow: /fbml/ajax/dialog/
Disallow: /feeds/
Disallow: /file_download.php
Disallow: /job_application/
Disallow: /l.php
Disallow: /login.php*&next=
Disallow: /login.php/?next=
Disallow: /login.php?next=
Disallow: /login/*&next=
Disallow: /login/?next=
Disallow: /login/device-based/regular/login/*&next=
Disallow: /login/device-based/regular/login/?next=
Disallow: /moments_app/
Disallow: /p.php
Disallow: /photos.php
Disallow: /plugins/
Disallow: /share.php
Disallow: /share/
Disallow: /sharer.php
Disallow: /sharer/
Disallow: /tr/
Disallow: /tr?
Disallow: /ufi/reaction/profile/browser/
Disallow: /x/oauth/
Allow: /ajax/bootloader-endpoint/
Allow: /ajax/pagelet/generic.php/PagePostsSectionPagelet
Allow: /careers/
Allow: /safetycheck/

User-agent: TelegramBot
Disallow: /*/plugins/*
Disallow: /?*next=
Disallow: /a/bz?
Disallow: /ajax/
Disallow: /album.php
Disallow: /checkpoint/
Disallow: /contact_importer/
Disallow: /dialog/
Disallow: /fbml/ajax/dialog/
Disallow: /feeds/
Disallow: /file_download.php
Disallow: /job_application/
Disallow: /l.php
Disallow: /login.php*&next=
Disallow: /login.php/?next=
Disallow: /login.php?next=
Disallow: /login/*&next=
Disallow: /login/?next=
Disallow: /login/device-based/regular/login/*&next=
Disallow: /login/device-based/regular/login/?next=
Disallow: /moments_app/
Disallow: /p.php
Disallow: /photos.php
Disallow: /plugins/
Disallow: /share.php
Disallow: /share/
Disallow: /sharer.php
Disallow: /sharer/
Disallow: /tr/
Disallow: /tr?
Disallow: /ufi/reaction/profile/browser/
Disallow: /x/oauth/
Allow: /ajax/bootloader-endpoint/
Allow: /ajax/pagelet/generic.php/PagePostsSectionPagelet
Allow: /careers/
Allow: /safetycheck/

User-agent: Twitterbot
Disallow: /*/plugins/*
Disallow: /?*next=
Disallow: /a/bz?
Disallow: /ajax/
Disallow: /album.php
Disallow: /checkpoint/
Disallow: /contact_importer/
Disallow: /dialog/
Disallow: /fbml/ajax/dialog/
Disallow: /feeds/
Disallow: /file_download.php
Disallow: /job_application/
Disallow: /l.php
Disallow: /login.php*&next=
Disallow: /login.php/?next=
Disallow: /login.php?next=
Disallow: /login/*&next=
Disallow: /login/?next=
Disallow: /login/device-based/regular/login/*&next=
Disallow: /login/device-based/regular/login/?next=
Disallow: /moments_app/
Disallow: /p.php
Disallow: /photos.php
Disallow: /plugins/
Disallow: /share.php
Disallow: /share/
Disallow: /sharer.php
Disallow: /sharer/
Disallow: /tr/
Disallow: /tr?
Disallow: /ufi/reaction/profile/browser/
Disallow: /x/oauth/
Allow: /ajax/bootloader-endpoint/
Allow: /ajax/pagelet/generic.php/PagePostsSectionPagelet
Allow: /careers/
Allow: /safetycheck/

User-agent: Yeti
Disallow: /*/plugins/*
Disallow: /?*next=
Disallow: /a/bz?
Disallow: /ajax/
Disallow: /album.php
Disallow: /checkpoint/
Disallow: /contact_importer/
Disallow: /dialog/
Disallow: /fbml/ajax/dialog/
Disallow: /feeds/
Disallow: /file_download.php
Disallow: /job_application/
Disallow: /l.php
Disallow: /login.php*&next=
Disallow: /login.php/?next=
Disallow: /login.php?next=
Disallow: /login/*&next=
Disallow: /login/?next=
Disallow: /login/device-based/regular/login/*&next=
Disallow: /login/device-based/regular/login/?next=
Disallow: /moments_app/
Disallow: /p.php
Disallow: /photos.php
Disallow: /plugins/
Disallow: /share.php
Disallow: /share/
Disallow: /sharer.php
Disallow: /sharer/
Disallow: /tr/
Disallow: /tr?
Disallow: /ufi/reaction/profile/browser/
Disallow: /x/oauth/
Allow: /ajax/bootloader-endpoint/
Allow: /ajax/pagelet/generic.php/PagePostsSectionPagelet
Allow: /careers/
Allow: /safetycheck/

User-agent: *
Disallow: /

User-agent: *
Disallow: /lite
Disallow: /html

# No search result pages
Disallow: /*?

# chrome new tab page
Disallow: /chrome_newtab

User-agent: ia_archiver
Disallow: /

User-agent: googlebot
Disallow:

User-agent: test_one
User-agent: test_two
Disallow: /

User-agent: repeated-user-agent
Disallow: /disallowed/
Disallow: /stay-the-hell-outta-here
Disallow: /allowed-and-disallowed
User-agent: repeated-user-agent
Allow: /allowed/
Allow: /welcome-to-allowed/
Allow: /allowed-and-disallowed/

sitemap: https://duckduckgo.com/sitemap.xml
sitemap: https://bing.com/sitemap.xml
`;

const robo = new RobotsTxt(exampleRobots);
const twinUserAgentOne = robo.ruleGroupByUserAgent.get("test_one");
const twinUserAgentTwo = robo.ruleGroupByUserAgent.get("test_two");

suite("RobotsTxt", { timeout: 3_000 }, () => {
	test("parses sitemaps", () => {
		assert(robo.sitemapHrefs.includes("https://duckduckgo.com/sitemap.xml"));
		assert(robo.sitemapHrefs.includes("https://bing.com/sitemap.xml"));
	});

	test("parses user agents", () => {
		assert(robo.ruleGroupByUserAgent.get("*"));
		assert(robo.ruleGroupByUserAgent.get("ia_archiver"));
		assert(robo.ruleGroupByUserAgent.get("test_one"));
		assert(robo.ruleGroupByUserAgent.get("test_two"));
		assert(robo.ruleGroupByUserAgent.get("repeated-user-agent"));
	});

	test("rulesForUserAgent resolves the effective group", () => {
		const r = new RobotsTxt(
			"User-agent: Googlebot\nDisallow: /g\n\n" +
				"User-agent: *\nDisallow: /all\n",
		);
		// Prefix match: "Googlebot-Image" resolves to the Googlebot group.
		assert.deepEqual(r.rulesForUserAgent("Googlebot-Image"), {
			allow: [],
			disallow: ["/g"],
		});
		// Same group regardless of a version suffix.
		assert.equal(r.rulesForUserAgent("Googlebot/2.1"), r.rulesForUserAgent("googlebot"));
		// No specific match falls back to the global "*" group.
		assert.deepEqual(r.rulesForUserAgent("SomeOtherBot"), {
			allow: [],
			disallow: ["/all"],
		});
		// Neither specific nor "*" -> undefined.
		const onlySpecific = new RobotsTxt("User-agent: FooBot\nDisallow: /x\n");
		assert.equal(onlySpecific.rulesForUserAgent("BarBot"), undefined);
	});

	const exampleUrl = new URL("http://example.com/");

	test("parses blank rules", () => {
		assert(robo.isCrawlAllowed(exampleUrl, "googlebot"));
	});

	test("parses multi user agent rules", () => {
		assert(robo.isCrawlDisallowed(exampleUrl, "test_one"));
		assert(robo.isCrawlDisallowed(exampleUrl, "test_two"));
	});

	test("combines repeated user agents", () => {
		const ruleGroup = robo.ruleGroupByUserAgent.get("repeated-user-agent");

		if (!ruleGroup) {
			throw new Error("Missing rule group.");
		}

		const { allow, disallow } = ruleGroup;

		assert.equal(allow.length, 3);
		assert.equal(disallow.length, 3);
		assert.equal(allow.length, disallow.length);
	});

	test("correctly disallows URLs", () => {
		assert(
			robo.isCrawlDisallowed(
				new URL("http://example.com/disallowed/"),
				"repeated-user-agent",
			),
		);
		assert(
			robo.isCrawlDisallowed(
				new URL("http://example.com/stay-the-hell-outta-here/"),
				"repeated-user-agent",
			),
		);
		assert(
			robo.isCrawlDisallowed(
				new URL("http://www.facebook.com/tr/?somecookie=3"),
				"googlebot",
			),
		);
	});

	test("correctly allows URLs", () => {
		assert(
			robo.isCrawlAllowed(
				new URL("http://example.com/allowed/"),
				"repeated-user-agent",
			),
		);
		assert(
			robo.isCrawlAllowed(
				new URL("http://example.com/welcome-to-allowed/"),
				"repeated-user-agent",
			),
		);
	});

	test("correctly allows conflicting rule", () => {
		assert(
			robo.isCrawlAllowed(
				new URL("http://example.com/allowed-and-disallowed/"),
				"repeated-user-agent",
			),
		);
	});

	test("correctly sets sequential user agents", () => {
		assert(twinUserAgentOne);
		assert(twinUserAgentTwo);
	});

	test("correctly adds rules to grouped user agents", () => {
		const agent1DisallowLength = twinUserAgentOne?.disallow.length;

		assert(agent1DisallowLength && agent1DisallowLength >= 0);

		const agent2DisallowLength = twinUserAgentOne?.disallow.length;

		assert(agent2DisallowLength && agent2DisallowLength >= 0);
	});

	// Cases that diverged from Google's reference matcher under the old RE2
	// translation; each asserts the Google-correct outcome.
	suite("matches Google's reference parser", () => {
		test("precedence uses pattern length, not matched-URL length", () => {
			// Google: Disallow:/folder/ (len 8) beats Allow:/*.php (len 6) -> disallowed.
			const r = new RobotsTxt("User-agent: *\nAllow: /*.php\nDisallow: /folder/");
			assert(
				r.isCrawlDisallowed(new URL("http://e.com/folder/file.php"), "bot"),
			);
		});

		test("$ anchors to end of path", () => {
			const r = new RobotsTxt("User-agent: *\nDisallow: /*.php$");
			assert(r.isCrawlDisallowed(new URL("http://e.com/a.php"), "bot"));
			// $ means the path must END here: query string after .php is not matched.
			assert(r.isCrawlAllowed(new URL("http://e.com/a.php?x=1"), "bot"));
			assert(r.isCrawlAllowed(new URL("http://e.com/a.phpx"), "bot"));
		});

		test("paths are case-sensitive", () => {
			const r = new RobotsTxt("User-agent: *\nDisallow: /Admin/");
			assert(r.isCrawlDisallowed(new URL("http://e.com/Admin/"), "bot"));
			assert(r.isCrawlAllowed(new URL("http://e.com/admin/"), "bot"));
		});

		test("multiple wildcards in one rule", () => {
			const r = new RobotsTxt("User-agent: *\nDisallow: /*/plugins/*");
			assert(r.isCrawlDisallowed(new URL("http://e.com/a/plugins/x"), "bot"));
			assert(r.isCrawlAllowed(new URL("http://e.com/plugins/"), "bot"));
		});

		test("rules match a path prefix, not a substring", () => {
			const r = new RobotsTxt("User-agent: *\nDisallow: /foo");
			assert(r.isCrawlDisallowed(new URL("http://e.com/foo"), "bot"));
			assert(r.isCrawlDisallowed(new URL("http://e.com/foobar"), "bot"));
			// /foo appears mid-path but the pattern is anchored at the start.
			assert(r.isCrawlAllowed(new URL("http://e.com/bar/foo"), "bot"));
		});

		test("user-agent group matches by prefix of crawler name", () => {
			const r = new RobotsTxt("User-agent: Googlebot\nDisallow: /x\n");
			// Googlebot-Image / Googlebot/2.1 fall into the Googlebot group.
			assert(r.isCrawlDisallowed(new URL("http://e.com/x"), "Googlebot-Image"));
			assert(r.isCrawlDisallowed(new URL("http://e.com/x"), "Googlebot/2.1"));
		});

		test("allow wins ties against an equal-length disallow", () => {
			const r = new RobotsTxt("User-agent: *\nDisallow: /p\nAllow: /p");
			assert(r.isCrawlAllowed(new URL("http://e.com/p"), "bot"));
		});
	});

	// Behavioral tests ported from Google's robots_test.cc
	// (https://github.com/google/robotstxt/blob/master/robots_test.cc). Each
	// IsUserAgentAllowed(txt, ua, url) becomes
	// new RobotsTxt(txt).isCrawlAllowed(new URL(url), ua). Tests that exercise
	// Google internals we do not expose (per-line parse callbacks, the 8*2083
	// line cap, GetPathParamsQuery on raw URL strings) are intentionally not
	// ported; see the notes on the skipped cases below.
	suite("ported from Google robots_test.cc", () => {
		const allowed = (txt: string, ua: string, url: string): boolean =>
			new RobotsTxt(txt).isCrawlAllowed(new URL(url), ua);

		test("GoogleOnly_SystemTest", () => {
			const txt = "user-agent: FooBot\ndisallow: /\n";
			// Empty robots.txt: everything allowed.
			assert(allowed("", "FooBot", "http://foo.bar/x/y"));
			// Empty user-agent: falls through to no matching group -> allowed.
			assert(allowed(txt, "", "http://foo.bar/x/y"));
			// Matching agent, disallow-all.
			assert(!allowed(txt, "FooBot", "http://foo.bar/x/y"));
		});

		test("ID_LineSyntax_Line", () => {
			const correct = "user-agent: FooBot\ndisallow: /\n";
			const incorrect = "foo: FooBot\nbar: /\n";
			const url = "http://foo.bar/x/y";
			assert(!allowed(correct, "FooBot", url));
			// Unknown directives -> no rules -> allowed.
			assert(allowed(incorrect, "FooBot", url));
			// NOTE: Google also accepts a missing colon ("user-agent FooBot") via a
			// whitespace-separator fallback. Our parser requires the colon, so that
			// variant is a known divergence and is not asserted.
		});

		test("ID_LineSyntax_Groups", () => {
			const txt =
				"allow: /foo/bar/\n\n" +
				"user-agent: FooBot\ndisallow: /\nallow: /x/\n" +
				"user-agent: BarBot\ndisallow: /\nallow: /y/\n\n\n" +
				"allow: /w/\n" +
				"user-agent: BazBot\n\n" +
				"user-agent: FooBot\nallow: /z/\ndisallow: /\n";
			assert(allowed(txt, "FooBot", "http://foo.bar/x/b"));
			assert(allowed(txt, "FooBot", "http://foo.bar/z/d"));
			assert(!allowed(txt, "FooBot", "http://foo.bar/y/c"));
			assert(allowed(txt, "BarBot", "http://foo.bar/y/c"));
			assert(allowed(txt, "BarBot", "http://foo.bar/w/a"));
			assert(!allowed(txt, "BarBot", "http://foo.bar/z/d"));
			assert(allowed(txt, "BazBot", "http://foo.bar/z/d"));
			// Lines with rules outside a group are ignored.
			assert(!allowed(txt, "FooBot", "http://foo.bar/foo/bar/"));
			assert(!allowed(txt, "BarBot", "http://foo.bar/foo/bar/"));
			assert(!allowed(txt, "BazBot", "http://foo.bar/foo/bar/"));
		});

		test("ID_LineSyntax_Groups_OtherRules", () => {
			// A sitemap / unknown line must not close a group.
			const withSitemap =
				"User-agent: BarBot\nSitemap: https://foo.bar/sitemap\n" +
				"User-agent: *\nDisallow: /\n";
			assert(!allowed(withSitemap, "FooBot", "http://foo.bar/"));
			assert(!allowed(withSitemap, "BarBot", "http://foo.bar/"));

			const withUnknown =
				"User-agent: FooBot\nInvalid-Unknown-Line: unknown\n" +
				"User-agent: *\nDisallow: /\n";
			assert(!allowed(withUnknown, "FooBot", "http://foo.bar/"));
			assert(!allowed(withUnknown, "BarBot", "http://foo.bar/"));
		});

		test("ID_REPLineNamesCaseInsensitive", () => {
			const variants = [
				"USER-AGENT: FooBot\nALLOW: /x/\nDISALLOW: /\n",
				"user-agent: FooBot\nallow: /x/\ndisallow: /\n",
				"uSeR-aGeNt: FooBot\nAlLoW: /x/\ndIsAlLoW: /\n",
			];
			for (const txt of variants) {
				assert(allowed(txt, "FooBot", "http://foo.bar/x/y"));
				assert(!allowed(txt, "FooBot", "http://foo.bar/a/b"));
			}
		});

		test("ID_UserAgentValueCaseInsensitive", () => {
			const variants = [
				"User-Agent: FOO BAR\nAllow: /x/\nDisallow: /\n",
				"User-Agent: foo bar\nAllow: /x/\nDisallow: /\n",
				"User-Agent: FoO bAr\nAllow: /x/\nDisallow: /\n",
			];
			// Google accepts the UA value up to the first space ("Foo"), case-insensitively.
			for (const txt of variants) {
				assert(allowed(txt, "Foo", "http://foo.bar/x/y"));
				assert(!allowed(txt, "Foo", "http://foo.bar/a/b"));
				assert(allowed(txt, "foo", "http://foo.bar/x/y"));
				assert(!allowed(txt, "foo", "http://foo.bar/a/b"));
			}
		});

		test("GoogleOnly_AcceptUserAgentUpToFirstSpace", () => {
			const txt =
				"User-Agent: *\nDisallow: /\n" +
				"User-Agent: Foo Bar\nAllow: /x/\nDisallow: /\n";
			assert(allowed(txt, "Foo", "http://foo.bar/x/y"));
			// "Foo Bar" extracts to "Foo" too (prefix stops at the space).
			assert(allowed(txt, "Foo Bar", "http://foo.bar/x/y"));
		});

		test("ID_GlobalGroups_Secondary", () => {
			const global =
				"user-agent: *\nallow: /\nuser-agent: FooBot\ndisallow: /\n";
			const onlySpecific =
				"user-agent: FooBot\nallow: /\n" +
				"user-agent: BarBot\ndisallow: /\n" +
				"user-agent: BazBot\ndisallow: /\n";
			const url = "http://foo.bar/x/y";
			assert(allowed("", "FooBot", url));
			assert(!allowed(global, "FooBot", url));
			assert(allowed(global, "BarBot", url));
			// No matching specific group and no '*' group -> allowed.
			assert(allowed(onlySpecific, "QuxBot", url));
		});

		test("ID_AllowDisallow_Value_CaseSensitive", () => {
			const lower = "user-agent: FooBot\ndisallow: /x/\n";
			const upper = "user-agent: FooBot\ndisallow: /X/\n";
			const url = "http://foo.bar/x/y";
			assert(!allowed(lower, "FooBot", url));
			assert(allowed(upper, "FooBot", url));
		});

		test("ID_LongestMatch", () => {
			const url = "http://foo.bar/x/page.html";
			assert(
				!allowed(
					"user-agent: FooBot\ndisallow: /x/page.html\nallow: /x/\n",
					"FooBot",
					url,
				),
			);
			assert(
				allowed(
					"user-agent: FooBot\nallow: /x/page.html\ndisallow: /x/\n",
					"FooBot",
					url,
				),
			);
			assert(
				!allowed(
					"user-agent: FooBot\nallow: /x/page.html\ndisallow: /x/\n",
					"FooBot",
					"http://foo.bar/x/",
				),
			);
			// Equivalent empty allow/disallow -> allow wins.
			assert(allowed("user-agent: FooBot\ndisallow: \nallow: \n", "FooBot", url));
			assert(allowed("user-agent: FooBot\ndisallow: /\nallow: /\n", "FooBot", url));
			// /x vs /x/
			const xRules = "user-agent: FooBot\ndisallow: /x\nallow: /x/\n";
			assert(!allowed(xRules, "FooBot", "http://foo.bar/x"));
			assert(allowed(xRules, "FooBot", "http://foo.bar/x/"));
			assert(
				allowed(
					"user-agent: FooBot\ndisallow: /x/page.html\nallow: /x/page.html\n",
					"FooBot",
					url,
				),
			);
			// Longest match wins across wildcards.
			const pageRules = "user-agent: FooBot\nallow: /page\ndisallow: /*.html\n";
			assert(!allowed(pageRules, "FooBot", "http://foo.bar/page.html"));
			assert(allowed(pageRules, "FooBot", "http://foo.bar/page"));
			const dotRules = "user-agent: FooBot\nallow: /x/page.\ndisallow: /*.html\n";
			assert(allowed(dotRules, "FooBot", url));
			assert(!allowed(dotRules, "FooBot", "http://foo.bar/x/y.html"));
			// Specific group for FooBot implicitly allows /x/page.
			const groupRules =
				"User-agent: *\nDisallow: /x/\nUser-agent: FooBot\nDisallow: /y/\n";
			assert(allowed(groupRules, "FooBot", "http://foo.bar/x/page"));
			assert(!allowed(groupRules, "FooBot", "http://foo.bar/y/page"));
		});

		test("ID_Encoding", () => {
			// Query strings with reserved characters stay literal.
			assert(
				allowed(
					"User-agent: FooBot\nDisallow: /\nAllow: /foo/bar?qux=taz&baz=http://foo.bar?tar&par\n",
					"FooBot",
					"http://foo.bar/foo/bar?qux=taz&baz=http://foo.bar?tar&par",
				),
			);
			// 3-byte char in the rule is percent-encoded to match the encoded path.
			const tsuRule = "User-agent: FooBot\nDisallow: /\nAllow: /foo/bar/ツ\n";
			assert(allowed(tsuRule, "FooBot", "http://foo.bar/foo/bar/%E3%83%84"));
			// DIVERGENCE FROM GOOGLE: Google treats the caller's URL as already
			// percent-encoded and does NOT encode it, so a raw-ツ URL does NOT match
			// there. WHATWG `URL` normalises the path to %E3%83%84 before we see it,
			// which is the RFC-9309-correct comparison, so for us it DOES match.
			assert(allowed(tsuRule, "FooBot", "http://foo.bar/foo/bar/ツ"));
			// Already-encoded rule matches the encoded path.
			assert(
				allowed(
					"User-agent: FooBot\nDisallow: /\nAllow: /foo/bar/%E3%83%84\n",
					"FooBot",
					"http://foo.bar/foo/bar/%E3%83%84",
				),
			);
			// Percent-encoded unreserved ASCII is NOT decoded -> no match against baz.
			const pctRule =
				"User-agent: FooBot\nDisallow: /\nAllow: /foo/bar/%62%61%7A\n";
			assert(!allowed(pctRule, "FooBot", "http://foo.bar/foo/bar/baz"));
			assert(allowed(pctRule, "FooBot", "http://foo.bar/foo/bar/%62%61%7A"));
		});

		test("ID_SpecialCharacters", () => {
			const star =
				"User-agent: FooBot\nDisallow: /foo/bar/quz\nAllow: /foo/*/qux\n";
			assert(!allowed(star, "FooBot", "http://foo.bar/foo/bar/quz"));
			assert(allowed(star, "FooBot", "http://foo.bar/foo/quz"));
			assert(allowed(star, "FooBot", "http://foo.bar/foo//quz"));
			assert(allowed(star, "FooBot", "http://foo.bar/foo/bax/quz"));

			const dollar =
				"User-agent: FooBot\nDisallow: /foo/bar$\nAllow: /foo/bar/qux\n";
			assert(!allowed(dollar, "FooBot", "http://foo.bar/foo/bar"));
			assert(allowed(dollar, "FooBot", "http://foo.bar/foo/bar/qux"));
			assert(allowed(dollar, "FooBot", "http://foo.bar/foo/bar/"));
			assert(allowed(dollar, "FooBot", "http://foo.bar/foo/bar/baz"));

			const comment =
				"User-agent: FooBot\n# Disallow: /\nDisallow: /foo/quz#qux\nAllow: /\n";
			assert(allowed(comment, "FooBot", "http://foo.bar/foo/bar"));
			assert(!allowed(comment, "FooBot", "http://foo.bar/foo/quz"));
		});

		test("GoogleOnly_DocumentationChecks: /fish", () => {
			const txt = "user-agent: FooBot\ndisallow: /\nallow: /fish\n";
			assert(!allowed(txt, "FooBot", "http://foo.bar/bar"));
			assert(allowed(txt, "FooBot", "http://foo.bar/fish"));
			assert(allowed(txt, "FooBot", "http://foo.bar/fish.html"));
			assert(allowed(txt, "FooBot", "http://foo.bar/fish/salmon.html"));
			assert(allowed(txt, "FooBot", "http://foo.bar/fishheads"));
			assert(allowed(txt, "FooBot", "http://foo.bar/fishheads/yummy.html"));
			assert(allowed(txt, "FooBot", "http://foo.bar/fish.html?id=anything"));
			assert(!allowed(txt, "FooBot", "http://foo.bar/Fish.asp"));
			assert(!allowed(txt, "FooBot", "http://foo.bar/catfish"));
			assert(!allowed(txt, "FooBot", "http://foo.bar/?id=fish"));
		});

		test("GoogleOnly_DocumentationChecks: /fish*", () => {
			const txt = "user-agent: FooBot\ndisallow: /\nallow: /fish*\n";
			assert(!allowed(txt, "FooBot", "http://foo.bar/bar"));
			assert(allowed(txt, "FooBot", "http://foo.bar/fish"));
			assert(allowed(txt, "FooBot", "http://foo.bar/fish.html"));
			assert(allowed(txt, "FooBot", "http://foo.bar/fish/salmon.html"));
			assert(allowed(txt, "FooBot", "http://foo.bar/fishheads"));
			assert(allowed(txt, "FooBot", "http://foo.bar/fishheads/yummy.html"));
			assert(allowed(txt, "FooBot", "http://foo.bar/fish.html?id=anything"));
			assert(!allowed(txt, "FooBot", "http://foo.bar/Fish.bar"));
			assert(!allowed(txt, "FooBot", "http://foo.bar/catfish"));
			assert(!allowed(txt, "FooBot", "http://foo.bar/?id=fish"));
		});

		test("GoogleOnly_DocumentationChecks: /fish/", () => {
			const txt = "user-agent: FooBot\ndisallow: /\nallow: /fish/\n";
			assert(!allowed(txt, "FooBot", "http://foo.bar/bar"));
			assert(allowed(txt, "FooBot", "http://foo.bar/fish/"));
			assert(allowed(txt, "FooBot", "http://foo.bar/fish/salmon"));
			assert(allowed(txt, "FooBot", "http://foo.bar/fish/?salmon"));
			assert(allowed(txt, "FooBot", "http://foo.bar/fish/salmon.html"));
			assert(allowed(txt, "FooBot", "http://foo.bar/fish/?id=anything"));
			assert(!allowed(txt, "FooBot", "http://foo.bar/fish"));
			assert(!allowed(txt, "FooBot", "http://foo.bar/fish.html"));
			assert(!allowed(txt, "FooBot", "http://foo.bar/Fish/Salmon.html"));
		});

		test("GoogleOnly_DocumentationChecks: /*.php", () => {
			const txt = "user-agent: FooBot\ndisallow: /\nallow: /*.php\n";
			assert(!allowed(txt, "FooBot", "http://foo.bar/bar"));
			assert(allowed(txt, "FooBot", "http://foo.bar/filename.php"));
			assert(allowed(txt, "FooBot", "http://foo.bar/folder/filename.php"));
			assert(allowed(txt, "FooBot", "http://foo.bar/folder/filename.php?parameters"));
			assert(allowed(txt, "FooBot", "http://foo.bar//folder/any.php.file.html"));
			assert(allowed(txt, "FooBot", "http://foo.bar/filename.php/"));
			assert(allowed(txt, "FooBot", "http://foo.bar/index?f=filename.php/"));
			assert(!allowed(txt, "FooBot", "http://foo.bar/php/"));
			assert(!allowed(txt, "FooBot", "http://foo.bar/index?php"));
			assert(!allowed(txt, "FooBot", "http://foo.bar/windows.PHP"));
		});

		test("GoogleOnly_DocumentationChecks: /*.php$", () => {
			const txt = "user-agent: FooBot\ndisallow: /\nallow: /*.php$\n";
			assert(!allowed(txt, "FooBot", "http://foo.bar/bar"));
			assert(allowed(txt, "FooBot", "http://foo.bar/filename.php"));
			assert(allowed(txt, "FooBot", "http://foo.bar/folder/filename.php"));
			assert(!allowed(txt, "FooBot", "http://foo.bar/filename.php?parameters"));
			assert(!allowed(txt, "FooBot", "http://foo.bar/filename.php/"));
			assert(!allowed(txt, "FooBot", "http://foo.bar/filename.php5"));
			assert(!allowed(txt, "FooBot", "http://foo.bar/php/"));
			assert(!allowed(txt, "FooBot", "http://foo.bar/filename?php"));
			assert(!allowed(txt, "FooBot", "http://foo.bar/aaaphpaaa"));
			assert(!allowed(txt, "FooBot", "http://foo.bar//windows.PHP"));
		});

		test("GoogleOnly_DocumentationChecks: /fish*.php", () => {
			const txt = "user-agent: FooBot\ndisallow: /\nallow: /fish*.php\n";
			assert(!allowed(txt, "FooBot", "http://foo.bar/bar"));
			assert(allowed(txt, "FooBot", "http://foo.bar/fish.php"));
			assert(allowed(txt, "FooBot", "http://foo.bar/fishheads/catfish.php?parameters"));
			assert(!allowed(txt, "FooBot", "http://foo.bar/Fish.PHP"));
		});

		test("GoogleOnly_DocumentationChecks: precedence order", () => {
			assert(
				allowed("user-agent: FooBot\nallow: /p\ndisallow: /\n", "FooBot", "http://example.com/page"),
			);
			assert(
				allowed(
					"user-agent: FooBot\nallow: /folder\ndisallow: /folder\n",
					"FooBot",
					"http://example.com/folder/page",
				),
			);
			assert(
				!allowed(
					"user-agent: FooBot\nallow: /page\ndisallow: /*.htm\n",
					"FooBot",
					"http://example.com/page.htm",
				),
			);
			const dollarRoot = "user-agent: FooBot\nallow: /$\ndisallow: /\n";
			assert(allowed(dollarRoot, "FooBot", "http://example.com/"));
			assert(!allowed(dollarRoot, "FooBot", "http://example.com/page.html"));
		});

		test("ID_NonStandardLineExample_Sitemap: anywhere in file", () => {
			const loc = "http://foo.bar/sitemap.xml";
			const r1 = new RobotsTxt(
				`User-Agent: foo\nAllow: /some/path\nUser-Agent: bar\n\n\nSitemap: ${loc}\n`,
			);
			assert(r1.sitemapHrefs.includes(loc));
			const r2 = new RobotsTxt(
				`Sitemap: ${loc}\nUser-Agent: foo\nAllow: /some/path\nUser-Agent: bar\n\n\n`,
			);
			assert(r2.sitemapHrefs.includes(loc));
		});

		test("GoogleOnly_IndexHTMLisDirectory", () => {
			// "index.htm[l]" at the end of an Allow pattern is treated as "/".
			const txt =
				"User-Agent: *\nAllow: /allowed-slash/index.html\nDisallow: /\n";
			// index.html allowed => the directory "/" it names is allowed too.
			assert(allowed(txt, "foobot", "http://foo.com/allowed-slash/"));
			// Does not exactly match (index.htm != index.html) and the "/" rewrite
			// requires the trailing "/", so "/allowed-slash/index.htm" stays blocked.
			assert(!allowed(txt, "foobot", "http://foo.com/allowed-slash/index.htm"));
			// Exact literal match.
			assert(allowed(txt, "foobot", "http://foo.com/allowed-slash/index.html"));
			assert(!allowed(txt, "foobot", "http://foo.com/anyother-url"));
		});

		test("GoogleOnly_LineTooLong: pattern is cut off at the per-line byte cap", () => {
			const kMaxLineLen = 2083 * 8;
			// A disallow pattern comfortably longer than the cap. Everything past
			// kMaxLineLen bytes of the line (including the "disallow: " key) is
			// dropped, so the stored pattern ends mid-filler and the "/qux" suffix
			// never survives.
			const filler = "a".repeat(kMaxLineLen); // well over the cap on its own
			const txt = `user-agent: FooBot\ndisallow: /x/${filler}/qux\n`;
			const robots = new RobotsTxt(txt);
			const pattern = robots.ruleGroupByUserAgent.get("foobot")?.disallow[0] ?? "";

			// Stored pattern was truncated: shorter than the written value, and the
			// trailing "/qux" is gone.
			assert(pattern.length < `/x/${filler}/qux`.length);
			assert(!pattern.endsWith("/qux"));
			// It equals the first (kMaxLineLen - "disallow: ".length) bytes of the value.
			const expected = `/x/${filler}/qux`.slice(0, kMaxLineLen - "disallow: ".length);
			assert.equal(pattern, expected);

			// The surviving prefix still matches a URL that shares it.
			assert(robots.isCrawlDisallowed(new URL(`http://foo.bar/x/${filler}`), "FooBot"));
			// A short line is never touched.
			const short = new RobotsTxt("user-agent: FooBot\ndisallow: /private\n");
			assert.equal(short.ruleGroupByUserAgent.get("foobot")?.disallow[0], "/private");
		});

		test("accepts a pre-encoded path string (Google-exact, no URL normalization)", () => {
			const txt = "user-agent: *\ndisallow: /foo/bar\n";
			const robots = new RobotsTxt(txt);
			// A raw path string is matched byte-for-byte, as Google's reference does.
			assert(!robots.isCrawlAllowed("/foo/bar", "googlebot"));
			assert(robots.isCrawlAllowed("/foo/baz", "googlebot"));
			assert(robots.isCrawlDisallowed("/foo/bar/qux", "googlebot"));
			// A caller-encoded non-ASCII path matches a rule canonicalized the same way.
			const enc = new RobotsTxt("user-agent: *\ndisallow: /€\n");
			assert(!enc.isCrawlAllowed("/%E2%82%AC", "googlebot"));
		});

		// NOT PORTED (deliberate):
		//  - ID_LinesNumbersAreCountedCorrectly / ID_UTF8ByteOrderMarkIsSkipped:
		//    exercise Google's per-line parse-callback counters, which we don't
		//    expose. BOM stripping belongs to the byte decoder the caller runs
		//    before handing us text, not to this transport-agnostic parser.
		//  - TestGetPathParamsQuery / TestMaybeEscapePattern: test Google's raw-URL
		//    parser. A WHATWG `URL` already strips scheme/authority/fragment and
		//    canonicalizes the path; a caller wanting Google's exact raw-path
		//    handling passes a pre-encoded string to isCrawlAllowed instead.
	});
});
