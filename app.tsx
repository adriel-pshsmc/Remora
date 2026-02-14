
import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { INITIAL_SKUS, WAREHOUSES, INITIAL_ROUTES } from './constants';
import { SKU, Warehouse, Route, OptimizationPlan, AIInsight, StockStatus } from './types';
import { GeminiLogisticsService } from './services/geminiService';
import { DashboardStats } from './components/DashboardStats';
import { LogisticsMap } from './components/LogisticsMap';

const App: React.FC = () => {
  const [skus, setSkus] = useState<SKU[]>(INITIAL_SKUS);
  const [routes, setRoutes] = useState<Route[]>(INITIAL_ROUTES);
  const [optimization, setOptimization] = useState<OptimizationPlan | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState<'inventory' | 'routes' | 'insights'>('inventory');

  const geminiService = useMemo(() => new GeminiLogisticsService(), []);

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    try {
      const result = await geminiService.analyzeLogistics(skus, WAREHOUSES, routes);
      setOptimization(result);
      setActiveTab('insights');
    } catch (error) {
      alert("Error analyzing data. Please check your API configuration.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getStatusColor = (status: StockStatus) => {
    switch (status) {
      case StockStatus.HEALTHY: return 'bg-green-100 text-green-700 border-green-200';
      case StockStatus.LOW: return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case StockStatus.CRITICAL: return 'bg-orange-100 text-orange-700 border-orange-200';
      case StockStatus.OUT_OF_STOCK: return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-lg">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-slate-900">LogiSmart <span className="text-blue-600">Command</span></h1>
        </div>

        <button 
          onClick={handleAnalyze}
          disabled={isAnalyzing}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
            isAnalyzing 
              ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
              : 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm active:scale-95'
          }`}
        >
          {isAnalyzing ? (
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          )}
          {isAnalyzing ? 'Analyzing Logistics...' : 'Run AI Optimization'}
        </button>
      </header>

      <main className="max-w-7xl mx-auto p-6">
        {/* Real-time Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total SKUs', value: skus.length, icon: '📦', color: 'blue' },
            { label: 'Low Stock Alerts', value: skus.filter(s => s.status !== StockStatus.HEALTHY).length, icon: '⚠️', color: 'amber' },
            { label: 'Active Routes', value: routes.filter(r => r.active).length, icon: '🚚', color: 'green' },
            { label: 'AI Health Score', value: optimization?.score ?? '--', icon: '🧠', color: 'indigo' },
          ].map((stat, i) => (
            <div key={i} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">{stat.icon}</span>
                <span className={`text-xs font-bold uppercase tracking-wider text-${stat.color}-600`}>{stat.label}</span>
              </div>
              <div className="text-3xl font-bold text-slate-800">{stat.value}</div>
            </div>
          ))}
        </div>

        <DashboardStats skus={skus} warehouses={WAREHOUSES} />

        {/* Main Content Tabs */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="flex border-b border-slate-200 bg-slate-50/50">
            {[
              { id: 'inventory', label: 'SKU Inventory' },
              { id: 'routes', label: 'Route Mapping' },
              { id: 'insights', label: 'AI Optimization Plan' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-6 py-4 text-sm font-semibold transition-colors relative ${
                  activeTab === tab.id ? 'text-blue-600' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {tab.label}
                {activeTab === tab.id && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600" />}
              </button>
            ))}
          </div>

          <div className="p-6">
            {activeTab === 'inventory' && (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="text-slate-500 font-medium bg-slate-50 rounded-lg">
                    <tr>
                      <th className="px-4 py-3">SKU Name</th>
                      <th className="px-4 py-3">Category</th>
                      <th className="px-4 py-3">Stock Level</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Location</th>
                      <th className="px-4 py-3">Demand</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {skus.map(sku => (
                      <tr key={sku.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-4 font-semibold text-slate-800">{sku.name}</td>
                        <td className="px-4 py-4 text-slate-500">{sku.category}</td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2">
                            <div className="w-24 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                              <div 
                                className={`h-full rounded-full ${sku.quantity < sku.reorderPoint ? 'bg-red-500' : 'bg-blue-500'}`}
                                style={{ width: `${Math.min(100, (sku.quantity / (sku.reorderPoint * 2)) * 100)}%` }}
                              />
                            </div>
                            <span className="font-medium">{sku.quantity}</span>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <span className={`px-2 py-1 rounded-full text-[10px] font-bold border uppercase tracking-tight ${getStatusColor(sku.status)}`}>
                            {sku.status}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-slate-500">{sku.location}</td>
                        <td className="px-4 py-4">
                           <div className="flex items-center gap-1">
                             <span className="text-blue-600 font-bold">{sku.demandScore}</span>
                             <span className="text-slate-400 text-[10px]">pts</span>
                           </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'routes' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <LogisticsMap 
                    warehouses={WAREHOUSES} 
                    routes={routes} 
                    onSelectRoute={(id) => console.log('Selected route:', id)} 
                  />
                </div>
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest px-2">Route Status</h3>
                  <div className="space-y-2">
                    {routes.map(route => {
                      const from = WAREHOUSES.find(w => w.id === route.fromId)?.name;
                      const to = WAREHOUSES.find(w => w.id === route.toId)?.name;
                      return (
                        <div key={route.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col gap-2">
                          <div className="flex justify-between items-center">
                            <span className="font-mono text-xs font-bold text-slate-400">{route.id}</span>
                            <span className={`text-[10px] px-2 py-0.5 rounded uppercase font-bold ${route.active ? 'bg-green-100 text-green-700' : 'bg-slate-200 text-slate-600'}`}>
                              {route.active ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 text-sm font-medium">
                            <span>{from}</span>
                            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                            <span>{to}</span>
                          </div>
                          <div className="flex justify-between text-xs text-slate-500 mt-1">
                            <span>{route.distance}km</span>
                            <span className={route.riskLevel === 'High' ? 'text-red-500 font-bold' : 'text-slate-400'}>
                              {route.riskLevel} Risk
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'insights' && (
              <div className="space-y-6">
                {!optimization && !isAnalyzing && (
                  <div className="text-center py-20 border-2 border-dashed border-slate-200 rounded-3xl">
                    <div className="text-4xl mb-4">✨</div>
                    <h3 className="text-lg font-bold text-slate-800 mb-2">Ready for Strategic Insight?</h3>
                    <p className="text-slate-500 mb-6 max-w-md mx-auto text-sm leading-relaxed">
                      Run the AI optimization to analyze bottlenecks in your routes and SKU demand patterns.
                    </p>
                    <button 
                      onClick={handleAnalyze}
                      className="bg-blue-600 text-white px-6 py-2 rounded-xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95"
                    >
                      Start Analysis
                    </button>
                  </div>
                )}

                {isAnalyzing && (
                  <div className="text-center py-20 animate-pulse">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <svg className="w-8 h-8 text-blue-600 animate-spin" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-slate-800">Processing Data Models...</h3>
                    <p className="text-slate-500 text-sm mt-2">Gemini is evaluating route efficiencies and risk factors.</p>
                  </div>
                )}

                {optimization && (
                  <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100">
                      <div>
                        <h3 className="text-2xl font-bold text-slate-900">Optimization Report</h3>
                        <p className="text-slate-500 text-sm">Generated just now based on real-time SKU data.</p>
                      </div>
                      <div className="text-right">
                        <div className="text-4xl font-black text-blue-600">{optimization.score}<span className="text-slate-300 text-lg">/100</span></div>
                        <div className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Efficiency Index</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {optimization.insights.map((insight, idx) => (
                        <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group hover:border-blue-400 transition-colors">
                          <div className={`absolute top-0 right-0 p-1 px-3 text-[10px] font-bold uppercase rounded-bl-xl ${
                            insight.impact === 'High' ? 'bg-red-500 text-white' : 'bg-slate-100 text-slate-600'
                          }`}>
                            {insight.impact} Impact
                          </div>
                          <div className="flex items-center gap-3 mb-4">
                            <span className="p-2 bg-blue-50 rounded-lg text-xl">
                              {insight.type === 'Inventory' ? '📦' : insight.type === 'Route' ? '🚚' : '🛡️'}
                            </span>
                            <h4 className="font-bold text-slate-800">{insight.title}</h4>
                          </div>
                          <p className="text-sm text-slate-600 leading-relaxed italic border-l-2 border-blue-100 pl-4">
                            "{insight.recommendation}"
                          </p>
                        </div>
                      ))}
                    </div>

                    <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
                       <div className="bg-orange-50 p-6 rounded-2xl border border-orange-100">
                          <h4 className="text-orange-800 font-bold mb-4 flex items-center gap-2">
                             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                             </svg>
                             Immediate Reorder Required
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {optimization.reorderAlerts.map(id => (
                              <span key={id} className="bg-white px-3 py-1 rounded-lg border border-orange-200 text-orange-700 font-mono text-xs font-bold shadow-sm">
                                {id}
                              </span>
                            ))}
                          </div>
                       </div>
                       <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100">
                          <h4 className="text-indigo-800 font-bold mb-4 flex items-center gap-2">
                             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A2 2 0 013 15.483V8.517a2 2 0 011.553-1.943L9 5.25m0 14.75l4-2m-4 2V5.25m4 12.75l5.447 2.724A2 2 0 0021 18.517V11.52a2 2 0 00-1.553-1.943L13 7.25m0 10.75V7.25" />
                             </svg>
                             Suggested Route Shifts
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {optimization.suggestedRoutes.map(id => (
                              <span key={id} className="bg-white px-3 py-1 rounded-lg border border-indigo-200 text-indigo-700 font-mono text-xs font-bold shadow-sm">
                                {id}
                              </span>
                            ))}
                          </div>
                       </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="mt-20 border-t border-slate-200 py-8 px-6 text-center text-slate-400 text-xs">
        &copy; 2024 LogiSmart AI Optimizer. All logistics models powered by Gemini.
      </footer>
    </div>
  );
};

export default App;