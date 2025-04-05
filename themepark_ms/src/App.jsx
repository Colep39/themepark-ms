import './App.css'
import NavBar from './NavBar'
import EmpInfo from './pages/Emp-Info'
import Rides from './pages/Rides'
import Visit from './pages/Visit'
import Cart from './pages/Cart'
import Home from './pages/Home'
import {Route, Routes} from "react-router-dom"
import BuyTickets from './pages/Buy-tickets'
import MyTickets from './pages/My-Tickets'
import Profile from './pages/Profile'
import Login from './pages/register-login/Login'
import Register from './pages/register-login/Register'
import GourmetBites from './pages/Shops/GourmetBites.jsx'
import CandyKingdom from './pages/Shops/CandyKingdom.jsx'
import AdventureGear from './pages/Shops/AdventureGear.jsx'
import MaintenanceReport from './pages/Employee/MaintenanceReport.jsx'
import WeatherReport from './pages/Employee/WeatherReport.jsx'
import RideLogs from './pages/Employee/RideLogs.jsx'
import Admin from './pages/Employee/Admin.jsx'
import ManageRides from './pages/Employee/ManageRides.jsx'
import ManageShops from './pages/Employee/ManageShops.jsx'
import ManageUsers from './pages/Employee/ManageUsers.jsx'
import TicketReport from './pages/Employee/TicketReport.jsx'
import ManageBreakdowns from './pages/Employee/ManageBreakdowns.jsx'
import Unauthorized from './pages/Unauthorized.jsx'
import PrivateRoute from './PrivateRoute'
import RecordWeather from './pages/Employee/RecordWeather.jsx'
import { ToastContainer } from 'react-toastify';

function App() {
  
  return (
    <>
      <NavBar />
      <div className="container">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
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
            <Route path="/adminpage"  element={<Admin />} />
            <Route path="/recordweather" element={<RecordWeather />} />

            {/*These will be the privatized pages*/}
            <Route path="/maintenancereport" element={
              <PrivateRoute allowedRoles={["Admin", "Staff"]}>
                <MaintenanceReport />
              </PrivateRoute>
              } 
            />
            <Route path="/weatherreport" element={
              <PrivateRoute allowedRoles={["Admin", "Staff"]}><WeatherReport /></PrivateRoute>} />
            <Route path="/ridelogs" element={
              <PrivateRoute allowedRoles={["Admin", "Staff"]}><RideLogs /></PrivateRoute> }/>
            {/*
            <Route path="/adminpage" element={
              <PrivateRoute allowedRoles={["Admin"]}><Admin /></PrivateRoute>} />
            */}
            <Route path="/managerides" element={
              <PrivateRoute allowedRoles={["Admin", "Staff"]}><ManageRides /> </PrivateRoute>} />
            <Route path="/manageshops" element={
              <PrivateRoute allowedRoles={["Admin", "Staff"]}><ManageShops /> </PrivateRoute>} />
            <Route path="/manageusers" element={
              <PrivateRoute allowedRoles={["Admin"]}><ManageUsers /> </PrivateRoute>} />
            <Route path="/ticketreport" element={
              <PrivateRoute allowedRoles={["Admin", "Staff"]}><TicketReport /> </PrivateRoute>} />
            <Route path="/managebreakdowns" element={
              <PrivateRoute allowedRoles={["Admin", "Staff"]}><ManageBreakdowns /> </PrivateRoute>} />
            
          </Routes>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  )
}

export default App
