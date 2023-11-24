import React, { useContext, useState } from 'react';
import AlertDialog from './AlertDialog';
import applicationsAPI from '../services/applications.api';
import { MessageContext, UserContext } from '../Contexts';
import dayjs from 'dayjs';
import StickyHeadTable from './TableComponent';

function MainDashboard(props) {
  const {proposals, openSelectionMobile, drawerWidth } = props;
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const {user} = useContext(UserContext);
  const handleMessage = useContext(MessageContext);

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
              handleMessage("Successfully Applied","success");
          }}
          loading = {loading}
          item={selectedItem}
        />
      )}
      <StickyHeadTable proposals={proposals} onClick={handleCardClick}/>
    </>
  );
}

export default MainDashboard;
