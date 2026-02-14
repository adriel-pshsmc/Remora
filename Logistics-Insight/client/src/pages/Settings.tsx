import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

export default function Settings() {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="mb-6">
          <h2 className="text-2xl font-display font-bold">Platform Settings</h2>
          <p className="text-muted-foreground">Configure your dashboard, notifications, and integrations.</p>
        </div>

        <Card className="bg-card/40 backdrop-blur-md border-border/50">
          <CardHeader>
            <CardTitle>General Preferences</CardTitle>
            <CardDescription>Customize your interface and regional settings.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Default Currency</Label>
                <Select defaultValue="usd">
                  <SelectTrigger>
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="usd">USD ($)</SelectItem>
                    <SelectItem value="eur">EUR (€)</SelectItem>
                    <SelectItem value="php">PHP (₱)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Time Zone</Label>
                <Select defaultValue="pst">
                  <SelectTrigger>
                    <SelectValue placeholder="Select timezone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pst">Pacific Time (PT)</SelectItem>
                    <SelectItem value="utc">UTC</SelectItem>
                    <SelectItem value="est">Eastern Time (ET)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <Separator className="my-4" />
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Dark Mode</Label>
                <p className="text-sm text-muted-foreground">Enable dark theme for the interface.</p>
              </div>
              <Switch checked={true} />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/40 backdrop-blur-md border-border/50">
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>Manage how you receive alerts and updates.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Risk Alerts</Label>
                <p className="text-sm text-muted-foreground">Get notified when shipment risk level increases.</p>
              </div>
              <Switch checked={true} />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Delivery Updates</Label>
                <p className="text-sm text-muted-foreground">Receive updates upon successful delivery.</p>
              </div>
              <Switch checked={true} />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button variant="outline">Cancel</Button>
          <Button>Save Changes</Button>
        </div>
      </div>
    </Layout>
  );
}