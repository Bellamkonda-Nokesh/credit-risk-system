import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/lib/use-auth";
import { Shield, Eye, EyeOff, TrendingUp, Users, BarChart3, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function LoginPage() {
  const [, navigate] = useLocation();
  const { login, isLoggingIn, loginError } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await login({ username, password });
      navigate("/");
    } catch {
      // error shown via loginError
    }
  }

  const features = [
    { icon: TrendingUp, text: "Real-time credit risk scoring" },
    { icon: Users, text: "Customer portfolio management" },
    { icon: BarChart3, text: "ML model performance analytics" },
    { icon: Shield, text: "Enterprise-grade security" },
  ];

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left Panel — Branding */}
      <div className="hidden lg:flex flex-col justify-between w-[52%] bg-[hsl(217,91%,18%)] p-12 relative overflow-hidden">
        {/* Background decorative circles */}
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

        {/* Hero text */}
        <div className="z-10">
          <h1 className="text-4xl font-bold text-white leading-tight mb-4">
            Intelligent Credit<br />Risk Management
          </h1>
          <p className="text-blue-100 text-base leading-relaxed mb-10 max-w-sm">
            Leverage machine learning to assess, predict, and manage credit risk with precision and confidence.
          </p>

          {/* Feature list */}
          <div className="flex flex-col gap-4">
            {features.map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/10 shrink-0">
                  <Icon className="w-4 h-4 text-blue-200" />
                </div>
                <span className="text-blue-100 text-sm">{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom quote */}
        <div className="z-10">
          <div className="border-t border-white/15 pt-6">
            <p className="text-blue-200 text-sm italic">
              "Precision in risk assessment, confidence in every decision."
            </p>
          </div>
        </div>
      </div>

      {/* Right Panel — Login Form */}
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
                <span className="text-xs font-medium text-primary uppercase tracking-widest">Secure Access</span>
              </div>
              <h2 className="text-2xl font-bold">Welcome back</h2>
              <p className="text-sm text-muted-foreground">Sign in to your RiskLens account</p>
            </CardHeader>

            <CardContent className="px-8 pb-8">
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    autoComplete="username"
                    className="h-11"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      autoComplete="current-password"
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
                </div>

                {loginError && (
                  <div className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md px-3 py-2">
                    {(loginError as Error).message || "Invalid username or password"}
                  </div>
                )}

                <Button type="submit" className="h-11 w-full mt-1" disabled={isLoggingIn}>
                  {isLoggingIn ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z" />
                      </svg>
                      Signing in...
                    </span>
                  ) : "Sign In"}
                </Button>

                {/* Demo hint */}
                <div className="rounded-md bg-muted/50 border border-border px-3 py-2.5 text-xs text-muted-foreground text-center">
                  Demo credentials: <span className="font-medium text-foreground">admin</span> / <span className="font-medium text-foreground">admin123</span>
                </div>

                <p className="text-sm text-center text-muted-foreground">
                  Don't have an account?{" "}
                  <button
                    type="button"
                    onClick={() => navigate("/register")}
                    className="text-primary font-medium hover:underline"
                  >
                    Create account
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
