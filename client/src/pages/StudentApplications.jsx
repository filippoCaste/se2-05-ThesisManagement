import { useEffect, useState } from 'react';
import MainDashboard from '../components/MainDashboard.jsx';
import Box from '@mui/material/Box';
import applicationsAPI from '../services/applications.api.js';
import { Button, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

function StudentApplications(props) {
  const [appliedProposals, setAppliedProposals] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const retriveStudentApplications = async () => {
      const applications = await applicationsAPI.getStudentApplications();
      setAppliedProposals(applications);
    };

    retriveStudentApplications();
  }, []);
  return (
    <>
      <Grid container>
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-start', mt: '15vh', mx: '6vh' }}>
            <Button onClick={() => navigate('/student')} variant="contained" startIcon={<ArrowBackIcon />}>
              Go Back
            </Button>
          </Box>
        </Grid>
      </Grid>

      <Grid container>
        <Grid item xs={12} sx={{ mt: '2vh', mx: '4vh' }}>
          <MainDashboard proposals={appliedProposals} isAppliedProposals={true} />
        </Grid>
      </Grid>
    </>

  );
}

export default StudentApplications;
