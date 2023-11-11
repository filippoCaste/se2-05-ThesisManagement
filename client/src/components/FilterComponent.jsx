import React, { useState } from "react";
import Typography from "@mui/material/Typography";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import ChipsArray from "./ChipsCustomized";
import SupervisorMenu from "./SupervisorMenu"; // Assuming SupervisorMenu is a custom component you'll implement
import Box from "@mui/material/Box";

export default function FilterComponent(props) {
  const { setLevel, setExpirationDate, setKeywords, setSupervisorid, currentDataAndTime } = props;
  const [selectedLevel, setSelectedLevel] = useState([]);
  const [selectedKeywords, setSelectedKeywords] = useState([]);
  const [selectedDates, setSelectedDates] = useState([null, null]);

  const level = [
    { key: 0, label: "1" },
    { key: 1, label: "2" },
    { key: 2, label: "3" },
    { key: 3, label: "4" },
    { key: 4, label: "5" },
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

  const handleLevelChange = (selectedItems) => {
    setSelectedLevel(selectedItems);
    setLevel(selectedItems);
  };

  const handleKeywordsChange = (selectedItems) => {
    setSelectedKeywords(selectedItems);
    setKeywords(selectedItems);
  };

  const handleDatesChange = (newDates) => {
    setSelectedDates(newDates);
    setExpirationDate(newDates);
  };

  return (
    <Box>
      <Typography variant="h7" fontWeight={"bold"}>
        Level:
      </Typography>
      <ChipsArray array={level} onChange={handleLevelChange} selectedItems={selectedLevel} />
      
      <Typography variant="h7" fontWeight={"bold"}>
        Expiration Date:
      </Typography>
      <Box display="flex" sx={{ mt: "2vh" }}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="From..."

            minDate={currentDataAndTime}
            format="DD/MM/YYYY"
            value={selectedDates[0]}
            onChange={(date) => handleDatesChange([date, selectedDates[1]])}
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
            value={selectedDates[1]}
            onChange={(date) => handleDatesChange([selectedDates[0], date])}
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
        <ChipsArray array={keywords} onChange={handleKeywordsChange} selectedItems={selectedKeywords} />
      </Box>
      
      <Box sx={{ mt: "2vh" }}>
        <Typography variant="h7" fontWeight={"bold"}>
          Supervisor:
        </Typography>
        <SupervisorMenu setSupervisorid={setSupervisorid} />
      </Box>
    </Box>
  );
}
