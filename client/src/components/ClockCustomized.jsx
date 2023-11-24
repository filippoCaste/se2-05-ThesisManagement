import * as React from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import IconButton from '@mui/material/IconButton';
import QueryBuilderOutlinedIcon from '@mui/icons-material/QueryBuilderOutlined';
import { MobileDatePicker } from '@mui/x-date-pickers';
import {MessageContext} from "../Contexts";
import dayjs from 'dayjs';


export default function ClockCustomized(props) {
  const {currentDataAndTime, setCurrentDataAndTime} = props;
  const [open, setOpen] = React.useState(false);
  const handleMessage = React.useContext(MessageContext);

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
    <MobileDatePicker       
      value={currentDataAndTime}
      slots={{ field: ButtonField, ...props.slots }}
      slotProps={{ field: { setOpen } }}
      minDate={dayjs()}
      open={open}
      onClose={() => {setOpen(false); handleMessage("Time successfully changed: "+ currentDataAndTime.format("YYYY-MM-DD"),"success");}}
      onOpen={() => setOpen(true)}
      onChange={(newDateAndTime) => setCurrentDataAndTime(newDateAndTime)} />
    </LocalizationProvider>
    )};