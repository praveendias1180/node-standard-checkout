# Firebase (Frontend) + Supabase (Backend/Serverless)

The serverless backend with 'Deno' is hosted at Supabase as 'Edge Functions'. The frontend is hosted at Google Firebase.

![](deno.png)

# Supabase

![](supabase.png)

# Base Commands

```
supabase init
supabase start
supabase functions new hello-world
supabase functions serve hello-world --env-file ./supabase/.env.local
cp ./supabase/.env.local ./supabase/.env
supabase secrets set --env-file ./supabase/.env
supabase secrets list
```

![](supabase-cli.png)

# KONG

https://konghq.com/

![](kong.png)

# Supabase related images

![](images.png)

# Demo Images

![](1-home-paypal.png)

![](2-hosted-cards.png)

![](3-paypal-button.png)

![](4-transaction-summary.png)

![](5-credit-card-payment.png)

# Demo Video

https://youtu.be/Y9k2KB90Te4