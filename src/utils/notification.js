// Request permission for browser notifications
export function requestNotificationPermission() {
  if (!('Notification' in window)) {
    alert('This browser does not support desktop notification');
    return;
  }
  if (Notification.permission === 'default') {
    Notification.requestPermission();
  }
}

export function showNotification(title, options = {}) {
  if (!('Notification' in window)) return;
  if (Notification.permission === 'granted') {
    new Notification(title, options);
  } else if (Notification.permission === 'default') {
    Notification.requestPermission().then(permission => {
      if (permission === 'granted') {
        new Notification(title, options);
      }
      // Do nothing if denied
    });
  }
  // Do nothing if denied
} 