import { BrowserRouter, Routes, Route, Outlet } from 'react-router'
import FrontPage from './pages/FrontPage'
import DetailPage from './pages/DetailPage'
import { store } from './store'
import Login from './pages/Login'
import Register from './pages/Register'
import Navbar from './components/navbar'
import { Provider } from 'react-redux'
import Recommended from './pages/Recommended'
import AuthenticationLayout from './layouts/AuthenticationLayout'

function App() {

  return (
    <>
      <Provider store={store}>
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
              <Route path="/" element={<AuthenticationLayout />} >
                <Route path="/games/recommended" element={<Recommended />} />
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </Provider>
    </>
  )
}

export default App
