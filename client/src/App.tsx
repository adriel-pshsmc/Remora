import { useState, useEffect } from 'react'
import axios from 'axios'
import './index.css'

function App() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

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
      </header>
    </div>
  )
}

export default App