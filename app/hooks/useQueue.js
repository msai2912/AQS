import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { createClient } from '@supabase/supabase-js';

const socket = io('http://localhost:3001');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function useQueue() {
  const [queueStatus, setQueueStatus] = useState({
    canteen: 0,
    fee_counter: 0,
    stationary: 0,
  });

  const [orders, setOrders] = useState([]); // <-- added orders state

  useEffect(() => {
    // Get initial queue data
    const fetchQueue = async () => {
      const { data, error } = await supabase
        .from('queue_status')
        .select('*')
        .eq('id', 1)
        .single();

      if (!error && data) {
        setQueueStatus({
          canteen: data.canteen,
          fee_counter: data.fee_counter,
          stationary: data.stationary,
        });
      }
    };

    // Get initial orders
    const fetchOrders = async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('timestamp', { ascending: false });

      if (!error && data) {
        setOrders(data);
      }
    };

    fetchQueue();
    fetchOrders();

    // Subscribe to queue_status updates
    const subscription = supabase
      .channel('queue_channel')
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

          if (Notification.permission === 'granted') {
            new Notification('Queue Updated', {
              body: `Canteen: ${updated.canteen}, Fee: ${updated.fee_counter}, Stationary: ${updated.stationary}`,
            });
          }
        }
      )
      .subscribe();

    // Subscribe to orders changes
    const ordersSubscription = supabase
      .channel('orders_channel')
      .on(
        'postgres_changes',
        {
          event: '*', // listen to INSERT, UPDATE, DELETE if needed
          schema: 'public',
          table: 'orders',
        },
        (payload) => {
          // For simplicity, just refetch all orders on any change:
          fetchOrders();

          if (Notification.permission === 'granted') {
            new Notification('Orders Updated', {
              body: `Order ID ${payload.new?.id || ''} was ${payload.event}`,
            });
          }
        }
      )
      .subscribe();

    // WebSocket listener
    socket.on('queueUpdate', (data) => {
      setQueueStatus((prev) => ({ ...prev, [data.service]: data.queue }));

      if (Notification.permission === 'granted') {
        new Notification(`${data.service} queue updated`, {
          body: `New queue length: ${data.queue}`,
        });
      }
    });

    if (Notification.permission !== 'granted') {
      Notification.requestPermission();
    }

    return () => {
      socket.off('queueUpdate');
      supabase.removeChannel(subscription);
      supabase.removeChannel(ordersSubscription);
    };
  }, []);

  const joinQueue = (service) => {
    socket.emit('joinQueue', { service });
  };

  return { queueStatus, orders, joinQueue };
}
