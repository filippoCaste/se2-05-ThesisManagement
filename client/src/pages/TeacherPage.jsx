import React, { useState, useEffect, useContext } from 'react';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Grid, FormControl, RadioGroup, FormControlLabel, Radio, Select, MenuItem } from '@mui/material';
import API_Proposal from '../services/proposals.api';
import API_Applications from '../services/applications.api';
import { MessageContext, UserContext } from '../Contexts';
import CollapsibleTable from '../components/CollapsibleTable';
import AlertDialog from '../components/AlertDialog';
import dayjs from 'dayjs';
import ApplicationDialog from '../components/ApplicationDialog';
import careerAPI from '../services/career.api';

import API_Degrees from '../services/degrees.api';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import ConfirmationDialog from '../components/ConfirmationDialog';
import PropTypes from 'prop-types';
import MenuButton from '../components/MenuButton';


function TeacherPage(props) {

   const { currentDataAndTime } = props;
   const handleMessage = useContext(MessageContext);
   dayjs.extend(customParseFormat);

  
   const { user } = useContext(UserContext);

   const [listProposals, setListProposals]=useState([]);
   const [openDialog, setOpenDialog] = useState(false);
   const [openDialogApplication, setOpenDialogApplication] = useState(false);
   const [selectedItem, setSelectedItem] = useState(null);
   const [loading, setLoading] = useState(false);
   const [selectedApplication, setSelectedApplication] = useState(null);
   const [studentExams, setStudentExams] = useState([]);
   const [confirmation, setConfirmation] = useState(false);
   const [index, setIndex] = useState(null); // used for the confirmation procedure
   const [operation, setOperation] = useState(null);
   const [degreesList, setDegreesList]=useState('');
    
  //FILTRES

  const [filterTitle, setFilterTitle] = useState('');
  const [filterLevel, setFilterLevel] = useState('');
  const [filterDegree, setFilterDegree] = useState('');
  const [filterStatus, setFilterStatus] = useState('');


  const handleFilterTitleChange = (value) => {
    setFilterTitle(value);
  };


  const handleReset = () => {
    setFilterTitle('');
    setFilterLevel('');
    setFilterDegree('');
    setFilterStatus('');
  };
  // END FILTRES

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
    careerAPI.getCareerByStudentId(datum.student_id).then((res) => {
      setStudentExams(res);
    });
    setOpenDialogApplication(true);
  };

  const [listTitles, setListTitles] = useState('');


  const fetchData = async () => {
    if (user) {
      const updateExpiredStatus = (proposals) => {
        proposals?.forEach(item => {
          if (dayjs(item.expiration_date).isBefore(currentDataAndTime.subtract(1, 'day'))) {
            item.status = "archived";
          }
        });
      };

      const proposals = await API_Proposal.getProposalsByTeacherId(user.id);

      updateExpiredStatus(proposals);


      const isTitleMatch = (row) => filterTitle === '' || row?.title.toLowerCase().includes(filterTitle.toLowerCase());
      const isLevelMatch = (row) => filterLevel === '' || row?.level === filterLevel;
      const isDegreeMatch = (row) => filterDegree === '' || row?.title_degree === filterDegree;
      const isStatusMatch = (row) => filterStatus === '' || row?.status === filterStatus;

      let filteredProposal = proposals?.filter(row =>
        isTitleMatch(row) && isLevelMatch(row) && isDegreeMatch(row) && isStatusMatch(row)
      );


      const titoli = filteredProposal.map(p => ({ id: p.id, title: p.title }));
      setListTitles(titoli);

      const updateStudentStatus = (students) => {
        students.forEach(student => {
          if (student.status === 'pending') {
            student.status = 'rejected';
          }
        });
      };

      const updateArchivedStatus = (item) => {
        if (item.p.status === 'archived') {
          updateStudentStatus(item.students);
        }
      };

      const data = await createData(filteredProposal);
      data?.forEach(item => { updateArchivedStatus(item); });

      setListProposals(data);
    }
  };

  useEffect(() => {
    API_Degrees.getAllDegrees()
      .then((d) => { setDegreesList(d); })
      .catch((err) => handleMessage(err, "warning"))
  }, []);



  useEffect(() => {
    fetchData();
  }, [user, currentDataAndTime, filterStatus, filterTitle, filterLevel, filterDegree]);

  async function deleteProposal(index) {
    setIndex(index);
    setOperation("delete")
    setConfirmation(true);
  }
  async function archiveProposal(index) {
    setIndex(index);
    setOperation("archive");
    setConfirmation(true);
  }

  const handleCloseDialog = () => {
    setConfirmation(false);
  }

  const handleConfirmation = async (result) => {
    if(result) {
      if(operation==='archive') {
        await API_Proposal.archivedProposal(listProposals[index].p.id);
        setListProposals(listProposals.filter((_, i) => i !== index));
        handleMessage("Archived proposal", "success");
      } else if(operation==='delete') {
        await API_Proposal.deleteProposal(listProposals[index].p.id);
        setListProposals(listProposals.filter((_, i) => i !== index));
        handleMessage("Deleted proposal", "success");
      }
    } else {
      setConfirmation(false);
    }
  }

  //LEVEL
  const handleRadioClickLevel = (value) => {
    if (value === filterLevel) {
      setFilterLevel('');
    }
    else {
      setFilterLevel(value);
    }
  };

  //LEVEL
  const handleRadioClickStatus = (value) => {
    if (value === filterStatus) {
      setFilterStatus('');
    }
    else {
      setFilterStatus(value);
    }
  };


  return (
    <Grid container mt="10%">
      <Grid item xs={12} sx={{ mt: '2vh', mx: '4vh' }}>
        {confirmation && <ConfirmationDialog operation={operation} message={"Are you sure you want to " + operation + " this thesis request?"}
          open={confirmation}
          onClose={handleCloseDialog}
          onConfirm={handleConfirmation}
        />}

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={2} />
          <Grid item xs={12} sm={6} md={8}>
            <input
              type="text" list="titleSuggestions" placeholder="Search by Title"
              value={filterTitle} onChange={(e) => handleFilterTitleChange(e.target.value)}
              style={{ width: '100%' }}
              className="form-text-input" /><datalist id="titleSuggestions">
              {Array.from(listTitles).map((titolo, index) => (
                <option key={titolo.id} value={titolo.title} />
              ))}
            </datalist>
          </Grid>
          <Grid item xs={12} sm={6} md={2} />

          <br /><br />
          {/* Second Row */}

          <Grid item xs={12} sm={6} md={2}>
            <Button variant="contained" color="secondary" onClick={handleReset}> Reset  </Button> {' '}
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <Typography variant="subtitle1" fontWeight="bold">  Thesis Status  </Typography>
              <RadioGroup row value={filterStatus} onChange={(event) => setFilterStatus(event.target.value)}>
                <FormControlLabel value="posted" onClick={() => handleRadioClickStatus("posted")}
                  control={<Radio />} label="Posted" />

                <FormControlLabel value="archived" onClick={() => handleRadioClickStatus("archived")}
                  control={<Radio />} label="Archived" />

                <FormControlLabel value="assigned" onClick={() => handleRadioClickStatus("assigned")}
                  control={<Radio />} label="Assigned" />
              </RadioGroup>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <Typography variant="subtitle1" fontWeight="bold">  Level  </Typography>
              <RadioGroup row value={filterLevel} onChange={(event) => setFilterLevel(event.target.value)}>
                <FormControlLabel value="MSc" onClick={() => handleRadioClickLevel("MSc")}
                  control={<Radio />} label="MSc" />
                <FormControlLabel value="BSc" onClick={() => handleRadioClickLevel("BSc")}
                  control={<Radio />} label="BSc" />
              </RadioGroup>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <FormControl fullWidth>
              <Select labelId="degree-label" id="degree-select" displayEmpty
                value={filterDegree} onChange={(event) => setFilterDegree(event.target.value)} >
                <MenuItem value="" disabled> Search By Title Degree</MenuItem>
                {filterLevel == '' ?
                  Array.from(degreesList).map((degree, index) => (
                    <MenuItem key={degree.cod_degree} value={degree.title_degree}> {degree.title_degree} </MenuItem>))
                  :
                  Array.from(degreesList).filter(d => d.level_degree == filterLevel).map((degree, index) => (
                    <MenuItem key={degree.cod_degree} value={degree.title_degree}> {degree.title_degree} </MenuItem>))
                }
              </Select>
            </FormControl>
          </Grid>

          <CollapsibleTable
            listProposals={listProposals}
            fetchProposals={fetchData}
            onClick={handleClick}
            onClickApplication={handleClickApplication}
            deleteProposal={deleteProposal}
            archiveProposal={archiveProposal}
          />

<br /> <br />       
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
                item={selectedApplication}
              //fetchProposals={fetchData}
              studentExams={studentExams}
          />
          )}
        </Grid>
      </Grid >
      <MenuButton userRole='teacher' />
    </Grid >
  );
}

TeacherPage.propTypes = {
  currentDataAndTime: PropTypes.object.isRequired,
};

export default TeacherPage;

