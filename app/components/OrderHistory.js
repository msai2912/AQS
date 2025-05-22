'use client';

import React from 'react';
import useQueue from '../../hooks/useQueue';

export default function StationaryPage() {
  const { queueStatus, orders = [], joinQueue } = useQueue();

  const handleJoinQueue = () => {
    joinQueue('stationary');
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Stationary Queue</h1>
      <p className="text-lg mb-4">
        Current queue count: {queueStatus.stationary}
      </p>

      <button
        onClick={handleJoinQueue}
        className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition mb-6"
      >
        Join Stationary Queue
      </button>

      <h2 className="text-xl font-semibold mb-2">Orders</h2>
      <ul className="space-y-2">
        {orders
          .filter((order) => order.service === 'stationary')
          .map((order) => (
            <li key={order.id} className="bg-gray-100 p-2 rounded">
              Order ID: {order.id} - Time: {order.timestamp}
            </li>
          ))}
      </ul>
    </div>
  );
}
