import React, { useState, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://gvsbbpuuoxluqaiovtvx.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd2c2JicHV1b3hsdXFhaW92dHZ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQyMjE3MzUsImV4cCI6MjA5OTc5NzczNX0.fIXxADQkEPSK2wYoI5rFdkr4X4P0gSI_wmr50XUajY0';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const COLORS = {
  primary: '#4A90E2',
  primaryLight: '#E3F0FF',
  primaryDark: '#2E5CB8',
  bg: '#E3F0FF',
  cardBg: '#FFFFFF',
  border: '#E8EEF5',
  text: '#2C3E50',
  textLight: '#7A8B99',
  textLighter: '#A8B3BC',
};

const CAR_MAKES = ['Toyota', 'Honda', 'Ford', 'Chevrolet', 'BMW', 'Mercedes-Benz', 'Audi', 'Volkswagen', 'Hyundai', 'Kia', 'Mazda', 'Subaru', 'Nissan', 'Jeep', 'RAM', 'GMC', 'Dodge', 'Chrysler', 'Tesla', 'Lexus', 'Infiniti', 'Acura', 'Cadillac', 'Buick', 'Lincoln', 'Porsche', 'Jaguar', 'Land Rover', 'Volvo'];

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [menuOpen, setMenuOpen] = useState(false);
  const [workOrders, setWorkOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [vehicles, setVehicles] = useState([]);

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
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
      console.error('Error loading data:', err);
    }
  };

  const menuItems = [
    { label: 'DASHBOARD', id: 'dashboard' },
    { label: 'CUSTOMERS & VEHICLES', id: 'customers' },
    { label: 'JOBS & INVOICES', id: 'jobs' },
    { label: 'HOURS', id: 'hours' },
    { label: 'PAYROLL', id: 'payroll' },
    { label: 'PENSION', id: 'pension' },
  ];

  if (activeTab === 'customers') {
    return <CustomersView customers={customers} vehicles={vehicles} workOrders={workOrders} loadAllData={loadAllData} />;
  }

  return (
    <div style={{ minHeight: '100vh', fontFamily: 'Inter, sans-serif', display: 'flex', flexDirection: 'column', background: COLORS.bg }}>
      <div style={{ padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: COLORS.primaryLight, borderBottom: `1px solid ${COLORS.border}` }}>
        <div style={{ position: 'relative' }}>
          <button onClick={() => setMenuOpen(!menuOpen)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, border: 'none', background: 'none', cursor: 'pointer', padding: 0 }}>
            <div style={{ display: 'flex', gap: 0 }}>
              <div style={{ fontSize: 22, fontWeight: 900, color: '#333' }}>AUTO</div>
              <div style={{ fontSize: 22, fontWeight: 900, color: '#E53935' }}>LAB</div>
            </div>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#666' }}>MENU</div>
          </button>
          {menuOpen && (
            <div style={{ position: 'absolute', top: 60, left: 0, minWidth: 220, background: '#F0F0F0', borderRadius: 4, boxShadow: '0 4px 12px rgba(0,0,0,0.1)', zIndex: 20, overflow: 'hidden' }}>
              {menuItems.map(item => (
                <button key={item.id} onClick={() => { setActiveTab(item.id); setMenuOpen(false); }} style={{ display: 'block', width: '100%', padding: '12px 16px', border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 600, textAlign: 'left', color: '#333', background: activeTab === item.id ? '#D0D0D0' : 'transparent' }}>
                  {item.label}
                </button>
              ))}
            </div>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: COLORS.text }}>Johnny</div>
            <button style={{ fontSize: 13, border: 'none', background: 'none', cursor: 'pointer', textDecoration: 'underline', color: COLORS.textLight }}>Sign out</button>
          </div>
          <div style={{ width: 36, height: 36, borderRadius: '50%', background: COLORS.primary, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>J</div>
        </div>
      </div>
      <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column', maxWidth: '1600px', margin: '0 auto', width: '100%' }}>
        <div style={{ textAlign: 'center', padding: 60, color: COLORS.textLight }}>
          <h2 style={{ color: COLORS.text, marginBottom: 16 }}>DASHBOARD</h2>
          <p>Welcome! Click "CUSTOMERS & VEHICLES" in the menu to get started.</p>
        </div>
      </div>
      {menuOpen && <div onClick={() => setMenuOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 10 }} />}
    </div>
  );
}

