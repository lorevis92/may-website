"use client";

import { createContext, startTransition, useActionState, useContext, useEffect, useRef, type ReactNode } from "react";
import type { ActionState } from "@/app/admin/actions";
import { buttonClass, cx } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";

const FormCtx = createContext<{ state: ActionState; pending: boolean }>({ state: null, pending: false });

/**
 * Form for an admin server action that returns { ok, message }. Submitted by hand (not via the `action`
 * prop) so React doesn't reset the fields after the action: on a validation error May keeps what she typed.
 */
export function ActionForm({
  action,
  children,
  className,
  resetOnSuccess,
}: {
  action: (state: ActionState, fd: FormData) => Promise<ActionState>;
  children: ReactNode;
  className?: string;
  resetOnSuccess?: boolean;
}) {
  const [state, formAction, pending] = useActionState(action, null);
  const ref = useRef<HTMLFormElement>(null);
  useEffect(() => {
    if (state?.ok && resetOnSuccess) ref.current?.reset();
  }, [state, resetOnSuccess]);

  return (
    <FormCtx.Provider value={{ state, pending }}>
      <form
        ref={ref}
        className={className}
        onSubmit={(e) => {
          e.preventDefault();
          const fd = new FormData(e.currentTarget);
          startTransition(() => formAction(fd));
        }}
      >
        {children}
      </form>
    </FormCtx.Provider>
  );
}

/** Submit button plus the last result message of the surrounding ActionForm. */
export function FormFooter({ label, pendingLabel = "Saving…", className }: { label: string; pendingLabel?: string; className?: string }) {
  const { state, pending } = useContext(FormCtx);
  return (
    <div className={cx("flex flex-wrap items-center gap-x-4 gap-y-2", className)}>
      <button type="submit" disabled={pending} className={buttonClass("primary", "md")}>
        {pending ? pendingLabel : label}
      </button>
      {state && !pending && (
        <p role="status" className={cx("inline-flex items-center gap-1.5 text-sm", state.ok ? "text-jasmine-deep" : "text-clay")}>
          {state.ok && <Icon name="check" className="h-4 w-4" />}
          {state.message}
        </p>
      )}
    </div>
  );
}
