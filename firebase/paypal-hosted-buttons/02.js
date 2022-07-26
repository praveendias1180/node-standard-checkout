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
  // If this returns false or the card fields aren't visible, see Step #1.
  if (paypal.HostedFields.isEligible()) {
    let orderId;

    const ls_item = localStorage.getItem('ls_api_data')
    const api_access_code = ls_item ? JSON.parse(ls_item).api_access_code : ''

    // Renders card fields
    paypal.HostedFields.render({
      // Call your server to set up the transaction
      createOrder: () => {
        return fetch(FN_CREATE_ORDER, {
          method: 'POST',
          headers: { 'Authorization': 'Bearer ' + SUPABASE_ANON_PUBLIC, 'Content-Type': 'application/json', 'api-access-code': api_access_code },
          body: JSON.stringify({ name: 'Praveen' })
        })
          .then((res) => res.json())
          .then((json) => {
            orderId = json.order.id
            return json.order.id
          });
      },
      styles: {
        ".valid": {
          color: "green",
        },
        ".invalid": {
          color: "red",
        },
      },
      fields: {
        number: {
          selector: "#card-number",
          placeholder: "4111 1111 1111 1111",
        },
        cvv: {
          selector: "#cvv",
          placeholder: "123",
        },
        expirationDate: {
          selector: "#expiration-date",
          placeholder: "MM/YY",
        },
      },
    }).then((cardFields) => {
      document.querySelector("#card-form").addEventListener("submit", (event) => {
        event.preventDefault();
        cardFields
          .submit({
            // Cardholder's first and last name
            cardholderName: document.getElementById("card-holder-name").value,
            // Billing Address
            billingAddress: {
              // Street address, line 1
              streetAddress: document.getElementById(
                "card-billing-address-street"
              ).value,
              // Street address, line 2 (Ex: Unit, Apartment, etc.)
              extendedAddress: document.getElementById(
                "card-billing-address-unit"
              ).value,
              // State
              region: document.getElementById("card-billing-address-state").value,
              // City
              locality: document.getElementById("card-billing-address-city")
                .value,
              // Postal Code
              postalCode: document.getElementById("card-billing-address-zip")
                .value,
              // Country Code
              countryCodeAlpha2: document.getElementById(
                "card-billing-address-country"
              ).value,
            },
          })
          .then(() => {
            document.getElementById("card-form").innerHTML =  '<div id="loader" class="spinner-border" role="status"> \
            <span class="visually-hidden">Loading...</span> \
            </div>'
            fetch(FN_CAPTURE_PAYMENT, {
              method: 'POST',
              headers: { 'Authorization': 'Bearer ' + SUPABASE_ANON_PUBLIC, 'Content-Type': 'application/json', 'api-access-code': api_access_code },
              body: JSON.stringify({ orderId: orderId })
            })
              .then((res) => res.json())
              .then((orderData) => {
                console.log(orderData)
                // Two cases to handle:
                //   (1) Other non-recoverable errors -> Show a failure message
                //   (2) Successful transaction -> Show confirmation or thank you
                // This example reads a v2/checkout/orders capture response, propagated from the server
                // You could use a different API or structure for your 'orderData'
                const errorDetail =
                  Array.isArray(orderData.details) && orderData.details[0];
                if (errorDetail) {
                  let msg = "Sorry, your transaction could not be processed.";
                  if (errorDetail.description)
                    msg += "\n\n" + errorDetail.description;
                  if (orderData.debug_id) msg += " (" + orderData.debug_id + ")";
                  return console.log(msg); // Show a failure message
                }
                // Show a success message or redirect
                console.log("Transaction completed!");
                document.getElementById("card-form").innerHTML = 'Transaction completed! ' + orderData.id
              });
          })
          .catch((err) => {
            console.log("Payment could not be captured! " + JSON.stringify(err));
          });
      });
    });
  } else {
    console.log('paypal.HostedFields.isEligible = false')
    // Hides card fields if the merchant isn't eligible
    document.querySelector("#card-form").style = "display: none";
  }
}

const get_client_token = async () => {
  const ls_item = localStorage.getItem('ls_api_data')
  const api_access_code = ls_item ? JSON.parse(ls_item).api_access_code : ''
  return await fetch(FN_GET_CLIENT_SECRET, {
    method: 'POST',
    headers: { 'Authorization': 'Bearer ' + SUPABASE_ANON_PUBLIC, 'api-access-code': api_access_code },
  }).then((res) => res.json()).then((json) => json.client_token)
}