function CustomersView({ customers, vehicles, workOrders, loadAllData }) {
  const [showNewCustomerForm, setShowNewCustomerForm] = useState(false);
  const [selectedCustomerForVehicle, setSelectedCustomerForVehicle] = useState(null);
  const [selectedVehicleHistory, setSelectedVehicleHistory] = useState(null);
  const [selectedVehicleForWorkOrder, setSelectedVehicleForWorkOrder] = useState(null);
  const [selectedVehicleForEstimate, setSelectedVehicleForEstimate] = useState(null);
  const [selectedVehicleForInspection, setSelectedVehicleForInspection] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const getVehicleWorkOrders = (vehicleId) => {
    return workOrders.filter(wo => {
      const data = wo.data || {};
      return data.vehicle_id === vehicleId;
    });
  };

  const customerVehicleMap = {};
  customers.forEach(cust => {
    customerVehicleMap[cust.id] = vehicles.filter(v => v.customer_id === cust.id);
  });

  const filteredCustomers = customers.filter(cust => {
    const name = cust.data?.name || '';
    const phone = cust.data?.phone || '';
    const search = searchTerm.toLowerCase();
    if (name.toLowerCase().includes(search) || phone.includes(search)) return true;
    const custVehs = customerVehicleMap[cust.id] || [];
    return custVehs.some(v => {
      const make = v.data?.make || '';
      const model = v.data?.model || '';
      const plate = v.data?.license_plate || '';
      return make.toLowerCase().includes(search) || model.toLowerCase().includes(search) || plate.includes(search);
    });
  });

  return (
    <div style={{ minHeight: '100vh', fontFamily: 'Inter, sans-serif', display: 'flex', flexDirection: 'column', background: COLORS.bg }}>
      <div style={{ padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: COLORS.primaryLight, borderBottom: `1px solid ${COLORS.border}` }}>
        <button onClick={() => window.location.reload()} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, border: 'none', background: 'none', cursor: 'pointer', padding: 0 }}>
          <div style={{ display: 'flex', gap: 0 }}>
            <div style={{ fontSize: 22, fontWeight: 900, color: '#333' }}>AUTO</div>
            <div style={{ fontSize: 22, fontWeight: 900, color: '#E53935' }}>LAB</div>
          </div>
          <div style={{ fontSize: 15, fontWeight: 700, color: '#666' }}>MENU</div>
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: COLORS.text }}>Johnny</div>
            <button style={{ fontSize: 13, border: 'none', background: 'none', cursor: 'pointer', textDecoration: 'underline', color: COLORS.textLight }}>Sign out</button>
          </div>
          <div style={{ width: 36, height: 36, borderRadius: '50%', background: COLORS.primary, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>J</div>
        </div>
      </div>

      <div style={{ padding: '24px', flex: 1, maxWidth: '1600px', margin: '0 auto', width: '100%' }}>
        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ color: COLORS.text, margin: 0, fontSize: 20, fontWeight: 700 }}>Customers & Vehicles</h2>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <input type="text" placeholder="🔍 Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ padding: '8px 12px', borderRadius: 6, border: `1px solid ${COLORS.border}`, fontSize: 14, minWidth: 240, boxSizing: 'border-box' }} />
            <button onClick={() => setShowNewCustomerForm(!showNewCustomerForm)} style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '8px 12px', background: '#4CAF50', color: '#000', border: '1px solid #4CAF50', borderRadius: 6, cursor: 'pointer', fontWeight: 600 }}>
              <span>➕</span>
              <span>New Customer</span>
            </button>
          </div>
        </div>

        {showNewCustomerForm && <NewCustomerForm onSave={() => { loadAllData(); setShowNewCustomerForm(false); }} onCancel={() => setShowNewCustomerForm(false)} />}

        <div style={{ background: COLORS.cardBg, border: `1px solid ${COLORS.border}`, borderRadius: 8, overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: COLORS.primaryLight, borderBottom: `2px solid ${COLORS.border}` }}>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 14, fontWeight: 700, color: COLORS.text, minWidth: 200 }}>Name</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 14, fontWeight: 700, color: COLORS.text, minWidth: 140 }}>Phone</th>
                  <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: 14, fontWeight: 700, color: COLORS.text, minWidth: 120 }}>Brand</th>
                  <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: 14, fontWeight: 700, color: COLORS.text, minWidth: 140 }}>Model</th>
                  <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: 14, fontWeight: 700, color: COLORS.text, minWidth: 140 }}>Plate</th>
                  <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: 14, fontWeight: 700, color: COLORS.text, minWidth: 240 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ padding: 40, textAlign: 'center', color: COLORS.textLight }}>
                      {searchTerm ? 'No results found' : 'No customers yet'}
                    </td>
                  </tr>
                ) : (
                  filteredCustomers.map(customer => {
                    const custVehicles = customerVehicleMap[customer.id] || [];
                    return (
                      <React.Fragment key={customer.id}>
                        {custVehicles.length === 0 ? (
                          <tr style={{ borderBottom: `1px solid ${COLORS.border}` }}>
                            <td style={{ padding: '12px 16px', fontSize: 15, color: COLORS.text, fontWeight: 600 }}>{customer.data?.name}</td>
                            <td style={{ padding: '12px 16px', fontSize: 15, color: COLORS.text }}>{customer.data?.phone}</td>
                            <td style={{ padding: '12px 16px', fontSize: 15, color: COLORS.textLight, textAlign: 'center' }}>—</td>
                            <td style={{ padding: '12px 16px', fontSize: 15, color: COLORS.textLight, textAlign: 'center' }}>—</td>
                            <td style={{ padding: '12px 16px', fontSize: 15, color: COLORS.textLight, textAlign: 'center' }}>—</td>
                            <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                              <button onClick={() => setSelectedCustomerForVehicle(customer.id)} style={{ padding: '4px 8px', background: '#2196F3', color: '#000', border: '1px solid #2196F3', borderRadius: 4, cursor: 'pointer', fontSize: 11, fontWeight: 600 }}>➕</button>
                            </td>
                          </tr>
                        ) : (
                          custVehicles.map((vehicle, idx) => (
                            <tr key={vehicle.id} style={{ borderBottom: `1px solid ${COLORS.border}` }}>
                              <td style={{ padding: '12px 16px', fontSize: 15, color: COLORS.text }}>{idx === 0 ? customer.data?.name : ''}</td>
                              <td style={{ padding: '12px 16px', fontSize: 15, color: COLORS.text }}>{idx === 0 ? customer.data?.phone : ''}</td>
                              <td style={{ padding: '12px 16px', fontSize: 15, color: COLORS.text, textAlign: 'center' }}>{vehicle.data?.make}</td>
                              <td style={{ padding: '12px 16px', fontSize: 15, color: COLORS.text, textAlign: 'center' }}>{vehicle.data?.model}</td>
                              <td style={{ padding: '12px 16px', fontSize: 15, color: COLORS.primary, fontWeight: 600, textAlign: 'center' }}>{vehicle.data?.license_plate}</td>
                              <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                                <div style={{ display: 'flex', gap: 4, justifyContent: 'center', flexWrap: 'wrap' }}>
                                  <button onClick={() => setSelectedVehicleHistory(vehicle.id)} style={{ width: 32, height: 32, borderRadius: 4, border: 'none', background: '#4CAF50', cursor: 'pointer', fontSize: 16 }} title="View">👁️</button>
                                  <button onClick={() => setSelectedVehicleForWorkOrder(vehicle.id)} style={{ width: 32, height: 32, borderRadius: 4, border: 'none', background: '#FF9800', cursor: 'pointer', fontSize: 16 }} title="Work Order">🔧</button>
                                  <button onClick={() => setSelectedVehicleForEstimate(vehicle.id)} style={{ width: 32, height: 32, borderRadius: 4, border: 'none', background: '#2196F3', cursor: 'pointer', fontSize: 16 }} title="Estimate">🧮</button>
                                  <button onClick={() => setSelectedVehicleForInspection(vehicle.id)} style={{ width: 32, height: 32, borderRadius: 4, border: 'none', background: '#9C27B0', cursor: 'pointer', fontSize: 16 }} title="Inspection">📋</button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </React.Fragment>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {selectedCustomerForVehicle && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ background: COLORS.cardBg, borderRadius: 8, padding: 24, maxWidth: 500, width: '90%' }}>
            <h3 style={{ color: COLORS.text, marginBottom: 16, fontSize: 16, fontWeight: 700 }}>Add Vehicle</h3>
            <AddVehicleForm customerId={selectedCustomerForVehicle} onSave={() => { loadAllData(); setSelectedCustomerForVehicle(null); }} onCancel={() => setSelectedCustomerForVehicle(null)} />
          </div>
        </div>
      )}

      {selectedVehicleHistory && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ background: COLORS.cardBg, borderRadius: 8, padding: 24, maxWidth: 600, width: '90%' }}>
            <h3 style={{ color: COLORS.text, margin: 0, marginBottom: 16, fontSize: 16, fontWeight: 700 }}>Work Order History</h3>
            <VehicleWorkOrderHistory workOrders={getVehicleWorkOrders(selectedVehicleHistory)} />
            <button onClick={() => setSelectedVehicleHistory(null)} style={{ marginTop: 16, padding: '8px 16px', background: '#f44336', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer', fontWeight: 600 }}>Close</button>
          </div>
        </div>
      )}

      {selectedVehicleForWorkOrder && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ background: COLORS.cardBg, borderRadius: 8, padding: 24, maxWidth: 600, width: '90%' }}>
            <h3 style={{ color: COLORS.text, margin: 0, marginBottom: 16, fontSize: 16, fontWeight: 700 }}>Create Work Order</h3>
            <WorkOrderForm vehicleId={selectedVehicleForWorkOrder} customers={customers} vehicles={vehicles} onSave={() => { loadAllData(); setSelectedVehicleForWorkOrder(null); }} onCancel={() => setSelectedVehicleForWorkOrder(null)} />
          </div>
        </div>
      )}

      {selectedVehicleForEstimate && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ background: COLORS.cardBg, borderRadius: 8, padding: 24, maxWidth: 600, width: '90%' }}>
            <h3 style={{ color: COLORS.text, margin: 0, marginBottom: 16, fontSize: 16, fontWeight: 700 }}>Create Estimate</h3>
            <EstimateForm vehicleId={selectedVehicleForEstimate} customers={customers} vehicles={vehicles} onSave={() => { loadAllData(); setSelectedVehicleForEstimate(null); }} onCancel={() => setSelectedVehicleForEstimate(null)} />
          </div>
        </div>
      )}

      {selectedVehicleForInspection && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ background: COLORS.cardBg, borderRadius: 8, padding: 24, maxWidth: 600, width: '90%' }}>
            <h3 style={{ color: COLORS.text, margin: 0, marginBottom: 16, fontSize: 16, fontWeight: 700 }}>Create Inspection</h3>
            <InspectionForm vehicleId={selectedVehicleForInspection} customers={customers} vehicles={vehicles} onSave={() => { loadAllData(); setSelectedVehicleForInspection(null); }} onCancel={() => setSelectedVehicleForInspection(null)} />
          </div>
        </div>
      )}
    </div>
  );
}

