import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { StatCard } from "@/components/stat-card";
import { RiskGauge, RiskBadge } from "@/components/risk-gauge";
import {
  Users,
  DollarSign,
  ShieldAlert,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  ArrowUpRight,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import type { Customer, Loan } from "@shared/schema";

const RISK_COLORS = {
  Low: "hsl(142, 76%, 36%)",
  Medium: "hsl(37, 90%, 50%)",
  High: "hsl(25, 95%, 53%)",
  Critical: "hsl(0, 84%, 42%)",
};

function DashboardSkeleton() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardContent className="p-5">
              <Skeleton className="h-20 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {[1, 2].map((i) => (
          <Card key={i}>
            <CardContent className="p-5">
              <Skeleton className="h-64 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { data: customers, isLoading: loadingCustomers } = useQuery<Customer[]>({
    queryKey: ["/api/customers"],
  });

  const { data: loans, isLoading: loadingLoans } = useQuery<Loan[]>({
    queryKey: ["/api/loans"],
  });

  const { data: stats, isLoading: loadingStats } = useQuery<{
    totalCustomers: number;
    totalLoans: number;
    totalLoanAmount: number;
    avgRiskScore: number;
    defaultRate: number;
    riskDistribution: { category: string; count: number }[];
    monthlyTrend: { month: string; defaults: number; approved: number }[];
  }>({
    queryKey: ["/api/dashboard/stats"],
  });

  if (loadingCustomers || loadingLoans || loadingStats) {
    return <DashboardSkeleton />;
  }

  const riskDistData = stats?.riskDistribution || [];
  const monthlyTrendData = stats?.monthlyTrend || [];

  const creditScoreData = customers
    ? [
        { range: "300-499", count: customers.filter((c) => c.creditScore >= 300 && c.creditScore < 500).length },
        { range: "500-599", count: customers.filter((c) => c.creditScore >= 500 && c.creditScore < 600).length },
        { range: "600-699", count: customers.filter((c) => c.creditScore >= 600 && c.creditScore < 700).length },
        { range: "700-799", count: customers.filter((c) => c.creditScore >= 700 && c.creditScore < 800).length },
        { range: "800-850", count: customers.filter((c) => c.creditScore >= 800).length },
      ]
    : [];

  const incomeVsRisk = customers?.slice(0, 30).map((c) => ({
    name: c.name.split(" ")[0],
    income: Math.round((c.annualIncome || 0) / 1000),
    risk: Math.round(c.defaultProbability || 0),
  })) || [];

  const recentCustomers = customers?.slice(-5).reverse() || [];

  return (
    <div className="flex flex-col gap-6 p-6 max-w-[1400px] mx-auto">
      <div className="flex items-center justify-between gap-4 flex-wrap" data-testid="section-dashboard-header">
        <div>
          <h1 className="text-2xl font-bold tracking-tight" data-testid="text-dashboard-title">
            Risk Dashboard
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Financial risk overview and credit default analytics
          </p>
        </div>
        <Badge variant="outline" className="text-xs" data-testid="badge-realtime">
          <Clock className="w-3 h-3 mr-1" />
          Real-time
        </Badge>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Customers"
          value={stats?.totalCustomers || 0}
          subtitle="Active profiles"
          icon={Users}
          trend={{ value: 12.5, label: "vs last month" }}
          variant="default"
          testId="stat-total-customers"
        />
        <StatCard
          title="Active Loans"
          value={stats?.totalLoans || 0}
          subtitle={`$${((stats?.totalLoanAmount || 0) / 1000000).toFixed(1)}M total`}
          icon={DollarSign}
          trend={{ value: 8.2, label: "vs last month" }}
          variant="success"
          testId="stat-active-loans"
        />
        <StatCard
          title="Avg Risk Score"
          value={`${(stats?.avgRiskScore || 0).toFixed(1)}%`}
          subtitle="Portfolio average"
          icon={ShieldAlert}
          trend={{ value: -3.1, label: "improving" }}
          variant="warning"
          testId="stat-avg-risk"
        />
        <StatCard
          title="Default Rate"
          value={`${(stats?.defaultRate || 0).toFixed(1)}%`}
          subtitle="Current period"
          icon={AlertTriangle}
          trend={{ value: -5.4, label: "vs last quarter" }}
          variant="danger"
          testId="stat-default-rate"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between gap-3 pb-2">
            <CardTitle className="text-sm font-medium" data-testid="text-chart-monthly">Monthly Default vs Approved Trends</CardTitle>
            <Badge variant="secondary" className="text-xs" data-testid="badge-6months">6 months</Badge>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyTrendData}>
                  <defs>
                    <linearGradient id="approvedGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(142, 76%, 36%)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(142, 76%, 36%)" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="defaultGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(0, 84%, 42%)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(0, 84%, 42%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(210, 5%, 85%)" strokeOpacity={0.5} />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="hsl(210, 5%, 60%)" />
                  <YAxis tick={{ fontSize: 11 }} stroke="hsl(210, 5%, 60%)" />
                  <Tooltip
                    contentStyle={{
                      background: "hsl(210, 5%, 98%)",
                      border: "1px solid hsl(210, 5%, 90%)",
                      borderRadius: "6px",
                      fontSize: "12px",
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: "11px" }} />
                  <Area type="monotone" dataKey="approved" stroke="hsl(142, 76%, 36%)" fill="url(#approvedGrad)" strokeWidth={2} name="Approved" />
                  <Area type="monotone" dataKey="defaults" stroke="hsl(0, 84%, 42%)" fill="url(#defaultGrad)" strokeWidth={2} name="Defaults" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Risk Distribution</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={riskDistData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="count"
                    nameKey="category"
                  >
                    {riskDistData.map((entry) => (
                      <Cell
                        key={entry.category}
                        fill={RISK_COLORS[entry.category as keyof typeof RISK_COLORS] || RISK_COLORS.Medium}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: "hsl(210, 5%, 98%)",
                      border: "1px solid hsl(210, 5%, 90%)",
                      borderRadius: "6px",
                      fontSize: "12px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap gap-3 justify-center mt-2">
              {riskDistData.map((item) => (
                <div key={item.category} className="flex items-center gap-1.5">
                  <div
                    className="w-2.5 h-2.5 rounded-sm"
                    style={{ backgroundColor: RISK_COLORS[item.category as keyof typeof RISK_COLORS] }}
                  />
                  <span className="text-xs text-muted-foreground">{item.category} ({item.count})</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Credit Score Distribution</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={creditScoreData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(210, 5%, 85%)" strokeOpacity={0.5} />
                  <XAxis dataKey="range" tick={{ fontSize: 11 }} stroke="hsl(210, 5%, 60%)" />
                  <YAxis tick={{ fontSize: 11 }} stroke="hsl(210, 5%, 60%)" />
                  <Tooltip
                    contentStyle={{
                      background: "hsl(210, 5%, 98%)",
                      border: "1px solid hsl(210, 5%, 90%)",
                      borderRadius: "6px",
                      fontSize: "12px",
                    }}
                  />
                  <Bar dataKey="count" fill="hsl(217, 91%, 35%)" radius={[4, 4, 0, 0]} name="Customers" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-3 pb-2">
            <CardTitle className="text-sm font-medium" data-testid="text-recent-profiles">Recent Customer Risk Profiles</CardTitle>
            <Badge variant="outline" className="text-xs" data-testid="badge-latest">Latest</Badge>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex flex-col gap-3">
              {recentCustomers.map((customer) => (
                <div
                  key={customer.id}
                  className="flex items-center justify-between gap-3 p-3 rounded-md bg-muted/30"
                  data-testid={`customer-row-${customer.id}`}
                >
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-medium truncate">{customer.name}</span>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs text-muted-foreground">
                        Score: {customer.creditScore}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Income: ${(customer.annualIncome / 1000).toFixed(0)}K
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <RiskGauge
                      value={customer.defaultProbability || 0}
                      size="sm"
                      showLabel={false}
                    />
                    <RiskBadge category={customer.riskCategory || "Medium"} />
                  </div>
                </div>
              ))}
              {recentCustomers.length === 0 && (
                <div className="text-center py-8 text-sm text-muted-foreground">
                  No customer data available yet
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-md bg-emerald-500/10">
                <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <p className="text-sm font-medium">Model Accuracy</p>
                <p className="text-2xl font-bold">92.4%</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-md bg-primary/10">
                <TrendingUp className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">ROC-AUC Score</p>
                <p className="text-2xl font-bold">0.89</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-md bg-amber-500/10">
                <ArrowUpRight className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="text-sm font-medium">Portfolio Value</p>
                <p className="text-2xl font-bold">${((stats?.totalLoanAmount || 0) / 1000000).toFixed(1)}M</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
