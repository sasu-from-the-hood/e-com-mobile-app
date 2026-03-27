import nodemailer from 'nodemailer';
// Rate limiting to prevent spam
const errorEmailCache = new Map();
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour in milliseconds
function shouldSendEmail(errorKey) {
    const now = Date.now();
    const lastSent = errorEmailCache.get(errorKey);
    if (!lastSent || now - lastSent > RATE_LIMIT_WINDOW) {
        errorEmailCache.set(errorKey, now);
        return true;
    }
    return false;
}
function getErrorKey(message) {
    // Create a simple hash of the error message to group similar errors
    return message.substring(0, 100);
}
export async function sendErrorEmail(errorMessage, errorMeta) {
    try {
        const devEmailsRaw = process.env.DEV_EMAIL;
        const emailUser = process.env.EMAIL_FROM || process.env.EMAIL_USER;
        const emailPass = (process.env.EMAIL_PASSWORD || process.env.EMAIL_PASS || '').replace(/\s/g, ''); // Remove all spaces
        const emailHost = process.env.EMAIL_HOST || 'smtp.gmail.com';
        const emailPort = parseInt(process.env.EMAIL_PORT || '587');
        // Skip if email is not configured
        if (!devEmailsRaw || !emailUser || !emailPass) {
            console.log('[Email] Email notification not configured. Skipping...');
            return;
        }
        // Parse multiple emails separated by comma
        const devEmails = devEmailsRaw
            .split(',')
            .map(email => email.trim())
            .filter(email => email.length > 0);
        // Rate limiting: only send one email per error type per hour
        const errorKey = getErrorKey(errorMessage);
        if (!shouldSendEmail(errorKey)) {
            console.log('[Email] Rate limit: Email for this error was recently sent. Skipping...');
            return;
        }
        // Create transporter
        console.log('[Email] Creating SMTP transporter...');
        console.log('[Email] Host:', emailHost);
        console.log('[Email] Port:', emailPort);
        console.log('[Email] User:', emailUser);
        const transporter = nodemailer.createTransport({
            host: emailHost,
            port: emailPort,
            secure: emailPort === 465, // true for 465, false for other ports
            auth: {
                user: emailUser,
                pass: emailPass,
            },
            debug: true, // Enable debug output
            logger: true, // Log to console
        });
        console.log('[Email] Verifying SMTP connection...');
        await transporter.verify();
        console.log('[Email] SMTP connection verified successfully!');
        // Format metadata
        const metaString = errorMeta
            ? '\n\nAdditional Details:\n' + JSON.stringify(errorMeta, null, 2)
            : '';
        // Email content
        const mailOptions = {
            from: `"${process.env.APP_NAME || 'App'} Error Monitor" <${emailUser}>`,
            to: devEmails.join(', '), // Send to all emails
            subject: `🚨 ERROR: ${errorMessage.substring(0, 50)}...`,
            text: `An error occurred in your application:

Error Message:
${errorMessage}

Timestamp: ${new Date().toISOString()}
Environment: ${process.env.NODE_ENV || 'unknown'}
${metaString}

---
This is an automated error notification from your application logger.
`,
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #dc2626; color: white; padding: 20px; border-radius: 8px 8px 0 0;">
            <h2 style="margin: 0;">🚨 Application Error Detected</h2>
          </div>
          <div style="background-color: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
            <h3 style="color: #dc2626; margin-top: 0;">Error Message:</h3>
            <p style="background-color: white; padding: 15px; border-left: 4px solid #dc2626; font-family: monospace; white-space: pre-wrap; word-break: break-word;">${errorMessage}</p>
            
            <div style="margin-top: 20px;">
              <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
              <p><strong>Environment:</strong> ${process.env.NODE_ENV || 'unknown'}</p>
            </div>
            
            ${errorMeta ? `
              <h3 style="color: #374151; margin-top: 20px;">Additional Details:</h3>
              <pre style="background-color: white; padding: 15px; border: 1px solid #e5e7eb; border-radius: 4px; overflow-x: auto; font-size: 12px;">${JSON.stringify(errorMeta, null, 2)}</pre>
            ` : ''}
            
            <hr style="margin: 20px 0; border: none; border-top: 1px solid #e5e7eb;">
            <p style="color: #6b7280; font-size: 12px; margin: 0;">
              This is an automated error notification from your application logger.
            </p>
          </div>
        </div>
      `,
        };
        // Send email
        await transporter.sendMail(mailOptions);
        console.log('[Email] Error notification sent to:', devEmails.join(', '));
    }
    catch (error) {
        // Don't throw - we don't want email failures to crash the app
        console.error('[Email] Failed to send error notification:', error);
    }
}
//# sourceMappingURL=email.js.map