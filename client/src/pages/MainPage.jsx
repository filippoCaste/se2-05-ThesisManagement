import {
  Box,
  Typography,
  Divider,
  Stack,
  Button,
  Container,
  TextField,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

function MainPage(props) {
  const navigate = useNavigate();
  const [list, setList] = useState([]);
  const [title, setTitle] = useState("");

  const handleClear = (event, reason) => {
    setTitle("");
  };

  const handleAddToList = (text) => {
    const newList = [...list];
    newList.push(text);
    setList(newList);
  };

  return (
    <Container disableGutters maxWidth={false}>
      <Box sx={{ pr: "20px", pl: "20px", pb: "20px" }}>
        <Stack direction={"row"}>
          <Typography variant="h4" gutterBottom sx={{ flexGrow: 1 }}>
            Queue Management System
          </Typography>
        </Stack>
        <Divider sx={{ mb: "20px" }} />
        <Stack direction="row" justifyContent="flex-start" spacing={1}>
          <TextField
            margin="normal"
            required
            fullWidth
            name="title"
            label="Title"
            id="title"
            onChange={(event) => {
              setTitle(event.target.value);
            }}
            value={title}
          />
          <Button
            variant="outlined"
            onClick={() => handleAddToList(title)}
            sx={{ maxWidth: "120px" }}
          >
            Add
          </Button>
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={handleClear}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Stack>
        <Divider sx={{ mb: "20px" }} />
        {list.map((item, index) => (
          <Typography key={index}>
            {index + 1}. {item}
          </Typography>
        ))}
      </Box>
    </Container>
  );
}

export default MainPage;
