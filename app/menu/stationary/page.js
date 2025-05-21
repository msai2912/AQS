'use client';

import React from 'react';
import useSocket from '../../hooks/useSocket';

export default function StationaryPage() {
  const { queueStatus, orders, joinQueue } = useSocket();

  const handleJoinQueue = () => {
    joinQueue('stationary'); // emit incrementQueue with 'stationary'
  };

  return (
    <div>
      <h1>Stationary Queue</h1>
      <p>Current queue count: {queueStatus.stationary}</p>

      <button onClick={handleJoinQueue}>Join Stationary Queue</button>

      <h2>Orders</h2>
      <ul>
        {orders
          .filter((order) => order.service === 'stationary')
          .map((order) => (
            <li key={order.id}>
              Order ID: {order.id} - Time: {order.timestamp}
            </li>
          ))}
      </ul>
    </div>
  );
}
