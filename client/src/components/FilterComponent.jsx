import React from "react";
import Typography from "@mui/material/Typography";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import ChipsArray from "./ChipsCustomized"; // Make sure to import ChipsArray or your custom components
import SupervisorMenu from "./SupervisorMenu"; // Make sure to import SupervisorMenu or your custom components
import Box from "@mui/material/Box";

export default function FilterComponent(props) {
  const {currentDataAndTime} = props;
  const level = [
    { key: 0, label: "Beginner" },
    { key: 1, label: "Intermediate" },
    { key: 2, label: "Advanced" },
  ];
  const keywords = [
    { key: 0, label: "React" },
    { key: 1, label: "Java" },
    { key: 2, label: "AI" },
    { key: 3, label: "JavaScript" },
    { key: 4, label: "Python" },
    { key: 5, label: "CSS" },
    { key: 6, label: "HTML" },
    { key: 7, label: "Node.js" },
    { key: 8, label: "Machine Learning" },
  ];
  return (
    <Box>
      <Typography variant="h7" fontWeight={"bold"}>
        Level:
      </Typography>
      <ChipsArray array={level} />
      <Typography variant="h7" fontWeight={"bold"}>
        Expiration Date:
      </Typography>
      <Box display="flex" sx={{ mt: "2vh" }}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="From..."

            minDate={currentDataAndTime}
            format="DD/MM/YYYY"
            slotProps={{
              textField: {
                helperText: "DD/MM/YYYY",
              },
            }}
          />
          <DatePicker
            label="To..."

            minDate={currentDataAndTime}
            format="DD/MM/YYYY"
            slotProps={{
              textField: {
                helperText: "DD/MM/YYYY",
              },
            }}
          />
        </LocalizationProvider>
      </Box>
      <Box sx={{ mt: "2vh" }}>
        <Typography variant="h7" fontWeight={"bold"}>
          Keywords:
        </Typography>
        <ChipsArray array={keywords} />
      </Box>
      <Box sx={{ mt: "2vh" }}>
        <Typography variant="h7" fontWeight={"bold"}>
          Supervisor:
        </Typography>
        <SupervisorMenu />
      </Box>
    </Box>
  );
}
