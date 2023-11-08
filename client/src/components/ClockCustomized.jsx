import * as React from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MobileDateTimePicker } from '@mui/x-date-pickers/MobileDateTimePicker';
import IconButton from '@mui/material/IconButton';
import QueryBuilderOutlinedIcon from '@mui/icons-material/QueryBuilderOutlined';




export default function ClockCustomized(props) {
  const {currentDataAndTime, setCurrentDataAndTime} = props;
  const [open, setOpen] = React.useState(false);


function ButtonField(props) {
  const {
    setOpen,
    label,
    id,
    disabled,
    InputProps: { ref } = {},
    inputProps: { 'aria-label': ariaLabel } = {},
  } = props;

  return (
    <IconButton
      variant="outlined"
      id={id}
      disabled={disabled}
      ref={ref}
      aria-label={ariaLabel}

      onClick={() => setOpen?.((prev) => !prev)}
    >
     <QueryBuilderOutlinedIcon fontSize='medium' sx={{fill:"white"}}/>
    </IconButton>
  );
}

    return (
    <LocalizationProvider dateAdapter={AdapterDayjs} >
    <MobileDateTimePicker       
      value={currentDataAndTime}
      slots={{ field: ButtonField, ...props.slots }}
      slotProps={{ field: { setOpen } }}
      open={open}
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      onChange={(newDateAndTime) => setCurrentDataAndTime(newDateAndTime)} />
    </LocalizationProvider>
    )};