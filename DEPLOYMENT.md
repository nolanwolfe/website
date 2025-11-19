# Deployment Guide

This guide covers different deployment options for your WhatsApp Claude Agent.

## Option 1: Railway.app (Recommended - Easiest)

Railway is the easiest way to deploy Node.js applications.

### Steps:

1. **Sign up for Railway**
   - Go to [railway.app](https://railway.app)
   - Sign up with GitHub

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose this repository

3. **Add Environment Variables**
   - Go to your project settings
   - Click "Variables"
   - Add all variables from your `.env` file:
     ```
     ANTHROPIC_API_KEY=sk-ant-xxxxx
     TWILIO_ACCOUNT_SID=ACxxxxx
     TWILIO_AUTH_TOKEN=xxxxx
     TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886
     AUTHORIZED_WHATSAPP_NUMBER=whatsapp:+1234567890
     PORT=3000
     NODE_ENV=production
     ```

4. **Deploy**
   - Railway will automatically deploy
   - You'll get a public URL (e.g., `https://your-app.railway.app`)

5. **Configure Twilio Webhook**
   - Copy your Railway URL
   - Go to Twilio Console → WhatsApp Sandbox Settings
   - Set webhook to: `https://your-app.railway.app/webhook/whatsapp`

### Cost:
- Free tier: $5 credit/month
- After that: ~$5-10/month for a small app

---

## Option 2: Render.com

Similar to Railway, very easy to use.

### Steps:

1. **Sign up for Render**
   - Go to [render.com](https://render.com)
   - Sign up with GitHub

2. **Create New Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Name: `whatsapp-claude-agent`
   - Environment: `Node`
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`

3. **Add Environment Variables**
   - In the dashboard, add all your environment variables

4. **Deploy**
   - Render will deploy automatically
   - You'll get a URL like `https://whatsapp-claude-agent.onrender.com`

5. **Configure Twilio Webhook**
   - Update Twilio with your Render URL + `/webhook/whatsapp`

### Cost:
- Free tier available (app sleeps after inactivity)
- Paid: $7/month

---

## Option 3: Heroku

Classic platform, still works great.

### Steps:

1. **Install Heroku CLI**
   ```bash
   curl https://cli-assets.heroku.com/install.sh | sh
   ```

2. **Login to Heroku**
   ```bash
   heroku login
   ```

3. **Create Heroku App**
   ```bash
   heroku create whatsapp-claude-agent
   ```

4. **Set Environment Variables**
   ```bash
   heroku config:set ANTHROPIC_API_KEY=sk-ant-xxxxx
   heroku config:set TWILIO_ACCOUNT_SID=ACxxxxx
   heroku config:set TWILIO_AUTH_TOKEN=xxxxx
   heroku config:set TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886
   heroku config:set AUTHORIZED_WHATSAPP_NUMBER=whatsapp:+1234567890
   heroku config:set NODE_ENV=production
   ```

5. **Deploy**
   ```bash
   git push heroku main
   ```

6. **Configure Twilio Webhook**
   - Your app URL: `https://whatsapp-claude-agent.herokuapp.com`
   - Set Twilio webhook to: `https://whatsapp-claude-agent.herokuapp.com/webhook/whatsapp`

### Cost:
- $7/month for basic dyno

---

## Option 4: DigitalOcean / AWS / GCP (Advanced)

For full control, deploy to a VPS.

### DigitalOcean Example:

1. **Create Droplet**
   - Choose Ubuntu 22.04
   - Basic plan ($6/month)

2. **SSH into Server**
   ```bash
   ssh root@your-droplet-ip
   ```

3. **Install Node.js**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

4. **Install PM2**
   ```bash
   npm install -g pm2
   ```

5. **Clone Your Repository**
   ```bash
   git clone https://github.com/yourusername/whatsapp-claude-agent.git
   cd whatsapp-claude-agent
   ```

6. **Install Dependencies**
   ```bash
   npm install
   npm run build
   ```

7. **Create .env File**
   ```bash
   nano .env
   # Add your environment variables
   ```

8. **Start with PM2**
   ```bash
   pm2 start dist/index.js --name whatsapp-claude
   pm2 save
   pm2 startup
   ```

9. **Set up Nginx (for HTTPS)**
   ```bash
   sudo apt install nginx certbot python3-certbot-nginx
   ```

   Create nginx config:
   ```bash
   sudo nano /etc/nginx/sites-available/whatsapp-claude
   ```

   Add:
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

   Enable:
   ```bash
   sudo ln -s /etc/nginx/sites-available/whatsapp-claude /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

10. **Get SSL Certificate**
    ```bash
    sudo certbot --nginx -d your-domain.com
    ```

11. **Configure Twilio Webhook**
    - Set to: `https://your-domain.com/webhook/whatsapp`

### Cost:
- $6-12/month for VPS
- Need to manage server yourself

---

## Option 5: Docker (Any Platform)

Deploy using Docker for consistency.

### Create Dockerfile:

```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

### Create docker-compose.yml:

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - ANTHROPIC_API_KEY=${ANTHROPIC_API_KEY}
      - TWILIO_ACCOUNT_SID=${TWILIO_ACCOUNT_SID}
      - TWILIO_AUTH_TOKEN=${TWILIO_AUTH_TOKEN}
      - TWILIO_WHATSAPP_NUMBER=${TWILIO_WHATSAPP_NUMBER}
      - AUTHORIZED_WHATSAPP_NUMBER=${AUTHORIZED_WHATSAPP_NUMBER}
      - PORT=3000
      - NODE_ENV=production
    volumes:
      - ./memory.db:/app/memory.db
    restart: unless-stopped
```

### Deploy:

```bash
docker-compose up -d
```

---

## Database Backup Strategy

Regardless of deployment method, **backup your memory.db file regularly**:

### Automated Backup Script:

Create `backup.sh`:

```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
cp memory.db backups/memory_$DATE.db
# Keep only last 30 backups
ls -t backups/memory_*.db | tail -n +31 | xargs rm -f
```

Schedule with cron:
```bash
0 0 * * * /path/to/backup.sh
```

### Cloud Backup:

Upload to S3, Google Drive, or Dropbox:

```bash
# Example with AWS S3
aws s3 cp memory.db s3://your-bucket/backups/memory_$(date +%Y%m%d).db
```

---

## Monitoring

### Add Health Check Monitoring:

1. **UptimeRobot** (Free)
   - Add monitor for `https://your-app.com/health`
   - Get alerts if app goes down

2. **BetterStack** (Free tier)
   - More detailed monitoring
   - Log aggregation

3. **PM2 Monitoring** (If using PM2)
   ```bash
   pm2 install pm2-logrotate
   pm2 set pm2-logrotate:max_size 10M
   ```

---

## Cost Summary

| Platform | Monthly Cost | Difficulty | Best For |
|----------|-------------|------------|----------|
| Railway | $5-10 | Easy | Quick deployment |
| Render | $0-7 | Easy | Free tier testing |
| Heroku | $7 | Easy | Established platform |
| DigitalOcean | $6-12 | Medium | Full control |
| AWS/GCP | $5-20 | Hard | Enterprise needs |

---

## Recommended Setup

**For Personal Use:**
- Start with Railway or Render free tier
- Upgrade when needed
- Set up automated backups to Google Drive

**For Serious Use:**
- DigitalOcean droplet
- PM2 for process management
- Nginx with SSL
- Automated daily backups to S3
- UptimeRobot monitoring

---

## Troubleshooting Deployment

### App crashes on startup
- Check logs: `heroku logs --tail` or Railway/Render dashboard
- Verify all environment variables are set
- Ensure build completed successfully

### Webhook not working
- Verify URL is HTTPS (required by Twilio)
- Check firewall allows incoming connections on port 3000
- Test webhook endpoint: `curl https://your-app.com/health`

### Database permission errors
- Ensure app has write permissions to directory
- Check volume mounts in Docker
- Verify file ownership

---

Need help? Check the main README or create an issue on GitHub!
