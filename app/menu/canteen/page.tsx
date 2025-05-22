'use client';

import React from 'react';
import useQueue from '../../hooks/useQueue';

const foodItems = [
  { name: 'Pizza', price: '₹120', image: '/images/pizza.jpg' },
  { name: 'Sandwich', price: '₹50', image: '/images/sandwich.jpg' },
  { name: 'Juice', price: '₹30', image: '/images/juice.jpg' },
];

export default function CanteenPage() {
  const { queueStatus, joinQueue } = useQueue();

  const handleOrder = (itemName) => {
    joinQueue('canteen');
    alert(`${itemName} added to queue!`);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Canteen Queue</h1>
      <p className="mb-4 text-lg">Current Queue: {queueStatus.canteen}</p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {foodItems.map((item) => (
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
            <p>{item.price}</p>
            <button
              onClick={() => handleOrder(item.name)}
              className="mt-2 bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
            >
              Order & Join Queue
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
