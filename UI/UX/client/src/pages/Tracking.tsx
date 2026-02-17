import Layout from "@/components/layout/Layout";
import InteractiveMap from "@/components/dashboard/InteractiveMap";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Tracking() {
  return (
    <Layout>
      <div className="flex flex-col h-[calc(100vh-8rem)] gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-display font-bold">Live Tracking Operations</h2>
          <div className="flex gap-2">
            <div className="relative w-64">
              <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
              <Input placeholder="Search vessel, cargo ID..." className="pl-9 h-9" />
            </div>
            <Button variant="outline" size="sm" className="h-9 gap-2">
              <Filter className="size-4" />
              Filters
            </Button>
          </div>
        </div>
        
        <div className="flex-1 min-h-0 border border-border/50 rounded-xl overflow-hidden bg-card/50 backdrop-blur-sm">
           <InteractiveMap />
        </div>
      </div>
    </Layout>
  );
}