import React, { useState } from 'react';
import Grid from '@mui/material/Grid';
import CardCustomized from './CardCustomized';
import AlertDialog from './AlertDialog';

function MainDashboard(props) {
  const {proposals, openSelectionMobile, drawerWidth } = props;
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCardClick = (datum) => {
    setSelectedItem(datum);
    setOpenDialog(true);
  };
  
  return (
    <>
      {openDialog && (
        <AlertDialog
          open={openDialog}
          handleClose={() => {setLoading(false);setOpenDialog(false)}}
          handleApply={() => {

              setLoading(true);
              setOpenDialog(false);
              setLoading(false);
          }}
          loading = {loading}
          item={selectedItem}
        />
      )}
      <Grid mt={"0.5vh"} container spacing={2} sx={{ width: {sm:"100vw",md:"auto"} }}>
        {proposals.map((proposal) => (
          <Grid item key={proposal.id} xs={6} sm ={4} md={4} >
            <CardCustomized proposal={proposal} onClick={handleCardClick} />
          </Grid>
        ))}
      </Grid>
    </>
  );
}

export default MainDashboard;
