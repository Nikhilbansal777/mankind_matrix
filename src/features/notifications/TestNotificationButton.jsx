import React from 'react';
import { requestNotificationPermission, showNotification } from '../../utils/notification';

const TestNotificationButton = () => {
  const handleRequestPermission = () => {
    requestNotificationPermission();
  };

  const handleShowNotification = () => {
    showNotification('Test Notification', {
      body: 'This is a test notification!',
      icon: '/logo192.png', // Use your app logo or any icon
    });
  };

  return (
    <div style={{ margin: '1rem' }}>
      <button onClick={handleRequestPermission} style={{ marginRight: '1rem' }}>
        Request Notification Permission
      </button>
      <button onClick={handleShowNotification}>
        Show Test Notification
      </button>
    </div>
  );
};

export default TestNotificationButton; 