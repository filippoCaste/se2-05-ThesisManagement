import React, { useContext, useState } from 'react';
import AlertDialog from './AlertDialog';
import applicationsAPI from '../services/applications.api';
import { MessageContext, UserContext } from '../Contexts';
import dayjs from 'dayjs';
import StickyHeadTable from './TableComponent';
import careerAPI from '../services/career.api';
import PropTypes from 'prop-types';

function MainDashboard(props) {
  const { proposals, drawerWidth, isAppliedProposals } =
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
          }}
          handleApply={(selectedFile) => {
            setLoading(true);
            applicationsAPI.createApplication(
              selectedItem.id,
              user.id,
              dayjs().format('YYYY-MM-DD')
            ).then((id) => {
              if(selectedFile) {
                careerAPI.uploadFile(selectedFile, id, user.id).then(() => {
                  handleMessage('Successfully Applied', 'success');
                }).catch((err) => handleMessage('Failed Applying '+ err, 'warning'));
              } else {
                handleMessage('Successfully Applied', 'success');
              }
            }).catch((err) => handleMessage('Failed Applying '+ err, 'warning'));

            setOpenDialog(false);
            setLoading(false);

          }}
          loading={loading}
          item={selectedItem}
          isAppliedProposals={isAppliedProposals}
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

MainDashboard.propTypes = {
  proposals: PropTypes.array.isRequired,
  drawerWidth: PropTypes.number.isRequired,
  isAppliedProposals: PropTypes.bool.isRequired,
};

export default MainDashboard;