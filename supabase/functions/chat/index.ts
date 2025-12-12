import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, userId } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Fetch user's uploaded files for context
    const { data: files } = await supabase
      .from('user_files')
      .select('file_name, content')
      .eq('user_id', userId);

    // Build context from uploaded files
    let fileContext = '';
    if (files && files.length > 0) {
      fileContext = files
        .filter(f => f.content)
        .map(f => `--- Content from ${f.file_name} ---\n${f.content}`)
        .join('\n\n');
    }

    // Fetch recent conversation history
    const { data: chatHistory } = await supabase
      .from('chat_messages')
      .select('role, content')
      .eq('user_id', userId)
      .order('created_at', { ascending: true })
      .limit(20);

    const messages = [
      {
        role: 'system',
        content: `You are StudyMate, an AI tutor that helps students learn from their course materials. 

IMPORTANT RULES:
1. ONLY answer questions based on the provided course materials below.
2. If the question cannot be answered from the provided materials, politely say "I don't have information about that in your uploaded materials. Please upload relevant study materials or rephrase your question."
3. If there are no uploaded materials, encourage the user to upload their notes, textbooks, or study materials first.
4. Be encouraging, helpful, and explain concepts clearly.
5. Use examples from the materials when possible.
6. If asked about topics outside the materials, you may provide brief general knowledge but always note it's not from their course materials.

USER'S UPLOADED MATERIALS:
${fileContext || 'No materials uploaded yet. Please encourage the user to upload their study materials.'}`
      }
    ];

    // Add conversation history
    if (chatHistory && chatHistory.length > 0) {
      chatHistory.forEach(msg => {
        messages.push({ role: msg.role, content: msg.content });
      });
    }

    // Add current message
    messages.push({ role: 'user', content: message });

    console.log('Sending request to Lovable AI with context from', files?.length || 0, 'files');

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages,
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: 'Usage limit reached. Please add credits.' }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      throw new Error('AI gateway error');
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, 'Content-Type': 'text/event-stream' },
    });
  } catch (error: unknown) {
    console.error('Chat function error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
