import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const huggingFaceApiKey = Deno.env.get('HUGGING_FACE_ACCESS_TOKEN');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt, category, layout } = await req.json();

    if (!huggingFaceApiKey) {
      return new Response(
        JSON.stringify({ error: 'Hugging Face API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Generating AI template with prompt:', prompt);

    const response = await fetch('https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-schnell', {
      method: 'POST', 
      headers: {
        'Authorization': `Bearer ${huggingFaceApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: `${prompt}. Professional print quality, clean lines, high contrast, minimalist design suitable for office printing`,
        parameters: {
          width: 1024,
          height: 640,  // 3.5:2 business card ratio optimized
          num_inference_steps: 8,  // Higher quality for print
          guidance_scale: 7.5  // Better prompt adherence
        }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Hugging Face API error:', errorText);
      return new Response(
        JSON.stringify({ error: 'Failed to generate image', details: errorText }),
        { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const imageBlob = await response.blob();
    const arrayBuffer = await imageBlob.arrayBuffer();
    const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
    const imageUrl = `data:image/png;base64,${base64}`;

    console.log('AI image generated successfully:', imageUrl);

    const generatedTemplate = {
      id: `ai-${category}-${layout}-${Date.now()}`,
      name: `AI ${category.replace('_', ' ')} - ${layout.replace('_', ' ')}`,
      generatedImageUrl: imageUrl,
      layoutType: layout,
      printOptimized: true,
      category,
      prompt
    };

    return new Response(
      JSON.stringify({ template: generatedTemplate }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in generate-ai-template function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});