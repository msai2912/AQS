'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function AdminDashboard() {
  const [queueData, setQueueData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase.from('queue_status').select('*');
      if (error) console.error('Fetch error:', error);
      else setQueueData(data);
    };

    fetchData();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2">Service</th>
            <th className="p-2">Queue Count</th>
          </tr>
        </thead>
        <tbody>
          {queueData &&
            queueData.map((row: any) => (
              <tr key={row.id}>
                <td className="border p-2">Canteen</td>
                <td className="border p-2">{row.canteen}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