function NewCustomerForm({ onSave, onCancel }) {
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', address: '' });
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;
    setLoading(true);
    try {
      await supabase.from('customers').insert([{ data: formData }]);
      alert('Customer added!');
      onSave();
    } catch (err) {
      alert('Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ padding: '16px 24px', marginBottom: 16, background: COLORS.primaryLight, border: `1px solid ${COLORS.border}`, borderRadius: 8 }}>
      <input placeholder="Full Name *" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} style={{ width: '100%', padding: '10px 12px', marginBottom: 10, border: `1px solid ${COLORS.border}`, borderRadius: 4, fontSize: 14, boxSizing: 'border-box' }} disabled={loading} />
      <input placeholder="Phone *" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} style={{ width: '100%', padding: '10px 12px', marginBottom: 10, border: `1px solid ${COLORS.border}`, borderRadius: 4, fontSize: 14, boxSizing: 'border-box' }} disabled={loading} />
      <input placeholder="Email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} style={{ width: '100%', padding: '10px 12px', marginBottom: 10, border: `1px solid ${COLORS.border}`, borderRadius: 4, fontSize: 14, boxSizing: 'border-box' }} disabled={loading} />
      <input placeholder="Address" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} style={{ width: '100%', padding: '10px 12px', marginBottom: 10, border: `1px solid ${COLORS.border}`, borderRadius: 4, fontSize: 14, boxSizing: 'border-box' }} disabled={loading} />
      <div style={{ display: 'flex', gap: 8 }}>
        <button type="submit" disabled={loading} style={{ flex: 1, padding: '10px 18px', background: '#4CAF50', color: '#000', border: '1px solid #4CAF50', borderRadius: 6, cursor: 'pointer', fontWeight: 600 }}>Save</button>
        <button type="button" onClick={onCancel} disabled={loading} style={{ flex: 1, padding: '10px 18px', background: '#f44336', color: '#fff', border: '1px solid #f44336', borderRadius: 6, cursor: 'pointer', fontWeight: 600 }}>Cancel</button>
      </div>
    </form>
  );
}

