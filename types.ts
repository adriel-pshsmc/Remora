
export enum StockStatus {
  HEALTHY = 'Healthy',
  LOW = 'Low Stock',
  CRITICAL = 'Critical',
  OUT_OF_STOCK = 'Out of Stock'
}

export interface SKU {
  id: string;
  name: string;
  category: string;
  quantity: number;
  reorderPoint: number;
  unitPrice: number;
  demandScore: number; // 0-100
  location: string;
  status: StockStatus;
}

export interface Warehouse {
  id: string;
  name: string;
  lat: number;
  lng: number;
  capacity: number;
  utilization: number;
}

export interface Route {
  id: string;
  fromId: string;
  toId: string;
  distance: number; // km
  estimatedTime: number; // minutes
  riskLevel: 'Low' | 'Medium' | 'High';
  active: boolean;
}

export interface AIInsight {
  title: string;
  recommendation: string;
  impact: 'High' | 'Medium' | 'Low';
  type: 'Inventory' | 'Route' | 'Risk';
}

export interface OptimizationPlan {
  score: number;
  insights: AIInsight[];
  suggestedRoutes: string[];
  reorderAlerts: string[];
}