import { Link, Navigate, Route, Routes } from 'react-router-dom'
import ResourceDetail from './pages/resources/ResourceDetail'
import ResourceForm from './pages/resources/ResourceForm'
import ResourceList from './pages/resources/ResourceList'
import './App.css'

function App() {
  return (
    <div className="app-shell">
      <header className="top-nav">
        <Link to="/resources" className="brand">
          SmartUni Facilities
        </Link>
        <nav>
          <Link to="/resources">Resources</Link>
          <Link to="/resources/new">Add Resource</Link>
        </nav>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<Navigate to="/resources" replace />} />
          <Route path="/resources" element={<ResourceList />} />
          <Route path="/resources/new" element={<ResourceForm />} />
          <Route path="/resources/:id" element={<ResourceDetail />} />
          <Route path="/resources/:id/edit" element={<ResourceForm />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
