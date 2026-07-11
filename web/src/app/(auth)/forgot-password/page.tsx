"use client";
import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/misc";
import { Button } from "@/components/ui/Button";
import { Input, Field } from "@/components/ui/Input";
import { authApi } from "@/lib/api/endpoints";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    // Always succeeds (the server won't reveal whether the email is registered).
    await authApi.forgotPassword(email).catch(() => {});
    setLoading(false);
    setSent(true);
  }

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
      <Card className="p-8">
        <h1 className="text-2xl font-bold">Forgot your password?</h1>
        {sent ? (
          <p className="mt-3 text-sm text-muted-foreground">
            If an account exists for <span className="font-medium text-foreground">{email}</span>, we&apos;ve sent a link to
            reset your password. Check your inbox (and spam). The link expires in 1 hour.
          </p>
        ) : (
          <>
            <p className="mt-1 text-sm text-muted-foreground">Enter your email and we&apos;ll send you a reset link.</p>
            <form onSubmit={submit} className="mt-6 space-y-4">
              <Field label="Email" htmlFor="email">
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                />
              </Field>
              <Button type="submit" className="w-full" loading={loading}>Send reset link</Button>
            </form>
          </>
        )}
        <p className="mt-6 text-center text-sm text-muted-foreground">
          <Link href="/login" className="font-medium text-primary hover:underline">Back to log in</Link>
        </p>
      </Card>
    </motion.div>
  );
}
