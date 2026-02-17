import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

const data = [
  { name: "Mon", shipments: 120, delays: 12 },
  { name: "Tue", shipments: 145, delays: 8 },
  { name: "Wed", shipments: 132, delays: 15 },
  { name: "Thu", shipments: 156, delays: 10 },
  { name: "Fri", shipments: 189, delays: 5 },
  { name: "Sat", shipments: 98, delays: 2 },
  { name: "Sun", shipments: 75, delays: 0 },
];

export default function Analytics() {
  return (
    <Layout>
      <div className="mb-6">
        <h2 className="text-2xl font-display font-bold">Analytics Dashboard</h2>
        <p className="text-muted-foreground">Performance metrics and operational efficiency trends.</p>
      </div>

      <div className="grid gap-6">
        <Card className="bg-card/40 backdrop-blur-md border-border/50">
          <CardHeader>
            <CardTitle>Shipment Volume vs Delays</CardTitle>
          </CardHeader>
          <CardContent className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} vertical={false} />
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
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#f3f4f6' }}
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                />
                <Bar dataKey="shipments" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                <Bar dataKey="delays" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}