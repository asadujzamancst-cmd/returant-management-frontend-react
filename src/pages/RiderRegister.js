import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PublicLayout from "../components/PublicLayout";

const RiderRegister = () => {

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    nid_number: "",
    password: "",
    image: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image") {
      setFormData({ ...formData, image: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });

    try {

      const res = await axios.post(
        "http://127.0.0.1:8000/api/rider/register/",
        data
      );

      toast.success(res.data.message, { autoClose: 2500 });

      setFormData({
        name: "",
        email: "",
        mobile: "",
        nid_number: "",
        password: "",
        image: null,
      });

    } catch (error) {

      console.error(error);

      toast.error(
        error.response?.data?.error || "Something went wrong",
        { autoClose: 3000 }
      );

    }
  };

  return (

    <PublicLayout>

      <div
        className="d-flex justify-content-center align-items-center vh-100"
        style={{
          backgroundImage: 'url("/images/bg3.png")',
          backgroundSize: 'cover',
        }}
      >

        <div className="card shadow-lg p-5 rounded-4" style={{ maxWidth: "750px", width: "100%" }}>

          <div className="card-body">

            <h3 className="card-title text-center mb-3">
              Rider Registration
            </h3>

            <p className="text-center text-muted mb-4">
              Fill in your details to create an account
            </p>

            <form onSubmit={handleSubmit}>

              <div className="row">

                <div className="col-md-6 mb-3">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="Enter your email"
                    required
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">Mobile</label>
                  <input
                    type="text"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="Enter your mobile number"
                    required
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">NID Number</label>
                  <input
                    type="text"
                    name="nid_number"
                    value={formData.nid_number}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="Enter your NID number"
                    required
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">Password</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="Enter your password"
                    required
                  />
                </div>

                <div className="col-md-6 mb-4">
                  <label className="form-label">Profile Image</label>
                  <input
                    type="file"
                    name="image"
                    onChange={handleChange}
                    className="form-control"
                    accept="image/*"
                    required
                  />
                </div>

              </div>

              <button type="submit" className="btn btn-primary w-100">
                Register
              </button>

            </form>

            <div className="mt-4 text-center">
              <p className="text-muted">
                Already have an account?{" "}
                <a href="/rider/login" className="text-primary fw-bold">
                  Login
                </a>
              </p>
            </div>

          </div>

        </div>

        <ToastContainer position="top-right" />

      </div>

    </PublicLayout>

  );

};

export default RiderRegister;