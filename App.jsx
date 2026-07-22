import React, { useState, useEffect } from 'react';
import { Wrench, Users, FileText, DollarSign, ChevronRight } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://gvsbbpuuoxluqaiovtvx.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd2c2JicHV1b3hsdXFhaW92dHZ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQyMjE3MzUsImV4cCI6MjA5OTc5NzczNX0.fIXxADQkEPSK2wYoI5rFdkr4X4P0gSI_wmr50XUajY0';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const TECH_COLORS = {
  tech1: '#7C3AED', // Purple
  tech2: '#6B7280', // Gray
  tech3: '#10B981', // Green
  tech4: '#EF4444', // Red
};

export default function GarageDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [activeFilter, setActiveFilter] = useState('all');
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

    const grouped = {
      unassigned: [],
      tech1: [],
      tech2: [],
      tech3: [],
      tech4: [],
    };

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
    let filtered = workOrders.filter(wo => {
      const woData = wo.data || wo;
      return ['open', 'in_progress', 'waiting_parts'].includes(woData.status);
    });

    if (activeFilter !== 'all') {
      filtered = filtered.filter(wo => {
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

  if (activeTab === 'dashboard') {
    const jobsByTech = groupJobsByTech();
    const activeWOs = getActiveWorkOrders();

    return (
      <div style={styles.app}>
        <Header isAdmin={isAdmin} />
        <Navigation activeTab={activeTab} setActiveTab={setActiveTab} isAdmin={isAdmin} />

        <div style={styles.body}>
          <div style={styles.actionsSection}>
            <button style={{ ...styles.actionBtn, background: '#2E7D32' }}>
              <Users size={20} />
              <span>New Customer</span>
            </button>
            <button style={{ ...styles.actionBtn, background: '#1565C0' }}>
              <Wrench size={20} />
              <span>New Work Order</span>
            </button>
            <button style={{ ...styles.actionBtn, background: '#F57C00' }}>
              <FileText size={20} />
              <span>New Estimate</span>
            </button>
            {isAdmin && (
              <button style={{ ...styles.actionBtn, background: '#6B21A8' }}>
                <DollarSign size={20} />
                <span>Finance</span>
              </button>
            )}
          </div>

          <div style={styles.mainContainer}>
            {/* LEFT: Today's Schedule */}
            <div style={styles.leftSection}>
              <div style={styles.sectionHeader}>
                <h2 style={styles.sectionTitle}>Today's Schedule</h2>
                <button style={styles.calendarBtn}>📅 Calendar</button>
              </div>

              <div style={styles.scrollableContent}>
                <TechSchedule 
                  techName="Technician 1" 
                  jobs={jobsByTech.tech1} 
                  color={TECH_COLORS.tech1}
                  vehicles={vehicles}
                />
                <TechSchedule 
                  techName="Technician 2" 
                  jobs={jobsByTech.tech2} 
                  color={TECH_COLORS.tech2}
                  vehicles={vehicles}
                />
                <TechSchedule 
                  techName="Technician 3" 
                  jobs={jobsByTech.tech3} 
                  color={TECH_COLORS.tech3}
                  vehicles={vehicles}
                />
                <TechSchedule 
                  techName="Technician 4" 
                  jobs={jobsByTech.tech4} 
                  color={TECH_COLORS.tech4}
                  vehicles={vehicles}
                />
                <TechSchedule 
                  techName="Unassigned" 
                  jobs={jobsByTech.unassigned} 
                  color="#D1D5DB"
                  vehicles={vehicles}
                />
              </div>
            </div>

            {/* RIGHT: Active Work Orders */}
            <div style={styles.rightSection}>
              <div style={styles.sectionHeader}>
                <h2 style={styles.sectionTitle}>Active Work Orders</h2>
              </div>

              <div style={styles.filterTabs}>
                <button 
                  style={{ ...styles.filterTab, ...(activeFilter === 'all' ? styles.filterTabActive : {}) }}
                  onClick={() => setActiveFilter('all')}
                >
                  All
                </button>
                <button 
                  style={{ ...styles.filterTab, ...(activeFilter === 'open' ? styles.filterTabActive : {}) }}
                  onClick={() => setActiveFilter('open')}
                >
                  Open
                </button>
                <button 
                  style={{ ...styles.filterTab, ...(activeFilter === 'in_progress' ? styles.filterTabActive : {}) }}
                  onClick={() => setActiveFilter('in_progress')}
                >
                  In Progress
                </button>
                <button 
                  style={{ ...styles.filterTab, ...(activeFilter === 'waiting_parts' ? styles.filterTabActive : {}) }}
                  onClick={() => setActiveFilter('waiting_parts')}
                >
                  Waiting Parts
                </button>
              </div>

              <div style={styles.scrollableContent}>
                {activeWOs.length === 0 ? (
                  <div style={styles.emptyState}>No active work orders</div>
                ) : (
                  activeWOs.map(wo => {
                    const { woData, cust, veh } = getJobInfo(wo);
                    return (
                      <div key={wo.id} style={styles.woCard}>
                        <div style={styles.woContent}>
                          <div style={styles.woNumber}>WO #{wo.id.replace('wo', '')}</div>
                          <div style={styles.woCustomer}>{cust?.data?.name}</div>
                          <div style={styles.woVehicle}>
                            {veh?.data?.year} {veh?.data?.make} {veh?.data?.model}
                          </div>
                          <div style={styles.woStatus}>{woData.status}</div>
                        </div>
                        <ChevronRight size={20} color="#999" />
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {/* Sections C & D */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginTop: 24 }}>
            <div style={{ ...styles.section, background: '#F0F0F0', minHeight: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ textAlign: 'center', color: '#999' }}>
                <div style={{ fontSize: 16, fontWeight: '600' }}>Section C</div>
                <div style={{ fontSize: 12, marginTop: 4 }}>Coming soon...</div>
              </div>
            </div>
            <div style={{ ...styles.section, background: '#F0F0F0', minHeight: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ textAlign: 'center', color: '#999' }}>
                <div style={{ fontSize: 16, fontWeight: '600' }}>Section D</div>
                <div style={{ fontSize: 12, marginTop: 4 }}>Coming soon...</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.app}>
      <Header isAdmin={isAdmin} />
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} isAdmin={isAdmin} />
      <div style={styles.body}>
        <div style={{ textAlign: 'center', padding: 60, color: '#666' }}>
          <h2>{activeTab.toUpperCase()} Section</h2>
          <p>Coming soon...</p>
        </div>
      </div>
    </div>
  );
}

function Header({ isAdmin }) {
  return (
    <div style={styles.header}>
      <div style={styles.logoSection}>
        <Wrench size={28} color="#1565C0" />
        <div>
          <div style={styles.logoText}>Auto Lab</div>
          <div style={styles.logoSub}>Shop Management</div>
        </div>
      </div>
      {isAdmin && (
        <div style={{ fontSize: 12, color: '#999', fontWeight: '600' }}>
          Admin • Johnny
        </div>
      )}
    </div>
  );
}

function Navigation({ activeTab, setActiveTab, isAdmin }) {
  return (
    <div style={styles.navbar}>
      <button style={activeTab === 'dashboard' ? styles.navItemActive : styles.navItem} onClick={() => setActiveTab('dashboard')}>DASHBOARD</button>
      <button style={activeTab === 'jobs' ? styles.navItemActive : styles.navItem} onClick={() => setActiveTab('jobs')}>JOBS & INVOICES</button>
      <button style={activeTab === 'expenses' ? styles.navItemActive : styles.navItem} onClick={() => setActiveTab('expenses')}>EXPENSES</button>
      <button style={activeTab === 'hours' ? styles.navItemActive : styles.navItem} onClick={() => setActiveTab('hours')}>HOURS</button>
      <button style={activeTab === 'payroll' ? styles.navItemActive : styles.navItem} onClick={() => setActiveTab('payroll')}>PAYROLL</button>
      <button style={activeTab === 'pension' ? styles.navItemActive : styles.navItem} onClick={() => setActiveTab('pension')}>PENSION</button>
      <button style={activeTab === 'cash' ? styles.navItemActive : styles.navItem} onClick={() => setActiveTab('cash')}>CASH & BANK</button>
      <button style={activeTab === 'import' ? styles.navItemActive : styles.navItem} onClick={() => setActiveTab('import')}>IMPORT</button>
      <button style={activeTab === 'settings' ? styles.navItemActive : styles.navItem} onClick={() => setActiveTab('settings')}>SETTINGS</button>
    </div>
  );
}

function TechSchedule({ techName, jobs, color, vehicles }) {
  return (
    <div style={{ ...styles.techSection, borderLeftColor: color }}>
      <div style={{ ...styles.techHeader, background: color }}>
        <div style={styles.techName}>{techName}</div>
        <div style={styles.jobCount}>{jobs.length} {jobs.length === 1 ? 'job' : 'jobs'}</div>
      </div>
      <div style={styles.jobsList}>
        {jobs.length === 0 ? (
          <div style={styles.noJobs}>No jobs scheduled</div>
        ) : (
          jobs.map(wo => {
            const woData = wo.data || wo;
            const veh = vehicles.find(v => v.id === woData.vehicle_id);
            return (
              <div key={wo.id} style={styles.jobItem}>
                <div style={styles.jobWONum}>WO #{wo.id.replace('wo', '')}</div>
                <div style={styles.jobVehicle}>
                  {veh?.data?.year} {veh?.data?.make} {veh?.data?.model}
                </div>
                <div style={styles.jobConcern}>{woData.complaint}</div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

const styles = {
  app: { background: '#F5F5F5', minHeight: '100vh', fontFamily: "'Inter', sans-serif", display: 'flex', flexDirection: 'column' },
  header: { background: 'white', borderBottom: '1px solid #E0E0E0', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' },
  logoSection: { display: 'flex', alignItems: 'center', gap: 12 },
  logoText: { fontSize: 18, fontWeight: '700', color: '#1565C0' },
  logoSub: { fontSize: 12, color: '#999' },
  navbar: { background: 'white', borderBottom: '1px solid #E0E0E0', padding: '0 24px', display: 'flex', gap: 2, overflowX: 'auto' },
  navItem: { padding: '12px 16px', border: 'none', background: 'none', cursor: 'pointer', fontSize: 12, fontWeight: '600', color: '#999', borderBottom: '3px solid transparent' },
  navItemActive: { padding: '12px 16px', border: 'none', background: 'none', cursor: 'pointer', fontSize: 12, fontWeight: '600', color: '#F2A900', borderBottom: '3px solid #F2A900' },
  body: { padding: '24px', flex: 1, display: 'flex', flexDirection: 'column', maxWidth: '1600px', margin: '0 auto', width: '100%' },
  actionsSection: { display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' },
  actionBtn: { display: 'flex', alignItems: 'center', gap: 8, color: 'white', border: 'none', borderRadius: 6, padding: '12px 20px', fontWeight: '600', fontSize: 14, cursor: 'pointer' },
  mainContainer: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, flex: 1, minHeight: 600 },
  leftSection: { background: 'white', border: '1px solid #E0E0E0', borderRadius: 8, boxShadow: '0 1px 3px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column' },
  rightSection: { background: 'white', border: '1px solid #E0E0E0', borderRadius: 8, boxShadow: '0 1px 3px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column' },
  sectionHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderBottom: '1px solid #E0E0E0' },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#333' },
  calendarBtn: { background: '#F5F5F5', border: '1px solid #E0E0E0', borderRadius: 6, padding: '8px 16px', cursor: 'pointer', fontSize: 14, fontWeight: '600' },
  filterTabs: { display: 'flex', gap: 8, padding: '12px 24px', borderBottom: '1px solid #E0E0E0', flexWrap: 'wrap' },
  filterTab: { padding: '8px 16px', border: '1px solid #E0E0E0', background: 'white', borderRadius: 6, cursor: 'pointer', fontSize: 12, fontWeight: '600', color: '#666' },
  filterTabActive: { background: '#F2A900', color: 'white', borderColor: '#F2A900' },
  scrollableContent: { flex: 1, overflowY: 'auto', padding: '12px 24px' },
  section: { background: 'white', border: '1px solid #E0E0E0', borderRadius: 8, padding: 24, boxShadow: '0 1px 3px rgba(0,0,0,0.05)' },
  techSection: { border: '1px solid #E0E0E0', borderRadius: 8, overflow: 'hidden', borderLeft: '4px solid', marginBottom: 12 },
  techHeader: { padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'white' },
  techName: { fontSize: 14, fontWeight: '700' },
  jobCount: { fontSize: 12, fontWeight: '600' },
  jobsList: { padding: '12px' },
  noJobs: { color: '#999', fontSize: 12, padding: '12px', textAlign: 'center' },
  jobItem: { background: '#F9F9F9', border: '1px solid #E0E0E0', borderRadius: 6, padding: 12, marginBottom: 8, cursor: 'pointer' },
  jobWONum: { fontSize: 12, fontWeight: '700', color: '#1565C0' },
  jobVehicle: { fontSize: 11, color: '#333', marginTop: 4, fontWeight: '600' },
  jobConcern: { fontSize: 11, color: '#666', marginTop: 4 },
  woCard: { background: '#F9F9F9', border: '1px solid #E0E0E0', borderRadius: 8, padding: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', marginBottom: 12 },
  woContent: { flex: 1 },
  woNumber: { fontSize: 13, fontWeight: '700', color: '#1565C0' },
  woCustomer: { fontSize: 12, color: '#333', fontWeight: '600', marginTop: 4 },
  woVehicle: { fontSize: 11, color: '#666', marginTop: 2 },
  woStatus: { fontSize: 10, color: '#999', textTransform: 'capitalize', marginTop: 4 },
  emptyState: { textAlign: 'center', padding: 40, color: '#999' },
};
