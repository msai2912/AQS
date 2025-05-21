'use client';

export default function OrderHistory({ orders }) {
  return (
    <div
      style={{ border: '1px solid #ddd', padding: '1rem', marginTop: '1rem' }}
    >
      <h2>Order History</h2>
      {orders.length > 0 ? (
        <ul>
          {orders.map((order) => (
            <li key={order.id}>
              [{order.timestamp}] {order.service} - Order ID: {order.id}
            </li>
          ))}
        </ul>
      ) : (
        <p>No orders placed yet.</p>
      )}
    </div>
  );
}
