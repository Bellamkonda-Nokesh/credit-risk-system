import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/lib/use-auth";
import { Shield, Eye, EyeOff, CheckCircle2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

function PasswordStrength({ password }: { password: string }) {
  const checks = [
    { label: "At least 6 characters", ok: password.length >= 6 },
    { label: "Contains a number", ok: /\d/.test(password) },
    { label: "Contains a letter", ok: /[a-zA-Z]/.test(password) },
  ];

  if (!password) return null;

  return (
    <div className="flex flex-col gap-1.5 mt-1">
      {checks.map(({ label, ok }) => (
        <div key={label} className="flex items-center gap-2">
          <CheckCircle2
            className={`w-3.5 h-3.5 shrink-0 transition-colors ${ok ? "text-emerald-500" : "text-muted-foreground/40"}`}
          />
          <span className={`text-xs transition-colors ${ok ? "text-foreground" : "text-muted-foreground"}`}>
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}

export default function RegisterPage() {
  const [, navigate] = useLocation();
  const { register, isRegistering, registerError } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [validationError, setValidationError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setValidationError("");

    if (password.length < 6) {
      setValidationError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirm) {
      setValidationError("Passwords do not match.");
      return;
    }

    try {
      await register({ username, password });
      navigate("/");
    } catch {
      // error shown via registerError
    }
  }

  const errorMessage = validationError || (registerError ? (registerError as Error).message : "");

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left Panel — Branding */}
      <div className="hidden lg:flex flex-col justify-between w-[52%] bg-[hsl(217,91%,18%)] p-12 relative overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-white/5 pointer-events-none" />
        <div className="absolute top-1/2 -right-24 w-64 h-64 rounded-full bg-white/5 pointer-events-none" />
        <div className="absolute -bottom-20 left-1/3 w-80 h-80 rounded-full bg-white/5 pointer-events-none" />

        {/* Logo */}
        <div className="flex items-center gap-3 z-10">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/15">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-white font-bold text-lg leading-none">RiskLens</p>
            <p className="text-blue-200 text-xs">Credit Risk Intelligence</p>
          </div>
        </div>

        {/* Hero */}
        <div className="z-10">
          <h1 className="text-4xl font-bold text-white leading-tight mb-4">
            Join RiskLens<br />Today
          </h1>
          <p className="text-blue-100 text-base leading-relaxed mb-10 max-w-sm">
            Create your account to access the full suite of credit risk analytics tools. Secure, fast, and intelligent.
          </p>

          {/* Benefits */}
          <div className="flex flex-col gap-5">
            {[
              { title: "Instant Access", desc: "Start analysing risk profiles immediately after signup" },
              { title: "Secure by Default", desc: "All data encrypted with industry-standard security" },
              { title: "Real-time Insights", desc: "Live dashboard powered by ML predictions" },
            ].map(({ title, desc }) => (
              <div key={title} className="flex gap-4">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white/10 shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                </div>
                <div>
                  <p className="text-white text-sm font-semibold">{title}</p>
                  <p className="text-blue-200 text-xs mt-0.5">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="z-10 border-t border-white/15 pt-6">
          <p className="text-blue-200 text-sm">Already a member?{" "}
            <button
              onClick={() => navigate("/login")}
              className="text-white font-semibold hover:underline"
            >
              Sign in here
            </button>
          </p>
        </div>
      </div>

      {/* Right Panel — Register Form */}
      <div className="flex flex-1 items-center justify-center p-6">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-3 mb-8 justify-center">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary">
              <Shield className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <p className="font-bold text-lg leading-none">RiskLens</p>
              <p className="text-muted-foreground text-xs">Credit Risk Intelligence</p>
            </div>
          </div>

          <Card className="border shadow-lg">
            <CardHeader className="pb-4 pt-8 px-8">
              <div className="flex items-center gap-2 mb-1">
                <Lock className="w-4 h-4 text-primary" />
                <span className="text-xs font-medium text-primary uppercase tracking-widest">Create Account</span>
              </div>
              <h2 className="text-2xl font-bold">Get started</h2>
              <p className="text-sm text-muted-foreground">Create your RiskLens analyst account</p>
            </CardHeader>

            <CardContent className="px-8 pb-8">
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="reg-username">Username</Label>
                  <Input
                    id="reg-username"
                    type="text"
                    placeholder="Choose a username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    autoComplete="username"
                    className="h-11"
                    minLength={3}
                  />
                  <p className="text-xs text-muted-foreground">Minimum 3 characters, no spaces</p>
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="reg-password">Password</Label>
                  <div className="relative">
                    <Input
                      id="reg-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      autoComplete="new-password"
                      className="h-11 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <PasswordStrength password={password} />
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="reg-confirm">Confirm Password</Label>
                  <div className="relative">
                    <Input
                      id="reg-confirm"
                      type={showConfirm ? "text" : "password"}
                      placeholder="Repeat your password"
                      value={confirm}
                      onChange={(e) => setConfirm(e.target.value)}
                      required
                      autoComplete="new-password"
                      className={`h-11 pr-10 ${confirm && confirm !== password ? "border-destructive" : ""}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      aria-label={showConfirm ? "Hide confirm" : "Show confirm"}
                    >
                      {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {confirm && confirm !== password && (
                    <p className="text-xs text-destructive">Passwords do not match</p>
                  )}
                </div>

                {errorMessage && (
                  <div className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md px-3 py-2">
                    {errorMessage}
                  </div>
                )}

                <Button type="submit" className="h-11 w-full mt-1" disabled={isRegistering}>
                  {isRegistering ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z" />
                      </svg>
                      Creating account...
                    </span>
                  ) : "Create Account"}
                </Button>

                <p className="text-sm text-center text-muted-foreground">
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => navigate("/login")}
                    className="text-primary font-medium hover:underline"
                  >
                    Sign in
                  </button>
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
