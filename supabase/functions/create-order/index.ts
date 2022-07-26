// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { serve } from "https://deno.land/std@0.131.0/http/server.ts";
import { corsHeaders } from '../_shared/cors.ts'
import { accessCodeCheck } from '../_shared/accessCodeCheck.ts'

const CLIENT_ID = Deno.env.get("CLIENT_ID");
const APP_SECRET = Deno.env.get("APP_SECRET");

serve(async (req) => {

  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const api_access_code = req.headers.get('api-access-code') ?? ''
  const check_response = accessCodeCheck(api_access_code)
  if(check_response) return check_response

  const { name } = await req.json();
  const base = "https://api-m.sandbox.paypal.com";

  async function createOrder() {
    const purchaseAmount = "100.00"; // TODO: pull amount from a database or session
    const accessToken = await generateAccessToken();

    const url = `${base}/v2/checkout/orders`;
    const response = await fetch(url, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [
          {
            amount: {
              currency_code: "USD",
              value: purchaseAmount,
            },
          },
        ],
      }),
    });
    const data = await response.json();
    return data;
  }

  async function generateAccessToken() {
    const auth = btoa(`${CLIENT_ID}:${APP_SECRET}`);
    const response = await fetch(`${base}/v1/oauth2/token`, {
      method: "post",
      body: "grant_type=client_credentials",
      headers: {
        Authorization: `Basic ${auth}`,
      },
    });
    const data = await response.json();
    return data.access_token;
  }

  const data = {
    order: await createOrder(),
    message: `Hello ${name}!`,
  };

  return new Response(
    JSON.stringify(data),
    { headers: { ...corsHeaders, "Content-Type": "application/json" } },
  );
});

// To invoke:
// curl -i --location --request POST 'http://localhost:54321/functions/v1/' \
//   --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24ifQ.625_WdcF3KHqz5amU0x2X5WWHP-OEs_4qj0ssLNHzTs' \
//   --header 'Content-Type: application/json' \
//   --data '{"name":"Functions"}'
