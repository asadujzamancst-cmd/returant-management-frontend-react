import React, { useState, useEffect, useRef } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaPen,FaTrash  } from "react-icons/fa";

const Chatmodal = () => {

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(false);

  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("userToken");
  const adminId = localStorage.getItem("adminId");

  const chatBoxRef = useRef(null);
  const intervalRef = useRef(null);

    const BASE_URL = "https://softworktech.com/asad_ecom";


  /* ================= LOAD CHAT ================= */

  const loadChat = async () => {

    if (!userId || !token || !adminId) return;

    try {

      const res = await fetch(
        `${BASE_URL}/api/get-chat/${userId}/${adminId}/`,
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

    intervalRef.current = setInterval(loadChat, 3000);

    return () => clearInterval(intervalRef.current);

  }, [userId, token, adminId]);

  /* ================= AUTO SCROLL ================= */

  useEffect(() => {

    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop =
        chatBoxRef.current.scrollHeight;
    }

  }, [messages]);

  /* ================= SEND ================= */

  const sendMessage = async () => {
    console.log("userId:", userId);
console.log("adminId:", adminId);
console.log("token:", token);
console.log(localStorage.getItem("adminId"));

    if (!text.trim() && !imageFile) {
      toast.error("Type message or select image");
      return;
    }

    const formData = new FormData();
    formData.append("sender", userId);
    formData.append("receiver", adminId);

    if (text.trim()) formData.append("message", text);
    if (imageFile) formData.append("image", imageFile);

    try {

      setSending(true);

      const res = await fetch(
        `${BASE_URL}/api/send-message/`,
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

    } catch {
      toast.error("Send failed");
    } finally {
      setSending(false);
    }

  };

  /* ================= DELETE ================= */

  const deleteMessage = async (id) => {

    try {
      await fetch(
        `${BASE_URL}/api/delete-message/${id}/`,
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

    if (!newText) return;

    try {
      await fetch(
        `${BASE_URL}/api/edit-message/${id}/`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ message: newText })
        }
      );
      loadChat();
    } catch {
      toast.error("Edit failed");
    }

  };

  const handleKeyDown = (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault(); // Enter চাপলে যেন নতুন লাইন (New Line) তৈরি না হয়
    sendMessage(); // মেসেজ সেন্ড ফাংশন কল হবে
  }
};


  return (

    <div style={{
    display: "flex",
    flexDirection: "column",
    height: "400px",   // 🔥 IMPORTANT (fixed height)
  }}>

      {/* HEADER */}
      <div
        style={{
          padding: "10px",
          borderBottom: "1px solid #ddd",
          fontWeight: "bold"
        }}
      >
        💬 Chat with Admin
      </div>

      {/* CHAT BODY */}
      <div
        ref={chatBoxRef}
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "10px",
          background: "#f8f9fa"
        }}
      >

        {messages.length === 0 ? (
          <p className="text-center text-muted">No messages</p>
        ) : (
          messages.map((m) => {

            const isUser =
              String(m.sender) === String(userId);

            return (
              <div
                key={m.id}
                style={{
                  textAlign: isUser ? "right" : "left",
                  marginBottom: "8px"
                }}
              >
                <div
                  style={{
                    display: "inline-block",
                    background: isUser ? "#0d6efd" : "#e4e6eb",
                    color: isUser ? "#fff" : "#000",
                    padding: "8px 12px",
                    borderRadius: "15px",
                    maxWidth: "75%"
                  }}
                >

                  {m.message}

                  {m.image && (
                    <img
                      src={`${BASE_URL}${m.image}`}
                      style={{
                        maxWidth: "150px",
                        marginTop: "5px",
                        borderRadius: "8px"
                      }}
                      alt=""
                    />
                  )}

                  {isUser && (
                    <div style={{ marginTop: "5px",
                      height: "20px",
                      display: "flex",
                      gap: "5px",
                      justifyContent: "flex-end"
                    }}>
                      <button
                        onClick={() => editMessage(m.id, m.message)}
                        className="btn btn-sm  me-1"
                      >
                        <FaPen className="me-1" />
                      </button>
                      <button
                        onClick={() => deleteMessage(m.id)}
                        className="btn btn-sm "
                      >
                       <FaTrash />
                      </button>
                    </div>
                  )}

                </div>
              </div>
            );

          })
        )}

      </div>

      {/* INPUT */}
      <div
        style={{
          display: "flex",
          gap: "5px",
          padding: "10px",
          borderTop: "1px solid #ddd"
        }}
      >

        <textarea
          className="form-control"
          rows='1'
          value={text}
          onChange={(e) => setText(e.target.value)}
           onKeyDown={handleKeyDown}
          placeholder="Type..."
          style={{ resize: "none" }}
        />

        <input
          type="file"
          className="form-control"
          onChange={(e) =>
            setImageFile(e.target.files[0])
          }
          style={{ maxWidth: "120px" }}
        />

        <button
          className="btn btn-primary"
          onClick={sendMessage}
          disabled={sending}
        >
          {sending ? "..." : "Send"}
        </button>

      </div>

      <ToastContainer position="top-center" />

    </div>
  );

};

export default Chatmodal;