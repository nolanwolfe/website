# Plaid Bank Transactions to Google Sheets - Setup Guide

This n8n workflow automatically fetches your bank transactions via Plaid API and stores them in a Google Sheets spreadsheet.

## Prerequisites

1. **n8n instance** (self-hosted or cloud)
2. **Plaid account** ([Sign up here](https://dashboard.plaid.com/signup))
3. **Google account** for Google Sheets
4. **Bank account** supported by Plaid

## Step 1: Set Up Plaid Account

### 1.1 Create Plaid Account
1. Go to [Plaid Dashboard](https://dashboard.plaid.com/)
2. Sign up for a free account
3. Navigate to **Team Settings** > **Keys**

### 1.2 Get Your Credentials
- **client_id**: Found in the Keys section
- **secret**: Found in the Keys section (for sandbox, development, or production)
- Choose your environment:
  - `sandbox`: For testing with fake data
  - `development`: For testing with real bank accounts (up to 100 items)
  - `production`: For production use (requires Plaid approval)

### 1.3 Link Your Bank Account

To get an `access_token`, you need to link your bank account using Plaid Link. You have two options:

#### Option A: Use Plaid Quickstart (Recommended for first-time setup)
```bash
# Clone Plaid Quickstart
git clone https://github.com/plaid/quickstart.git
cd quickstart

# Follow the README to run the app and link your bank
# This will give you an access_token
```

#### Option B: Use the included helper script
See `get-plaid-token.html` in this repository - open it in a browser to link your account.

## Step 2: Set Up Google Sheets

### 2.1 Create a New Spreadsheet
1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Name it (e.g., "Bank Transactions")
4. Create a sheet tab called "Transactions" (or your preferred name)

### 2.2 Add Headers (Optional but recommended)
Add these headers to the first row:
```
Date | Description | Merchant | Amount | Category | Account ID | Transaction ID | Pending | Payment Channel | Currency | Status
```

### 2.3 Get Sheet ID
- Copy the Sheet ID from the URL:
  ```
  https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID_HERE/edit
  ```

## Step 3: Configure n8n

### 3.1 Import Workflow
1. Open your n8n instance
2. Click **Workflows** > **Import**
3. Upload `plaid-transactions-workflow.json`

### 3.2 Set Up Google Sheets Credentials
1. In the workflow, click on the "Add to Google Sheets" node
2. Click **Create New Credential**
3. Follow the OAuth flow to connect your Google account
4. Authorize n8n to access Google Sheets

### 3.3 Configure Environment Variables

In n8n, set these environment variables:

```bash
GOOGLE_SHEET_ID=your_google_sheet_id
PLAID_CLIENT_ID=your_plaid_client_id
PLAID_SECRET=your_plaid_secret
PLAID_ACCESS_TOKEN=your_plaid_access_token
PLAID_ENVIRONMENT=sandbox
```

**For n8n Docker:**
Add to your docker-compose.yml:
```yaml
environment:
  - GOOGLE_SHEET_ID=your_google_sheet_id
  - PLAID_CLIENT_ID=your_plaid_client_id
  - PLAID_SECRET=your_plaid_secret
  - PLAID_ACCESS_TOKEN=your_plaid_access_token
  - PLAID_ENVIRONMENT=sandbox
```

**For n8n Cloud:**
Go to Settings > Environment Variables and add them there.

**Important Notes:**
- The workflow uses HTTP header authentication for Plaid API
- All credentials are passed via environment variables
- No need to manually configure credentials in individual nodes
- Make sure to restart n8n after adding environment variables

## Step 4: Test the Workflow

### 4.1 Manual Test
1. Click **Execute Workflow** in n8n
2. Check if transactions appear in your Google Sheet
3. Verify data format and accuracy

### 4.2 Troubleshooting
- **No transactions**: Check if your access_token is valid
- **Authentication errors**: Verify Plaid credentials
- **Google Sheets errors**: Ensure OAuth is set up correctly and Sheet ID is correct

## Step 5: Activate Workflow

Once tested successfully:
1. Toggle **Active** in the top right of the workflow
2. The workflow will run daily at midnight (default schedule)
3. Adjust the cron expression in "Schedule Trigger" node if needed:
   - Daily: `0 0 * * *`
   - Weekly: `0 0 * * 0`
   - Every 6 hours: `0 */6 * * *`

## Workflow Features

### Transaction Sync
- Uses Plaid's `/transactions/sync` endpoint
- Automatically handles new and modified transactions
- Fetches up to 500 transactions per sync

### Data Fields Captured
- **Date**: Transaction date
- **Description**: Transaction description
- **Merchant**: Merchant name
- **Amount**: Transaction amount
- **Category**: Plaid-assigned category
- **Account ID**: Plaid account identifier
- **Transaction ID**: Unique transaction ID
- **Pending**: Whether transaction is pending (Yes/No)
- **Payment Channel**: How payment was made
- **Currency**: ISO currency code
- **Status**: Whether transaction was "Added" or "Modified"

### Automation
- Scheduled daily sync
- Automatic deduplication via transaction_id
- Handles both new and modified transactions

## Advanced Configuration

### Multiple Bank Accounts
To track multiple accounts:
1. Duplicate the workflow
2. Use different access_tokens for each account
3. Point to different sheet tabs or spreadsheets

### Custom Categories
Modify the "Format Transaction Data" code node to add custom categorization logic.

### Filtering Transactions
Add a filter node after "Format Transaction Data" to exclude certain transactions (e.g., pending only).

## Security Best Practices

1. **Never commit credentials** to version control
2. **Use environment variables** for all sensitive data
3. **Rotate access tokens** regularly
4. **Use production environment** only when ready
5. **Limit Google Sheets access** to necessary users
6. **Enable 2FA** on Plaid and Google accounts

## Support & Resources

- [Plaid API Documentation](https://plaid.com/docs/)
- [Plaid Transactions Sync Guide](https://plaid.com/docs/api/products/transactions/#transactionssync)
- [n8n Documentation](https://docs.n8n.io/)
- [Google Sheets API](https://developers.google.com/sheets/api)

## Troubleshooting Common Issues

### "Invalid access_token"
- Token expired or revoked
- Generate new token via Plaid Link
- Check environment configuration

### "Rate limit exceeded"
- Plaid has rate limits
- Reduce sync frequency
- Use transactions/sync cursor for pagination

### "Sheet not found"
- Verify GOOGLE_SHEET_ID
- Ensure sheet tab name matches configuration
- Check Google Sheets API permissions

## Cost Information

- **Plaid**: Free tier includes Development access (100 Items)
- **n8n**: Depends on your hosting (self-hosted is free)
- **Google Sheets**: Free (up to quotas)

## Next Steps

Consider adding:
- Email notifications for large transactions
- Budget tracking and alerts
- Monthly summary reports
- Data visualization with Google Data Studio
- Expense categorization ML
