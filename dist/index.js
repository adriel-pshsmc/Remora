// index.tsx
import React4 from "react";
import ReactDOM from "react-dom/client";

// app.tsx
import React3, { useState, useMemo } from "react";

// constants.ts
var INITIAL_SKUS = [
  { id: "SKU-001", name: "Premium Coffee Beans", category: "F&B", quantity: 450, reorderPoint: 100, unitPrice: 15.5, demandScore: 85, location: "WH-East", status: "Healthy" /* HEALTHY */ },
  { id: "SKU-002", name: "Eco-Friendly Filters", category: "Hardware", quantity: 45, reorderPoint: 50, unitPrice: 5, demandScore: 40, location: "WH-West", status: "Low Stock" /* LOW */ },
  { id: "SKU-003", name: "Industrial Grinder X1", category: "Equipment", quantity: 2, reorderPoint: 5, unitPrice: 1200, demandScore: 92, location: "WH-East", status: "Critical" /* CRITICAL */ },
  { id: "SKU-004", name: "Oat Milk 1L (Pack)", category: "F&B", quantity: 120, reorderPoint: 150, unitPrice: 22, demandScore: 78, location: "WH-North", status: "Low Stock" /* LOW */ },
  { id: "SKU-005", name: "Paper Cups 500ct", category: "Disposables", quantity: 0, reorderPoint: 200, unitPrice: 35, demandScore: 65, location: "WH-South", status: "Out of Stock" /* OUT_OF_STOCK */ }
];
var WAREHOUSES = [
  { id: "WH-East", name: "Eastern Hub", lat: 40.7128, lng: -74.006, capacity: 5e3, utilization: 0.65 },
  { id: "WH-West", name: "Western Depot", lat: 34.0522, lng: -118.2437, capacity: 3e3, utilization: 0.82 },
  { id: "WH-North", name: "Northern Gateway", lat: 41.8781, lng: -87.6298, capacity: 4500, utilization: 0.45 },
  { id: "WH-South", name: "Southern Center", lat: 29.7604, lng: -95.3698, capacity: 4e3, utilization: 0.95 }
];
var INITIAL_ROUTES = [
  { id: "R-1", fromId: "WH-East", toId: "WH-North", distance: 1300, estimatedTime: 1200, riskLevel: "Low", active: true },
  { id: "R-2", fromId: "WH-North", toId: "WH-West", distance: 3300, estimatedTime: 3e3, riskLevel: "Medium", active: true },
  { id: "R-3", fromId: "WH-West", toId: "WH-South", distance: 2500, estimatedTime: 2300, riskLevel: "Low", active: false },
  { id: "R-4", fromId: "WH-South", toId: "WH-East", distance: 2600, estimatedTime: 2400, riskLevel: "High", active: true }
];

// services/geminiService.ts
import { GoogleGenAI, Type } from "@google/genai";
var GeminiLogisticsService = class {
  ai;
  constructor() {
    const apiKey = typeof process !== "undefined" && process.env.API_KEY ? process.env.API_KEY : window.GEMINI_API_KEY || "";
    if (!apiKey) {
      console.warn("Gemini API key not found. Set VITE_API_KEY in .env.local");
    }
    this.ai = new GoogleGenAI({ apiKey });
  }
  async analyzeLogistics(skus, warehouses, routes) {
    const prompt = `
      Analyze the following logistics data for a business. 
      Identify inventory risks (stockouts, overstock), evaluate route efficiencies, and suggest strategic improvements.
      Consider nearby issues like capacity utilization and risk levels.

      SKUs: ${JSON.stringify(skus)}
      Warehouses: ${JSON.stringify(warehouses)}
      Routes: ${JSON.stringify(routes)}

      Provide the analysis in a structured JSON format.
    `;
    try {
      const response = await this.ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              score: { type: Type.NUMBER, description: "Overall logistics health score (0-100)" },
              insights: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    recommendation: { type: Type.STRING },
                    impact: { type: Type.STRING, enum: ["High", "Medium", "Low"] },
                    type: { type: Type.STRING, enum: ["Inventory", "Route", "Risk"] }
                  },
                  required: ["title", "recommendation", "impact", "type"]
                }
              },
              suggestedRoutes: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "List of route IDs that need adjustment or activation"
              },
              reorderAlerts: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "List of SKU IDs requiring immediate reorder"
              }
            },
            required: ["score", "insights", "suggestedRoutes", "reorderAlerts"]
          }
        }
      });
      const text = response.text || "{}";
      return JSON.parse(text);
    } catch (error) {
      console.error("Gemini Analysis Error:", error);
      throw error;
    }
  }
};

