"use strict";
const SERVER_URL = "http://localhost:3001";

const mapNotification = (notification) => {
  return {
    id: notification.id,
    title: notification.title,
    message: notification.message,
    createdAt: notification.created_at,
    isRead: notification.is_read,
  };
};

const getNotificationsForUser = async () => {
  try {
    const response = await fetch(SERVER_URL + `/api/notifications`, {
      method: "GET",
      credentials: "include",
    });
    if (response.ok) {
      const notifications = await response.json();
      return notifications.map(mapNotification);
    } else {
      const message = await response.text();
      throw new Error("Notification error: " + message);
    }
  } catch (error) {
    throw new Error("Network Error: " + error.message);
  }
};

const deleteNotification = async (notificationId) => {
  try {
    const response = await fetch(
      SERVER_URL + `/api/notifications/${notificationId}`,
      {
        method: "DELETE",
        credentials: "include",
      }
    );
    if (response.ok) {
      return true;
    } else {
      const message = await response.text();
      throw new Error("Notification error: " + message);
    }
  } catch (error) {
    throw new Error("Network Error: " + error.message);
  }
};

const deleteNotificationsForUser = async () => {
  try {
    const response = await fetch(SERVER_URL + `/api/notifications`, {
      method: "DELETE",
      credentials: "include",
    });
    if (response.ok) {
      return true;
    } else {
      const message = await response.text();
      throw new Error("Notification error: " + message);
    }
  } catch (error) {
    throw new Error("Network Error: " + error.message);
  }
};

const changeStatusOfNotifications = async () => {
  try {
    const response = await fetch(SERVER_URL + `/api/notifications`, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.ok) {
      return true;
    } else {
      const message = await response.text();
      throw new Error("Notification error: " + message);
    }
  } catch (error) {
    throw new Error("Network Error: " + error.message);
  }
};

const notificationsApi = {
  getNotificationsForUser,
  deleteNotification,
  deleteNotificationsForUser,
  changeStatusOfNotifications,
};

export default notificationsApi;
