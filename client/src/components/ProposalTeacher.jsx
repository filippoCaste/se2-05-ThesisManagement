import { React,useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { MessageContext, UserContext } from '../Contexts';
import { FormControl, Select, MenuItem, Input, Container, IconButton,  Paper } from '@mui/material';

import proposalAPI from '../services/proposals.api';
import API_Degrees from '../services/degrees.api';
import API_Keywords from '../services/keywords.api';
import API_Teachers from '../services/teachers.api';

import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';


import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';


import dayjs from 'dayjs' ;
import customParseFormat from 'dayjs/plugin/customParseFormat';



function ProposalTeacher(props)
{
    const {currentDataAndTime} = props;
    const navigate= useNavigate();
    const handleMessage = useContext(MessageContext);
    dayjs.extend(customParseFormat);

    const {proposalId}= useParams(); //PROPOSAL ID
    let typeOperation= props.typeOperation;

    const { user } = useContext(UserContext);
    const [teachersList, SetTeachersList]=useState('');
    const [degreesList, SetDegreesList]=useState('');
    const [selectedSupervisor, setSelectedSupervisor] = useState(user?.id);
    const [keywordsList, SetKeywordsList]=useState(''); //prese dal DB


  
  const [title,setTitle]=useState('');
  const [description,setDescription]=useState('');
  const [required_knowledge,setRequired_knowledge]=useState('');
  const [notes,setNotes]=useState('');
  const [type,setType]=useState('');
  const [level,setLevel]=useState('');
  const [expirationDate, setExpirationDate] = useState(currentDataAndTime || dayjs());


   //DEGREE A TENDINA
   const [selectedDegree, setSelectedDegree] = useState('');
   const [selectedDegreeList, setSelectedDegreeList] = useState([]);
 
   const handleAddClickDegree = () => {
       if(selectedDegree != '')
       {
         if (selectedDegree && !selectedDegreeList.includes(selectedDegree)) 
         {
           setSelectedDegreeList([...selectedDegreeList, selectedDegree]);
           setSelectedDegree(''); // Pulisce la selezione dopo l'aggiunta
         }
       }
   };

   const handleRemoveClickDegree = (indexToRemove) => {
    const updatedDegreeList = selectedDegreeList.filter(
      (_, index) => index !== indexToRemove
    );
    setSelectedDegreeList(updatedDegreeList);
    };

  //CO SUPERVISORS A TENDINA
  const [selectedCoSup, setSelectedCoSup] = useState('');
  const [selectedCoSupList, setSelectedCoSupList] = useState([]);

  const handleAddClickCoSupervisor = () => {
      if(selectedCoSup != '')
      {
        if (selectedCoSup && !selectedCoSupList.includes(selectedCoSup)) 
        {
          setSelectedCoSupList([...selectedCoSupList, selectedCoSup]);
          setSelectedCoSup(''); // Pulisce la selezione dopo l'aggiunta
        }
      }
  };

  const handleRemoveClickCoSupervisor = (indexToRemove) => {
    const updatedCoSupList = selectedCoSupList.filter(
      (_, index) => index !== indexToRemove
    );
    setSelectedCoSupList(updatedCoSupList);
  };


  //KEWWORDS A TENDINA
  const [newKeyword, setNewKeyword] = useState('');
  
  const [selectedKeyword, setSelectedKeyword] = useState('');
  const [selectedKeywordList, setSelectedKeywordList] = useState([]);

  const handleAddClickKeyword = () => {
    if (selectedKeyword !== '') {
      if (!selectedKeywordList.includes(selectedKeyword)) {
        setSelectedKeywordList([...selectedKeywordList, selectedKeyword]);
        setSelectedKeyword(''); // Pulisce la selezione dopo l'aggiunta
      }
    } else if (newKeyword !== '') {
      // Aggiunge la nuova keyword
      setSelectedKeywordList([...selectedKeywordList, newKeyword]);
      setNewKeyword(''); // Pulisce l'input della nuova keyword dopo l'aggiunta
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
    //controllo campi name, surname e email
    let name= formExternal.name;
    let surname= formExternal.surname;
    let email=formExternal.email;
    let i;

    //name
    for (i = 0; (i < name.length); i++) 
    {
      if (!isNaN(parseInt(name[i]))) 
      {
        handleMessage("ATTENTION NAME: "+name+" CAN'T CONTAIN NUMBER ", "warning");
        return;
      }
    }

    //surname
     for (i = 0; (i < surname.length); i++) 
     {
       if (!isNaN(parseInt(surname[i]))) 
       {
          handleMessage("ATTENTION SURNAME: "+surname+" CAN'T CONTAIN NUMBER ", "warning");
          return;
       }
     }
 
    //controllo email
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]+$/; 
    if(!emailRegex.test(email))
    {
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

    useEffect(()=>{
        setSelectedDegreeList([]);
  
      },[level])

     
    useEffect(()=>{
        if((degreesList.length > 0) && ((typeOperation=="edit")||(typeOperation=="copy")))
        {
            proposalAPI.getProposalByProposalId(proposalId)
            .then((p)=>{
                    setTitle(()=>(p.title));
                    setDescription(()=>(p.description));
                    setType(()=>(p.type));
                    setExpirationDate(()=>(dayjs(p.expiration_date)));
                    setRequired_knowledge(()=>(p.required_knowledge));
                    setNotes(()=>(p.notes));
                    setLevel(()=>(p.level));
        
                    // Verifica se p.cod_degree è un array
                    let lista_codici_degree;
                    if(!(Array.isArray(p.cod_degree)))
                    {
                        lista_codici_degree=[p.cod_degree];
                    }    
                    else
                    {
                        lista_codici_degree=p.cod_degree;
                    }    
                    
                    let lista=[];
                    lista_codici_degree.forEach(codice_degree=>{
                        
                        degreesList.forEach(d=>{
                            if(codice_degree == d.cod_degree)
                            {
                                lista.push(d);
                            }
                        })   
                        
                    })
                    setSelectedDegreeList(()=>(lista));
        
                    // Rinomina il campo 'id' in 'teacher_id' 
                    p.coSupervisors.forEach(obj => { obj.teacher_id = obj.id; delete obj.id; });
                    setSelectedCoSupList(()=>(p.coSupervisors));
        
                    setSelectedKeywordList(()=>(p.keywords));
        
                    if(p.externalSupervisors != undefined)
                    {
                        setListExternals(()=>(p.externalSupervisors));
                    }
                    
            })
            .catch((err) => handleMessage(err,"warning"))
        }
        
        },[degreesList]);        



    useEffect(()=>{

        API_Degrees.getAllDegrees()
        .then((d) => {SetDegreesList(d);  }  )
        .catch((err) => handleMessage(err,"warning"))
    
        API_Teachers.getAllTeachers()
        .then((t) => SetTeachersList(t))
        .catch((err) => handleMessage(err,"warning"))
    
        API_Keywords.getAllKeywords()
        .then((k) => SetKeywordsList(k))
        .catch((err) => handleMessage(err,"warning"))
    
      },[])


  //VALIDATE INPUT FORM
  function validateInput(title, description, type, level, selectedDegreeList, 
                          selectedKeywordList, expirationDate) 
  {
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
  
  function displayErrorMessage(errors) 
  {
    if (errors.length > 0) 
    {
        const errorMessage = "ATTENTION: " + errors.join(", ") + " EMPTY";
        handleMessage(errorMessage, "warning");
        return true; // Input is not correct
    }
    return false; // Input is correct
  }



  //HANDLER SUBMIT
  function handleSubmit(event) 
  {
    event.preventDefault();

    let array_only_cod_degree= selectedDegreeList.map(d=>d.cod_degree);
    let array_only_id_co_supervisors= selectedCoSupList.map(co=>co.teacher_id);

    let inputErrors =
      validateInput(title,description,type,level, array_only_cod_degree, selectedKeywordList, expirationDate);

      
    if(displayErrorMessage(inputErrors)) 
    {
      return;
    }

    
    ////////SE INPUT CORRETTO //////////////////////////////////

    let formatted_expiration = expirationDate.format("YYYY-MM-DD");
    let cod_group= user.cod_group;
    let supervisors_obj={"supervisor_id":  selectedSupervisor, 
      "co_supervisors":  array_only_id_co_supervisors, "external": listExternals};

    //MESSAGGIO DI SICUREZZA
                      
    let acceptMessage={"add": 'Are you sure to create this new thesis ?',
                      "edit": 'Are you sure to edit this thesis ?',
                      "copy": 'Are you sure to create this new thesis ?'
                      } 

    const accept = confirm(acceptMessage[typeOperation]);
    if (!accept) {
      return;
    }  
      

    //ADD PROPOSAL  
    if(typeOperation=="add")
    {
      proposalAPI.postProposal(title,type,description,level, formatted_expiration,notes,
          required_knowledge, array_only_cod_degree,cod_group,supervisors_obj,selectedKeywordList)
          .then(navigate("/teacher"))
          .catch((err) => handleMessage(err,"warning"));
      
    }

    //UPDATE PROPOSAL  
    if(typeOperation=="edit")
    {

      proposalAPI.updateProposal(proposalId,title,type,description,level,
          formatted_expiration,notes, required_knowledge, array_only_cod_degree, cod_group,
          supervisors_obj, selectedKeywordList)
          .then(() => {navigate("/teacher")})
          .catch((err) => handleMessage(err,"warning"))  
    }

    //COPY PROPOSAL
    if(typeOperation=="copy")
    {
      proposalAPI.postProposal(title,type,description,level, formatted_expiration,notes,
          required_knowledge, array_only_cod_degree,cod_group,supervisors_obj,selectedKeywordList)
          .then(navigate("/teacher"))
          .catch((err) => handleMessage(err,"warning"));
    }
   
}   
       

  //INVIO FORM ///////////////////////////////////////////////////////////////////////////////////
  
  return (
    <Container>
      
    <br /> <br /><br /><br /> <br /> <br />


    {typeOperation === "add" ? (
    <> <Typography variant="h5" align="center">  INSERT A NEW THESIS PROPOSAL <br /> </Typography> <br /> </> ) : (<></>)}

    {typeOperation === "edit" ? (
    <>   <Typography variant="h5" align="center"> EDIT PROPOSAL OF THESIS: <br /> { title } </Typography> <br /> </> ) : (<></>)}

    {typeOperation === "copy" ? (
    <>   <Typography variant="h5" align="center"> COPY PROPOSAL OF THESIS: <br /> { title } </Typography> <br /> </> ) : (<></>)}

       <Typography variant="h6"> TEACHER: {user.name} {user.surname}  (d{user.id}) </Typography> <br />
       <Typography variant="h7"> GROUP NAME    : {user?.group_name}   </Typography> <br />
       <Typography variant="h7"> COD DEPARTMENT: {user?.cod_department}         </Typography>

    <br /> <br />

    <form onSubmit={handleSubmit}>
             
        <Typography variant="subtitle1" fontWeight="bold">   TITLE </Typography>
          <TextField  name="title" variant="filled" fullWidth
          value={title}  onChange={ev=>setTitle(ev.target.value)}/>  <br /> <br /> 

        <Typography variant="subtitle2" fontWeight="bold"> DESCRIPTION </Typography>
        <TextField  name="description" variant="outlined"  fullWidth  multiline
           rows={7} value={description}  onChange={ev=>setDescription(ev.target.value)}   />  <br />  <br /> 

          <Grid container spacing={2}> 
              <Grid item xs={4}>
                <FormControl fullWidth>  
                <Typography variant="subtitle1" fontWeight="bold">  SUPERVISORD ID  </Typography>
                  <TextField name="supervisor" variant="outlined" fullWidth
                  value={selectedSupervisor}  onChange={ev=>setSelectedSupervisor(ev.target.value)} disabled /> 
                </FormControl> 
              </Grid>

              <Grid item xs={4}>
                  <Typography variant="subtitle1" fontWeight="bold"> TYPE </Typography>     
                  <TextField  name="type" variant="outlined"  fullWidth
                  value={type}  onChange={ev=>setType(ev.target.value)}/>  <br /> <br />
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
             
            </Grid> <br/>    

            <Grid container spacing={2}> 
            <Grid item xs={12}>
                  <FormControl fullWidth>
                  <Typography variant="subtitle1" fontWeight="bold">  SELECT A DEGREE LEVEL  </Typography>
                    < Select
                      labelId="word-label"
                      id="level-select"
                      value={level}
                      onChange={(ev) => { setLevel(ev.target.value) }}
                    >
                      {
                        Array.from(['MSc', 'BSc']).map((el, index) =>
                        (el === 'MSc' ? <MenuItem key={index} value={'MSc'}> Master of Science </MenuItem> 
                                      : <MenuItem key={index} value={'BSc'}> Bachelor of Science </MenuItem>))
                      }
                    </Select>
                  </FormControl> 
            </Grid>
          </Grid>   <br/> <br/>

          <Grid item xs={4}>
          <Paper elevation={3} style={{ padding: '16px' }}>
            <FormControl fullWidth>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                ADD DEGREE  {level=='MSc'? "MASTER" : "BACHELOR" }
              </Typography>
              <Select
                labelId="degree-label"
                id="degree-select"
                value={selectedDegree}
                onChange={(event) => setSelectedDegree(event.target.value)}
                input={<Input id="select-multiple" />}
              >
                {Array.from(degreesList).filter(d=>d.level_degree == level).map((degree, index) => (
                  <MenuItem key={index} value={degree}>
                    {degree.title_degree}
                  </MenuItem>
                ))}
              </Select>

              <Button
                variant="contained"
                color="primary"
                onClick={handleAddClickDegree}
                style={{ marginTop: '16px' }}
              >
                ADD
              </Button>

              {/* Visualizza i co-supervisori selezionati */}
              {selectedDegreeList.length!=0 && <Typography variant="h6" style={{ marginTop: '16px' }}>
                Added degrees
              </Typography>}
              {selectedDegreeList.map((degree, index) => (
                <Paper key={index} elevation={1} style={{ padding: '8px', marginTop: '8px' }}>
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
          </Paper>
        </Grid> <br/> <br/>


          <Typography variant="subtitle5" fontWeight="bold"> REQUIRED KNOWLEDGE </Typography>
          <TextField  name="required_knowledge" variant="filled" fullWidth multiline  rows={7}
          value={required_knowledge}  onChange={ev=>setRequired_knowledge(ev.target.value)}/>  <br /> <br />
       
      <br />  <br /> 

      <Grid item xs={4}>
      <Paper elevation={3} style={{ padding: '16px' }}>
        <FormControl fullWidth>
          <Typography variant="h6" gutterBottom fontWeight="bold">
            ADD CO-SUPERVISORS
          </Typography>
          <Select
            labelId="cosup-label"
            id="cosup-select"
            value={selectedCoSup}
            onChange={(event) => setSelectedCoSup(event.target.value)}
            input={<Input id="select-multiple" />}
          >
            {Array.from(teachersList).filter(t => t.teacher_id != user.id).map((teacher, index) => (
              <MenuItem key={index} value={teacher}>
                {teacher.name} {teacher.surname} - {teacher.teacher_id}
              </MenuItem>
            ))}
          </Select>

          <Button
            variant="contained"
            color="primary"
            onClick={handleAddClickCoSupervisor}
            style={{ marginTop: '16px' }}
          >
            ADD
          </Button>

          {/* Visualizza i co-supervisori selezionati */}
          {selectedCoSupList.length != 0 && <Typography variant="h6" style={{ marginTop: '16px' }}>
            Selected Co-Supervisors
          </Typography>}
          {selectedCoSupList.map((coSupervisor, index) => (
            <Paper key={index} elevation={1} style={{ padding: '8px', marginTop: '8px' }}>
              <Grid container alignItems="center">
                <Grid item xs={10}>
                  <Typography variant="body1">{coSupervisor.name} {coSupervisor.surname} - {coSupervisor.teacher_id}</Typography>
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
    </Grid> <br/> <br/>


    <Grid item xs={4}>
      <Paper elevation={3} style={{ padding: '16px' }}>
        <FormControl fullWidth>
          <Typography variant="h6" gutterBottom fontWeight="bold">
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
            <MenuItem key={index} value={k.name}>
              {k.name}
            </MenuItem>
          ))}
          </Select>

          {/* Input per una nuova keyword */}
          <TextField
            label="New Keyword"
            variant="outlined"
            fullWidth
            value={newKeyword}
            onChange={(event) => setNewKeyword(event.target.value)}
            style={{ marginTop: '16px' }}
          />

          {/* Pulsante per aggiungere la nuova keyword o selezionare quella esistente */}
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddClickKeyword}
            style={{ marginTop: '16px' }}
          >
            ADD
          </Button>

          {/* Visualizza i co-supervisori selezionati */}
          {selectedKeywordList.length!=0 && <Typography variant="h6" style={{ marginTop: '16px' }}>
            Added keywords
          </Typography>}
          {selectedKeywordList.map((keyword, index) => (
            <Paper key={index} elevation={1} style={{ padding: '8px', marginTop: '8px' }}>
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
    </Grid>   <br/> <br/>

    {/* EXTERNALS */}
    <Grid item xs={4}>
      <Paper elevation={3} style={{ padding: '16px' }}>
        <Typography variant="h6" gutterBottom fontWeight="bold">
          ADD EXTERNAL CO-SUPERVISORS
        </Typography>

        {/* Input for a new external entry */}
        <TextField
          label="Name"
          variant="outlined"
          fullWidth
          value={formExternal.name}
          onChange={handleInputChangeExternal('name')}
          style={{ marginTop: '16px' }}
        />
        <TextField
          label="Surname"
          variant="outlined"
          fullWidth
          value={formExternal.surname}
          onChange={handleInputChangeExternal('surname')}
          style={{ marginTop: '16px' }}
        />
        <TextField
          label="Email"
          variant="outlined"
          fullWidth
          value={formExternal.email}
          onChange={handleInputChangeExternal('email')}
          style={{ marginTop: '16px' }}
        />

        {/* Button to add the new external entry */}
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddExternal}
          style={{ marginTop: '16px' }}
          disabled={!formExternal.name || !formExternal.surname || !formExternal.email}
        >
          ADD EXTERNAL
        </Button>

        {/* Display selected external entries */}
        {listExternals.length != 0 && <Typography variant="h6" style={{ marginTop: '16px' }}>
          Selected Externals
        </Typography>}
        {listExternals.map((external, index) => (
        <Paper key={index} elevation={1} style={{ padding: '8px', marginTop: '8px' }}>
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
    </Grid> <br/> <br/>

     {/* NOTES */}      

    <Typography variant="subtitle5" fontWeight="bold"> NOTES </Typography>
           <TextField  name="notes" variant="filled" fullWidth  multiline  rows={5}
           value={notes}  onChange={ev=>setNotes(ev.target.value)}/>  <br /> <br />
 

    <br />

        { typeOperation=="add"?
        <Button variant="contained" color="primary" type="submit" onClick={()=>{ 
            handleMessage("Added Proposal","success")}}> ADD PROPOSAL </Button>  : <></> }

        { typeOperation=="edit"?    
           <Button variant="contained" color="primary" type="submit" onClick={()=>{
            handleMessage("Update Proposal","success")}}> UPDATE PROPOSAL </Button> : <></> }
            
        { typeOperation=="copy"?    
           <Button variant="contained" color="primary" type="submit" onClick={()=>{ 
            handleMessage("Copy Proposal","success")}}> ADD PROPOSAL </Button> : <></> }

        {' '} <Button variant="contained" color="error" onClick={()=>{navigate('/teacher');handleMessage("Undone insert proposal","success");} }> CANCEL </Button>
      
      </form>
   
      </Container>

  );

}

export default ProposalTeacher;