// components/DashboardStats.tsx
import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
var DashboardStats = ({ skus, warehouses }) => {
  const stockData = skus.map((s) => ({
    name: s.name,
    quantity: s.quantity,
    status: s.status
  }));
  const warehouseUtilization = warehouses.map((w) => ({
    name: w.name,
    utilization: Math.round(w.utilization * 100)
  }));
  const COLORS = ["#ef4444", "#f59e0b", "#10b981", "#6366f1"];
  return /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8" }, /* @__PURE__ */ React.createElement("div", { className: "bg-white p-6 rounded-xl shadow-sm border border-slate-200" }, /* @__PURE__ */ React.createElement("h3", { className: "text-lg font-semibold mb-4 flex items-center gap-2" }, /* @__PURE__ */ React.createElement("span", { className: "w-2 h-2 bg-blue-500 rounded-full" }), "Inventory Levels by SKU"), /* @__PURE__ */ React.createElement("div", { className: "h-64" }, /* @__PURE__ */ React.createElement(ResponsiveContainer, { width: "100%", height: "100%" }, /* @__PURE__ */ React.createElement(BarChart, { data: stockData }, /* @__PURE__ */ React.createElement(CartesianGrid, { strokeDasharray: "3 3", vertical: false, stroke: "#f1f5f9" }), /* @__PURE__ */ React.createElement(XAxis, { dataKey: "name", hide: true }), /* @__PURE__ */ React.createElement(YAxis, null), /* @__PURE__ */ React.createElement(
    Tooltip,
    {
      contentStyle: { borderRadius: "8px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }
    }
  ), /* @__PURE__ */ React.createElement(Bar, { dataKey: "quantity", fill: "#6366f1", radius: [4, 4, 0, 0] }))))), /* @__PURE__ */ React.createElement("div", { className: "bg-white p-6 rounded-xl shadow-sm border border-slate-200" }, /* @__PURE__ */ React.createElement("h3", { className: "text-lg font-semibold mb-4 flex items-center gap-2" }, /* @__PURE__ */ React.createElement("span", { className: "w-2 h-2 bg-green-500 rounded-full" }), "Warehouse Capacity Utilization (%)"), /* @__PURE__ */ React.createElement("div", { className: "h-64" }, /* @__PURE__ */ React.createElement(ResponsiveContainer, { width: "100%", height: "100%" }, /* @__PURE__ */ React.createElement(BarChart, { layout: "vertical", data: warehouseUtilization }, /* @__PURE__ */ React.createElement(CartesianGrid, { strokeDasharray: "3 3", horizontal: false, stroke: "#f1f5f9" }), /* @__PURE__ */ React.createElement(XAxis, { type: "number", domain: [0, 100] }), /* @__PURE__ */ React.createElement(YAxis, { dataKey: "name", type: "category", width: 100 }), /* @__PURE__ */ React.createElement(
    Tooltip,
    {
      contentStyle: { borderRadius: "8px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }
    }
  ), /* @__PURE__ */ React.createElement(Bar, { dataKey: "utilization", radius: [0, 4, 4, 0] }, warehouseUtilization.map((entry, index) => /* @__PURE__ */ React.createElement(Cell, { key: `cell-${index}`, fill: entry.utilization > 80 ? "#ef4444" : "#10b981" }))))))));
};

