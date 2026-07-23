import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://gvsbbpuuoxluqaiovtvx.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd2c2JicHV1b3hsdXFhaW92dHZ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQyMjE3MzUsImV4cCI6MjA5OTc5NzczNX0.fIXxADQkEPSK2wYoI5rFdkr4X4P0gSI_wmr50XUajY0';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const COLORS = { primary: '#4A90E2', primaryLight: '#E3F0FF', bg: '#E3F0FF', cardBg: '#FFFFFF', border: '#E8EEF5', text: '#2C3E50', textLight: '#7A8B99' };
const CAR_MAKES = ['Toyota', 'Honda', 'Ford', 'Chevrolet', 'BMW', 'Mercedes-Benz', 'Audi', 'Volkswagen', 'Hyundai', 'Kia'];

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
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

  if (activeTab === 'customers') {
    return <CustomersView customers={customers} vehicles={vehicles} workOrders={workOrders} loadData={loadData} />;
  }

  return (
    <div style={{ minHeight: '100vh', fontFamily: 'Inter, sans-serif', display: 'flex', flexDirection: 'column', background: COLORS.bg }}>
      <Header setActiveTab={setActiveTab} activeTab={activeTab} />
      <div style={{ padding: '24px', flex: 1, maxWidth: '1600px', margin: '0 auto', width: '100%' }}>
        <h1 style={{ color: COLORS.text }}>Dashboard</h1>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          <div style={{ background: COLORS.cardBg, padding: 24, borderRadius: 8, border: `1px solid ${COLORS.border}` }}>
            <h2 style={{ color: COLORS.text, marginTop: 0 }}>Today's Workflow</h2>
            <p style={{ color: COLORS.textLight }}>Loading workflow...</p>
          </div>
          <div style={{ background: COLORS.cardBg, padding: 24, borderRadius: 8, border: `1px solid ${COLORS.border}` }}>
            <h2 style={{ color: COLORS.text, marginTop: 0 }}>Job Status</h2>
            <p style={{ color: COLORS.textLight }}>Active jobs: {workOrders.length}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Header({ setActiveTab, activeTab }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuItems = [
    { label: 'DASHBOARD', id: 'dashboard' },
    { label: 'CUSTOMERS & VEHICLES', id: 'customers' },
    { label: 'JOBS & INVOICES', id: 'jobs' },
    { label: 'HOURS', id: 'hours' },
    { label: 'PAYROLL', id: 'payroll' },
  ];

  return (
    <div style={{ padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: COLORS.primaryLight, borderBottom: `1px solid ${COLORS.border}` }}>
      <div style={{ position: 'relative' }}>
        <button onClick={() => setMenuOpen(!menuOpen)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, border: 'none', background: 'none', cursor: 'pointer' }}>
          <div style={{ fontSize: 22, fontWeight: 900 }}>AUTO<span style={{ color: '#E53935' }}>LAB</span></div>
          <div style={{ fontSize: 14, fontWeight: 700 }}>MENU</div>
        </button>
        {menuOpen && (
          <div style={{ position: 'absolute', top: 60, left: 0, minWidth: 220, background: '#F0F0F0', borderRadius: 4, zIndex: 20 }}>
            {menuItems.map(item => (
              <button key={item.id} onClick={() => { setActiveTab(item.id); setMenuOpen(false); }} style={{ display: 'block', width: '100%', padding: '12px 16px', border: 'none', cursor: 'pointer', background: activeTab === item.id ? '#D0D0D0' : 'transparent', textAlign: 'left' }}>
                {item.label}
              </button>
            ))}
          </div>
        )}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 14, fontWeight: 600 }}>Johnny</div>
          <button style={{ fontSize: 13, border: 'none', background: 'none', cursor: 'pointer', color: COLORS.textLight }}>Sign out</button>
        </div>
        <div style={{ width: 36, height: 36, borderRadius: '50%', background: COLORS.primary, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>J</div>
      </div>
      {menuOpen && <div onClick={() => setMenuOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 10 }} />}
    </div>
  );
}

