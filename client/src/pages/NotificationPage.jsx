import { useEffect, useState, useContext, useRef } from "react";
import {
  Button,
  List,
  ListItem,
  Typography,
  Grid,
  Box,
  Stack,
  IconButton,
  Divider,
  Popover,
  Container,
  alpha,
} from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import DeleteIcon from "@mui/icons-material/Delete";
import CircleIcon from "@mui/icons-material/Circle";
import { MessageContext } from "../Contexts";
import ConfirmationDialog from "../components/ConfirmationDialog";
import theme from "../theme";
import notificationsApi from "../services/notifications.api";

function NotificationsPage(props) {
  const [anchorEl, setAnchorEl] = useState(null);
  const handleMessage = useContext(MessageContext);
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
  const [confirmation, setConfirmation] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [singleToBeDeleted, setSingleToBeDeleted] = useState(null);

  useEffect(() => {
    setTimeout(() => {
      markAsRead();
    }, 5 * 1000);

    const getNotifications = async () => {
      try {
        const newNotifications =
          await notificationsApi.getNotificationsForUser();
        setNotifications(newNotifications);
      } catch (error) {
        handleMessage(error.message, "error");
      }
    };

    getNotifications();
  }, []);


  const markAsRead = () => {
    notificationsApi.changeStatusOfNotifications();
  };

  const handleClick = (event, notificationId) => {
    setSingleToBeDeleted(notificationId);
    setAnchorEl(event.currentTarget);
  };

  const handleDeleteAll = async (result) => {
    if (!result) return;
    const notificationsBefore = notifications;
    try {
      await notificationsApi.deleteNotificationsForUser();
      setNotifications([]);
      handleMessage("All notifications deleted", "success");
    } catch (error) {
      setNotifications(notificationsBefore);
      handleMessage(
        "There was an error while deleting the notifications",
        "error"
      );
    }
  };

  function getTimeElapsed(dateTime) {
    const currentTime = new Date();
    const elapsedMilliseconds = currentTime - new Date(dateTime);
    const elapsedSeconds = Math.floor(elapsedMilliseconds / 1000);
    const elapsedMinutes = Math.floor(elapsedSeconds / 60);
    const elapsedHours = Math.floor(elapsedMinutes / 60);
    const elapsedDays = Math.floor(elapsedHours / 24);
    const elapsedWeeks = Math.floor(elapsedDays / 7);

    if (elapsedWeeks > 0) {
      return `${elapsedWeeks} w`;
    } else if (elapsedDays > 0) {
      return `${elapsedDays} d`;
    } else if (elapsedHours > 0) {
      return `${elapsedHours} h`;
    } else {
      return `${elapsedMinutes} m`;
    }
  }

  const handleDeleteSingle = async (event) => {
    const notificationsBefore = notifications;
    try {
      await notificationsApi.deleteNotification(singleToBeDeleted);
      setNotifications(
        notifications.filter(
          (notification) => notification.id !== singleToBeDeleted
        )
      );
      handleMessage("Notification deleted", "success");
    } catch (error) {
      setNotifications(notificationsBefore);
      handleMessage(
        "There was an error while deleting the notification",
        "error"
      );
    } finally {
      setSingleToBeDeleted(null);
      setAnchorEl(null);
    }
  };

  const onClose = () => {
    setAnchorEl(null);
  };

  return (
    <Grid
      container
      mt="10%"
      sx={{
        paddingTop: "2%",
        alignItems: "center",
        display: "inline-flex",
        flexDirection: "column",
      }}
    >
      <Box
        sx={{
          alignItems: "center",
          width: "50%",
          paddingTop: 2,
        }}
        border={1}
        borderColor="primary.main"
        borderRadius={4}
        bgcolor="#f2f2f2"
      >
        <Stack direction={"row"} sx={{ paddingLeft: "1vw" }}>
          <Typography variant="h5">Notifications</Typography>
          <Box sx={{ display: "flex", flexGrow: 1 }}></Box>
          <Button sx={{ color: "red" }} onClick={() => setConfirmation(true)}>
            DELETE ALL
          </Button>
          {confirmation && (
            <ConfirmationDialog
              operation={"Confirm"}
              message={"Are you sure you want to delete all notifications?"}
              open={confirmation}
              onClose={() => setConfirmation(false)}
              onConfirm={handleDeleteAll}
            />
          )}
        </Stack>
        {notifications.length === 0 && (
          <Typography variant="h6" sx={{ paddingLeft: "1vw" }}>
            No notifications to show.
          </Typography>
        )}
        <List>
          {notifications.map((notification, index) => (
            <ListItem
              sx={{
                paddingLeft: 2,
                paddingRight: 2,
                bgcolor: notification.isRead
                  ? "#f2f2f2"
                  : alpha(theme.palette.primary.main, 0.2),
              }}
              key={notification.id}
              className={notification.isRead ? "read" : "unread"}
            >
              <Stack
                direction={"column"}
                sx={{
                  flexGrow: 1,
                  display: "flex",
                }}
              >
                <Stack direction={"row"} sx={{ flexGrow: 1, display: "flex" }}>
                  <Stack direction={"column"}>
                    <Typography variant="h6">{notification.title}</Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                      }}
                    >
                      {notification.message}
                    </Typography>
                  </Stack>
                  <Box sx={{ display: "flex", flexGrow: 1 }}></Box>
                  <Stack direction={"column"} sx={{ alignItems: "center" }}>
                    <Typography sx={{ fontSize: 12 }}>
                      {getTimeElapsed(notification.createdAt)}
                    </Typography>
                    <IconButton
                      size="small"
                      aria-label="close"
                      color="inherit"
                      onClick={(event) => handleClick(event, notification.id)}
                      key={notification.id}
                    >
                      <MoreHorizIcon />
                    </IconButton>
                    {!notification.isRead && (
                      <CircleIcon
                        sx={{ fontSize: 10, color: "primary.main" }}
                      />
                    )}
                    <Popover
                      id={id}
                      open={open}
                      anchorEl={anchorEl}
                      onClose={onClose}
                      anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "center",
                      }}
                      transformOrigin={{
                        vertical: "top",
                        horizontal: "center",
                      }}
                    >
                      <Stack
                        direction={"column"}
                        sx={{ p: 1, cursor: "pointer" }}
                        onClick={handleDeleteSingle}
                      >
                        <Stack direction={"row"}>
                          <Typography sx={{ p: 1, fontSize: 14 }}>
                            Delete notification
                          </Typography>
                          <DeleteIcon sx={{ alignSelf: "center" }} />
                        </Stack>
                      </Stack>
                    </Popover>
                  </Stack>
                </Stack>
                <Box height="1vh"></Box>
                {index !== notifications.length - 1 && (
                  <Divider
                    sx={{
                      color: "primary.main",
                      border: "0.5px solid",
                    }}
                  />
                )}
              </Stack>
            </ListItem>
          ))}
        </List>
      </Box>
    </Grid>
  );
}

export default NotificationsPage;
