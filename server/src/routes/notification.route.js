import { Router } from "express";
import { isLoggedIn } from "../config/configs.js";
import { changeStatusOfNotifications, deleteNotification, deleteNotificationsForUser, getNotificationsForUser } from "../controllers/notification.controller.js";

const router = Router();

router.get("/", isLoggedIn, getNotificationsForUser);

router.delete("/:notificationId", isLoggedIn, deleteNotification);

router.delete("/", isLoggedIn, deleteNotificationsForUser);

router.put("/", isLoggedIn, changeStatusOfNotifications);

export { router };
