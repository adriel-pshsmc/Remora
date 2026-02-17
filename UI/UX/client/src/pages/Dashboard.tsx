import Layout from "@/components/layout/Layout";
import KPIStats from "@/components/dashboard/KPIStats";
import InteractiveMap from "@/components/dashboard/InteractiveMap";
import InsightsPanel from "@/components/dashboard/InsightsPanel";
import ShipmentList from "@/components/dashboard/ShipmentList";

export default function Dashboard() {
  return (
    <Layout>
      <KPIStats />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-auto lg:h-[500px]">
        <div className="col-span-1 lg:col-span-2 row-span-2 h-[500px] relative">
          <InteractiveMap />
        </div>
        <InsightsPanel />
      </div>

      <div className="grid grid-cols-1 gap-6">
        <ShipmentList />
      </div>
    </Layout>
  );
}