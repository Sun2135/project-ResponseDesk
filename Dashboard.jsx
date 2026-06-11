import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [severity, setSeverity] = useState("Low");
  const [tickets, setTickets] = useState([]);
  const [filter, setFilter] = useState("All");

  const navigate = useNavigate();

  const inputStyle = {
    width: "100%",
    padding: "12px",
    marginBottom: "14px",
    borderRadius: "8px",
    border: "1px solid #d1d5db",
    boxSizing: "border-box",
    fontSize: "15px",
  };

  const primaryButton = {
    padding: "11px 16px",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#1f2937",
    color: "white",
    cursor: "pointer",
    fontWeight: "bold",
  };

  const secondaryButton = {
    padding: "9px 14px",
    borderRadius: "8px",
    border: "1px solid #d1d5db",
    backgroundColor: "white",
    cursor: "pointer",
    fontWeight: "bold",
    marginRight: "8px",
  };

  const dangerButton = {
    ...secondaryButton,
    border: "1px solid #ef4444",
    color: "#ef4444",
  };

  const getSeverityColor = (severity) => {
    if (severity === "Critical") return "#fecaca";
    if (severity === "High") return "#fed7aa";
    if (severity === "Medium") return "#fef3c7";
    return "#dcfce7";
  };

  const getStatusColor = (status) => {
    if (status === "Resolved") return "#dcfce7";
    if (status === "Investigating") return "#dbeafe";
    return "#fef3c7";
  };

  const badgeStyle = (backgroundColor) => ({
    display: "inline-block",
    padding: "5px 10px",
    borderRadius: "999px",
    backgroundColor,
    fontWeight: "bold",
    fontSize: "13px",
  });

  const fetchTickets = async () => {
    const response = await fetch("http://localhost:5050/tickets");
    const data = await response.json();
    setTickets(data);
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      alert("Please enter a ticket title.");
      return;
    }

    if (!description.trim()) {
      alert("Please enter a description.");
      return;
    }

    await fetch("http://localhost:5050/tickets", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, description, severity }),
    });

    alert("Ticket Created!");

    setTitle("");
    setDescription("");
    setSeverity("Low");
    fetchTickets();
  };

  const deleteTicket = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this ticket?"
    );

    if (!confirmDelete) return;

    await fetch(`http://localhost:5050/tickets/${id}`, {
      method: "DELETE",
    });

    fetchTickets();
  };

  const filteredTickets =
    filter === "All"
      ? tickets
      : tickets.filter((ticket) => ticket.status === filter);
      const totalTickets = tickets.length;
const openTickets = tickets.filter((ticket) => ticket.status === "Open").length;
const investigatingTickets = tickets.filter(
  (ticket) => ticket.status === "Investigating"
).length;
const resolvedTickets = tickets.filter(
  (ticket) => ticket.status === "Resolved"
).length;


  return (
    <div
      style={{
        maxWidth: "1000px",
        margin: "40px auto",
        padding: "32px",
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#f4f6f8",
        borderRadius: "16px",
      }}
    >
      <div style={{ textAlign: "center", marginBottom: "34px" }}>
        <h1
          style={{
            margin: "0 0 10px 0",
            fontSize: "40px",
            fontWeight: "800",
            color: "#111827",
          }}
        >
          ResponseDesk
        </h1>

        <p style={{ margin: 0, color: "#6b7280", fontSize: "16px" }}>
          Support Engineering Dashboard
        </p>
      </div>

      <div
  style={{
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "16px",
    marginBottom: "24px",
  }}
>
  <div style={{ backgroundColor: "white", padding: "18px", borderRadius: "14px" }}>
    <p style={{ margin: 0, color: "#6b7280" }}>Total Tickets</p>
    <h2 style={{ margin: "8px 0 0 0" }}>{totalTickets}</h2>
  </div>

  <div style={{ backgroundColor: "white", padding: "18px", borderRadius: "14px" }}>
    <p style={{ margin: 0, color: "#6b7280" }}>Open</p>
    <h2 style={{ margin: "8px 0 0 0" }}>{openTickets}</h2>
  </div>

  <div style={{ backgroundColor: "white", padding: "18px", borderRadius: "14px" }}>
    <p style={{ margin: 0, color: "#6b7280" }}>Investigating</p>
    <h2 style={{ margin: "8px 0 0 0" }}>{investigatingTickets}</h2>
  </div>

  <div style={{ backgroundColor: "white", padding: "18px", borderRadius: "14px" }}>
    <p style={{ margin: 0, color: "#6b7280" }}>Resolved</p>
    <h2 style={{ margin: "8px 0 0 0" }}>{resolvedTickets}</h2>
  </div>
</div>


      <div
        style={{
          backgroundColor: "white",
          padding: "24px",
          borderRadius: "14px",
          marginBottom: "28px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
        }}
      >
        <h3 style={{ marginTop: 0 }}>Create Support Ticket</h3>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Ticket title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={inputStyle}
          />

          <textarea
            placeholder="Describe the customer issue"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{ ...inputStyle, minHeight: "90px", resize: "vertical" }}
          />

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

          <button type="submit" style={primaryButton}>
            Create Ticket
          </button>
        </form>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "16px",
          marginBottom: "16px",
        }}
      >
        <h2 style={{ margin: 0 }}>Tickets</h2>

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={{ ...inputStyle, width: "220px", marginBottom: 0 }}
        >
          <option>All</option>
          <option>Open</option>
          <option>Investigating</option>
          <option>Resolved</option>
        </select>
      </div>

      {filteredTickets.length === 0 ? (
        <div
          style={{
            backgroundColor: "white",
            padding: "24px",
            borderRadius: "14px",
            textAlign: "center",
            color: "#6b7280",
          }}
        >
          No tickets found.
        </div>
      ) : (
        filteredTickets.map((ticket) => (
          <div
            key={ticket.id}
            style={{
              backgroundColor: "white",
              border: "1px solid #e5e7eb",
              borderRadius: "14px",
              padding: "20px",
              marginBottom: "16px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                gap: "16px",
              }}
            >
              <div>
                <h3 style={{ marginTop: 0, marginBottom: "6px" }}>
                  {ticket.title}
                </h3>

                <p style={{ margin: 0, color: "#6b7280", fontSize: "14px" }}>
                  Ticket #{ticket.id}
                </p>
              </div>

              <div style={{ textAlign: "right" }}>
                <span style={badgeStyle(getSeverityColor(ticket.severity))}>
                  {ticket.severity}
                </span>
              </div>
            </div>

            <p style={{ color: "#374151", lineHeight: "1.6" }}>
              {ticket.description}
            </p>

            <div style={{ marginBottom: "12px" }}>
              <span style={badgeStyle(getStatusColor(ticket.status))}>
                {ticket.status}
              </span>
            </div>

            <div
              style={{
                backgroundColor: "#f9fafb",
                padding: "12px",
                borderRadius: "10px",
                marginBottom: "14px",
              }}
            >
              <strong>Notes:</strong>{" "}
              {ticket.notes || "No investigation notes yet"}
            </div>

            <button
              style={secondaryButton}
              onClick={() => navigate(`/edit/${ticket.id}`)}
            >
              Edit
            </button>

            <button style={dangerButton} onClick={() => deleteTicket(ticket.id)}>
              Delete
            </button>
          </div>
        ))
      )}
    </div>
  );
}

export default Dashboard;