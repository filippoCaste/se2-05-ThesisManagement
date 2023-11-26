import * as React from 'react';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

export default function CheckboxesTags(props) {
  const { array, selectedArray, setSelectedArray } = props;

  const handleArrayChange = (event, value) => {
    setSelectedArray(value); // Update selected keywords when options change
  };

  return (
    <Autocomplete
      multiple
      id="checkboxes-tags-demo"
      options={array}
      disableCloseOnSelect
      limitTags={4}
      getOptionLabel={(option) => option.name}
      sx={{ mt: '5%'}}
      renderOption={(props, option, { selected }) => (
        <li {...props}>
          <Checkbox
            icon={icon}
            checkedIcon={checkedIcon}
            checked={selected}
          />
          {option.name}
        </li>
      )}
      style={{ width: "100%" }}
      value={selectedArray} // Set the selected value
      onChange={handleArrayChange} // Handle selected value changes
      renderInput={(params) => (
        <TextField {...params} />
      )}
    />
  );
}
