import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDemoMode } from "@/contexts/DemoModeContext";
import {
  DEMO_PORTFOLIO,
  DEMO_INVESTMENTS,
  DEMO_TRANSACTIONS,
  DEMO_PERFORMANCE_DATA,
} from "@/lib/demoData";
import {
  ArrowUpRight,
  DollarSign,
  LineChart,
  PieChart,
  Wallet,
  AlertCircle,
  LogOut,
  TrendingUp,
  Calendar,
} from "lucide-react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { useLocation } from "wouter";

export default function Dashboard() {
  const { isDemoMode, exitDemoMode, demoUser } = useDemoMode();
  const [, setLocation] = useLocation();

  const handleExitDemo = () => {
    exitDemoMode();
    setLocation("/");
  };

  // Use demo data when in demo mode
  const portfolio = isDemoMode ? DEMO_PORTFOLIO : null;
  const investments = isDemoMode ? DEMO_INVESTMENTS : [];
  const transactions = isDemoMode ? DEMO_TRANSACTIONS : [];
  const performanceData = isDemoMode ? DEMO_PERFORMANCE_DATA : [];

  if (!isDemoMode) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md mx-4">
          <CardContent className="p-8 text-center space-y-4">
            <AlertCircle className="w-16 h-16 mx-auto text-muted-foreground" />
            <h2 className="font-serif text-2xl font-bold">Authentication Required</h2>
            <p className="text-muted-foreground">
              Please log in to access your portfolio dashboard.
            </p>
            <div className="flex flex-col gap-3 pt-4">
              <Button onClick={() => setLocation("/")}>Return to Home</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Demo Mode Banner */}
      {isDemoMode && (
        <div className="bg-primary/10 border-b border-primary/20 py-3">
          <div className="container px-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Badge className="bg-primary text-white">Demo Mode</Badge>
              <p className="text-sm text-muted-foreground">
                You're viewing a sample portfolio. No real transactions will be made.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExitDemo}
              className="hidden md:flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Exit Demo
            </Button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-sidebar text-white py-12">
        <div className="container px-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-serif text-3xl md:text-4xl font-bold mb-2">My Portfolio</h1>
              <p className="text-gray-300">
                Welcome back, {demoUser?.name || "Investor"}
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExitDemo}
              className="md:hidden flex items-center gap-2 border-white/20 text-white hover:bg-white/10"
            >
              <LogOut className="w-4 h-4" />
              Exit
            </Button>
          </div>
        </div>
      </div>

      <div className="container px-4 -mt-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-card border-border shadow-lg">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-chart-1/10 rounded-lg">
                  <Wallet className="w-6 h-6 text-chart-1" />
                </div>
                <span className="text-xs font-bold text-chart-1 bg-chart-1/10 px-2 py-1 rounded flex items-center">
                  <ArrowUpRight className="w-3 h-3 mr-1" /> +{portfolio?.totalAssetValueChange}%
                </span>
              </div>
              <p className="text-sm text-muted-foreground mb-1">Total Asset Value</p>
              <h3 className="text-3xl font-bold">
                ${portfolio?.totalAssetValue.toLocaleString()}
              </h3>
            </CardContent>
          </Card>

          <Card className="bg-card border-border shadow-lg">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-chart-2/10 rounded-lg">
                  <LineChart className="w-6 h-6 text-chart-2" />
                </div>
                <span className="text-xs font-bold text-chart-2 bg-chart-2/10 px-2 py-1 rounded flex items-center">
                  <ArrowUpRight className="w-3 h-3 mr-1" /> +{portfolio?.ytdReturnsChange}%
                </span>
              </div>
              <p className="text-sm text-muted-foreground mb-1">YTD Returns</p>
              <h3 className="text-3xl font-bold">
                ${portfolio?.ytdReturns.toLocaleString()}
              </h3>
            </CardContent>
          </Card>

          <Card className="bg-card border-border shadow-lg">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-chart-3/10 rounded-lg">
                  <DollarSign className="w-6 h-6 text-chart-3" />
                </div>
                <span className="text-xs font-bold text-muted-foreground bg-muted px-2 py-1 rounded">
                  Available
                </span>
              </div>
              <p className="text-sm text-muted-foreground mb-1">Cash Balance</p>
              <h3 className="text-3xl font-bold">
                ${portfolio?.cashBalance.toLocaleString()}
              </h3>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Chart */}
          <Card className="lg:col-span-2 border-border">
            <CardHeader>
              <CardTitle>Portfolio Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={performanceData}>
                    <XAxis
                      dataKey="name"
                      stroke="#888888"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      stroke="#888888"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => `$${value}`}
                    />
                    <Bar
                      dataKey="value"
                      fill="hsl(var(--chart-1))"
                      radius={[8, 8, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Active Investments */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle>Active Investments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {investments.slice(0, 4).map((investment) => (
                  <div key={investment.id} className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium truncate">{investment.name}</p>
                      <p className="text-xs text-muted-foreground">{investment.type}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-chart-1">
                        +{investment.returnsPercent}%
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Investment Holdings */}
        <Card className="mt-8 border-border">
          <CardHeader>
            <CardTitle>Investment Holdings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {investments.map((investment) => (
                <div
                  key={investment.id}
                  className="flex flex-col md:flex-row md:items-center justify-between p-4 border border-border rounded-lg hover:border-primary transition-colors"
                >
                  <div className="flex-1 mb-3 md:mb-0">
                    <h4 className="font-semibold mb-1">{investment.name}</h4>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <PieChart className="w-4 h-4" />
                        {investment.type}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(investment.date).toLocaleDateString()}
                      </span>
                      <Badge variant="outline" className="text-chart-1 border-chart-1">
                        {investment.status}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-8">
                    <div className="text-left md:text-right">
                      <p className="text-sm text-muted-foreground">Investment</p>
                      <p className="font-semibold">${investment.amount.toLocaleString()}</p>
                    </div>
                    <div className="text-left md:text-right">
                      <p className="text-sm text-muted-foreground">Current Value</p>
                      <p className="font-semibold">
                        ${investment.currentValue.toLocaleString()}
                      </p>
                    </div>
                    <div className="text-left md:text-right">
                      <p className="text-sm text-muted-foreground">Returns</p>
                      <p className="font-semibold text-chart-1 flex items-center gap-1">
                        <TrendingUp className="w-4 h-4" />
                        +${investment.returns.toLocaleString()} ({investment.returnsPercent}%)
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card className="mt-8 border-border">
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-3 border-b border-border last:border-0"
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium">{transaction.description}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(transaction.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p
                      className={`text-sm font-bold ${
                        transaction.type === "credit" ? "text-chart-1" : "text-muted-foreground"
                      }`}
                    >
                      {transaction.type === "credit" ? "+" : ""}$
                      {Math.abs(transaction.amount).toLocaleString()}
                    </p>
                    <Badge
                      variant="outline"
                      className="text-xs"
                    >
                      {transaction.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upgrade CTA */}
        {isDemoMode && (
          <Card className="mt-8 border-2 border-primary bg-primary/5">
            <CardContent className="p-8 text-center space-y-4">
              <h3 className="font-serif text-2xl font-bold">Ready to Start Investing?</h3>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Create your full NDIG account to access real investment opportunities, track your
                portfolio, and start building generational wealth through regulator-vetted
                productive investments.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Button variant="outline" size="lg" onClick={handleExitDemo}>
                  Exit Demo
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