function AddVehicleForm({ customerId, onSave, onCancel }) {
  const [formData, setFormData] = useState({ year: new Date().getFullYear(), make: '', model: '', license_plate: '', vin: '' });
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!formData.make || !formData.model || !formData.license_plate) return;
    setLoading(true);
    try {
      await supabase.from('vehicles').insert([{ customer_id: customerId, data: formData }]);
      alert('Vehicle added!');
      onSave();
    } catch (err) {
      alert('Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
        <input type="number" placeholder="Year" value={formData.year} onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })} style={{ padding: '10px 12px', border: `1px solid ${COLORS.border}`, borderRadius: 4, fontSize: 14, boxSizing: 'border-box' }} disabled={loading} />
        <select value={formData.make} onChange={(e) => setFormData({ ...formData, make: e.target.value })} style={{ padding: '10px 12px', border: `1px solid ${COLORS.border}`, borderRadius: 4, fontSize: 14, boxSizing: 'border-box' }} disabled={loading}>
          <option value="">Select Make</option>
          {CAR_MAKES.map(make => <option key={make} value={make}>{make}</option>)}
        </select>
      </div>
      <input placeholder="Model *" value={formData.model} onChange={(e) => setFormData({ ...formData, model: e.target.value })} style={{ width: '100%', padding: '10px 12px', marginBottom: 10, border: `1px solid ${COLORS.border}`, borderRadius: 4, fontSize: 14, boxSizing: 'border-box' }} disabled={loading} />
      <input placeholder="License Plate *" value={formData.license_plate} onChange={(e) => setFormData({ ...formData, license_plate: e.target.value })} style={{ width: '100%', padding: '10px 12px', marginBottom: 10, border: `1px solid ${COLORS.border}`, borderRadius: 4, fontSize: 14, boxSizing: 'border-box' }} disabled={loading} />
      <div style={{ display: 'flex', gap: 8 }}>
        <button type="submit" disabled={loading} style={{ flex: 1, padding: '10px 18px', background: '#2196F3', color: '#000', border: '1px solid #2196F3', borderRadius: 6, cursor: 'pointer', fontWeight: 600 }}>Add Vehicle</button>
        <button type="button" onClick={onCancel} disabled={loading} style={{ flex: 1, padding: '10px 18px', background: '#f44336', color: '#fff', border: '1px solid #f44336', borderRadius: 6, cursor: 'pointer', fontWeight: 600 }}>Cancel</button>
      </div>
    </form>
  );
}

