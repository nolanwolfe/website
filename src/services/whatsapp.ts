import twilio from 'twilio';

export class WhatsAppService {
  private client: twilio.Twilio;
  private fromNumber: string;

  constructor(accountSid: string, authToken: string, fromNumber: string) {
    this.client = twilio(accountSid, authToken);
    this.fromNumber = fromNumber;
  }

  async sendMessage(to: string, message: string): Promise<void> {
    try {
      // Split long messages if needed (WhatsApp has a character limit)
      const messages = this.splitMessage(message, 1500);

      for (const msg of messages) {
        await this.client.messages.create({
          from: this.fromNumber,
          to: to,
          body: msg
        });
      }

      console.log(`Sent message to ${to}`);
    } catch (error) {
      console.error('Error sending WhatsApp message:', error);
      throw error;
    }
  }

  private splitMessage(message: string, maxLength: number): string[] {
    if (message.length <= maxLength) {
      return [message];
    }

    const messages: string[] = [];
    let currentMessage = '';

    const lines = message.split('\n');

    for (const line of lines) {
      if ((currentMessage + line + '\n').length > maxLength) {
        if (currentMessage) {
          messages.push(currentMessage.trim());
          currentMessage = '';
        }

        // If a single line is too long, split it by words
        if (line.length > maxLength) {
          const words = line.split(' ');
          for (const word of words) {
            if ((currentMessage + word + ' ').length > maxLength) {
              messages.push(currentMessage.trim());
              currentMessage = word + ' ';
            } else {
              currentMessage += word + ' ';
            }
          }
        } else {
          currentMessage = line + '\n';
        }
      } else {
        currentMessage += line + '\n';
      }
    }

    if (currentMessage) {
      messages.push(currentMessage.trim());
    }

    return messages;
  }

  validateWebhookSignature(signature: string, url: string, params: any): boolean {
    const authToken = this.client.password;
    return twilio.validateRequest(authToken, signature, url, params);
  }
}
