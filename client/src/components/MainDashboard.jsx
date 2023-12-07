import React, { useContext, useState } from 'react';
import AlertDialog from './AlertDialog';
import applicationsAPI from '../services/applications.api';
import { MessageContext, UserContext } from '../Contexts';
import dayjs from 'dayjs';
import StickyHeadTable from './TableComponent';
import { Button, Badge } from '@mui/material';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';

function MainDashboard(props) {
  const { proposals, isAppliedProposals } = props;
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const { user } = useContext(UserContext);
  const handleMessage = useContext(MessageContext);

  const columns = [
    { id: 'title', label: 'Title', width: isAppliedProposals? '30%' : '35%' },
    { id: 'supervisor_id', label: 'Supervisor', width: '20%' },
    {
      id: 'expiration_date',
      label: 'Expiration Date',
      width: '10%',
      format: (value) => dayjs(value).format('DD/MM/YYYY'),
    },
    { id: 'keyword_names', label: 'Keywords', width: '15%' },
    {
      id: 'button',
      label: 'Show more details',
      width: '15%',
      format: (row) => (
        <Button
          variant="outlined"
          startIcon={<DescriptionOutlinedIcon />}
          style={{
            fontSize: '12px',
            textTransform: 'none',
            color: '#2196f3',
            borderRadius: '4px',
            border: '1px solid #2196f3',
            transition: 'background-color 0.3s',
            '&:hover': {
              backgroundColor: '#2196f3',
              color: 'white',
            },
          }}
          onClick={() => handleButtonClick(row)}
        >
          Show more details
        </Button>
      ),
    },
  ];

  // push status col if isAppliedProposals is true
  if (isAppliedProposals) {
    columns.push({
      id: 'status',
      label: 'Status',
      width: '5%',
      format: (value) => (
        <Badge color={getColorByStatus(value)} badgeContent={value}></Badge>
      ),
    });
  }

  const getColorByStatus = (status) => {
    switch (status) {
      case 'rejected':
        return 'secondary';
      case 'submitted':
        return 'primary';
      case 'accepted':
        return 'success';
      default:
        return 'action';
    }
  };

  const handleButtonClick = (datum) => {
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
        rows={proposals}
        columns={columns}
        noDataMessage={isAppliedProposals ? 'No applied proposals' : 'No available thesis'}
        pagination = {true}
      />
    </>
  );
}

export default MainDashboard;