function VehicleWorkOrderHistory({ workOrders }) {
  if (!workOrders || workOrders.length === 0) {
    return <div style={{ textAlign: 'center', color: COLORS.textLight, padding: 32 }}>No work orders found</div>;
  }
  return (
    <div>
      {workOrders.map(wo => (
        <div key={wo.id} style={{ padding: 12, background: COLORS.primaryLight, borderRadius: 4, marginBottom: 8 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: COLORS.primary }}>WO #{wo.id}</div>
          <div style={{ fontSize: 12, color: COLORS.text, marginTop: 4 }}>{wo.data?.complaint}</div>
        </div>
      ))}
    </div>
  );
}

function WorkOrderForm({ vehicleId, customers, vehicles, onSave, onCancel }) {
  const [formData, setFormData] = useState({ complaint: '', notes: '', status: 'open' });
  const [loading, setLoading] = useState(false);
  const vehicle = vehicles.find(v => v.id === vehicleId);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!formData.complaint) return;
    setLoading(true);
    try {
      await supabase.from('work_orders').insert([{
        id: 'wo' + Date.now(),
        data: { ...formData, vehicle_id: vehicleId, customer_id: vehicle?.customer_id, opened_at: new Date().toISOString().split('T')[0] }
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
    <form onSubmit={handleSubmit}>
      <div style={{ marginBottom: 12, padding: 12, background: '#F5F5F5', borderRadius: 4 }}>
        <div style={{ fontSize: 12, color: COLORS.textLight, fontWeight: 600 }}>VEHICLE</div>
        <div style={{ fontSize: 14, color: COLORS.text, fontWeight: 600, marginTop: 4 }}>{vehicle?.data?.year} {vehicle?.data?.make} {vehicle?.data?.model}</div>
      </div>
      <textarea placeholder="Complaint *" value={formData.complaint} onChange={(e) => setFormData({ ...formData, complaint: e.target.value })} style={{ width: '100%', padding: '10px 12px', marginBottom: 10, border: `1px solid ${COLORS.border}`, borderRadius: 4, fontSize: 14, boxSizing: 'border-box', minHeight: 80 }} disabled={loading} />
      <textarea placeholder="Notes" value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} style={{ width: '100%', padding: '10px 12px', marginBottom: 10, border: `1px solid ${COLORS.border}`, borderRadius: 4, fontSize: 14, boxSizing: 'border-box', minHeight: 60 }} disabled={loading} />
      <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} style={{ width: '100%', padding: '10px 12px', marginBottom: 10, border: `1px solid ${COLORS.border}`, borderRadius: 4, fontSize: 14, boxSizing: 'border-box' }} disabled={loading}>
        <option value="open">Open</option>
        <option value="in_progress">In Progress</option>
        <option value="waiting_parts">Waiting Parts</option>
        <option value="completed">Completed</option>
      </select>
      <div style={{ display: 'flex', gap: 8 }}>
        <button type="submit" disabled={loading} style={{ flex: 1, padding: '10px 18px', background: '#FF9800', color: '#000', border: '1px solid #FF9800', borderRadius: 6, cursor: 'pointer', fontWeight: 600 }}>Create</button>
        <button type="button" onClick={onCancel} disabled={loading} style={{ flex: 1, padding: '10px 18px', background: '#f44336', color: '#fff', border: '1px solid #f44336', borderRadius: 6, cursor: 'pointer', fontWeight: 600 }}>Cancel</button>
      </div>
    </form>
  );
}

