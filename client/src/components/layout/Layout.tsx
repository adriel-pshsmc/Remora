import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { 
  LayoutDashboard, 
  Package, 
  Map, 
  BarChart3, 
  AlertTriangle, 
  Settings, 
  LogOut,
  Menu,
  X,
  Search,
  Bell,
  User
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger 
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [user, setUser] = useState({
    name: "Alex Chen",
    role: "Logistics Director",
    initials: "AC"
  });

  useEffect(() => {
    const updateUserData = () => {
      const storedUser = localStorage.getItem("remora_user");
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        setUser({
          name: parsed.name,
          role: parsed.org || "Logistics Director",
          initials: parsed.name.split(' ').map((n: string) => n[0]).join('').toUpperCase()
        });
      }
    };

    updateUserData();
    window.addEventListener('storage', updateUserData);
    return () => window.removeEventListener('storage', updateUserData);
  }, []);

  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/" },
    { icon: Map, label: "Live Tracking", href: "/tracking" },
    { icon: Package, label: "Shipments", href: "/shipments" },
    { icon: AlertTriangle, label: "Risk Monitor", href: "/risks" },
    { icon: BarChart3, label: "Analytics", href: "/analytics" },
    { icon: Settings, label: "Settings", href: "/settings" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("remora_user");
    localStorage.removeItem("remora_settings");
    window.location.href = "/auth";
  };

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden text-foreground">
      {/* Desktop Sidebar */}
      <aside 
        className={`hidden md:flex flex-col border-r border-sidebar-border bg-sidebar transition-all duration-300 ease-in-out ${
          sidebarOpen ? "w-64" : "w-20"
        }`}
      >
        <div className="h-16 flex items-center px-4 border-b border-sidebar-border">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="size-8 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
               <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
               </svg>
            </div>
            <span className={`font-display font-bold text-lg tracking-tight transition-opacity duration-200 ${
              sidebarOpen ? "opacity-100" : "opacity-0 w-0"
            }`}>
              Remora AI
            </span>
          </div>
        </div>

        <div className="flex-1 py-6 px-3 space-y-2 overflow-y-auto">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <div 
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-all duration-200 group ${
                  location === item.href 
                    ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-md shadow-primary/20" 
                    : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                }`}
              >
                <item.icon className="size-5 shrink-0" />
                <span className={`font-medium whitespace-nowrap transition-all duration-200 ${
                  sidebarOpen ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4 w-0 hidden"
                }`}>
                  {item.label}
                </span>
              </div>
            </Link>
          ))}
        </div>

        <div className="p-4 border-t border-sidebar-border flex flex-col gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-full flex items-center justify-start gap-3 text-muted-foreground hover:text-foreground"
            onClick={handleLogout}
          >
             <LogOut className="size-5" />
             <span className={`${sidebarOpen ? "block" : "hidden"}`}>Logout</span>
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="w-full flex items-center justify-center md:justify-start gap-3 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
             {sidebarOpen ? <X className="size-5" /> : <Menu className="size-5" />}
             <span className={`${sidebarOpen ? "block" : "hidden"}`}>Collapse</span>
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Top Header */}
        <header className="h-16 border-b border-border bg-background/80 backdrop-blur-md flex items-center justify-between px-6 z-10">
          <div className="flex items-center gap-4">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="size-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 bg-sidebar border-sidebar-border p-0">
                 <div className="h-16 flex items-center px-6 border-b border-sidebar-border">
                    <span className="font-display font-bold text-xl">Remora AI</span>
                 </div>
                 <div className="py-6 px-3 space-y-2">
                  {navItems.map((item) => (
                    <Link key={item.href} href={item.href}>
                      <div className={`flex items-center gap-3 px-3 py-3 rounded-lg ${
                        location === item.href ? "bg-primary text-primary-foreground" : "text-muted-foreground"
                      }`}>
                        <item.icon className="size-5" />
                        <span className="font-medium">{item.label}</span>
                      </div>
                    </Link>
                  ))}
                 </div>
              </SheetContent>
            </Sheet>
            
            <div className="hidden md:flex items-center text-sm text-muted-foreground">
              <span className="px-2">Operations</span>
              <span className="text-border">/</span>
              <span className="px-2 text-foreground font-medium">Global Dashboard</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative hidden sm:block w-64">
              <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
              <Input 
                placeholder="Search shipment ID, container..." 
                className="pl-9 h-9 bg-secondary/50 border-transparent focus:border-primary/50 transition-all rounded-full"
              />
            </div>
            
            <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground">
              <Bell className="size-5" />
              <span className="absolute top-2 right-2 size-2 bg-red-500 rounded-full animate-pulse" />
            </Button>
            
            <div className="flex items-center gap-3 pl-2 border-l border-border">
              <div className="text-right hidden md:block">
                <p className="text-sm font-medium leading-none">{user.name}</p>
                <p className="text-xs text-muted-foreground mt-1 truncate max-w-[120px]">{user.role}</p>
              </div>
              <Link href="/auth">
                <Avatar className="size-9 border border-border cursor-pointer hover:ring-2 ring-primary/30 transition-all">
                  <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} />
                  <AvatarFallback>{user.initials}</AvatarFallback>
                </Avatar>
              </Link>
            </div>
          </div>
        </header>

        {/* Scrollable Main Area */}
        <main className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
          <div className="max-w-[1600px] mx-auto space-y-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}