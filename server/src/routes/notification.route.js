import { Router } from "express";
import { isLoggedIn } from "../config/configs.js";
import { changeStatusOfNotifications, deleteNotification, deleteNotificationsForUser, getNotificationsForUser } from "../controllers/notification.controller.js";

const router = Router();

router.get("/", getNotificationsForUser);

router.delete("/:notificationId", deleteNotification);

router.delete("/", deleteNotificationsForUser);

router.put("/:userId", changeStatusOfNotifications);

export { router };
