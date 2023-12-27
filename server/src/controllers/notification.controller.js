import {
  deleteAllNotificationsForUser,
  deleteNotificationById,
  getAllNotificationsForUser,
  getNotificationById,
  setReadNotificationsForUser,
} from "../services/notification.services.js";
import { isNumericInputValid } from "../utils/utils.js";

export const getNotificationsForUser = async (req, res) => {
  try {
    const result = await getAllNotificationsForUser(req.body.id);
    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export const deleteNotification = async (req, res) => {
  try {
    const { notificationId } = req.params;
    if (!isNumericInputValid([notificationId])) {
        return res.status(400).json({ error: "Notification ID must be a number" });
    }
    const notification = getNotificationById(notificationId);
    if (!notification) {
        return res.status(404).json({ error: "Notification not found" });
    }
    const result = await deleteNotificationById(notificationId);
    return res.status(200).json({ message: "Notification deleted successfully" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export const deleteNotificationsForUser = async (req, res) => {
  try {
    const result = await deleteAllNotificationsForUser(req.body.id);
    return res.status(200).json({ message: "Notifications deleted successfully" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export const changeStatusOfNotifications = async (req, res) => {
  try {
    const result = await setReadNotificationsForUser(req.params.userId);
    return res.json(result);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
