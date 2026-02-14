import { useState, useEffect } from 'react'
import axios from 'axios'
import './index.css'

function App() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [asset, setAsset] = useState('{ "name": "test-asset" }')
  const [metadata, setMetadata] = useState('{ "notes": "created from UI" }')
  const [blocks, setBlocks] = useState<any[]>([])

  useEffect(() => {
    axios.get('/api/data')
      .then(response => {
        setData(response.data)
        setLoading(false)
      })
      .catch(error => {
        console.error('Error fetching data:', error)
        setLoading(false)
      })
  }, [])

  function submitTx() {
    let assetObj = {}
    let metaObj = {}
    try {
      assetObj = JSON.parse(asset)
      metaObj = JSON.parse(metadata)
    } catch (e) {
      alert('Invalid JSON in asset or metadata')
      return
    }

    axios.post('/api/tx', { asset: assetObj, metadata: metaObj })
      .then(res => {
        alert('Transaction created: ' + JSON.stringify(res.data))
      })
      .catch(err => {
        console.error(err)
        alert('Error creating transaction')
      })
  }

  function fetchBlocks() {
    axios.get('/api/blocks')
      .then(res => setBlocks(res.data || []))
      .catch(err => {
        console.error(err)
        alert('Error fetching blocks')
      })
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Remora Blockchain App</h1>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div>
            <h2>Data from Backend:</h2>
            <pre>{JSON.stringify(data, null, 2)}</pre>
          </div>
        )}

        <section style={{marginTop:20}}>
          <h3>Create Transaction</h3>
          <div>
            <label>Asset (JSON)</label>
            <textarea value={asset} onChange={e => setAsset(e.target.value)} rows={4} cols={60} />
          </div>
          <div>
            <label>Metadata (JSON)</label>
            <textarea value={metadata} onChange={e => setMetadata(e.target.value)} rows={3} cols={60} />
          </div>
          <button onClick={submitTx}>Submit Transaction</button>

          <h3 style={{marginTop:20}}>Blocks</h3>
          <button onClick={fetchBlocks}>Refresh Blocks</button>
          <pre style={{maxHeight:200, overflow:'auto'}}>{JSON.stringify(blocks, null, 2)}</pre>
        </section>
      </header>
    </div>
  )
}

export default App