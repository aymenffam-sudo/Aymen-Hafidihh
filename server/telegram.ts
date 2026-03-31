/**
 * Telegram Bot Integration for FLOURITE Reset System
 * API ID: 26481531
 * Bot: @Store_Plus1_bot
 */

import axios from 'axios';

const TELEGRAM_API_ID = process.env.TELEGRAM_API_ID || '26481531';
const TELEGRAM_API_HASH = process.env.TELEGRAM_API_HASH || '';
const BOT_USERNAME = '@Store_Plus1_bot';
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '';

/**
 * Send reset command to Telegram bot
 */
export async function sendResetCommandToBot(keyCode: string): Promise<{
  success: boolean;
  messageId?: string;
  error?: string;
}> {
  try {
    if (!BOT_TOKEN) {
      console.error('[Telegram] Bot token not configured');
      return {
        success: false,
        error: 'Telegram bot not configured',
      };
    }

    // Format the command
    const command = `/reset ${keyCode}`;

    // Send message to bot via Telegram Bot API
    const response = await axios.post(
      `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
      {
        chat_id: BOT_USERNAME,
        text: command,
        parse_mode: 'HTML',
      },
      {
        timeout: 10000,
      }
    );

    if (response.data.ok) {
      return {
        success: true,
        messageId: response.data.result.message_id.toString(),
      };
    } else {
      return {
        success: false,
        error: response.data.description || 'Unknown error',
      };
    }
  } catch (error) {
    console.error('[Telegram] Error sending command:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send command',
    };
  }
}

/**
 * Get bot response from Telegram
 */
export async function getBotResponse(messageId: string): Promise<{
  success: boolean;
  response?: string;
  error?: string;
}> {
  try {
    if (!BOT_TOKEN) {
      return {
        success: false,
        error: 'Telegram bot not configured',
      };
    }

    // Get updates from bot
    const response = await axios.get(
      `https://api.telegram.org/bot${BOT_TOKEN}/getUpdates`,
      {
        timeout: 10000,
      }
    );

    if (response.data.ok && response.data.result.length > 0) {
      // Find the response related to our message
      const updates = response.data.result;
      const botResponse = updates.find((update: any) => {
        return (
          update.message &&
          update.message.reply_to_message_id &&
          update.message.reply_to_message_id.toString() === messageId
        );
      });

      if (botResponse) {
        return {
          success: true,
          response: botResponse.message.text,
        };
      }
    }

    return {
      success: false,
      error: 'No response from bot yet',
    };
  } catch (error) {
    console.error('[Telegram] Error getting response:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get response',
    };
  }
}

/**
 * Send notification to admin
 */
export async function sendAdminNotification(message: string): Promise<boolean> {
  try {
    if (!BOT_TOKEN) {
      return false;
    }

    const adminChatId = process.env.TELEGRAM_ADMIN_CHAT_ID;
    if (!adminChatId) {
      return false;
    }

    const response = await axios.post(
      `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
      {
        chat_id: adminChatId,
        text: message,
        parse_mode: 'HTML',
      },
      {
        timeout: 10000,
      }
    );

    return response.data.ok === true;
  } catch (error) {
    console.error('[Telegram] Error sending admin notification:', error);
    return false;
  }
}

/**
 * Format reset response for display
 */
export function formatResetResponse(response: string): string {
  // Clean up the response and format it nicely
  return response
    .replace(/\n/g, '<br />')
    .replace(/\*/g, '<strong>')
    .replace(/\*/g, '</strong>');
}
