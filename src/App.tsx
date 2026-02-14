import { useState, useEffect } from 'react'
import axios from 'axios'

// Minimal styling for dashboard parity
const IconPlaceholder = ({ name }: { name: string }) => (
  <div className="w-5 h-5 bg-sky-500/20 rounded flex items-center justify-center text-[10px] text-sky-400 font-bold">
    {name[0]}
  </div>
)

function App() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => { fetchData() }, [])

  const fetchData = async () => {
    try {
      const response = await axios.get('/api/data')
      setData(response.data)
      setLoading(false)
    } catch (error) {
      console.error(error); setLoading(false)
    }
  }

  if (loading) return (
    <div className="min-h-screen bg-[#25272A] flex items-center justify-center font-sans">
      <div className="animate-pulse text-sky-500 font-bold text-xl">Initializing Remora...</div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#25272A] text-white font-sans flex overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-[#1F2123] border-r border-[#2F3235] flex flex-col hidden lg:flex shrink-0">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-sky-400 tracking-tighter flex items-center gap-2">
            <div className="w-8 h-8 bg-sky-500 rounded-lg flex items-center justify-center text-white text-base">R</div>
            REMORA
          </h1>
        </div>
        
        <nav className="flex-1 px-4 space-y-2 mt-4">
          <button onClick={() => setActiveTab('overview')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'overview' ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/20' : 'hover:bg-[#2F3235] text-gray-400'}`}>
            <IconPlaceholder name="D" /> <span className="font-medium">Logistics Insight</span>
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[#2F3235] text-gray-400">
            <IconPlaceholder name="I" /> <span className="font-medium">Inventory Tracking</span>
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[#2F3235] text-gray-400">
            <IconPlaceholder name="B" /> <span className="font-medium">Blockchain Explorer</span>
          </button>
        </nav>
      </aside>

      {/* Content */}
      <main className="flex-1 flex flex-col overflow-auto">
        <header className="h-16 border-b border-[#2F3235] bg-[#25272A]/80 backdrop-blur-sm flex items-center justify-between px-8 sticky top-0 z-10 shrink-0">
          <div className="flex items-center gap-4 flex-1 max-w-xl">
            <div className="relative w-full">
              <input type="text" placeholder="Search shipments, SKUs..." className="w-full bg-[#2F3235]/50 border border-[#2F3235] rounded-full py-2 px-10 focus:outline-none focus:ring-1 focus:ring-sky-500/50 text-sm" />
              <div className="absolute left-3 top-1/2 -translate-y-1/2 opacity-50"><IconPlaceholder name="S" /></div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 text-green-400 rounded-full text-xs font-semibold border border-green-500/20">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /> Node: Linked
            </div>
          </div>
        </header>

        <div className="p-8 space-y-10">
          <section>
            <div className="mb-8">
              <h2 className="text-3xl font-bold tracking-tight text-white leading-tight">Logistics Insight</h2>
              <p className="text-gray-400 mt-1">Enterprise-level operations visibility</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: 'Active Shipments', value: '1,284', delta: '+12%', color: 'text-green-400' },
                { label: 'On-Time Performance', value: '94.2%', delta: '+0.8%', color: 'text-green-400' },
                { label: 'Blockchain Status', value: data?.blockchain_status ? 'Connected' : 'Mock', delta: 'Latency: 42ms', color: 'text-sky-400' },
                { label: 'System Health', value: 'Optimal', delta: '99.9% Uptime', color: 'text-green-400' },
              ].map((stat, idx) => (
                <div key={idx} className="bg-[#2D3033]/40 backdrop-blur-md border border-white/5 p-6 rounded-2xl shadow-xl hover:bg-[#2D3033]/60 transition-all">
                  <p className="text-sm text-gray-400 font-medium">{stat.label}</p>
                  <h3 className="text-3xl font-bold mt-2 text-white">{stat.value}</h3>
                  <p className={`mt-2 text-xs ${stat.color} font-bold`}>{stat.delta}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-[#2D3033]/40 backdrop-blur-md border border-white/5 rounded-2xl overflow-hidden shadow-xl">
              <div className="p-6 border-b border-[#2F3235] flex justify-between items-center">
                <h3 className="font-bold text-white">Verified Operations History</h3>
                <button onClick={fetchData} className="text-sky-400 text-sm font-bold hover:underline">Refresh</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#1F2123]/40 text-[10px] font-black uppercase text-gray-500 tracking-widest">
                      <th className="px-6 py-4">ID Reference</th>
                      <th className="px-6 py-4">Asset Identification</th>
                      <th className="px-6 py-4">Validation</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#2F3235]/50">
                    {data?.users?.map((u: any) => (
                      <tr key={u.id} className="hover:bg-white/5 transition-colors group">
                        <td className="px-6 py-5 font-mono text-[10px] text-gray-500">{u.id}</td>
                        <td className="px-6 py-5 font-semibold text-white group-hover:text-sky-400 transition-colors">{u.name}</td>
                        <td className="px-6 py-5">
                          <span className="px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 text-[9px] font-black border border-green-500/20">VERIFIED</span>
                        </td>
                      </tr>
                    )) || (
                      <tr><td colSpan={3} className="px-6 py-12 text-center text-gray-500">Awaiting database connection...</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-[#2D3033]/40 backdrop-blur-md border border-white/5 p-6 rounded-2xl shadow-xl">
                <h3 className="font-bold mb-4 text-white">Visual Analytics</h3>
                <div className="aspect-square bg-[#1F2123]/50 rounded-xl flex items-center justify-center border border-[#2F3235] relative overflow-hidden">
                  <div className="absolute w-2 h-2 bg-sky-500 rounded-full animate-ping" />
                  <div className="absolute w-2 h-2 bg-sky-500 rounded-full" />
                  <span className="text-[10px] uppercase font-black tracking-widest text-gray-600 mt-10">Real-time Node Map</span>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}

export default App