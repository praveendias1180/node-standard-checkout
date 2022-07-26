const SUPABASE_ANON_PUBLIC = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBqc2hjYm93cXpsenpwdHJycnp2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2NTgyODE3MjgsImV4cCI6MTk3Mzg1NzcyOH0.TLq_1phstRu6THwhex3SSA6tmRQRwcRLnIsNhgBx5hY'
const FN_GET_USER = 'https://pjshcbowqzlzzptrrrzv.functions.supabase.co/get-user'
const LO_GET_USER_ = 'http://localhost:54321/functions/v1/'
const LO_ANON_PUBLIC = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24ifQ.625_WdcF3KHqz5amU0x2X5WWHP-OEs_4qj0ssLNHzTs'

this.addEventListener('load', () => window_load());

const window_load = () => {
    const { createClient } = supabase
    const _supabase = createClient('https://pjshcbowqzlzzptrrrzv.supabase.co', SUPABASE_ANON_PUBLIC)

    const saveButton = document.getElementById('save-button')
    saveButton.addEventListener('click', () => save(_supabase))

    const deleteButton = document.getElementById('delete-button')
    deleteButton.addEventListener('click', () => delete_token(_supabase))

    const userButton = document.getElementById('user-button')
    userButton.addEventListener('click', () => get_user())

}

const save = (supabase) => {
    console.log(supabase)
    const api_access_code = document.getElementById('api_access_code').value
    const ls_api_data = JSON.stringify({api_access_code})
    localStorage.setItem('ls_api_data', ls_api_data)
    console.log(api_access_code)
    alert('Access Token Saved')

}

const delete_token = () => {
    localStorage.removeItem('ls_api_data')
    alert('Access Token Deleted')
}

const get_user = async () => {
    console.log('Get User')

    const testing = false
    let server_url, the_key

    if (testing) {
        server_url = LO_GET_USER_
        the_key = LO_ANON_PUBLIC
    } else {
        server_url = FN_GET_USER
        the_key = SUPABASE_ANON_PUBLIC
    }

    const ls_item = localStorage.getItem('ls_api_data')
    const api_access_code = ls_item ? JSON.parse(ls_item).api_access_code : ''

    await fetch(server_url, {
        method: 'POST',
        headers: { 'Authorization': 'Bearer ' + the_key, 'Content-Type': 'application/json', 'api-access-code': api_access_code },
        body: JSON.stringify({ name: 'Praveen' })
    }).then((res) => res.json())
        .then((json) => {
            console.log(json)
        })
}