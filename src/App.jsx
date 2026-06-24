import React from 'react'
import ReactDOM from 'react-dom/client'

// Importação dinâmica para evitar problema de case
const AppModule = await import('./app.jsx')
const App = AppModule.default

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
