import React, { useState } from "react";
import axios from "axios";
import {
  FaCalendarDays,
  FaClock,
  FaUsers,
  FaChair,
  FaLocationDot,
  FaCircleCheck,
} from "react-icons/fa6";


const BookTable = () => {

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [loading, setLoading] = useState(false);



  const fetchTables = async () => {

    if (!date || !time) {
      alert("Please select date and time");
      return;
    }


    try {

      setLoading(true);

      const response = await axios.get(
        `https://softworktech.com/asad_ecom/api/available-table/?date=${date}&time=${time}`
      );


      setTables(response.data);
      setSelectedTable(null);


    } catch (error) {

      console.log(error);
      alert("Failed to load tables");


    } finally {

      setLoading(false);

    }

  };



  return (

    <div className="bg-light min-vh-100 py-4 mt-5">


      {/* Header */}

      <div className="container text-center mb-4">

        <h1 className="fw-bold display-5">
          Reserve Your Table
        </h1>

        <p className="text-muted">
          Choose your preferred date and time
        </p>

      </div>




      <div className="container">

        <div className="row g-4">



          {/* Search */}

          <div className="col-lg-8">


            <div className="card shadow border-0 rounded-4 p-4 mb-4">


              <div className="row g-3">


                <div className="col-md-5">

                  <label className="fw-bold">
                    <FaCalendarDays className="text-warning me-2"/>
                    Date
                  </label>


                  <input
                    type="date"
                    className="form-control mt-2"
                    value={date}
                    onChange={(e)=>setDate(e.target.value)}
                  />

                </div>




                <div className="col-md-5">

                  <label className="fw-bold">
                    <FaClock className="text-warning me-2"/>
                    Time
                  </label>


                  <input
                    type="time"
                    className="form-control mt-2"
                    value={time}
                    onChange={(e)=>setTime(e.target.value)}
                  />

                </div>




                <div className="col-md-2 d-flex align-items-end">

                  <button
                    onClick={fetchTables}
                    className="btn btn-warning w-100 fw-bold"
                  >
                    {loading ? "..." : "Search"}
                  </button>

                </div>


              </div>


            </div>





            {/* Tables */}

            <div className="row g-4">


              {
                tables.map((table)=>(


                  <div className="col-md-6" key={table.id}>


                    <div
                      onClick={()=>setSelectedTable(table)}
                      className={`card shadow-sm border-0 rounded-4 p-4 h-100 ${selectedTable?.id===table.id ? "border border-warning" : ""}`}
                      style={{cursor:"pointer"}}
                    >



                      <div className="d-flex justify-content-between">


                        <div className="bg-warning-subtle rounded-circle p-3">

                          <FaChair
                            size={35}
                            className="text-warning"
                          />

                        </div>



                        {
                          selectedTable?.id===table.id &&

                          <FaCircleCheck
                            size={25}
                            className="text-success"
                          />

                        }


                      </div>





                      <h3 className="mt-4 fw-bold">
                        Table {table.table_number}
                      </h3>




                      <p className="text-muted mb-2">

                        <FaUsers className="me-2"/>

                        {table.capacity} Persons

                      </p>




                      <p className="text-muted">

                        <FaLocationDot className="me-2"/>

                        Main Dining Area

                      </p>



                    </div>


                  </div>


                ))
              }


            </div>



          </div>
          {/* Summary */}


          <div className="col-lg-4">


            <div className="card shadow border-0 rounded-4 p-4 sticky-top">


              <h3 className="fw-bold mb-4">
                Booking Summary
              </h3>

              {
                selectedTable ? (

                  <>


                    <p>
                      Date:
                      <br/>
                      <b>{date}</b>
                    </p>

                    <p>
                      Time:
                      <br/>
                      <b>{time}</b>
                    </p>

                    <p>
                      Table:
                      <br/>
                      <b>
                        Table {selectedTable.table_number}
                      </b>
                    </p>




                    <button className="btn btn-dark w-100 py-3 rounded-3">
                      Continue Booking
                    </button>


                  </>


                ) : (


                  <p className="text-muted">
                    Select a table first
                  </p>


                )
              }



            </div>


          </div>



        </div>


      </div>


    </div>

  );

};


export default BookTable;