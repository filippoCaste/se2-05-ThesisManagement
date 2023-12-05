import React, { useContext, useState } from 'react';
import { UserContext } from '../Contexts';
import { useNavigate } from 'react-router-dom';
import { Alert, Button, Grid, IconButton, TextField, Tooltip, Typography } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';

function ProposalStudent() {
	const navigate = useNavigate();
	const { user } = useContext(UserContext);
	const [errorMsg, setErrorMsg] = useState('');
	const [infoMsg, setInfoMsg] = useState('');

	const handleSubmit = (proposalObj) => {
		console.log(proposalObj)
		const { title, type, description, notes, teacherEmail } = proposalObj;
		if (title == '' || type == '' || description == '' || teacherEmail == '') {
			// the form is not completely filled
			setErrorMsg("Please fill all mandatory fields");
		} else {
			// call the api

			// display info
			setInfoMsg("The request has been correctly sent.\nYou are being redirected to the theses proposals page.");
			// set timeout
			setTimeout(() => {
				navigate('/student');
			}, 3000);
			// navigate back
		}
	}

	const handleCancel = () => {
		setInfoMsg("Cancel request.\nYou are being redirected to the theses proposals page.");
		setTimeout(() => {
			navigate('/student');
		}, 3000);	
	}

	return (
		<>
			<br /> <br /> <br /> <br /> <br />
			<Grid container>
				<Grid item xs={12} sx={{ mt: '2vh', mx: '4vh' }}>

					<h1 align='center'>Request thesis work</h1>
					{infoMsg && <Alert variant='outlined' color='info' onClose={() => setInfoMsg('')}>
						{infoMsg}
					</Alert>}

					{errorMsg && <Alert variant='filled' color='error' onClose={() => setErrorMsg('')}>
						{errorMsg}
					</Alert>}

					<InsertNewProposalStudent user={user} handleSubmit={handleSubmit} handleCancel={handleCancel} />
				</Grid>
				<br/>
			</Grid>
		</>
	);
}

function InsertNewProposalStudent(props) {
	const { user, handleSubmit, handleCancel } = props;

	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
	const [notes, setNotes] = useState('');
	const [type, setType] = useState('');
	const [teacherEmail, setTeacherEmail] = useState('');

	return (
			<form>
				<Grid container spacing={3}>
					<Grid item xs={12} md={6}>
						<Typography display='inline' variant="subtitle1" fontWeight="bold"> TITLE </Typography>
					<Tooltip title={
									<React.Fragment>
										<Typography color="inherit">The title should emphasize the topic of the thesis work and the technologies used.</Typography>
									</React.Fragment>
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
							<React.Fragment>
								<Typography color="inherit">The type refers on the type of activity you will perform, such as <em>Research</em>, <em>Internship</em>, <em>Laboratory</em>, ...</Typography>
							</React.Fragment>
						}>
							<IconButton>
								<InfoIcon fontSize='small' />
							</IconButton>
						</Tooltip>

						<TextField name="type" variant="filled" fullWidth placeholder='ex: Research'
							value={type} onChange={ev => setType(ev.target.value)} />
					</Grid>
				</Grid> <br /> <br />

			<Typography display='inline' variant="subtitle1" fontWeight="bold"> DESCRIPTION </Typography> 
				<Tooltip title={
					<React.Fragment>
						<Typography color="inherit">Insert a description of the thesis work in general and try to specify which will be your contribution.</Typography>
					</React.Fragment>
				}>

				<IconButton>
					<InfoIcon fontSize='small' />
				</IconButton>
			</Tooltip>
				<TextField name="description" variant="outlined" fullWidth multiline placeholder='Add a description of the thesis'
					rows={7} value={description} onChange={ev => setDescription(ev.target.value)} />  <br />  <br />

				<Typography display='inline' variant="subtitle5" fontWeight="bold"> NOTES </Typography>
				<Tooltip title={
					<React.Fragment>
						<Typography color="inherit">Add any additional notes that can be useful to evaluate you request.</Typography>
					</React.Fragment>
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
					<TextField name="teacherEmail" variant="filled" fullWidth placeholder='ex: d99999@polito.it'
						value={teacherEmail} onChange={ev => setTeacherEmail(ev.target.value)} />  <br /> <br />
					</Grid>

					<Grid item xs={12} md={6}>
					{/* STUDENT CONTACTS */}
					<Typography variant="subtitle5" fontWeight="bold"> YOUR CONTACT </Typography>
					<TextField name="studentEmail" variant="filled" fullWidth disabled
						value={user?.email} />
					</Grid>
				</Grid>
				
				<br /><br />
				<Button
					variant='contained'
					color='primary'
					onClick={() => handleSubmit({ title, type, description, notes, teacherEmail })}
				>
					SUBMIT / SEND REQUEST
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
