import Layout from "@/components/layout/Layout";
import ShipmentList from "@/components/dashboard/ShipmentList";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function Shipments() {
  return (
    <Layout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-display font-bold">All Shipments</h2>
          <p className="text-muted-foreground">Manage and track your active logistics orders.</p>
        </div>
        <Button className="gap-2">
          <Plus className="size-4" />
          New Shipment
        </Button>
      </div>

      <ShipmentList />
    </Layout>
  );
}