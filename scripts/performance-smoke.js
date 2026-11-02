const { mkdirSync, writeFileSync } = require('node:fs');
const { join } = require('node:path');

const baseUrl = process.env.PERFORMANCE_BASE_URL ?? 'http://127.0.0.1:4173';
const sampleCount = Number(process.env.PERFORMANCE_SAMPLES ?? 30);
const concurrency = Number(process.env.PERFORMANCE_CONCURRENCY ?? 5);
const maxP95Ms = Number(process.env.PERFORMANCE_MAX_P95_MS ?? 1000);

if (!Number.isInteger(sampleCount) || sampleCount < 1 || !Number.isInteger(concurrency) || concurrency < 1) {
  throw new Error('PERFORMANCE_SAMPLES and PERFORMANCE_CONCURRENCY must be positive integers.');
}

async function createTask(index) {
  const startedAt = performance.now();
  const response = await fetch(`${baseUrl}/api/tasks`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ title: `Performance smoke task ${index}` })
  });
  const durationMs = performance.now() - startedAt;
  return { status: response.status, durationMs };
}

async function runWorker(queue) {
  const results = [];
  while (queue.length) {
    const index = queue.shift();
    results.push(await createTask(index));
  }
  return results;
}

async function run() {
  const queue = Array.from({ length: sampleCount }, (_, index) => index + 1);
  const workerCount = Math.min(concurrency, sampleCount);
  const workerResults = await Promise.all(Array.from({ length: workerCount }, () => runWorker(queue)));
  const results = workerResults.flat();
  const durations = results.map(({ durationMs }) => durationMs).sort((left, right) => left - right);
  const p95Index = Math.max(0, Math.ceil(durations.length * 0.95) - 1);
  const summary = {
    suite: 'API performance smoke',
    target: `${baseUrl}/api/tasks`,
    sampleCount,
    concurrency,
    successfulRequests: results.filter(({ status }) => status === 201).length,
    failedRequests: results.filter(({ status }) => status !== 201).length,
    p95LatencyMs: Number(durations[p95Index].toFixed(2)),
    maxLatencyMs: Number(durations.at(-1).toFixed(2)),
    thresholdP95Ms: maxP95Ms,
    passed: results.every(({ status }) => status === 201) && durations[p95Index] <= maxP95Ms
  };

  mkdirSync('artifacts', { recursive: true });
  writeFileSync(join('artifacts', 'api-performance-smoke.json'), `${JSON.stringify(summary, null, 2)}\n`);
  console.log(JSON.stringify(summary, null, 2));

  if (!summary.passed) {
    throw new Error(`Performance smoke failed: expected all responses to be 201 and p95 <= ${maxP95Ms} ms.`);
  }
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
