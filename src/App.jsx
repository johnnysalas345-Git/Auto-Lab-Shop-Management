import { useEffect, useState } from 'react'
import { supabase, supabaseConfigured } from './lib/supabase.js'
import { APP_NAME, APP_VERSION } from './version.js'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  async function signIn(e) {
    e.preventDefault()
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setError(error.message)
  }

  return (
    <form className="card login" onSubmit={signIn}>
      <h2>Sign in</h2>
      <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
      {error && <div className="err">{error}</div>}
      <button type="submit">Sign in</button>
    </form>
  )
}

function Home({ staff }) {
  const isTech = staff.role === 'technician'
  return (
    <div className="wrap">
      <div className="card">
        <h2>Welcome, {staff.full_name}</h2>
        <p>Role: <span className="tag">{staff.role}</span></p>
      </div>
      <div className="card">
        <h2>Technician inspection (prototype)</h2>
        <p>The tablet inspection sheet approved on 2026-11-10. Not yet connected to work orders.</p>
        <a className="btn" href="/prototypes/inspection.html">Open inspection sheet</a>
      </div>
      {!isTech && (
        <div className="card">
          <h2>Coming next</h2>
          <p>Customers and vehicles → work orders → inspections → invoices (AL series) and payments → WhatsApp links.</p>
        </div>
      )}
    </div>
  )
}

export default function App() {
  const [session, setSession] = useState(null)
  const [staff, setStaff] = useState(null)
  const [loading, setLoading] = useState(supabaseConfigured)

  useEffect(() => {
    if (!supabaseConfigured) return
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setLoading(false)
    })
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s))
    return () => sub.subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (!session) { setStaff(null); return }
    supabase.from('staff').select('*').eq('id', session.user.id).maybeSingle()
      .then(({ data }) => setStaff(data))
  }, [session])

  let body
  if (!supabaseConfigured) {
    body = (
      <div className="wrap"><div className="card">
        <h2>Not connected yet</h2>
        <p>Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY (see .env.example).</p>
      </div></div>
    )
  } else if (loading) body = <div className="wrap">Loading…</div>
  else if (!session) body = <Login />
  else if (!staff) {
    body = (
      <div className="wrap"><div className="card">
        <h2>No staff profile</h2>
        <p>You are signed in, but the owner has not added you as staff yet.</p>
      </div></div>
    )
  } else body = <Home staff={staff} />

  return (
    <>
      <div className="top">
        <h1>{APP_NAME}</h1>
        <span className="ver">{APP_VERSION}</span>
        {session && <button onClick={() => supabase.auth.signOut()}>Sign out</button>}
      </div>
      {body}
    </>
  )
}
