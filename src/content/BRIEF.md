# Content brief — May's website (TH/EN)

## Who May is
- First name "May" (Thai nickname เมย์). Female, Thai, insurance & financial advisor at **AIA Thailand**.
- Holds all licences (life insurance agent licence + IC licence for unit-linked/investment products) and is an **MDRT** member (Million Dollar Round Table — the international association of top-performing financial advisors).
- Sells: health insurance, critical-illness cover, life protection, savings/endowment plans, **pension/retirement plans**, **unit-linked (investment-linked) life insurance**, education plans for children, legacy/whole-life planning, group insurance for small businesses, and the AIA Vitality wellness programme.
- Her favourite work: helping families (especially parents) and people planning retirement; she likes savings-type products that build capital over time.
- Audience: Thai families, parents, young professionals, pre-retirees; also expats living in Thailand (English version).

## Voice (very important)
- **Diary-like, intimate, warm.** She writes as if confiding to a friend over coffee, not like a brochure. First person. Short paragraphs. Occasional personal micro-stories ("a client who…", "my own mother…") — keep them generic/plausible, never invent verifiable facts (no real names, no specific real-world numbers about May's own life or clients).
- Thai: natural spoken-written Thai, polite female particles (ค่ะ/คะ/นะคะ), May refers to herself as "เมย์", addresses the reader as "คุณ". Avoid stiff bureaucratic Thai and avoid literal translation from English — write it as a Thai person would.
- English: plain English, friendly, no jargon without a one-line explanation. British/International spelling is fine.
- Never pushy. Never "buy now". The call to action is always soft: "if you'd like, tell me about your situation and we'll look at it together".

## Compliance rules (non-negotiable)
- Never guarantee returns, never quote a specific premium or a specific policy's benefit figures. Describe **product families** (e.g. "pension plans", "savings/endowment plans", "unit-linked plans", "health plans with a copay option"), not specific policy terms.
- Investment-linked products: say clearly that values can go up and down and there is no guarantee.
- Everything is **general information, not personalised financial, legal or tax advice**. Every guide ends with a `disclaimer` block saying so and inviting the reader to talk to May (or any licensed advisor).
- Thai tax facts you may use (confirmed for tax year 2026, Revenue Department rules):
  - Own life insurance premiums (policy ≥10 years, Thai insurer): deductible up to ฿100,000.
  - Own health insurance premiums: up to ฿25,000, and **life + health together cannot exceed ฿100,000**.
  - Parents' health insurance: up to ฿15,000 (parents' income ≤ ฿30,000/yr).
  - Spouse (no income) life insurance: up to ฿10,000.
  - Pension life insurance: up to 15% of assessable income, max ฿200,000; and the combined cap with PVD/RMF/SSF/NSF/GPF is ฿500,000. If the general life bucket (฿100,000) is not fully used, pension premiums can fill it first.
  - Personal income tax brackets: 0–150k exempt; 150–300k 5%; 300–500k 10%; 500–750k 15%; 750k–1M 20%; 1–2M 25%; 2–5M 30%; >5M 35%.
- Health insurance context (Thailand 2026): AIA's old all-inclusive plan "Health Happy" stopped selling in March 2026; newer all-inclusive plans come with **copay options** (you pay a small share of each claim in exchange for a lower premium). It's fine to explain what a copay/deductible is. Private hospital costs in Bangkok are high and rising — speak in ranges and "for example" language, never as exact prices.

## Format
- Output must be a TypeScript module that default-exports (or named-exports) an object matching the types in `src/content/types.ts`. Use the `Block` union exactly. Escape quotes properly. Do not add fields that are not in the types.
- Keep paragraphs short (1–3 sentences). Use `note` blocks for May's personal asides (1 per 2–3 sections). Use `ul`/`ol` for scannable lists. Use `table` sparingly (max 1 per guide) for comparisons.
- Length: each guide ≈ 800–1,100 words per language. Each diary entry ≈ 350–500 words per language.
