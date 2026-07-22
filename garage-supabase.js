import { createClient } from '@supabase/supabase-js';

// Get these from your Supabase project dashboard
// Project: gvsbbpuuoxluqaiovtvx
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Helper functions for garage app
export const db = {
  // CUSTOMERS
  async getCustomers() {
    const { data, error } = await supabase.from('customers').select('*');
    if (error) throw error;
    return data;
  },

  async getCustomerById(id) {
    const { data, error } = await supabase.from('customers').select('*').eq('id', id).single();
    if (error) throw error;
    return data;
  },

  async createCustomer(customer) {
    const { data, error } = await supabase.from('customers').insert([customer]).select();
    if (error) throw error;
    return data[0];
  },

  async updateCustomer(id, updates) {
    const { data, error } = await supabase.from('customers').update(updates).eq('id', id).select();
    if (error) throw error;
    return data[0];
  },

  // VEHICLES
  async getVehicles() {
    const { data, error } = await supabase.from('vehicles').select('*');
    if (error) throw error;
    return data;
  },

  async getVehiclesByCustomer(customerId) {
    const { data, error } = await supabase.from('vehicles').select('*').eq('data->customer_id', customerId);
    if (error) throw error;
    return data;
  },

  async createVehicle(vehicle) {
    const { data, error } = await supabase.from('vehicles').insert([vehicle]).select();
    if (error) throw error;
    return data[0];
  },

  async updateVehicle(id, updates) {
    const { data, error } = await supabase.from('vehicles').update(updates).eq('id', id).select();
    if (error) throw error;
    return data[0];
  },

  // WORK ORDERS
  async getWorkOrders() {
    const { data, error } = await supabase.from('work_orders').select('*').order('data->opened_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  async getWorkOrderById(id) {
    const { data, error } = await supabase.from('work_orders').select('*').eq('id', id).single();
    if (error) throw error;
    return data;
  },

  async getWorkOrdersByCustomer(customerId) {
    const { data, error } = await supabase.from('work_orders').select('*').eq('data->customer_id', customerId);
    if (error) throw error;
    return data;
  },

  async createWorkOrder(workOrder) {
    const { data, error } = await supabase.from('work_orders').insert([workOrder]).select();
    if (error) throw error;
    return data[0];
  },

  async updateWorkOrder(id, updates) {
    const { data, error } = await supabase.from('work_orders').update(updates).eq('id', id).select();
    if (error) throw error;
    return data[0];
  },

  // INVENTORY
  async getInventory() {
    const { data, error } = await supabase.from('inventory').select('*');
    if (error) throw error;
    return data;
  },

  async createInventoryItem(item) {
    const { data, error } = await supabase.from('inventory').insert([item]).select();
    if (error) throw error;
    return data[0];
  },

  async updateInventoryItem(id, updates) {
    const { data, error } = await supabase.from('inventory').update(updates).eq('id', id).select();
    if (error) throw error;
    return data[0];
  },

  // INSPECTIONS
  async getInspections() {
    const { data, error } = await supabase.from('inspections').select('*');
    if (error) throw error;
    return data;
  },

  async getInspectionsByWorkOrder(workOrderId) {
    const { data, error } = await supabase.from('inspections').select('*').eq('data->work_order_id', workOrderId);
    if (error) throw error;
    return data;
  },

  async createInspection(inspection) {
    const { data, error } = await supabase.from('inspections').insert([inspection]).select();
    if (error) throw error;
    return data[0];
  },

  async updateInspection(id, updates) {
    const { data, error } = await supabase.from('inspections').update(updates).eq('id', id).select();
    if (error) throw error;
    return data[0];
  },
};

export default supabase;
