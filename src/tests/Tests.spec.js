import { htmlReport } from 'https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js';
import { textSummary } from 'https://jslib.k6.io/k6-summary/0.0.1/index.js';
import http from 'k6/http';
import { check } from 'k6';
import { Trend } from 'k6/metrics';

export const getContactsDuration = new Trend('get_contacts', true);

export const options = {
  thresholds: {
    http_req_failed: ['rate<0.01'], 
    http_req_duration: ['avg<10000']
  },
  stages: [
    { duration: '30s', target: 10 },
    { duration: '30s', target: 10 },
    { duration: '30s', target: 50 },
    { duration: '30s', target: 90 },
    { duration: '30s', target: 100 },
    { duration: '30s', target: 100 },
    { duration: '30s', target: 130 },
    { duration: '30s', target: 130 },
    { duration: '30s', target: 130 },
    { duration: '30s', target: 300 }
  ]
};

export function handleSummary(data) {
  return {
    './src/output/index.html': htmlReport(data),
    stdout: textSummary(data, { indent: ' ', enableColors: true })
  };
}

export default function () {
  const baseUrl = 'https://servicodados.ibge.gov.br/api/v1/localidades/estados';

  const params = {
    /*headers: {
      'Content-Type': 'application/json'
    }*/
  };

  const OK = 200;

  const res = http.get(`${baseUrl}`, params);

  getContactsDuration.add(res.timings.duration);

  check(res, {
    'GET Contacts - Status 200': () => res.status === OK
  });
}
