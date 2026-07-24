import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient('https://gvsbbpuuoxluqaiovtvx.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd2c2JicHV1b3hsdXFhaW92dHZ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQyMjE3MzUsImV4cCI6MjA5OTc5NzczNX0.fIXxADQkEPSK2wYoI5rFdkr4X4P0gSI_wmr50XUajY0');

export default function App() {
  const [page, setPage] = useState('dashboard');
  const [showMenu, setShowMenu] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [vehicles, setVehicles] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const c = await supabase.from('customers').select('*');
      const v = await supabase.from('vehicles').select('*');
      setCustomers(c.data || []);
      setVehicles(v.data || []);
    } catch (e) {
      console.log('Error:', e);
    }
  };

  const custMap = {};
  customers.forEach(c => {
    custMap[c.id] = vehicles.filter(v => v.customer_id === c.id);
  });

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', fontFamily: 'Arial' }}>
      {/* HEADER */}
      <div style={{ background: '#E3F0FF', borderBottom: '1px solid #ddd', padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ position: 'relative' }}>
          <button onClick={() => setShowMenu(!showMenu)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
            <div style={{ fontSize: 18, fontWeight: 'bold' }}>
              <span>AUTO</span><span style={{ color: '#E53935' }}>LAB</span>
            </div>
            <div style={{ fontSize: 11, fontWeight: 'bold' }}>MENU</div>
          </button>

          {showMenu && (
            <div style={{ position: 'absolute', top: 50, left: 0, background: 'white', border: '1px solid #ddd', width: 160, zIndex: 1000 }}>
              <button onClick={() => { setPage('dashboard'); setShowMenu(false); }} style={{ display: 'block', width: '100%', padding: '10px', border: 'none', background: page === 'dashboard' ? '#E3F0FF' : 'white', textAlign: 'left', cursor: 'pointer', fontSize: 12, fontWeight: 'bold', borderBottom: '1px solid #ddd' }}>
                Dashboard
              </button>
              <button onClick={() => { setPage('customers'); setShowMenu(false); }} style={{ display: 'block', width: '100%', padding: '10px', border: 'none', background: page === 'customers' ? '#E3F0FF' : 'white', textAlign: 'left', cursor: 'pointer', fontSize: 12, fontWeight: 'bold' }}>
                Customers
              </button>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ fontSize: 12, fontWeight: 'bold' }}>Johnny</div>
          <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#4A90E2', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>J</div>
        </div>
      </div>

      {/* CONTENT */}
      <div style={{ flex: 1, overflow: 'auto', padding: '20px' }}>
        {page === 'dashboard' && (
          <div>
            <h1 style={{ margin: '0 0 20px 0', color: '#333' }}>Dashboard</h1>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              <div style={{ background: 'white', border: '1px solid #ddd', padding: 20, borderRadius: 4 }}>
                <h2 style={{ margin: 0, fontSize: 16, color: '#333' }}>Today's Workflow</h2>
                <p style={{ margin: '10px 0 0 0', color: '#999', fontSize: 14 }}>No jobs today</p>
              </div>
              <div style={{ background: 'white', border: '1px solid #ddd', padding: 20, borderRadius: 4 }}>
                <h2 style={{ margin: 0, fontSize: 16, color: '#333' }}>Job Status</h2>
                <p style={{ margin: '10px 0 0 0', color: '#999', fontSize: 14 }}>Active jobs: 0</p>
              </div>
            </div>
          </div>
        )}

        {page === 'customers' && (
          <div>
            <h1 style={{ margin: '0 0 20px 0', color: '#333' }}>Customers & Vehicles</h1>
            <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white', border: '1px solid #ddd' }}>
              <thead>
                <tr style={{ background: '#E3F0FF' }}>
                  <th style={{ padding: 12, textAlign: 'left', fontSize: 13, fontWeight: 'bold', borderBottom: '1px solid #ddd' }}>Name</th>
                  <th style={{ padding: 12, textAlign: 'left', fontSize: 13, fontWeight: 'bold', borderBottom: '1px solid #ddd' }}>Phone</th>
                  <th style={{ padding: 12, textAlign: 'center', fontSize: 13, fontWeight: 'bold', borderBottom: '1px solid #ddd' }}>Brand</th>
                  <th style={{ padding: 12, textAlign: 'center', fontSize: 13, fontWeight: 'bold', borderBottom: '1px solid #ddd' }}>Model</th>
                  <th style={{ padding: 12, textAlign: 'center', fontSize: 13, fontWeight: 'bold', borderBottom: '1px solid #ddd' }}>Plate</th>
                  <th style={{ padding: 12, textAlign: 'center', fontSize: 13, fontWeight: 'bold', borderBottom: '1px solid #ddd' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {customers.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ padding: 40, textAlign: 'center', color: '#999' }}>No customers yet</td>
                  </tr>
                ) : (
                  customers.map(cust => {
                    const vehList = custMap[cust.id] || [];
                    return vehList.map((veh, idx) => (
                      <tr key={veh.id} style={{ borderBottom: '1px solid #ddd' }}>
                        <td style={{ padding: 12, fontSize: 13 }}>{idx === 0 ? cust.data?.name : ''}</td>
                        <td style={{ padding: 12, fontSize: 13 }}>{idx === 0 ? cust.data?.phone : ''}</td>
                        <td style={{ padding: 12, textAlign: 'center', fontSize: 13 }}>{veh.data?.make}</td>
                        <td style={{ padding: 12, textAlign: 'center', fontSize: 13 }}>{veh.data?.model}</td>
                        <td style={{ padding: 12, textAlign: 'center', fontSize: 13, fontWeight: 'bold', color: '#4A90E2' }}>{veh.data?.license_plate}</td>
                        <td style={{ padding: 12, textAlign: 'center' }}>
                          <button style={{ width: 32, height: 32, margin: '0 3px', borderRadius: 3, border: 'none', background: '#4CAF50', cursor: 'pointer', fontSize: 14 }}>👁️</button>
                          <button style={{ width: 32, height: 32, margin: '0 3px', borderRadius: 3, border: 'none', background: '#FF9800', cursor: 'pointer', fontSize: 14 }}>🔧</button>
                          <button style={{ width: 32, height: 32, margin: '0 3px', borderRadius: 3, border: 'none', background: '#2196F3', cursor: 'pointer', fontSize: 14 }}>🧮</button>
                          <button style={{ width: 32, height: 32, margin: '0 3px', borderRadius: 3, border: 'none', background: '#9C27B0', cursor: 'pointer', fontSize: 14 }}>📋</button>
                        </td>
                      </tr>
                    ));
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showMenu && <div onClick={() => setShowMenu(false)} style={{ position: 'fixed', inset: 0, zIndex: 500 }} />}
    </div>
  );
}
