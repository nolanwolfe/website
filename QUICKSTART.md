# Quick Start Guide

Get your WhatsApp Claude agent running in 10 minutes!

## Prerequisites Checklist

- [ ] Node.js 18+ installed
- [ ] Twilio account created
- [ ] Anthropic API key obtained
- [ ] ngrok installed (for local development)

## Step-by-Step Setup

### 1. Install Dependencies (1 min)

```bash
npm install
```

### 2. Get Your API Keys (3 min)

**Anthropic:**
1. Go to https://console.anthropic.com/
2. Click "Get API Key"
3. Copy your key (starts with `sk-ant-`)

**Twilio:**
1. Go to https://console.twilio.com/
2. Copy "Account SID" and "Auth Token"
3. Go to Messaging → Try WhatsApp
4. Follow the setup to get your sandbox number
5. Send the join code from your phone to activate

### 3. Configure Environment (2 min)

```bash
cp .env.example .env
nano .env  # or use your preferred editor
```

Fill in:
```env
ANTHROPIC_API_KEY=sk-ant-your-key-here
TWILIO_ACCOUNT_SID=ACxxxxx
TWILIO_AUTH_TOKEN=xxxxx
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886
AUTHORIZED_WHATSAPP_NUMBER=whatsapp:+1234567890  # YOUR phone number
```

### 4. Start the Server (1 min)

```bash
npm run dev
```

You should see:
```
🤖 WhatsApp Claude Agent is running on port 3000
📱 Authorized WhatsApp: whatsapp:+1234567890
💾 Memory database initialized
```

### 5. Expose to Internet (2 min)

In a new terminal:

```bash
ngrok http 3000
```

Copy the HTTPS URL (e.g., `https://abc123.ngrok-free.app`)

### 6. Configure Twilio Webhook (1 min)

1. Go to https://console.twilio.com/us1/develop/sms/settings/whatsapp-sandbox
2. In "When a message comes in":
   - Paste: `https://YOUR-NGROK-URL.ngrok-free.app/webhook/whatsapp`
   - Set to "HTTP POST"
3. Click "Save"

### 7. Test It! (30 seconds)

Send a WhatsApp message to your Twilio sandbox number:

```
Hello! Can you help me remember that I love coffee?
```

You should get a response from Claude!

## Quick Test Commands

Try these:

```
Hi! What can you help me with?
```

```
Remember that my favorite color is blue
```

```
/memory list
```

```
What's my favorite color?
```

## Common Issues

### "Webhook not receiving messages"
- Check ngrok is still running
- Verify webhook URL in Twilio console
- Look at server logs for errors

### "Unauthorized number"
- Make sure AUTHORIZED_WHATSAPP_NUMBER in .env matches your phone number EXACTLY
- Format: `whatsapp:+1234567890`

### "Claude not responding"
- Check ANTHROPIC_API_KEY is valid
- Verify you have API credits
- Check server logs

## Next Steps

1. **Test the memory system**: Share some personal info and ask Claude to recall it later
2. **Try memory commands**: Use `/memory list`, `/memory search`, etc.
3. **Deploy to production**: See DEPLOYMENT.md for hosting options
4. **Customize**: Edit `src/services/claude.ts` to adjust Claude's personality

## Example Conversation

```
You: Hi! I'm thinking about starting a new hobby

Claude: That's exciting! What kind of hobby are you considering?

You: I'm interested in learning guitar. I used to play piano when I was younger.

Claude: That's great! Your piano background will definitely help with guitar.
I'll remember that you used to play piano and are now interested in guitar.

You: Thanks! Can you remind me what you know about me?

Claude: /memory list

# Personal Memory Bank

## Hobbies
- Interested in learning guitar
- Used to play piano when younger
```

## Tips for Best Results

1. **Be specific**: The more details you share, the better Claude can help
2. **Use categories**: When adding memories manually, use clear categories
3. **Regular backups**: Back up `memory.db` to avoid losing your data
4. **Test locally first**: Make sure everything works before deploying

## Need Help?

- Check the full README.md for detailed docs
- Review DEPLOYMENT.md for production setup
- Check server logs: they show everything happening
- Verify all environment variables are set correctly

---

Happy chatting with your personal AI second brain! 🧠
