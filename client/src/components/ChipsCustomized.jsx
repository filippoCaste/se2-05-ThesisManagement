import * as React from 'react';
import { styled } from '@mui/material/styles';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';

const ListItem = styled('li')(({ theme }) => ({
  margin: theme.spacing(0.5),
}));

export default function ChipsArray(props) {
  const { array, selectedArray, setSelectedArray } = props;
  const handleClick = (chipToSelect) => () => {
    if (selectedArray.some((chip) => chip?.id === chipToSelect?.id)) {
      // Deselect the chip
      setSelectedArray((selectedChips) =>
        selectedChips.filter((chip) => chip?.id !== chipToSelect?.id)
      );
    } else {
      // Select the chip
      setSelectedArray((selectedChips) => [...selectedChips, chipToSelect]);
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
        mt: '2vh',
      }}
      component="ul"
    >
      {array.map((data) => {
        const isSelected = selectedArray.some((chip) => chip?.id === data?.id);
        return (
          <ListItem id={data?.id} key={data?.id}>
            <Chip
              label={data?.name}
              onClick={handleClick(data)}
              color={isSelected ? 'secondary' : 'success'}
            />
          </ListItem>
        );
      })}
    </Paper>
  );
}
