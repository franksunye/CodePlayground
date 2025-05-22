import { registerOTel } from '@vercel/otel';
import { isMockMode } from '@/lib/constants';

export function register() {
  // Skip telemetry in mock mode to improve startup speed
  if (!isMockMode) {
    registerOTel({ serviceName: 'ai-chatbot' });
  }
}
