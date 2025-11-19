import dotenv from 'dotenv';

dotenv.config();

export const config = {
  anthropic: {
    apiKey: process.env.ANTHROPIC_API_KEY || ''
  },
  twilio: {
    accountSid: process.env.TWILIO_ACCOUNT_SID || '',
    authToken: process.env.TWILIO_AUTH_TOKEN || '',
    whatsappNumber: process.env.TWILIO_WHATSAPP_NUMBER || ''
  },
  server: {
    port: parseInt(process.env.PORT || '3000', 10),
    nodeEnv: process.env.NODE_ENV || 'development'
  },
  security: {
    authorizedNumber: process.env.AUTHORIZED_WHATSAPP_NUMBER || ''
  }
};

export function validateConfig(): void {
  const required = [
    { key: 'ANTHROPIC_API_KEY', value: config.anthropic.apiKey },
    { key: 'TWILIO_ACCOUNT_SID', value: config.twilio.accountSid },
    { key: 'TWILIO_AUTH_TOKEN', value: config.twilio.authToken },
    { key: 'TWILIO_WHATSAPP_NUMBER', value: config.twilio.whatsappNumber },
    { key: 'AUTHORIZED_WHATSAPP_NUMBER', value: config.security.authorizedNumber }
  ];

  const missing = required.filter(item => !item.value);

  if (missing.length > 0) {
    console.error('Missing required environment variables:');
    missing.forEach(item => console.error(`  - ${item.key}`));
    console.error('\nPlease check your .env file');
    process.exit(1);
  }
}
