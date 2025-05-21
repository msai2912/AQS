// app/page.js or components/QueueStatus.js

'use client'; // important for Next.js app dir

import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

export default function HomePage() {
  const [queueStatus, setQueueStatus] = useState(null);

  useEffect(() => {
    async function fetchStatus() {
      const { data, error } = await supabase
        .from('queue_status')
        .select('*')
        .single();
      if (!error) setQueueStatus(data);
    }
    fetchStatus();
  }, []);

  if (!queueStatus) return <div>Loading...</div>;

  return (
    <div>
      <h1>Current Queue Status</h1>
      <p>Canteen: {queueStatus.canteen}</p>
      <p>Fee Counter: {queueStatus.fee_counter}</p>
      <p>Stationary: {queueStatus.stationary}</p>
    </div>
  );
}
