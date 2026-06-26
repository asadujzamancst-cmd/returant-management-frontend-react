import React, { useState, useEffect } from 'react'
import AdminLayout from '../components/AdminLayout'
import { Link } from 'react-router-dom'
import { CSVLink } from 'react-csv'
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ManageFood = () => {
  const [foodItems, setFoodItems] = useState([])
  const [allFoodItems, setAllFoodItems] = useState([])
    const BASE_URL = "https://softworktech.com/asad_ecom";


  // 🔹 Load food items
  useEffect(() => {
    fetch('https://softworktech.com/asad_ecom/api/food-list/')
      .then(res => res.json())
      .then(data => {
        setFoodItems(data)
        setAllFoodItems(data)
      })
      .catch(err => console.error('Failed to fetch food items', err))
  }, [])

  // 🔹 Search by category name or item name
  const handleSearch = (text) => {
    const keyword = text.toLowerCase()
    if (!keyword) {
      setFoodItems(allFoodItems)
      return
    }

    const filtered = allFoodItems.filter(item =>
      item.category_name.toLowerCase().includes(keyword) ||
      item.item_name.toLowerCase().includes(keyword)
    )

    setFoodItems(filtered)
  }

  // 🔹 CSV Export
  const csvData = foodItems.map(item => ({
    Category: item.category_name,
    Name: item.item_name,
    Description: item.description,
    Price: item.price,
    Quantity: item.item_quantity,
    Available: item.is_available ? 'Yes' : 'No',
    Created_At: new Date(item.creation_date).toLocaleString()
  }))

  
  const handleDelete = (id) => {
    if (window.confirm("are you sure")) {
      fetch(`https://softworktech.com/asad_ecom/api/food_delete/${id}/`, {
        method: "DELETE",
      })
        .then((res) => res.text())
        .then(() => {
          toast.success("Deleted successfully");
  
          // 🔥 list update instantly
          setFoodItems((prev) => prev.filter((item) => item.id !== id));
        })
        .catch((err) => console.error(err));
    }
  };
  
  return (
    <AdminLayout>
      <div className="p-4 shadow-sm rounded">
         <ToastContainer position="top-center" autoClose={2000} />
        <h1 className='text-primary'>
          <i className='fas fa-list-alt me-1'></i> Manage Food Page
        </h1>

        <h5 className='text-end'>
          <i className='fas fa-database me-2'></i>
          Total Items: <span className='ms-2 badge bg-success'>{foodItems.length}</span>
        </h5>

        <div className='d-flex justify-content-between mt-3'>
          <input
            type="text"
            className='form-control w-25'
            placeholder='Search by Category or Food Name...'
            onChange={(e) => handleSearch(e.target.value)}
          />
          <CSVLink
            data={csvData}
            filename={"food_items.csv"}
            className='btn btn-success'
          >
            <i className='fas fa-file-csv me-2'></i> Export CSV
          </CSVLink>
        </div>

        <table className='table table-bordered table-hover table-striped mt-4'>
          <thead className='table-dark'>
            <tr>
              <th>S.No</th>
              <th>Category</th>
              <th>Food Name</th>
              <th>Description</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Available</th>
              <th>Image</th>
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {foodItems.map((item, index) => (
              <tr key={item.id}>
                <td>{index + 1}</td>
                <td>{item.category_name}</td>
                <td>{item.name}</td>
                <td>{item.description || '-'}</td>
                <td>{item.price}</td>
                <td>{item.quantity}</td>
                <td>{item.is_available ? 'Yes' : 'No'}</td>
                <td>
                  {item.image ? (
                 <img
                src={
                  food.image
                    ? `${BASE_URL}${food.image}`
                    : "/images/default-food.png"
                }
                className="card-img-top"
                alt={food.name}
                style={{
                  width: "100%",
                  height: "230px",
                  objectFit: "cover",
                }}
              />

                  ) : '-'}
                </td>
                <td>{new Date(item.creation_date).toLocaleString()}</td>
                <td>
                                      <Link to={`/edit_food/${item.id}`} className="btn btn-sm btn-primary me-2">
                                        <i className="fas fa-edit"></i> Edit
                                      </Link>
                                      <button className="btn btn-sm btn-danger" onClick={()=>handleDelete(item.id)}>
                                        <i className="fas fa-trash-alt"></i> Delete
                                      </button>
                                    </td>
              </tr>
            ))}
            {foodItems.length === 0 && (
              <tr>
                <td colSpan="10" className="text-center">No food items found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  )
}

export default ManageFood