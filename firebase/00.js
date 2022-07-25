const SUPABASE_ANON_PUBLIC = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBqc2hjYm93cXpsenpwdHJycnp2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2NTgyODE3MjgsImV4cCI6MTk3Mzg1NzcyOH0.TLq_1phstRu6THwhex3SSA6tmRQRwcRLnIsNhgBx5hY'


this.addEventListener('load', () => window_load());

const window_load = () => {
    const { createClient } = supabase
    const _supabase = createClient('https://pjshcbowqzlzzptrrrzv.supabase.co', SUPABASE_ANON_PUBLIC)
    console.log('Supabase Instance: ', _supabase)
    const loginButton = document.getElementById('login-button')
    loginButton.addEventListener('click', () => login(_supabase))

    const logoutButton = document.getElementById('logout-button')
    logoutButton.addEventListener('click', () => logout(_supabase))
}

const login = async (supabase) => {
    const email = document.getElementById('login-email').value
    const { user, error } = await supabase.auth.signIn({
        email: email,
    })
    console.log(user, error)
    if(!error){
        document.getElementById('auth').innerHTML = 'Link sent. Please check the email.'
    }
}

const logout = (supabase) => {
    supabase.auth
    .signOut()
    .then((_response) => {
      alert('Logout successful')
    })
    .catch((err) => {
      alert(err.response.text)
    })
}