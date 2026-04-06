# Aspire AppHost + OpenTelemetry — {{PROJECT_NAME}}

This directory contains a TypeScript Node.js service pre-wired to run
inside a **.NET Aspire** orchestration, with **OpenTelemetry** traces,
metrics, and logs exported to the Aspire Dashboard via OTLP/HTTP.

---

## Getting started

```bash
# 1. Install dependencies
npm install

# 2. Run locally (without Aspire)
cp .env.example .env   # review and adjust endpoint / service name
npm run dev            # tsx watch — restarts on file changes

# 3. Build for production
npm run build          # emits compiled JS to dist/
npm start              # run the compiled output
```

---

## Running inside Aspire

Register this service in your C# AppHost project:

```csharp
// AppHost/Program.cs
var appHost = builder.AddNpmApp("{{PROJECT_NAME}}-app-host", "../app-host")
                     .WithEnvironment("PORT", "3000")
                     .WithExternalHttpEndpoints();

builder.Build().Run();
```

Aspire automatically injects the following environment variables at runtime,
so no manual `.env` configuration is required when running under Aspire:

| Variable | Description |
|----------|-------------|
| `OTEL_EXPORTER_OTLP_ENDPOINT` | OTLP collector endpoint (Aspire Dashboard) |
| `OTEL_SERVICE_NAME` | Service name shown in the Aspire Dashboard |
| `OTEL_RESOURCE_ATTRIBUTES` | Additional resource attributes |
| `OTEL_TRACES_SAMPLER` | Trace sampler (e.g. `parentbased_always_on`) |
| `DOTNET_DASHBOARD_OTLP_ENDPOINT_URL` | Aspire Dashboard OTLP URL (informational) |

---

## OpenTelemetry configuration

The SDK is bootstrapped in `src/otel.ts`. It exports:

- **Traces** — via `OTLPTraceExporter` → `{OTLP_BASE}/v1/traces`
- **Metrics** — via `OTLPMetricExporter` → `{OTLP_BASE}/v1/metrics` (10 s interval)
- **Logs** — via `OTLPLogExporter` → `{OTLP_BASE}/v1/logs`

Auto-instrumentation patches `http`, `dns`, `express`, and other common
Node.js modules at startup via `@opentelemetry/auto-instrumentations-node`.

Manual instrumentation examples live in `src/app-host.ts`:

```typescript
import { trace, metrics } from '@opentelemetry/api';

const tracer = trace.getTracer('my-tracer');
const span = tracer.startSpan('my-operation');
// ... work ...
span.end();
```

---

## Graceful shutdown

The service listens for `SIGTERM` (sent by Aspire when stopping resources)
and calls `sdk.shutdown()` to flush all pending telemetry before exiting.

---

## Reference

- [.NET Aspire Node.js integration](https://learn.microsoft.com/en-us/dotnet/aspire/get-started/aspire-overview)
- [OpenTelemetry JS — Getting Started](https://opentelemetry.io/docs/languages/js/getting-started/nodejs/)
- [Aspire Dashboard OTLP](https://learn.microsoft.com/en-us/dotnet/aspire/fundamentals/dashboard/overview)
