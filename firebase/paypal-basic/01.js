const FN_GET_CLIENT_SECRET = 'https://pjshcbowqzlzzptrrrzv.functions.supabase.co/get-client-secret'
const FN_CREATE_ORDER = 'https://pjshcbowqzlzzptrrrzv.functions.supabase.co/create-order'
const FN_CAPTURE_PAYMENT = 'https://pjshcbowqzlzzptrrrzv.functions.supabase.co/capture-payment'
const SUPABASE_ANON_PUBLIC = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBqc2hjYm93cXpsenpwdHJycnp2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2NTgyODE3MjgsImV4cCI6MTk3Mzg1NzcyOH0.TLq_1phstRu6THwhex3SSA6tmRQRwcRLnIsNhgBx5hY'
const PAYPAL_CLIENT_ID = 'AY10tyaJIxGFwPnFM4pk5dZMTWkdxGa1mAd1hmrAkNh77lUG9RXviyo6_G-l7ROmILGKBG_AGBrG4mSd'

this.addEventListener('load', () => window_load());

const window_load = async () => {
  const clientId = PAYPAL_CLIENT_ID
  const clientToken = await get_client_token()
  load_paypal(clientId, clientToken)

  const createPaymentButton = document.getElementById('create-order')
  createPaymentButton.addEventListener('click', () => create_order())

  const capturePaymentButton = document.getElementById('capture-payment')
  capturePaymentButton.addEventListener('click', () => capture_payment(document.getElementById('order-id').innerHTML))
}

const load_paypal = (clientId, clientToken) => {
  const paypal_script = document.createElement('script')
  paypal_script.src = 'https://www.paypal.com/sdk/js?components=buttons,hosted-fields&client-id=' + clientId
  paypal_script.setAttribute('data-client-token', clientToken)
  document.head.append(paypal_script)
}

const get_client_token = async () => {
  const ls_item = localStorage.getItem('ls_api_data')
  const api_access_code = ls_item ? JSON.parse(ls_item).api_access_code : ''
  return await fetch(FN_GET_CLIENT_SECRET, {
    method: 'POST',
    headers: { 'Authorization': 'Bearer ' + SUPABASE_ANON_PUBLIC, 'api-access-code': api_access_code },
  }).then((res) => res.json()).then((json) => json.client_token)
}

const create_order = async () => {
  const ls_item = localStorage.getItem('ls_api_data')
  const api_access_code = ls_item ? JSON.parse(ls_item).api_access_code : ''
  loading(true)
  return await fetch(FN_CREATE_ORDER, {
    method: 'POST',
    headers: { 'Authorization': 'Bearer ' + SUPABASE_ANON_PUBLIC, 'Content-Type': 'application/json', 'api-access-code': api_access_code },
    body: JSON.stringify({ name: 'Praveen' })
  }).then((res) => res.json())
    .then((json) => {
      console.log(json)
      document.getElementById('order-id').innerHTML = json.order.id
      loading(false)
    })
}

const capture_payment = async (orderId) => {
  const ls_item = localStorage.getItem('ls_api_data')
  const api_access_code = ls_item ? JSON.parse(ls_item).api_access_code : ''
  loading(true)
  return await fetch(FN_CAPTURE_PAYMENT, {
    method: 'POST',
    headers: { 'Authorization': 'Bearer ' + SUPABASE_ANON_PUBLIC, 'Content-Type': 'application/json', 'api-access-code': api_access_code  },
    body: JSON.stringify({ orderId: orderId })
  }).then((res) => res.json()).then((json) => {
    loading(false)
    console.log(json)
  })
}

const loading = state => {
  document.getElementById('loader').style.display = state ? 'block' : 'none'
}