function EstimateForm({ vehicleId, customers, vehicles, onSave, onCancel }) {
  const [formData, setFormData] = useState({ description: '', parts: '', labor: '', notes: '' });
  const [loading, setLoading] = useState(false);
  const vehicle = vehicles.find(v => v.id === vehicleId);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!formData.description) return;
    setLoading(true);
    try {
      await supabase.from('work_orders').insert([{
        id: 'est' + Date.now(),
        data: { type: 'estimate', ...formData, vehicle_id: vehicleId, customer_id: vehicle?.customer_id, created_at: new Date().toISOString().split('T')[0] }
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
    <form onSubmit={handleSubmit}>
      <textarea placeholder="Description *" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} style={{ width: '100%', padding: '10px 12px', marginBottom: 10, border: `1px solid ${COLORS.border}`, borderRadius: 4, fontSize: 14, boxSizing: 'border-box', minHeight: 80 }} disabled={loading} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 10 }}>
        <input type="number" placeholder="Parts Cost (CI$)" value={formData.parts} onChange={(e) => setFormData({ ...formData, parts: e.target.value })} style={{ padding: '10px 12px', border: `1px solid ${COLORS.border}`, borderRadius: 4, fontSize: 14, boxSizing: 'border-box' }} disabled={loading} />
        <input type="number" placeholder="Labor Cost (CI$)" value={formData.labor} onChange={(e) => setFormData({ ...formData, labor: e.target.value })} style={{ padding: '10px 12px', border: `1px solid ${COLORS.border}`, borderRadius: 4, fontSize: 14, boxSizing: 'border-box' }} disabled={loading} />
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <button type="submit" disabled={loading} style={{ flex: 1, padding: '10px 18px', background: '#2196F3', color: '#000', border: '1px solid #2196F3', borderRadius: 6, cursor: 'pointer', fontWeight: 600 }}>Create</button>
        <button type="button" onClick={onCancel} disabled={loading} style={{ flex: 1, padding: '10px 18px', background: '#f44336', color: '#fff', border: '1px solid #f44336', borderRadius: 6, cursor: 'pointer', fontWeight: 600 }}>Cancel</button>
      </div>
    </form>
  );
}

