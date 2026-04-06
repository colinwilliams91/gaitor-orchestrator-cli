/**
 * OpenTelemetry SDK bootstrap for {{PROJECT_NAME}}-app-host.
 *
 * IMPORTANT: This file must be imported BEFORE any other application module
 * so that instrumentation patches are applied at startup.
 *
 * Aspire injects OTEL configuration via environment variables at runtime.
 * When running locally without Aspire, the values in .env.example are used
 * as fallbacks so telemetry is still exported to a local OTLP collector.
 */

import { NodeSDK } from '@opentelemetry/sdk-node';
import { resourceFromAttributes } from '@opentelemetry/resources';
import {
  ATTR_SERVICE_NAME,
  ATTR_SERVICE_VERSION,
} from '@opentelemetry/semantic-conventions';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-http';
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { PeriodicExportingMetricReader } from '@opentelemetry/sdk-node';
import { BatchLogRecordProcessor } from '@opentelemetry/sdk-logs';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';

/** Base OTLP endpoint — Aspire overrides this via OTEL_EXPORTER_OTLP_ENDPOINT. */
const OTLP_BASE = process.env['OTEL_EXPORTER_OTLP_ENDPOINT'] ?? 'http://localhost:4318';

/** Strip any trailing slash for consistent URL construction. */
const baseUrl = OTLP_BASE.replace(/\/$/, '');

const traceExporter = new OTLPTraceExporter({ url: `${baseUrl}/v1/traces` });
const metricExporter = new OTLPMetricExporter({ url: `${baseUrl}/v1/metrics` });
const logExporter = new OTLPLogExporter({ url: `${baseUrl}/v1/logs` });

const sdk = new NodeSDK({
  resource: resourceFromAttributes({
    [ATTR_SERVICE_NAME]: process.env['OTEL_SERVICE_NAME'] ?? '{{PROJECT_NAME}}-app-host',
    [ATTR_SERVICE_VERSION]: process.env['npm_package_version'] ?? '0.1.0',
  }),
  traceExporter,
  metricReader: new PeriodicExportingMetricReader({
    exporter: metricExporter,
    exportIntervalMillis: 10_000,
  }),
  logRecordProcessors: [new BatchLogRecordProcessor(logExporter)],
  instrumentations: [getNodeAutoInstrumentations()],
});

sdk.start();

process.on('SIGTERM', () => {
  sdk.shutdown().finally(() => process.exit(0));
});
