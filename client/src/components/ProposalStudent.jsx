import React, { useContext, useState } from 'react';
import { MessageContext, UserContext } from '../Contexts';
import { useLocation, useNavigate } from 'react-router-dom';
import { Alert, Button, Grid, IconButton, TextField, Tooltip, Typography } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import ConfirmationDialog from './ConfirmationDialog';
import studentRequestAPI from '../services/studentRequest.api';

function ProposalStudent() {
	const navigate = useNavigate();
	const location = useLocation();
	const { user } = useContext(UserContext);
	const [errorMsg, setErrorMsg] = useState(null);
	const [infoMsg, setInfoMsg] = useState(null);
	const [confirmation, setConfirmation] = useState(false);
// why is it a problem if location.state is null?
	const [title, setTitle] = useState(location.state ? location.state.title : '');
	const [description, setDescription] = useState(location.state ? location.state.description : '');
	const [notes, setNotes] = useState(location.state ? location.state.notes : '');
	const [type, setType] = useState(location.state ? location.state.type : '');
	const [teacherEmail, setTeacherEmail] = useState(location.state ? location.state.teacherEmail : '' );
	const [coSupervisor, setCoSupervisor] = useState('');
	const [coSupervisors, setCoSupervisors] = useState(location.state ? location.state.coSupervisors : []);
	const isFilled = location.state ? true : false;

	const handleMessage = useContext(MessageContext);

	const handleCancel = () => {
		navigate('/student');
	}

	const handleOpenDialog = () => {
		if (title == '' || type == '' || description == '' || teacherEmail == '') {
			// the form is not completely filled
			setErrorMsg(<><p>Please fill all mandatory fields:</p> <ul>
							{title === '' ? <li>Title</li> : null}
							{type === '' ? <li>Type</li>: null}
							{description === '' ? <li>Description</li>: null}
							{teacherEmail === '' ? <li>Teacher contact</li> : null}
							</ul></>);
		} else {
			setConfirmation(true);
		}
	}
	const handleCloseDialog = () => {
		setConfirmation(false);
	}

	const handleConfirmation =  async (result) => {
		if (result) {
			// User clicked "Confirm"
			// call the api
			const requestProposal = {
				title, type, description, notes, teacherEmail, coSupervisorEmails: coSupervisors
			}
			try {
				await studentRequestAPI.postStudentRequest(requestProposal);
			} catch(err) {
				console.log(err)
				setErrorMsg("Emails are not correct.");
				return;
			}
			// display info
			handleMessage("Thesis request sent successfully", "success");
			navigate('/student');
			// navigate back
		} else {
			setConfirmation(false);
		}
	}

	return (
			<Grid container mt="10%">
				<Grid item xs={12} sx={{ mt: '2vh', mx: '4vh' }}>

					<h1>Request thesis work</h1>

					{confirmation && <ConfirmationDialog operation={"Send"} message={"Are you sure you want to send this thesis request?"} 
					open={confirmation}
        			onClose={handleCloseDialog}
        			onConfirm={handleConfirmation}
      				/> }

					<InsertNewProposalStudent user={user} handleOpenDialog={handleOpenDialog} handleCancel={handleCancel} 
						title={title} description={description} type={type} notes={notes} teacherEmail={teacherEmail} coSupervisor={coSupervisor} coSupervisors={coSupervisors}
						setTitle={setTitle} setDescription={setDescription} setType={setType} setNotes={setNotes} setTeacherEmail={setTeacherEmail} setCoSupervisor={setCoSupervisor} setCoSupervisors={setCoSupervisors}
						errorMsg={errorMsg} setErrorMsg={setErrorMsg}
						isFilled={isFilled}
					/> <br/>
					
					{infoMsg && <Alert severity='info' variant='outlined' color='info' onClose={() => setInfoMsg(null)}>
						{infoMsg}
					</Alert>}

				</Grid>
				<br/>
			</Grid>
	);
}

