'use client';

import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:4000');

export default function useSocket() {
  const [queueStatus, setQueueStatus] = useState({
    canteen: 0,
    feeCounter: 0,
    stationary: 0,
  });

  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (Notification.permission !== 'granted') {
      Notification.requestPermission();
    }

    // Listen for queue updates
    socket.on('queueUpdate', (status) => {
      console.log('Queue update received:', status);
      setQueueStatus(status);

      if (Notification.permission === 'granted') {
        new Notification('Queue Update', {
          body: `Canteen: ${status.canteen}, Fee Counter: ${status.feeCounter}, Stationary: ${status.stationary}`,
        });
      }
    });

    // Listen for order updates
    socket.on('orderUpdate', (orderList) => {
      console.log('Received order update:', orderList);
      setOrders(orderList);
    });

    // Cleanup on component unmount
    return () => {
      socket.off('queueUpdate');
      socket.off('orderUpdate');
    };
  }, []);

  // Emit incrementQueue event when joining a queue
  const joinQueue = (queueName) => {
    socket.emit('incrementQueue', queueName);
  };

  return { queueStatus, orders, joinQueue };
}
