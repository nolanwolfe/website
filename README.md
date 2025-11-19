# 🏦 Plaid Bank Transactions to Google Sheets

An automated n8n workflow that syncs your bank transactions from Plaid API directly to Google Sheets. Perfect for personal finance tracking, budgeting, and expense management.

## ✨ Features

- 🔄 **Automatic Daily Sync** - Fetches transactions automatically on schedule
- 📊 **Google Sheets Integration** - All transactions organized in a spreadsheet
- 🏦 **Multi-Bank Support** - Connect multiple bank accounts via Plaid
- 🔐 **Secure** - Uses official Plaid API with OAuth authentication
- 📱 **Complete Transaction Data** - Captures merchant, category, amount, and more
- 🚀 **Easy Setup** - Import workflow and configure in minutes

## 📋 What You Get

### Transaction Data Tracked
- Date and description
- Merchant name
- Amount and currency
- Category (auto-assigned by Plaid)
- Payment channel (online, in-store, etc.)
- Pending status
- Unique transaction ID (prevents duplicates)
- Status (Added/Modified)

### Automation Features
- Scheduled daily sync (customizable)
- Handles new and modified transactions
- Automatic deduplication
- Up to 500 transactions per sync

## 🚀 Quick Start

### Prerequisites
- n8n instance (self-hosted or cloud)
- Plaid account (free tier available)
- Google account
- Bank account supported by Plaid

### Installation

1. **Clone or download this repository**
   ```bash
   git clone <repository-url>
   ```

2. **Import the workflow**
   - Open n8n
   - Go to Workflows → Import
   - Upload `plaid-transactions-workflow.json`

3. **Set up credentials**
   - Get Plaid API keys from [Plaid Dashboard](https://dashboard.plaid.com/)
   - Connect your Google account in n8n
   - Link your bank account (use `get-plaid-token.html`)

4. **Configure environment variables**
   - Copy `.env.example` to `.env`
   - Fill in your credentials and Sheet ID

5. **Activate the workflow**
   - Test it manually first
   - Then toggle "Active" in n8n

📖 **Full setup instructions**: See [SETUP.md](SETUP.md)

## 📁 Files Included

- `plaid-transactions-workflow.json` - The n8n workflow (import this)
- `SETUP.md` - Detailed setup and configuration guide
- `get-plaid-token.html` - Helper tool to get Plaid access token
- `.env.example` - Template for environment variables

## 🔧 Configuration

### Environment Variables
```bash
PLAID_CLIENT_ID=your_client_id
PLAID_SECRET=your_secret
PLAID_ACCESS_TOKEN=your_access_token
PLAID_ENVIRONMENT=sandbox  # or development, production
GOOGLE_SHEET_ID=your_sheet_id
```

### Schedule Options
Default: Daily at midnight (`0 0 * * *`)

Change in the "Schedule Trigger" node:
- Weekly: `0 0 * * 0`
- Every 6 hours: `0 */6 * * *`
- Custom: [Cron expression](https://crontab.guru/)

## 🎯 Use Cases

- **Personal Finance** - Track all spending in one place
- **Budgeting** - Export to analyze spending patterns
- **Expense Reports** - Automatic transaction log for taxes
- **Business Accounting** - Sync business account transactions
- **Financial Planning** - Historical data for forecasting

## 🔒 Security

- All credentials stored securely in n8n
- OAuth2 for Google Sheets
- Official Plaid API with encryption
- No third-party data storage
- Environment variables for sensitive data

## 📊 Sample Google Sheets Format

| Date | Description | Merchant | Amount | Category | Account ID | Transaction ID | Pending | Payment Channel | Currency | Status |
|------|-------------|----------|--------|----------|------------|----------------|---------|-----------------|----------|--------|
| 2024-01-15 | Coffee Shop | Starbucks | 5.25 | Food & Drink > Restaurants | acc_123 | txn_456 | No | in store | USD | Added |

## 🛠️ Troubleshooting

**Workflow not running?**
- Check if workflow is "Active"
- Verify schedule trigger settings
- Check n8n execution logs

**No transactions appearing?**
- Verify Plaid access token is valid
- Check Google Sheet ID is correct
- Ensure sheet tab name matches ("Transactions")

**Authentication errors?**
- Re-authenticate Google Sheets
- Verify Plaid credentials
- Check environment variable values

## 📚 Resources

- [Plaid API Documentation](https://plaid.com/docs/)
- [n8n Documentation](https://docs.n8n.io/)
- [Google Sheets API](https://developers.google.com/sheets/api)
- [Detailed Setup Guide](SETUP.md)

## 🎓 Advanced Features

Want to extend the workflow? Try adding:
- Email alerts for large transactions
- Budget tracking with conditional logic
- Monthly summary reports
- Custom categorization rules
- Multi-currency conversion
- Data visualization dashboards

## 💡 Tips

1. **Start with Sandbox** - Test with fake data before connecting real accounts
2. **Backup Your Sheet** - Keep copies of your transaction data
3. **Monitor API Usage** - Plaid has rate limits on free tier
4. **Regular Token Rotation** - Refresh access tokens periodically
5. **Version Control** - Keep backups of your workflow configuration

## 📄 License

This project is provided as-is for personal and educational use.

## 🤝 Contributing

Found a bug or have a suggestion? Feel free to open an issue or submit a pull request.

## ⚠️ Disclaimer

This is a personal finance tool. Always verify transaction data accuracy. Not responsible for any financial decisions made based on this data.

---

**Happy budgeting! 💰**
