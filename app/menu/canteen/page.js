'use client';

import useSocket from '../../hooks/useSocket';

export default function CanteenPage() {
  const { queueStatus, joinQueue } = useSocket();

  const handleJoinQueue = () => {
    joinQueue('canteen');
  };

  return (
    <div>
      <h1>Canteen Queue</h1>
      <p>Current Queue: {queueStatus.canteen}</p>
      <button onClick={handleJoinQueue}>Join Queue</button>
    </div>
  );
}