function InspectionForm({ vehicleId, customers, vehicles, onSave, onCancel }) {
  const [formData, setFormData] = useState({ findings: '', recommendations: '', status: 'pending' });
  const [loading, setLoading] = useState(false);
  const vehicle = vehicles.find(v => v.id === vehicleId);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!formData.findings) return;
    setLoading(true);
    try {
      await supabase.from('work_orders').insert([{
        id: 'insp' + Date.now(),
        data: { type: 'inspection', ...formData, vehicle_id: vehicleId, customer_id: vehicle?.customer_id, created_at: new Date().toISOString().split('T')[0] }
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
    <form onSubmit={handleSubmit}>
      <textarea placeholder="Findings *" value={formData.findings} onChange={(e) => setFormData({ ...formData, findings: e.target.value })} style={{ width: '100%', padding: '10px 12px', marginBottom: 10, border: `1px solid ${COLORS.border}`, borderRadius: 4, fontSize: 14, boxSizing: 'border-box', minHeight: 80 }} disabled={loading} />
      <textarea placeholder="Recommendations" value={formData.recommendations} onChange={(e) => setFormData({ ...formData, recommendations: e.target.value })} style={{ width: '100%', padding: '10px 12px', marginBottom: 10, border: `1px solid ${COLORS.border}`, borderRadius: 4, fontSize: 14, boxSizing: 'border-box', minHeight: 60 }} disabled={loading} />
      <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} style={{ width: '100%', padding: '10px 12px', marginBottom: 10, border: `1px solid ${COLORS.border}`, borderRadius: 4, fontSize: 14, boxSizing: 'border-box' }} disabled={loading}>
        <option value="pending">Pending</option>
        <option value="passed">Passed</option>
        <option value="failed">Failed</option>
        <option value="requires_repair">Requires Repair</option>
      </select>
      <div style={{ display: 'flex', gap: 8 }}>
        <button type="submit" disabled={loading} style={{ flex: 1, padding: '10px 18px', background: '#9C27B0', color: '#fff', border: '1px solid #9C27B0', borderRadius: 6, cursor: 'pointer', fontWeight: 600 }}>Create</button>
        <button type="button" onClick={onCancel} disabled={loading} style={{ flex: 1, padding: '10px 18px', background: '#f44336', color: '#fff', border: '1px solid #f44336', borderRadius: 6, cursor: 'pointer', fontWeight: 600 }}>Cancel</button>
      </div>
    </form>
  );
}
