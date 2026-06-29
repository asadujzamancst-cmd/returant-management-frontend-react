
import './App.css';
import AdminLogin from './pages/AdminLogin';
import Home from './pages/Home';
import { BrowserRouter , Route, Routes } from 'react-router-dom';
import AdminDashbord from './pages/AdminDashbord';
import AddCatagory from './pages/AddCatagory';
import ManageCatagory from './pages/ManageCatagory';
import AddFood from './pages/AddFood';
import ManageFood from './pages/ManageFood';
import PageSearch from './pages/PageSearch';
import Registration from './pages/Registration';
import LoginUser from './pages/LoginUser';
import FoodDetail from './pages/FoodDetail';
import CartD from './pages/CartD';
import Payment from './pages/Payment';
import MyOrders from './pages/MyOrders';
import OrderDetails from './pages/OrderDetails';
import Profile from './pages/Profile';
import Changepassword from './pages/Changepassword';
import OrdersNotConfirm from './pages/OrdersNotConfirm';
import OrdersConfirm from './pages/OrderConfirm';
import OrderPick from './pages/OrderPick';
import OrderCancel from './pages/OrderCancel';
import OrderDeliver from './pages/OrderDeliver';
import AllOrder from './pages/AllOrder';
import OrderReady from './pages/OrderReady';
import OrderReport from './pages/OrderReport';
import ViewFoodOrder from './pages/ViewFoodOrder';
import FoodOrderSeearch from './pages/FoodOrderSeearch';
import Edit_catagory from './pages/Edit_catagory';
import Edit_food from './pages/Edit_food';
import ManageUsers from './pages/ManageUsers';
import { AuthProvider } from './pages/AuthContext';
import FoodMenu from './pages/FoodMenu';
import Wishlist from './pages/Wishlist';
import { WishlistProvider } from './pages/WishlistContex';
import Track from './pages/Track';
import ManageReview from './pages/ManageReview';
import Chat from './pages/Chat';
import AdmiinChat from './pages/AdmiinChat';
import RiderRegister from './pages/RiderRegister';
import RiderLogin from './pages/RiderLogin';
import RiderDashbord from './RiderComponent/RiderDashbord';
import RiderPickupFood from './RiderComponent/RiderPickupFood';
import AdminRiderOrders from './pages/AdminRider';
import AdminRiderManagement from './pages/AdminRiderManagement';
import Chatmodal from './components/Chatmodal';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import AdminResetPassword from './pages/AdminResetPassword';
import AdminForgotPassword from './pages/AdminForgotPassword';
import Rider_forgot_password from './pages/RiderForgotPassword';
import Rider_reset_password from './pages/RiderResetPassword';
import Offer from './pages/Offer';

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <WishlistProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home/>}/>,
          <Route path='/admin-login' element={<AdminLogin/>}/>
          <Route path='/admin-dashboard' element={<AdminDashbord/>}/>
          <Route path="/riderOrder" element={<AdminRiderOrders />} />
                    <Route path="/managerider" element={<AdminRiderManagement />} />


           <Route path='/add-catagory' element={<AddCatagory/>}/>
           <Route path='/manage-catagory' element={<ManageCatagory/>}/>
           <Route path='/add-food' element={<AddFood/>}/>
<Route path="/edit_food/:id" element={<Edit_food />} />
           <Route path='/manage-food' element={<ManageFood/>}/>
           <Route path='/food_search' element={<PageSearch/>}/>
           <Route path='/registration' element={<Registration/>}/>
           <Route path='/login-user' element={<LoginUser/>}/>
            <Route path='/food/:id' element={<FoodDetail/>}/>
            <Route path='/cartD' element={<CartD/>}/>
            <Route path='/payment' element={<Payment/>}/>
            <Route path='/my-order' element={<MyOrders/>}/>
            <Route path='/order-details/:order_number' element={<OrderDetails/>}/>

            
              <Route path='/profile' element={<Profile/>}/>
              <Route path='/change-password' element={<Changepassword/>}/>

              <Route path='/manage-review' element={<ManageReview/>}/>
              <Route path='/notConfirmd' element={<OrdersNotConfirm/>}/>
               <Route path='/confirmd' element={<OrdersConfirm/>}/>
                <Route path='/order-pick' element={<OrderPick/>}/>
                 <Route path='/order-cancel' element={<OrderCancel/>}/>
                  <Route path='/deliver' element={<OrderDeliver/>}/>
                   <Route path='/all-order' element={<AllOrder/>}/>
                   <Route path='/order-ready' element={<OrderReady/>}/>
            <Route path='/order-report' element={<OrderReport/>}/>
           <Route path='/admin-view-details/:order_number' element={<ViewFoodOrder />} />

           <Route path='/orderSearch' element={<FoodOrderSeearch />} />
           <Route path='/edit_catagory/:id' element={<Edit_catagory/>}/>
<Route path="/manage-user" element={<ManageUsers />} />
<Route path="/menu" element={<FoodMenu />} />
<Route path="/whishlist" element={<Wishlist />} />


//chat
<Route path="/chat" element={<Chat />} />
<Route path="/chat-modal" element={<Chatmodal />} />
<Route path="/chat-bot" element={<AdmiinChat />} />

// forgot password
<Route path="/forgot-password" element={<ForgotPassword />} />
<Route path="/reset-password/:uid/:token" element={<ResetPassword />} />
<Route path="/admin-forgot-password" element={<AdminForgotPassword />} />
<Route path="/admin-reset-password/:uid/:token" element={<AdminResetPassword />} />
<Route path="/rider-forgot-password" element={<Rider_forgot_password />} />
<Route path="/rider-reset-password/:uid/:token" element={<Rider_reset_password />} />



// Track routes
<Route path="/track" element={<Track />} />
<Route path="/track-order/:order_number" element={<Track />} />






            

             <Route path="/rider/register" element={<RiderRegister />} />
        <Route path="/rider/login" element={<RiderLogin />} />
        <Route path="/rider/dashboard" element={<RiderDashbord />} />
                <Route path="/riderFood" element={<RiderPickupFood />} />
                
<Route path="/offer" element={<Offer />} />

            


        </Routes>
      </BrowserRouter>
      </WishlistProvider>
      </AuthProvider>
    </div>
  );
}

export default App;
