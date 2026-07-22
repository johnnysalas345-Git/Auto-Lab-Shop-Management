import React, { useState, useEffect } from 'react';
import { Wrench, Users, FileText } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://gvsbbpuuoxluqaiovtvx.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd2c2JicHV1b3hsdXFhaW92dHZ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQyMjE3MzUsImV4cCI6MjA5OTc5NzczNX0.fIXxADQkEPSK2wYoI5rFdkr4X4P0gSI_wmr50XUajY0';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default function GarageDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [workOrders, setWorkOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

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

  const getWorkOrdersForDate = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    return workOrders.filter(wo => {
      const woData = wo.data || wo;
      return woData.opened_at === dateStr;
    });
  };

  const monthWOs = workOrders.filter(wo => {
    const woData = wo.data || wo;
    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    return woData.opened_at?.startsWith(currentMonth);
  });

  const activeWOs = workOrders.filter(wo => {
    const woData = wo.data || wo;
    return ['open', 'in_progress', 'waiting_parts'].includes(woData.status);
  });

  const totalRevenue = monthWOs.reduce((sum, wo) => {
    const woData = wo.data || wo;
    const labor = Object.values(woData.labor || {}).reduce((s, l) => s + (l.hours * l.rate), 0);
    return sum + labor + 250;
  }, 0);

  if (activeTab === 'dashboard') {
    return (
      <div style={styles.app}>
        <div style={styles.header}>
          <div style={styles.logoSection}>
            <Wrench size={28} color="#1565C0" />
            <div>
              <div style={styles.logoText}>Auto Lab</div>
              <div style={styles.logoSub}>Shop Management</div>
            </div>
          </div>
        </div>

        <div style={styles.navbar}>
          <button style={styles.navItemActive} onClick={() => setActiveTab('dashboard')}>DASHBOARD</button>
          <button style={styles.navItem} onClick={() => setActiveTab('jobs')}>JOBS & INVOICES</button>
          <button style={styles.navItem} onClick={() => setActiveTab('expenses')}>EXPENSES</button>
          <button style={styles.navItem} onClick={() => setActiveTab('hours')}>HOURS</button>
          <button style={styles.navItem} onClick={() => setActiveTab('payroll')}>PAYROLL</button>
          <button style={styles.navItem} onClick={() => setActiveTab('pension')}>PENSION</button>
          <button style={styles.navItem} onClick={() => setActiveTab('cash')}>CASH & BANK</button>
          <button style={styles.navItem} onClick={() => setActiveTab('import')}>IMPORT</button>
          <button style={styles.navItem} onClick={() => setActiveTab('settings')}>SETTINGS</button>
        </div>

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
          </div>

          <div style={styles.metricsGrid}>
            <div style={styles.metricCard}>
              <div style={styles.metricLabel}>Active Jobs</div>
              <div style={styles.metricValue}>{activeWOs.length}</div>
            </div>
            <div style={styles.metricCard}>
              <div style={styles.metricLabel}>Month Revenue</div>
              <div style={styles.metricValue}>${totalRevenue.toFixed(2)}</div>
            </div>
            <div style={styles.metricCard}>
              <div style={styles.metricLabel}>Total Customers</div>
              <div style={styles.metricValue}>{customers.length}</div>
            </div>
            <div style={styles.metricCard}>
              <div style={styles.metricLabel}>Total Vehicles</div>
              <div style={styles.metricValue}>{vehicles.length}</div>
            </div>
          </div>

          <div style={styles.calendarSection}>
            <div style={styles.calendarHeader}>
              <h2>Schedule</h2>
              <div style={styles.dateNav}>
                <button onClick={() => setSelectedDate(new Date(selectedDate.setDate(selectedDate.getDate() - 1)))} style={styles.navBtn}>←</button>
                <span>{selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
                <button onClick={() => setSelectedDate(new Date(selectedDate.setDate(selectedDate.getDate() + 1)))} style={styles.navBtn}>→</button>
              </div>
            </div>

            <div style={styles.calendarBody}>
              <div style={styles.dayWorkOrders}>
                <h3>Jobs Today</h3>
                {getWorkOrdersForDate(selectedDate).length === 0 ? (
                  <div style={styles.noJobs}>No work orders scheduled</div>
                ) : (
                  getWorkOrdersForDate(selectedDate).map(wo => {
                    const woData = wo.data || wo;
                    const cust = customers.find(c => c.id === woData.customer_id);
                    const veh = vehicles.find(v => v.id === woData.vehicle_id);
                    return (
                      <div key={wo.id} style={styles.dayJobCard}>
                        <div style={styles.jobWONum}>WO #{wo.id.replace('wo', '')}</div>
                        <div style={styles.jobCustomer}>{cust?.data?.name || 'Unknown'}</div>
                        <div style={styles.jobVehicle}>{veh?.data?.year} {veh?.data?.make} {veh?.data?.model}</div>
                        <div style={styles.jobComplaint}>{woData.complaint}</div>
                      </div>
                    );
                  })
                )}
              </div>

              <div style={styles.miniCalendar}>
                <MiniCalendar selectedDate={selectedDate} setSelectedDate={setSelectedDate} workOrders={workOrders} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.app}>
      <div style={styles.header}>
        <div style={styles.logoSection}>
          <Wrench size={28} color="#1565C0" />
          <div>
            <div style={styles.logoText}>Auto Lab</div>
            <div style={styles.logoSub}>Shop Management</div>
          </div>
        </div>
      </div>

      <div style={styles.navbar}>
        <button style={styles.navItem} onClick={() => setActiveTab('dashboard')}>DASHBOARD</button>
        <button style={styles.navItemActive} onClick={() => setActiveTab('jobs')}>JOBS & INVOICES</button>
        <button style={styles.navItem}>EXPENSES</button>
        <button style={styles.navItem}>HOURS</button>
        <button style={styles.navItem}>PAYROLL</button>
        <button style={styles.navItem}>PENSION</button>
        <button style={styles.navItem}>CASH & BANK</button>
        <button style={styles.navItem}>IMPORT</button>
        <button style={styles.navItem}>SETTINGS</button>
      </div>

      <div style={styles.body}>
        <div style={{ textAlign: 'center', padding: 60, color: '#666' }}>
          <h2>{activeTab.toUpperCase()} Section</h2>
          <p>Coming soon...</p>
        </div>
      </div>
    </div>
  );
}