function CustomersView({ customers, vehicles, workOrders, loadData }) {
  const [showNewCustomer, setShowNewCustomer] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedVehicleForWorkOrder, setSelectedVehicleForWorkOrder] = useState(null);
  const [selectedVehicleForEstimate, setSelectedVehicleForEstimate] = useState(null);
  const [selectedVehicleForInspection, setSelectedVehicleForInspection] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const customerVehicleMap = {};
  customers.forEach(cust => {
    customerVehicleMap[cust.id] = vehicles.filter(v => v.customer_id === cust.id);
  });

  const filteredCustomers = customers.filter(cust => {
    const search = searchTerm.toLowerCase();
    const name = cust.data?.name || '';
    const phone = cust.data?.phone || '';
    if (name.toLowerCase().includes(search) || phone.includes(search)) return true;
    const vehList = customerVehicleMap[cust.id] || [];
    return vehList.some(v => {
      const make = v.data?.make || '';
      const model = v.data?.model || '';
      const plate = v.data?.license_plate || '';
      return make.toLowerCase().includes(search) || model.toLowerCase().includes(search) || plate.includes(search);
    });
  });

  return (
    <div style={{ minHeight: '100vh', fontFamily: 'Inter, sans-serif', display: 'flex', flexDirection: 'column', background: COLORS.bg }}>
      <Header setActiveTab={() => {}} activeTab="customers" />
      <div style={{ padding: '24px', flex: 1, maxWidth: '1600px', margin: '0 auto', width: '100%' }}>
        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ color: COLORS.text, margin: 0 }}>Customers & Vehicles</h2>
          <div style={{ display: 'flex', gap: 8 }}>
            <input type="text" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ padding: '8px 12px', borderRadius: 6, border: `1px solid ${COLORS.border}`, minWidth: 240 }} />
            <button onClick={() => setShowNewCustomer(!showNewCustomer)} style={{ padding: '8px 12px', background: '#4CAF50', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 600 }}>➕ New</button>
          </div>
        </div>

        {showNewCustomer && <NewCustomerForm onSave={() => { loadData(); setShowNewCustomer(false); }} onCancel={() => setShowNewCustomer(false)} />}

        <div style={{ background: COLORS.cardBg, border: `1px solid ${COLORS.border}`, borderRadius: 8, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: COLORS.primaryLight, borderBottom: `1px solid ${COLORS.border}` }}>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 700 }}>Name</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 700 }}>Phone</th>
                <th style={{ padding: '12px 16px', textAlign: 'center', fontWeight: 700 }}>Brand</th>
                <th style={{ padding: '12px 16px', textAlign: 'center', fontWeight: 700 }}>Model</th>
                <th style={{ padding: '12px 16px', textAlign: 'center', fontWeight: 700 }}>Plate</th>
                <th style={{ padding: '12px 16px', textAlign: 'center', fontWeight: 700 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map(customer => {
                const custVehicles = customerVehicleMap[customer.id] || [];
                return custVehicles.map((vehicle, idx) => (
                  <tr key={vehicle.id} style={{ borderBottom: `1px solid ${COLORS.border}` }}>
                    <td style={{ padding: '12px 16px' }}>{idx === 0 ? customer.data?.name : ''}</td>
                    <td style={{ padding: '12px 16px' }}>{idx === 0 ? customer.data?.phone : ''}</td>
                    <td style={{ padding: '12px 16px', textAlign: 'center' }}>{vehicle.data?.make}</td>
                    <td style={{ padding: '12px 16px', textAlign: 'center' }}>{vehicle.data?.model}</td>
                    <td style={{ padding: '12px 16px', textAlign: 'center', color: COLORS.primary, fontWeight: 600 }}>{vehicle.data?.license_plate}</td>
                    <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: 4, justifyContent: 'center' }}>
                        <button style={{ width: 32, height: 32, borderRadius: 4, border: 'none', background: '#4CAF50', cursor: 'pointer', fontSize: 14 }} title="View">👁️</button>
                        <button onClick={() => setSelectedVehicleForWorkOrder(vehicle.id)} style={{ width: 32, height: 32, borderRadius: 4, border: 'none', background: '#FF9800', cursor: 'pointer', fontSize: 14 }} title="Work Order">🔧</button>
                        <button onClick={() => setSelectedVehicleForEstimate(vehicle.id)} style={{ width: 32, height: 32, borderRadius: 4, border: 'none', background: '#2196F3', cursor: 'pointer', fontSize: 14 }} title="Estimate">🧮</button>
                        <button onClick={() => setSelectedVehicleForInspection(vehicle.id)} style={{ width: 32, height: 32, borderRadius: 4, border: 'none', background: '#9C27B0', cursor: 'pointer', fontSize: 14 }} title="Inspection">📋</button>
                      </div>
                    </td>
                  </tr>
                ));
              })}
            </tbody>
          </table>
        </div>
      </div>

      {selectedVehicleForWorkOrder && <WorkOrderModal vehicleId={selectedVehicleForWorkOrder} customers={customers} vehicles={vehicles} onClose={() => setSelectedVehicleForWorkOrder(null)} onSave={() => { loadData(); setSelectedVehicleForWorkOrder(null); }} />}
      {selectedVehicleForEstimate && <EstimateModal vehicleId={selectedVehicleForEstimate} customers={customers} vehicles={vehicles} onClose={() => setSelectedVehicleForEstimate(null)} onSave={() => { loadData(); setSelectedVehicleForEstimate(null); }} />}
      {selectedVehicleForInspection && <InspectionModal vehicleId={selectedVehicleForInspection} customers={customers} vehicles={vehicles} onClose={() => setSelectedVehicleForInspection(null)} onSave={() => { loadData(); setSelectedVehicleForInspection(null); }} />}
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
    <form onSubmit={handleSubmit} style={{ padding: '16px', background: COLORS.primaryLight, borderRadius: 8, marginBottom: 16 }}>
      <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} style={{ width: '100%', padding: '8px', marginBottom: 8, border: `1px solid ${COLORS.border}`, borderRadius: 4, boxSizing: 'border-box' }} disabled={loading} />
      <input placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} style={{ width: '100%', padding: '8px', marginBottom: 8, border: `1px solid ${COLORS.border}`, borderRadius: 4, boxSizing: 'border-box' }} disabled={loading} />
      <div style={{ display: 'flex', gap: 8 }}>
        <button type="submit" disabled={loading} style={{ flex: 1, padding: '8px', background: '#4CAF50', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}>Save</button>
        <button type="button" onClick={onCancel} disabled={loading} style={{ flex: 1, padding: '8px', background: '#f44336', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}>Cancel</button>
      </div>
    </form>
  );
}

