import './App.css'
import NavBar from './NavBar'
import EmpInfo from './pages/Emp-Info'
import Rides from './pages/Rides'
import Shops from './pages/Shops'
import Visit from './pages/Visit'
import Cart from './pages/Cart'
import Home from './pages/Home'
import { Route, Routes} from "react-router-dom"

function App() {
  
  return (
    <>
      <NavBar />
      <div className="container">
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/rides" element={<Rides />} />
          <Route path="/shops" element={<Shops />} />
          <Route path="/visit" element={<Visit />} />
          <Route path="/information" element={<EmpInfo />} />
          <Route path="/cart" element={<Cart />} />
        </Routes>
      </div>
    </>
  )
}

export default App
