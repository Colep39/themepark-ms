import './App.css'
import NavBar from './NavBar'
import EmpInfo from './pages/Emp-Info'
import Rides from './pages/Rides'
import Shops from './pages/Shops/Shops'
import Visit from './pages/Visit'
import Cart from './pages/Cart'
import Home from './pages/Home'
import { Route, Routes} from "react-router-dom"
import BuyTickets from './pages/Buy-tickets'
import MyTickets from './pages/My-Tickets'
import Profile from './pages/Profile'
import Login from './pages/register-login/Login'
import Register from './pages/register-login/Register'
import GourmetBites from './pages/Shops/GourmetBites.jsx'
import CandyKingdom from './pages/Shops/CandyKingdom.jsx'
import AdventureGear from './pages/Shops/AdventureGear.jsx'

function App() {
  
  return (
    <>
      <NavBar />
      <div className="container">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/rides" element={<Rides />} />
          <Route path="/visit" element={<Visit />} />
          <Route path="/information" element={<EmpInfo />} />
          <Route path="/buytickets" element={<BuyTickets />} />
          <Route path="/mytickets" element={<MyTickets />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/register" element={<Register />} />
          <Route path="/candykingdom" element={<CandyKingdom />} />
          <Route path="/gourmetbites" element={<GourmetBites />} />
          <Route path="/adventuregear" element={<AdventureGear />} />
        </Routes>
      </div>
    </>
  )
}

export default App
