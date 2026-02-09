import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  BarChart3,
  Target,
  Activity,
  TrendingUp,
  CheckCircle,
  Brain,
  Layers,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
  Legend,
  LineChart,
  Line,
} from "recharts";
import type { ModelMetric } from "@shared/schema";

function MetricCard({
  title,
  value,
  target,
  icon: Icon,
  color,
}: {
  title: string;
  value: number;
  target: number;
  icon: typeof Target;
  color: string;
}) {
  const percentage = (value / target) * 100;
  const isGood = value >= target;

  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{title}</p>
            <p className="text-2xl font-bold mt-1">{(value * 100).toFixed(1)}%</p>
          </div>
          <div className={`flex items-center justify-center w-10 h-10 rounded-md ${color}`}>
            <Icon className="w-5 h-5" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Progress value={Math.min(percentage, 100)} className="h-1.5 flex-1" />
          <span className="text-xs text-muted-foreground">
            {isGood ? "Above" : "Below"} {(target * 100).toFixed(0)}%
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

export default function ModelMetricsPage() {
  const { data: metrics, isLoading } = useQuery<ModelMetric[]>({
    queryKey: ["/api/model-metrics"],
  });

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 p-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}><CardContent className="p-5"><Skeleton className="h-24 w-full" /></CardContent></Card>
          ))}
        </div>
      </div>
    );
  }

  const latest = metrics?.[0];
  const allMetrics = metrics || [];

  const comparisonData = allMetrics.map((m) => ({
    model: m.modelName.replace(/_/g, " "),
    Accuracy: Math.round(m.accuracy * 100),
    Precision: Math.round(m.precision * 100),
    Recall: Math.round(m.recall * 100),
    "F1 Score": Math.round(m.f1Score * 100),
    "ROC-AUC": Math.round(m.rocAuc * 100),
  }));

  const radialData = latest
    ? [
        { name: "ROC-AUC", value: Math.round(latest.rocAuc * 100), fill: "hsl(217, 91%, 45%)" },
        { name: "F1 Score", value: Math.round(latest.f1Score * 100), fill: "hsl(142, 76%, 36%)" },
        { name: "Recall", value: Math.round(latest.recall * 100), fill: "hsl(37, 90%, 50%)" },
        { name: "Precision", value: Math.round(latest.precision * 100), fill: "hsl(271, 91%, 55%)" },
        { name: "Accuracy", value: Math.round(latest.accuracy * 100), fill: "hsl(340, 82%, 50%)" },
      ]
    : [];

  const confMatrix = (latest?.confusionMatrix as { tp: number; fp: number; tn: number; fn: number }) || {
    tp: 0,
    fp: 0,
    tn: 0,
    fn: 0,
  };

  const featureImp = (latest?.featureImportance as Record<string, number>) || {};
  const featureData = Object.entries(featureImp)
    .map(([name, value]) => ({ name, value: Math.round(value * 100) }))
    .sort((a, b) => b.value - a.value);

  return (
    <div className="flex flex-col gap-6 p-6 max-w-[1400px] mx-auto">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold tracking-tight" data-testid="text-metrics-title">
            Model Metrics
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Evaluation metrics and model performance analysis
          </p>
        </div>
        {latest && (
          <Badge variant="outline" className="text-xs">
            <Brain className="w-3 h-3 mr-1" />
            Best: {latest.modelName.replace(/_/g, " ")}
          </Badge>
        )}
      </div>

      {latest && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <MetricCard
            title="Accuracy"
            value={latest.accuracy}
            target={0.85}
            icon={Target}
            color="bg-primary/10 text-primary"
          />
          <MetricCard
            title="Precision"
            value={latest.precision}
            target={0.75}
            icon={CheckCircle}
            color="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
          />
          <MetricCard
            title="Recall"
            value={latest.recall}
            target={0.70}
            icon={Activity}
            color="bg-amber-500/10 text-amber-600 dark:text-amber-400"
          />
          <MetricCard
            title="F1 Score"
            value={latest.f1Score}
            target={0.75}
            icon={TrendingUp}
            color="bg-purple-500/10 text-purple-600 dark:text-purple-400"
          />
          <MetricCard
            title="ROC-AUC"
            value={latest.rocAuc}
            target={0.80}
            icon={BarChart3}
            color="bg-blue-500/10 text-blue-600 dark:text-blue-400"
          />
        </div>
      )}

      <Tabs defaultValue="comparison" className="w-full">
        <TabsList data-testid="tabs-metrics">
          <TabsTrigger value="comparison" data-testid="tab-comparison">Model Comparison</TabsTrigger>
          <TabsTrigger value="radial" data-testid="tab-radial">Performance Radial</TabsTrigger>
          <TabsTrigger value="confusion" data-testid="tab-confusion">Confusion Matrix</TabsTrigger>
          <TabsTrigger value="features" data-testid="tab-features">Feature Importance</TabsTrigger>
        </TabsList>

        <TabsContent value="comparison" className="mt-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Model Performance Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              {comparisonData.length === 0 ? (
                <div className="text-center py-12">
                  <Layers className="w-12 h-12 text-muted-foreground/40 mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">No model metrics available yet</p>
                </div>
              ) : (
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={comparisonData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(210, 5%, 85%)" strokeOpacity={0.5} />
                      <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11 }} />
                      <YAxis type="category" dataKey="model" tick={{ fontSize: 11 }} width={120} />
                      <Tooltip contentStyle={{ background: "hsl(210, 5%, 98%)", border: "1px solid hsl(210, 5%, 90%)", borderRadius: "6px", fontSize: "12px" }} />
                      <Legend wrapperStyle={{ fontSize: "11px" }} />
                      <Bar dataKey="Accuracy" fill="hsl(217, 91%, 45%)" radius={[0, 3, 3, 0]} />
                      <Bar dataKey="Precision" fill="hsl(142, 76%, 36%)" radius={[0, 3, 3, 0]} />
                      <Bar dataKey="Recall" fill="hsl(37, 90%, 50%)" radius={[0, 3, 3, 0]} />
                      <Bar dataKey="ROC-AUC" fill="hsl(271, 91%, 55%)" radius={[0, 3, 3, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="radial" className="mt-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Best Model Performance (Radial)</CardTitle>
            </CardHeader>
            <CardContent>
              {radialData.length === 0 ? (
                <div className="text-center py-12 text-sm text-muted-foreground">No data available</div>
              ) : (
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadialBarChart
                      cx="50%"
                      cy="50%"
                      innerRadius="20%"
                      outerRadius="90%"
                      data={radialData}
                      startAngle={180}
                      endAngle={0}
                    >
                      <RadialBar background dataKey="value" />
                      <Legend
                        iconSize={10}
                        layout="horizontal"
                        verticalAlign="bottom"
                        wrapperStyle={{ fontSize: "11px" }}
                      />
                      <Tooltip contentStyle={{ background: "hsl(210, 5%, 98%)", border: "1px solid hsl(210, 5%, 90%)", borderRadius: "6px", fontSize: "12px" }} />
                    </RadialBarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="confusion" className="mt-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Confusion Matrix</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="max-w-md mx-auto">
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div />
                  <div className="text-xs font-semibold text-muted-foreground py-2">Predicted No Default</div>
                  <div className="text-xs font-semibold text-muted-foreground py-2">Predicted Default</div>

                  <div className="text-xs font-semibold text-muted-foreground flex items-center justify-center">
                    Actual No Default
                  </div>
                  <div className="p-4 rounded-md bg-emerald-500/10 border border-emerald-500/20">
                    <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{confMatrix.tn}</p>
                    <p className="text-xs text-muted-foreground mt-1">True Negative</p>
                  </div>
                  <div className="p-4 rounded-md bg-red-500/10 border border-red-500/20">
                    <p className="text-2xl font-bold text-red-600 dark:text-red-400">{confMatrix.fp}</p>
                    <p className="text-xs text-muted-foreground mt-1">False Positive</p>
                  </div>

                  <div className="text-xs font-semibold text-muted-foreground flex items-center justify-center">
                    Actual Default
                  </div>
                  <div className="p-4 rounded-md bg-amber-500/10 border border-amber-500/20">
                    <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">{confMatrix.fn}</p>
                    <p className="text-xs text-muted-foreground mt-1">False Negative</p>
                  </div>
                  <div className="p-4 rounded-md bg-emerald-500/10 border border-emerald-500/20">
                    <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{confMatrix.tp}</p>
                    <p className="text-xs text-muted-foreground mt-1">True Positive</p>
                  </div>
                </div>
                <div className="mt-4 p-3 rounded-md bg-muted/30 text-xs text-muted-foreground text-center">
                  Total Samples: {confMatrix.tp + confMatrix.fp + confMatrix.tn + confMatrix.fn}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="features" className="mt-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Feature Importance Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              {featureData.length === 0 ? (
                <div className="text-center py-12 text-sm text-muted-foreground">No feature data available</div>
              ) : (
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={featureData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(210, 5%, 85%)" strokeOpacity={0.5} />
                      <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11 }} />
                      <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={140} />
                      <Tooltip contentStyle={{ background: "hsl(210, 5%, 98%)", border: "1px solid hsl(210, 5%, 90%)", borderRadius: "6px", fontSize: "12px" }} />
                      <Bar dataKey="value" fill="hsl(217, 91%, 45%)" radius={[0, 4, 4, 0]} name="Importance %" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {allMetrics.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">All Model Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left">
                    <th className="pb-2 font-medium text-muted-foreground text-xs">Model</th>
                    <th className="pb-2 font-medium text-muted-foreground text-xs">Accuracy</th>
                    <th className="pb-2 font-medium text-muted-foreground text-xs">Precision</th>
                    <th className="pb-2 font-medium text-muted-foreground text-xs">Recall</th>
                    <th className="pb-2 font-medium text-muted-foreground text-xs">F1</th>
                    <th className="pb-2 font-medium text-muted-foreground text-xs">ROC-AUC</th>
                    <th className="pb-2 font-medium text-muted-foreground text-xs">Trained</th>
                  </tr>
                </thead>
                <tbody>
                  {allMetrics.map((m) => (
                    <tr key={m.id} className="border-b last:border-0">
                      <td className="py-3">
                        <Badge variant="outline" className="text-xs font-mono">
                          {m.modelName.replace(/_/g, " ")}
                        </Badge>
                      </td>
                      <td className="py-3 tabular-nums font-medium">{(m.accuracy * 100).toFixed(1)}%</td>
                      <td className="py-3 tabular-nums">{(m.precision * 100).toFixed(1)}%</td>
                      <td className="py-3 tabular-nums">{(m.recall * 100).toFixed(1)}%</td>
                      <td className="py-3 tabular-nums">{(m.f1Score * 100).toFixed(1)}%</td>
                      <td className="py-3 tabular-nums font-semibold">{(m.rocAuc * 100).toFixed(1)}%</td>
                      <td className="py-3 text-muted-foreground text-xs">
                        {m.trainedAt ? new Date(m.trainedAt).toLocaleDateString() : "N/A"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
