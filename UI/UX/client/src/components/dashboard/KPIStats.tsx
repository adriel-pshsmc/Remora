import { ArrowUpRight, ArrowDownRight, Activity, Package, Clock, AlertOctagon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function KPIStats() {
  const stats = [
    {
      label: "Active Shipments",
      value: "1,248",
      change: "+12.5%",
      trend: "up",
      icon: Package,
      color: "text-blue-400",
      bg: "bg-blue-400/10",
    },
    {
      label: "On-Time Performance",
      value: "94.2%",
      change: "+2.1%",
      trend: "up",
      icon: Clock,
      color: "text-emerald-400",
      bg: "bg-emerald-400/10",
    },
    {
      label: "Supply Chain Risk",
      value: "Medium",
      change: " elevated",
      trend: "down",
      icon: AlertOctagon,
      color: "text-amber-400",
      bg: "bg-amber-400/10",
      isAlert: true
    },
    {
      label: "Inventory Health",
      value: "98.5%",
      change: "-0.4%",
      trend: "down",
      icon: Activity,
      color: "text-purple-400",
      bg: "bg-purple-400/10",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <Card key={index} className="border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-colors">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">{stat.label}</p>
                <h3 className="text-2xl font-bold font-display tracking-tight text-foreground">{stat.value}</h3>
              </div>
              <div className={`p-2 rounded-lg ${stat.bg}`}>
                <stat.icon className={`size-5 ${stat.color}`} />
              </div>
            </div>
            <div className="mt-4 flex items-center text-xs">
              {stat.isAlert ? (
                <span className="text-amber-400 font-medium flex items-center">
                   <AlertOctagon className="size-3 mr-1" /> Requires Attention
                </span>
              ) : (
                <span className={`flex items-center font-medium ${
                  stat.trend === "up" ? "text-emerald-400" : "text-rose-400"
                }`}>
                  {stat.trend === "up" ? <ArrowUpRight className="size-3 mr-1" /> : <ArrowDownRight className="size-3 mr-1" />}
                  {stat.change}
                </span>
              )}
              <span className="text-muted-foreground ml-2">vs last week</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}