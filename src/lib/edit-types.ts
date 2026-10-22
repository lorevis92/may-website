/**
 * Shared vocabulary of the in-place editor (components/edit) and its server actions (app/edit-actions.ts).
 *
 * A target is one stored document; a field is a short path inside it, always read and written in the
 * language of the page May is looking at:
 *   about  title · subtitle · bio · skills.2 · skills.2.icon · how.1.title · values.0 …
 *   guide  title · subtitle · readingMinutes · summary.3 · body · icon · relatedTool
 *   diary  title · excerpt · dateline · date · tags · body
 *   text   any UI string of the site, e.g. trust.years or pillars.items.2.body, and stats.yearsExperience
 * Markdown fields (bio, body) can also be edited one block at a time: "body@3" is the 4th block.
 */
export type EditTarget = { t: "about" } | { t: "guide"; slug: string } | { t: "diary"; slug: string } | { t: "text" };

/** How a field is edited in the popover. */
export type EditKind = "text" | "textarea" | "markdown" | "number" | "date" | "select" | "icon";

export type EditResult = { ok: true } | { ok: false; message: string };
export type LoadResult = { ok: true; value: string } | { ok: false; message: string };
export type CreateResult = { ok: true; slug: string } | { ok: false; message: string };

/** List operations: insert a new item at `index` (with its first text), delete it, or move it one step. */
export type ListOp = "insert" | "delete" | "up" | "down";

/** Cookie (readable by the browser) that only tells the page to show the edit button; every save checks the real session. */
export const EDIT_HINT_COOKIE = "may_editor";
