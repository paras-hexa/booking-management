import { useState } from 'react'
import 'react-toastify/dist/ReactToastify.css';
import './App.css'
import { toast, ToastContainer } from 'react-toastify';
import { Routes, Route, Router, Navigate } from 'react-router-dom'
import { Login } from './Pages/Login'
import { Registration } from './Pages/Registration'
import { Home } from './Pages/Home';
import { Movie } from './Pages/Movie';
import { Theater } from './Pages/Theater';
import { Myticket } from './Pages/Myticket';
import {TicketsList} from './Pages/TicketListing';
import { Home2 } from './Pages/Place_Time';
import { MovieSelection } from './Pages/P';
function App() {
  const [count, setCount] = useState(0)
  return (
    <>



      <Routes>

        {/* Default route redirects to /home */}
        < Route path="/" element={<Navigate to="/login" />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Registration />} />
        {/* Home nested routes */}
        <Route path="/home" element={<Home />}>
          <Route index element={<Movie />} />
          <Route path="theater" element={<Theater />} />
        </Route>
        <Route path="/myticket" element={<Myticket />}>
          <Route index element={<TicketsList type="upcoming" />} />
          <Route path="history" element={<TicketsList  type="history" />} />
        </Route>
        <Route path="/place and time" element={<Home2 />}/>
        
    

        {/* Other pages */}
      </Routes>

      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        toastClassName="custom-toast"
        bodyClassName="custom-toast-body"
        progressClassName="custom-progress"
      />
    </>
  )
}

export default App
