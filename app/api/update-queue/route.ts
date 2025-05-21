import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // use service role key for write access
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(request) {
  try {
    const { queueType, increment } = await request.json();

    if (!['canteen', 'fee_counter', 'stationary'].includes(queueType)) {
      return new Response(JSON.stringify({ error: 'Invalid queue type' }), {
        status: 400,
      });
    }

    if (typeof increment !== 'number') {
      return new Response(
        JSON.stringify({ error: 'Invalid increment value' }),
        { status: 400 }
      );
    }

    // Update the queue count atomically
    const { data, error } = await supabase.rpc('increment_queue', {
      queue_type: queueType,
      increment_val: increment,
    });

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
      });
    }

    return new Response(JSON.stringify({ success: true, data }), {
      status: 200,
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
}
