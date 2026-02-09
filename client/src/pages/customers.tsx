import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { RiskGauge, RiskBadge } from "@/components/risk-gauge";
import { apiRequest, queryClient } from "@/lib/queryClient";
import {
  Search,
  Plus,
  Users,
  Mail,
  Phone,
  Briefcase,
  DollarSign,
  CreditCard,
  Filter,
  ChevronRight,
  X,
} from "lucide-react";
import type { Customer } from "@shared/schema";

function CustomerDetailPanel({ customer, onClose }: { customer: Customer; onClose: () => void }) {
  return (
    <div className="fixed inset-y-0 right-0 w-full max-w-md bg-background border-l z-50 overflow-y-auto">
      <div className="p-6 flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Customer Details</h2>
          <Button size="icon" variant="ghost" onClick={onClose} data-testid="button-close-detail">
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex flex-col gap-1 items-center text-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xl font-bold">
            {customer.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
          </div>
          <h3 className="text-lg font-semibold mt-2">{customer.name}</h3>
          <p className="text-sm text-muted-foreground">{customer.occupation || "Not specified"}</p>
          <RiskBadge category={customer.riskCategory || "Medium"} className="mt-1" />
        </div>

        <Card>
          <CardContent className="p-4 grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted-foreground">Age</p>
              <p className="text-sm font-medium">{customer.age}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Gender</p>
              <p className="text-sm font-medium">{customer.gender}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Email</p>
              <p className="text-sm font-medium truncate">{customer.email}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Phone</p>
              <p className="text-sm font-medium">{customer.phone || "N/A"}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Marital Status</p>
              <p className="text-sm font-medium">{customer.maritalStatus || "N/A"}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Dependents</p>
              <p className="text-sm font-medium">{customer.dependents || 0}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Financial Profile</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted-foreground">Annual Income</p>
              <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                ${customer.annualIncome?.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Monthly Expenses</p>
              <p className="text-sm font-semibold">
                ${customer.monthlyExpenses?.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Credit Score</p>
              <p className="text-sm font-semibold">{customer.creditScore}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Existing Loans</p>
              <p className="text-sm font-semibold">{customer.existingLoans}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Employment</p>
              <p className="text-sm font-semibold">{customer.employmentYears} yrs</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Home</p>
              <p className="text-sm font-semibold">{customer.homeOwnership}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Risk Assessment</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Default Probability</span>
              <RiskGauge value={customer.defaultProbability || 0} size="md" showLabel={false} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Risk Score</span>
              <span className="text-sm font-semibold">{(customer.riskScore || 0).toFixed(1)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Category</span>
              <RiskBadge category={customer.riskCategory || "Medium"} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function CustomersPage() {
  const [search, setSearch] = useState("");
  const [riskFilter, setRiskFilter] = useState<string>("all");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const { toast } = useToast();

  const { data: customers, isLoading } = useQuery<Customer[]>({
    queryKey: ["/api/customers"],
  });

  const addMutation = useMutation({
    mutationFn: async (data: Record<string, unknown>) => {
      const res = await apiRequest("POST", "/api/customers", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/customers"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      setAddOpen(false);
      toast({ title: "Customer added successfully" });
    },
    onError: (err: Error) => {
      toast({ title: "Failed to add customer", description: err.message, variant: "destructive" });
    },
  });

  const filtered = customers?.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase());
    const matchesRisk = riskFilter === "all" || c.riskCategory?.toLowerCase() === riskFilter.toLowerCase();
    return matchesSearch && matchesRisk;
  }) || [];

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    addMutation.mutate({
      name: fd.get("name") as string,
      age: parseInt(fd.get("age") as string),
      gender: fd.get("gender") as string,
      email: fd.get("email") as string,
      phone: fd.get("phone") as string,
      occupation: fd.get("occupation") as string,
      annualIncome: parseFloat(fd.get("annualIncome") as string),
      monthlyExpenses: parseFloat(fd.get("monthlyExpenses") as string),
      creditScore: parseInt(fd.get("creditScore") as string),
      existingLoans: parseInt(fd.get("existingLoans") as string || "0"),
      employmentYears: parseFloat(fd.get("employmentYears") as string),
      homeOwnership: fd.get("homeOwnership") as string,
      maritalStatus: fd.get("maritalStatus") as string,
      dependents: parseInt(fd.get("dependents") as string || "0"),
    });
  };

  return (
    <div className="flex flex-col gap-6 p-6 max-w-[1400px] mx-auto">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold tracking-tight" data-testid="text-customers-title">
            Customers
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage customer profiles and financial data
          </p>
        </div>
        <Dialog open={addOpen} onOpenChange={setAddOpen}>
          <DialogTrigger asChild>
            <Button data-testid="button-add-customer">
              <Plus className="w-4 h-4 mr-2" />
              Add Customer
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Customer</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-3 mt-4">
              <div className="col-span-2">
                <Label>Full Name</Label>
                <Input name="name" required data-testid="input-customer-name" />
              </div>
              <div>
                <Label>Age</Label>
                <Input name="age" type="number" required data-testid="input-customer-age" />
              </div>
              <div>
                <Label>Gender</Label>
                <Select name="gender" required>
                  <SelectTrigger data-testid="select-customer-gender"><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Email</Label>
                <Input name="email" type="email" required data-testid="input-customer-email" />
              </div>
              <div>
                <Label>Phone</Label>
                <Input name="phone" data-testid="input-customer-phone" />
              </div>
              <div>
                <Label>Occupation</Label>
                <Input name="occupation" data-testid="input-customer-occupation" />
              </div>
              <div>
                <Label>Annual Income ($)</Label>
                <Input name="annualIncome" type="number" step="0.01" required data-testid="input-customer-income" />
              </div>
              <div>
                <Label>Monthly Expenses ($)</Label>
                <Input name="monthlyExpenses" type="number" step="0.01" required data-testid="input-customer-expenses" />
              </div>
              <div>
                <Label>Credit Score</Label>
                <Input name="creditScore" type="number" min="300" max="850" required data-testid="input-customer-credit" />
              </div>
              <div>
                <Label>Existing Loans</Label>
                <Input name="existingLoans" type="number" defaultValue="0" data-testid="input-customer-loans" />
              </div>
              <div>
                <Label>Employment Years</Label>
                <Input name="employmentYears" type="number" step="0.5" required data-testid="input-customer-employment" />
              </div>
              <div>
                <Label>Home Ownership</Label>
                <Select name="homeOwnership" required>
                  <SelectTrigger data-testid="select-customer-home"><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Own">Own</SelectItem>
                    <SelectItem value="Rent">Rent</SelectItem>
                    <SelectItem value="Mortgage">Mortgage</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Marital Status</Label>
                <Select name="maritalStatus">
                  <SelectTrigger data-testid="select-customer-marital"><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Single">Single</SelectItem>
                    <SelectItem value="Married">Married</SelectItem>
                    <SelectItem value="Divorced">Divorced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Dependents</Label>
                <Input name="dependents" type="number" defaultValue="0" data-testid="input-customer-dependents" />
              </div>
              <div className="col-span-2 mt-2">
                <Button type="submit" className="w-full" disabled={addMutation.isPending} data-testid="button-submit-customer">
                  {addMutation.isPending ? "Adding..." : "Add Customer"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search customers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
            data-testid="input-search-customers"
          />
        </div>
        <Select value={riskFilter} onValueChange={setRiskFilter}>
          <SelectTrigger className="w-[160px]" data-testid="select-risk-filter">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Risk Levels</SelectItem>
            <SelectItem value="low">Low Risk</SelectItem>
            <SelectItem value="medium">Medium Risk</SelectItem>
            <SelectItem value="high">High Risk</SelectItem>
            <SelectItem value="critical">Critical Risk</SelectItem>
          </SelectContent>
        </Select>
        <Badge variant="secondary" className="text-xs">
          {filtered.length} customer{filtered.length !== 1 ? "s" : ""}
        </Badge>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i}><CardContent className="p-5"><Skeleton className="h-32 w-full" /></CardContent></Card>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <Users className="w-12 h-12 text-muted-foreground/40 mb-3" />
            <p className="text-sm font-medium text-muted-foreground">No customers found</p>
            <p className="text-xs text-muted-foreground mt-1">Try adjusting your search or filters</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((customer) => (
            <Card
              key={customer.id}
              className="hover-elevate cursor-pointer transition-all"
              onClick={() => setSelectedCustomer(customer)}
              data-testid={`card-customer-${customer.id}`}
            >
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-bold shrink-0">
                      {customer.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold truncate">{customer.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{customer.occupation || "Not specified"}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0 mt-1" />
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <CreditCard className="w-3 h-3" />
                    <span>Score: {customer.creditScore}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <DollarSign className="w-3 h-3" />
                    <span>${(customer.annualIncome / 1000).toFixed(0)}K/yr</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Briefcase className="w-3 h-3" />
                    <span>{customer.employmentYears} yrs</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Mail className="w-3 h-3" />
                    <span className="truncate">{customer.email.split("@")[0]}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-3 border-t">
                  <RiskGauge value={customer.defaultProbability || 0} size="sm" showLabel={false} />
                  <RiskBadge category={customer.riskCategory || "Medium"} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {selectedCustomer && (
        <>
          <div
            className="fixed inset-0 bg-black/30 z-40"
            onClick={() => setSelectedCustomer(null)}
          />
          <CustomerDetailPanel
            customer={selectedCustomer}
            onClose={() => setSelectedCustomer(null)}
          />
        </>
      )}
    </div>
  );
}
