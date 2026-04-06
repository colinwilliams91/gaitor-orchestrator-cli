/**
 * App-host service for {{PROJECT_NAME}}.
 *
 * This module starts a minimal HTTP server with a /health endpoint.
 * Add your Aspire service references and business logic here.
 *
 * Aspire integration:
 *   In your C# AppHost, register this Node.js service with:
 *     builder.AddNpmApp("{{PROJECT_NAME}}-app-host", "../app-host")
 *            .WithEnvironment("PORT", "3000");
 *   Aspire will inject OTEL env vars automatically at runtime.
 */

import http from 'node:http';
import { trace, metrics } from '@opentelemetry/api';

const tracer = trace.getTracer('{{PROJECT_NAME}}-app-host');
const meter = metrics.getMeter('{{PROJECT_NAME}}-app-host');

/** Counter for total requests received — example manual metric. */
const requestCounter = meter.createCounter('http.requests.total', {
  description: 'Total number of HTTP requests received',
});

/**
 * Start the app-host HTTP server.
 *
 * @param port - TCP port to listen on (defaults to PORT env var or 3000).
 * @returns A promise that resolves once the server is listening.
 */
export function startAppHost(port?: number): Promise<void> {
  const listenPort = port ?? Number(process.env['PORT'] ?? 3000);

  const server = http.createServer((req, res) => {
    // Start a span for every incoming request
    const span = tracer.startSpan(`${req.method} ${req.url}`);
    requestCounter.add(1, { method: req.method ?? 'UNKNOWN', path: req.url ?? '/' });

    try {
      if (req.method === 'GET' && req.url === '/health') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 'ok', service: '{{PROJECT_NAME}}-app-host' }));
      } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Not found' }));
      }
    } finally {
      span.end();
    }
  });

  return new Promise((resolve) => {
    server.listen(listenPort, () => {
      console.log(`🚀  {{PROJECT_NAME}}-app-host listening on http://localhost:${listenPort}`);
      console.log(`🩺  Health: http://localhost:${listenPort}/health`);
      // TODO: Register additional Aspire service references here
      resolve();
    });
  });
}
