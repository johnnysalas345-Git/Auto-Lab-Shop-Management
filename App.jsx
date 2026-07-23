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

const TECH_COLORS = {
  tech1: '#8B6FA3',
  tech2: '#8B8B8B',
  tech3: '#6BA388',
  tech4: '#B87C7C',
};

function getStatusStyle(status) {
  const statusColors = {
    open: { background: '#DFE9F8', color: '#4A90E2', fontWeight: '600' },
    in_progress: { background: '#F5E8D9', color: '#C08A3C', fontWeight: '600' },
    waiting_parts: { background: '#F5E8D9', color: '#C08A3C', fontWeight: '600' },
    estimate: { background: '#E8E3F2', color: '#7B68A6', fontWeight: '600' },
    pending_pay: { background: '#FCE3E3', color: '#B87C7C', fontWeight: '600' },
    partial: { background: '#F5E8D9', color: '#C08A3C', fontWeight: '600' },
    completed: { background: '#DFE9D9', color: '#6BA388', fontWeight: '600' },
    paid: { background: '#DFE9D9', color: '#6BA388', fontWeight: '600' },
  };
  return statusColors[status] || { background: '#F3F5F8', color: COLORS.textLight, fontWeight: '600' };
}

export default function GarageDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [activeFilter, setActiveFilter] = useState('all');
  const [menuOpen, setMenuOpen] = useState(false);
  const [workOrders, setWorkOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const isAdmin = true;

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [wo, cust, veh] = await Promise.all([
        supabase.from('work_orders').select('*'),
        supabase.from('customers').select('*'),
        supabase.from('vehicles').select('*'),
      ]);
      setWorkOrders(wo.data || []);
      setCustomers(cust.data || []);
      setVehicles(veh.data || []);
    } catch (err) {
      console.error('Error:', err);
    }
  }

  const groupJobsByTech = () => {
    const today = new Date().toISOString().split('T')[0];
    const todayJobs = workOrders.filter(wo => {
      const woData = wo.data || wo;
      return woData.opened_at === today;
    });

    const grouped = { unassigned: [], tech1: [], tech2: [], tech3: [], tech4: [] };

    todayJobs.forEach(wo => {
      const woData = wo.data || wo;
      const techId = woData.labor ? Object.values(woData.labor)[0]?.technician_id : null;
      if (techId && grouped[techId]) {
        grouped[techId].push(wo);
      } else {
        grouped.unassigned.push(wo);
      }
    });

    return grouped;
  };

  const getActiveWorkOrders = () => {
    let filtered = workOrders;
    if (activeFilter === 'all') {
      filtered = workOrders.filter(wo => {
        const woData = wo.data || wo;
        return woData.status !== 'paid';
      });
    } else if (activeFilter === 'pending_pay') {
      filtered = workOrders.filter(wo => {
        const woData = wo.data || wo;
        return ['pending_pay', 'partial'].includes(woData.status);
      });
    } else if (activeFilter === 'contacted') {
      filtered = workOrders.filter(wo => {
        const woData = wo.data || wo;
        return woData.status === 'contacted';
      });
    } else {
      filtered = workOrders.filter(wo => {
        const woData = wo.data || wo;
        return woData.status === activeFilter;
      });
    }
    return filtered;
  };

  const getJobInfo = (wo) => {
    const woData = wo.data || wo;
    const cust = customers.find(c => c.id === woData.customer_id);
    const veh = vehicles.find(v => v.id === woData.vehicle_id);
    return { woData, cust, veh };
  };

  const menuItems = [
    { label: 'DASHBOARD', id: 'dashboard' },
    { label: 'JOBS & INVOICES', id: 'jobs' },
    { label: 'HOURS', id: 'hours' },
    { label: 'PAYROLL', id: 'payroll' },
    { label: 'PENSION', id: 'pension' },
    { label: 'IMPORT', id: 'import' },
    { label: 'SETTINGS', id: 'settings' },
    { label: 'FINANCE', id: 'finance' },
  ];

  if (activeTab === 'customers') {
    return <CustomersView />;
  }

  if (activeTab === 'dashboard') {
    const jobsByTech = groupJobsByTech();
    const activeWOs = getActiveWorkOrders();

    return (
      <div style={{ ...styles.app, background: COLORS.bg }}>
        <div style={{ ...styles.header, background: COLORS.primaryLight, borderColor: COLORS.border }}>
          <div style={styles.menuSection}>
            <button 
              onClick={() => setMenuOpen(!menuOpen)}
              style={styles.menuButton}
              title="Open Menu"
            >
              <div style={styles.autoLabLogo}>
                <div style={styles.logoText}>AUTO</div>
                <div style={{ ...styles.logoText, color: '#E53935' }}>LAB</div>
              </div>
              <div style={styles.menuLabel}>MENU</div>
            </button>

            {menuOpen && (
              <div style={{ ...styles.dropdownMenu, background: '#F0F0F0' }}>
                {menuItems.map(item => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setMenuOpen(false);
                    }}
                    style={{
                      ...styles.menuItemStyle,
                      background: activeTab === item.id ? '#D0D0D0' : 'transparent',
                    }}
                    onMouseEnter={(e) => e.target.style.background = '#D0D0D0'}
                    onMouseLeave={(e) => e.target.style.background = activeTab === item.id ? '#D0D0D0' : 'transparent'}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div style={styles.rightSection}>
            <div style={{ ...styles.userSection, boxSizing: 'border-box' }}>
              <div style={{ textAlign: 'right', border: 'none', outline: 'none', boxSizing: 'border-box' }}>
                <div style={{ ...styles.userName, color: COLORS.text }}>Johnny</div>
                <button style={{ ...styles.signOutBtn, color: COLORS.textLight }}>Sign out</button>
              </div>
              <div style={{ ...styles.avatar, boxSizing: 'border-box' }}>J</div>
            </div>
          </div>
        </div>

        <div style={{ ...styles.actionsBar, background: COLORS.primaryLight }}>
          <div style={styles.actionBarContent}>
            <div style={styles.actionButtonsContainer}>
              <button 
                onClick={() => setActiveTab('customers')}
                style={{ ...styles.actionBtn, background: '#F2A900' }}
                onMouseEnter={(e) => { e.currentTarget.style.background = '#FFD84D'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = '#F2A900'; }}
              >
                <span style={{ fontSize: 18, fontWeight: 'bold' }}>👥</span>
                <span>Customers & Vehicles</span>
              </button>
              <button 
                style={{ ...styles.actionBtn, background: '#F2A900' }}
                onMouseEnter={(e) => { e.currentTarget.style.background = '#FFD84D'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = '#F2A900'; }}
              >
                <span style={{ fontSize: 18, fontWeight: 'bold' }}>⚙️</span>
                <span>Work Orders</span>
              </button>
              <button 
                style={{ ...styles.actionBtn, background: '#F2A900' }}
                onMouseEnter={(e) => { e.currentTarget.style.background = '#FFD84D'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = '#F2A900'; }}
              >
                <span style={{ fontSize: 18, fontWeight: 'bold' }}>📋</span>
                <span>Estimates</span>
              </button>
              <button 
                style={{ ...styles.actionBtn, background: '#F2A900' }}
                onMouseEnter={(e) => { e.currentTarget.style.background = '#FFD84D'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = '#F2A900'; }}
              >
                <span style={{ fontSize: 18, fontWeight: 'bold' }}>⏰</span>
                <span>Hours</span>
              </button>
              <button 
                style={{ ...styles.actionBtn, background: '#F2A900' }}
                onMouseEnter={(e) => { e.currentTarget.style.background = '#FFD84D'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = '#F2A900'; }}
              >
                <span style={{ fontSize: 18, fontWeight: 'bold' }}>💰</span>
                <span>Expenses</span>
              </button>
            </div>
            <div style={styles.cashOnHandDisplay}>
              <div style={{ ...styles.cashLabel }}>ON HAND</div>
              <div style={{ ...styles.cashAmount }}>CI$5,240.50</div>
            </div>
          </div>
        </div>

        <div style={{ ...styles.body, background: COLORS.bg }}>
          <div style={styles.mainContainer}>
            <div style={{ ...styles.leftSection, background: COLORS.cardBg, borderColor: COLORS.border }}>
              <div style={{ ...styles.sectionHeader, borderColor: COLORS.border }}>
                <h2 style={{ ...styles.sectionTitle, color: COLORS.text }}>Todays Workflow</h2>
                <button style={{ ...styles.calendarBtn, background: COLORS.primaryLight, color: COLORS.primary }}>📅 Calendar</button>
              </div>

              <div style={styles.scrollableContent}>
                <TechSchedule techName="Technician 1" jobs={jobsByTech.tech1} color={TECH_COLORS.tech1} vehicles={vehicles} />
                <TechSchedule techName="Technician 2" jobs={jobsByTech.tech2} color={TECH_COLORS.tech2} vehicles={vehicles} />
                <TechSchedule techName="Technician 3" jobs={jobsByTech.tech3} color={TECH_COLORS.tech3} vehicles={vehicles} />
                <TechSchedule techName="Technician 4" jobs={jobsByTech.tech4} color={TECH_COLORS.tech4} vehicles={vehicles} />
                <TechSchedule techName="Unassigned" jobs={jobsByTech.unassigned} color={COLORS.textLighter} vehicles={vehicles} />
              </div>
            </div>

            <div style={{ ...styles.rightSection, background: COLORS.cardBg, borderColor: COLORS.border }}>
              <div style={{ ...styles.sectionHeader, borderColor: COLORS.border }}>
                <h2 style={{ ...styles.sectionTitle, color: COLORS.text }}>Job Status</h2>
              </div>

              <div style={{ ...styles.filterTabs, borderColor: COLORS.border }}>
                {[
                  { label: 'All', id: 'all' },
                  { label: 'In Progress', id: 'in_progress' },
                  { label: 'Waiting Parts', id: 'waiting_parts' },
                  { label: 'Contacted', id: 'contacted' },
                  { label: 'Pending to Pay', id: 'pending_pay' },
                  { label: 'Completed', id: 'completed' },
                ].map(tab => (
                  <button
                    key={tab.id}
                    style={{
                      ...styles.filterTab,
                      background: activeFilter === tab.id ? COLORS.primary : 'transparent',
                      color: activeFilter === tab.id ? 'white' : COLORS.text,
                      borderColor: activeFilter === tab.id ? COLORS.primary : COLORS.border,
                      whiteSpace: 'nowrap',
                    }}
                    onClick={() => setActiveFilter(tab.id)}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div style={styles.scrollableContent}>
                {activeWOs.length === 0 ? (
                  <div style={{ ...styles.emptyState, color: COLORS.textLight }}>No active work orders</div>
                ) : (
                  activeWOs.map(wo => {
                    const { woData, cust, veh } = getJobInfo(wo);
                    return (
                      <div key={wo.id} style={{ ...styles.woCard, background: COLORS.primaryLight, borderColor: COLORS.border }}>
                        <div style={styles.woContent}>
                          <div style={{ ...styles.woNumber, color: COLORS.primary }}>WO #{wo.id.replace('wo', '')}</div>
                          <div style={{ ...styles.woCustomer, color: COLORS.text }}>{cust?.data?.name}</div>
                          <div style={{ ...styles.woVehicle, color: COLORS.textLight }}>
                            {veh?.data?.year} {veh?.data?.make} {veh?.data?.model}
                          </div>
                          <div style={{...styles.woStatus, ...getStatusStyle(woData.status)}}>
                            {woData.status.replace('_', ' ').toUpperCase()}
                          </div>
                        </div>
                        <ChevronRight size={20} color={COLORS.textLight} />
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginTop: 24 }}>
            <div style={{ ...styles.section, background: COLORS.cardBg, borderColor: COLORS.border, minHeight: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ textAlign: 'center', color: COLORS.textLight }}>
                <div style={{ fontSize: 16, fontWeight: '600' }}>Section C</div>
                <div style={{ fontSize: 12, marginTop: 4 }}>Coming soon...</div>
              </div>
            </div>
            <div style={{ ...styles.section, background: COLORS.cardBg, borderColor: COLORS.border, minHeight: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ textAlign: 'center', color: COLORS.textLight }}>
                <div style={{ fontSize: 16, fontWeight: '600' }}>Section D</div>
                <div style={{ fontSize: 12, marginTop: 4 }}>Coming soon...</div>
              </div>
            </div>
          </div>
        </div>

        {menuOpen && (
          <div 
            onClick={() => setMenuOpen(false)}
            style={{ position: 'fixed', inset: 0, zIndex: 10 }}
          />
        )}
      </div>
    );
  }

  return (
    <div style={{ ...styles.app, background: COLORS.bg }}>
      <div style={{ ...styles.header, background: COLORS.primaryLight, borderColor: COLORS.border }}>
        <div style={styles.menuSection}>
          <button 
            onClick={() => setMenuOpen(!menuOpen)}
            style={styles.menuButton}
          >
            <div style={styles.autoLabLogo}>
              <div style={styles.logoText}>AUTO</div>
              <div style={{ ...styles.logoText, color: '#E53935' }}>LAB</div>
            </div>
            <div style={styles.menuLabel}>MENU</div>
          </button>

          {menuOpen && (
            <div style={{ ...styles.dropdownMenu, background: '#F0F0F0' }}>
              {menuItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMenuOpen(false);
                  }}
                  style={{
                    ...styles.menuItemStyle,
                    background: activeTab === item.id ? '#D0D0D0' : 'transparent',
                  }}
                  onMouseEnter={(e) => e.target.style.background = '#D0D0D0'}
                  onMouseLeave={(e) => e.target.style.background = activeTab === item.id ? '#D0D0D0' : 'transparent'}
                >
                  {item.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <div style={styles.rightSection}>
          <div style={{ ...styles.userSection, boxSizing: 'border-box' }}>
            <div style={{ textAlign: 'right', border: 'none', outline: 'none', boxSizing: 'border-box' }}>
              <div style={{ ...styles.userName, color: COLORS.text }}>Johnny</div>
              <button style={{ ...styles.signOutBtn, color: COLORS.textLight }}>Sign out</button>
            </div>
            <div style={{ ...styles.avatar, boxSizing: 'border-box' }}>J</div>
          </div>
        </div>
      </div>
      <div style={{ ...styles.body, background: COLORS.bg }}>
        <div style={{ textAlign: 'center', padding: 60, color: COLORS.textLight }}>
          <h2 style={{ color: COLORS.text }}>{activeTab.toUpperCase()} Section</h2>
          <p>Coming soon...</p>
        </div>
      </div>
      {menuOpen && (
        <div 
          onClick={() => setMenuOpen(false)}
          style={{ position: 'fixed', inset: 0, zIndex: 10 }}
        />
      )}
    </div>
  );
}

function CustomersView() {
  const [customers, setCustomers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [workOrders, setWorkOrders] = useState([]);
  const [showNewCustomerForm, setShowNewCustomerForm] = useState(false);
  const [showAddVehicleForm, setShowAddVehicleForm] = useState(false);
  const [selectedCustomerForVehicle, setSelectedCustomerForVehicle] = useState(null);
  const [selectedVehicleHistory, setSelectedVehicleHistory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadAllData();
  }, []);

  async function loadAllData() {
    try {
      const [custRes, vehRes, woRes] = await Promise.all([
        supabase.from('customers').select('*'),
        supabase.from('vehicles').select('*'),
        supabase.from('work_orders').select('*'),
      ]);
      console.log('Customers:', custRes.data);
      console.log('Vehicles:', vehRes.data);
      setCustomers(custRes.data || []);
      setVehicles(vehRes.data || []);
      setWorkOrders(woRes.data || []);
    } catch (err) {
      console.error('Error loading data:', err);
    }
  }

  const getVehicleWorkOrders = (vehicleId) => {
    return workOrders.filter(wo => {
      const woData = wo.data || wo;
      return woData.vehicle_id === vehicleId;
    });
  };

  const customerVehicleMap = {};
  customers.forEach(cust => {
    customerVehicleMap[cust.id] = vehicles.filter(v => v.customer_id === cust.id);
  });

  const filteredCustomers = customers.filter(cust => {
    const custName = cust.data?.name || '';
    const custPhone = cust.data?.phone || '';
    const search = searchTerm.toLowerCase();
    
    if (custName.toLowerCase().includes(search) || custPhone.includes(search)) {
      return true;
    }
    
    const custVehicles = customerVehicleMap[cust.id] || [];
    return custVehicles.some(v => {
      const make = v.data?.make || '';
      const model = v.data?.model || '';
      const plate = v.data?.license_plate || '';
      return make.toLowerCase().includes(search) || model.toLowerCase().includes(search) || plate.includes(search);
    });
  });

  return (
    <div style={{ ...styles.app, background: COLORS.bg }}>
      <div style={{ ...styles.header, background: COLORS.primaryLight, borderColor: COLORS.border }}>
        <div style={styles.menuSection}>
          <button 
            onClick={() => window.location.reload()}
            style={styles.menuButton}
          >
            <div style={styles.autoLabLogo}>
              <div style={styles.logoText}>AUTO</div>
              <div style={{ ...styles.logoText, color: '#E53935' }}>LAB</div>
            </div>
            <div style={styles.menuLabel}>MENU</div>
          </button>
        </div>
        <div style={styles.rightSection}>
          <div style={{ ...styles.userSection, boxSizing: 'border-box' }}>
            <div style={{ textAlign: 'right', border: 'none', outline: 'none', boxSizing: 'border-box' }}>
              <div style={{ ...styles.userName, color: COLORS.text }}>Johnny</div>
              <button style={{ ...styles.signOutBtn, color: COLORS.textLight }}>Sign out</button>
            </div>
            <div style={{ ...styles.avatar, boxSizing: 'border-box' }}>J</div>
          </div>
        </div>
      </div>

      <div style={{ ...styles.body, background: COLORS.bg }}>
        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ color: COLORS.text, margin: 0, fontSize: 20, fontWeight: '700' }}>Customers & Vehicles</h2>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <input
              type="text"
              placeholder="🔍 Search by name, phone, vehicle..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ 
                padding: '8px 12px', 
                borderRadius: 6, 
                border: '1px solid', 
                borderColor: COLORS.border, 
                fontSize: 12,
                minWidth: 240,
                boxSizing: 'border-box'
              }}
            />
            <button 
              onClick={() => setShowNewCustomerForm(!showNewCustomerForm)}
              style={{ ...styles.actionBtn, background: '#4CAF50', border: '1px solid #4CAF50', gap: 4, padding: '8px 12px', fontSize: 12 }}
              onMouseEnter={(e) => { e.currentTarget.style.background = '#45a049'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = '#4CAF50'; }}
            >
              <span>➕</span>
              <span>New Customer</span>
            </button>
          </div>
        </div>

        {showNewCustomerForm && (
          <NewCustomerForm 
            onSave={() => { loadAllData(); setShowNewCustomerForm(false); }}
            onCancel={() => setShowNewCustomerForm(false)}
          />
        )}

        <div style={{ ...styles.section, background: COLORS.cardBg, borderColor: COLORS.border, border: '1px solid', borderRadius: 8, overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: COLORS.primaryLight, borderBottom: '2px solid', borderColor: COLORS.border }}>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: '700', color: COLORS.text, minWidth: 200 }}>Name</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: '700', color: COLORS.text, minWidth: 140 }}>Phone</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: '700', color: COLORS.text, minWidth: 120 }}>Brand</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: '700', color: COLORS.text, minWidth: 140 }}>Model</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: '700', color: COLORS.text, minWidth: 140 }}>License Plate</th>
                  <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: 12, fontWeight: '700', color: COLORS.text, minWidth: 80 }}>Work Orders</th>
                  <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: 12, fontWeight: '700', color: COLORS.text, minWidth: 100 }}>Add Vehicle</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.length === 0 ? (
                  <tr>
                    <td colSpan="7" style={{ padding: 40, textAlign: 'center', color: COLORS.textLight }}>
                      {searchTerm ? 'No results found' : 'No customers yet'}
                    </td>
                  </tr>
                ) : (
                  filteredCustomers.map(customer => {
                    const custVehicles = customerVehicleMap[customer.id] || [];
                    return (
                      <React.Fragment key={customer.id}>
                        {custVehicles.length === 0 ? (
                          <tr style={{ borderBottom: '1px solid', borderColor: COLORS.border, background: 'transparent' }}>
                            <td style={{ padding: '12px 16px', fontSize: 13, color: COLORS.text, fontWeight: '600' }}>{customer.data?.name}</td>
                            <td style={{ padding: '12px 16px', fontSize: 13, color: COLORS.text }}>{customer.data?.phone}</td>
                            <td style={{ padding: '12px 16px', fontSize: 13, color: COLORS.textLight }}>—</td>
                            <td style={{ padding: '12px 16px', fontSize: 13, color: COLORS.textLight }}>—</td>
                            <td style={{ padding: '12px 16px', fontSize: 13, color: COLORS.textLight }}>—</td>
                            <td style={{ padding: '12px 16px', textAlign: 'center' }}>—</td>
                            <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                              <button 
                                onClick={() => setSelectedCustomerForVehicle(customer.id)}
                                style={{ ...styles.actionBtn, background: '#2196F3', border: '1px solid #2196F3', gap: 4, padding: '4px 8px', fontSize: 11 }}
                                onMouseEnter={(e) => { e.currentTarget.style.background = '#0b7dda'; }}
                                onMouseLeave={(e) => { e.currentTarget.style.background = '#2196F3'; }}
                              >
                                <span>➕</span>
                              </button>
                            </td>
                          </tr>
                        ) : (
                          custVehicles.map((vehicle, idx) => (
                            <tr key={vehicle.id} style={{ borderBottom: '1px solid', borderColor: COLORS.border, background: idx % 2 === 0 ? 'transparent' : COLORS.primaryLight }}>
                              <td style={{ padding: '12px 16px', fontSize: 13, color: COLORS.text, fontWeight: idx === 0 ? '600' : 'normal' }}>
                                {idx === 0 ? customer.data?.name : ''}
                              </td>
                              <td style={{ padding: '12px 16px', fontSize: 13, color: COLORS.text }}>
                                {idx === 0 ? customer.data?.phone : ''}
                              </td>
                              <td style={{ padding: '12px 16px', fontSize: 13, color: COLORS.text }}>{vehicle.data?.make}</td>
                              <td style={{ padding: '12px 16px', fontSize: 13, color: COLORS.text }}>{vehicle.data?.model}</td>
                              <td style={{ padding: '12px 16px', fontSize: 13, color: COLORS.primary, fontWeight: '600' }}>{vehicle.data?.license_plate}</td>
                              <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                                <button 
                                  onClick={() => setSelectedVehicleHistory(vehicle.id)}
                                  style={{ ...styles.actionBtn, background: '#FF9800', border: '1px solid #FF9800', gap: 4, padding: '4px 8px', fontSize: 11 }}
                                  onMouseEnter={(e) => { e.currentTarget.style.background = '#e68900'; }}
                                  onMouseLeave={(e) => { e.currentTarget.style.background = '#FF9800'; }}
                                >
                                  <span>🔧</span>
                                </button>
                              </td>
                              <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                                {idx === 0 && (
                                  <button 
                                    onClick={() => setSelectedCustomerForVehicle(customer.id)}
                                    style={{ ...styles.actionBtn, background: '#2196F3', border: '1px solid #2196F3', gap: 4, padding: '4px 8px', fontSize: 11 }}
                                    onMouseEnter={(e) => { e.currentTarget.style.background = '#0b7dda'; }}
                                    onMouseLeave={(e) => { e.currentTarget.style.background = '#2196F3'; }}
                                  >
                                    <span>➕</span>
                                  </button>
                                )}
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
          <div style={{ background: COLORS.cardBg, borderRadius: 8, padding: 24, maxWidth: 500, width: '90%', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 10px 40px rgba(0,0,0,0.2)' }}>
            <h3 style={{ color: COLORS.text, marginBottom: 16, fontSize: 16, fontWeight: '700' }}>Add Vehicle to Customer</h3>
            <AddVehicleForm 
              customerId={selectedCustomerForVehicle}
              onSave={() => { loadAllData(); setSelectedCustomerForVehicle(null); }}
              onCancel={() => setSelectedCustomerForVehicle(null)}
            />
          </div>
        </div>
      )}

      {selectedVehicleHistory && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ background: COLORS.cardBg, borderRadius: 8, padding: 24, maxWidth: 600, width: '90%', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 10px 40px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ color: COLORS.text, margin: 0, fontSize: 16, fontWeight: '700' }}>Work Order History</h3>
              <button 
                onClick={() => setSelectedVehicleHistory(null)}
                style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: COLORS.text }}
              >
                ✕
              </button>
            </div>
            <VehicleWorkOrderHistory vehicleId={selectedVehicleHistory} workOrders={getVehicleWorkOrders(selectedVehicleHistory)} />
          </div>
        </div>
      )}
    </div>
  );
}

function NewCustomerForm({ onSave, onCancel }) {
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', address: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    
    if (!formData.name || !formData.phone) {
      setError('Name and phone are required');
      return;
    }
    
    setLoading(true);
    try {
      console.log('Inserting customer:', formData);
      const { data, error: insertError } = await supabase.from('customers').insert([
        { data: formData }
      ]).select();
      
      console.log('Insert response:', { data, insertError });
      
      if (insertError) {
        throw new Error(insertError.message || 'Failed to insert customer');
      }
      
      alert('Customer added successfully!');
      onSave();
    } catch (err) {
      console.error('Error adding customer:', err);
      setError(err.message || 'Error adding customer');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ padding: '16px 24px', borderBottom: '1px solid', borderColor: COLORS.border, background: COLORS.primaryLight }}>
      {error && (
        <div style={{ padding: '8px 12px', marginBottom: 12, background: '#FCE3E3', color: '#B87C7C', borderRadius: 4, fontSize: 12, fontWeight: '600' }}>
          ⚠️ {error}
        </div>
      )}
      <input
        placeholder="Full Name *"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        style={styles.formInput}
        disabled={loading}
      />
      <input
        placeholder="Phone *"
        value={formData.phone}
        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        style={styles.formInput}
        disabled={loading}
      />
      <input
        placeholder="Email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        style={styles.formInput}
        disabled={loading}
      />
      <input
        placeholder="Address"
        value={formData.address}
        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
        style={styles.formInput}
        disabled={loading}
      />
      <div style={{ display: 'flex', gap: 8 }}>
        <button type="submit" disabled={loading} style={{ ...styles.actionBtn, background: '#4CAF50', border: '1px solid #4CAF50', flex: 1, justifyContent: 'center', opacity: loading ? 0.6 : 1 }}>
          {loading ? 'Saving...' : 'Save Customer'}
        </button>
        <button type="button" onClick={onCancel} disabled={loading} style={{ ...styles.actionBtn, background: '#f44336', border: '1px solid #f44336', flex: 1, justifyContent: 'center', opacity: loading ? 0.6 : 1 }}>
          Cancel
        </button>
      </div>
    </form>
  );
}

