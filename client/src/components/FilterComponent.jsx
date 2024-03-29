import React, { useState, useEffect } from 'react';
import Typography from '@mui/material/Typography';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import teachersAPI from '../services/teachers.api';
import keywordsAPI from '../services/keywords.api';
import theme from '../theme';
import SupervisorMenu from './SupervisorMenu';
import CheckboxesTags from './Autocomplete';
import PropTypes from 'prop-types';

export default function FilterComponent(props) {
  const {
    selectedExpirationDate,
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



  useEffect(() => {
    const retrieveFilterOptions = async () => {
      try {
        const keywords = await keywordsAPI.getAllKeywords();
        const supervisors = await teachersAPI.getAllTeachers();
        setAvailableKeywords(keywords);
        setAvailableSupervisors(supervisors);
      } catch (error) {
        console.error('Error retrieving filter options:', error);
      }
    };

    retrieveFilterOptions();
  }, []);

  return (
    <Box
      sx={{
        background: 'white',
        borderRadius: '8px',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
        color: theme.palette.primary.main,
        width:"100%"
      }}
    >
      <Box >
        <Typography variant="h6" fontWeight="bold" sx={{ color: theme.palette.secondary.main, fontFamily: 'helvetica' }}>
          Title:
        </Typography>
        <TextField
          id="outlined-basic"
          label="Title"
          variant="outlined"
          value={title}
          onChange={(ev) => setTitle(ev.target.value)}
          sx={{ width: '100%', mt: '5%' }}
        />
      </Box>
      <Box sx={{ mt: "5%" }}>
        <Typography variant="h6" fontWeight="bold" sx={{ color: theme.palette.secondary.main, fontFamily: 'helvetica' }}>
          Expiration Date:
        </Typography>
        <Box display="flex" sx={{ mt: '5%', flexDirection:'column' }}>
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
                  width: {sm: '100%', md: 'auto'},
                },
              }}
            />
            <DatePicker
              label="To..."
              minDate={selectedStartExpirationDate || currentDataAndTime}
              format="DD/MM/YYYY"
              value={selectedExpirationDate}
              onChange={(date) => setSelectedExpirationDate(date)}
              slotProps={{
                textField: {
                  helperText: 'DD/MM/YYYY',
                  width: {sm: '100%', md: 'auto'},
                  },
              }}
            />
          </LocalizationProvider>
        </Box>
      </Box>

      <Box sx={{ mt: "5%" }} >
        <Typography variant="h6" fontWeight="bold" sx={{ color: theme.palette.secondary.main, fontFamily: 'helvetica' }}>
          Keywords:
        </Typography>
        <CheckboxesTags array={availableKeywords} setSelectedArray={setSelectedKeywords} selectedArray={selectedKeywords}/>
      </Box>

      <Box sx={{ mt: "5%" }}>
        <Typography variant="h6" fontWeight="bold" sx={{ color: theme.palette.secondary.main, fontFamily: 'helvetica' }}>
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

FilterComponent.propTypes = {
  selectedExpirationDate: PropTypes.object.isRequired,
  setSelectedExpirationDate: PropTypes.func.isRequired,
  selectedStartExpirationDate: PropTypes.object.isRequired,
  setSelectedStartExpirationDate: PropTypes.func.isRequired,
  setSelectedKeywords: PropTypes.func.isRequired,
  setSelectedSupervisorId: PropTypes.func.isRequired,
  selectedSupervisorId: PropTypes.string.isRequired,
  selectedKeywords: PropTypes.array.isRequired,
  currentDataAndTime: PropTypes.object.isRequired,
  title: PropTypes.string.isRequired,
  setTitle: PropTypes.func.isRequired,
};
