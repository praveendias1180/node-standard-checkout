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
}

const load_paypal = (clientId, clientToken) => {
  const paypal_script = document.createElement('script')
  paypal_script.src = 'https://www.paypal.com/sdk/js?components=buttons,hosted-fields&client-id=' + clientId
  paypal_script.setAttribute('data-client-token', clientToken)
  document.head.append(paypal_script)
  paypal_script.addEventListener("load", () => load_paypal_buttons())
}

const load_paypal_buttons = () => {
  let orderId
  const ls_item = localStorage.getItem('ls_api_data')
  const api_access_code = ls_item ? JSON.parse(ls_item).api_access_code : ''

  paypal
  .Buttons({
    // Sets up the transaction when a payment button is clicked
    createOrder: function (data, actions) {
      console.log(data, actions)
      return fetch(FN_CREATE_ORDER, {
        method: 'POST',
        headers: { 'Authorization': 'Bearer ' + SUPABASE_ANON_PUBLIC, 'Content-Type': 'application/json', 'api-access-code': api_access_code },
        body: JSON.stringify({ name: 'Praveen' })
      })
        .then((response) => response.json())
        .then((order) => {
          orderId = order.order.id
          return order.order.id
        });
    },
    // Finalize the transaction after payer approval
    onApprove: function (data, actions) {
      document.getElementById("paypal-button-container").innerHTML =  '<div id="loader" class="spinner-border" role="status"> \
      <span class="visually-hidden">Loading...</span> \
      </div>'
      console.log(data, actions)
      fetch(FN_CAPTURE_PAYMENT, {
        method: 'POST',
        headers: { 'Authorization': 'Bearer ' + SUPABASE_ANON_PUBLIC, 'Content-Type': 'application/json', 'api-access-code': api_access_code },
        body: JSON.stringify({ orderId: orderId })
      })
        .then((response) => response.json())
        .then((orderData) => {
          // Successful capture! For dev/demo purposes:
          console.log( "Capture result", orderData, JSON.stringify(orderData, null, 2));
          const transaction = orderData.purchase_units[0].payments.captures[0];
          console.log(`Transaction ${transaction.status}: ${transaction.id}
            See console for all available details
          `);
          document.getElementById("paypal-button-container").innerHTML = `Transaction ${transaction.status}: ${transaction.id}`
          // When ready to go live, remove the alert and show a success message within this page. For example:
          // var element = document.getElementById('paypal-button-container');
          // element.innerHTML = '<h3>Thank you for your payment!</h3>';
          // Or go to another URL:  actions.redirect('thank_you.html');
        });
    },
  })
  .render("#paypal-button-container");
}

const get_client_token = async () => {
  const ls_item = localStorage.getItem('ls_api_data')
  const api_access_code = ls_item ? JSON.parse(ls_item).api_access_code : ''
  return await fetch(FN_GET_CLIENT_SECRET, {
    method: 'POST',
    headers: { 'Authorization': 'Bearer ' + SUPABASE_ANON_PUBLIC, 'api-access-code': api_access_code },
  }).then((res) => res.json()).then((json) => json.client_token)
}
