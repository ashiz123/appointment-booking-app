import http from 'k6/http';
import { check, sleep } from 'k6';

// Configuration
export const options = {
  vus: 10,          // 10 virtual users
  duration: '30s',  // run for 30 seconds
};

const BASE_URL = http://localhost:3000;

export default function () {
  const res = http.get(`${BASE_URL}/business/byAuthUser`); // Your API endpoint

  check(res, {
    'status is 200': (r) => r.status === 200,
  });

  sleep(1); // Wait 1 second between requests
}