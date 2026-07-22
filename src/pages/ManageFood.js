import React, { useState, useEffect } from 'react'
import AdminLayout from '../components/AdminLayout'
import { Link } from 'react-router-dom'
import { CSVLink } from 'react-csv'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const BASE_URL = "https://softworktech.com/asad_ecom";

const ManageFood = () => {
  const [foodItems, setFoodItems] = useState([])
  const [allFoodItems, setAllFoodItems] = useState([])

  // ================= LOAD FOOD =================
  useEffect(() => {
    fetch(`${BASE_URL}/api/food-list/`)
      .then(res => res.json())
      .then(data => {
        console.log(data)
        setFoodItems(data)
        setAllFoodItems(data)
      })
      .catch(err => console.log("Failed to fetch food", err))
  }, [])

  // ================= FOOD NAME =================
  const getFoodName = (item) => {
    return (
      item.item_name ||
      item.name ||
      item.food_name ||
      item.title ||
      "-"
    )
  }

  // ================= SEARCH =================
  const handleSearch = (text) => {
    const keyword = text.toLowerCase()

    if (!keyword) {
      setFoodItems(allFoodItems)
      return
    }

    const filtered = allFoodItems.filter(item =>
      (item.category_name || "").toLowerCase().includes(keyword) ||
      getFoodName(item).toLowerCase().includes(keyword)
    )

    setFoodItems(filtered)
  }

  // ================= SHORT DESCRIPTION =================
  const shortenText = (text, maxLength = 25) => {
    if (!text) return "-"
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text
  }

  // ================= CSV =================
  const csvData = foodItems.map(item => ({
    Category: item.category_name || "-",
    Name: getFoodName(item),
    Description: item.description || "-",
    Price: item.price || 0
  }))

  // ================= DELETE =================
  const handleDelete = (id) => {
    if (window.confirm("Are you sure?")) {
      fetch(`${BASE_URL}/api/food_delete/${id}/`, {
        method: "DELETE"
      })
        .then(res => res.text())
        .then(() => {
          toast.success("Deleted successfully")
          setFoodItems(prev => prev.filter(item => item.id !== id))
          setAllFoodItems(prev => prev.filter(item => item.id !== id))
        })
        .catch(err => console.log(err))
    }
  }

  return (
    <AdminLayout>
      <div className="p-3 p-md-4 shadow-sm rounded">
        <ToastContainer position="top-center" autoClose={2000} />

        <h1 className="text-primary fs-4 fs-md-2">
          <i className="fas fa-list-alt me-1"></i>
          Manage Food Page
        </h1>

        <h5 className="text-end">
          <i className="fas fa-database me-2"></i>
          Total Items:
          <span className="badge bg-success ms-2">{foodItems.length}</span>
        </h5>

        <div className="d-flex flex-column flex-md-row justify-content-between gap-2 mt-3">
          <input
            type="text"
            className="form-control"
            placeholder="Search by Category or Food Name..."
            onChange={(e) => handleSearch(e.target.value)}
          />

          <CSVLink
            data={csvData}
            filename="food_items.csv"
            className="btn btn-success"
          >
            <i className="fas fa-file-csv me-2"></i>
            Export CSV
          </CSVLink>
        </div>

        {/* MOBILE SCROLL TABLE */}
        <div
          className="table-responsive mt-4"
          style={{
            overflowX: "auto",
            WebkitOverflowScrolling: "touch"
          }}
        >
          <table
            className="table table-bordered table-hover table-striped align-middle"
            style={{ minWidth: "900px" }}
          >
            <thead className="table-dark">
              <tr>
                <th>S.No</th>
                <th>Category</th>
                <th>Food Name</th>
                <th>Description</th>
                <th>Price</th>
                <th>Image</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {foodItems.length > 0 ? (
                foodItems.map((item, index) => (
                  <tr key={item.id}>
                    <td>{index + 1}</td>
                    <td>{item.category_name || "-"}</td>
                    <td>{getFoodName(item)}</td>
                    <td>{shortenText(item.description)}</td>
                    <td>{item.price}</td>
                    <td>
                      {item.image ? (
                        <img
                          src={`${BASE_URL}${item.image}`}
                          alt={getFoodName(item)}
                          className="rounded"
                          style={{
                            width: "60px",
                            height: "45px",
                            objectFit: "cover"
                          }}
                        />
                      ) : (
                        "-"
                      )}
                    </td>
                    <td>
                      <div className="d-flex gap-2">
                        <Link
                          to={`/edit_food/${item.id}`}
                          className="btn btn-sm btn-primary"
                        >
                          <i className="fas fa-edit"></i>
                          <span className="d-none d-lg-inline ms-1">Edit</span>
                        </Link>

                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDelete(item.id)}
                        >
                          <i className="fas fa-trash-alt"></i>
                          <span className="d-none d-lg-inline ms-1">Delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center">
                    No food items found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  )
}

export default ManageFood