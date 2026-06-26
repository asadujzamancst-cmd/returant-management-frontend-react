import React, { useState, useEffect, useRef } from "react";
import AdminLayout from "../components/AdminLayout";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AdminChat = () => {

  const navigate = useNavigate();

  /* ================= STATE ================= */

  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [sending, setSending] = useState(false);
  const [token, setToken] = useState(null);
  const [adminId, setAdminId] = useState(null);
  const [loadingAdmin, setLoadingAdmin] = useState(true);

  const bottomRef = useRef(null);
  const intervalRef = useRef();


  /* ================= AUTH ================= */

  useEffect(() => {

    const t = localStorage.getItem("adminToken");
    const id = localStorage.getItem("adminId");

    if (!t || !id) {
      toast.error("Admin not logged in");
      navigate("/admin-login");
      return;
    }

    setToken(t);
    setAdminId(Number(id));
    setLoadingAdmin(false);

  }, [navigate]);


  /* ================= LOAD USERS ================= */

  const loadUsers = async () => {

    if (!token) return;

    try {

      const res = await fetch(
        "https://softworktech.com/asad_ecom/api/admin-inbox/",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (!Array.isArray(data)) return;

      const usersWithName = data.map(u => ({
        ...u,
        name: u.name || `${u.first_name} ${u.last_name}`,
        unread_count: u.unread_count || 0,
      }));

      usersWithName.sort((a, b) => b.unread_count - a.unread_count);

      setUsers(usersWithName);

    } catch (error) {

      console.error(error);
      toast.error("User load failed");

    }
  };


  useEffect(() => {

    if (!loadingAdmin) {

      loadUsers();

      const interval = setInterval(loadUsers, 4000);

      return () => clearInterval(interval);

    }

  }, [loadingAdmin, token]);


  /* ================= CLICK USER ================= */

  const clickUser = (user) => {

    setSelectedUser(user);

    setTimeout(() => {

      loadMessages(user.id);

    }, 200);

  };


  /* ================= LOAD MESSAGES ================= */

  const loadMessages = async (uid) => {

    if (!uid || !token || !adminId) return;

    try {

      const res = await fetch(

        `https://softworktech.com/asad_ecom/api/get-chat/${uid}/${adminId}/`,

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      setMessages(Array.isArray(data) ? data : []);

      setTimeout(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);


      // mark seen

      await fetch(

        `https://softworktech.com/asad_ecom/api/seen-message/${uid}/`,

        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      loadUsers();

    } catch (error) {

      console.error(error);
      toast.error("Chat load failed");

    }
  };


  /* ================= AUTO REFRESH ================= */

  useEffect(() => {

    if (!selectedUser) return;

    clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {

      loadMessages(selectedUser.id);

    }, 2000);

    return () => clearInterval(intervalRef.current);

  }, [selectedUser, token, adminId]);


  /* ================= SEND MESSAGE ================= */

  const sendMessage = async () => {

    if (!text && !imageFile) {
      toast.error("Type message or select image");
      return;
    }

    if (!selectedUser || !token || !adminId) return;


    const formData = new FormData();

    formData.append("sender", adminId);
    formData.append("receiver", selectedUser.id);

    if (text) formData.append("message", text);

    if (imageFile) formData.append("image", imageFile);


    try {

      setSending(true);

      const res = await fetch(

        "https://softworktech.com/asad_ecom/api/send-message/",

        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const data = await res.json();

      if (data.status === "sent") {

        setText("");
        setImageFile(null);

        loadMessages(selectedUser.id);

      }

    } catch (error) {

      console.error(error);

      toast.error("Send failed");

    } finally {

      setSending(false);

    }

  };


  /* ================= DELETE MESSAGE ================= */

  const deleteMessage = async (id) => {

    if (!token || !selectedUser) return;

    await fetch(

      `https://softworktech.com/asad_ecom/api/delete-message/${id}/`,

      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    loadMessages(selectedUser.id);

  };


  /* ================= EDIT MESSAGE ================= */

  const editMessage = async (id, oldText) => {

    const newText = prompt("Edit message", oldText);

    if (!newText || !token || !selectedUser) return;


    await fetch(

      `https://softworktech.com/asad_ecom/api/edit-message/${id}/`,

      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          message: newText,
        }),
      }
    );

    loadMessages(selectedUser.id);

  };


  /* ================= FILTER USERS ================= */

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );


  /* ================= LOADING ================= */

  if (loadingAdmin) {

    return (
      <AdminLayout>
        <div className="text-center mt-5">
          Loading Admin...
        </div>
      </AdminLayout>
    );

  }


  return (

    <AdminLayout>

      <div className="container mt-4">

        <h3>💬 Admin Chat</h3>

        <div className="row">


          {/* USERS */}

          <div className="col-4">

            <input
              className="form-control mb-2"
              placeholder="Search user..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <div style={{
              height: "500px",
              overflowY: "auto",
              border: "1px solid #ddd"
            }}>

              {filteredUsers.map(u => (

                <div
                  key={u.id}
                  onClick={() => clickUser(u)}
                  style={{
                    padding: "10px",
                    cursor: "pointer",
                    borderBottom: "1px solid #eee",
                    background:
                      selectedUser?.id === u.id
                        ? "#e6f0ff"
                        : "white",
                    display: "flex",
                    justifyContent: "space-between"
                  }}
                >

                  <span>
                    👤 {u.name}
                    <br />
                    <small>{u.email}</small>
                  </span>


                  {u.unread_count > 0 && (

                    <span
                      style={{
                        width: "12px",
                        height: "12px",
                        background: "red",
                        borderRadius: "50%"
                      }}
                    />

                  )}

                </div>

              ))}

            </div>

          </div>


          {/* CHAT */}

          <div className="col-8">

            <div style={{
              height: "450px",
              overflowY: "auto",
              border: "1px solid #ddd",
              padding: "10px"
            }}>

              {messages.map(m => {

                const senderId =
                  typeof m.sender === "object"
                    ? m.sender.id
                    : m.sender;

                const isAdmin =
                  senderId === adminId;


                return (

                  <div
                    key={m.id}
                    style={{
                      textAlign:
                        isAdmin
                          ? "right"
                          : "left",
                      marginBottom: "10px"
                    }}
                  >

                    <span style={{
                      background:
                        isAdmin
                          ? "#0d6efd"
                          : "#eee",
                      color:
                        isAdmin
                          ? "white"
                          : "black",
                      padding: "8px 14px",
                      borderRadius: "10px",
                      display: "inline-block",
                      maxWidth: "70%"
                    }}>

                      {m.message}


                      {m.image && (

                        <img
                          src={`http://127.0.0.1:8000${m.image}`}
                          style={{
                            maxWidth: "200px",
                            display: "block",
                            marginTop: "5px"
                          }}
                        />

                      )}

                    </span>


                    {isAdmin && (

                      <div>

                        <button
                          className="btn btn-sm btn-warning me-1"
                          onClick={() =>
                            editMessage(m.id, m.message)
                          }
                        >
                          Edit
                        </button>

                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() =>
                            deleteMessage(m.id)
                          }
                        >
                          Delete
                        </button>

                      </div>

                    )}

                  </div>

                );

              })}

              <div ref={bottomRef} />

            </div>


            <div className="d-flex mt-2 gap-2">

              <input
                className="form-control"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Message..."
              />


              <input
                type="file"
                onChange={(e) =>
                  setImageFile(e.target.files[0])
                }
              />


              <button
                className="btn btn-primary"
                onClick={sendMessage}
                disabled={sending}
              >

                {sending
                  ? "Sending..."
                  : "Send"}

              </button>

            </div>

          </div>


        </div>

      </div>

      <ToastContainer position="top-right" />

    </AdminLayout>

  );

};

export default AdminChat;