function WorkOrderModal({ vehicleId, customers, vehicles, onClose, onSave }) {
  const [complaint, setComplaint] = useState('');
  const [status, setStatus] = useState('open');
  const [loading, setLoading] = useState(false);
  const vehicle = vehicles.find(v => v.id === vehicleId);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!complaint) return;
    setLoading(true);
    try {
      await supabase.from('work_orders').insert([{
        id: 'wo' + Date.now(),
        data: { complaint, status, vehicle_id: vehicleId, customer_id: vehicle?.customer_id, opened_at: new Date().toISOString().split('T')[0] }
      }]);
      alert('Work order created!');
      onSave();
    } catch (err) {
      alert('Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
      <div style={{ background: COLORS.cardBg, borderRadius: 8, padding: 24, maxWidth: 500, width: '90%' }}>
        <h3 style={{ color: COLORS.text, marginTop: 0 }}>Create Work Order</h3>
        <form onSubmit={handleSubmit}>
          <textarea placeholder="Complaint" value={complaint} onChange={(e) => setComplaint(e.target.value)} style={{ width: '100%', padding: '8px', marginBottom: 8, border: `1px solid ${COLORS.border}`, borderRadius: 4, minHeight: 80, boxSizing: 'border-box' }} disabled={loading} />
          <select value={status} onChange={(e) => setStatus(e.target.value)} style={{ width: '100%', padding: '8px', marginBottom: 8, border: `1px solid ${COLORS.border}`, borderRadius: 4, boxSizing: 'border-box' }} disabled={loading}>
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
          <div style={{ display: 'flex', gap: 8 }}>
            <button type="submit" disabled={loading} style={{ flex: 1, padding: '8px', background: '#FF9800', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}>Create</button>
            <button type="button" onClick={onClose} disabled={loading} style={{ flex: 1, padding: '8px', background: '#f44336', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function EstimateModal({ vehicleId, customers, vehicles, onClose, onSave }) {
  const [description, setDescription] = useState('');
  const [partsCost, setPartsCost] = useState('');
  const [laborCost, setLaborCost] = useState('');
  const [loading, setLoading] = useState(false);
  const vehicle = vehicles.find(v => v.id === vehicleId);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!description) return;
    setLoading(true);
    try {
      await supabase.from('work_orders').insert([{
        id: 'est' + Date.now(),
        data: { type: 'estimate', description, parts_cost: partsCost, labor_cost: laborCost, vehicle_id: vehicleId, customer_id: vehicle?.customer_id, created_at: new Date().toISOString().split('T')[0] }
      }]);
      alert('Estimate created!');
      onSave();
    } catch (err) {
      alert('Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
      <div style={{ background: COLORS.cardBg, borderRadius: 8, padding: 24, maxWidth: 500, width: '90%' }}>
        <h3 style={{ color: COLORS.text, marginTop: 0 }}>Create Estimate</h3>
        <form onSubmit={handleSubmit}>
          <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} style={{ width: '100%', padding: '8px', marginBottom: 8, border: `1px solid ${COLORS.border}`, borderRadius: 4, minHeight: 80, boxSizing: 'border-box' }} disabled={loading} />
          <input type="number" placeholder="Parts Cost" value={partsCost} onChange={(e) => setPartsCost(e.target.value)} style={{ width: '100%', padding: '8px', marginBottom: 8, border: `1px solid ${COLORS.border}`, borderRadius: 4, boxSizing: 'border-box' }} disabled={loading} />
          <input type="number" placeholder="Labor Cost" value={laborCost} onChange={(e) => setLaborCost(e.target.value)} style={{ width: '100%', padding: '8px', marginBottom: 8, border: `1px solid ${COLORS.border}`, borderRadius: 4, boxSizing: 'border-box' }} disabled={loading} />
          <div style={{ display: 'flex', gap: 8 }}>
            <button type="submit" disabled={loading} style={{ flex: 1, padding: '8px', background: '#2196F3', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}>Create</button>
            <button type="button" onClick={onClose} disabled={loading} style={{ flex: 1, padding: '8px', background: '#f44336', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function InspectionModal({ vehicleId, customers, vehicles, onClose, onSave }) {
  const [findings, setFindings] = useState('');
  const [status, setStatus] = useState('pending');
  const [loading, setLoading] = useState(false);
  const vehicle = vehicles.find(v => v.id === vehicleId);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!findings) return;
    setLoading(true);
    try {
      await supabase.from('work_orders').insert([{
        id: 'insp' + Date.now(),
        data: { type: 'inspection', findings, status, vehicle_id: vehicleId, customer_id: vehicle?.customer_id, created_at: new Date().toISOString().split('T')[0] }
      }]);
      alert('Inspection created!');
      onSave();
    } catch (err) {
      alert('Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
      <div style={{ background: COLORS.cardBg, borderRadius: 8, padding: 24, maxWidth: 500, width: '90%' }}>
        <h3 style={{ color: COLORS.text, marginTop: 0 }}>Create Inspection</h3>
        <form onSubmit={handleSubmit}>
          <textarea placeholder="Findings" value={findings} onChange={(e) => setFindings(e.target.value)} style={{ width: '100%', padding: '8px', marginBottom: 8, border: `1px solid ${COLORS.border}`, borderRadius: 4, minHeight: 80, boxSizing: 'border-box' }} disabled={loading} />
          <select value={status} onChange={(e) => setStatus(e.target.value)} style={{ width: '100%', padding: '8px', marginBottom: 8, border: `1px solid ${COLORS.border}`, borderRadius: 4, boxSizing: 'border-box' }} disabled={loading}>
            <option value="pending">Pending</option>
            <option value="passed">Passed</option>
            <option value="failed">Failed</option>
          </select>
          <div style={{ display: 'flex', gap: 8 }}>
            <button type="submit" disabled={loading} style={{ flex: 1, padding: '8px', background: '#9C27B0', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}>Create</button>
            <button type="button" onClick={onClose} disabled={loading} style={{ flex: 1, padding: '8px', background: '#f44336', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