function AddVehicleForm({ customerId, onSave, onCancel }) {
  const [formData, setFormData] = useState({ year: new Date().getFullYear(), make: '', model: '', license_plate: '', vin: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    
    if (!formData.make || !formData.model || !formData.license_plate) {
      setError('Make, model, and license plate are required');
      return;
    }
    
    setLoading(true);
    try {
      console.log('Inserting vehicle:', { customer_id: customerId, data: formData });
      const { data, error: insertError } = await supabase.from('vehicles').insert([
        { customer_id: customerId, data: formData }
      ]).select();
      
      console.log('Insert response:', { data, insertError });
      
      if (insertError) {
        throw new Error(insertError.message || 'Failed to insert vehicle');
      }
      
      alert('Vehicle added successfully!');
      onSave();
    } catch (err) {
      console.error('Error adding vehicle:', err);
      setError(err.message || 'Error adding vehicle');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ padding: '16px', marginBottom: 16, background: COLORS.primaryLight, borderRadius: 8, border: '1px solid', borderColor: COLORS.border }}>
      {error && (
        <div style={{ padding: '8px 12px', marginBottom: 12, background: '#FCE3E3', color: '#B87C7C', borderRadius: 4, fontSize: 12, fontWeight: '600' }}>
          ⚠️ {error}
        </div>
      )}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
        <input
          type="number"
          placeholder="Year"
          value={formData.year}
          onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
          style={styles.formInput}
          disabled={loading}
        />
        <input
          placeholder="Make *"
          value={formData.make}
          onChange={(e) => setFormData({ ...formData, make: e.target.value })}
          style={styles.formInput}
          disabled={loading}
        />
      </div>
      <input
        placeholder="Model *"
        value={formData.model}
        onChange={(e) => setFormData({ ...formData, model: e.target.value })}
        style={styles.formInput}
        disabled={loading}
      />
      <input
        placeholder="License Plate *"
        value={formData.license_plate}
        onChange={(e) => setFormData({ ...formData, license_plate: e.target.value })}
        style={styles.formInput}
        disabled={loading}
      />
      <input
        placeholder="VIN (optional)"
        value={formData.vin}
        onChange={(e) => setFormData({ ...formData, vin: e.target.value })}
        style={styles.formInput}
        disabled={loading}
      />
      <div style={{ display: 'flex', gap: 8 }}>
        <button type="submit" disabled={loading} style={{ ...styles.actionBtn, background: '#2196F3', border: '1px solid #2196F3', flex: 1, justifyContent: 'center', fontSize: 12, opacity: loading ? 0.6 : 1 }}>
          {loading ? 'Saving...' : 'Add Vehicle'}
        </button>
        <button type="button" onClick={onCancel} disabled={loading} style={{ ...styles.actionBtn, background: '#f44336', border: '1px solid #f44336', flex: 1, justifyContent: 'center', fontSize: 12, opacity: loading ? 0.6 : 1 }}>
          Cancel
        </button>
      </div>
    </form>
  );
}

