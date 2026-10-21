"use client";

import { useState, useSyncExternalStore, type ReactNode } from "react";
import { useSearchParams } from "next/navigation";
import { useI18n } from "@/i18n/client";
import { LeadForm } from "./LeadForm";
import { Icon } from "./Icon";
import { Button } from "./Button";

/**
 * Soft content gate for guides: the summary and the first part of the guide are always visible;
 * the rest unlocks with an email (stored in localStorage so returning readers aren't asked again).
 * The gate is client-side only — the full text is still in the HTML for search engines (SEO-friendly).
 */
function subscribeStorage(cb: () => void) {
  window.addEventListener("storage", cb);
  window.addEventListener("may-unlock", cb);
  return () => {
    window.removeEventListener("storage", cb);
    window.removeEventListener("may-unlock", cb);
  };
}
function readStored(): boolean {
  try {
    return localStorage.getItem("may-guides-unlocked") === "1";
  } catch {
    return false;
  }
}

export function GuideGate({ slug, title, preview, children }: { slug: string; title: string; preview: ReactNode; children: ReactNode }) {
  const { t } = useI18n();
  const params = useSearchParams();
  const [justUnlocked, setJustUnlocked] = useState(false);
  // null while rendering on the server / before hydration; then true/false from localStorage or ?unlocked=1.
  const stored = useSyncExternalStore(subscribeStorage, readStored, () => null);
  const unlocked = stored === null ? null : stored || justUnlocked || params.get("unlocked") === "1";

  const unlock = () => {
    try {
      localStorage.setItem("may-guides-unlocked", "1");
      window.dispatchEvent(new Event("may-unlock"));
    } catch {}
    setJustUnlocked(true);
  };

  // Before hydration (null) render everything so crawlers and no-JS readers get the full guide.
  if (unlocked === null || unlocked) {
    return (
      <>
        {preview}
        {justUnlocked && (
          <p className="my-6 flex items-center gap-2 rounded-xl bg-jasmine-mist px-4 py-3 text-jasmine-deep">
            <Icon name="check" className="h-5 w-5" /> {t.guides.unlocked}
          </p>
        )}
        {children}
        <div className="no-print mt-10 flex flex-wrap gap-3">
          <Button variant="secondary" size="sm" onClick={() => window.print()}>
            <Icon name="print" className="h-4 w-4" /> {t.common.printSave}
          </Button>
        </div>
      </>
    );
  }

  return (
    <>
      {preview}
      <div className="relative">
        <div className="pointer-events-none max-h-56 overflow-hidden select-none [mask-image:linear-gradient(to_bottom,black,transparent)]" aria-hidden>
          {children}
        </div>
        <div className="-mt-8 relative">
          <LeadForm source="guide" compact title={t.guides.unlockTitle} body={t.guides.unlockBody} buttonLabel={t.guides.unlockButton} payload={{ guideSlug: slug, guideTitle: title }} onSuccess={unlock} />
        </div>
      </div>
    </>
  );
}
