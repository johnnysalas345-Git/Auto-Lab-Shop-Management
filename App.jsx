import React, { useState } from 'react';
import { Wrench, ChevronRight } from 'lucide-react';

const MOCK_CUSTOMERS = [
  { id: "c1", data: { name: "Marcus Ebanks", phone: "345-925-1120", email: "marcus.e@candw.ky" } },
  { id: "c2", data: { name: "Sophia Ramoon", phone: "345-916-4482", email: "s.ramoon@gmail.com" } },
  { id: "c3", data: { name: "Wesley Solomon", phone: "345-928-7743", email: "wsolomon@outlook.com" } },
];

const MOCK_VEHICLES = [
  { id: "v1", data: { customer_id: "c1", year: 2019, make: "Toyota", model: "Camry", plate: "KY21-ABC", vin: "4T1BF1AK5CU123456", mileage: 45200 } },
  { id: "v2", data: { customer_id: "c2", year: 2020, make: "Honda", model: "CR-V", plate: "KY20-XYZ", vin: "5J6RB3H31LL123456", mileage: 38100 } },
  { id: "v3", data: { customer_id: "c3", year: 2018, make: "Ford", model: "F-150", plate: "KY19-DEF", vin: "1FTFW1ET8DFE12345", mileage: 52900 } },
];

const MOCK_WORK_ORDERS = [
  {
    id: "wo1042",
    data: {
      customer_id: "c2",
      vehicle_id: "v2",
      status: "in_progress",
      complaint: "Engine not starting, battery may be dead",
      labor: { l1: { desc: "Diagnostic check", hours: 1, rate: 95, technician_id: "tech1" } },
      opened_at: "2024-12-15",
      notes: [],
      signature: null
    }
  },
  {
    id: "wo1041",
    data: {
      customer_id: "c1",
      vehicle_id: "v1",
      status: "completed",
      complaint: "Regular 30k service",
      labor: { l2: { desc: "30k service", hours: 1.5, rate: 95, technician_id: "tech2" } },
      opened_at: "2024-12-14",
      notes: [{ author: "Carlos", text: "Service completed successfully", ts: "2024-12-14 3:45 PM" }],
      signature: { customerName: "Marcus Ebanks", date: "2024-12-14", time: "03:45 PM" }
    }
  },
];

const WO_STATUS_STYLES = {
  open: { label: "Open", bg: "#E8F5E9", color: "#2E7D32" },
  waiting_parts: { label: "Waiting on Parts", bg: "#FFF3E0", color: "#F57C00" },
  in_progress: { label: "In Progress", bg: "#E3F2FD", color: "#1565C0" },
  completed: { label: "Completed", bg: "#F3E5F5", color: "#6A1B9A" },
  notified: { label: "Notified", bg: "#E0F2F1", color: "#00796B" },
};

