import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShieldCheck, ArrowRight, Github, UserPlus, Lock } from "lucide-react";
import { motion } from "framer-motion";

export default function Auth() {
  const [, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    org: ""
  });

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Store credentials in localStorage for the mockup
    const user = {
      name: formData.firstName ? `${formData.firstName} ${formData.lastName}` : "Alex Chen",
      email: formData.email || "name@company.com",
      org: formData.org || "Miro Operations"
    };
    localStorage.setItem("remora_user", JSON.stringify(user));

    setTimeout(() => {
      setIsLoading(false);
      window.dispatchEvent(new Event('storage')); // Trigger update in Layout
      setLocation("/");
    }, 1200);
  };

  return (
    <div className="min-h-screen w-full bg-[#1a1d21] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(14,165,233,0.1),transparent_50%)]" />
      <div className="absolute top-[-10%] left-[-10%] size-[40%] bg-primary/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] size-[40%] bg-primary/5 rounded-full blur-[120px]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-[420px] z-10"
      >
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="size-14 rounded-2xl bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center mb-4 border border-primary/40 shadow-[0_0_20px_rgba(14,165,233,0.2)]">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h1 className="text-4xl font-display font-black tracking-tight text-foreground bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">Remora AI</h1>
          <p className="text-muted-foreground text-sm mt-2 max-w-[300px]">Next-generation logistics intelligence and supply chain visibility</p>
        </div>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6 bg-secondary/30 p-1.5 rounded-xl border border-white/5 backdrop-blur-md">
            <TabsTrigger value="login" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white">Sign In</TabsTrigger>
            <TabsTrigger value="signup" className="rounded-lg data-[state=active]:bg-emerald-500 data-[state=active]:text-white">Sign Up</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <Card className="bg-card/40 backdrop-blur-2xl border-white/10 shadow-2xl overflow-hidden relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-primary/50" />
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="size-4 text-primary" />
                  Operator Access
                </CardTitle>
                <CardDescription>Secure entry for verified organization members.</CardDescription>
              </CardHeader>
              <form onSubmit={handleAuth}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Work Email</Label>
                    <Input id="email" type="email" placeholder="alex@miro.ai" required className="bg-white/5 border-white/10" 
                      onChange={(e) => setFormData({...formData, email: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label htmlFor="password">Security Key</Label>
                      <Button variant="link" className="px-0 h-auto text-xs text-primary/80">Reset</Button>
                    </div>
                    <Input id="password" type="password" required className="bg-white/5 border-white/10" />
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-4 pt-2">
                  <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white font-bold h-11" disabled={isLoading}>
                    {isLoading ? "Authenticating..." : "Establish Connection"}
                    <ArrowRight className="size-4 ml-2" />
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>

          <TabsContent value="signup">
            <Card className="bg-card/40 backdrop-blur-2xl border-emerald-500/20 shadow-2xl overflow-hidden relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500/50" />
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserPlus className="size-5 text-emerald-400" />
                  New Enterprise Node
                </CardTitle>
                <CardDescription>Join the global logistics intelligence network.</CardDescription>
              </CardHeader>
              <form onSubmit={handleAuth}>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="first">First Name</Label>
                      <Input id="first" placeholder="Alex" required className="bg-white/5 border-white/10 focus:border-emerald-500/50" 
                        onChange={(e) => setFormData({...formData, firstName: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="last">Last Name</Label>
                      <Input id="last" placeholder="Chen" required className="bg-white/5 border-white/10 focus:border-emerald-500/50" 
                        onChange={(e) => setFormData({...formData, lastName: e.target.value})} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="work-email">Work Email</Label>
                    <Input id="work-email" type="email" placeholder="alex@miro.ai" required className="bg-white/5 border-white/10 focus:border-emerald-500/50" 
                      onChange={(e) => setFormData({...formData, email: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="org">Organization</Label>
                    <Input id="org" placeholder="Miro Operations" required className="bg-white/5 border-white/10 focus:border-emerald-500/50" 
                      onChange={(e) => setFormData({...formData, org: e.target.value})} />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold h-11" disabled={isLoading}>
                    {isLoading ? "Initializing Node..." : "Provision Account"}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-8 flex items-center justify-center gap-3 text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-medium opacity-50">
          <ShieldCheck className="size-3 text-emerald-500" />
          Protocol L4 Secured
        </div>
      </motion.div>
    </div>
  );
}