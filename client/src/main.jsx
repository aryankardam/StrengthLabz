import React from 'react'
import './index.css'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import App from './App'
import { DataProvider } from './GlobalState'
import '@fontsource/inter'
import router from './routes/Index' // assume this is created using createBrowserRouter()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <DataProvider>
      <RouterProvider router={router} />
    </DataProvider>
  </React.StrictMode>

)
