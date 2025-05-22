'use client';

import React from 'react';
import useQueue from '../../hooks/useQueue';

const feeItems = [
  {
    name: 'Tuition Fee',
    amount: '₹1,35,000',
    image: '/images/tuition.jpg',
  },
  {
    name: 'Hostel Fee',
    amount: '₹65,000',
    image: '/images/hostel.jpg',
  },
];

export default function FeeCounterPage() {
  const { queueStatus, joinQueue } = useQueue();

  const handlePayment = (feeType) => {
    joinQueue('fee_counter');
    alert(`${feeType} payment added to queue.`);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Fee Counter</h1>
      <p className="mb-4 text-lg">Current Queue: {queueStatus.fee_counter}</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {feeItems.map((item) => (
          <div
            key={item.name}
            className="border rounded-xl p-4 shadow hover:shadow-lg transition"
          >
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-40 object-cover rounded mb-2"
            />
            <h2 className="text-lg font-semibold">{item.name}</h2>
            <p>{item.amount}</p>
            <button
              onClick={() => handlePayment(item.name)}
              className="mt-2 bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
            >
              Pay & Join Queue
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
