"use client";
import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/misc";
import { Button } from "@/components/ui/Button";
import { Input, Field } from "@/components/ui/Input";
import { authApi } from "@/lib/api/endpoints";
import { ApiError } from "@/lib/api/client";

function ResetForm() {
  const router = useRouter();
  const token = useSearchParams().get("token") ?? "";
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (password.length < 8) return setError("Password must be at least 8 characters.");
    if (password !== confirm) return setError("Passwords don't match.");
    setLoading(true);
    try {
      await authApi.resetPassword(token, password);
      setDone(true);
      setTimeout(() => router.push("/login"), 1800);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  if (!token) {
    return <p className="mt-3 text-sm text-destructive">This reset link is missing its token. Request a new one.</p>;
  }
  if (done) {
    return <p className="mt-3 text-sm text-muted-foreground">Password updated! Taking you to log in…</p>;
  }

  return (
    <form onSubmit={submit} className="mt-6 space-y-4">
      <Field label="New password" htmlFor="pw">
        <Input id="pw" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" autoComplete="new-password" required />
      </Field>
      <Field label="Confirm password" htmlFor="pw2">
        <Input id="pw2" type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="••••••••" autoComplete="new-password" required />
      </Field>
      {error && <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>}
      <Button type="submit" className="w-full" loading={loading}>Set new password</Button>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
      <Card className="p-8">
        <h1 className="text-2xl font-bold">Reset your password</h1>
        <Suspense fallback={<p className="mt-3 text-sm text-muted-foreground">Loading…</p>}>
          <ResetForm />
        </Suspense>
        <p className="mt-6 text-center text-sm text-muted-foreground">
          <Link href="/login" className="font-medium text-primary hover:underline">Back to log in</Link>
        </p>
      </Card>
    </motion.div>
  );
}
