'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function HomePage() {
  const [queueStatus, setQueueStatus] = useState({
    canteen: 0,
    fee_counter: 0,
    stationary: 0,
  });

  useEffect(() => {
    async function fetchQueueStatus() {
      const { data, error } = await supabase
        .from('queue_status')
        .select('*')
        .eq('id', 1)
        .single();

      if (error) {
        console.error('Error fetching queue status:', error);
      } else {
        setQueueStatus({
          canteen: data.canteen,
          fee_counter: data.fee_counter,
          stationary: data.stationary,
        });
      }
    }

    fetchQueueStatus();

    const subscription = supabase
      .channel('public:queue_status')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'queue_status',
          filter: 'id=eq.1',
        },
        (payload) => {
          const updated = payload.new;
          setQueueStatus({
            canteen: updated.canteen,
            fee_counter: updated.fee_counter,
            stationary: updated.stationary,
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  async function incrementQueue(queueType: string) {
    try {
      const res = await fetch('/api/update-queue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ queueType, increment: 1 }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        alert('Error updating queue: ' + errorData.error);
      }
    } catch (err: any) {
      alert('Network error: ' + err.message);
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">
      <h1 className="text-4xl font-bold mb-10 text-gray-800">
        University Queue Management System
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">
        {/* Canteen */}
        <div className="bg-white shadow-md rounded-lg p-6 flex flex-col items-center">
          <h2 className="text-2xl font-semibold mb-4">Canteen</h2>
          <p className="text-gray-600 mb-2">Current Queue:</p>
          <p className="text-3xl font-bold text-green-600 mb-4">
            {queueStatus.canteen}
          </p>
          <button
            onClick={() => incrementQueue('canteen')}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
          >
            Add to Queue
          </button>
          <Link
            href="/menu/canteen"
            className="mt-4 text-green-600 underline"
          >
            Go to Canteen Menu
          </Link>
        </div>

        {/* Fee Counter */}
        <div className="bg-white shadow-md rounded-lg p-6 flex flex-col items-center">
          <h2 className="text-2xl font-semibold mb-4">Fee Counter</h2>
          <p className="text-gray-600 mb-2">Current Queue:</p>
          <p className="text-3xl font-bold text-blue-600 mb-4">
            {queueStatus.fee_counter}
          </p>
          <button
            onClick={() => incrementQueue('fee_counter')}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Add to Queue
          </button>
          <Link
            href="/menu/fee-counter"
            className="mt-4 text-blue-600 underline"
          >
            Go to Fee Counter
          </Link>
        </div>

        {/* Stationary */}
        <div className="bg-white shadow-md rounded-lg p-6 flex flex-col items-center">
          <h2 className="text-2xl font-semibold mb-4">Stationary</h2>
          <p className="text-gray-600 mb-2">Current Queue:</p>
          <p className="text-3xl font-bold text-purple-600 mb-4">
            {queueStatus.stationary}
          </p>
          <button
            onClick={() => incrementQueue('stationary')}
            className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition"
          >
            Add to Queue
          </button>
          <Link
            href="/menu/stationary"
            className="mt-4 text-purple-600 underline"
          >
            Go to Stationary
          </Link>
        </div>
      </div>
    </div>
  );
}
