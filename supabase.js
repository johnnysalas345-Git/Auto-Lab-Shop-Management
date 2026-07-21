import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export const db = {
  async getCustomers() {
    const { data, error } = await supabase.from('customers').select('*');
    if (error) throw error;
    return data;
  },

  async getVehicles() {
    const { data, error } = await supabase.from('vehicles').select('*');
    if (error) throw error;
    return data;
  },

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

  async getInventory() {
    const { data, error } = await supabase.from('inventory').select('*');
    if (error) throw error;
    return data;
  },

  async getInspections() {
    const { data, error } = await supabase.from('inspections').select('*');
    if (error) throw error;
    return data;
  },
};

export default supabase;