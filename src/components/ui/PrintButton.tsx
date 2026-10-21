"use client";

import { useI18n } from "@/i18n/client";
import { Button } from "./Button";
import { Icon } from "./Icon";

/** "Print / save as PDF" for long reads (guides print as clean pages, see the print styles in globals.css). */
export function PrintButton() {
  const { t } = useI18n();
  return (
    <Button variant="secondary" size="sm" onClick={() => window.print()}>
      <Icon name="print" className="h-4 w-4" /> {t.common.printSave}
    </Button>
  );
}
