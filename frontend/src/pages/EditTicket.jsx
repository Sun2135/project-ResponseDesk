import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

function EditTicket() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [ticket, setTicket] = useState(null);
  const [status, setStatus] = useState("");
  const [severity, setSeverity] = useState("");
  const [notes, setNotes] = useState("");
  const [message, setMessage] = useState("");

  const pageStyle = {
    maxWidth: "760px",
    margin: "40px auto",
    padding: "32px",
    fontFamily: "Arial, sans-serif",
    backgroundColor: "#f4f6f8",
    borderRadius: "16px",
  };

  const cardStyle = {
    backgroundColor: "white",
    padding: "28px",
    borderRadius: "14px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
  };

  const inputStyle = {
    width: "100%",
    padding: "12px",
    marginTop: "8px",
    marginBottom: "18px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    boxSizing: "border-box",
    fontSize: "15px",
  };

  const primaryButtonStyle = {
    padding: "11px 16px",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#1f2937",
    color: "white",
    cursor: "pointer",
    fontWeight: "bold",
    marginRight: "10px",
  };

  const secondaryButtonStyle = {
    padding: "11px 16px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    backgroundColor: "white",
    cursor: "pointer",
    fontWeight: "bold",
  };

  const badgeStyle = {
    display: "inline-block",
    padding: "5px 10px",
    borderRadius: "999px",
    backgroundColor: "#e5e7eb",
    fontWeight: "bold",
    fontSize: "13px",
    marginLeft: "6px",
  };

  const fetchTicket = async () => {
    const response = await fetch("http://localhost:5050/tickets");
    const data = await response.json();

    const selectedTicket = data.find((ticket) => ticket.id === Number(id));

    setTicket(selectedTicket);
    setStatus(selectedTicket.status);
    setSeverity(selectedTicket.severity);
    setNotes("");
  };

  useEffect(() => {
    fetchTicket();
  }, []);

  const saveChanges = async () => {
    await fetch(`http://localhost:5050/tickets/${id}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    });

    await fetch(`http://localhost:5050/tickets/${id}/severity`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ severity }),
    });

    if (notes.trim()) {
      await fetch(`http://localhost:5050/tickets/${id}/notes`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ notes }),
      });
    }

    setMessage("✓ Ticket information updated successfully");

    setTimeout(() => {
      navigate("/");
    }, 1500);
  };

  if (!ticket) {
    return <p style={{ textAlign: "center" }}>Loading ticket...</p>;
  }

  return (
    <div style={pageStyle}>
      <div style={{ textAlign: "center", marginBottom: "28px" }}>
        <h1 style={{ marginBottom: "8px" }}>Edit Ticket #{ticket.id}</h1>
        <p style={{ color: "#666", margin: 0 }}>
          Update ticket status, severity, and investigation notes
        </p>
      </div>

      {message && (
        <div
          style={{
            backgroundColor: "#dcfce7",
            color: "#166534",
            padding: "14px",
            borderRadius: "10px",
            fontWeight: "bold",
            marginBottom: "18px",
            textAlign: "center",
          }}
        >
          {message}
        </div>
      )}

      <div style={cardStyle}>
        <h2 style={{ marginTop: 0 }}>{ticket.title}</h2>

        <p style={{ color: "#555", lineHeight: "1.6" }}>{ticket.description}</p>

        <div
          style={{
            backgroundColor: "#f9fafb",
            padding: "14px",
            borderRadius: "10px",
            marginBottom: "20px",
          }}
        >
          <p>
            <strong>Current Severity:</strong>
            <span style={badgeStyle}>{ticket.severity}</span>
          </p>

          <p>
            <strong>Current Status:</strong>
            <span style={badgeStyle}>{ticket.status}</span>
          </p>

          <p style={{ marginBottom: 0 }}>
            <strong>Current Notes:</strong>{" "}
            {ticket.notes || "No investigation notes yet"}
          </p>
        </div>

        <label>
          <strong>Update Severity</strong>
        </label>

        <select
          value={severity}
          onChange={(e) => setSeverity(e.target.value)}
          style={inputStyle}
        >
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
          <option>Critical</option>
        </select>

        <label>
          <strong>Update Status</strong>
        </label>

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          style={inputStyle}
        >
          <option>Open</option>
          <option>Investigating</option>
          <option>Resolved</option>
        </select>

        <label>
          <strong>Add New Investigation Notes</strong>
        </label>

        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          style={{
            ...inputStyle,
            minHeight: "120px",
            resize: "vertical",
          }}
          placeholder="Example: Checked API response and reproduced the issue."
        />

        <button style={primaryButtonStyle} onClick={saveChanges}>
          Save Changes
        </button>

        <button style={secondaryButtonStyle} onClick={() => navigate("/")}>
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}

export default EditTicket;