import { seedRequests } from '../data/mockRequests.js';

export const delay = (ms) => new Promise((r) => setTimeout(r, ms));

export async function fetchRequests() {
  await delay(1200);
  // 15% of the time, throw — so the error state is reachable and testable.
  if (Math.random() < 0.15) throw new Error('Network error while loading the queue');
  return seedRequests;
}

export async function createRequest(payload) {
  await delay(900);
  return {
    ...payload,
    id: 'REQ-' + Math.floor(1000 + Math.random() * 9000) + '-' + crypto.randomUUID().slice(0, 4),
    status: 'Open',
    createdAt: new Date().toISOString(),
  };
}
