import { supabase } from "./supabase";

/*
  Stands in for the artifact's window.storage.

  The app thinks in whole collections — { invoices: [...], expenses: [...] } —
  so that shape is kept. Underneath, each record is its own row, which is what
  lets the database deny payroll to the service writer. Reads go through RPCs
  that redact per role; writes go to the tables, where RLS has the final say.
*/

const TABLE = {
  invoices: "invoices",
  expenses: "expenses",
  payroll: "payroll",
  timesheets: "timesheets",
  cashTx: "cash_tx",
  activity: "activity",
};

export const EMPTY = { invoices: [], expenses: [], payroll: [], timesheets: [], cashTx: [], activity: [] };

/* Only push rows that actually changed. Without this, every keystroke-triggered
   save would re-upsert the entire ledger. */
const lastWritten = new Map();
const key = (kind, id) => kind + ":" + id;

export async function loadLedger() {
  const { data, error } = await supabase.rpc("load_ledger");
  if (error) throw error;
  const led = { ...EMPTY, ...(data || {}) };
  Object.keys(TABLE).forEach((kind) => {
    (led[kind] || []).forEach((r) => lastWritten.set(key(kind, r.id), JSON.stringify(r)));
  });
  return led;
}

export async function loadSettings() {
  const { data, error } = await supabase.rpc("load_settings");
  if (error) throw error;
  return data || {};
}

export async function saveSettingsRow(next) {
  const { error } = await supabase.from("settings").upsert({ id: 1, data: next });
  // the writer has no business writing settings; the database says so and we don't pretend otherwise
  if (error) throw error;
}

export async function saveRecords(kind, records) {
  const table = TABLE[kind];
  if (!table || !records.length) return;
  const rows = records
    .filter((r) => lastWritten.get(key(kind, r.id)) !== JSON.stringify(r))
    .map((r) => ({ id: r.id, data: r }));
  if (!rows.length) return;
  const { error } = await supabase.from(table).upsert(rows);
  if (error) throw error;
  rows.forEach((row) => lastWritten.set(key(kind, row.id), JSON.stringify(row.data)));
}

/* Activity is the one collection that gets hard-pruned by date range, so we also
   delete rows that are no longer present. Other collections use soft-delete. */
async function pruneActivity(rows) {
  const ids = new Set(rows.map((r) => r.id));
  const gone = [...lastWritten.keys()]
    .filter((k) => k.startsWith("activity:"))
    .map((k) => k.slice("activity:".length))
    .filter((id) => !ids.has(id));
  if (gone.length) {
    const { error } = await supabase.from("activity").delete().in("id", gone);
    if (error) throw error;
    gone.forEach((id) => lastWritten.delete("activity:" + id));
  }
}

/* The app hands over a whole ledger; work out what moved and send only that. */
export async function saveLedgerDiff(led) {
  const jobs = Object.keys(TABLE).map((kind) => saveRecords(kind, led[kind] || []));
  const results = await Promise.allSettled(jobs);
  // activity may have been pruned; sync deletions too
  try { await pruneActivity(led.activity || []); } catch (e) { results.push({ status: "rejected", reason: e }); }
  const failed = results.filter((r) => r.status === "rejected");
  if (failed.length) throw failed[0].reason;
}

export async function loadProfile() {
  const { data: auth } = await supabase.auth.getUser();
  if (!auth?.user) return null;
  const { data, error } = await supabase.from("profiles").select("id,name,role").eq("id", auth.user.id).single();
  if (error) return null;
  return data;
}
