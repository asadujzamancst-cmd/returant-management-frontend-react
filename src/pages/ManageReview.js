import React, { useState, useEffect } from "react";
import AdminLayout from "../components/AdminLayout";
import  { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

const ManageReview = () => {

const navigate = useNavigate();

const [reviews,setReviews] = useState([]);
const [loading,setLoading] = useState(true);

const [search,setSearch] = useState("");

const [page,setPage] = useState(1);

const perPage = 5;




  // ✅ login check
  useEffect(() => {
    const adminuser = localStorage.getItem("adminuser");
    const token = localStorage.getItem("adminToken");

    if (!adminuser || !token) {
      navigate("/admin-login");
    }
  }, [navigate]);




// ✅ Fetch Reviews
useEffect(()=>{

fetch("https://softworktech.com/asad_ecom/api/all-reviews/")
.then(res=>res.json())
.then(data=>{

setReviews(data.reviews || []);

setLoading(false);

})
.catch(err=>{

console.log(err);
setLoading(false);

})

},[]);




// ✅ Delete Review
const handleDelete=(id)=>{

if(window.confirm("Delete review ?")){

fetch(`https://softworktech.com/asad_ecom/api/delete_review/${id}/`,{
method:"DELETE"
})
.then(res=>{

if(res.ok){

setReviews(prev => prev.filter(r=>r.id!==id));

toast.success("Review Deleted ✔");

}else{

toast.error("Delete Failed ❌");

}

})

}

}




// ✅ Safe Search Filter (No Error)
const filtered = reviews.filter(r=>{

const user = r.user_name ? r.user_name.toLowerCase() : "";

const food = r.food_name ? r.food_name.toLowerCase() : "";

const keyword = search.toLowerCase();

return user.includes(keyword) || food.includes(keyword);

});




// ✅ Pagination

const lastIndex = page * perPage;

const firstIndex = lastIndex - perPage;

const currentReviews = filtered.slice(firstIndex,lastIndex);

const totalPages = Math.ceil(filtered.length/perPage);



return (

<AdminLayout>

<div className="container mt-4">


<h3>

⭐ Manage Reviews

</h3>


<p>

Total Reviews: {reviews.length}

</p>



{/* ✅ Search Box */}
<input

className="form-control mb-3"

placeholder="Search user or food"

value={search}

onChange={(e)=>{
setSearch(e.target.value);
setPage(1); // reset page
}}

/>




{loading ? (

<p>Loading...</p>

):(



<table className="table table-striped table-bordered">

<thead className="table-dark">

<tr>

<th>ID</th>
<th>User</th>
<th>Food</th>
<th>Rating</th>
<th>Comment</th>
<th>Date</th>
<th>Action</th>

</tr>

</thead>



<tbody>

{currentReviews.length===0 ? (

<tr>

<td colSpan="7" className="text-center">

No Reviews Found

</td>

</tr>

):(


currentReviews.map(r=>(

<tr key={r.id}>

<td>{r.id}</td>

<td>

👤 {r.user_name || "Unknown"}

</td>

<td>

🍔 {r.food_name || "Unknown"}

</td>


<td>

{Array(r.rating || 0).fill().map((_,i)=>(

<i key={i} className="fas fa-star text-warning"></i>

))}

</td>



<td>

{r.comment || "-"}

</td>



<td>

{r.created_at ? r.created_at.slice(0,10) : "-"}

</td>



<td>

<button

className="btn btn-danger btn-sm"

onClick={()=>handleDelete(r.id)}

>

Delete

</button>

</td>



</tr>

))

)}


</tbody>

</table>


)}



{/* ✅ Pagination */}

<div className="d-flex gap-2 justify-content-center mt-3">

{Array(totalPages).fill().map((_,i)=>(

<button

key={i}

className={`btn ${page===i+1?'btn-dark':'btn-outline-dark'}`}

onClick={()=>setPage(i+1)}

>

{i+1}

</button>

))}

</div>


<ToastContainer position="top-center" autoClose={1000}/>


</div>

</AdminLayout>
)

}

export default ManageReview;