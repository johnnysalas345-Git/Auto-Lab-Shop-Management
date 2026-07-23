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

const CAR_MAKES = [
  'Abarth', 'AC', 'Acura', 'Aeolus', 'Aion', 'AITO', 'Aiways', 'Aixam', 'Alfa Romeo', 'Alpina', 'Alpine',
  'Anfini', 'Apollo', 'Appollen', 'Arcfox', 'Aria', 'Ariel', 'Aro', 'Artega', 'Asia', 'Aspark', 'Aston Martin',
  'Astro', 'Audi', 'Aurus', 'Austin', 'Austin-Healey', 'Autobianchi', 'Avatr', 'B.Engineering', 'BAC', 'BAIC',
  'Baltasar', 'Baltijas Dzips', 'Baojun', 'BAW', 'Bee Bee', 'BelGee', 'Bentley', 'Bertone', 'Bestune', 'Bisu',
  'Bitter', 'Bizzarrini', 'Blonell', 'BMW', 'Bollinger', 'Bordrin', 'Borgward', 'Brabham', 'Bremach', 'Brilliance',
  'Bristol', 'Bufori', 'Bugatti', 'Buick', 'BYD', 'Cadillac', 'Callaway', 'Campagna', 'Carbodies', 'Caterham',
  'Cenntro', 'ChangAn', 'Changan Nevo', 'ChangFeng', 'Chery', 'Chevrolet', 'Chrysler', 'Citroen', 'Cizeta',
  'Corbellati', 'Cupra', 'Czinger', 'Dacia', 'Dadi', 'Daewoo', 'DAF', 'Daihatsu', 'Daimler', 'Dallara', 'Dallas',
  'Datsun', 'David Brown', 'DC', 'De Lorean', 'De Tomaso', 'Deepal', 'Denza', 'Derways', 'DeSoto', 'DFSK', 'Dodge',
  'DongFeng', 'Doninvest', 'Donkervoort', 'DR', 'Drako', 'DS', 'e.GO', 'Eadon Green', 'Eagle', 'EBRO', 'Elaris',
  'Elemental', 'EMC', 'Engler', 'EVO', 'Exeed', 'Fangchengbao', 'Farizon', 'FAW', 'Felino', 'Ferrari', 'Fiat',
  'Firefly', 'Fisker', 'Fittipaldi', 'FOMM', 'Force Motors', 'Ford', 'Forthing', 'Foton', 'FSO', 'Fulwin', 'Fuqi',
  'GAZ', 'Geely', 'Genesis', 'Geo', 'Geometry', 'GFG Style', 'Ginetta', 'Gleagle', 'GMC', 'Gordon Murray', 'Great Wall',
  'Hafei', 'Haima', 'Haval', 'Hawtai', 'Hennessey', 'Hindustan', 'HiPhi', 'Hispano Suiza', 'Holden', 'Honda', 'Hongqi',
  'HSV', 'HuangHai', 'Hummer', 'Hurtan', 'Hyper', 'Hyptec', 'Hyundai', 'iCAR', 'iCAUR', 'ICH-X', 'ICKX', 'IM', 'IMSA',
  'INEOS', 'Infiniti', 'Innocenti', 'Invicta', 'Invicta Electric', 'Iran Khodro', 'Irmscher', 'Isdera', 'IsoRivolta',
  'Isuzu', 'Italdesign', 'Iveco', 'Izh', 'JAC', 'Jaecoo', 'Jaguar', 'Jeep', 'Jetour', 'Jiangling', 'JMEV', 'JY',
  'Kaiyi', 'Karlmann King', 'Karma', 'KGM', 'Kia', 'Kimera', 'Koenigsegg', 'KTM', 'Lada', 'Lamborghini', 'Lancia',
  'Land Rover', 'Landwind', 'Leapmotor', 'Lepas', 'LEVC', 'Lexus', 'Li', 'Ligier', 'Lincoln', 'Lister', 'Livan',
  'Lordstown', 'Lotus', 'LTI', 'LUAZ', 'Lucid', 'Luxeed', 'Luxgen', 'Lvchi', 'Lynk & Co', 'M-Hero', 'Maextro', 'Mahindra',
  'Marcos', 'Maruti', 'Maserati', 'Maxus', 'Maybach', 'Mazda', 'Mazzanti', 'MCC', 'McLaren', 'Mega', 'Melkus',
  'Mercedes-Benz', 'Mercury', 'Metrocab', 'MG', 'Micro', 'Milan', 'Minelli', 'MINEmobility', 'Mini', 'Mitsubishi',
  'Mitsuoka', 'Moke', 'Monte Carlo', 'Morgan', 'Morris', 'Moskvich', 'Munro', 'MW Motors', 'Neta', 'NIO', 'Nissan',
  'Noble', 'O.S.C.A.', 'Oldsmobile', 'Omoda', 'Onvo', 'Opel', 'ORA', 'Pagani', 'Panoz', 'Pariss', 'Paykan', 'Perodua',
  'Peugeot', 'Picasso', 'Pininfarina', 'Plymouth', 'Polaris', 'Polestar', 'Pontiac', 'Porsche', 'Praga', 'Premier',
  'Proton', 'PUCH', 'Puma', 'Puritalia', 'Qiantu', 'Qoros', 'Qvale', 'RAM', 'Ravon', 'Reliant', 'Renault',
  'Renault Samsung', 'Riddara', 'Rimac', 'Rinspeed', 'Rivian', 'Roewe', 'Rolls-Royce', 'Ronart', 'Rover', 'Rox',
  'RUF', 'Saab', 'SAIC', 'Saleen', 'Santana', 'Saturn', 'Sbarro', 'SCG', 'Scion', 'Scout', 'Seat', 'SeAZ', 'Seres',
  'ShuangHuan', 'Silence', 'Sin Cars', 'Skoda', 'Skywell', 'SMA', 'Smart', 'Sono Motors', 'Sony', 'Soueast', 'Spectre',
  'Sportequipe', 'Spyker', 'Spyros Panopoulos', 'SsangYong', 'SSC', 'Stelato', 'Subaru', 'Suda', 'Suzuki', 'SWM',
  'TagAz', 'Talbot', 'Tank', 'Tata', 'Tatra', 'Techrules', 'Tesla', 'Tianma', 'Tianye', 'Tiger', 'Tofas', 'Togg',
  'Tonggong', 'Toyota', 'Trabant', 'Tramontana', 'Triumph', 'Trumpchi', 'TVR', 'UAZ', 'Uniti', 'Vanderhall', 'Vauxhall',
  'Vector', 'Vencer', 'Venturi', 'Vespa', 'VinFast', 'Volkswagen', 'Volvo', 'Voyah', 'VUHL', 'VW-Porsche', 'W Motors',
  'Wartburg', 'Weltmeister', 'Westfield', 'WEY', 'Wiesmann', 'Xiaomi', 'Xin Kai', 'XPENG', 'Yangwang', 'Zacua', 'Zastava',
  'ZAZ', 'Zeekr', 'Zenvo', 'Zhidou', 'ZIL', 'Zotye', 'ZX'
];

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
                <div style={{ fontSize: 14, marginTop: 4 }}>Coming soon...</div>
              </div>
            </div>
            <div style={{ ...styles.section, background: COLORS.cardBg, borderColor: COLORS.border, minHeight: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ textAlign: 'center', color: COLORS.textLight }}>
                <div style={{ fontSize: 16, fontWeight: '600' }}>Section D</div>
                <div style={{ fontSize: 14, marginTop: 4 }}>Coming soon...</div>
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
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [newWorkOrderVehicle, setNewWorkOrderVehicle] = useState(null);

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
                fontSize: 14,
                minWidth: 240,
                boxSizing: 'border-box'
              }}
            />
            <button 
              onClick={() => setShowNewCustomerForm(!showNewCustomerForm)}
              style={{ ...styles.actionBtn, background: '#4CAF50', border: '1px solid #4CAF50', gap: 4, padding: '8px 12px', fontSize: 14 }}
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
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 14, fontWeight: '700', color: COLORS.text, minWidth: 200 }}>Name</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 14, fontWeight: '700', color: COLORS.text, minWidth: 140 }}>Phone</th>
                  <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: 14, fontWeight: '700', color: COLORS.text, minWidth: 120 }}>Brand</th>
                  <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: 14, fontWeight: '700', color: COLORS.text, minWidth: 140 }}>Model</th>
                  <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: 14, fontWeight: '700', color: COLORS.text, minWidth: 140 }}>License Plate</th>
                  <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: 14, fontWeight: '700', color: COLORS.text, minWidth: 120 }}>Work Orders</th>
                  <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: 14, fontWeight: '700', color: COLORS.text, minWidth: 100 }}>Add Vehicle</th>
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
                            <td style={{ padding: '12px 16px', fontSize: 15, color: COLORS.text, fontWeight: '600' }}>{customer.data?.name}</td>
                            <td style={{ padding: '12px 16px', fontSize: 15, color: COLORS.text }}>{customer.data?.phone}</td>
                            <td style={{ padding: '12px 16px', fontSize: 15, color: COLORS.textLight }}>—</td>
                            <td style={{ padding: '12px 16px', fontSize: 15, color: COLORS.textLight }}>—</td>
                            <td style={{ padding: '12px 16px', fontSize: 15, color: COLORS.textLight }}>—</td>
                            <td style={{ padding: '12px 16px', textAlign: 'center' }}>—</td>
                            <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                              <button 
                                onClick={() => setSelectedCustomerForVehicle(customer.id)}
                                style={{ ...styles.actionBtn, background: '#2196F3', border: '1px solid #2196F3', gap: 4, padding: '4px 8px', fontSize: 11 }}\n                                onMouseEnter={(e) => { e.currentTarget.style.background = '#0b7dda'; }}\n                                onMouseLeave={(e) => { e.currentTarget.style.background = '#2196F3'; }}\n                              >\n                                <span>➕</span>\n                              </button>\n                            </td>\n                          </tr>\n                        ) : (\n                          custVehicles.map((vehicle, idx) => (\n                            <tr key={vehicle.id} style={{ borderBottom: '1px solid', borderColor: COLORS.border, background: idx % 2 === 0 ? 'transparent' : COLORS.primaryLight }}>\n                              <td style={{ padding: '12px 16px', fontSize: 15, color: COLORS.text, fontWeight: idx === 0 ? '600' : 'normal', cursor: idx === 0 ? 'pointer' : 'default' }} onClick={() => idx === 0 && setEditingCustomer(customer)}>\n                                {idx === 0 ? <span style={{ textDecoration: 'underline', color: COLORS.primary }}>{customer.data?.name}</span> : ''}\n                              </td>\n                              <td style={{ padding: '12px 16px', fontSize: 15, color: COLORS.text, cursor: idx === 0 ? 'pointer' : 'default' }} onClick={() => idx === 0 && setEditingCustomer(customer)}>\n                                {idx === 0 ? <span style={{ textDecoration: 'underline', color: COLORS.primary }}>{customer.data?.phone}</span> : ''}\n                              </td>\n                              <td style={{ padding: '12px 16px', fontSize: 15, color: COLORS.text, cursor: 'pointer', textAlign: 'center' }} onClick={() => setEditingVehicle(vehicle)}>\n                                <span style={{ textDecoration: 'underline', color: COLORS.primary }}>{vehicle.data?.make}</span>\n                              </td>\n                              <td style={{ padding: '12px 16px', fontSize: 15, color: COLORS.text, cursor: 'pointer', textAlign: 'center' }} onClick={() => setEditingVehicle(vehicle)}>\n                                <span style={{ textDecoration: 'underline', color: COLORS.primary }}>{vehicle.data?.model}</span>\n                              </td>\n                              <td style={{ padding: '12px 16px', fontSize: 15, color: COLORS.primary, fontWeight: '600', cursor: 'pointer', textAlign: 'center' }} onClick={() => setEditingVehicle(vehicle)}>\n                                <span style={{ textDecoration: 'underline' }}>{vehicle.data?.license_plate}</span>\n                              </td>\n                              <td style={{ padding: '12px 16px', textAlign: 'center' }}>\n                                <div style={{ display: 'flex', gap: 4, justifyContent: 'center' }}>\n                                  <button \n                                    onClick={() => setSelectedVehicleHistory(vehicle.id)}\n                                    style={{ ...styles.actionBtn, background: '#FF9800', border: '1px solid #FF9800', gap: 4, padding: '4px 8px', fontSize: 11 }}\n                                    onMouseEnter={(e) => { e.currentTarget.style.background = '#e68900'; }}\n                                    onMouseLeave={(e) => { e.currentTarget.style.background = '#FF9800'; }}\n                                  >\n                                    <span>🔧</span>\n                                  </button>\n                                  <button \n                                    onClick={() => setNewWorkOrderVehicle(vehicle.id)}\n                                    style={{ ...styles.actionBtn, background: '#9C27B0', border: '1px solid #9C27B0', gap: 4, padding: '4px 8px', fontSize: 11 }}\n                                    onMouseEnter={(e) => { e.currentTarget.style.background = '#7B1FA2'; }}\n                                    onMouseLeave={(e) => { e.currentTarget.style.background = '#9C27B0'; }}\n                                    title=\"Create new work order\"\n                                  >\n                                    <span>📝</span>\n                                  </button>\n                                </div>\n                              </td>\n                              <td style={{ padding: '12px 16px', textAlign: 'center' }}>\n                                {idx === 0 && (\n                                  <button \n                                    onClick={() => setSelectedCustomerForVehicle(customer.id)}\n                                    style={{ ...styles.actionBtn, background: '#2196F3', border: '1px solid #2196F3', gap: 4, padding: '4px 8px', fontSize: 11 }}\n                                    onMouseEnter={(e) => { e.currentTarget.style.background = '#0b7dda'; }}\n                                    onMouseLeave={(e) => { e.currentTarget.style.background = '#2196F3'; }}\n                                  >\n                                    <span>➕</span>\n                                  </button>\n                                )}\n                              </td>\n                            </tr>\n                          ))\n                        )}\n                      </React.Fragment>\n                    );\n                  })\n                )}\n              </tbody>\n            </table>\n          </div>\n        </div>\n      </div>\n\n      {selectedCustomerForVehicle && (\n        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>\n          <div style={{ background: COLORS.cardBg, borderRadius: 8, padding: 24, maxWidth: 500, width: '90%', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 10px 40px rgba(0,0,0,0.2)' }}>\n            <h3 style={{ color: COLORS.text, marginBottom: 16, fontSize: 16, fontWeight: '700' }}>Add Vehicle to Customer</h3>\n            <AddVehicleForm \n              customerId={selectedCustomerForVehicle}\n              onSave={() => { loadAllData(); setSelectedCustomerForVehicle(null); }}\n              onCancel={() => setSelectedCustomerForVehicle(null)}\n            />\n          </div>\n        </div>\n      )}\n\n      {selectedVehicleHistory && (\n        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>\n          <div style={{ background: COLORS.cardBg, borderRadius: 8, padding: 24, maxWidth: 600, width: '90%', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 10px 40px rgba(0,0,0,0.2)' }}>\n            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>\n              <h3 style={{ color: COLORS.text, margin: 0, fontSize: 16, fontWeight: '700' }}>Work Order History</h3>\n              <button \n                onClick={() => setSelectedVehicleHistory(null)}\n                style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: COLORS.text }}\n              >\n                ✕\n              </button>\n            </div>\n            <VehicleWorkOrderHistory vehicleId={selectedVehicleHistory} workOrders={getVehicleWorkOrders(selectedVehicleHistory)} />\n          </div>\n        </div>\n      )}\n\n      {editingVehicle && (\n        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>\n          <div style={{ background: COLORS.cardBg, borderRadius: 8, padding: 24, maxWidth: 600, width: '90%', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 10px 40px rgba(0,0,0,0.2)' }}>\n            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>\n              <h3 style={{ color: COLORS.text, margin: 0, fontSize: 16, fontWeight: '700' }}>Edit Vehicle</h3>\n              <button \n                onClick={() => setEditingVehicle(null)}\n                style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: COLORS.text }}\n              >\n                ✕\n              </button>\n            </div>\n            <EditVehicleForm \n              vehicle={editingVehicle}\n              customers={customers}\n              onSave={() => { loadAllData(); setEditingVehicle(null); }}\n              onCancel={() => setEditingVehicle(null)}\n            />\n          </div>\n        </div>\n      )}\n\n      {editingCustomer && (\n        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>\n          <div style={{ background: COLORS.cardBg, borderRadius: 8, padding: 24, maxWidth: 600, width: '90%', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 10px 40px rgba(0,0,0,0.2)' }}>\n            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>\n              <h3 style={{ color: COLORS.text, margin: 0, fontSize: 16, fontWeight: '700' }}>Edit Customer</h3>\n              <button \n                onClick={() => setEditingCustomer(null)}\n                style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: COLORS.text }}\n              >\n                ✕\n              </button>\n            </div>\n            <EditCustomerForm \n              customer={editingCustomer}\n              onSave={() => { loadAllData(); setEditingCustomer(null); }}\n              onCancel={() => setEditingCustomer(null)}\n            />\n          </div>\n        </div>\n      )}\n\n      {newWorkOrderVehicle && (\n        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>\n          <div style={{ background: COLORS.cardBg, borderRadius: 8, padding: 24, maxWidth: 600, width: '90%', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 10px 40px rgba(0,0,0,0.2)' }}>\n            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>\n              <h3 style={{ color: COLORS.text, margin: 0, fontSize: 16, fontWeight: '700' }}>Create New Work Order</h3>\n              <button \n                onClick={() => setNewWorkOrderVehicle(null)}\n                style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: COLORS.text }}\n              >\n                ✕\n              </button>\n            </div>\n            <NewWorkOrderForm \n              vehicleId={newWorkOrderVehicle}\n              customers={customers}\n              vehicles={vehicles}\n              onSave={() => { loadAllData(); setNewWorkOrderVehicle(null); }}\n              onCancel={() => setNewWorkOrderVehicle(null)}\n            />\n          </div>\n        </div>\n      )}\n    </div>\n  );\n}\n\nfunction NewCustomerForm({ onSave, onCancel }) {\n  const [formData, setFormData] = useState({ name: '', phone: '', email: '', address: '' });\n  const [loading, setLoading] = useState(false);\n  const [error, setError] = useState('');\n\n  async function handleSubmit(e) {\n    e.preventDefault();\n    setError('');\n    \n    if (!formData.name || !formData.phone) {\n      setError('Name and phone are required');\n      return;\n    }\n    \n    setLoading(true);\n    try {\n      console.log('Inserting customer:', formData);\n      const { data, error: insertError } = await supabase.from('customers').insert([\n        { data: formData }\n      ]).select();\n      \n      console.log('Insert response:', { data, insertError });\n      \n      if (insertError) {\n        throw new Error(insertError.message || 'Failed to insert customer');\n      }\n      \n      alert('Customer added successfully!');\n      onSave();\n    } catch (err) {\n      console.error('Error adding customer:', err);\n      setError(err.message || 'Error adding customer');\n    } finally {\n      setLoading(false);\n    }\n  }\n\n  return (\n    <form onSubmit={handleSubmit} style={{ padding: '16px 24px', borderBottom: '1px solid', borderColor: COLORS.border, background: COLORS.primaryLight }}>\n      {error && (\n        <div style={{ padding: '8px 12px', marginBottom: 12, background: '#FCE3E3', color: '#B87C7C', borderRadius: 4, fontSize: 14, fontWeight: '600' }}>\n          ⚠️ {error}\n        </div>\n      )}\n      <input\n        placeholder=\"Full Name *\"\n        value={formData.name}\n        onChange={(e) => setFormData({ ...formData, name: e.target.value })}\n        style={styles.formInput}\n        disabled={loading}\n      />\n      <input\n        placeholder=\"Phone *\"\n        value={formData.phone}\n        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}\n        style={styles.formInput}\n        disabled={loading}\n      />\n      <input\n        placeholder=\"Email\"\n        value={formData.email}\n        onChange={(e) => setFormData({ ...formData, email: e.target.value })}\n        style={styles.formInput}\n        disabled={loading}\n      />\n      <input\n        placeholder=\"Address\"\n        value={formData.address}\n        onChange={(e) => setFormData({ ...formData, address: e.target.value })}\n        style={styles.formInput}\n        disabled={loading}\n      />\n      <div style={{ display: 'flex', gap: 8 }}>\n        <button type=\"submit\" disabled={loading} style={{ ...styles.actionBtn, background: '#4CAF50', border: '1px solid #4CAF50', flex: 1, justifyContent: 'center', opacity: loading ? 0.6 : 1 }}>\n          {loading ? 'Saving...' : 'Save Customer'}\n        </button>\n        <button type=\"button\" onClick={onCancel} disabled={loading} style={{ ...styles.actionBtn, background: '#f44336', border: '1px solid #f44336', flex: 1, justifyContent: 'center', opacity: loading ? 0.6 : 1 }}>\n          Cancel\n        </button>\n      </div>\n    </form>\n  );\n}\n\nfunction EditVehicleForm({ vehicle, customers, onSave, onCancel }) {\n  const [formData, setFormData] = useState(vehicle.data || {});\n  const [transferCustomerId, setTransferCustomerId] = useState('');\n  const [loading, setLoading] = useState(false);\n  const [error, setError] = useState('');\n\n  async function handleSave(e) {\n    e.preventDefault();\n    setError('');\n    \n    if (!formData.make || !formData.model || !formData.license_plate) {\n      setError('Make, model, and license plate are required');\n      return;\n    }\n    \n    setLoading(true);\n    try {\n      const { error: updateError } = await supabase.from('vehicles').update({ data: formData }).eq('id', vehicle.id);\n      if (updateError) throw new Error(updateError.message || 'Failed to update vehicle');\n      alert('Vehicle updated successfully!');\n      onSave();\n    } catch (err) {\n      console.error('Error updating vehicle:', err);\n      setError(err.message || 'Error updating vehicle');\n    } finally {\n      setLoading(false);\n    }\n  }\n\n  async function handleTransfer(e) {\n    e.preventDefault();\n    setError('');\n    \n    if (!transferCustomerId) {\n      setError('Please select a customer to transfer to');\n      return;\n    }\n    \n    setLoading(true);\n    try {\n      const { error: updateError } = await supabase.from('vehicles').update({ customer_id: transferCustomerId }).eq('id', vehicle.id);\n      if (updateError) throw new Error(updateError.message || 'Failed to transfer vehicle');\n      alert('Vehicle transferred successfully!');\n      onSave();\n    } catch (err) {\n      console.error('Error transferring vehicle:', err);\n      setError(err.message || 'Error transferring vehicle');\n    } finally {\n      setLoading(false);\n    }\n  }\n\n  return (\n    <div>\n      <form onSubmit={handleSave} style={{ padding: '16px', marginBottom: 16, background: COLORS.primaryLight, borderRadius: 8, border: '1px solid', borderColor: COLORS.border }}>\n        {error && (\n          <div style={{ padding: '8px 12px', marginBottom: 12, background: '#FCE3E3', color: '#B87C7C', borderRadius: 4, fontSize: 14, fontWeight: '600' }}>\n            ⚠️ {error}\n          </div>\n        )}\n        <h4 style={{ color: COLORS.text, marginBottom: 12, fontSize: 14, fontWeight: '700' }}>Vehicle Details</h4>\n        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>\n          <input\n            type=\"number\"\n            placeholder=\"Year\"\n            value={formData.year || ''}\n            onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}\n            style={styles.formInput}\n            disabled={loading}\n          />\n          <select\n            value={formData.make || ''}\n            onChange={(e) => setFormData({ ...formData, make: e.target.value })}\n            style={{ ...styles.formInput, appearance: 'auto' }}\n            disabled={loading}\n          >\n            <option value=\"\">-- Select Make --</option>\n            {CAR_MAKES.map(make => (\n              <option key={make} value={make}>{make}</option>\n            ))}\n          </select>\n        </div>\n        <input\n          placeholder=\"Model *\"\n          value={formData.model || ''}\n          onChange={(e) => setFormData({ ...formData, model: e.target.value })}\n          style={styles.formInput}\n          disabled={loading}\n        />\n        <input\n          placeholder=\"License Plate *\"\n          value={formData.license_plate || ''}\n          onChange={(e) => setFormData({ ...formData, license_plate: e.target.value })}\n          style={styles.formInput}\n          disabled={loading}\n        />\n        <input\n          placeholder=\"VIN (optional)\"\n          value={formData.vin || ''}\n          onChange={(e) => setFormData({ ...formData, vin: e.target.value })}\n          style={styles.formInput}\n          disabled={loading}\n        />\n        <div style={{ display: 'flex', gap: 8 }}>\n          <button type=\"submit\" disabled={loading} style={{ ...styles.actionBtn, background: '#2196F3', border: '1px solid #2196F3', flex: 1, justifyContent: 'center', fontSize: 14, opacity: loading ? 0.6 : 1 }}>\n            {loading ? 'Saving...' : 'Save Changes'}\n          </button>\n          <button type=\"button\" onClick={onCancel} disabled={loading} style={{ ...styles.actionBtn, background: '#f44336', border: '1px solid #f44336', flex: 1, justifyContent: 'center', fontSize: 14, opacity: loading ? 0.6 : 1 }}>\n            Cancel\n          </button>\n        </div>\n      </form>\n\n      <form onSubmit={handleTransfer} style={{ padding: '16px', background: COLORS.primaryLight, borderRadius: 8, border: '1px solid', borderColor: COLORS.border }}>\n        <h4 style={{ color: COLORS.text, marginBottom: 12, fontSize: 14, fontWeight: '700' }}>Transfer Vehicle to Another Customer</h4>\n        <select\n          value={transferCustomerId}\n          onChange={(e) => setTransferCustomerId(e.target.value)}\n          style={{ ...styles.formInput, appearance: 'auto' }}\n          disabled={loading}\n        >\n          <option value=\"\">-- Select Customer --</option>\n          {customers.map(cust => (\n            <option key={cust.id} value={cust.id}>\n              {cust.data?.name} ({cust.data?.phone})\n            </option>\n          ))}\n        </select>\n        <button type=\"submit\" disabled={loading || !transferCustomerId} style={{ ...styles.actionBtn, background: '#FF9800', border: '1px solid #FF9800', width: '100%', justifyContent: 'center', fontSize: 14, opacity: loading || !transferCustomerId ? 0.6 : 1 }}>\n          {loading ? 'Transferring...' : '🚗 Transfer Vehicle'}\n        </button>\n      </form>\n    </div>\n  );\n}\n\nfunction EditCustomerForm({ customer, onSave, onCancel }) {\n  const [formData, setFormData] = useState(customer.data || {});\n  const [loading, setLoading] = useState(false);\n  const [error, setError] = useState('');\n\n  async function handleSave(e) {\n    e.preventDefault();\n    setError('');\n    \n    if (!formData.name || !formData.phone) {\n      setError('Name and phone are required');\n      return;\n    }\n    \n    setLoading(true);\n    try {\n      const { error: updateError } = await supabase.from('customers').update({ data: formData }).eq('id', customer.id);\n      if (updateError) throw new Error(updateError.message || 'Failed to update customer');\n      alert('Customer updated successfully!');\n      onSave();\n    } catch (err) {\n      console.error('Error updating customer:', err);\n      setError(err.message || 'Error updating customer');\n    } finally {\n      setLoading(false);\n    }\n  }\n\n  return (\n    <form onSubmit={handleSave} style={{ padding: '16px', background: COLORS.primaryLight, borderRadius: 8, border: '1px solid', borderColor: COLORS.border }}>\n      {error && (\n        <div style={{ padding: '8px 12px', marginBottom: 12, background: '#FCE3E3', color: '#B87C7C', borderRadius: 4, fontSize: 14, fontWeight: '600' }}>\n          ⚠️ {error}\n        </div>\n      )}\n      <input\n        placeholder=\"Full Name *\"\n        value={formData.name || ''}\n        onChange={(e) => setFormData({ ...formData, name: e.target.value })}\n        style={styles.formInput}\n        disabled={loading}\n      />\n      <input\n        placeholder=\"Phone *\"\n        value={formData.phone || ''}\n        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}\n        style={styles.formInput}\n        disabled={loading}\n      />\n      <input\n        placeholder=\"Email\"\n        value={formData.email || ''}\n        onChange={(e) => setFormData({ ...formData, email: e.target.value })}\n        style={styles.formInput}\n        disabled={loading}\n      />\n      <input\n        placeholder=\"Address\"\n        value={formData.address || ''}\n        onChange={(e) => setFormData({ ...formData, address: e.target.value })}\n        style={styles.formInput}\n        disabled={loading}\n      />\n      <div style={{ display: 'flex', gap: 8 }}>\n        <button type=\"submit\" disabled={loading} style={{ ...styles.actionBtn, background: '#4CAF50', border: '1px solid #4CAF50', flex: 1, justifyContent: 'center', opacity: loading ? 0.6 : 1 }}>\n          {loading ? 'Saving...' : 'Save Changes'}\n        </button>\n        <button type=\"button\" onClick={onCancel} disabled={loading} style={{ ...styles.actionBtn, background: '#f44336', border: '1px solid #f44336', flex: 1, justifyContent: 'center', opacity: loading ? 0.6 : 1 }}>\n          Cancel\n        </button>\n      </div>\n    </form>\n  );\n}\n\nfunction AddVehicleForm({ customerId, onSave, onCancel }) {\n  const [formData, setFormData] = useState({ year: new Date().getFullYear(), make: '', model: '', license_plate: '', vin: '' });\n  const [loading, setLoading] = useState(false);\n  const [error, setError] = useState('');\n\n  async function handleSubmit(e) {\n    e.preventDefault();\n    setError('');\n    \n    if (!formData.make || !formData.model || !formData.license_plate) {\n      setError('Make, model, and license plate are required');\n      return;\n    }\n    \n    setLoading(true);\n    try {\n      console.log('Inserting vehicle:', { customer_id: customerId, data: formData });\n      const { data, error: insertError } = await supabase.from('vehicles').insert([\n        { customer_id: customerId, data: formData }\n      ]).select();\n      \n      console.log('Insert response:', { data, insertError });\n      \n      if (insertError) {\n        throw new Error(insertError.message || 'Failed to insert vehicle');\n      }\n      \n      alert('Vehicle added successfully!');\n      onSave();\n    } catch (err) {\n      console.error('Error adding vehicle:', err);\n      setError(err.message || 'Error adding vehicle');\n    } finally {\n      setLoading(false);\n    }\n  }\n\n  return (\n    <form onSubmit={handleSubmit} style={{ padding: '16px', marginBottom: 16, background: COLORS.primaryLight, borderRadius: 8, border: '1px solid', borderColor: COLORS.border }}>\n      {error && (\n        <div style={{ padding: '8px 12px', marginBottom: 12, background: '#FCE3E3', color: '#B87C7C', borderRadius: 4, fontSize: 14, fontWeight: '600' }}>\n          ⚠️ {error}\n        </div>\n      )}\n      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>\n        <input\n          type=\"number\"\n          placeholder=\"Year\"\n          value={formData.year}\n          onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}\n          style={styles.formInput}\n          disabled={loading}\n        />\n        <select\n          value={formData.make || ''}\n          onChange={(e) => setFormData({ ...formData, make: e.target.value })}\n          style={{ ...styles.formInput, appearance: 'auto' }}\n          disabled={loading}\n        >\n          <option value=\"\">-- Select Make --</option>\n          {CAR_MAKES.map(make => (\n            <option key={make} value={make}>{make}</option>\n          ))}\n        </select>\n      </div>\n      <input\n        placeholder=\"Model *\"\n        value={formData.model}\n        onChange={(e) => setFormData({ ...formData, model: e.target.value })}\n        style={styles.formInput}\n        disabled={loading}\n      />\n      <input\n        placeholder=\"License Plate *\"\n        value={formData.license_plate}\n        onChange={(e) => setFormData({ ...formData, license_plate: e.target.value })}\n        style={styles.formInput}\n        disabled={loading}\n      />\n      <input\n        placeholder=\"VIN (optional)\"\n        value={formData.vin}\n        onChange={(e) => setFormData({ ...formData, vin: e.target.value })}\n        style={styles.formInput}\n        disabled={loading}\n      />\n      <div style={{ display: 'flex', gap: 8 }}>\n        <button type=\"submit\" disabled={loading} style={{ ...styles.actionBtn, background: '#2196F3', border: '1px solid #2196F3', flex: 1, justifyContent: 'center', fontSize: 14, opacity: loading ? 0.6 : 1 }}>\n          {loading ? 'Saving...' : 'Add Vehicle'}\n        </button>\n        <button type=\"button\" onClick={onCancel} disabled={loading} style={{ ...styles.actionBtn, background: '#f44336', border: '1px solid #f44336', flex: 1, justifyContent: 'center', fontSize: 14, opacity: loading ? 0.6 : 1 }}>\n          Cancel\n        </button>\n      </div>\n    </form>\n  );\n}\n\nfunction VehicleWorkOrderHistory({ vehicleId, workOrders }) {\n  if (!workOrders || workOrders.length === 0) {\n    return (\n      <div style={{ textAlign: 'center', color: COLORS.textLight, padding: 32 }}>\n        No work orders found for this vehicle\n      </div>\n    );\n  }\n\n  return (\n    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>\n      {workOrders.map(wo => {\n        const woData = wo.data || wo;\n        return (\n          <div key={wo.id} style={{ ...styles.woCard, background: COLORS.primaryLight, borderColor: COLORS.border, marginBottom: 0, display: 'block' }}>\n            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 12 }}>\n              <div>\n                <div style={{ fontSize: 12, color: COLORS.textLight, fontWeight: '600', marginBottom: 4 }}>WO#</div>\n                <div style={{ fontSize: 15, color: COLORS.primary, fontWeight: '700' }}>WO #{wo.id.replace('wo', '')}</div>\n              </div>\n              <div>\n                <div style={{ fontSize: 12, color: COLORS.textLight, fontWeight: '600', marginBottom: 4 }}>STATUS</div>\n                <div style={{ fontSize: 14, fontWeight: '600', ...getStatusStyle(woData.status), display: 'inline-block', padding: '4px 8px', borderRadius: 4 }}>\n                  {woData.status.replace('_', ' ').toUpperCase()}\n                </div>\n              </div>\n            </div>\n            <div>\n              <div style={{ fontSize: 12, color: COLORS.textLight, fontWeight: '600', marginBottom: 4 }}>COMPLAINT/WORK</div>\n              <div style={{ fontSize: 14, color: COLORS.text }}>{woData.complaint}</div>\n            </div>\n            {woData.notes && (\n              <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid', borderColor: COLORS.border }}>\n                <div style={{ fontSize: 12, color: COLORS.textLight, fontWeight: '600', marginBottom: 4 }}>NOTES</div>\n                <div style={{ fontSize: 14, color: COLORS.text }}>{woData.notes}</div>\n              </div>\n            )}\n          </div>\n        );\n      })}\n    </div>\n  );\n}\n\nfunction TechSchedule({ techName, jobs, color, vehicles }) {\n  return (\n    <div style={{ ...styles.techSection, borderLeftColor: color, background: COLORS.cardBg, borderColor: COLORS.border }}>\n      <div style={{ ...styles.techHeader, background: color }}>\n        <div style={styles.techName}>{techName}</div>\n        <div style={styles.jobCount}>{jobs.length} {jobs.length === 1 ? 'job' : 'jobs'}</div>\n      </div>\n      <div style={styles.jobsList}>\n        {jobs.length === 0 ? (\n          <div style={{ ...styles.noJobs, color: COLORS.textLight }}>No jobs scheduled</div>\n        ) : (\n          jobs.map(wo => {\n            const woData = wo.data || wo;\n            const veh = vehicles.find(v => v.id === woData.vehicle_id);\n            return (\n              <div key={wo.id} style={{ ...styles.jobItem, background: COLORS.primaryLight, borderColor: COLORS.border }}>\n                <div style={{ ...styles.jobWONum, color: COLORS.primary }}>WO #{wo.id.replace('wo', '')}</div>\n                <div style={{ ...styles.jobVehicle, color: COLORS.text }}>\n                  {veh?.data?.year} {veh?.data?.make} {veh?.data?.model}\n                </div>\n                <div style={{ ...styles.jobConcern, color: COLORS.textLight }}>{woData.complaint}</div>\n              </div>\n            );\n          })\n        )}\n      </div>\n    </div>\n  );\n}\n\nfunction NewWorkOrderForm({ vehicleId, customers, vehicles, onSave, onCancel }) {\n  const [formData, setFormData] = useState({ \n    complaint: '', \n    notes: '', \n    status: 'open',\n    vehicle_id: vehicleId,\n    customer_id: ''\n  });\n  const [loading, setLoading] = useState(false);\n  const [error, setError] = useState('');\n\n  const vehicle = vehicles.find(v => v.id === vehicleId);\n  const customer = customers.find(c => c.id === vehicle?.customer_id);\n\n  async function handleSubmit(e) {\n    e.preventDefault();\n    setError('');\n    \n    if (!formData.complaint) {\n      setError('Complaint/Work description is required');\n      return;\n    }\n    \n    setLoading(true);\n    try {\n      const woId = 'wo' + Date.now();\n      const { error: insertError } = await supabase.from('work_orders').insert([\n        { \n          id: woId,\n          data: {\n            ...formData,\n            customer_id: vehicle?.customer_id,\n            opened_at: new Date().toISOString().split('T')[0]\n          }\n        }\n      ]).select();\n      \n      if (insertError) {\n        throw new Error(insertError.message || 'Failed to create work order');\n      }\n      \n      alert('Work order created successfully!');\n      onSave();\n    } catch (err) {\n      console.error('Error creating work order:', err);\n      setError(err.message || 'Error creating work order');\n    } finally {\n      setLoading(false);\n    }\n  }\n\n  return (\n    <form onSubmit={handleSubmit} style={{ padding: '16px', background: COLORS.primaryLight, borderRadius: 8, border: '1px solid', borderColor: COLORS.border }}>\n      {error && (\n        <div style={{ padding: '8px 12px', marginBottom: 12, background: '#FCE3E3', color: '#B87C7C', borderRadius: 4, fontSize: 14, fontWeight: '600' }}>\n          ⚠️ {error}\n        </div>\n      )}\n      \n      <div style={{ marginBottom: 12, padding: 12, background: '#F5F5F5', borderRadius: 4 }}>\n        <div style={{ fontSize: 12, color: COLORS.textLight, fontWeight: '600', marginBottom: 4 }}>VEHICLE</div>\n        <div style={{ fontSize: 14, color: COLORS.text, fontWeight: '600' }}>\n          {vehicle?.data?.year} {vehicle?.data?.make} {vehicle?.data?.model}\n        </div>\n        <div style={{ fontSize: 12, color: COLORS.textLight, marginTop: 4 }}>\n          License Plate: <span style={{ fontWeight: '600' }}>{vehicle?.data?.license_plate}</span>\n        </div>\n        <div style={{ fontSize: 12, color: COLORS.textLight, marginTop: 4 }}>\n          Customer: <span style={{ fontWeight: '600' }}>{customer?.data?.name}</span>\n        </div>\n      </div>\n\n      <textarea\n        placeholder=\"Complaint / Work Description *\"\n        value={formData.complaint}\n        onChange={(e) => setFormData({ ...formData, complaint: e.target.value })}\n        style={{ ...styles.formInput, minHeight: 80, fontFamily: 'inherit', resize: 'vertical' }}\n        disabled={loading}\n      />\n      \n      <textarea\n        placeholder=\"Notes (optional)\"\n        value={formData.notes}\n        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}\n        style={{ ...styles.formInput, minHeight: 60, fontFamily: 'inherit', resize: 'vertical' }}\n        disabled={loading}\n      />\n\n      <select\n        value={formData.status}\n        onChange={(e) => setFormData({ ...formData, status: e.target.value })}\n        style={{ ...styles.formInput, appearance: 'auto' }}\n        disabled={loading}\n      >\n        <option value=\"open\">Open</option>\n        <option value=\"in_progress\">In Progress</option>\n        <option value=\"waiting_parts\">Waiting Parts</option>\n        <option value=\"completed\">Completed</option>\n        <option value=\"contacted\">Contacted</option>\n      </select>\n\n      <div style={{ display: 'flex', gap: 8 }}>\n        <button type=\"submit\" disabled={loading} style={{ ...styles.actionBtn, background: '#9C27B0', border: '1px solid #9C27B0', flex: 1, justifyContent: 'center', opacity: loading ? 0.6 : 1 }}>\n          {loading ? 'Creating...' : '📝 Create Work Order'}\n        </button>\n        <button type=\"button\" onClick={onCancel} disabled={loading} style={{ ...styles.actionBtn, background: '#f44336', border: '1px solid #f44336', flex: 1, justifyContent: 'center', opacity: loading ? 0.6 : 1 }}>\n          Cancel\n        </button>\n      </div>\n    </form>\n  );\n}\n\nconst styles = {\n  app: { minHeight: '100vh', fontFamily: \"'Inter', sans-serif\", display: 'flex', flexDirection: 'column' },\n  header: { padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', borderBottom: '1px solid' },\n  menuSection: { position: 'relative' },\n  menuButton: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, border: 'none', background: 'none', cursor: 'pointer', padding: 0 },\n  autoLabLogo: { display: 'flex', gap: 0, alignItems: 'baseline' },\n  logoText: { fontSize: 22, fontWeight: '900', color: '#333333', letterSpacing: -1 },\n  menuLabel: { fontSize: 15, fontWeight: '700', color: '#666666' },\n  dropdownMenu: { position: 'absolute', top: 60, left: 0, minWidth: 220, borderRadius: 4, boxShadow: '0 4px 12px rgba(0,0,0,0.1)', zIndex: 20, overflow: 'hidden' },\n  menuItemStyle: { display: 'block', width: '100%', padding: '12px 16px', border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: '600', textAlign: 'left', color: '#333333', transition: 'background 0.15s' },\n  rightSection: { display: 'flex', alignItems: 'center', gap: 24, border: 'none', outline: 'none', background: 'transparent', boxShadow: 'none', appearance: 'none', padding: 0, margin: 0 },\n  cashLabel: { fontSize: 12, fontWeight: '600', textTransform: 'uppercase', marginBottom: 2, color: '#333333' },\n  cashAmount: { fontSize: 18, fontWeight: '700', color: '#000000' },\n  userSection: { display: 'flex', alignItems: 'center', gap: 12, border: 'none', outline: 'none', boxShadow: 'none', background: 'transparent', appearance: 'none', padding: 0, margin: 0 },\n  userName: { fontSize: 14, fontWeight: '600', border: 'none', outline: 'none', appearance: 'none', padding: 0, margin: 0 },\n  signOutBtn: { fontSize: 13, border: 'none', outline: 'none', background: 'none', cursor: 'pointer', padding: 0, textDecoration: 'underline', appearance: 'none', boxShadow: 'none', margin: 0 },\n  avatar: { width: 36, height: 36, borderRadius: '50%', background: COLORS.primary, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: 14, border: 'none', outline: 'none', boxShadow: 'none', appearance: 'none', padding: 0, margin: 0 },\n  actionsBar: { padding: '12px 24px' },\n  actionBarContent: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1600px', margin: '0 auto', width: '100%' },\n  actionButtonsContainer: { display: 'flex', gap: 12 },\n  actionBtn: { display: 'flex', alignItems: 'center', gap: 8, color: '#000000', border: '1px solid #000000', borderRadius: 6, padding: '10px 18px', fontWeight: '600', fontSize: 15, cursor: 'pointer', background: '#F2A900', transition: 'all 0.2s' },\n  cashOnHandDisplay: { textAlign: 'right', border: '1px solid #333333', padding: '8px 12px', borderRadius: 4, background: '#F0F0F0' },\n  body: { padding: '24px', flex: 1, display: 'flex', flexDirection: 'column', maxWidth: '1600px', margin: '0 auto', width: '100%' },\n  mainContainer: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, flex: 1, minHeight: 600 },\n  leftSection: { borderRadius: 8, boxShadow: '0 1px 3px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', border: '1px solid' },\n  rightSection: { borderRadius: 8, boxShadow: '0 1px 3px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', border: '1px solid' },\n  sectionHeader: { display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px 24px', borderBottom: '1px solid', position: 'relative' },\n  sectionTitle: { fontSize: 20, fontWeight: '700' },\n  calendarBtn: { borderRadius: 6, padding: '8px 16px', cursor: 'pointer', fontSize: 16, fontWeight: '600', border: 'none', position: 'absolute', right: 24 },\n  filterTabs: { display: 'flex', gap: 6, padding: '12px 24px', borderBottom: '1px solid', flexWrap: 'wrap', alignItems: 'center' },\n  filterTab: { padding: '8px 12px', border: '1px solid', borderRadius: 6, cursor: 'pointer', fontSize: 13, fontWeight: '600', whiteSpace: 'nowrap' },\n  scrollableContent: { flex: 1, overflowY: 'auto', padding: '12px 24px' },\n  section: { borderRadius: 8, padding: 24, boxShadow: '0 1px 3px rgba(0,0,0,0.05)' },\n  techSection: { border: '1px solid', borderRadius: 8, overflow: 'hidden', borderLeft: '4px solid', marginBottom: 12 },\n  techHeader: { padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'white' },\n  techName: { fontSize: 16, fontWeight: '700' },\n  jobCount: { fontSize: 14, fontWeight: '600' },\n  jobsList: { padding: '12px' },\n  noJobs: { fontSize: 14, padding: '12px', textAlign: 'center' },\n  jobItem: { border: '1px solid', borderRadius: 6, padding: 12, marginBottom: 8, cursor: 'pointer' },\n  jobWONum: { fontSize: 14, fontWeight: '700' },\n  jobVehicle: { fontSize: 13, marginTop: 4, fontWeight: '600' },\n  jobConcern: { fontSize: 13, marginTop: 4 },\n  woCard: { border: '1px solid', borderRadius: 8, padding: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', marginBottom: 12 },\n  woContent: { flex: 1 },\n  woNumber: { fontSize: 15, fontWeight: '700' },\n  woCustomer: { fontSize: 14, fontWeight: '600', marginTop: 4 },\n  woVehicle: { fontSize: 13, marginTop: 2 },\n  woStatus: { fontSize: 12, padding: '4px 8px', borderRadius: 4, marginTop: 4, display: 'inline-block' },\n  emptyState: { textAlign: 'center', padding: 40 },\n  formInput: { width: '100%', padding: '10px 12px', marginBottom: 10, border: '1px solid', borderColor: COLORS.border, borderRadius: 4, fontSize: 14, fontFamily: 'inherit', boxSizing: 'border-box' },\n};