export default function AutoLabApp() {
  const [screen, setScreen] = useState("dashboard");
  const [activeWorkOrderId, setActiveWorkOrderId] = useState(null);
  const [workOrders] = useState(MOCK_WORK_ORDERS);
  const [customers] = useState(MOCK_CUSTOMERS);
  const [vehicles] = useState(MOCK_VEHICLES);

  if (screen === "dashboard") {
    return (
      <div style={styles.app}>
        <div style={styles.header}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Wrench size={24} color="#1565C0" />
            <div>
              <div style={styles.brandName}>Auto Lab</div>
              <div style={styles.brandSub}>Shop Management</div>
            </div>
          </div>
        </div>

        <div style={styles.body}>
          <div style={styles.sectionHeader}>
            <div style={styles.sectionTitle}>Active Work Orders</div>
            <div style={styles.badge}>{workOrders.length} Total</div>
          </div>

          <div style={styles.grid}>
            {workOrders.map((wo) => {
              const woData = wo.data || wo;
              const cust = customers.find((c) => c.id === woData.customer_id);
              const veh = vehicles.find((v) => v.id === woData.vehicle_id);
              const st = WO_STATUS_STYLES[woData.status] || WO_STATUS_STYLES.open;
              const laborTotal = Object.values(woData.labor || {}).reduce((s, l) => s + l.hours * l.rate, 0);

              return (
                <div
                  key={wo.id}
                  style={styles.card}
                  onClick={() => {
                    setActiveWorkOrderId(wo.id);
                    setScreen("workOrderDetail");
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                    <div>
                      <div style={styles.woId}>WO #{wo.id.replace("wo", "")}</div>
                      <div style={styles.woCustomer}>{cust?.data?.name}</div>
                    </div>
                    <div style={{ ...styles.statusBadge, backgroundColor: st.bg, color: st.color }}>
                      {st.label}
                    </div>
                  </div>

                  <div style={styles.divider} />

                  <div style={{ fontSize: 13, color: "#666", marginBottom: 12 }}>
                    {veh?.data?.year} {veh?.data?.make} {veh?.data?.model}
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
                    <div>
                      <div style={styles.label}>PLATE</div>
                      <div style={styles.value}>{veh?.data?.plate}</div>
                    </div>
                    <div>
                      <div style={styles.label}>AMOUNT</div>
                      <div style={{ fontSize: 14, fontWeight: "600", color: "#1565C0" }}>${laborTotal.toFixed(2)}</div>
                    </div>
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 8, borderTop: "1px solid #E0E0E0" }}>
                    <span style={{ fontSize: 12, color: "#999" }}>{woData.opened_at}</span>
                    <ChevronRight size={18} color="#999" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  if (screen === "workOrderDetail" && activeWorkOrderId) {
    const wo = workOrders.find((w) => w.id === activeWorkOrderId);
    if (!wo) return null;

    const woData = wo.data || wo;
    const cust = customers.find((c) => c.id === woData.customer_id);
    const veh = vehicles.find((v) => v.id === woData.vehicle_id);
    const st = WO_STATUS_STYLES[woData.status] || WO_STATUS_STYLES.open;

    return <WorkOrderDetail wo={wo} woData={woData} customer={cust} vehicle={veh} statusStyle={st} onBack={() => setScreen("dashboard")} />;
  }

  return null;
}

function WorkOrderDetail({ wo, woData, customer, vehicle, statusStyle, onBack }) {
  const [notes, setNotes] = useState(woData.notes || []);
  const [newNote, setNewNote] = useState("");
  const [signature, setSignature] = useState(woData.signature);
  const [signatureName, setSignatureName] = useState("");
  const [showSignatureForm, setShowSignatureForm] = useState(!signature);

  const handleAddNote = () => {
    if (!newNote.trim()) return;
    const now = new Date();
    const note = {
      author: "Service Writer",
      text: newNote,
      ts: now.toLocaleString()
    };
    setNotes([...notes, note]);
    setNewNote("");
  };

  const handleCaptureSignature = () => {
    if (!signatureName.trim()) return;
    const now = new Date();
    const sig = {
      customerName: signatureName,
      date: now.toISOString().split("T")[0],
      time: now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
    };
    setSignature(sig);
    setShowSignatureForm(false);
  };

  return (
    <div style={styles.app}>
      <div style={styles.header}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Wrench size={24} color="#1565C0" />
          <div>
            <div style={styles.brandName}>Auto Lab</div>
            <div style={styles.brandSub}>Work Order Detail</div>
          </div>
        </div>
        <button style={styles.backBtn} onClick={onBack}>
          ← Back
        </button>
      </div>

      <div style={styles.body}>
        <div style={styles.card}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div style={styles.woId}>Work Order #{wo.id.replace("wo", "")}</div>
              <div style={styles.woCustomer}>{customer?.data?.name}</div>
            </div>
            <div style={{ ...styles.statusBadge, backgroundColor: statusStyle.bg, color: statusStyle.color }}>
              {statusStyle.label}
            </div>
          </div>
        </div>

        <div style={styles.card}>
          <div style={styles.cardTitle}>Vehicle Information</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div>
              <div style={styles.label}>VEHICLE</div>
              <div style={styles.value}>{vehicle?.data?.year} {vehicle?.data?.make} {vehicle?.data?.model}</div>
            </div>
            <div>
              <div style={styles.label}>PLATE</div>
              <div style={styles.value}>{vehicle?.data?.plate}</div>
            </div>
            <div>
              <div style={styles.label}>VIN</div>
              <div style={{ ...styles.value, fontFamily: "monospace", fontSize: 12 }}>{vehicle?.data?.vin}</div>
            </div>
            <div>
              <div style={styles.label}>MILEAGE</div>
              <div style={styles.value}>{vehicle?.data?.mileage.toLocaleString()} km</div>
            </div>
          </div>
        </div>

        <div style={styles.card}>
          <div style={styles.cardTitle}>Customer Concern</div>
          <div style={{ fontSize: 14, color: "#333", lineHeight: 1.6 }}>{woData.complaint}</div>
        </div>

        <div style={styles.card}>
          <div style={styles.cardTitle}>Work Items</div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "2px solid #E0E0E0" }}>
                <th style={{ textAlign: "left", padding: 8, fontSize: 12, color: "#666", fontWeight: "600" }}>Description</th>
                <th style={{ textAlign: "right", padding: 8, fontSize: 12, color: "#666", fontWeight: "600" }}>Hours</th>
                <th style={{ textAlign: "right", padding: 8, fontSize: 12, color: "#666", fontWeight: "600" }}>Rate</th>
                <th style={{ textAlign: "right", padding: 8, fontSize: 12, color: "#666", fontWeight: "600" }}>Total</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(woData.labor || {}).map(([id, labor]) => (
                <tr key={id} style={{ borderBottom: "1px solid #F0F0F0" }}>
                  <td style={{ padding: 8, fontSize: 13, color: "#333" }}>🔧 {labor.desc}</td>
                  <td style={{ padding: 8, fontSize: 13, color: "#333", textAlign: "right" }}>{labor.hours}</td>
                  <td style={{ padding: 8, fontSize: 13, color: "#333", textAlign: "right" }}>${labor.rate.toFixed(2)}</td>
                  <td style={{ padding: 8, fontSize: 13, color: "#1565C0", textAlign: "right", fontWeight: "600" }}>
                    ${(labor.hours * labor.rate).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={styles.card}>
          <div style={styles.cardTitle}>Notes</div>
          {notes.length > 0 && (
            <div style={{ marginBottom: 12 }}>
              {notes.map((note, i) => (
                <div key={i} style={{ background: "#F5F5F5", borderRadius: 8, padding: 12, marginBottom: 8, borderLeft: "4px solid #1565C0" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <span style={{ fontSize: 12, fontWeight: "600", color: "#333" }}>{note.author}</span>
                    <span style={{ fontSize: 11, color: "#999" }}>{note.ts}</span>
                  </div>
                  <div style={{ fontSize: 13, color: "#555" }}>{note.text}</div>
                </div>
              ))}
            </div>
          )}
          <div style={{ display: "flex", gap: 8 }}>
            <input
              type="text"
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="Add a note..."
              style={{
                flex: 1,
                background: "#F9F9F9",
                border: "1px solid #DDD",
                borderRadius: 6,
                padding: "10px 12px",
                color: "#333",
                fontSize: 13,
              }}
            />
            <button
              onClick={handleAddNote}
              style={{
                background: "#1565C0",
                color: "white",
                border: "none",
                borderRadius: 6,
                padding: "10px 16px",
                fontWeight: "600",
                fontSize: 13,
                cursor: "pointer",
              }}
            >
              Add
            </button>
          </div>
        </div>

        <div style={styles.card}>
          <div style={styles.cardTitle}>Signature</div>
          {signature ? (
            <div style={{ background: "#E8F5E9", borderRadius: 8, padding: 12, borderLeft: "4px solid #2E7D32" }}>
              <div style={{ color: "#2E7D32", fontWeight: "600", marginBottom: 4 }}>✓ Signed</div>
              <div style={{ fontSize: 13, color: "#333", marginBottom: 2 }}>{signature.customerName}</div>
              <div style={{ fontSize: 12, color: "#666" }}>{signature.date} at {signature.time}</div>
            </div>
          ) : (
            <>
              {showSignatureForm ? (
                <div style={{ display: "flex", gap: 8 }}>
                  <input
                    type="text"
                    value={signatureName}
                    onChange={(e) => setSignatureName(e.target.value)}
                    placeholder="Customer name..."
                    autoFocus
                    style={{
                      flex: 1,
                      background: "#F9F9F9",
                      border: "1px solid #DDD",
                      borderRadius: 6,
                      padding: "10px 12px",
                      color: "#333",
                      fontSize: 13,
                    }}
                  />
                  <button
                    onClick={handleCaptureSignature}
                    style={{
                      background: "#2E7D32",
                      color: "white",
                      border: "none",
                      borderRadius: 6,
                      padding: "10px 16px",
                      fontWeight: "600",
                      cursor: "pointer",
                    }}
                  >
                    Save
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowSignatureForm(true)}
                  style={{
                    background: "#E3F2FD",
                    color: "#1565C0",
                    border: "1px solid #90CAF9",
                    borderRadius: 6,
                    padding: "12px 16px",
                    fontWeight: "600",
                    fontSize: 13,
                    cursor: "pointer",
                    width: "100%",
                  }}
                >
                  Capture Signature
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  app: { background: "#F5F5F5", color: "#333", minHeight: "100vh", fontFamily: "'Inter', sans-serif" },
  header: { background: "white", borderBottom: "1px solid #E0E0E0", padding: "20px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" },
  brandName: { fontSize: 18, fontWeight: "700", color: "#1565C0" },
  brandSub: { fontSize: 12, color: "#999" },
  body: { padding: "24px", maxWidth: "1200px", margin: "0 auto" },
  backBtn: { background: "#1565C0", color: "white", border: "none", borderRadius: 6, padding: "10px 16px", fontWeight: "600", fontSize: 13, cursor: "pointer" },
  sectionHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  sectionTitle: { fontSize: 20, fontWeight: "700", color: "#333" },
  badge: { fontSize: 12, color: "#666", background: "#E8EEF7", padding: "6px 12px", borderRadius: 4 },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 },
  card: { background: "white", border: "1px solid #E0E0E0", borderRadius: 8, padding: 16, boxShadow: "0 1px 3px rgba(0,0,0,0.05)" },
  cardTitle: { fontSize: 13, fontWeight: "700", color: "#666", textTransform: "uppercase", marginBottom: 12, letterSpacing: 0.5 },
  woId: { fontSize: 16, fontWeight: "700", color: "#1565C0" },
  woCustomer: { fontSize: 14, color: "#333", marginTop: 4 },
  statusBadge: { padding: "4px 8px", borderRadius: 4, fontSize: 11, fontWeight: "600" },
  divider: { height: "1px", background: "#E0E0E0", margin: "12px 0" },
  label: { fontSize: 11, color: "#999", fontWeight: "600", textTransform: "uppercase" },
  value: { fontSize: 13, color: "#333", marginTop: 4, fontWeight: "500" },
};