function MiniCalendar({ selectedDate, setSelectedDate, workOrders }) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();

  const days = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let i = 1; i <= daysInMonth; i++) days.push(i);

  const hasWorkOrder = (day) => {
    if (!day) return false;
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    const dateStr = date.toISOString().split('T')[0];
    return workOrders.some(wo => {
      const woData = wo.data || wo;
      return woData.opened_at === dateStr;
    });
  };

  return (
    <div style={styles.miniCalendarContainer}>
      <div style={styles.miniCalendarHeader}>
        <button onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() - 1)))} style={styles.monthNavBtn}>←</button>
        <div>{currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</div>
        <button onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() + 1)))} style={styles.monthNavBtn}>→</button>
      </div>
      <div style={styles.weekDays}>
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} style={styles.weekDay}>{day}</div>
        ))}
      </div>
      <div style={styles.calendarDays}>
        {days.map((day, i) => (
          <div
            key={i}
            onClick={() => day && setSelectedDate(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day))}
            style={{
              ...styles.calendarDay,
              ...(day ? { cursor: 'pointer' } : {}),
              ...(day && selectedDate.getDate() === day && selectedDate.getMonth() === currentMonth.getMonth() ? { background: '#E3F2FD' } : {}),
              ...(hasWorkOrder(day) ? { borderBottom: '3px solid #F2A900' } : {}),
            }}
          >
            {day}
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  app: { background: '#F5F5F5', minHeight: '100vh', fontFamily: "'Inter', sans-serif" },
  header: { background: 'white', borderBottom: '1px solid #E0E0E0', padding: '16px 24px', display: 'flex', alignItems: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' },
  logoSection: { display: 'flex', alignItems: 'center', gap: 12 },
  logoText: { fontSize: 18, fontWeight: '700', color: '#1565C0' },
  logoSub: { fontSize: 12, color: '#999' },
  navbar: { background: 'white', borderBottom: '1px solid #E0E0E0', padding: '0 24px', display: 'flex', gap: 2 },
  navItem: { padding: '12px 16px', border: 'none', background: 'none', cursor: 'pointer', fontSize: 12, fontWeight: '600', color: '#999', borderBottom: '3px solid transparent' },
  navItemActive: { padding: '12px 16px', border: 'none', background: 'none', cursor: 'pointer', fontSize: 12, fontWeight: '600', color: '#F2A900', borderBottom: '3px solid #F2A900' },
  body: { padding: '24px', maxWidth: '1400px', margin: '0 auto' },
  actionsSection: { display: 'flex', gap: 12, marginBottom: 24 },
  actionBtn: { display: 'flex', alignItems: 'center', gap: 8, color: 'white', border: 'none', borderRadius: 6, padding: '12px 20px', fontWeight: '600', fontSize: 14, cursor: 'pointer' },
  metricsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 24 },
  metricCard: { background: 'white', border: '1px solid #E0E0E0', borderRadius: 8, padding: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.05)' },
  metricLabel: { fontSize: 12, color: '#999', fontWeight: '600', textTransform: 'uppercase', marginBottom: 8 },
  metricValue: { fontSize: 24, fontWeight: '700', color: '#1565C0' },
  calendarSection: { background: 'white', border: '1px solid #E0E0E0', borderRadius: 8, padding: 24, boxShadow: '0 1px 3px rgba(0,0,0,0.05)' },
  calendarHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  dateNav: { display: 'flex', alignItems: 'center', gap: 12 },
  navBtn: { background: '#F5F5F5', border: '1px solid #E0E0E0', borderRadius: 4, padding: '6px 12px', cursor: 'pointer', fontSize: 14 },
  calendarBody: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 },
  dayWorkOrders: { borderRight: '1px solid #E0E0E0', paddingRight: 24 },
  noJobs: { color: '#999', fontSize: 14, padding: 20, textAlign: 'center' },
  dayJobCard: { background: '#F9F9F9', border: '1px solid #E0E0E0', borderRadius: 6, padding: 12, marginBottom: 12 },
  jobWONum: { fontSize: 13, fontWeight: '700', color: '#1565C0' },
  jobCustomer: { fontSize: 12, color: '#333', fontWeight: '600', marginTop: 4 },
  jobVehicle: { fontSize: 12, color: '#666', marginTop: 2 },
  jobComplaint: { fontSize: 12, color: '#999', marginTop: 4 },
  miniCalendarContainer: { background: '#F9F9F9', borderRadius: 6, padding: 16 },
  miniCalendarHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, fontSize: 13, fontWeight: '600' },
  monthNavBtn: { background: 'white', border: '1px solid #E0E0E0', borderRadius: 4, padding: '4px 8px', cursor: 'pointer', fontSize: 12 },
  weekDays: { display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4, marginBottom: 8 },
  weekDay: { textAlign: 'center', fontSize: 11, fontWeight: '600', color: '#999', padding: 4 },
  calendarDays: { display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 },
  calendarDay: { aspect: '1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, borderRadius: 4, border: '1px solid #E0E0E0' },
};