// components/LogisticsMap.tsx
import React2 from "react";
var LogisticsMap = ({ warehouses, routes, onSelectRoute }) => {
  const project = (lat, lng) => {
    const x = (lng + 125) / 60 * 100;
    const y = (1 - (lat - 24) / 26) * 100;
    return { x: `${x}%`, y: `${y}%` };
  };
  return /* @__PURE__ */ React2.createElement("div", { className: "relative w-full h-96 bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 shadow-inner" }, /* @__PURE__ */ React2.createElement("div", { className: "absolute inset-0 opacity-10 pointer-events-none" }, /* @__PURE__ */ React2.createElement("svg", { width: "100%", height: "100%", xmlns: "http://www.w3.org/2000/svg" }, /* @__PURE__ */ React2.createElement("defs", null, /* @__PURE__ */ React2.createElement("pattern", { id: "grid", width: "40", height: "40", patternUnits: "userSpaceOnUse" }, /* @__PURE__ */ React2.createElement("path", { d: "M 40 0 L 0 0 0 40", fill: "none", stroke: "white", strokeWidth: "0.5" }))), /* @__PURE__ */ React2.createElement("rect", { width: "100%", height: "100%", fill: "url(#grid)" }))), /* @__PURE__ */ React2.createElement("svg", { className: "absolute inset-0 w-full h-full", viewBox: "0 0 100 100", preserveAspectRatio: "none" }, routes.map((route) => {
    const from = warehouses.find((w) => w.id === route.fromId);
    const to = warehouses.find((w) => w.id === route.toId);
    if (!from || !to) return null;
    const p1 = { x: (from.lng + 125) / 60 * 100, y: (1 - (from.lat - 24) / 26) * 100 };
    const p2 = { x: (to.lng + 125) / 60 * 100, y: (1 - (to.lat - 24) / 26) * 100 };
    return /* @__PURE__ */ React2.createElement("g", { key: route.id, className: "cursor-pointer group", onClick: () => onSelectRoute(route.id) }, /* @__PURE__ */ React2.createElement(
      "line",
      {
        x1: p1.x,
        y1: p1.y,
        x2: p2.x,
        y2: p2.y,
        stroke: route.active ? route.riskLevel === "High" ? "#f43f5e" : "#22c55e" : "#475569",
        strokeWidth: route.active ? 0.8 : 0.4,
        strokeDasharray: route.active ? "none" : "2,2",
        className: "transition-all duration-300 group-hover:stroke-blue-400 group-hover:stroke-[1.5]"
      }
    ), /* @__PURE__ */ React2.createElement("circle", { cx: (p1.x + p2.x) / 2, cy: (p1.y + p2.y) / 2, r: "1", fill: "white", className: "opacity-0 group-hover:opacity-100" }));
  })), warehouses.map((wh) => {
    const pos = project(wh.lat, wh.lng);
    return /* @__PURE__ */ React2.createElement(
      "div",
      {
        key: wh.id,
        className: "absolute -translate-x-1/2 -translate-y-1/2 group z-10",
        style: { left: pos.x, top: pos.y }
      },
      /* @__PURE__ */ React2.createElement("div", { className: `w-4 h-4 rounded-full border-2 border-white shadow-lg transition-transform hover:scale-150 ${wh.utilization > 0.8 ? "bg-red-500" : "bg-blue-500"}` }),
      /* @__PURE__ */ React2.createElement("div", { className: "absolute top-6 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none transition-opacity" }, wh.name, " (", Math.round(wh.utilization * 100), "%)")
    );
  }), /* @__PURE__ */ React2.createElement("div", { className: "absolute bottom-4 right-4 bg-slate-800/80 backdrop-blur px-3 py-2 rounded-lg border border-slate-700 text-[10px] text-slate-300 flex gap-4" }, /* @__PURE__ */ React2.createElement("div", { className: "flex items-center gap-2" }, /* @__PURE__ */ React2.createElement("span", { className: "w-2 h-2 bg-blue-500 rounded-full" }), " Healthy"), /* @__PURE__ */ React2.createElement("div", { className: "flex items-center gap-2" }, /* @__PURE__ */ React2.createElement("span", { className: "w-2 h-2 bg-red-500 rounded-full" }), " Critical"), /* @__PURE__ */ React2.createElement("div", { className: "flex items-center gap-2" }, /* @__PURE__ */ React2.createElement("span", { className: "w-2 h-0.5 bg-green-500" }), " Active Route")));
};

