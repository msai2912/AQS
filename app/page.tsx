'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase environment variables are not set');
}

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
    <div className="min-h-screen bg-gray-50 p-8 flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold text-gray-800 mb-10">
        University Queue Management System
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full">
        {[
          { title: "Canteen", href: "/menu/canteen", color: "green" },
          { title: "Fee Counter", href: "/menu/fee-counter", color: "blue" },
          { title: "Stationary", href: "/menu/stationary", color: "purple" }
        ].map(({ title, href, color }) => (
          <Link href={href} key={title} className={`bg-white shadow-md rounded-xl p-6 border-t-4 border-${color}-500 hover:shadow-lg transition-all`}>
            <div className="flex flex-col items-center">
              <h2 className={`text-2xl font-semibold text-${color}-600`}>{title}</h2>
              <p className="text-gray-500 mt-2">Click to manage queue</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}  
