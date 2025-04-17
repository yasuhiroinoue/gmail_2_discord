# Gmail to Discord Integration

A Google Apps Script that automatically forwards Gmail messages to Discord using webhooks. The script fetches unread emails, formats them for Discord, and sends them as webhook messages.

## Features

- Automatically forwards unread Gmail messages to Discord
- Handles message content, subject, and sender information
- Uploads attachments to Google Drive and includes shareable links
- **Split Message Support**: Handles emails that exceed Discord's 2000 character limit by splitting them into multiple messages while maintaining context
- Marks processed emails as read and moves them to trash after forwarding

## Setup Instructions

### Prerequisites

- A Google account with Gmail
- A Discord server with permission to create webhooks
- Basic knowledge of Google Apps Script

### Step 1: Create a Discord Webhook

1. In your Discord server, go to Server Settings > Integrations > Webhooks
2. Click "New Webhook"
3. Name your webhook and select the channel where messages should be posted
4. Copy the webhook URL for later use

### Step 2: Set Up Google Sheets

1. Create a new Google Sheets document
2. Enter your Discord webhook URL in cell A1

### Step 3: Set Up Google Apps Script

1. In your Google Sheets document, go to Extensions > Apps Script
2. Copy and paste the code from `main.gs` into the script editor
3. Save the project with a name like "Gmail to Discord"

## Configuration and Usage

### Running the Script Manually

1. In the Apps Script editor, select the `hook` function
2. Click the Run button (▶️)
3. The first time you run the script, authorize the necessary permissions

### Setting Up Automatic Triggers

To run the script automatically at regular intervals:

1. In the Apps Script editor, click on Triggers (clock icon) in the sidebar
2. Click "Add Trigger"
3. Set up a trigger with the following settings:
   - Choose which function to run: `hook`
   - Choose which deployment should run: Head
   - Select event source: Time-driven
   - Select type of time based trigger: Minutes timer (or your preferred interval)
   - Select hour interval: Every 5 minutes (or your preferred frequency)
4. Click Save

## How It Works

1. The script searches for unread emails in your Gmail
2. For each unread email:
   - It extracts the sender, subject, and body
   - It uploads any attachments to Google Drive and creates shareable links
   - If the email body exceeds 2000 characters, it splits the content into multiple messages
   - It sends the formatted message(s) to Discord via webhook
   - It marks the email as read and moves it to trash

## Notes

- The webhook URL is stored in Google Sheets cell A1 for easy configuration
- The script maintains the original message context even when splitting long emails
- Continuation messages are clearly labeled with "Subject (continued X/Y)" format
