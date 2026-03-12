import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { RiskGauge, RiskBadge } from "@/components/risk-gauge";
import { apiRequest, queryClient } from "@/lib/queryClient";
import {
  ShieldAlert,
  Zap,
  Brain,
  Target,
  TrendingDown,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  BarChart3,
} from "lucide-react";
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import type { Customer, Prediction } from "@shared/schema";

export default function RiskAnalysisPage() {
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>("");
  const [selectedModel, setSelectedModel] = useState("logistic_regression");
  const { toast } = useToast();

  const { data: customers, isLoading: loadingCustomers } = useQuery<Customer[]>({
    queryKey: ["/api/customers"],
  });

  const { data: predictions, isLoading: loadingPredictions } = useQuery<Prediction[]>({
    queryKey: ["/api/predictions"],
  });

  const runPrediction = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/predictions/run", {
        customerId: selectedCustomerId,
        modelName: selectedModel,
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/predictions"] });
      queryClient.invalidateQueries({ queryKey: ["/api/customers"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      toast({ title: "Risk prediction completed" });
    },
    onError: (err: Error) => {
      toast({ title: "Prediction failed", description: err.message, variant: "destructive" });
    },
  });

  const runBatchPrediction = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/predictions/batch", {
        modelName: selectedModel,
      });
      return res.json();
    },
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["/api/predictions"] });
      queryClient.invalidateQueries({ queryKey: ["/api/customers"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      toast({ title: `Batch prediction completed for ${data.count || "all"} customers` });
    },
    onError: (err: Error) => {
      toast({ title: "Batch prediction failed", description: err.message, variant: "destructive" });
    },
  });

  const selectedCustomer = customers?.find((c) => c.id === selectedCustomerId);
  const customerPredictions = predictions?.filter((p) => p.customerId === selectedCustomerId) || [];
  const latestPrediction = customerPredictions[0];

  const radarData = selectedCustomer
    ? [
        { factor: "Credit Score", value: Math.min((selectedCustomer.creditScore / 850) * 100, 100) },
        { factor: "Income", value: Math.min((selectedCustomer.annualIncome / 200000) * 100, 100) },
        { factor: "Employment", value: Math.min((selectedCustomer.employmentYears / 20) * 100, 100) },
        { factor: "Debt Ratio", value: Math.max(0, 100 - (selectedCustomer.existingLoans * 20)) },
        { factor: "Stability", value: selectedCustomer.homeOwnership === "Own" ? 90 : selectedCustomer.homeOwnership === "Mortgage" ? 60 : 30 },
      ]
    : [];

  const featureImportance = latestPrediction?.features
    ? Object.entries(latestPrediction.features as Record<string, number>)
        .map(([name, value]) => ({ name, value: Math.round(value * 100) }))
        .sort((a, b) => b.value - a.value)
    : [
        { name: "Credit Score", value: 28 },
        { name: "Annual Income", value: 22 },
        { name: "Employment Years", value: 18 },
        { name: "Existing Loans", value: 15 },
        { name: "Home Ownership", value: 10 },
        { name: "Age", value: 7 },
      ];

  return (
    <div className="flex flex-col gap-6 p-6 max-w-[1400px] mx-auto">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold tracking-tight" data-testid="text-risk-title">
            Risk Analysis
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Run credit default predictions and analyze risk factors
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => runBatchPrediction.mutate()}
          disabled={runBatchPrediction.isPending}
          data-testid="button-batch-predict"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${runBatchPrediction.isPending ? "animate-spin" : ""}`} />
          {runBatchPrediction.isPending ? "Processing..." : "Run Batch Analysis"}
        </Button>
      </div>

      <Card>
        <CardContent className="p-5">
          <div className="flex items-end gap-4 flex-wrap">
            <div className="flex-1 min-w-[200px]">
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Customer</label>
              <Select value={selectedCustomerId} onValueChange={setSelectedCustomerId}>
                <SelectTrigger data-testid="select-customer">
                  <SelectValue placeholder="Select a customer" />
                </SelectTrigger>
                <SelectContent>
                  {customers?.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name} - Score: {c.creditScore}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="min-w-[180px]">
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Model</label>
              <Select value={selectedModel} onValueChange={setSelectedModel}>
                <SelectTrigger data-testid="select-model">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="logistic_regression">Logistic Regression</SelectItem>
                  <SelectItem value="random_forest">Random Forest</SelectItem>
                  <SelectItem value="xgboost">XGBoost</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button
              onClick={() => runPrediction.mutate()}
              disabled={!selectedCustomerId || runPrediction.isPending}
              data-testid="button-run-prediction"
            >
              <Zap className="w-4 h-4 mr-2" />
              {runPrediction.isPending ? "Analyzing..." : "Run Prediction"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {selectedCustomer && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Card className="lg:col-span-1">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Brain className="w-4 h-4" />
                Risk Profile
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center gap-4">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-primary text-2xl font-bold">
                  {selectedCustomer.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                </div>
                <div className="text-center">
                  <p className="font-semibold">{selectedCustomer.name}</p>
                  <p className="text-xs text-muted-foreground">{selectedCustomer.occupation || "N/A"}</p>
                </div>
                <RiskGauge
                  value={selectedCustomer.defaultProbability || 0}
                  size="lg"
                  showLabel
                />
                <div className="w-full grid grid-cols-2 gap-3 mt-2">
                  <div className="p-3 rounded-md bg-muted/30 text-center">
                    <p className="text-xs text-muted-foreground">Credit Score</p>
                    <p className="text-lg font-bold">{selectedCustomer.creditScore}</p>
                  </div>
                  <div className="p-3 rounded-md bg-muted/30 text-center">
                    <p className="text-xs text-muted-foreground">Income</p>
                    <p className="text-lg font-bold">${(selectedCustomer.annualIncome / 1000).toFixed(0)}K</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Target className="w-4 h-4" />
                Risk Factors (Radar)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="hsl(210, 5%, 80%)" />
                    <PolarAngleAxis dataKey="factor" tick={{ fontSize: 10 }} />
                    <Radar
                      dataKey="value"
                      stroke="hsl(217, 91%, 45%)"
                      fill="hsl(217, 91%, 45%)"
                      fillOpacity={0.2}
                      strokeWidth={2}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                Feature Importance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-3">
                {featureImportance.map((f, i) => (
                  <div key={f.name} className="flex flex-col gap-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium">{f.name}</span>
                      <span className="text-xs text-muted-foreground">{f.value}%</span>
                    </div>
                    <Progress value={f.value} className="h-1.5" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {selectedCustomer && latestPrediction && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Prediction Result</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="flex items-center gap-3 p-3 rounded-md bg-muted/30">
                {latestPrediction.riskCategory === "Low" ? (
                  <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                ) : (
                  <AlertCircle className="w-8 h-8 text-amber-500" />
                )}
                <div>
                  <p className="text-xs text-muted-foreground">Verdict</p>
                  <p className="text-sm font-semibold">
                    {latestPrediction.defaultProbability > 50 ? "Likely Default" : "Low Default Risk"}
                  </p>
                </div>
              </div>
              <div className="p-3 rounded-md bg-muted/30">
                <p className="text-xs text-muted-foreground">Default Probability</p>
                <p className="text-xl font-bold">{latestPrediction.defaultProbability.toFixed(1)}%</p>
              </div>
              <div className="p-3 rounded-md bg-muted/30">
                <p className="text-xs text-muted-foreground">Model Confidence</p>
                <p className="text-xl font-bold">{(latestPrediction.confidence * 100).toFixed(1)}%</p>
              </div>
              <div className="p-3 rounded-md bg-muted/30">
                <p className="text-xs text-muted-foreground">Risk Category</p>
                <RiskBadge category={latestPrediction.riskCategory} className="mt-1" />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-3 pb-2">
          <CardTitle className="text-sm" data-testid="text-recent-predictions">Recent Predictions</CardTitle>
          <Badge variant="secondary" className="text-xs" data-testid="badge-predictions-total">{predictions?.length || 0} total</Badge>
        </CardHeader>
        <CardContent>
          {loadingPredictions ? (
            <Skeleton className="h-32 w-full" />
          ) : !predictions || predictions.length === 0 ? (
            <div className="text-center py-8">
              <ShieldAlert className="w-12 h-12 text-muted-foreground/40 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">No predictions yet. Run an analysis above.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left">
                    <th className="pb-2 font-medium text-muted-foreground text-xs">Customer</th>
                    <th className="pb-2 font-medium text-muted-foreground text-xs">Model</th>
                    <th className="pb-2 font-medium text-muted-foreground text-xs">Default Prob</th>
                    <th className="pb-2 font-medium text-muted-foreground text-xs">Confidence</th>
                    <th className="pb-2 font-medium text-muted-foreground text-xs">Risk</th>
                    <th className="pb-2 font-medium text-muted-foreground text-xs">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {predictions.map((pred) => {
                    const cust = customers?.find((c) => c.id === pred.customerId);
                    return (
                      <tr key={pred.id} className="border-b last:border-0" data-testid={`prediction-row-${pred.id}`}>
                        <td className="py-3 font-medium">{cust?.name || "Unknown"}</td>
                        <td className="py-3">
                          <Badge variant="outline" className="text-xs font-mono">
                            {pred.modelName.replace(/_/g, " ")}
                          </Badge>
                        </td>
                        <td className="py-3">
                          <RiskGauge value={pred.defaultProbability} size="sm" showLabel={false} />
                        </td>
                        <td className="py-3 tabular-nums">{(pred.confidence * 100).toFixed(1)}%</td>
                        <td className="py-3"><RiskBadge category={pred.riskCategory} /></td>
                        <td className="py-3 text-muted-foreground text-xs">
                          {pred.createdAt ? new Date(pred.createdAt).toLocaleDateString() : "N/A"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
