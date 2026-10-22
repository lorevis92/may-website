"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { IconName } from "@/components/ui/Icon";
import { Icon } from "@/components/ui/Icon";
import { useI18n } from "@/i18n/client";
import type { Locale } from "@/i18n";
import { EDIT_HINT_COOKIE, type EditKind, type EditResult, type EditTarget } from "@/lib/edit-types";
import { EditPopover } from "./EditPopover";
import { EDIT_UI, type EditUi } from "./ui-text";

/** What the popover is asked to edit. */
export type EditorRequest =
  | {
      mode: "field";
      target: EditTarget;
      field: string;
      kind: EditKind;
      options?: { value: string; label: string }[];
      icons?: IconName[];
      previewClassName?: string;
      /** UI strings: empty brings back the built-in copy. */
      restorable?: boolean;
    }
  /** Add a new item to a list (or a new paragraph to a text) at `index`. */
  | { mode: "insert"; target: EditTarget; list: string; index: number; kind: "text" | "markdown"; previewClassName?: string; bilingual?: boolean }
  /** One paragraph/heading/list… of a Markdown text, with move / delete / add-below. */
  | { mode: "block"; target: EditTarget; list: string; index: number; count: number; previewClassName?: string }
  | { mode: "create"; kind: "guide" | "diary" };

interface EditContextValue {
  editing: boolean;
  locale: Locale;
  ui: EditUi;
  open: (anchor: HTMLElement, req: EditorRequest) => void;
  /** Runs a list action (move / delete) and shows its error, if any. */
  run: (action: () => Promise<EditResult>) => Promise<boolean>;
  notify: (message: string) => void;
}

const EditContext = createContext<EditContextValue | null>(null);

/** Off the editable pages (tools, book, chat…) the button isn't shown. */
const EDITABLE_PAGES = /^\/(th|en)(\/(about|guides|diary)(\/[^/]+)?)?\/?$/;
const MODE_KEY = "may-edit-mode";

export function useEdit(): EditContextValue {
  const ctx = useContext(EditContext);
  if (!ctx) throw new Error("useEdit must be used inside <EditProvider>");
  return ctx;
}

/**
 * In-place editing of the public pages for May. The button only appears when the browser holds the
 * editor hint cookie (set at login); every save is checked against the real session on the server.
 * Edit mode is remembered for the tab, so it stays on while she moves between pages.
 */
export function EditProvider({ children }: { children: ReactNode }) {
  const { locale } = useI18n();
  const pathname = usePathname();
  const ui = EDIT_UI[locale];
  const [canEdit, setCanEdit] = useState(false);
  const [wantEditing, setWantEditing] = useState(false);
  const [popover, setPopover] = useState<{ anchor: HTMLElement; req: EditorRequest; id: number } | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    // Browser-only state (cookie, sessionStorage) has to be read after hydration.
    /* eslint-disable react-hooks/set-state-in-effect */
    setCanEdit(document.cookie.split(/;\s*/).includes(`${EDIT_HINT_COOKIE}=1`));
    const url = new URL(window.location.href);
    // "Edit the site" in the admin panel lands on /th?edit=1.
    const fromAdmin = url.searchParams.get("edit") === "1";
    if (fromAdmin) {
      url.searchParams.delete("edit");
      window.history.replaceState(window.history.state, "", url.pathname + url.search + url.hash);
    }
    try {
      if (fromAdmin) sessionStorage.setItem(MODE_KEY, "1");
      setWantEditing(fromAdmin || sessionStorage.getItem(MODE_KEY) === "1");
    } catch {
      setWantEditing(fromAdmin);
    }
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  const onEditablePage = EDITABLE_PAGES.test(pathname);
  const editing = canEdit && wantEditing && onEditablePage;

  useEffect(() => {
    document.documentElement.classList.toggle("edit-on", editing);
  }, [editing]);

  // A new page or language closes whatever was open.
  const [shownPath, setShownPath] = useState(pathname);
  if (shownPath !== pathname) {
    setShownPath(pathname);
    setPopover(null);
  }

  useEffect(() => {
    if (!notice) return;
    const id = setTimeout(() => setNotice(null), 4000);
    return () => clearTimeout(id);
  }, [notice]);

  const setMode = (on: boolean) => {
    setWantEditing(on);
    if (!on) setPopover(null);
    try {
      sessionStorage.setItem(MODE_KEY, on ? "1" : "0");
    } catch {}
  };

  const open = useCallback((anchor: HTMLElement, req: EditorRequest) => setPopover({ anchor, req, id: Date.now() }), []);
  const notify = useCallback((message: string) => setNotice(message), []);
  const run = useCallback(
    async (action: () => Promise<EditResult>) => {
      try {
        const res = await action();
        if (!res.ok) setNotice(res.message);
        return res.ok;
      } catch {
        setNotice(ui.error);
        return false;
      }
    },
    [ui.error],
  );

  const value = useMemo(() => ({ editing, locale, ui, open, run, notify }), [editing, locale, ui, open, run, notify]);

  return (
    <EditContext.Provider value={value}>
      {children}
      {canEdit && onEditablePage && (
        <div className="no-print fixed inset-x-0 bottom-4 z-[60] flex justify-center px-4 pointer-events-none">
          <div className="pointer-events-auto flex max-w-full flex-wrap items-center gap-x-3 gap-y-1 rounded-full border border-line bg-white/95 py-1.5 pl-4 pr-1.5 shadow-[var(--shadow-lift)] backdrop-blur">
            {editing ? (
              <>
                <span className="text-sm text-ink-soft">
                  <span className="font-heading text-ink">
                    {ui.editing} · {ui.language}
                  </span>
                  <span className="hidden sm:inline"> — {ui.hint}</span>
                </span>
                <Link href="/admin/leads" className="text-sm text-ink-muted hover:text-ink">
                  {ui.admin}
                </Link>
                <button type="button" onClick={() => setMode(false)} className="inline-flex items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-sm font-heading text-white hover:bg-ink/90">
                  <Icon name="check" className="h-4 w-4" /> {ui.done}
                </button>
              </>
            ) : (
              <button type="button" onClick={() => setMode(true)} className="-ml-2.5 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-heading text-jasmine-deep hover:bg-jasmine-mist">
                <Icon name="pen" className="h-4 w-4" /> {ui.edit}
              </button>
            )}
          </div>
        </div>
      )}
      {notice && (
        <div role="status" className="no-print fixed inset-x-0 bottom-20 z-[70] mx-auto w-fit max-w-[calc(100vw-2rem)] rounded-xl bg-ink px-4 py-2.5 text-sm text-white shadow-[var(--shadow-lift)]">
          {notice}
        </div>
      )}
      {editing && popover && <EditPopover key={popover.id} anchor={popover.anchor} initial={popover.req} onClose={() => setPopover(null)} />}
    </EditContext.Provider>
  );
}
