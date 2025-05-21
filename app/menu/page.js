'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function HomePage() {
  const [queueStatus, setQueueStatus] = useState({
    canteen: 0,
    fee_counter: 0,
    stationary: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchInitialQueueStatus() {
      const { data, error } = await supabase
        .from('queue_status')
        .select('*')
        .single();

      if (error) {
        console.error('Error fetching initial queue status:', error);
      } else if (data) {
        setQueueStatus({
          canteen: data.canteen,
          fee_counter: data.fee_counter,
          stationary: data.stationary,
        });
      }
      setLoading(false);
    }

    fetchInitialQueueStatus();

    // Setup realtime subscription to update queue status dynamically
    const subscription = supabase
      .channel('public:queue_status')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'queue_status' },
        (payload) => {
          if (
            payload.eventType === 'UPDATE' ||
            payload.eventType === 'INSERT'
          ) {
            const updated = payload.new;
            setQueueStatus({
              canteen: updated.canteen,
              fee_counter: updated.fee_counter,
              stationary: updated.stationary,
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  if (loading)
    return <div className="p-10 text-center">Loading queue status...</div>;

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">
      <h1 className="text-4xl font-bold mb-10 text-gray-800">
        University Queue Management System
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">
        {/* Canteen Card */}
        <Link href="/menu/canteen" className="no-underline">
          <div className="bg-white shadow-md rounded-lg p-6 hover:shadow-xl transition duration-300 flex flex-col items-center cursor-pointer">
            <h2 className="text-2xl font-semibold mb-4">Canteen</h2>
            <p className="text-gray-600 mb-2">Current Queue:</p>
            <p className="text-3xl font-bold text-green-600">
              {queueStatus.canteen}
            </p>
          </div>
        </Link>

        {/* Fee Counter Card */}
        <Link href="/menu/fee-counter" className="no-underline">
          <div className="bg-white shadow-md rounded-lg p-6 hover:shadow-xl transition duration-300 flex flex-col items-center cursor-pointer">
            <h2 className="text-2xl font-semibold mb-4">Fee Counter</h2>
            <p className="text-gray-600 mb-2">Current Queue:</p>
            <p className="text-3xl font-bold text-blue-600">
              {queueStatus.fee_counter}
            </p>
          </div>
        </Link>

        {/* Stationary Card */}
        <Link href="/menu/stationary" className="no-underline">
          <div className="bg-white shadow-md rounded-lg p-6 hover:shadow-xl transition duration-300 flex flex-col items-center cursor-pointer">
            <h2 className="text-2xl font-semibold mb-4">Stationary</h2>
            <p className="text-gray-600 mb-2">Current Queue:</p>
            <p className="text-3xl font-bold text-purple-600">
              {queueStatus.stationary}
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
}
