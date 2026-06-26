import React, { useState, useEffect, useRef } from "react";
import PublicLayout from "../components/PublicLayout";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Chat = () => {

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [sending, setSending] = useState(false);

  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("userToken");
  const adminId = localStorage.getItem("adminId"); // ✅ Dynamic admin

  const chatBoxRef = useRef(null);
  const intervalRef = useRef(null);


  /* ================= LOAD CHAT ================= */

  const loadChat = async () => {

    if (!userId || !token || !adminId) return;

    try {

      const res = await fetch(
        `https://softworktech.com/asad_ecom/api/get-chat/${userId}/${adminId}/`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (res.status === 401) {
        toast.error("Login expired");
        return;
      }

      const data = await res.json();

      if (Array.isArray(data)) {

        // ✅ Always update messages (Fix delete issue)
        setMessages(data);

      } else {

        setMessages([]);

      }

    } catch (error) {

      console.error("Load chat error:", error);
      toast.error("Chat load failed");

    }

  };


  /* ================= AUTO REFRESH ================= */

  useEffect(() => {

    if (!userId || !token || !adminId) return;

    loadChat();

    intervalRef.current = setInterval(() => {
      loadChat();
    }, 2000); // ✅ Faster refresh

    return () => clearInterval(intervalRef.current);

  }, [userId, token, adminId]);


  /* ================= SCROLL ================= */

  useEffect(() => {

    if (chatBoxRef.current) {

      chatBoxRef.current.scrollTop =
        chatBoxRef.current.scrollHeight;

    }

  }, [messages]);


  /* ================= SEND MESSAGE ================= */

  const sendMessage = async () => {

    if (!text && !imageFile) {
      toast.error("Type message or select image");
      return;
    }

    if (!userId || !token || !adminId) return;

    const formData = new FormData();

    formData.append("sender", userId);
    formData.append("receiver", adminId);

    if (text) formData.append("message", text);
    if (imageFile) formData.append("image", imageFile);

    try {

      setSending(true);

      const res = await fetch(
        "https://softworktech.com/asad_ecom/api/send-message/",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`
          },
          body: formData
        }
      );

      const data = await res.json();

      if (data.status === "sent") {

        setText("");
        setImageFile(null);

        loadChat();

      } else {

        toast.error("Send failed");

      }

    } catch (error) {

      console.error("Send error:", error);
      toast.error("Send failed");

    } finally {

      setSending(false);

    }

  };


  /* ================= DELETE ================= */

  const deleteMessage = async (id) => {

    if (!token) return;

    try {

      await fetch(
        `https://softworktech.com/asad_ecom/api/delete-message/${id}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      loadChat();

    } catch {

      toast.error("Delete failed");

    }

  };


  /* ================= EDIT ================= */

  const editMessage = async (id, oldText) => {

    const newText = prompt("Edit message", oldText);

    if (!newText || !token) return;

    try {

      await fetch(
        `https://softworktech.com/asad_ecom/api/edit-message/${id}/`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            message: newText
          })
        }
      );

      loadChat();

    } catch {

      toast.error("Edit failed");

    }

  };


  return (

    <PublicLayout>

      <div className="container mt-5">

        <h3 className="mb-3">
          💬 Chat with Admin
        </h3>


        {/* CHAT BOX */}

        <div
          ref={chatBoxRef}
          style={{
            height: "450px",
            overflowY: "auto",
            border: "1px solid #ddd",
            borderRadius: "12px",
            padding: "15px",
            background: "#fff"
          }}
        >

          {messages.length === 0 ? (

            <p className="text-center text-muted">
              No messages yet
            </p>

          ) : (

            messages.map((m) => {

              const isUser =
                String(m.sender) === String(userId);

              return (

                <div
                  key={m.id}
                  style={{
                    textAlign:
                      isUser ? "right" : "left",
                    marginBottom: "10px"
                  }}
                >

                  <div
                    style={{
                      display: "inline-block",
                      background:
                        isUser ? "#0d6efd" : "#eee",
                      color:
                        isUser ? "white" : "black",
                      padding: "10px",
                      borderRadius: "10px",
                      maxWidth: "70%"
                    }}
                  >

                    {m.message}

                    {m.image && (

                      <img
                        src={`http://127.0.0.1:8000${m.image}`}
                        style={{
                          maxWidth: "200px",
                          marginTop: "5px",
                          display: "block"
                        }}
                        alt=""
                      />

                    )}

                    {isUser && (

                      <div className="mt-1">

                        <button
                          className="btn btn-sm btn-warning me-1"
                          onClick={() =>
                            editMessage(
                              m.id,
                              m.message
                            )
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

                </div>

              );

            })

          )}

        </div>


        {/* SEND */}

        <div className="d-flex mt-3 gap-2">

          <input
            className="form-control"
            value={text}
            onChange={(e) =>
              setText(e.target.value)
            }
            placeholder="Type message..."
          />

          <input
            type="file"
            className="form-control"
            onChange={(e) =>
              setImageFile(e.target.files[0])
            }
          />

          <button
            className="btn btn-primary"
            onClick={sendMessage}
            disabled={sending}
          >
            {sending ? "Sending..." : "Send"}
          </button>

        </div>

      </div>

      <ToastContainer position="top-center" />

    </PublicLayout>

  );

};

export default Chat;