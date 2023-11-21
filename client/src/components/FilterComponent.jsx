import React, { useState, useEffect } from 'react';
import Typography from '@mui/material/Typography';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import ChipsArray from './ChipsCustomized';
import SupervisorMenu from './SupervisorMenu';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import useMediaQuery from '@mui/material/useMediaQuery';
import teachersAPI from '../services/teachers.api';
import keywordsAPI from '../services/keywords.api';

export default function FilterComponent(props) {
  const {
    //setSelectedLevels,
    selectedExpirationDate,
    //selectedLevels,
    setSelectedExpirationDate,
    selectedStartExpirationDate,
    setSelectedStartExpirationDate,
    setSelectedKeywords,
    setSelectedSupervisorId,
    selectedSupervisorId,
    selectedKeywords,
    currentDataAndTime,
    title,
    setTitle,
  } = props;

  const [availableKeywords, setAvailableKeywords] = useState([]);
  const [availableSupervisors, setAvailableSupervisors] = useState([]);

  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down('sm'));

  useEffect(() => {
    const retrieveFilterOptions = async () => {
      const keywords = await keywordsAPI.getAllKeywords();
      const supervisors = await teachersAPI.getAllTeachers();
      setAvailableKeywords(keywords);
      setAvailableSupervisors(supervisors);
    };

    retrieveFilterOptions();
  }, []);

  return (
    <Box sx={{ padding: isSmallScreen ? '10px' : '20px' }}>
      <Box sx={{ mb: isSmallScreen ? '10px' : '20px' }}>
        <Typography variant="h6" fontWeight="bold">
          Title:
        </Typography>
        <TextField
          id="outlined-basic"
          label="Title"
          variant="outlined"
          value={title}
          onChange={(ev) => setTitle(ev.target.value)}
          sx={{ width: isSmallScreen ? '100%' : '240px', mt: '8px' }}
        />
      </Box>

      <Box sx={{ mb: isSmallScreen ? '10px' : '20px' }}>
        <Typography variant="h6" fontWeight="bold">
          Expiration Date:
        </Typography>
        <Box display="flex" sx={{ mt: '8px', flexDirection: isSmallScreen ? 'column' : 'row' }}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="From..."
              minDate={currentDataAndTime}
              format="DD/MM/YYYY"
              value={selectedStartExpirationDate}
              onChange={(date) => setSelectedStartExpirationDate(date)}
              slotProps={{
                textField: {
                  helperText: 'DD/MM/YYYY',
                  width: isSmallScreen ? '100%' : 'auto',
                },
              }}
            />
            <DatePicker
              label="To..."
              minDate={selectedStartExpirationDate ? selectedStartExpirationDate : currentDataAndTime}
              format="DD/MM/YYYY"
              value={selectedExpirationDate}
              onChange={(date) => setSelectedExpirationDate(date)}
              slotProps={{
                textField: {
                  helperText: 'DD/MM/YYYY',
                  width: isSmallScreen ? '100%' : 'auto',
                  ml: isSmallScreen ? 0 : '10px',
                },
              }}
            />
          </LocalizationProvider>
        </Box>
      </Box>

      <Box sx={{ mb: isSmallScreen ? '10px' : '20px' }}>
        <Typography variant="h6" fontWeight="bold">
          Keywords:
        </Typography>
        <ChipsArray
          array={availableKeywords}
          setSelectedArray={setSelectedKeywords}
          selectedArray={selectedKeywords}
        />
      </Box>

      <Box sx={{ mb: isSmallScreen ? '10px' : '20px' }}>
        <Typography variant="h6" fontWeight="bold">
          Supervisor:
        </Typography>
        <SupervisorMenu
          setSupervisorid={setSelectedSupervisorId}
          supervisors={availableSupervisors}
          supervisorId={selectedSupervisorId}
        />
      </Box>
    </Box>
  );
}
