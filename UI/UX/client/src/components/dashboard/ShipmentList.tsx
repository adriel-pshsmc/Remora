import { 
    Table, 
    TableBody, 
    TableCell, 
    TableHead, 
    TableHeader, 
    TableRow 
  } from "@/components/ui/table";
  import { Badge } from "@/components/ui/badge";
  import { MoreHorizontal, Ship, Plane, Truck } from "lucide-react";
  import { Button } from "@/components/ui/button";
  import { Avatar, AvatarFallback } from "@/components/ui/avatar";
  
  export default function ShipmentList() {
    const shipments = [
      {
        id: "SHP-00129",
        origin: "Shenzhen, CN",
        destination: "Los Angeles, US",
        status: "In Transit",
        mode: "Sea",
        eta: "2 days",
        value: "$142,000",
        risk: "Low"
      },
      {
        id: "SHP-00130",
        origin: "Hamburg, DE",
        destination: "New York, US",
        status: "Customs Hold",
        mode: "Air",
        eta: "Delayed",
        value: "$85,500",
        risk: "High"
      },
      {
        id: "SHP-00131",
        origin: "Tokyo, JP",
        destination: "Singapore, SG",
        status: "Delivered",
        mode: "Sea",
        eta: "Arrived",
        value: "$210,000",
        risk: "Low"
      },
      {
        id: "SHP-00132",
        origin: "Mumbai, IN",
        destination: "Dubai, AE",
        status: "Processing",
        mode: "Truck",
        eta: "5 days",
        value: "$32,000",
        risk: "Medium"
      },
      {
        id: "SHP-00133",
        origin: "London, UK",
        destination: "Paris, FR",
        status: "In Transit",
        mode: "Truck",
        eta: "4 hours",
        value: "$18,000",
        risk: "Low"
      },
    ];
  
    const getModeIcon = (mode: string) => {
      switch (mode) {
        case "Sea": return <Ship className="size-3.5" />;
        case "Air": return <Plane className="size-3.5" />;
        case "Truck": return <Truck className="size-3.5" />;
        default: return <Ship className="size-3.5" />;
      }
    };
  
    const getStatusColor = (status: string) => {
      if (status === "Delivered") return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      if (status === "Customs Hold") return "bg-red-500/10 text-red-400 border-red-500/20";
      if (status === "In Transit") return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      return "bg-secondary text-muted-foreground";
    };
  
    return (
      <div className="rounded-xl border border-border/50 bg-card/40 backdrop-blur-sm overflow-hidden">
        <div className="p-4 border-b border-border/50 flex items-center justify-between">
            <h3 className="font-display font-semibold text-lg">Recent Shipments</h3>
            <Button variant="outline" size="sm" className="h-8 text-xs">View All</Button>
        </div>
        <Table>
          <TableHeader className="bg-secondary/20">
            <TableRow className="hover:bg-transparent border-border/50">
              <TableHead className="w-[120px]">ID</TableHead>
              <TableHead>Route</TableHead>
              <TableHead>Mode</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Risk</TableHead>
              <TableHead className="text-right">Value</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {shipments.map((shipment) => (
              <TableRow key={shipment.id} className="hover:bg-secondary/30 border-border/50 transition-colors">
                <TableCell className="font-mono text-xs font-medium text-primary">{shipment.id}</TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="text-xs font-medium">{shipment.origin}</span>
                    <span className="text-[10px] text-muted-foreground">to {shipment.destination}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2 text-muted-foreground text-xs">
                    {getModeIcon(shipment.mode)}
                    {shipment.mode}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={`text-[10px] h-5 font-normal ${getStatusColor(shipment.status)}`}>
                    {shipment.status}
                  </Badge>
                </TableCell>
                <TableCell>
                   <div className="flex items-center gap-1.5">
                      <div className={`size-2 rounded-full ${
                          shipment.risk === "High" ? "bg-red-400" : 
                          shipment.risk === "Medium" ? "bg-amber-400" : "bg-emerald-400"
                      }`} />
                      <span className="text-xs">{shipment.risk}</span>
                   </div>
                </TableCell>
                <TableCell className="text-right font-mono text-xs">{shipment.value}</TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon" className="h-7 w-7">
                    <MoreHorizontal className="size-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }