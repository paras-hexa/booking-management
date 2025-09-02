import { useState , useEffect } from 'react'
import 'react-toastify/dist/ReactToastify.css';
import './App.css'
import { UseProtectedRoute } from './hooks/UseProtectedRoute';
import { toast, ToastContainer } from 'react-toastify';
import { Routes, Route, Router, Navigate } from 'react-router-dom'
import { Login } from './Pages/Login'
import { Registration } from './Pages/Registration'
import { Home } from './Pages/Home';
import { Movie } from './Pages/Movie';
import { Theater } from './Pages/Theater';
import { Myticket } from './Pages/Myticket';
import { TicketsList } from './Pages/TicketListing';
import { PlaceAndTime } from './Pages/Place_Time';
import { Seatmap } from './Pages/Seatmap';
import { BookingDetail } from './Pages/Ticketdetails';
import { PaymentPage } from './Pages/Payment';
import { PaymentSuccess } from './Pages/PaymentSuccesspage';
import { TicketFinalView } from './Pages/Viewticket';
import { TheaterDetail } from './Pages/Movie_Time';
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
        <Route path="/home" element={<UseProtectedRoute><Home /></UseProtectedRoute>}>
          <Route index element={<Movie />} />
          <Route path="theater" element={<Theater />} />
          <Route path="theater/movieandtime/:id" element={<TheaterDetail/>} />
        </Route>
        <Route path="/myticket" element={<UseProtectedRoute><Myticket /></UseProtectedRoute>}>
          <Route index element={<TicketsList type="upcoming" />} />
          <Route path="history" element={<TicketsList type="history" />} />
        </Route>
        <Route path="/home/movie/placeandtime/:id" element={<PlaceAndTime />} />
        <Route path="/seatselection" element={<Seatmap />} />
        <Route path="/bookingdetails" element={<BookingDetail />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/paymentsuccess" element={<PaymentSuccess />} />
        <Route path="/viewmyticket" element={<TicketFinalView/>} />
           


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
