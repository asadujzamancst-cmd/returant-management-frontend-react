import React,{useState,useEffect} from 'react'
import AdminSidebar from './AdminSidebar'
import AdminHeader from './AdminHeader'
import '../style/Admin.css'

const AdminLayout = ({ children }) => {
const [sidebarOpen, setSidebarOpen] = useState(true);
const [NewOrdersCount, setNewOrdersCount] = useState(0);

useEffect(() => {
  const fetchNewOrdersCount = async () => {
    try {
      const response = await fetch('https://softworktech.com/asad_ecom/api/dashbord/');
      if (!response.ok) throw new Error('Network response was not ok');

      const data = await response.json();
      console.log('Dashboard data:', data); // Debug
      setNewOrdersCount(data.new_orders);  // Make sure your API returns this field
    } catch (error) {
      console.error('Error fetching new orders count:', error);
    }
  };

  fetchNewOrdersCount();
}, []);


  


useEffect(() => {
  const handleResize = () => {
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    } else {
      setSidebarOpen(true);
    }
  };

  handleResize(); // run once on load

  window.addEventListener('resize', handleResize);

  return () => {
    window.removeEventListener('resize', handleResize);
  };
}, []);

const toggleSidebar = () => {
  setSidebarOpen(prev=> !prev );
}

  return (
    <div className='d-flex'>
      {sidebarOpen &&  <AdminSidebar   />}
     

      <div className={`flex-grow-1 ${sidebarOpen?'with-sidebar':'full-width'}`} id="page-content-wrapper">
        <AdminHeader toggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} new_orders_count={NewOrdersCount}/>

        <div className='container-fluid mt-4'>
          {children}
        </div>
      </div>
    </div>
  )
}

export default AdminLayout