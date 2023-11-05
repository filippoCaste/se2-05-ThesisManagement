import * as React from 'react';
import { styled } from '@mui/material/styles';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import TagFacesIcon from '@mui/icons-material/TagFaces';

const ListItem = styled('li')(({ theme }) => ({
  margin: theme.spacing(0.5),
}));

export default function ChipsArray(props) {
  const {array} = props;
  const [chipData, setChipData] = React.useState(array);
  const [chipsSelected, setChipsSelected] = React.useState([
  ]); 

  const handleClick = (chipToSelect) => () => {
    if (chipsSelected.some((chip) => chip.key === chipToSelect.key)) {
      // Deselect the chip
      setChipsSelected((selectedChips) =>
        selectedChips.filter((chip) => chip.key !== chipToSelect.key)
      );
    } else {
      // Select the chip
      setChipsSelected((selectedChips) => [...selectedChips, chipToSelect]);
    }
  };

  return (
    <Paper
      sx={{
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap',
        listStyle: 'none',
        p: 0.5,
        mt: "2vh",
      }}
      component="ul"
    >
      {chipData.map((data) => {
        const isSelected = chipsSelected.some((chip) => chip.key === data.key);
        return (
          <ListItem key={data.key}>
            <Chip
              label={data.label}
              onClick={handleClick(data)}
              color={isSelected ? 'secondary' : 'success'}
              
            />
          </ListItem>
        );
      })}
    </Paper>
  );
}