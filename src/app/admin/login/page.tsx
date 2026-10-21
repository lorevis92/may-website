import { redirect } from "next/navigation";
import { login } from "@/app/admin/actions";
import { ActionForm, FormFooter } from "@/components/admin/ActionForm";
import { Field, Input } from "@/components/admin/fields";
import { Logo } from "@/components/ui/Logo";
import { adminConfigured, isAdmin } from "@/lib/auth";

export const metadata = { title: "Sign in · admin" };

export default async function AdminLogin() {
  if (await isAdmin()) redirect("/admin/leads");
  const configured = adminConfigured();
  return (
    <div className="grid min-h-screen place-items-center p-6">
      <div className="w-full max-w-sm">
        <Logo className="mx-auto h-14" priority />
        <ActionForm action={login} className="card mt-6 space-y-4 p-6 sm:p-8">
          <h1 className="text-2xl font-medium">Sign in</h1>
          {!configured && (
            <p className="rounded-xl bg-clay-soft px-4 py-3 text-sm text-clay">
              Login is not set up yet. Add <code>ADMIN_PASSWORD</code> (and optionally <code>ADMIN_USERNAME</code>) to the environment variables.
            </p>
          )}
          <Field label="Username">
            <Input name="username" autoComplete="username" autoCapitalize="none" required />
          </Field>
          <Field label="Password">
            <Input name="password" type="password" autoComplete="current-password" required />
          </Field>
          <FormFooter label="Sign in" pendingLabel="Signing in…" className="pt-2" />
        </ActionForm>
      </div>
    </div>
  );
}
