import React, { useContext, useState } from 'react';
import AlertDialog from './AlertDialog';
import applicationsAPI from '../services/applications.api';
import { MessageContext, UserContext } from '../Contexts';
import dayjs from 'dayjs';
import StickyHeadTable from './TableComponent';

function MainDashboard(props) {
  const { proposals, openSelectionMobile, drawerWidth, isAppliedProposals } =
    props;
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const { user } = useContext(UserContext);
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
          handleClose={() => {
            setLoading(false);
            setOpenDialog(false);
            //console.log(selectedItem.id + ' ' + user.id);
          }}
          handleApply={() => {
            setLoading(true);

            applicationsAPI.createApplication(
              selectedItem.id,
              user.id,
              dayjs().format('YYYY-MM-DD')
            ).then(() => handleMessage('Successfully Applied', 'success'))
            .catch((err) => handleMessage('Failed Applying '+ err, 'warning'));

            setOpenDialog(false);
            setLoading(false);

          }}
          loading={loading}
          item={selectedItem}
        />
      )}
      <StickyHeadTable
        proposals={proposals}
        onClick={handleCardClick}
        drawerWidth={drawerWidth}
        isAppliedProposals={isAppliedProposals}
      />
    </>
  );
}

export default MainDashboard;