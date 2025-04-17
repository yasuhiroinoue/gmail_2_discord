/**
 * Splits text into chunks of specified size
 */
function splitIntoChunks(text, chunkSize) {
  const chunks = [];
  let i = 0;
  while (i < text.length) {
    chunks.push(text.substr(i, chunkSize));
    i += chunkSize;
  }
  return chunks;
}

function hook() {
  const threads = GmailApp.search('label:unread');  // Get unread threads

  if (threads.length == 0) {
    Logger.log('No new messages');
    return;
  }

  threads.forEach(function(thread) {
    const messages = thread.getMessages();
    let allPayloads = [];

    messages.forEach(function(message) {
      message.markRead();  // Mark email as read

      const from = message.getFrom();
      const subject = message.getSubject();
      const plainBody = message.getPlainBody();
      const attachments = message.getAttachments();
      const attachmentLinks = uploadAttachments(attachments);

      const webhook = getWebhookUrl();

      Logger.log(subject);
      
      // Split message body into chunks of 2000 characters
      const bodyChunks = splitIntoChunks(plainBody, 2000);
      
      // Create payloads for each chunk
      bodyChunks.forEach(function(chunk, index) {
        let payload;
        if (index === 0) {
          // First chunk includes original subject and attachments
          payload = {
            content: `${subject}\nAttachments: ${attachmentLinks.join('\n')}`,
            embeds: [{
              title: subject,
              author: {
                name: from,
              },
              description: chunk,
            }],
          };
        } else {
          // Continuation chunks
          payload = {
            embeds: [{
              title: `${subject} (continued ${index+1}/${bodyChunks.length})`,
              description: chunk,
            }],
          };
        }
        
        allPayloads.push({
          url: webhook,
          contentType: 'application/json',
          payload: JSON.stringify(payload),
        });
      });
      
      message.moveToTrash();
    });

    Logger.log(allPayloads);
    UrlFetchApp.fetchAll(allPayloads);
  });
}

function uploadAttachments(attachments) {
  return attachments.map(attachment => {
    const file = DriveApp.createFile(attachment);
    file.setSharing(DriveApp.Access.ANYONE, DriveApp.Permission.VIEW);
    return file.getUrl();
  });
}

function getWebhookUrl() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = spreadsheet.getActiveSheet();

  return sheet.getRange(1, 1).getValue();  // Get cell A1
}
