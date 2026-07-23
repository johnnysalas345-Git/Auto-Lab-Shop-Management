import React, { useState, useEffect } from 'react';
import { Wrench, Users, FileText, DollarSign, ChevronRight, Clock, LogOut } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://gvsbbpuuoxluqaiovtvx.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd2c2JicHV1b3hsdXFhaW92dHZ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQyMjE3MzUsImV4cCI6MjA5OTc5NzczNX0.fIXxADQkEPSK2wYoI5rFdkr4X4P0gSI_wmr50XUajY0';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const COLORS = {
  primary: '#4A90E2',
  primaryLight: '#E3F0FF',
  primaryDark: '#2E5CB8',
  bg: '#F8FAFB',
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

  const getStatusStyle = (status) => {
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
  };

  if (activeTab === 'dashboard') {
    const jobsByTech = groupJobsByTech();
    const activeWOs = getActiveWorkOrders();

    return (
      <div style={{ ...styles.app, background: COLORS.bg }}>
        <div style={{ ...styles.header, background: COLORS.cardBg, borderColor: COLORS.border }}>
          <div style={styles.logoSection}>
            <Wrench size={32} color={COLORS.primary} strokeWidth={1.5} />
            <div>
              <div style={{ ...styles.autoLabText, color: COLORS.primary }}>AUTO</div>
              <div style={{ ...styles.labText, color: COLORS.text }}>LAB</div>
            </div>
            <div style={{ ...styles.shopText, color: COLORS.textLight }}>SHOP</div>
          </div>

          <div style={styles.navCenter}>
            {[
              { label: 'DASHBOARD', id: 'dashboard' },
              { label: 'JOBS & INVOICES', id: 'jobs' },
              { label: 'EXPENSES', id: 'expenses' },
              { label: 'HOURS', id: 'hours' },
              { label: 'PAYROLL', id: 'payroll' },
              { label: 'PENSION', id: 'pension' },
              { label: 'IMPORT', id: 'import' },
              { label: 'SETTINGS', id: 'settings' },
            ].map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                style={{
                  ...styles.navItem,
                  color: activeTab === item.id ? COLORS.primary : COLORS.textLight,
                  fontWeight: activeTab === item.id ? '700' : '600',
                }}
              >
                {item.label}
              </button>
            ))}
            {isAdmin && (
              <button 
                onClick={() => setActiveTab('finance')}
                style={{
                  ...styles.navItem,
                  ...styles.financeBtn,
                  color: activeTab === 'finance' ? '#FFFFFF' : COLORS.text,
                  background: activeTab === 'finance' ? COLORS.primary : '#F2A900',
                }}
              >
                FINANCE
              </button>
            )}
          </div>

          <div style={styles.rightSection}>
            <div style={styles.cashOnHandSection}>
              <div style={{ ...styles.cashLabel, color: COLORS.textLight }}>ON HAND</div>
              <div style={{ ...styles.cashAmount, color: COLORS.primary }}>CI$5,240.50</div>
            </div>
            <div style={styles.userSection}>
              <div style={{ textAlign: 'right' }}>
                <div style={{ ...styles.userName, color: COLORS.text }}>Johnny</div>
                <button style={{ ...styles.signOutBtn, color: COLORS.textLight }}>Sign out</button>
              </div>
              <div style={styles.avatar}>J</div>
            </div>
          </div>
        </div>

        <div style={{ ...styles.actionsBar, background: COLORS.cardBg, borderColor: COLORS.border }}>
          <div style={styles.actionButtonsContainer}>
            <button style={{ ...styles.actionBtn, background: '#6BA388' }}>
              <Users size={18} />
              <span>New Customer</span>
            </button>
            <button style={{ ...styles.actionBtn, background: COLORS.primary }}>
              <Wrench size={18} />
              <span>New Work Order</span>
            </button>
            <button style={{ ...styles.actionBtn, background: '#C08A3C' }}>
              <FileText size={18} />
              <span>New Estimate</span>
            </button>
            <button style={{ ...styles.actionBtn, background: '#8B8B8B' }}>
              <Clock size={18} />
              <span>Hours</span>
            </button>
            <button style={{ ...styles.actionBtn, background: '#7B68A6' }}>
              <DollarSign size={18} />
              <span>Expense</span>
            </button>
          </div>
        </div>

        <div style={{ ...styles.body, background: COLORS.bg }}>
          <div style={styles.mainContainer}>
            <div style={{ ...styles.leftSection, background: COLORS.cardBg, borderColor: COLORS.border }}>
              <div style={{ ...styles.sectionHeader, borderColor: COLORS.border }}>
                <h2 style={{ ...styles.sectionTitle, color: COLORS.text }}>Today's Schedule</h2>
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
                <h2 style={{ ...styles.sectionTitle, color: COLORS.text }}>Active Work Orders</h2>
              </div>

              <div style={{ ...styles.filterTabs, borderColor: COLORS.border }}>
                {[
                  { label: 'All', id: 'all' },
                  { label: 'Open', id: 'open' },
                  { label: 'In Progress', id: 'in_progress' },
                  { label: 'Waiting Parts', id: 'waiting_parts' },
                  { label: 'Estimates', id: 'estimate' },
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
      </div>
    );
  }

  return (
    <div style={{ ...styles.app, background: COLORS.bg }}>
      <div style={{ ...styles.header, background: COLORS.cardBg, borderColor: COLORS.border }}>
        <div style={styles.logoSection}>
          <Wrench size={32} color={COLORS.primary} strokeWidth={1.5} />
          <div>
            <div style={{ ...styles.autoLabText, color: COLORS.primary }}>AUTO</div>
            <div style={{ ...styles.labText, color: COLORS.text }}>LAB</div>
          </div>
          <div style={{ ...styles.shopText, color: COLORS.textLight }}>SHOP</div>
        </div>

        <div style={styles.navCenter}>
          {[
            { label: 'DASHBOARD', id: 'dashboard' },
            { label: 'JOBS & INVOICES', id: 'jobs' },
            { label: 'EXPENSES', id: 'expenses' },
            { label: 'HOURS', id: 'hours' },
            { label: 'PAYROLL', id: 'payroll' },
            { label: 'PENSION', id: 'pension' },
            { label: 'IMPORT', id: 'import' },
            { label: 'SETTINGS', id: 'settings' },
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                ...styles.navItem,
                color: activeTab === item.id ? COLORS.primary : COLORS.textLight,
                fontWeight: activeTab === item.id ? '700' : '600',
              }}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div style={styles.rightSection}>
          <div style={styles.userSection}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ ...styles.userName, color: COLORS.text }}>Johnny</div>
              <button style={{ ...styles.signOutBtn, color: COLORS.textLight }}>Sign out</button>
            </div>
            <div style={styles.avatar}>J</div>
          </div>
        </div>
      </div>
      <div style={{ ...styles.body, background: COLORS.bg }}>
        <div style={{ textAlign: 'center', padding: 60, color: COLORS.textLight }}>
          <h2 style={{ color: COLORS.text }}>{activeTab.toUpperCase()} Section</h2>
          <p>Coming soon...</p>
        </div>
      </div>
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
  header: { padding: '12px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', borderBottom: '1px solid' },
  logoSection: { display: 'flex', alignItems: 'center', gap: 12, minWidth: 180 },
  autoLabText: { fontSize: 14, fontWeight: '700', lineHeight: 1, letterSpacing: 1 },
  labText: { fontSize: 14, fontWeight: '700', lineHeight: 1, letterSpacing: 1 },
  shopText: { fontSize: 14, fontWeight: '600', marginLeft: 8 },
  navCenter: { display: 'flex', gap: 2, alignItems: 'center', flex: 1, justifyContent: 'center' },
  navItem: { padding: '8px 12px', border: 'none', background: 'none', cursor: 'pointer', fontSize: 12, transition: 'all 0.2s' },
  financeBtn: { borderRadius: 6, padding: '8px 16px', marginLeft: 8 },
  rightSection: { display: 'flex', alignItems: 'center', gap: 24, minWidth: 280 },
  cashOnHandSection: { textAlign: 'right', borderRight: '1px solid #E8EEF5', paddingRight: 24 },
  cashLabel: { fontSize: 10, fontWeight: '600', textTransform: 'uppercase', marginBottom: 2 },
  cashAmount: { fontSize: 16, fontWeight: '700' },
  userSection: { display: 'flex', alignItems: 'center', gap: 12 },
  userName: { fontSize: 12, fontWeight: '600' },
  signOutBtn: { fontSize: 11, border: 'none', background: 'none', cursor: 'pointer', padding: 0, textDecoration: 'underline' },
  avatar: { width: 36, height: 36, borderRadius: '50%', background: COLORS.primary, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: 14 },
  actionsBar: { padding: '12px 24px', borderBottom: '1px solid' },
  actionButtonsContainer: { display: 'flex', gap: 12, maxWidth: '1600px', margin: '0 auto' },
  actionBtn: { display: 'flex', alignItems: 'center', gap: 8, color: 'white', border: 'none', borderRadius: 6, padding: '10px 18px', fontWeight: '600', fontSize: 13, cursor: 'pointer' },
  body: { padding: '24px', flex: 1, display: 'flex', flexDirection: 'column', maxWidth: '1600px', margin: '0 auto', width: '100%' },
  mainContainer: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, flex: 1, minHeight: 600 },
  leftSection: { borderRadius: 8, boxShadow: '0 1px 3px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', border: '1px solid' },
  rightSection: { borderRadius: 8, boxShadow: '0 1px 3px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', border: '1px solid' },
  sectionHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderBottom: '1px solid' },
  sectionTitle: { fontSize: 18, fontWeight: '700' },
  calendarBtn: { borderRadius: 6, padding: '8px 16px', cursor: 'pointer', fontSize: 14, fontWeight: '600', border: 'none' },
  filterTabs: { display: 'flex', gap: 8, padding: '12px 24px', borderBottom: '1px solid', flexWrap: 'wrap' },
  filterTab: { padding: '8px 16px', border: '1px solid', borderRadius: 6, cursor: 'pointer', fontSize: 12, fontWeight: '600' },
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
};
