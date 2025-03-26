import { BrowserRouter, Routes, Route, Outlet } from 'react-router'
import FrontPage from './pages/FrontPage'
import DetailPage from './pages/DetailPage'
import Login from './pages/Login'
import Register from './pages/Register'
import Navbar from './components/navbar'

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route element={
              <div>
                <Navbar />
                <Outlet />
              </div>
            }
          >
            <Route path="/" element={<FrontPage />} />
            <Route path="/game/:id" element={<DetailPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
