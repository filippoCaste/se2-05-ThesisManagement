import React from 'react';
import { useState, useEffect, useContext } from 'react';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import { Grid, Select, FormControl } from '@mui/material';
import theme from '../theme';
import { MenuItem } from '@mui/material';
import API_Proposal from '../services/proposals.api';
import API_Applications from '../services/applications.api';
import { MessageContext, UserContext } from '../Contexts';
import CollapsibleTable from '../components/CollapsibleTable';
import AlertDialog from '../components/AlertDialog';
import ApplicationDialog from '../components/ApplicationDialog';

function TeacherPage(props) {
  const navigate = useNavigate();
  const {handleMessage} = useContext(MessageContext);
  const { user } = useContext(UserContext);
  const [errorMsgAPI, setErrorMsgAPI] = useState('');
  const [listProposals, setListProposals] = useState([]);
  //const [filterStatus,setFilterStatus]=useState('posted');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(false);

  //applications dialog
  const [openDialogApplication, setOpenDialogApplication] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);

  async function createRow(p) {
    const students = await API_Applications.getApplicationStudentsByProposalId(
      p.id
    );
    return { p, students };
  }

  async function createData(proposals) {
    const rows = await Promise.all(proposals.map((p) => createRow(p)));
    return rows;
  }

  const handleClick = (datum) => {
    setSelectedItem(datum);
    setOpenDialog(true);
  };
  const handleClickApplication = (datum) => {
    setSelectedApplication(datum);
    setOpenDialogApplication(true);
  };
  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        const proposals = await API_Proposal.getProposalsByTeacherId(user.id);
        const data = await createData(proposals);
        setListProposals(data);
      }
    };

    fetchData();
  }, [user]);

  async function deleteProposal(index) {
    const acceptDelete = confirm('Are you sure to delete this proposal?');
    if (!acceptDelete) {
      return;
    }
    await API_Proposal.deleteProposal(listProposals[index].p.id);
    setListProposals(listProposals.filter((_, i) => i !== index));
    handleMessage("Deleted proposal", "success")
  }
  async function archiveProposal(index) {
    const acceptArchive = confirm('Are you sure to archive this proposal?');
    if (!acceptArchive) {
      return;
    }
    await API_Proposal.archivedProposal(listProposals[index].p.id);
    handleMessage("Archived proposal", "success")
    setListProposals(listProposals.filter((_, i) => i !== index));
  }

  return (
    <>
      <br /> <br /> <br /> <br /> <br />
      {/*<Typography variant="h5" align="center"> PAGES STATUS {filterStatus}  </Typography> <br />*/}
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/teacher/addProposal')}
          >
            {' '}
            INSERT NEW THESIS PROPOSAL{' '}
          </Button>{' '}
          <br /> <br />
        </Grid>
        {/*<Grid item xs={4}>
            <FormControl fullWidth>
               <Typography variant="subtitle1" fontWeight="bold">  FILTER BY STATUS  </Typography>
               <Select
                  labelId="word-label"
                  id="status-select"
                  onChange={(ev) => { setFilterStatus(ev.target.value) }}
               >
                  {
                     Array.from(["all", "posted", "active"]).map((status, index) => 
                     (<MenuItem key={index} value={status}> {status} </MenuItem> ))
                  }
               </Select>
            </FormControl>
               </Grid> */}

        <CollapsibleTable
          listProposals={listProposals}
          onClick={handleClick}
          onClickApplication={handleClickApplication}
          deleteProposal={deleteProposal}
          archiveProposal={archiveProposal}
        />
        {openDialog && (
          <AlertDialog
            open={openDialog}
            handleClose={() => {
              setLoading(false);
              setOpenDialog(false);
            }}
            loading={loading}
            item={selectedItem}
          />
        )}
        {openDialogApplication && (
          <ApplicationDialog
            open={openDialogApplication}
            handleClose={() => {
              setLoading(false);
              setOpenDialogApplication(false);
            }}
            loading={loading}
            item={selectedApplication}
          />
        )}
      </Grid>
    </>
  );
}

export default TeacherPage;
