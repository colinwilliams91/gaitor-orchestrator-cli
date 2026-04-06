/**
 * Entry point for {{PROJECT_NAME}}-app-host.
 *
 * IMPORTANT: The OTEL side-effect import MUST be the first import in this
 * file so that instrumentation is initialised before any instrumented modules
 * are loaded. Do not move or reorder this import.
 */

// Side-effect: initialises NodeSDK, registers exporters, and patches built-ins
import './otel.js';

import { startAppHost } from './app-host.js';

startAppHost().catch((err: unknown) => {
  console.error('Failed to start app-host:', err);
  process.exit(1);
});
