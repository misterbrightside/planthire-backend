
const NotificationAreas = connection => {
  return connection.define('notificationAreas', {}, {
    timestamps: false
  });
};

export default {
  NotificationAreas
}