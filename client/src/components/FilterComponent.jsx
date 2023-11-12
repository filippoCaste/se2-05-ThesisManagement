import React, { useState, useEffect } from "react";
import Typography from "@mui/material/Typography";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import ChipsArray from "./ChipsCustomized";
import SupervisorMenu from "./SupervisorMenu"; // Assuming SupervisorMenu is a custom component you'll implement
import Box from "@mui/material/Box";
import teachersAPI from '../services/teachers.api.js';
import levelAPI from "../services/levels.api.js";
import keywordsAPI from "../services/keywords.api.js";


export default function FilterComponent(props) {
  const {  setSelectedLevels,
  selectedExpirationDate,
  selectedLevels,
  setSelectedExpirationDate,
  selectedStartExpirationDate,
  setSelectedStartExpirationDate,
  setSelectedKeywords,
  setSelectedSupervisorId,
  selectedSupervisorId,
  selectedKeywords,
  currentDataAndTime } = props;


  const [availableLevels,setAvailableLevels] = useState([]);
  const [availableKeywords,setAvailableKeywords] = useState([]);
  const [availableSupervisors,setAvailableSupervisors] = useState([]);

    useEffect(() => {
    
    const retrieveFilterOptions = async() =>{
      const levels = await levelAPI.getLevels();
      const keywords = await keywordsAPI.getAllKeywords();
      const supervisors = await teachersAPI.getAllTeachers();
      setAvailableKeywords(keywords);
      setAvailableLevels(levels);
      setAvailableSupervisors(supervisors);
    }

    retrieveFilterOptions();

  }, []);


  return (
    <Box>
      <Typography variant="h7" fontWeight={"bold"}>
        Level:
      </Typography>
      <ChipsArray array={availableLevels} setSelectedArray={setSelectedLevels} selectedArray={selectedLevels} />
      
      <Typography variant="h7" fontWeight={"bold"}>
        Expiration Date:
      </Typography>
      <Box display="flex" sx={{ mt: "2vh" }}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="From..."

            minDate={currentDataAndTime}
            format="DD/MM/YYYY"
            value={selectedStartExpirationDate}
            onChange={(date) => setSelectedStartExpirationDate(date)}
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
            value={selectedExpirationDate}
            onChange={(date) => setSelectedExpirationDate(date)}
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
       {<ChipsArray array={availableKeywords} setSelectedArray={setSelectedKeywords} selectedArray={selectedKeywords} />
       }
      </Box>
      
      <Box sx={{ mt: "2vh" }}>
        <Typography variant="h7" fontWeight={"bold"}>
          Supervisor:
        </Typography>
        <SupervisorMenu setSupervisorid={setSelectedSupervisorId} supervisors={availableSupervisors} supervisorid={selectedSupervisorId} />
      </Box>
    </Box>
  );
}
