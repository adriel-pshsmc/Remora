import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, ShieldAlert, Wind, Anchor } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export default function Risks() {
  const risks = [
    {
      title: "Port Congestion - Rotterdam",
      severity: "High",
      type: "Operational",
      impact: "7 active shipments affected",
      icon: Anchor,
      color: "text-red-400",
      bg: "bg-red-500/10",
      border: "border-red-500/20",
      progress: 85
    },
    {
      title: "Typhoon Warning - Pacific Route",
      severity: "Medium",
      type: "Weather",
      impact: "Possible delays for Trans-Pacific cargo",
      icon: Wind,
      color: "text-amber-400",
      bg: "bg-amber-500/10",
      border: "border-amber-500/20",
      progress: 60
    },
    {
      title: "Customs Clearance Delay - JFK",
      severity: "Low",
      type: "Regulatory",
      impact: "Minor processing delays expected",
      icon: ShieldAlert,
      color: "text-blue-400",
      bg: "bg-blue-500/10",
      border: "border-blue-500/20",
      progress: 30
    }
  ];

  return (
    <Layout>
      <div className="mb-6">
        <h2 className="text-2xl font-display font-bold">Risk Monitor</h2>
        <p className="text-muted-foreground">AI-driven predictive risk analysis for global supply chains.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {risks.map((risk, idx) => (
          <Card key={idx} className={`bg-card/40 backdrop-blur-md border ${risk.border}`}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div className={`p-2 rounded-lg ${risk.bg}`}>
                  <risk.icon className={`size-5 ${risk.color}`} />
                </div>
                <span className={`text-xs font-bold px-2 py-1 rounded-full ${risk.bg} ${risk.color}`}>
                  {risk.severity} Risk
                </span>
              </div>
              <CardTitle className="text-lg font-bold mt-4">{risk.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Probability</span>
                    <span className="font-mono">{risk.progress}%</span>
                  </div>
                  <Progress value={risk.progress} className="h-2" />
                </div>
                <div className="p-3 bg-secondary/30 rounded-lg border border-border/50">
                  <p className="text-xs text-muted-foreground">
                    <span className="font-bold text-foreground block mb-1">Impact Analysis:</span>
                    {risk.impact}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </Layout>
  );
}