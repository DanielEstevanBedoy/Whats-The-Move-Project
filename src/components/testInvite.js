const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

exports.createNotification = functions.database.ref('/Users/{userId}/Events/{eventId}')
.onCreate((snapshot, context) => {
  const event = snapshot.val();
  const userId = context.params.userId;

  // Fetch friends of the user
  return admin.database().ref(`/Users/${userId}/friends`).once('value').then(snapshot => {
    const friends = snapshot.val();
    const notifications = {};
    const notificationContent = `Your friend has created a new event: ${event.name}`;
    for (let friendId in friends) {
      notifications[friendId] = {content: notificationContent, eventId: context.params.eventId};
    }
    // Add notifications to the database
    return admin.database().ref('/Notifications').update(notifications);
  });
});
