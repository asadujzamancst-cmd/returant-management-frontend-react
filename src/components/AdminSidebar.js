import React,{useState} from 'react'
import { Link } from 'react-router-dom'
import "../style/Home.css";

import { FaChevronCircleDown, FaChevronCircleUp, FaComment, FaEdit, FaFile, FaList, FaSearch, FaThLarge, FaUser } from 'react-icons/fa'

const AdminSidebar = () => {


const [menuopen, setMenuopen] = useState({
    categoryOpen:false,
    foodCategoryOpen:false,
    orders:false,
});
const toggleMenu = (menu) =>{
    setMenuopen((prevState) => ({
        ...prevState,
        [menu]: !prevState[menu],
    }));
}

  return (
   <div className="sidebar bg-dark text-white" style={{ height: "100vh", overflowY: "auto" }}>
  <div className='AdminProfile border-bottom text-center p-2'> 
    <img src="/images/Adminx.jpg" alt="Admin" className='img-fluid rounded-circle mb-2' style={{width:"80px", height:"80px"}}/>  
    <h5 className='AdminProfile'>Admin</h5>
  </div>


        <div className='list-group list-group-flush'>
            <Link to={'/admin-dashboard'} className='list-group-item list-group-item-action bg-dark text-white'>
            <FaThLarge/> dashboard</Link>

        </div>
         <div className='list-group list-group-flush'>
            <Link to={'/chat-bot'} className='list-group-item list-group-item-action bg-dark text-white'>
            <FaThLarge/> chatt</Link>

        </div>

         <div className='list-group list-group-flush'>
            <Link to={"/manage-user"} className='list-group-item list-group-item-action bg-dark text-white'>
            <FaUser/> RegUser</Link>

        </div>
        


        <button onClick={()=>toggleMenu('categoryOpen')} className='list-group-item list-group-item-action bg-dark text-white'>

            <FaEdit/> Category {menuopen.categoryOpen ? <FaChevronCircleUp/> : <FaChevronCircleDown/>}
        </button>
        {menuopen.categoryOpen &&(

      
        <div className='ps-4'>   

            <Link to="/add-catagory" className='list-group-item list-group-item-action bg-dark text-white'>
           Add Category</Link>

            <Link to="/manage-catagory" className='list-group-item list-group-item-action bg-dark text-white'>
           Manage Category</Link>

        </div>
          )}



         <div className='list-group list-group-flush'>
            <Link className='list-group-item list-group-item-action bg-dark text-white'
            to= {'/order-report'}
            >
            <FaFile/>B/w Dates Reports    </Link>

        </div>  
                 <button onClick={()=>toggleMenu('foodCategoryOpen')} className='list-group-item list-group-item-action bg-dark text-white'>

            <FaEdit/>Food  Category {menuopen.foodCategoryOpen ? <FaChevronCircleUp/> : <FaChevronCircleDown/>}
        </button>
        {menuopen.foodCategoryOpen &&(
        <div className='ps-4'>   

            <Link to={"/add-food"} className='list-group-item list-group-item-action bg-dark text-white'>
          Add Food </Link>

            <Link to={"/manage-food"} className='list-group-item list-group-item-action bg-dark text-white'>
           Manage food </Link>

        </div>
        )}

          <div className='list-group list-group-flush'>
            <Link to={'/orderSearch'} className='list-group-item list-group-item-action bg-dark text-white'>
           <FaSearch/>  Search</Link>

        </div>  
        <div className='list-group list-group-flush'>
            <Link to={'/riderOrder'} className='list-group-item list-group-item-action bg-dark text-white'>
            Rider manage food</Link>

        </div>  
                <div className='list-group list-group-flush'>
            <Link to={'/managerider'} className='list-group-item list-group-item-action bg-dark text-white'>
           manage   Rider</Link>

        </div>  


        <div className='list-group list-group-flush'>
            <Link to={"/manage-review"} className='list-group-item list-group-item-action bg-dark text-white'>
           <FaComment/>  review</Link>

        </div> 


         <button onClick={()=>toggleMenu('orders')} className='list-group-item list-group-item-action bg-dark text-white'>

            <FaList />orders {menuopen.orders ? <FaChevronCircleUp/> : <FaChevronCircleDown/>   }
        </button>
        {menuopen.orders &&( 
        <div className='ps-4'>   

            <Link to={"/notConfirmd"} className='list-group-item list-group-item-action bg-dark text-white'>
           NOt Confirm</Link>

            <Link to={"/Confirmd"} className='list-group-item list-group-item-action bg-dark text-white'>
            Confirm</Link>
            <Link to={"/order-ready"} className='list-group-item list-group-item-action bg-dark text-white'>
            Being Prepared</Link>
            <Link to={"/order-pick"} className='list-group-item list-group-item-action bg-dark text-white'>
            Food Pickup</Link>
            <Link to={"/order-cancel"} className='list-group-item list-group-item-action bg-dark text-white'>
            Cancelled</Link>
            <Link to={"/deliver"} className='list-group-item list-group-item-action bg-dark text-white'>
            Delivered</Link>
            <Link to={"/all-order"} className='list-group-item list-group-item-action bg-dark text-white'>
            All orders</Link>
        </div>
        )}
      
    </div>
  )
}

export default AdminSidebar