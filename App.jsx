import React, { useState } from 'react';
import { Wrench, ChevronRight } from 'lucide-react';

// Mock data for development
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
      opened_at: "2024-12-15"
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
      opened_at: "2024-12-14"
    }
  },
];

const WO_STATUS_STYLES = {
  open: { label: "Open", bg: "#1A4D3E", color: "#3ECF8E" },
  waiting_parts: { label: "Waiting on Parts", bg: "#4D3E1A", color: "#F2A900" },
  in_progress: { label: "In Progress", bg: "#3E2A4D", color: "#7B68EE" },
  completed: { label: "Completed", bg: "#1A3E4D", color: "#3A6EA5" },
  notified: { label: "Notified", bg: "#2A4D1A", color: "#3ECF8E" },
};

export default function AutoLabApp() {
  const [screen, setScreen] = useState("dashboard");
  const [activeWorkOrderId, setActiveWorkOrderId] = useState(null);
  const [workOrders] = useState(MOCK_WORK_ORDERS);

  if (screen === "dashboard") {
    return (
      <div style={styles.app}>
        <div style={styles.header}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Wrench size={20} color="#F2A900" />
            <div>
              <div style={styles.brandName}>Auto Lab</div>
              <div style={styles.brandSub}>Shop Management</div>
            </div>
          </div>
        </div>

        <div style={styles.body}>
          <div style={styles.workOrdersSectionHeader}>
            <div style={styles.workOrdersSectionTitle}>Active Work Orders</div>
            <div style={styles.workOrdersCount}>{workOrders.length} Total</div>
          </div>

          <div style={styles.workOrdersGrid}>
            {workOrders.map((wo) => {
              const cust = MOCK_CUSTOMERS.find((c) => c.id === wo.data.customer_id);
              const veh = MOCK_VEHICLES.find((v) => v.id === wo.data.vehicle_id);
              const st = WO_STATUS_STYLES[wo.data.status] || WO_STATUS_STYLES.open;
              const laborTotal = Object.values(wo.data.labor || {}).reduce((s, l) => s + l.hours * l.rate, 0);
              const total = laborTotal + 250;

              return (
                <div
                  key={wo.id}
                  style={styles.woCard}
                  onClick={() => {
                    setActiveWorkOrderId(wo.id);
                    setScreen("workOrderDetail");
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                    <div>
                      <div style={styles.woCardId}>WO #{wo.id.replace("wo", "")}</div>
                      <div style={styles.woCardCustomer}>{cust?.data.name}</div>
                    </div>
                    <div style={{ ...styles.badge, color: st.color, background: st.bg }}>
                      {st.label}
                    </div>
                  </div>

                  <div style={{ fontSize: 12, color: "#8A93A6", marginBottom: 8, paddingBottom: 8, borderBottom: "1px solid #1E232B" }}>
                    {veh?.data.year} {veh?.data.make} {veh?.data.model}
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 8 }}>
                    <div>
                      <div style={{ fontSize: 10, color: "#5A6272", fontWeight: 600 }}>PLATE</div>
                      <div style={{ fontSize: 13, color: "#E7EAEF", marginTop: 2 }}>{veh?.data.plate}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 10, color: "#5A6272", fontWeight: 600 }}>AMOUNT</div>
                      <div style={{ fontSize: 13, color: "#F2A900", marginTop: 2 }}>${total.toFixed(2)}</div>
                    </div>
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 8, borderTop: "1px solid #1E232B" }}>
                    <div style={{ fontSize: 11, color: "#8A93A6" }}>{wo.data.opened_at}</div>
                    <ChevronRight size={16} color="#8A93A6" />
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

    const cust = MOCK_CUSTOMERS.find((c) => c.id === wo.data.customer_id);
    const veh = MOCK_VEHICLES.find((v) => v.id === wo.data.vehicle_id);
    const st = WO_STATUS_STYLES[wo.data.status] || WO_STATUS_STYLES.open;

    return (
      <div style={styles.app}>
        <div style={styles.header}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Wrench size={20} color="#F2A900" />
            <div>
              <div style={styles.brandName}>Auto Lab</div>
              <div style={styles.brandSub}>Work Order Detail</div>
            </div>
          </div>
          <button style={styles.backBtn} onClick={() => setScreen("dashboard")}>
            ← Back
          </button>
        </div>

        <div style={styles.body}>
          <div style={{ background: "#12151A", border: "1px solid #1E232B", borderRadius: 12, padding: 16, marginBottom: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div style={styles.woCardId}>Work Order #{wo.id.replace("wo", "")}</div>
                <div style={styles.woCardCustomer}>{cust?.data.name}</div>
              </div>
              <div style={{ ...styles.badge, color: st.color, background: st.bg }}>
                {st.label}
              </div>
            </div>
          </div>

          <div style={{ background: "#12151A", border: "1px solid #1E232B", borderRadius: 12, padding: 16, marginBottom: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#5A6272", textTransform: "uppercase", marginBottom: 12 }}>
              Vehicle Information
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div>
                <div style={{ fontSize: 11, color: "#8A93A6", marginBottom: 4 }}>VEHICLE</div>
                <div style={{ fontSize: 13, color: "#E7EAEF" }}>
                  {veh?.data.year} {veh?.data.make} {veh?.data.model}
                </div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: "#8A93A6", marginBottom: 4 }}>PLATE</div>
                <div style={{ fontSize: 13, color: "#E7EAEF" }}>{veh?.data.plate}</div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: "#8A93A6", marginBottom: 4 }}>VIN</div>
                <div style={{ fontSize: 12, color: "#E7EAEF", fontFamily: "monospace" }}>{veh?.data.vin}</div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: "#8A93A6", marginBottom: 4 }}>MILEAGE</div>
                <div style={{ fontSize: 13, color: "#E7EAEF" }}>{veh?.data.mileage.toLocaleString()} km</div>
              </div>
            </div>
          </div>

          <div style={{ background: "#12151A", border: "1px solid #1E232B", borderRadius: 12, padding: 16, marginBottom: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#5A6272", textTransform: "uppercase", marginBottom: 12 }}>
              Customer Concern
            </div>
            <div style={{ fontSize: 13, color: "#E7EAEF", lineHeight: 1.6 }}>{wo.data.complaint}</div>
          </div>

          <div style={{ background: "#12151A", border: "1px solid #1E232B", borderRadius: 12, padding: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#5A6272", textTransform: "uppercase", marginBottom: 12 }}>
              Work Items
            </div>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #1E232B" }}>
                  <th style={{ textAlign: "left", padding: 8, fontSize: 11, color: "#8A93A6", fontWeight: 600 }}>Description</th>
                  <th style={{ textAlign: "right", padding: 8, fontSize: 11, color: "#8A93A6", fontWeight: 600 }}>Hours</th>
                  <th style={{ textAlign: "right", padding: 8, fontSize: 11, color: "#8A93A6", fontWeight: 600 }}>Rate</th>
                  <th style={{ textAlign: "right", padding: 8, fontSize: 11, color: "#8A93A6", fontWeight: 600 }}>Total</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(wo.data.labor || {}).map(([id, labor]) => (
                  <tr key={id} style={{ borderBottom: "1px solid #1E232B" }}>
                    <td style={{ padding: 8, fontSize: 13, color: "#E7EAEF" }}>🔧 {labor.desc}</td>
                    <td style={{ padding: 8, fontSize: 13, color: "#E7EAEF", textAlign: "right" }}>{labor.hours}</td>
                    <td style={{ padding: 8, fontSize: 13, color: "#E7EAEF", textAlign: "right" }}>${labor.rate.toFixed(2)}</td>
                    <td style={{ padding: 8, fontSize: 13, color: "#F2A900", textAlign: "right", fontWeight: 600 }}>
                      ${(labor.hours * labor.rate).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

const styles = {
  app: { background: "#0B0D10", color: "#E7EAEF", minHeight: "100vh", fontFamily: "'Inter', sans-serif" },
  header: { background: "#12151A", borderBottom: "1px solid #1E232B", padding: "16px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" },
  brandName: { fontSize: 16, fontWeight: 700, color: "#F2A900" },
  brandSub: { fontSize: 11, color: "#8A93A6" },
  body: { padding: "24px" },
  backBtn: { background: "#F2A900", color: "#0B0D10", border: "none", borderRadius: 8, padding: "10px 16px", fontWeight: 600, fontSize: 13, cursor: "pointer" },
  workOrdersSectionHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  workOrdersSectionTitle: { fontSize: 18, fontWeight: 700, color: "#E7EAEF" },
  workOrdersCount: { fontSize: 13, color: "#8A93A6", background: "#12151A", padding: "6px 12px", borderRadius: 6 },
  workOrdersGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(270px, 1fr))", gap: 14 },
  woCard: { background: "#12151A", border: "1px solid #1E232B", borderRadius: 12, padding: 16, cursor: "pointer", transition: "all 0.2s" },
  woCardId: { fontSize: 14, fontWeight: 700, color: "#F2A900" },
  woCardCustomer: { fontSize: 13, color: "#E7EAEF", marginTop: 4 },
  badge: { padding: "4px 8px", borderRadius: 6, fontSize: 11, fontWeight: 600 },
};
