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
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import {
  FileText,
  Download,
  Plus,
  Calendar,
  BarChart3,
  Users,
  ShieldCheck,
  TrendingUp,
  Clock,
  FileBarChart,
} from "lucide-react";
import type { Report } from "@shared/schema";

const reportTypes = [
  { value: "risk_summary", label: "Risk Summary Report", icon: ShieldCheck, description: "Overview of portfolio risk distribution and default statistics" },
  { value: "customer_analysis", label: "Customer Analysis", icon: Users, description: "Detailed breakdown of customer demographics and financial profiles" },
  { value: "model_performance", label: "Model Performance", icon: BarChart3, description: "ML model evaluation metrics and comparison results" },
  { value: "portfolio_health", label: "Portfolio Health", icon: TrendingUp, description: "Loan portfolio status, NPA tracking, and health indicators" },
];

function ReportCard({ report }: { report: Report }) {
  const typeInfo = reportTypes.find((t) => t.value === report.type);
  const Icon = typeInfo?.icon || FileText;
  const reportData = report.data as Record<string, unknown> | null;

  return (
    <Card className="hover-elevate" data-testid={`card-report-${report.id}`}>
      <CardContent className="p-5">
        <div className="flex items-start gap-4">
          <div className="flex items-center justify-center w-10 h-10 rounded-md bg-primary/10 shrink-0">
            <Icon className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h3 className="text-sm font-semibold truncate">{report.title}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {typeInfo?.description || report.type}
                </p>
              </div>
              <Badge variant="outline" className="text-xs shrink-0">
                {report.type.replace(/_/g, " ")}
              </Badge>
            </div>

            {report.summary && (
              <p className="text-xs text-muted-foreground mt-3 line-clamp-2">{report.summary}</p>
            )}

            {reportData && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-3">
                {Object.entries(reportData)
                  .slice(0, 6)
                  .map(([key, val]) => (
                    <div key={key} className="p-2 rounded-md bg-muted/30">
                      <p className="text-xs text-muted-foreground truncate">
                        {key.replace(/_/g, " ")}
                      </p>
                      <p className="text-sm font-medium mt-0.5">
                        {typeof val === "number" ? val.toLocaleString() : String(val)}
                      </p>
                    </div>
                  ))}
              </div>
            )}

            <div className="flex items-center justify-between gap-3 mt-4 pt-3 border-t flex-wrap">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Calendar className="w-3 h-3" />
                {report.createdAt ? new Date(report.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                }) : "N/A"}
              </div>
              <Button variant="ghost" size="sm" data-testid={`button-download-${report.id}`}>
                <Download className="w-3 h-3 mr-1" />
                Export
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function ReportsPage() {
  const [selectedType, setSelectedType] = useState("risk_summary");
  const { toast } = useToast();

  const { data: reports, isLoading } = useQuery<Report[]>({
    queryKey: ["/api/reports"],
  });

  const generateReport = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/reports/generate", {
        type: selectedType,
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/reports"] });
      toast({ title: "Report generated successfully" });
    },
    onError: (err: Error) => {
      toast({ title: "Failed to generate report", description: err.message, variant: "destructive" });
    },
  });

  return (
    <div className="flex flex-col gap-6 p-6 max-w-[1400px] mx-auto">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold tracking-tight" data-testid="text-reports-title">
            Reports
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Generate and view analytical reports
          </p>
        </div>
        <Badge variant="secondary" className="text-xs">
          <FileBarChart className="w-3 h-3 mr-1" />
          {reports?.length || 0} reports
        </Badge>
      </div>

      <Card>
        <CardContent className="p-5">
          <h3 className="text-sm font-semibold mb-3">Generate New Report</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
            {reportTypes.map((rt) => {
              const Icon = rt.icon;
              const isSelected = selectedType === rt.value;
              return (
                <button
                  key={rt.value}
                  onClick={() => setSelectedType(rt.value)}
                  className={`flex flex-col items-start gap-2 p-3 rounded-md border text-left transition-colors ${
                    isSelected
                      ? "border-primary bg-primary/5"
                      : "border-transparent bg-muted/30 hover-elevate"
                  }`}
                  data-testid={`button-type-${rt.value}`}
                >
                  <div className={`flex items-center justify-center w-8 h-8 rounded-md ${isSelected ? "bg-primary/10" : "bg-muted/50"}`}>
                    <Icon className={`w-4 h-4 ${isSelected ? "text-primary" : "text-muted-foreground"}`} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold">{rt.label}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{rt.description}</p>
                  </div>
                </button>
              );
            })}
          </div>
          <Button
            onClick={() => generateReport.mutate()}
            disabled={generateReport.isPending}
            data-testid="button-generate-report"
          >
            <Plus className="w-4 h-4 mr-2" />
            {generateReport.isPending ? "Generating..." : "Generate Report"}
          </Button>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="flex flex-col gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="p-5">
                <Skeleton className="h-32 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : !reports || reports.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <FileText className="w-12 h-12 text-muted-foreground/40 mb-3" />
            <p className="text-sm font-medium text-muted-foreground">No reports generated yet</p>
            <p className="text-xs text-muted-foreground mt-1">
              Select a report type above and click generate
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-col gap-4">
          {reports.map((report) => (
            <ReportCard key={report.id} report={report} />
          ))}
        </div>
      )}
    </div>
  );
}
