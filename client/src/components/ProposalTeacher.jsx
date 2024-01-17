import React, { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import { useNavigate, useParams } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { MessageContext, UserContext } from '../Contexts';
import { FormControl, Select, MenuItem, Input, Container, IconButton, Paper, Avatar } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';


import proposalAPI from '../services/proposals.api';
import API_Degrees from '../services/degrees.api';
import API_Keywords from '../services/keywords.api';
import API_Teachers from '../services/teachers.api';

import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';

import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import ConfirmationDialog from './ConfirmationDialog';


function ProposalTeacher(props) {
  const { currentDataAndTime, typeOperation } = props;

  const navigate = useNavigate();
  const handleMessage = useContext(MessageContext);
  dayjs.extend(customParseFormat);

  const { proposalId } = useParams(); //PROPOSAL ID

  const { user } = useContext(UserContext);
  const [teachersList, setTeachersList] = useState('');
  const [degreesList, setDegreesList] = useState('');
  const selectedSupervisor = user?.id;
  const [keywordsList, setKeywordsList] = useState(''); //prese dal DB

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [required_knowledge, setRequired_knowledge] = useState('');
  const [notes, setNotes] = useState('');
  const [type, setType] = useState('');
  const [level, setLevel] = useState('');
  const [expirationDate, setExpirationDate] = useState(currentDataAndTime || dayjs());

  const [confirmation, setConfirmation] = useState(false); // used for the confirmationDialog

  const [isAddCoSupervisorDisable, setIsAddCoSupervisorDisable]= useState(true);

  //DEGREE DROPDOWN MENU
  const [selectedDegree, setSelectedDegree] = useState('');
  const [selectedDegreeList, setSelectedDegreeList] = useState([]);

  const handleAddClickDegree = () => {
    if (selectedDegree != '') 
    {
      if (selectedDegree && !selectedDegreeList.includes(selectedDegree)) {
        setSelectedDegreeList([...selectedDegreeList, selectedDegree]);
        setSelectedDegree(''); // Clean the selection
      }
    }
  };

  const handleRemoveClickDegree = (indexToRemove) => {
    const updatedDegreeList = selectedDegreeList.filter(
      (_, index) => index !== indexToRemove
    );
    setSelectedDegreeList(updatedDegreeList);
  };

  //CO SUPERVISORS DROPDOWN MENU
  const [selectedCoSup, setSelectedCoSup] = useState('');
  const [selectedCoSupList, setSelectedCoSupList] = useState([]);

  const handleAddClickCoSupervisor = () => {
    if (selectedCoSup != '') {
      // get the teacher from the email        
      let array_teacher = Array.from(teachersList);
      let newSelectCoSup = array_teacher.filter(t => t.email == selectedCoSup);

      let selectedCoSupObject = { ...newSelectCoSup[0] };
      const isCoSupervisorAlreadySelected = selectedCoSupList
        .some(t => t.teacher_id === selectedCoSupObject.teacher_id);

      if (selectedCoSupObject && !isCoSupervisorAlreadySelected) {
        setSelectedCoSupList([...selectedCoSupList, selectedCoSupObject]);
        setSelectedCoSup('');  // Clean the selection
      }
      
    }
  };

  const handleRemoveClickCoSupervisor = (indexToRemove) => {
    const updatedCoSupList = selectedCoSupList.filter(
      (_, index) => index !== indexToRemove
    );
    setSelectedCoSupList(updatedCoSupList);
  };


  //KEWWORDS DROPDOWN MENU
  const [newKeyword, setNewKeyword] = useState('');

  const [selectedKeyword, setSelectedKeyword] = useState('');
  const [selectedKeywordList, setSelectedKeywordList] = useState([]);

  const handleAddClickKeyword = () => {
    if (selectedKeyword !== '') {
      if (!selectedKeywordList.includes(selectedKeyword)) {
        setSelectedKeywordList([...selectedKeywordList, selectedKeyword]);
        setSelectedKeyword(''); // Clean the selection
      }
    } else if (newKeyword !== '') {
      // Add the new keyword
      setSelectedKeywordList([...selectedKeywordList, newKeyword]);
      setNewKeyword(''); // Clean the input after new keyword has been added
    }
  }

  const handleRemoveClickKeyword = (indexToRemove) => {
    const updatedKeywordList = selectedKeywordList.filter(
      (_, index) => index !== indexToRemove
    );
    setSelectedKeywordList(updatedKeywordList);
  };

  //EXTERNALS
  const [formExternal, setFormExternal] = useState({ name: '', surname: '', email: '' });
  const [listExternals, setListExternals] = useState([]);

  const handleInputChangeExternal = (field) => (event) => {
    setFormExternal({ ...formExternal, [field]: event.target.value });
  };

  const handleAddExternal = () => {
    //check fields: name, surname, email
    let name = formExternal.name;
    let surname = formExternal.surname;
    let email = formExternal.email;
    let i;

    //name
    for (i = 0; (i < name.length); i++) {
      if (!isNaN(parseInt(name[i]))) {
        handleMessage("ATTENTION NAME: " + name + " CAN'T CONTAIN NUMBERS ", "warning");
        return;
      }
    }

    //surname
    for (i = 0; (i < surname.length); i++) {
      if (!isNaN(parseInt(surname[i]))) {
        handleMessage("ATTENTION SURNAME: " + surname + " CAN'T CONTAIN NUMBER ", "warning");
        return;
      }
    }

    // email check
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]+$/;
    if (!emailRegex.test(email)) {
      handleMessage("ATTENTION EMAIL NOT VALID ", "warning");
      return;
    }

    setListExternals([...listExternals, formExternal]);
    setFormExternal({ name: '', surname: '', email: '' });

  };

  const handleRemoveClickExternal = (index) => {
    const updatedExternals = [...listExternals];
    updatedExternals.splice(index, 1);
    setListExternals(updatedExternals);
  };



  // USE EFFECT /////////////////////////////////////////////
  useEffect(() => {
    const isCoSupervisorValid = 
    selectedCoSup 
    && teachersList.some( (teacher) => teacher.email === selectedCoSup)
    && !selectedCoSupList.some((t) => t.email === selectedCoSup);

    setIsAddCoSupervisorDisable(!isCoSupervisorValid);
  }, [selectedCoSup]);
  

  const [changeLevel,setChangeLevel]= useState(0);
  
  useEffect(() => {
    if(changeLevel >= 3 )
    {
      setSelectedDegreeList([]);
    }
    setChangeLevel((old)=>old+1);
  }, [level])



  useEffect(() => {
    if ((degreesList.length > 0) && ((typeOperation == "edit") || (typeOperation == "copy"))) {

      proposalAPI.getProposalByProposalId(proposalId)
        .then((p) => {
          setTitle(() => (p.title));
          setDescription(() => (p.description));
          setType(() => (p.type));
          setExpirationDate(() => (dayjs(p.expiration_date)));
          setRequired_knowledge(() => (p.required_knowledge));
          setNotes(() => (p.notes));
          setLevel(() => (p.level));

          // Check if p.cod_degree is an array
          let list_cod_degree;
          if (!(Array.isArray(p.cod_degree))) {
            list_cod_degree = [p.cod_degree];
          }
          else {
            list_cod_degree = p.cod_degree;
          }

          let list = [];
          list_cod_degree.forEach(codice_degree => {

            degreesList.forEach(d => {
              if (codice_degree == d.cod_degree) {
                list.push(d);
              }
            })

          })
          // Using Promise.resolve to ensure setSelectedDegreeList finishes before continuing
          Promise.resolve(setSelectedDegreeList(list))
            .then(() => {
              // Continue with the rest of your code here
              p.coSupervisors.forEach(obj => { obj.teacher_id = obj.id; delete obj.id; });
              setSelectedCoSupList(p.coSupervisors);
              setSelectedKeywordList(p.keywords);
  
              if (p.externalSupervisors !== undefined) {
                setListExternals(p.externalSupervisors);
              }
            })
            .catch((err) => handleMessage(err, "warning"));
        })
        .catch((err) => handleMessage(err, "warning"));
    }

  }, [degreesList]);


  useEffect(() => {
    API_Degrees.getAllDegrees()
      .then((d) => { setDegreesList(d); })
      .catch((err) => handleMessage(err, "warning"))

    API_Teachers.getAllTeachers()
      .then((t) => setTeachersList(t))
      .catch((err) => handleMessage(err, "warning"))

    API_Keywords.getAllKeywords()
      .then((k) => { setKeywordsList(k); })
      .catch((err) => handleMessage(err, "warning"))

  }, [])
  


  //VALIDATE INPUT FORM
  function validateInput(title, description, type, level, selectedDegreeList,
    selectedKeywordList, expirationDate) {
    let errors = [];

    if (!title) errors.push("TITLE");
    if (!description) errors.push("DESCRIPTION");
    if (!type) errors.push("TYPE");
    if (!level) errors.push("LEVEL");
    if (selectedDegreeList.length === 0) errors.push("DEGREE");
    if (selectedKeywordList.length === 0) errors.push("KEYWORDS");
    if (!expirationDate) errors.push("EXPIRATION DATE");

    return errors;
  }

  function displayErrorMessage(errors) {
    if (errors.length > 0) {
      const errorMessage = "ATTENTION: " + errors.join(", ") + " EMPTY";
      handleMessage(errorMessage, "warning");
      return true; // Input is not correct
    }
    return false; // Input is correct
  }

  //HANDLER SUBMIT
  function handleSubmit(event) {
    event.preventDefault();

    let array_only_cod_degree = selectedDegreeList.map(d => d.cod_degree);

    let inputErrors =
      validateInput(title, description, type, level, array_only_cod_degree, selectedKeywordList, expirationDate);


    if (displayErrorMessage(inputErrors)) {
      return;
    }


    ////////IF CORRECT INPUT //////////////////////////////////                      
    setConfirmation(true);
  }

  const handleCloseDialog = () => {
    setConfirmation(false);
  }

  const handleConfirmation = (result) => {
    if (result) {
      let array_only_cod_degree = selectedDegreeList.map(d => d.cod_degree);
      let array_only_id_co_supervisors = selectedCoSupList.map(co => co.teacher_id);
      let formatted_expiration = expirationDate.format("YYYY-MM-DD");
      let cod_group = user.cod_group;
      let supervisors_obj = {
        "supervisor_id": selectedSupervisor,
        "co_supervisors": array_only_id_co_supervisors, "external": listExternals
      };

      //ADD PROPOSAL  
      if (typeOperation == "add") {
        proposalAPI.postProposal(title, type, description, level, formatted_expiration, notes,
          required_knowledge, array_only_cod_degree, cod_group, supervisors_obj, selectedKeywordList)
          .then(() => {
            handleMessage("The proposal has been successfully added", "success");
            navigate('/teacher');
          })
          .catch((err) => handleMessage(err, "warning"));
      }

      //UPDATE PROPOSAL  
      if (typeOperation == "edit") {

        proposalAPI.updateProposal(proposalId, title, type, description, level,
          formatted_expiration, notes, required_knowledge, array_only_cod_degree, cod_group,
          supervisors_obj, selectedKeywordList)
          .then(() => {
            handleMessage("The proposal has been successfully modified", "success");
            navigate('/teacher');
          })
          .catch((err) => handleMessage(err, "warning"))
      }

      //COPY PROPOSAL
      if (typeOperation == "copy") {
        proposalAPI.postProposal(title, type, description, level, formatted_expiration, notes,
          required_knowledge, array_only_cod_degree, cod_group, supervisors_obj, selectedKeywordList)
          .then(() => {
            handleMessage("The proposal has been successfully added", "success");
            navigate('/teacher');
          })
          .catch((err) => handleMessage(err, "warning"));
      }

    }
  }

  let array_cod_degree = [
    { id: "1", short: 'MSc', long: "Master of Science" },
    { id: "2", short: 'BSc', long: "Bachelor of Science" }
  ];

  //SEND FORM ///////////////////////////////////////////////////////////////////////////////////


  return (
    <Grid container mt="10%">
      <Grid item xs={12} sx={{ mt: '2vh', mx: '4vh' }}>

        {confirmation && <ConfirmationDialog operation={typeOperation} message={"Are you sure you want to " + typeOperation + " this thesis proposal?"}
          open={confirmation}
          onClose={handleCloseDialog}
          onConfirm={handleConfirmation}
        />}


        {typeOperation === "add" ? (
          <> <Typography variant="h4" align="center">  INSERT A NEW THESIS PROPOSAL <br /> </Typography> <br /> </>) : (<></>)}

        {typeOperation === "edit" ? (
          <>   <Typography variant="h4" align="center"> EDIT PROPOSAL OF THESIS: <br /> {title} </Typography> <br /> </>) : (<></>)}

        {typeOperation === "copy" ? (
          <>   <Typography variant="h4" align="center"> COPY PROPOSAL OF THESIS: <br /> {title} </Typography> <br /> </>) : (<></>)}

        <Grid container spacing={3}>
          <Grid item md={1}>
            <Avatar sx={{ width: 61, height: 61, bgcolor: '#FCBF49' }}>  {/* or secondary #F77F00 */}
              {String(user?.name).charAt(0)}{String(user?.surname).charAt(0)}
            </Avatar>
          </Grid>
          <Grid item md={4}>
            <Typography>{user?.name}  {user?.surname}  ({user?.id})</Typography>
            <Typography>Deparment: {user?.cod_department}</Typography>
            <Typography>Group: {user?.group_name}</Typography>
          </Grid>
        </Grid>

        <br /> <br />

        <form onSubmit={handleSubmit}>

          <Typography variant="subtitle1" fontWeight="bold">   TITLE </Typography>
          <TextField name="title" variant="filled" fullWidth
            value={title} onChange={ev => setTitle(ev.target.value)} />  <br /> <br />

          <Typography variant="subtitle1" fontWeight="bold"> DESCRIPTION </Typography>
          <TextField name="description" variant="outlined" fullWidth multiline
            rows={7} value={description} onChange={ev => setDescription(ev.target.value)} />  <br />  <br />

          <Grid container spacing={2}>
            <Grid item xs={4}>
              <FormControl fullWidth>
                <Typography variant="subtitle1" fontWeight="bold">  SUPERVISOR  </Typography>
                <TextField name="supervisor" variant="outlined" fullWidth
                  value={"d" + user?.id} disabled />
              </FormControl>
            </Grid>

            <Grid item xs={4}>
              <Typography variant="subtitle1" fontWeight="bold"> TYPE </Typography>
              <TextField name="type" variant="outlined" fullWidth
                value={type} onChange={ev => setType(ev.target.value)} />  <br /> <br />
            </Grid>

            <Grid item xs={6}>
              <FormControl fullWidth>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <Typography variant="subtitle1" fontWeight="bold"> EXPIRATION DATE </Typography>
                  <DatePicker
                    format="DD/MM/YYYY"
                    value={expirationDate}
                    minDate={dayjs(currentDataAndTime)}
                    disablePast
                    onChange={(newDate) => { setExpirationDate(newDate); }}

                  />
                </LocalizationProvider>
              </FormControl>
            </Grid>

          </Grid> <br />

          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <Typography variant="subtitle1" fontWeight="bold">  SELECT A DEGREE LEVEL  </Typography>
                < Select
                  labelId="word-label"
                  id="level-select"
                  value={level}
                  disabled={typeOperation == 'edit'}
                  onChange={(ev) => { setLevel(ev.target.value) }}
                >
                  {
                    array_cod_degree.map((el, index) =>
                      <MenuItem key={el.id} value={el.short}> {el.long}</MenuItem>)

                  }
                </Select>
              </FormControl>
            </Grid>
          </Grid>   <br /> <br />

          {level !== '' && <><Grid item xs={4}>
            <Paper elevation={3} style={{ padding: '1rem' }}>

            {typeOperation != "edit"?
              <FormControl fullWidth>
                <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                  ADD DEGREE  {level == 'MSc' ? "MASTER" : "BACHELOR"}
                </Typography>
                <Select
                  labelId="degree-label"
                  id="degree-select"
                  value={selectedDegree}
                  disabled={level === ''}
                  onChange={(event) => setSelectedDegree(event.target.value)}
                  input={<Input id="select-multiple" />}
                >
                  {Array.from(degreesList).filter(d => d.level_degree == level).map((degree, index) => (
                    <MenuItem key={degree.cod_degree} value={degree}>
                      {degree.title_degree}
                    </MenuItem>
                  ))}
                </Select>

                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleAddClickDegree}
                  style={{ marginTop: '1rem' }}
                >
                  ADD
                </Button>

                {/* Selected degree -list */}
                {selectedDegreeList.length != 0 && <Typography variant="h6" style={{ marginTop: '1rem' }}>
                  Added degrees
                </Typography>}
                { 
                  selectedDegreeList.map((degree, index) => (
                  <Paper key={degree.cod_degree} elevation={1} style={{ padding: '0.5rem', marginTop: '0.5rem' }}>
                    <Grid container alignItems="center">
                      <Grid item xs={10}>
                        <Typography variant="body1">{degree.title_degree} </Typography>
                      </Grid>
                      <Grid item xs={2}>
                        <IconButton
                          color="primary"
                          aria-label="delete"
                          onClick={() => handleRemoveClickDegree(index)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Grid>
                    </Grid>
                  </Paper>
                ))}
              </FormControl>

            : 
            <>
              {/* Selected degree -list */}
              {selectedDegreeList.length > 0 && 
                <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                  DEGREE 
                </Typography>
                }

            {selectedDegreeList.length > 0 &&  selectedDegreeList.map((degree,index)=>(
                <Grid key={degree.cod_degree} container alignItems="center" style={{ padding: '0.5rem', marginTop: '0.5rem' }}>
                <Grid item xs={10}>
                  <Typography variant="body1">{degree.title_degree}</Typography>
                </Grid>
              </Grid>
              ))}</>}
            </Paper>
          </Grid> <br /> <br /> </>}


          <Typography variant="subtitle5" fontWeight="bold"> REQUIRED KNOWLEDGE </Typography>
          <TextField name="required_knowledge" variant="filled" fullWidth multiline rows={7}
            value={required_knowledge} onChange={ev => setRequired_knowledge(ev.target.value)} />  <br /> <br />

          <br />  <br />

          <Grid item xs={4}>
            <Paper elevation={3} style={{ padding: '1rem' }}>
              <FormControl fullWidth>
                <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                  ADD CO-SUPERVISORS
                </Typography>

                <input
                  type="text" list="teacherSuggestions" placeholder="Insert Co Supervisor"
                  value={selectedCoSup} onChange={(event) => setSelectedCoSup(event.target.value)}
                  style={{ width: '100%' }}
                  className="form-text-input" />
                <datalist id="teacherSuggestions">
                  {Array.from(teachersList).filter(t => t.teacher_id != user.id).map((teacher, index) => (
                    <option key={teacher.teacher_id} value={teacher.email} />
                  ))}
                </datalist>

                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleAddClickCoSupervisor}
                  style={{ marginTop: '1rem' }}
                  disabled= {isAddCoSupervisorDisable}
                >
                  ADD
                </Button>

                {/* View selected co-supervisors */}
                {selectedCoSupList.length != 0 && <Typography variant="h6" style={{ marginTop: '1rem' }}>
                  Selected Co-Supervisors
                </Typography>}
                {selectedCoSupList.map((coSupervisor, index) => (
                  <Paper key={coSupervisor.teacher_id} elevation={1} style={{ padding: '0.5rem', marginTop: '0.5rem' }}>
                    <Grid container alignItems="center">
                      <Grid item xs={10}>
                        <Typography variant="body1">{coSupervisor.email} </Typography>
                      </Grid>
                      <Grid item xs={2}>
                        <IconButton
                          color="primary"
                          aria-label="delete"
                          onClick={() => handleRemoveClickCoSupervisor(index)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Grid>
                    </Grid>
                  </Paper>
                ))}
              </FormControl>
            </Paper>
          </Grid> <br /> <br />


          <Grid item xs={4}>
            <Paper elevation={3} style={{ padding: '1rem' }}>
              <FormControl fullWidth>
                <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                  ADD KEYWORDS
                </Typography>
                <Select
                  labelId="keyword-label"
                  id="cosup-select"
                  value={selectedKeyword}
                  onChange={(event) => setSelectedKeyword(event.target.value)}
                  input={<Input id="select-multiple" />}
                >
                  {Array.from(keywordsList).map((k, index) => (
                    <MenuItem key={k.id} value={k.name}>
                      {k.name}
                    </MenuItem>
                  ))}
                </Select>

                {/* Input form for new keyword (i.e. not in the db) */}
                <TextField
                  label="New Keyword"
                  variant="outlined"
                  fullWidth
                  value={newKeyword}
                  onChange={(event) => setNewKeyword(event.target.value)}
                  style={{ marginTop: '1rem' }}
                />

                {/* Button to add the new keyword */}
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleAddClickKeyword}
                  style={{ marginTop: '1rem' }}
                >
                  ADD
                </Button>

                {/* View selected co-supervisors */}
                {selectedKeywordList.length != 0 && <Typography variant="h6" style={{ marginTop: '1rem' }}>
                  Added keywords
                </Typography>}
                {selectedKeywordList.map((keyword, index) => (
                  <Paper key={keyword.id} elevation={1} style={{ padding: '0.5rem', marginTop: '0.5rem' }}>
                    <Grid container alignItems="center">
                      <Grid item xs={10}>
                        <Typography variant="body1">{keyword}</Typography>
                      </Grid>
                      <Grid item xs={2}>
                        <IconButton
                          color="primary"
                          aria-label="delete"
                          onClick={() => handleRemoveClickKeyword(index)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Grid>
                    </Grid>
                  </Paper>
                ))}
              </FormControl>
            </Paper>
          </Grid>   <br /> <br />

          {/* EXTERNALS */}
          <Grid item xs={4}>
            <Paper elevation={3} style={{ padding: '1rem' }}>
              <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                ADD EXTERNAL CO-SUPERVISORS
              </Typography>

              {/* Input for external co-supervisors contacts */}
              <TextField
                label="Name"
                variant="outlined"
                fullWidth
                value={formExternal.name}
                onChange={handleInputChangeExternal('name')}
                style={{ marginTop: '1rem' }}
              />
              <TextField
                label="Surname"
                variant="outlined"
                fullWidth
                value={formExternal.surname}
                onChange={handleInputChangeExternal('surname')}
                style={{ marginTop: '1rem' }}
              />
              <TextField
                label="Email"
                variant="outlined"
                fullWidth
                value={formExternal.email}
                onChange={handleInputChangeExternal('email')}
                style={{ marginTop: '1rem' }}
              />

              {/* Button to add the external co-supervisor */}
              <Button
                variant="contained"
                color="primary"
                onClick={handleAddExternal}
                style={{ marginTop: '1rem' }}
                disabled={!formExternal.name || !formExternal.surname || !formExternal.email}
              >
                ADD EXTERNAL
              </Button>

              {/* Display selected external co-supervisor */}
              {listExternals.length != 0 && <Typography variant="h6" style={{ marginTop: '1rem' }}>
                Selected Externals
              </Typography>}
              {listExternals.map((external, index) => (
                <Paper key={external.email} elevation={1} style={{ padding: '0.5rem', marginTop: '0.5rem' }}>
                  <Grid container alignItems="center">
                    <Grid item xs={10}>
                      <Typography variant="body1">
                        {external.name} {external.surname}, {external.email}
                      </Typography>
                    </Grid>
                    <Grid item xs={2}>
                      <IconButton
                        color="primary"
                        aria-label="delete"
                        onClick={() => handleRemoveClickExternal(index)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Grid>
                  </Grid>
                </Paper>
              ))}
            </Paper>
          </Grid> <br /> <br />

          {/* NOTES */}

          <Typography variant="subtitle5" fontWeight="bold"> NOTES </Typography>
          <TextField name="notes" variant="filled" fullWidth multiline rows={5}
            value={notes} onChange={ev => setNotes(ev.target.value)} />  <br /> <br />


          <br />

          {typeOperation == "add" ?
            <Button variant="contained" color="primary" type="submit"> ADD PROPOSAL </Button> : <></>}

          {typeOperation == "edit" ?
            <Button variant="contained" color="primary" type="submit"> UPDATE PROPOSAL </Button> : <></>}

          {typeOperation == "copy" ?
            <Button variant="contained" color="primary" type="submit"> ADD PROPOSAL </Button> : <></>}

          {' '} <Button variant="contained" color="error" onClick={() => { navigate('/teacher'); handleMessage("Undone insert proposal", "success"); }}> CANCEL </Button>

        </form>

      </Grid>
    </Grid>

  );

}


ProposalTeacher.propTypes = {
  typeOperation: PropTypes.string.isRequired,

};


export default ProposalTeacher;