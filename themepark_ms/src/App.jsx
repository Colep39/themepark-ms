import './App.css'
import NavBar from './NavBar'
import EmpInfo from './pages/Emp-Info'
import Rides from './pages/Rides'
import Shops from './pages/Shops'
import Visit from './pages/Visit'
import Cart from './pages/Cart'
import Home from './pages/Home'
import { Route, Routes} from "react-router-dom"
import BuyTickets from './pages/buy-tickets'
import MyTickets from './pages/My-Tickets'
import Profile from './pages/Profile'
import Login from './pages/Login'
import Register from './pages/Register'

function App() {
  
  return (
    <>
      <NavBar />
      <div className="container">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/rides" element={<Rides />} />
          <Route path="/shops" element={<Shops />} />
          <Route path="/visit" element={<Visit />} />
          <Route path="/information" element={<EmpInfo />} />
          <Route path="/buytickets" element={<BuyTickets />} />
          <Route path="/mytickets" element={<MyTickets />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
    </>
  )
}

export default App
