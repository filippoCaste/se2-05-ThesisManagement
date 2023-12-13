import React from 'react';
import { useState, useEffect, useContext } from 'react';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import { Grid, FormControl, RadioGroup, FormControlLabel, Radio, Select, MenuItem, Input } from '@mui/material';
import API_Proposal from '../services/proposals.api';
import API_Applications from '../services/applications.api';
import { MessageContext, UserContext } from '../Contexts';
import CollapsibleTable from '../components/CollapsibleTable';
import AlertDialog from '../components/AlertDialog';
import API_Degrees from '../services/degrees.api';
import dayjs from 'dayjs' ;
import customParseFormat from 'dayjs/plugin/customParseFormat';
import ConfirmationDialog from '../components/ConfirmationDialog';

function TeacherPage(props)
{  
   const {currentDataAndTime} = props;
   const handleMessage = useContext(MessageContext);
   dayjs.extend(customParseFormat);


   const navigate = useNavigate();
   const { user } = useContext(UserContext);
   const [errorMsgAPI, setErrorMsgAPI] = useState('');
   const [listProposals, setListProposals]=useState([]);
   const [openDialog, setOpenDialog] = useState(false);
   const [openDialogApplication, setOpenDialogApplication] = useState(false);
   const [selectedItem, setSelectedItem] = useState(null);
   const [loading, setLoading] = useState(false);

   const [confirmation, setConfirmation] = useState(false);
   const [index, setIndex] = useState(null); // used for the confirmation procedure
   const [message, setMessage] = useState(null);
   const [operation, setOperation] = useState(null);
   const [degreesList, setDegreesList]=useState('');
    
  //FILTRI
  
  const [filterTitle, setFilterTitle]=useState('');
  const [filterLevel, setFilterLevel]=useState('');
  const [filterDegree, setFilterDegree]=useState('');
  const [filterStatus,setFilterStatus]=useState('');
  
  
  const handleFilterTitleChange = (value) => {
    setFilterTitle(value);
  };


  const handleReset = () => {
    setFilterTitle('');
    setFilterLevel('');
    setFilterDegree('');
    setFilterStatus('');
  };
  // FINE FILTRI
  
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

  const [listTitles,setListTitles]=useState('');


  const fetchData = async () => {
    console.log("user: ",user);

    if (user) 
    {
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

      
        const titoli= filteredProposal.map(p=> ({id: p.id, title: p.title}));
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
        data?.forEach(item => {updateArchivedStatus(item); });

       setListProposals(data);
       }
    }


    useEffect(() => { 
      API_Degrees.getAllDegrees()
      .then((d) => {setDegreesList(d); }  )
      .catch((err) => handleMessage(err,"warning"))
    },[]);



   useEffect(() => { 
      fetchData();
   }, [user, currentDataAndTime, filterStatus, filterTitle, filterLevel, filterDegree ]);

  async function deleteProposal(index) {
    const acceptDelete = confirm('Are you sure to delete this proposal?');
    if (!acceptDelete) {
      return;
    }
    await API_Proposal.deleteProposal(listProposals[index].p.id);
    setListProposals(listProposals.filter((_, i) => i !== index));
    handleMessage("Deleted proposal", "success");
  }
  async function archiveProposal(index) {
    const acceptArchive = confirm('Are you sure to archive this proposal?');
    if (!acceptArchive) {
      return;
    }
    await API_Proposal.archivedProposal(listProposals[index].p.id);
    setListProposals(listProposals.filter((_, i) => i !== index));
    handleMessage("Archived proposal", "success");
  }

  //LEVEL
  const handleRadioClickLevel = (value) => {
    if (value === filterLevel) 
    {
      setFilterLevel('');
    } 
    else 
    {
      setFilterLevel(value);
    }
  };

    //LEVEL
    const handleRadioClickStatus = (value) => {
      if (value === filterStatus) 
      {
        setFilterStatus('');
      } 
      else 
      {
        setFilterStatus(value);
      }
    };


  return (
    <>
      <br /> <br /> <br /> <br /> <br /> <br />
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={2}>
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
        <Grid item xs={12} sm={6} md={8}> 
        <input 
            type="text"  list="titleSuggestions"  placeholder="Search by Title"
           value={filterTitle}  onChange={(e) => handleFilterTitleChange(e.target.value)}
           style={{ width: '100%'}}
           className="form-text-input" /><datalist id="titleSuggestions">
          {Array.from(listTitles).map((titolo, index) => (
            <option key={titolo.id} value={titolo.title} />
          ))}
        </datalist>
        </Grid>  
        <Grid item xs={12} sm={6} md={2}> 
        </Grid>  
        
        <br/><br/>
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
                  <FormControlLabel value="MSc"  onClick={() => handleRadioClickLevel("MSc")}
                   control={<Radio />} label="MSc" />
                  <FormControlLabel value="BSc" onClick={() => handleRadioClickLevel("BSc")}
                  control={<Radio />} label="BSc" />
               </RadioGroup>
            </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
        <FormControl fullWidth>
         <Select labelId="degree-label"  id="degree-select" displayEmpty 
          value={filterDegree} onChange={(event) => setFilterDegree(event.target.value)} >
          <MenuItem value="" disabled> Search By Title Degree</MenuItem>
          {filterLevel==''?
            Array.from(degreesList).map((degree, index) => (
            <MenuItem key={degree.cod_degree} value={degree.title_degree}> {degree.title_degree} </MenuItem>  ))
             :
             Array.from(degreesList).filter(d=>d.level_degree == filterLevel).map((degree, index) => (
              <MenuItem key={degree.cod_degree} value={degree.title_degree}> {degree.title_degree} </MenuItem>  ))
          }
          </Select>
          </FormControl>
        </Grid>   
        
        {confirmation && customConfirmation(message, operation)}
        
        <CollapsibleTable
          listProposals={ listProposals }
          fetchProposals={fetchData}
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
            fetchProposals={fetchData}
          />
        )}
      </Grid>
    </>
  );
}

export default TeacherPage;