function VehicleWorkOrderHistory({ vehicleId, workOrders }) {
  if (!workOrders || workOrders.length === 0) {
    return (
      <div style={{ textAlign: 'center', color: COLORS.textLight, padding: 32 }}>
        No work orders found for this vehicle
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {workOrders.map(wo => {
        const woData = wo.data || wo;
        return (
          <div key={wo.id} style={{ ...styles.woCard, background: COLORS.primaryLight, borderColor: COLORS.border, marginBottom: 0, display: 'block' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 12 }}>
              <div>
                <div style={{ fontSize: 10, color: COLORS.textLight, fontWeight: '600', marginBottom: 4 }}>WO#</div>
                <div style={{ fontSize: 13, color: COLORS.primary, fontWeight: '700' }}>WO #{wo.id.replace('wo', '')}</div>
              </div>
              <div>
                <div style={{ fontSize: 10, color: COLORS.textLight, fontWeight: '600', marginBottom: 4 }}>STATUS</div>
                <div style={{ fontSize: 12, fontWeight: '600', ...getStatusStyle(woData.status), display: 'inline-block', padding: '4px 8px', borderRadius: 4 }}>
                  {woData.status.replace('_', ' ').toUpperCase()}
                </div>
              </div>
            </div>
            <div>
              <div style={{ fontSize: 10, color: COLORS.textLight, fontWeight: '600', marginBottom: 4 }}>COMPLAINT/WORK</div>
              <div style={{ fontSize: 12, color: COLORS.text }}>{woData.complaint}</div>
            </div>
            {woData.notes && (
              <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid', borderColor: COLORS.border }}>
                <div style={{ fontSize: 10, color: COLORS.textLight, fontWeight: '600', marginBottom: 4 }}>NOTES</div>
                <div style={{ fontSize: 12, color: COLORS.text }}>{woData.notes}</div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function TechSchedule({ techName, jobs, color, vehicles }) {
  return (
    <div style={{ ...styles.techSection, borderLeftColor: color, background: COLORS.cardBg, borderColor: COLORS.border }}>
      <div style={{ ...styles.techHeader, background: color }}>
        <div style={styles.techName}>{techName}</div>
        <div style={styles.jobCount}>{jobs.length} {jobs.length === 1 ? 'job' : 'jobs'}</div>
      </div>
      <div style={styles.jobsList}>
        {jobs.length === 0 ? (
          <div style={{ ...styles.noJobs, color: COLORS.textLight }}>No jobs scheduled</div>
        ) : (
          jobs.map(wo => {
            const woData = wo.data || wo;
            const veh = vehicles.find(v => v.id === woData.vehicle_id);
            return (
              <div key={wo.id} style={{ ...styles.jobItem, background: COLORS.primaryLight, borderColor: COLORS.border }}>
                <div style={{ ...styles.jobWONum, color: COLORS.primary }}>WO #{wo.id.replace('wo', '')}</div>
                <div style={{ ...styles.jobVehicle, color: COLORS.text }}>
                  {veh?.data?.year} {veh?.data?.make} {veh?.data?.model}
                </div>
                <div style={{ ...styles.jobConcern, color: COLORS.textLight }}>{woData.complaint}</div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

const styles = {
  app: { minHeight: '100vh', fontFamily: "'Inter', sans-serif", display: 'flex', flexDirection: 'column' },
  header: { padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', borderBottom: '1px solid' },
  menuSection: { position: 'relative' },
  menuButton: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, border: 'none', background: 'none', cursor: 'pointer', padding: 0 },
  autoLabLogo: { display: 'flex', gap: 0, alignItems: 'baseline' },
  logoText: { fontSize: 20, fontWeight: '900', color: '#333333', letterSpacing: -1 },
  menuLabel: { fontSize: 13, fontWeight: '700', color: '#666666' },
  dropdownMenu: { position: 'absolute', top: 60, left: 0, minWidth: 220, borderRadius: 4, boxShadow: '0 4px 12px rgba(0,0,0,0.1)', zIndex: 20, overflow: 'hidden' },
  menuItemStyle: { display: 'block', width: '100%', padding: '12px 16px', border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: '600', textAlign: 'left', color: '#333333', transition: 'background 0.15s' },
  rightSection: { display: 'flex', alignItems: 'center', gap: 24, border: 'none', outline: 'none', background: 'transparent', boxShadow: 'none', appearance: 'none', padding: 0, margin: 0 },
  cashLabel: { fontSize: 10, fontWeight: '600', textTransform: 'uppercase', marginBottom: 2, color: '#333333' },
  cashAmount: { fontSize: 16, fontWeight: '700', color: '#000000' },
  userSection: { display: 'flex', alignItems: 'center', gap: 12, border: 'none', outline: 'none', boxShadow: 'none', background: 'transparent', appearance: 'none', padding: 0, margin: 0 },
  userName: { fontSize: 12, fontWeight: '600', border: 'none', outline: 'none', appearance: 'none', padding: 0, margin: 0 },
  signOutBtn: { fontSize: 11, border: 'none', outline: 'none', background: 'none', cursor: 'pointer', padding: 0, textDecoration: 'underline', appearance: 'none', boxShadow: 'none', margin: 0 },
  avatar: { width: 36, height: 36, borderRadius: '50%', background: COLORS.primary, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: 14, border: 'none', outline: 'none', boxShadow: 'none', appearance: 'none', padding: 0, margin: 0 },
  actionsBar: { padding: '12px 24px' },
  actionBarContent: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1600px', margin: '0 auto', width: '100%' },
  actionButtonsContainer: { display: 'flex', gap: 12 },
  actionBtn: { display: 'flex', alignItems: 'center', gap: 8, color: '#000000', border: '1px solid #000000', borderRadius: 6, padding: '10px 18px', fontWeight: '600', fontSize: 13, cursor: 'pointer', background: '#F2A900', transition: 'all 0.2s' },
  cashOnHandDisplay: { textAlign: 'right', border: '1px solid #333333', padding: '8px 12px', borderRadius: 4, background: '#F0F0F0' },
  body: { padding: '24px', flex: 1, display: 'flex', flexDirection: 'column', maxWidth: '1600px', margin: '0 auto', width: '100%' },
  mainContainer: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, flex: 1, minHeight: 600 },
  leftSection: { borderRadius: 8, boxShadow: '0 1px 3px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', border: '1px solid' },
  rightSection: { borderRadius: 8, boxShadow: '0 1px 3px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', border: '1px solid' },
  sectionHeader: { display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px 24px', borderBottom: '1px solid', position: 'relative' },
  sectionTitle: { fontSize: 18, fontWeight: '700' },
  calendarBtn: { borderRadius: 6, padding: '8px 16px', cursor: 'pointer', fontSize: 14, fontWeight: '600', border: 'none', position: 'absolute', right: 24 },
  filterTabs: { display: 'flex', gap: 6, padding: '12px 24px', borderBottom: '1px solid', flexWrap: 'wrap', alignItems: 'center' },
  filterTab: { padding: '8px 12px', border: '1px solid', borderRadius: 6, cursor: 'pointer', fontSize: 11, fontWeight: '600', whiteSpace: 'nowrap' },
  scrollableContent: { flex: 1, overflowY: 'auto', padding: '12px 24px' },
  section: { borderRadius: 8, padding: 24, boxShadow: '0 1px 3px rgba(0,0,0,0.05)' },
  techSection: { border: '1px solid', borderRadius: 8, overflow: 'hidden', borderLeft: '4px solid', marginBottom: 12 },
  techHeader: { padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'white' },
  techName: { fontSize: 14, fontWeight: '700' },
  jobCount: { fontSize: 12, fontWeight: '600' },
  jobsList: { padding: '12px' },
  noJobs: { fontSize: 12, padding: '12px', textAlign: 'center' },
  jobItem: { border: '1px solid', borderRadius: 6, padding: 12, marginBottom: 8, cursor: 'pointer' },
  jobWONum: { fontSize: 12, fontWeight: '700' },
  jobVehicle: { fontSize: 11, marginTop: 4, fontWeight: '600' },
  jobConcern: { fontSize: 11, marginTop: 4 },
  woCard: { border: '1px solid', borderRadius: 8, padding: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', marginBottom: 12 },
  woContent: { flex: 1 },
  woNumber: { fontSize: 13, fontWeight: '700' },
  woCustomer: { fontSize: 12, fontWeight: '600', marginTop: 4 },
  woVehicle: { fontSize: 11, marginTop: 2 },
  woStatus: { fontSize: 10, padding: '4px 8px', borderRadius: 4, marginTop: 4, display: 'inline-block' },
  emptyState: { textAlign: 'center', padding: 40 },
  formInput: { width: '100%', padding: '10px 12px', marginBottom: 10, border: '1px solid', borderColor: COLORS.border, borderRadius: 4, fontSize: 12, fontFamily: 'inherit', boxSizing: 'border-box' },
};
