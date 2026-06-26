import React,{useState} from 'react'
import { FaBars, FaBell, FaChevronLeft, FaChevronRight, FaSignOutAlt } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'

const AdminHeader = ({toggleSidebar,sidebarOpen,new_orders_count}) => {
  const navigate = useNavigate();



  const handleLogOut = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin-login');
  }
  return (
   <nav className='navbar navbar-expand-lg navbar-light bg-light border-bottom p-3 shadow-sm'>
  {/* Sidebar toggle */}
  <button className='btn btn-outline-dark me-3' onClick={toggleSidebar}>
    {sidebarOpen ? <FaChevronLeft/> : <FaChevronRight/>}
  </button>

  <span className='navbar-brand mb-0 h1 pe-3'>
    <i className='fas fa-utensils me-2'></i> Food Ordering System
  </span>

  {/* Hamburger for small screens */}
  <button
    className='navbar-toggler'
    type='button'
    data-bs-toggle='collapse'
    data-bs-target='#navbarSupportedContent'
    aria-controls='navbarSupportedContent'
    aria-expanded='false'
    aria-label='Toggle navigation'
  >
    <FaBars />
  </button>

  {/* Collapsible navbar content */}
  <div className='collapse navbar-collapse gap-2' id='navbarSupportedContent'>
    <ul className='navbar-nav ms-auto align-items-center'> 
      <li className='nav-item d-flex gap-2'>
        {/* Bell button */}
        <button className='btn btn-outline-secondary position-relative' onClick={() => navigate('/notConfirmd')}>
          <FaBell /> 
          <span className='badge bg-danger position-absolute top-0 start-100 translate-middle'>
            {new_orders_count}
          </span>
        </button>

        {/* Logout button */}
        <button className='btn btn-outline-danger align-items-center' onClick={handleLogOut}>
          <FaSignOutAlt className="me-1"/>
          Logout
        </button>
      </li>
    </ul>
  </div>
</nav>

  )
}

export default AdminHeader