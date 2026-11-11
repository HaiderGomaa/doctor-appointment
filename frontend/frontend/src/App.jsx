import './App.css'
import Home from './pages/Home'
import Navbar from './Navbar'
import Login from './components/Login'
import SignUp from './components/SignUp'
import AddAppointment from './AddAppointment'
import AddDepertment from './pages/AddDepertment'
import AddDoctor from './pages/AddDoctor'
import Logout from './Logout'
import DoctorDetails from './components/DoctorDetails'
import MyAppoitments from './components/MyAppoitments'
import AboutUs from './components/AboutUs'
import Services from './components/Services'
import { Route,Routes } from 'react-router-dom'
function App() {

  return (
    <>
    <Navbar />
    <Routes>
      <Route index path='/' element={<Home/>} />
      <Route path='/login' element={<Login />} />
      <Route path='/register' element={<SignUp />} />
      <Route path='/about' element={<AboutUs />} />
      <Route path='/services' element={<Services />} />
      <Route path='/appointments/new' element={<AddAppointment />} />
      <Route path='/admin/add-department' element={<AddDepertment />} />
      <Route path='/admin/add-doctor' element={<AddDoctor />} />
      <Route path='/doctors/:id' element={<DoctorDetails />} />
      <Route path='/my-appointments' element={<MyAppoitments />} />
      <Route path='/logout' element={<Logout />} />

    </Routes>


      

        
       
    </>
  )
}

export default App