function InsertNewProposalStudent(props) {
	const { user, handleOpenDialog, handleCancel } = props;
	const { title, description, notes, type, teacherEmail, coSupervisor, coSupervisors, errorMsg, isFilled } = props;
	const { setTitle, setDescription, setNotes, setType, setTeacherEmail, setCoSupervisor, setCoSupervisors, setErrorMsg } = props;

	const [warning, setWarning] = useState(false);

	function addCoSupervisorEmail(email) {
		// check that it is an email
		const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
		const regex = new RegExp(pattern);
		if(!regex.test(email)) {
			setWarning(true);	
			return;	
		}
		if (!coSupervisors.includes(email)) {
			setCoSupervisors([...coSupervisors, email]);
			setCoSupervisor('');
			setWarning(false);
		}
	}

	function handleRemoveCoSupEmail(index) {
		// removes one element starting from the index position
		let newCoSupervisors = [...coSupervisors];
		newCoSupervisors.splice(index, 1);
		setCoSupervisors([...newCoSupervisors]);
	}

	return (
			<form>
				<Grid container spacing={3}>
					<Grid item xs={12} md={6}>
						<Typography display='inline' variant="subtitle1" fontWeight="bold"> TITLE </Typography>
					<Tooltip title={
										<Typography color="inherit">The title should emphasize the topic of the thesis work and the technologies used.</Typography>
								}>
							<IconButton>
								<InfoIcon fontSize='small'/>
							</IconButton>
						</Tooltip>
						<TextField name="title" variant="filled" fullWidth placeholder='Title'
							value={title} onChange={ev => setTitle(ev.target.value)} />
					</Grid>

					<Grid item xs={12} md={6}>
						<Typography display='inline' variant="subtitle1" fontWeight="bold"> TYPE </Typography>
						<Tooltip title={
								<Typography color="inherit">The type refers on the type of activity you will perform, such as <em>Research</em>, <em>Internship</em>, <em>Laboratory</em>, ...</Typography>
						}>
							<IconButton>
								<InfoIcon fontSize='small' />
							</IconButton>
						</Tooltip>

						<TextField name="type" variant="filled" fullWidth placeholder='ex: Research'
							disabled={isFilled} value={type} onChange={ev => setType(ev.target.value)} />
					</Grid>
				</Grid> <br /> <br />

			<Typography display='inline' variant="subtitle1" fontWeight="bold"> DESCRIPTION </Typography> 
				<Tooltip title={
						<Typography color="inherit">Insert a description of the thesis work in general and try to specify which will be your contribution.</Typography>
				}>

				<IconButton>
					<InfoIcon fontSize='small' />
				</IconButton>
			</Tooltip>
				<TextField name="description" variant="outlined" fullWidth multiline placeholder='Add a description of the thesis'
					rows={7} value={description} onChange={ev => setDescription(ev.target.value)} />  <br />  <br />

				<Typography display='inline' variant="subtitle5" fontWeight="bold"> NOTES </Typography>
				<Tooltip title={
						<Typography color="inherit">Add any additional notes that can be useful to evaluate you request.</Typography>
				}>

					<IconButton>
					<InfoIcon fontSize='small' />
					</IconButton>
				</Tooltip>
				<TextField name="notes" variant="filled" fullWidth multiline rows={5} placeholder='Additional notes'
					value={notes} onChange={ev => setNotes(ev.target.value)} />  <br /> <br />

				<Grid container spacing={3}>
					<Grid item xs={12} md={6}>
					{/* PROFESSOR CONTACT */}
					<Typography variant="subtitle5" fontWeight="bold"> TEACHER CONTACT </Typography>
					<TextField type='email' disabled={isFilled} name="teacherEmail" variant="filled" fullWidth placeholder='ex: john.doe@polito.it'
						value={teacherEmail} onChange={ev => setTeacherEmail(ev.target.value)} />  
					</Grid>

					<Grid item xs={12} md={6}>
					{/* STUDENT CONTACTS */}
					<Typography variant="subtitle5" fontWeight="bold"> YOUR CONTACT </Typography>
					<TextField name="studentEmail" variant="filled" fullWidth disabled
						value={user?.email} />
					</Grid>
					<br/>
				</Grid>
			<br />
				<Grid container spacing={3}>
					<Grid item xs={12} md={6}>
						{/* CO-SUPERVISOR CONTACTS */}
						<Typography variant="subtitle5" fontWeight="bold"> CO-SUPERVISOR CONTACTS </Typography> <br />
						<TextField type='email' fullWidth name="coSupervisorEmail" variant="filled" placeholder='ex: john.doe@polito.it'
							value={coSupervisor} onChange={ev => setCoSupervisor(ev.target.value)}
							InputProps={{
								endAdornment: (
									<IconButton
										color="primary"
										aria-label="add"
										onClick={() => addCoSupervisorEmail(coSupervisor)}
									>
										<AddCircleIcon />
									</IconButton>
								),
							}}
						/>
						{warning && <Alert severity='warning' onClose={() => setWarning(false)}>The contact must be a valid email</Alert>}
					</Grid>

					{coSupervisors.length !== 0 && (
						<>
						<Grid item xs={12}>
							<Typography variant='h6'>Requested Co-Supervisors</Typography>
						</Grid>

							{coSupervisors.map((coSupEmail, index) => (
								<>
									<Grid item xs={10} md={5}>
										<Typography variant="body1">{coSupEmail} </Typography>
									</Grid>
									<Grid item xs={2} md={1}>
										<IconButton
											color="primary"
											aria-label="delete"
											key={index}
											onClick={() => handleRemoveCoSupEmail(index)}
										>
											<DeleteIcon />
										</IconButton>
									</Grid>
								</>
							))}
						</>
					)}
				</Grid>
			<br /> <br />

				{errorMsg && <Alert severity='error' variant='filled' onClose={() => setErrorMsg(null)}>
					{errorMsg}
				</Alert>}

				<br />
				<Button
					variant='contained'
					color='primary'
				onClick={() => handleOpenDialog()}
				>
					SEND REQUEST
				</Button>
				{' '}
				<Button
					variant='contained'
					color='secondary'
					onClick={() => handleCancel()}
				>
					CANCEL
				</Button>

			</form>
	);
}

export default ProposalStudent;
