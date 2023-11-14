import React, { useContext, useState } from 'react';
import Grid from '@mui/material/Grid';
import CardCustomized from './CardCustomized';
import AlertDialog from './AlertDialog';
import levelAPI from '../services/levels.api';
import applicationsAPI from '../services/applications.api';
import { UserContext } from '../Contexts';
import dayjs from 'dayjs';

function MainDashboard(props) {
  const {proposals, openSelectionMobile, drawerWidth } = props;
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const {user} = useContext(UserContext);

  const handleCardClick = (datum) => {
    setSelectedItem(datum);
    setOpenDialog(true);
  };
  
  return (
    <>
      {openDialog && (
        <AlertDialog
          open={openDialog}
          handleClose={() => {setLoading(false);setOpenDialog(false); console.log(selectedItem.id+ " "+ user.id)}}
          handleApply={() => {

              setLoading(true);
              
              applicationsAPI.createApplication(selectedItem.id, user.id,dayjs().format("YYYY-MM-DD"));

              setOpenDialog(false);
              setLoading(false);
          }}
          loading = {loading}
          item={selectedItem}
        />
      )}
      <Grid mt={"0.5vh"} container spacing={2} sx={{ width: {xs:"100vw",sm:"auto"} }}>
        {proposals.map((proposal) => (
          <Grid item key={proposal.id} sm ={6} md={4} >
            <CardCustomized proposal={proposal} onClick={handleCardClick} />
          </Grid>
        ))}
      </Grid>
    </>
  );
}

export default MainDashboard;
