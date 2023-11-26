import { useEffect, useState } from 'react';
import MainDashboard from '../components/MainDashboard.jsx';
import Box from '@mui/material/Box';
import applicationsAPI from '../services/applications.api.js';

function StudentApplications(props) {
  const [appliedProposals, setAppliedProposals] = useState([]);

  useEffect(() => {
    const retriveStudentApplications = async () => {
      const applications = await applicationsAPI.getStudentApplications();
      setAppliedProposals(applications);
    };

    retriveStudentApplications();
  }, []);
  return (
    <>
      <Box sx={{ display: 'inline-flex' }} mt={'15vh'} mx={'6vh'}>
        <MainDashboard proposals={appliedProposals} isAppliedProposals={true} />
      </Box>
    </>
  );
}

export default StudentApplications;
