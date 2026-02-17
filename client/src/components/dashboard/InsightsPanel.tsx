import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, AlertTriangle, TrendingUp, Zap } from "lucide-react";

export default function InsightsPanel() {
  const insights = [
    {
      type: "prediction",
      title: "Port Congestion Warning",
      description: "High probability of delay at Port of Rotterdam due to labor strike prediction.",
      impact: "High Impact",
      time: "2h ago",
      icon: AlertTriangle,
      color: "text-amber-400",
      bg: "bg-amber-400/10"
    },
    {
      type: "optimization",
      title: "Route Optimization",
      description: "Save 14% fuel on Trans-Pacific route by adjusting for new weather patterns.",
      impact: "+$12k Savings",
      time: "4h ago",
      icon: Zap,
      color: "text-emerald-400",
      bg: "bg-emerald-400/10"
    },
    {
      type: "trend",
      title: "Demand Spike Detected",
      description: "Electronics category showing +25% order volume in SE Asia region.",
      impact: "Opportunity",
      time: "6h ago",
      icon: TrendingUp,
      color: "text-blue-400",
      bg: "bg-blue-400/10"
    }
  ];

  return (
    <Card className="h-full border-border/50 bg-card/40 backdrop-blur-sm flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-display flex items-center gap-2">
            <Sparkles className="size-4 text-purple-400" />
            Remora AI Insights
          </CardTitle>
          <Badge variant="secondary" className="bg-purple-500/10 text-purple-400 border-purple-500/20 hover:bg-purple-500/20">
            Live
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto space-y-4 pr-2">
        {insights.map((insight, index) => (
          <div key={index} className="p-3 rounded-lg bg-card/50 border border-border/50 hover:bg-card/80 transition-all cursor-pointer group">
            <div className="flex justify-between items-start mb-2">
              <div className={`p-1.5 rounded-md ${insight.bg} ${insight.color}`}>
                <insight.icon className="size-3.5" />
              </div>
              <span className="text-[10px] text-muted-foreground">{insight.time}</span>
            </div>
            <h4 className="text-sm font-semibold mb-1 group-hover:text-primary transition-colors">{insight.title}</h4>
            <p className="text-xs text-muted-foreground leading-relaxed mb-2">
              {insight.description}
            </p>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-[10px] h-5 border-border/50 bg-secondary/30">
                {insight.impact}
              </Badge>
            </div>
          </div>
        ))}
        
        <div className="p-3 rounded-lg border border-dashed border-border/50 text-center">
          <p className="text-xs text-muted-foreground mb-2">Ask Remora AI anything about your supply chain...</p>
          <div className="h-8 bg-secondary/50 rounded-md border border-border/30 flex items-center px-3 text-xs text-muted-foreground/50">
            Type query...
          </div>
        </div>
      </CardContent>
    </Card>
  );
}