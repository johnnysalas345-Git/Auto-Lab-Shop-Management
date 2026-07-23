import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://gvsbbpuuoxluqaiovtvx.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd2c2JicHV1b3hsdXFhaW92dHZ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQyMjE3MzUsImV4cCI6MjA5OTc5NzczNX0.fIXxADQkEPSK2wYoI5rFdkr4X4P0gSI_wmr50XUajY0';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const COLORS = {
  primary: '#4A90E2',
  primaryLight: '#E3F0FF',
  bg: '#E3F0FF',
  cardBg: '#FFFFFF',
  border: '#E8EEF5',
  text: '#2C3E50',
  textLight: '#7A8B99',
};

const CAR_MAKES = ['Toyota', 'Honda', 'Ford', 'Chevrolet', 'BMW', 'Mercedes-Benz', 'Audi', 'Volkswagen', 'Hyundai', 'Kia'];

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [menuOpen, setMenuOpen] = useState(false);
  const [workOrders, setWorkOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [vehicles, setVehicles] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [woRes, custRes, vehRes] = await Promise.all([
        supabase.from('work_orders').select('*'),
        supabase.from('customers').select('*'),
        supabase.from('vehicles').select('*'),
      ]);
      setWorkOrders(woRes.data || []);
      setCustomers(custRes.data || []);
      setVehicles(vehRes.data || []);
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const menuItems = [
    { label: 'DASHBOARD', id: 'dashboard' },
    { label: 'CUSTOMERS & VEHICLES', id: 'customers' },
    { label: 'JOBS & INVOICES', id: 'jobs' },
    { label: 'HOURS', id: 'hours' },
    { label: 'PAYROLL', id: 'payroll' },
  ];

  if (activeTab === 'customers') {
    return <CustomersPage customers={customers} vehicles={vehicles} workOrders={workOrders} loadData={loadData} setActiveTab={setActiveTab} activeTab={activeTab} menuOpen={menuOpen} setMenuOpen={setMenuOpen} menuItems={menuItems} />;
  }

  return (
    <div style={{ minHeight: '100vh', fontFamily: 'Arial, sans-serif', display: 'flex', flexDirection: 'column', background: COLORS.bg }}>
      <div style={{ padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: COLORS.primaryLight, borderBottom: `1px solid ${COLORS.border}`, position: 'relative' }}>
        <div style={{ position: 'relative' }}>
          <button onClick={() => setMenuOpen(!menuOpen)} style={{ border: 'none', background: 'none', cursor: 'pointer', padding: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            <div style={{ fontSize: 24, fontWeight: 'bold', letterSpacing: '-2px' }}>
              <span style={{ color: '#333' }}>AUTO</span>
              <span style={{ color: '#E53935' }}>LAB</span>
            </div>
            <div style={{ fontSize: 13, fontWeight: 'bold', color: '#666' }}>MENU</div>
          </button>
          {menuOpen && (
            <div style={{ position: 'absolute', top: 70, left: 0, width: 200, background: 'white', border: `1px solid ${COLORS.border}`, borderRadius: 6, boxShadow: '0 4px 12px rgba(0,0,0,0.1)', zIndex: 100, overflow: 'hidden' }}>
              {menuItems.map((item) => (
                <button key={item.id} onClick={() => { setActiveTab(item.id); setMenuOpen(false); }} style={{ width: '100%', padding: '12px 16px', border: 'none', background: activeTab === item.id ? '#E3F0FF' : 'white', color: '#333', textAlign: 'left', cursor: 'pointer', fontSize: 14, fontWeight: 600, borderBottom: `1px solid ${COLORS.border}` }}>
                  {item.label}
                </button>
              ))}
            </div>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 14, fontWeight: 'bold', color: COLORS.text }}>Johnny</div>
            <button style={{ background: 'none', border: 'none', color: COLORS.textLight, cursor: 'pointer', fontSize: 12, textDecoration: 'underline' }}>Sign out</button>
          </div>
          <div style={{ width: 40, height: 40, borderRadius: '50%', background: COLORS.primary, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: 16 }}>J</div>
        </div>
      </div>
      <div style={{ padding: '32px 24px', flex: 1, maxWidth: '1600px', width: '100%', margin: '0 auto' }}>
        <h1 style={{ color: COLORS.text, fontSize: 32, margin: '0 0 24px 0', fontWeight: 'bold' }}>Dashboard</h1>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
          <div style={{ background: COLORS.cardBg, border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: 24 }}>
            <h2 style={{ color: COLORS.text, fontSize: 18, fontWeight: 'bold', margin: '0 0 16px 0' }}>Today's Workflow</h2>
            <div style={{ color: COLORS.textLight, fontSize: 14 }}>Loading workflow data...</div>
          </div>
          <div style={{ background: COLORS.cardBg, border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: 24 }}>
            <h2 style={{ color: COLORS.text, fontSize: 18, fontWeight: 'bold', margin: '0 0 16px 0' }}>Job Status</h2>
            <div style={{ color: COLORS.textLight, fontSize: 14 }}>Active jobs: {workOrders.length}</div>
          </div>
        </div>
      </div>
      {menuOpen && <div onClick={() => setMenuOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 50 }} />}
    </div>
  );
}

function CustomersPage({ customers, vehicles, workOrders, loadData, setActiveTab, activeTab, menuOpen, setMenuOpen, menuItems }) {
  const [showNewCustomer, setShowNewCustomer] = useState(false);
  const [selectedVehicleForWO, setSelectedVehicleForWO] = useState(null);
  const [selectedVehicleForEst, setSelectedVehicleForEst] = useState(null);
  const [selectedVehicleForInsp, setSelectedVehicleForInsp] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const customerVehicleMap = {};
  customers.forEach((cust) => {
    customerVehicleMap[cust.id] = vehicles.filter((v) => v.customer_id === cust.id);
  });

  const filteredCustomers = customers.filter((cust) => {
    const search = searchTerm.toLowerCase();
    const custName = cust.data?.name || '';
    const custPhone = cust.data?.phone || '';
    if (custName.toLowerCase().includes(search) || custPhone.includes(search)) return true;
    const custVehicles = customerVehicleMap[cust.id] || [];
    return custVehicles.some((v) => {
      const make = v.data?.make || '';
      const model = v.data?.model || '';
      const plate = v.data?.license_plate || '';
      return make.toLowerCase().includes(search) || model.toLowerCase().includes(search) || plate.includes(search);
    });
  });

  return (
    <div style={{ minHeight: '100vh', fontFamily: 'Arial, sans-serif', display: 'flex', flexDirection: 'column', background: COLORS.bg }}>
      <div style={{ padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: COLORS.primaryLight, borderBottom: `1px solid ${COLORS.border}`, position: 'relative' }}>
        <div style={{ position: 'relative' }}>
          <button onClick={() => setMenuOpen(!menuOpen)} style={{ border: 'none', background: 'none', cursor: 'pointer', padding: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            <div style={{ fontSize: 24, fontWeight: 'bold', letterSpacing: '-2px' }}>
              <span style={{ color: '#333' }}>AUTO</span>
              <span style={{ color: '#E53935' }}>LAB</span>
            </div>
            <div style={{ fontSize: 13, fontWeight: 'bold', color: '#666' }}>MENU</div>
          </button>
          {menuOpen && (
            <div style={{ position: 'absolute', top: 70, left: 0, width: 200, background: 'white', border: `1px solid ${COLORS.border}`, borderRadius: 6, boxShadow: '0 4px 12px rgba(0,0,0,0.1)', zIndex: 100, overflow: 'hidden' }}>
              {menuItems.map((item) => (
                <button key={item.id} onClick={() => { setActiveTab(item.id); setMenuOpen(false); }} style={{ width: '100%', padding: '12px 16px', border: 'none', background: activeTab === item.id ? '#E3F0FF' : 'white', color: '#333', textAlign: 'left', cursor: 'pointer', fontSize: 14, fontWeight: 600, borderBottom: `1px solid ${COLORS.border}` }}>
                  {item.label}
                </button>
              ))}
            </div>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 14, fontWeight: 'bold', color: COLORS.text }}>Johnny</div>
            <button style={{ background: 'none', border: 'none', color: COLORS.textLight, cursor: 'pointer', fontSize: 12, textDecoration: 'underline' }}>Sign out</button>
          </div>
          <div style={{ width: 40, height: 40, borderRadius: '50%', background: COLORS.primary, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: 16 }}>J</div>
        </div>
      </div>
      <div style={{ padding: '32px 24px', flex: 1, maxWidth: '1600px', width: '100%', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h1 style={{ color: COLORS.text, fontSize: 32, margin: 0, fontWeight: 'bold' }}>Customers & Vehicles</h1>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <input type="text" placeholder="🔍 Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ padding: '10px 14px', borderRadius: 6, border: `1px solid ${COLORS.border}`, fontSize: 14, minWidth: 260 }} />
            <button onClick={() => setShowNewCustomer(!showNewCustomer)} style={{ padding: '10px 16px', background: '#4CAF50', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 600, fontSize: 14 }}>➕ New Customer</button>
          </div>
        </div>
        {showNewCustomer && <NewCustomerForm onSave={() => { loadData(); setShowNewCustomer(false); }} onCancel={() => setShowNewCustomer(false)} />}
        <div style={{ background: COLORS.cardBg, border: `1px solid ${COLORS.border}`, borderRadius: 8, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: COLORS.primaryLight, borderBottom: `2px solid ${COLORS.border}` }}>
                <th style={{ padding: '14px 18px', textAlign: 'left', fontWeight: 'bold', fontSize: 14, color: COLORS.text }}>Name</th>
                <th style={{ padding: '14px 18px', textAlign: 'left', fontWeight: 'bold', fontSize: 14, color: COLORS.text }}>Phone</th>
                <th style={{ padding: '14px 18px', textAlign: 'center', fontWeight: 'bold', fontSize: 14, color: COLORS.text }}>Brand</th>
                <th style={{ padding: '14px 18px', textAlign: 'center', fontWeight: 'bold', fontSize: 14, color: COLORS.text }}>Model</th>
                <th style={{ padding: '14px 18px', textAlign: 'center', fontWeight: 'bold', fontSize: 14, color: COLORS.text }}>Plate</th>
                <th style={{ padding: '14px 18px', textAlign: 'center', fontWeight: 'bold', fontSize: 14, color: COLORS.text }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.length === 0 ? (
                <tr><td colSpan="6" style={{ padding: '40px', textAlign: 'center', color: COLORS.textLight }}>{searchTerm ? 'No results found' : 'No customers yet'}</td></tr>
              ) : (
                filteredCustomers.map((customer) => {
                  const custVehicles = customerVehicleMap[customer.id] || [];
                  return custVehicles.length === 0 ? (
                    <tr key={customer.id} style={{ borderBottom: `1px solid ${COLORS.border}` }}>
                      <td style={{ padding: '14px 18px', fontSize: 14, color: COLORS.text, fontWeight: 600 }}>{customer.data?.name}</td>
                      <td style={{ padding: '14px 18px', fontSize: 14, color: COLORS.text }}>{customer.data?.phone}</td>
                      <td style={{ padding: '14px 18px', textAlign: 'center', color: COLORS.textLight }}>—</td>
                      <td style={{ padding: '14px 18px', textAlign: 'center', color: COLORS.textLight }}>—</td>
                      <td style={{ padding: '14px 18px', textAlign: 'center', color: COLORS.textLight }}>—</td>
                      <td style={{ padding: '14px 18px', textAlign: 'center' }}>—</td>
                    </tr>
                  ) : (
                    custVehicles.map((vehicle, idx) => (
                      <tr key={vehicle.id} style={{ borderBottom: `1px solid ${COLORS.border}` }}>
                        <td style={{ padding: '14px 18px', fontSize: 14, color: COLORS.text }}>{idx === 0 ? customer.data?.name : ''}</td>
                        <td style={{ padding: '14px 18px', fontSize: 14, color: COLORS.text }}>{idx === 0 ? customer.data?.phone : ''}</td>
                        <td style={{ padding: '14px 18px', textAlign: 'center', fontSize: 14, color: COLORS.text }}>{vehicle.data?.make}</td>
                        <td style={{ padding: '14px 18px', textAlign: 'center', fontSize: 14, color: COLORS.text }}>{vehicle.data?.model}</td>
                        <td style={{ padding: '14px 18px', textAlign: 'center', fontSize: 14, color: COLORS.primary, fontWeight: 600 }}>{vehicle.data?.license_plate}</td>
                        <td style={{ padding: '14px 18px', textAlign: 'center' }}>
                          <div style={{ display: 'flex', gap: 6, justifyContent: 'center', flexWrap: 'wrap' }}>
                            <button style={{ width: 36, height: 36, borderRadius: 4, border: 'none', background: '#4CAF50', cursor: 'pointer', fontSize: 18 }} title="View History">👁️</button>
                            <button onClick={() => setSelectedVehicleForWO(vehicle.id)} style={{ width: 36, height: 36, borderRadius: 4, border: 'none', background: '#FF9800', cursor: 'pointer', fontSize: 18 }} title="Create Work Order">🔧</button>
                            <button onClick={() => setSelectedVehicleForEst(vehicle.id)} style={{ width: 36, height: 36, borderRadius: 4, border: 'none', background: '#2196F3', cursor: 'pointer', fontSize: 18 }} title="Create Estimate">🧮</button>
                            <button onClick={() => setSelectedVehicleForInsp(vehicle.id)} style={{ width: 36, height: 36, borderRadius: 4, border: 'none', background: '#9C27B0', cursor: 'pointer', fontSize: 18 }} title="Create Inspection">📋</button>
                          </div>
                        </td>
                      </tr>
                    ))
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
      {selectedVehicleForWO && <WorkOrderModal vehicleId={selectedVehicleForWO} vehicles={vehicles} onClose={() => setSelectedVehicleForWO(null)} onSave={() => { loadData(); setSelectedVehicleForWO(null); }} />}
      {selectedVehicleForEst && <EstimateModal vehicleId={selectedVehicleForEst} vehicles={vehicles} onClose={() => setSelectedVehicleForEst(null)} onSave={() => { loadData(); setSelectedVehicleForEst(null); }} />}
      {selectedVehicleForInsp && <InspectionModal vehicleId={selectedVehicleForInsp} vehicles={vehicles} onClose={() => setSelectedVehicleForInsp(null)} onSave={() => { loadData(); setSelectedVehicleForInsp(null); }} />}
      {menuOpen && <div onClick={() => setMenuOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 50 }} />}
    </div>
  );
}

function NewCustomerForm({ onSave, onCancel }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!name || !phone) return;
    setLoading(true);
    try {
      await supabase.from('customers').insert([{ data: { name, phone } }]);
      alert('Customer added!');
      onSave();
    } catch (err) {
      alert('Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ padding: '20px', background: COLORS.primaryLight, borderRadius: 8, marginBottom: 24, border: `1px solid ${COLORS.border}` }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
        <input placeholder="Full Name *" value={name} onChange={(e) => setName(e.target.value)} style={{ padding: '10px 12px', border: `1px solid ${COLORS.border}`, borderRadius: 4, fontSize: 14 }} disabled={loading} />
        <input placeholder="Phone *" value={phone} onChange={(e) => setPhone(e.target.value)} style={{ padding: '10px 12px', border: `1px solid ${COLORS.border}`, borderRadius: 4, fontSize: 14 }} disabled={loading} />
      </div>
      <div style={{ display: 'flex', gap: 12 }}>
        <button type="submit" disabled={loading} style={{ flex: 1, padding: '10px', background: '#4CAF50', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer', fontWeight: 600 }}>Save</button>
        <button type="button" onClick={onCancel} disabled={loading} style={{ flex: 1, padding: '10px', background: '#f44336', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer', fontWeight: 600 }}>Cancel</button>
      </div>
    </form>
  );
}

function WorkOrderModal({ vehicleId, vehicles, onClose, onSave }) {
  const [complaint, setComplaint] = useState('');
  const [status, setStatus] = useState('open');
  const [loading, setLoading] = useState(false);
  const vehicle = vehicles.find((v) => v.id === vehicleId);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!complaint) return;
    setLoading(true);
    try {
      await supabase.from('work_orders').insert([{ id: 'wo' + Date.now(), data: { complaint, status, vehicle_id: vehicleId, customer_id: vehicle?.customer_id, opened_at: new Date().toISOString().split('T')[0] } }]);
      alert('Work order created!');
      onSave();
    } catch (err) {
      alert('Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200 }}>
      <div style={{ background: COLORS.cardBg, borderRadius: 8, padding: 32, maxWidth: 500, width: '90%' }}>
        <h3 style={{ color: COLORS.text, marginTop: 0, marginBottom: 20, fontSize: 18, fontWeight: 'bold' }}>Create Work Order</h3>
        <form onSubmit={handleSubmit}>
          <textarea placeholder="Complaint / Description *" value={complaint} onChange={(e) => setComplaint(e.target.value)} style={{ width: '100%', padding: '10px 12px', marginBottom: 12, border: `1px solid ${COLORS.border}`, borderRadius: 4, minHeight: 100, fontSize: 14, fontFamily: 'Arial, sans-serif', boxSizing: 'border-box' }} disabled={loading} />
          <select value={status} onChange={(e) => setStatus(e.target.value)} style={{ width: '100%', padding: '10px 12px', marginBottom: 20, border: `1px solid ${COLORS.border}`, borderRadius: 4, fontSize: 14, boxSizing: 'border-box' }} disabled={loading}>
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
          <div style={{ display: 'flex', gap: 12 }}>
            <button type="submit" disabled={loading} style={{ flex: 1, padding: '10px', background: '#FF9800', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer', fontWeight: 600 }}>Create</button>
            <button type="button" onClick={onClose} disabled={loading} style={{ flex: 1, padding: '10px', background: '#f44336', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer', fontWeight: 600 }}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function EstimateModal({ vehicleId, vehicles, onClose, onSave }) {
  const [description, setDescription] = useState('');
  const [partsCost, setPartsCost] = useState('');
  const [laborCost, setLaborCost] = useState('');
  const [loading, setLoading] = useState(false);
  const vehicle = vehicles.find((v) => v.id === vehicleId);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!description) return;
    setLoading(true);
    try {
      await supabase.from('work_orders').insert([{ id: 'est' + Date.now(), data: { type: 'estimate', description, parts_cost: partsCost, labor_cost: laborCost, vehicle_id: vehicleId, customer_id: vehicle?.customer_id, created_at: new Date().toISOString().split('T')[0] } }]);
      alert('Estimate created!');
      onSave();
    } catch (err) {
      alert('Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200 }}>
      <div style={{ background: COLORS.cardBg, borderRadius: 8, padding: 32, maxWidth: 500, width: '90%' }}>
        <h3 style={{ color: COLORS.text, marginTop: 0, marginBottom: 20, fontSize: 18, fontWeight: 'bold' }}>Create Estimate</h3>
        <form onSubmit={handleSubmit}>
          <textarea placeholder="Description *" value={description} onChange={(e) => setDescription(e.target.value)} style={{ width: '100%', padding: '10px 12px', marginBottom: 12, border: `1px solid ${COLORS.border}`, borderRadius: 4, minHeight: 100, fontSize: 14, fontFamily: 'Arial, sans-serif', boxSizing: 'border-box' }} disabled={loading} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
            <input type="number" placeholder="Parts Cost (CI$)" value={partsCost} onChange={(e) => setPartsCost(e.target.value)} style={{ padding: '10px 12px', border: `1px solid ${COLORS.border}`, borderRadius: 4, fontSize: 14, boxSizing: 'border-box' }} disabled={loading} />
            <input type="number" placeholder="Labor Cost (CI$)" value={laborCost} onChange={(e) => setLaborCost(e.target.value)} style={{ padding: '10px 12px', border: `1px solid ${COLORS.border}`, borderRadius: 4, fontSize: 14, boxSizing: 'border-box' }} disabled={loading} />
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <button type="submit" disabled={loading} style={{ flex: 1, padding: '10px', background: '#2196F3', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer', fontWeight: 600 }}>Create</button>
            <button type="button" onClick={onClose} disabled={loading} style={{ flex: 1, padding: '10px', background: '#f44336', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer', fontWeight: 600 }}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function InspectionModal({ vehicleId, vehicles, onClose, onSave }) {
  const [findings, setFindings] = useState('');
  const [status, setStatus] = useState('pending');
  const [loading, setLoading] = useState(false);
  const vehicle = vehicles.find((v) => v.id === vehicleId);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!findings) return;
    setLoading(true);
    try {
      await supabase.from('work_orders').insert([{ id: 'insp' + Date.now(), data: { type: 'inspection', findings, status, vehicle_id: vehicleId, customer_id: vehicle?.customer_id, created_at: new Date().toISOString().split('T')[0] } }]);
      alert('Inspection created!');
      onSave();
    } catch (err) {
      alert('Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200 }}>
      <div style={{ background: COLORS.cardBg, borderRadius: 8, padding: 32, maxWidth: 500, width: '90%' }}>
        <h3 style={{ color: COLORS.text, marginTop: 0, marginBottom: 20, fontSize: 18, fontWeight: 'bold' }}>Create Inspection</h3>
        <form onSubmit={handleSubmit}>
          <textarea placeholder="Findings *" value={findings} onChange={(e) => setFindings(e.target.value)} style={{ width: '100%', padding: '10px 12px', marginBottom: 12, border: `1px solid ${COLORS.border}`, borderRadius: 4, minHeight: 100, fontSize: 14, fontFamily: 'Arial, sans-serif', boxSizing: 'border-box' }} disabled={loading} />
          <select value={status} onChange={(e) => setStatus(e.target.value)} style={{ width: '100%', padding: '10px 12px', marginBottom: 20, border: `1px solid ${COLORS.border}`, borderRadius: 4, fontSize: 14, boxSizing: 'border-box' }} disabled={loading}>
            <option value="pending">Pending</option>
            <option value="passed">Passed</option>
            <option value="failed">Failed</option>
          </select>
          <div style={{ display: 'flex', gap: 12 }}>
            <button type="submit" disabled={loading} style={{ flex: 1, padding: '10px', background: '#9C27B0', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer', fontWeight: 600 }}>Create</button>
            <button type="button" onClick={onClose} disabled={loading} style={{ flex: 1, padding: '10px', background: '#f44336', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer', fontWeight: 600 }}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
