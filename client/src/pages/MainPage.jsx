import { useEffect, useState, useContext } from 'react';
import ResponsiveDrawer from '../components/ResponsiveDrawer.jsx';
import Box from '@mui/material/Box';
import MainDashboard from '../components/MainDashboard.jsx';
import { UserContext } from '../Contexts';
import proposalAPI from '../services/proposals.api.js';
import dayjs from 'dayjs';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';

function MainPage(props) {
  const navigate = useNavigate();
  const { openSelectionsMobile, currentDataAndTime } = props;
  const { user } = useContext(UserContext);
  const drawerWidth = "30vw";
  const [selectedLevels, setSelectedLevels] = useState([]);
  const [selectedExpirationDate, setSelectedExpirationDate] = useState(null);
  const [selectedStartExpirationDate, setSelectedStartExpirationDate] = useState(currentDataAndTime);
  const [selectedKeywords, setSelectedKeywords] = useState([]);
  const [selectedSupervisorId, setSelectedSupervisorId] = useState(null);
  const [filteredProposals, setFilteredProposals] = useState([]);
  const [proposals, setProposals] = useState([]);
  const [title, setTitle] = useState('');

  useEffect(() => {
    const resultProposals = async () => {
      try {
        const startDate = selectedStartExpirationDate
          ? dayjs(selectedStartExpirationDate).format('YYYY-MM-DD')
          : dayjs(currentDataAndTime).format('YYYY-MM-DD');
        const endDate = selectedExpirationDate
          ? dayjs(selectedExpirationDate).format('YYYY-MM-DD')
          : null;
        const resultsResponse = await proposalAPI.getProposals(
          user?.cod_degree,
          selectedLevels,
          selectedKeywords,
          selectedSupervisorId,
          startDate,
          endDate
        );

        if (resultsResponse) {
          setFilteredProposals(resultsResponse);
          setProposals(resultsResponse);
        }
      } catch (error) {
        setFilteredProposals([]);
      }
    };
    resultProposals().catch(console.error);
  }, [
    user,
    selectedLevels,
    selectedKeywords,
    selectedSupervisorId,
    selectedStartExpirationDate,
    selectedExpirationDate,
    currentDataAndTime,
  ]);

  useEffect(() => {
    const temp = proposals.filter((o) =>
      Object.keys(o).some((k) =>
        o['title'].toLowerCase().includes(title.toLowerCase())
      )
    );
    setFilteredProposals(temp);
  }, [title]);

  useEffect(() => {
    setSelectedStartExpirationDate(currentDataAndTime);
  }, [currentDataAndTime]);

  return (
    <Box sx={{ display: 'inline-flex'}} mt={'15vh'} mx={'3vh'}>
      <ResponsiveDrawer
        openSelectionsMobile={openSelectionsMobile}
        setSelectedLevels={setSelectedLevels}
        selectedExpirationDate={selectedExpirationDate}
        setSelectedExpirationDate={setSelectedExpirationDate}
        setSelectedKeywords={setSelectedKeywords}
        selectedKeywords={selectedKeywords}
        setSelectedSupervisorId={setSelectedSupervisorId}
        selectedSupervisorId={selectedSupervisorId}
        selectedLevels={selectedLevels}
        currentDataAndTime={currentDataAndTime}
        selectedStartExpirationDate={selectedStartExpirationDate}
        setSelectedStartExpirationDate={setSelectedStartExpirationDate}
        title={title}
        setTitle={setTitle}
        drawerWidth={drawerWidth}
      />
      <Box>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/student/applications')}
          sx={{mb: '2vh'}}
        >
          Browse Applied Proposals
        </Button>
        <br />
        <MainDashboard
          proposals={filteredProposals}
          openSelectionsMobile={openSelectionsMobile}
          drawerWidth={drawerWidth}
        />
      </Box>
    </Box>
  );
}

export default MainPage;
