import { useState, useEffect } from 'react'
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
import { PaymentCancel } from './Pages/Paymentcancel';
import { TicketScanView } from './Pages/ShoworderbyID';
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
          <Route index element={<UseProtectedRoute><Movie /></UseProtectedRoute>} />
          <Route path="theater" element={<UseProtectedRoute><Theater /></UseProtectedRoute>} />
        </Route>
        <Route path="/myticket" element={<UseProtectedRoute><Myticket /></UseProtectedRoute>}>
          <Route index element={<UseProtectedRoute><TicketsList type="upcoming" /></UseProtectedRoute>} />
          <Route path="history" element={<UseProtectedRoute><TicketsList type="history" /></UseProtectedRoute>} />
        </Route>
        <Route path="/home/movie/placeandtime/:id" element={<UseProtectedRoute><PlaceAndTime /></UseProtectedRoute>} />
        <Route path="/home/theater/movieandtime/:id" element={<UseProtectedRoute><TheaterDetail /></UseProtectedRoute>} />

        <Route path="/seatselection" element={<UseProtectedRoute><Seatmap /></UseProtectedRoute>} />
        <Route path="/bookingdetails" element={<UseProtectedRoute><BookingDetail /></UseProtectedRoute>} />
        <Route path="/payment" element={<UseProtectedRoute><PaymentPage /></UseProtectedRoute>} />
        <Route path="/success" element={<UseProtectedRoute><PaymentSuccess /></UseProtectedRoute>} />
        <Route path="/cancel" element={<UseProtectedRoute><PaymentCancel /></UseProtectedRoute>} />
        <Route path="/viewmyticket" element={<UseProtectedRoute><TicketFinalView /></UseProtectedRoute>} />

        <Route path="/myticket/:orderId" element={<TicketScanView />} />


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
