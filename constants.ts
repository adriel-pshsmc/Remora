
import { SKU, StockStatus, Warehouse, Route } from './types';

export const INITIAL_SKUS: SKU[] = [
  { id: 'SKU-001', name: 'Premium Coffee Beans', category: 'F&B', quantity: 450, reorderPoint: 100, unitPrice: 15.5, demandScore: 85, location: 'WH-East', status: StockStatus.HEALTHY },
  { id: 'SKU-002', name: 'Eco-Friendly Filters', category: 'Hardware', quantity: 45, reorderPoint: 50, unitPrice: 5.0, demandScore: 40, location: 'WH-West', status: StockStatus.LOW },
  { id: 'SKU-003', name: 'Industrial Grinder X1', category: 'Equipment', quantity: 2, reorderPoint: 5, unitPrice: 1200, demandScore: 92, location: 'WH-East', status: StockStatus.CRITICAL },
  { id: 'SKU-004', name: 'Oat Milk 1L (Pack)', category: 'F&B', quantity: 120, reorderPoint: 150, unitPrice: 22.0, demandScore: 78, location: 'WH-North', status: StockStatus.LOW },
  { id: 'SKU-005', name: 'Paper Cups 500ct', category: 'Disposables', quantity: 0, reorderPoint: 200, unitPrice: 35.0, demandScore: 65, location: 'WH-South', status: StockStatus.OUT_OF_STOCK },
];

export const WAREHOUSES: Warehouse[] = [
  { id: 'WH-East', name: 'Eastern Hub', lat: 40.7128, lng: -74.0060, capacity: 5000, utilization: 0.65 },
  { id: 'WH-West', name: 'Western Depot', lat: 34.0522, lng: -118.2437, capacity: 3000, utilization: 0.82 },
  { id: 'WH-North', name: 'Northern Gateway', lat: 41.8781, lng: -87.6298, capacity: 4500, utilization: 0.45 },
  { id: 'WH-South', name: 'Southern Center', lat: 29.7604, lng: -95.3698, capacity: 4000, utilization: 0.95 },
];

export const INITIAL_ROUTES: Route[] = [
  { id: 'R-1', fromId: 'WH-East', toId: 'WH-North', distance: 1300, estimatedTime: 1200, riskLevel: 'Low', active: true },
  { id: 'R-2', fromId: 'WH-North', toId: 'WH-West', distance: 3300, estimatedTime: 3000, riskLevel: 'Medium', active: true },
  { id: 'R-3', fromId: 'WH-West', toId: 'WH-South', distance: 2500, estimatedTime: 2300, riskLevel: 'Low', active: false },
  { id: 'R-4', fromId: 'WH-South', toId: 'WH-East', distance: 2600, estimatedTime: 2400, riskLevel: 'High', active: true },
];
