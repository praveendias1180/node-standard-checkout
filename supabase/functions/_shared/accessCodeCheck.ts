import { corsHeaders } from './cors.ts'
export const accessCodeCheck = (api_access_code: string) => {
    
    if(api_access_code !== Deno.env.get("API_ACCESS_CODE")){
        return new Response(
          JSON.stringify({error: "Please check your API Access Code"}),
          { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        )
    } else {
        return false
    }
}