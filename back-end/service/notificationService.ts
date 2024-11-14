export interface Notification {
    recipient: string;
    message: string;
  }
  
  export function sendNotification(notification: Notification): void {
    console.log(`Notification sent to ${notification.recipient}: ${notification.message}`);
    // Replace this with actual email or WebSocket implementation
  }
  