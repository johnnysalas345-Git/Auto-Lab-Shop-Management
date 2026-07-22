import React, { useState, useEffect } from 'react';
import { Wrench, Plus, FileText, Users, DollarSign, Clock, Settings, Upload, BarChart3, Calendar as CalendarIcon } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://gvsbbpuuoxluqaiovtvx.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd2c2JicHV1b3hsdXFhaW92dHZ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQyMjE3MzUsImV4cCI6MjA5OTc5NzczNX0.fIXxADQkEPSK2wYoI5rFdkr4X4P0gSI_wmr50XUajY0';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default function GarageDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [workOrders, setWorkOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      const [wo, cust, veh] = await Promise.all([
        supabase.from('work_orders').select('*'),
        supabase.from('customers').select('*'),
        supabase.from('vehicles').select('*'),
      ]);
      setWorkOrders(wo.data || []);
      setCustomers(cust.data || []);
      setVehicles(veh.data || []);
      setLoading(false);
    } catch (err) {
      console.error('Error loading data:', err);
      setLoading(false);
    }
  }

  // Get work orders for selected date
  const getWorkOrdersForDate = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    return workOrders.filter(wo => {
      const woData = wo.data || wo;
      return woData.opened_at === dateStr;
    });
  };

  // Get current month's work orders
  const getCurrentMonthWorkOrders = () => {
    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    return workOrders.filter(wo => {
      const woData = wo.data || wo;
      return woData.opened_at?.startsWith(currentMonth);
    });
  };

  // Calculate metrics
  const monthWOs = getCurrentMonthWorkOrders();
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
        <Header />
        <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
        
        <div style={styles.body}>
          {/* Quick Actions */}
          <div style={styles.actionsSection}>
            <button style={{ ...styles.actionBtn, background: '#2E7D32' }} title="Add new customer">
              <Users size={20} />
              <span>New Customer</span>
            </button>
            <button style={{ ...styles.actionBtn, background: '#1565C0' }} title="Create new work order">
              <Wrench size={20} />
              <span>New Work Order</span>
            </button>
            <button style={{ ...styles.actionBtn, background: '#F57C00' }} title="Create estimate">
              <FileText size={20} />
              <span>New Estimate</span>
