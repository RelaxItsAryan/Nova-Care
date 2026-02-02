import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const STILL_LOADING_API_KEY = Deno.env.get("STILL_LOADING_API_KEY");
    
    if (!STILL_LOADING_API_KEY) {
      console.error("STILL_LOADING_API_KEY is not configured");
      throw new Error("STILL_LOADING_API_KEY is not configured");
    }

    console.log("Calling Still Loading AI Gateway with", messages.length, "messages");

    const response = await fetch("https://backend-1-f58a.onrender.com/chat", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${STILL_LOADING_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { 
            role: "system", 
            content: `You are Nova, a compassionate and knowledgeable AI health assistant. You provide helpful, accurate medical information while being warm and supportive. 

Key guidelines:
- Always recommend consulting a healthcare professional for specific medical advice
- Be empathetic and understanding about health concerns
- Provide general wellness tips and health education
- Never diagnose conditions or prescribe treatments
- Use clear, easy-to-understand language
- Be encouraging about healthy lifestyle choices
- If someone describes an emergency, advise them to seek immediate medical help
- restrict limit to only medical queries of there is any other query simply say this is for medical use only 

Keep responses concise but helpful, typically 2-4 sentences unless more detail is requested.`
          },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limits exceeded, please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Payment required, please add funds to your workspace." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log("Streaming response from AI gateway");

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("Chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