// app.tsx
var App = () => {
  const [skus, setSkus] = useState(INITIAL_SKUS);
  const [routes, setRoutes] = useState(INITIAL_ROUTES);
  const [optimization, setOptimization] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState("inventory");
  const geminiService = useMemo(() => new GeminiLogisticsService(), []);
  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    try {
      const result = await geminiService.analyzeLogistics(skus, WAREHOUSES, routes);
      setOptimization(result);
      setActiveTab("insights");
    } catch (error) {
      alert("Error analyzing data. Please check your API configuration.");
    } finally {
      setIsAnalyzing(false);
    }
  };
  const getStatusColor = (status) => {
    switch (status) {
      case "Healthy" /* HEALTHY */:
        return "bg-green-100 text-green-700 border-green-200";
      case "Low Stock" /* LOW */:
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "Critical" /* CRITICAL */:
        return "bg-orange-100 text-orange-700 border-orange-200";
      case "Out of Stock" /* OUT_OF_STOCK */:
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };
  return /* @__PURE__ */ React3.createElement("div", { className: "min-h-screen bg-slate-50" }, /* @__PURE__ */ React3.createElement("header", { className: "sticky top-0 z-50 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between" }, /* @__PURE__ */ React3.createElement("div", { className: "flex items-center gap-3" }, /* @__PURE__ */ React3.createElement("div", { className: "bg-blue-600 p-2 rounded-lg" }, /* @__PURE__ */ React3.createElement("svg", { className: "w-6 h-6 text-white", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" }, /* @__PURE__ */ React3.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" }))), /* @__PURE__ */ React3.createElement("h1", { className: "text-xl font-bold text-slate-900" }, "LogiSmart ", /* @__PURE__ */ React3.createElement("span", { className: "text-blue-600" }, "Command"))), /* @__PURE__ */ React3.createElement(
    "button",
    {
      onClick: handleAnalyze,
      disabled: isAnalyzing,
      className: `flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${isAnalyzing ? "bg-slate-100 text-slate-400 cursor-not-allowed" : "bg-blue-600 text-white hover:bg-blue-700 shadow-sm active:scale-95"}`
    },
    isAnalyzing ? /* @__PURE__ */ React3.createElement("svg", { className: "animate-spin h-5 w-5", viewBox: "0 0 24 24" }, /* @__PURE__ */ React3.createElement("circle", { className: "opacity-25", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "4", fill: "none" }), /* @__PURE__ */ React3.createElement("path", { className: "opacity-75", fill: "currentColor", d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" })) : /* @__PURE__ */ React3.createElement("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" }, /* @__PURE__ */ React3.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M13 10V3L4 14h7v7l9-11h-7z" })),
    isAnalyzing ? "Analyzing Logistics..." : "Run AI Optimization"
  )), /* @__PURE__ */ React3.createElement("main", { className: "max-w-7xl mx-auto p-6" }, /* @__PURE__ */ React3.createElement("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-4 mb-8" }, [
    { label: "Total SKUs", value: skus.length, icon: "\u{1F4E6}", color: "blue" },
    { label: "Low Stock Alerts", value: skus.filter((s) => s.status !== "Healthy" /* HEALTHY */).length, icon: "\u26A0\uFE0F", color: "amber" },
    { label: "Active Routes", value: routes.filter((r) => r.active).length, icon: "\u{1F69A}", color: "green" },
    { label: "AI Health Score", value: optimization?.score ?? "--", icon: "\u{1F9E0}", color: "indigo" }
  ].map((stat, i) => /* @__PURE__ */ React3.createElement("div", { key: i, className: "bg-white p-5 rounded-xl border border-slate-200 shadow-sm" }, /* @__PURE__ */ React3.createElement("div", { className: "flex items-center justify-between mb-2" }, /* @__PURE__ */ React3.createElement("span", { className: "text-2xl" }, stat.icon), /* @__PURE__ */ React3.createElement("span", { className: `text-xs font-bold uppercase tracking-wider text-${stat.color}-600` }, stat.label)), /* @__PURE__ */ React3.createElement("div", { className: "text-3xl font-bold text-slate-800" }, stat.value)))), /* @__PURE__ */ React3.createElement(DashboardStats, { skus, warehouses: WAREHOUSES }), /* @__PURE__ */ React3.createElement("div", { className: "bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden" }, /* @__PURE__ */ React3.createElement("div", { className: "flex border-b border-slate-200 bg-slate-50/50" }, [
    { id: "inventory", label: "SKU Inventory" },
    { id: "routes", label: "Route Mapping" },
    { id: "insights", label: "AI Optimization Plan" }
  ].map((tab) => /* @__PURE__ */ React3.createElement(
    "button",
    {
      key: tab.id,
      onClick: () => setActiveTab(tab.id),
      className: `px-6 py-4 text-sm font-semibold transition-colors relative ${activeTab === tab.id ? "text-blue-600" : "text-slate-500 hover:text-slate-700"}`
    },
    tab.label,
    activeTab === tab.id && /* @__PURE__ */ React3.createElement("div", { className: "absolute bottom-0 left-0 w-full h-0.5 bg-blue-600" })
  ))), /* @__PURE__ */ React3.createElement("div", { className: "p-6" }, activeTab === "inventory" && /* @__PURE__ */ React3.createElement("div", { className: "overflow-x-auto" }, /* @__PURE__ */ React3.createElement("table", { className: "w-full text-left text-sm" }, /* @__PURE__ */ React3.createElement("thead", { className: "text-slate-500 font-medium bg-slate-50 rounded-lg" }, /* @__PURE__ */ React3.createElement("tr", null, /* @__PURE__ */ React3.createElement("th", { className: "px-4 py-3" }, "SKU Name"), /* @__PURE__ */ React3.createElement("th", { className: "px-4 py-3" }, "Category"), /* @__PURE__ */ React3.createElement("th", { className: "px-4 py-3" }, "Stock Level"), /* @__PURE__ */ React3.createElement("th", { className: "px-4 py-3" }, "Status"), /* @__PURE__ */ React3.createElement("th", { className: "px-4 py-3" }, "Location"), /* @__PURE__ */ React3.createElement("th", { className: "px-4 py-3" }, "Demand"))), /* @__PURE__ */ React3.createElement("tbody", { className: "divide-y divide-slate-100" }, skus.map((sku) => /* @__PURE__ */ React3.createElement("tr", { key: sku.id, className: "hover:bg-slate-50 transition-colors" }, /* @__PURE__ */ React3.createElement("td", { className: "px-4 py-4 font-semibold text-slate-800" }, sku.name), /* @__PURE__ */ React3.createElement("td", { className: "px-4 py-4 text-slate-500" }, sku.category), /* @__PURE__ */ React3.createElement("td", { className: "px-4 py-4" }, /* @__PURE__ */ React3.createElement("div", { className: "flex items-center gap-2" }, /* @__PURE__ */ React3.createElement("div", { className: "w-24 bg-slate-100 h-1.5 rounded-full overflow-hidden" }, /* @__PURE__ */ React3.createElement(
    "div",
    {
      className: `h-full rounded-full ${sku.quantity < sku.reorderPoint ? "bg-red-500" : "bg-blue-500"}`,
      style: { width: `${Math.min(100, sku.quantity / (sku.reorderPoint * 2) * 100)}%` }
    }
  )), /* @__PURE__ */ React3.createElement("span", { className: "font-medium" }, sku.quantity))), /* @__PURE__ */ React3.createElement("td", { className: "px-4 py-4" }, /* @__PURE__ */ React3.createElement("span", { className: `px-2 py-1 rounded-full text-[10px] font-bold border uppercase tracking-tight ${getStatusColor(sku.status)}` }, sku.status)), /* @__PURE__ */ React3.createElement("td", { className: "px-4 py-4 text-slate-500" }, sku.location), /* @__PURE__ */ React3.createElement("td", { className: "px-4 py-4" }, /* @__PURE__ */ React3.createElement("div", { className: "flex items-center gap-1" }, /* @__PURE__ */ React3.createElement("span", { className: "text-blue-600 font-bold" }, sku.demandScore), /* @__PURE__ */ React3.createElement("span", { className: "text-slate-400 text-[10px]" }, "pts")))))))), activeTab === "routes" && /* @__PURE__ */ React3.createElement("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6" }, /* @__PURE__ */ React3.createElement("div", { className: "lg:col-span-2" }, /* @__PURE__ */ React3.createElement(
    LogisticsMap,
    {
      warehouses: WAREHOUSES,
      routes,
      onSelectRoute: (id) => console.log("Selected route:", id)
    }
  )), /* @__PURE__ */ React3.createElement("div", { className: "space-y-4" }, /* @__PURE__ */ React3.createElement("h3", { className: "text-sm font-bold text-slate-400 uppercase tracking-widest px-2" }, "Route Status"), /* @__PURE__ */ React3.createElement("div", { className: "space-y-2" }, routes.map((route) => {
    const from = WAREHOUSES.find((w) => w.id === route.fromId)?.name;
    const to = WAREHOUSES.find((w) => w.id === route.toId)?.name;
    return /* @__PURE__ */ React3.createElement("div", { key: route.id, className: "p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col gap-2" }, /* @__PURE__ */ React3.createElement("div", { className: "flex justify-between items-center" }, /* @__PURE__ */ React3.createElement("span", { className: "font-mono text-xs font-bold text-slate-400" }, route.id), /* @__PURE__ */ React3.createElement("span", { className: `text-[10px] px-2 py-0.5 rounded uppercase font-bold ${route.active ? "bg-green-100 text-green-700" : "bg-slate-200 text-slate-600"}` }, route.active ? "Active" : "Inactive")), /* @__PURE__ */ React3.createElement("div", { className: "flex items-center gap-3 text-sm font-medium" }, /* @__PURE__ */ React3.createElement("span", null, from), /* @__PURE__ */ React3.createElement("svg", { className: "w-4 h-4 text-slate-400", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" }, /* @__PURE__ */ React3.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M14 5l7 7m0 0l-7 7m7-7H3" })), /* @__PURE__ */ React3.createElement("span", null, to)), /* @__PURE__ */ React3.createElement("div", { className: "flex justify-between text-xs text-slate-500 mt-1" }, /* @__PURE__ */ React3.createElement("span", null, route.distance, "km"), /* @__PURE__ */ React3.createElement("span", { className: route.riskLevel === "High" ? "text-red-500 font-bold" : "text-slate-400" }, route.riskLevel, " Risk")));
  })))), activeTab === "insights" && /* @__PURE__ */ React3.createElement("div", { className: "space-y-6" }, !optimization && !isAnalyzing && /* @__PURE__ */ React3.createElement("div", { className: "text-center py-20 border-2 border-dashed border-slate-200 rounded-3xl" }, /* @__PURE__ */ React3.createElement("div", { className: "text-4xl mb-4" }, "\u2728"), /* @__PURE__ */ React3.createElement("h3", { className: "text-lg font-bold text-slate-800 mb-2" }, "Ready for Strategic Insight?"), /* @__PURE__ */ React3.createElement("p", { className: "text-slate-500 mb-6 max-w-md mx-auto text-sm leading-relaxed" }, "Run the AI optimization to analyze bottlenecks in your routes and SKU demand patterns."), /* @__PURE__ */ React3.createElement(
    "button",
    {
      onClick: handleAnalyze,
      className: "bg-blue-600 text-white px-6 py-2 rounded-xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95"
    },
    "Start Analysis"
  )), isAnalyzing && /* @__PURE__ */ React3.createElement("div", { className: "text-center py-20 animate-pulse" }, /* @__PURE__ */ React3.createElement("div", { className: "w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6" }, /* @__PURE__ */ React3.createElement("svg", { className: "w-8 h-8 text-blue-600 animate-spin", viewBox: "0 0 24 24" }, /* @__PURE__ */ React3.createElement("circle", { className: "opacity-25", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "4", fill: "none" }), /* @__PURE__ */ React3.createElement("path", { className: "opacity-75", fill: "currentColor", d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" }))), /* @__PURE__ */ React3.createElement("h3", { className: "text-xl font-bold text-slate-800" }, "Processing Data Models..."), /* @__PURE__ */ React3.createElement("p", { className: "text-slate-500 text-sm mt-2" }, "Gemini is evaluating route efficiencies and risk factors.")), optimization && /* @__PURE__ */ React3.createElement("div", { className: "animate-in fade-in slide-in-from-bottom-4 duration-700" }, /* @__PURE__ */ React3.createElement("div", { className: "flex items-center justify-between mb-8 pb-4 border-b border-slate-100" }, /* @__PURE__ */ React3.createElement("div", null, /* @__PURE__ */ React3.createElement("h3", { className: "text-2xl font-bold text-slate-900" }, "Optimization Report"), /* @__PURE__ */ React3.createElement("p", { className: "text-slate-500 text-sm" }, "Generated just now based on real-time SKU data.")), /* @__PURE__ */ React3.createElement("div", { className: "text-right" }, /* @__PURE__ */ React3.createElement("div", { className: "text-4xl font-black text-blue-600" }, optimization.score, /* @__PURE__ */ React3.createElement("span", { className: "text-slate-300 text-lg" }, "/100")), /* @__PURE__ */ React3.createElement("div", { className: "text-[10px] uppercase font-bold text-slate-400 tracking-widest" }, "Efficiency Index"))), /* @__PURE__ */ React3.createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" }, optimization.insights.map((insight, idx) => /* @__PURE__ */ React3.createElement("div", { key: idx, className: "bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group hover:border-blue-400 transition-colors" }, /* @__PURE__ */ React3.createElement("div", { className: `absolute top-0 right-0 p-1 px-3 text-[10px] font-bold uppercase rounded-bl-xl ${insight.impact === "High" ? "bg-red-500 text-white" : "bg-slate-100 text-slate-600"}` }, insight.impact, " Impact"), /* @__PURE__ */ React3.createElement("div", { className: "flex items-center gap-3 mb-4" }, /* @__PURE__ */ React3.createElement("span", { className: "p-2 bg-blue-50 rounded-lg text-xl" }, insight.type === "Inventory" ? "\u{1F4E6}" : insight.type === "Route" ? "\u{1F69A}" : "\u{1F6E1}\uFE0F"), /* @__PURE__ */ React3.createElement("h4", { className: "font-bold text-slate-800" }, insight.title)), /* @__PURE__ */ React3.createElement("p", { className: "text-sm text-slate-600 leading-relaxed italic border-l-2 border-blue-100 pl-4" }, '"', insight.recommendation, '"')))), /* @__PURE__ */ React3.createElement("div", { className: "mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8" }, /* @__PURE__ */ React3.createElement("div", { className: "bg-orange-50 p-6 rounded-2xl border border-orange-100" }, /* @__PURE__ */ React3.createElement("h4", { className: "text-orange-800 font-bold mb-4 flex items-center gap-2" }, /* @__PURE__ */ React3.createElement("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" }, /* @__PURE__ */ React3.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" })), "Immediate Reorder Required"), /* @__PURE__ */ React3.createElement("div", { className: "flex flex-wrap gap-2" }, optimization.reorderAlerts.map((id) => /* @__PURE__ */ React3.createElement("span", { key: id, className: "bg-white px-3 py-1 rounded-lg border border-orange-200 text-orange-700 font-mono text-xs font-bold shadow-sm" }, id)))), /* @__PURE__ */ React3.createElement("div", { className: "bg-indigo-50 p-6 rounded-2xl border border-indigo-100" }, /* @__PURE__ */ React3.createElement("h4", { className: "text-indigo-800 font-bold mb-4 flex items-center gap-2" }, /* @__PURE__ */ React3.createElement("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" }, /* @__PURE__ */ React3.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M9 20l-5.447-2.724A2 2 0 013 15.483V8.517a2 2 0 011.553-1.943L9 5.25m0 14.75l4-2m-4 2V5.25m4 12.75l5.447 2.724A2 2 0 0021 18.517V11.52a2 2 0 00-1.553-1.943L13 7.25m0 10.75V7.25" })), "Suggested Route Shifts"), /* @__PURE__ */ React3.createElement("div", { className: "flex flex-wrap gap-2" }, optimization.suggestedRoutes.map((id) => /* @__PURE__ */ React3.createElement("span", { key: id, className: "bg-white px-3 py-1 rounded-lg border border-indigo-200 text-indigo-700 font-mono text-xs font-bold shadow-sm" }, id)))))))))), /* @__PURE__ */ React3.createElement("footer", { className: "mt-20 border-t border-slate-200 py-8 px-6 text-center text-slate-400 text-xs" }, "\xA9 2024 LogiSmart AI Optimizer. All logistics models powered by Gemini."));
};
var app_default = App;

// index.tsx
var rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}
var root = ReactDOM.createRoot(rootElement);
root.render(
  /* @__PURE__ */ React4.createElement(React4.StrictMode, null, /* @__PURE__ */ React4.createElement(app_default, null))
);
