
import { Grid, Button } from '@mui/material';
import { useEffect, useState, useContext } from 'react';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import AccountCircle from '@mui/icons-material/AccountCircle';
import StickyHeadTable from '../components/GenericTable';
import dayjs from 'dayjs';
import ApplicationDialog from '../components/ApplicationDialog';
import careerAPI from '../services/career.api';
import proposalAPI from '../services/proposals.api';
import AlertDialog from '../components/AlertDialog';
import { MessageContext } from '../Contexts';

function SecretaryPage(props) {

    const [proposalRequests,setProposalRequests] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState();
    const [selectedProposalRequest, setSelectedProposalRequest] = useState();
    const [openDialog, setOpenDialog] = useState(false);
    const [studentExams, setStudentExams] = useState([]);
    const handleMessage = useContext(MessageContext);

    const handleStudentClick = (student) => {
      setSelectedStudent(student);
      careerAPI.getCareerByStudentId(student.student_id).then((res) => {
        setStudentExams(res);
      });
      setOpenDialog(true);
    };

    const handleProposalRequestClick = (proposalRequest) => {
      setSelectedProposalRequest(proposalRequest);
      setOpenDialog(true);
    }

    const changeStatusOfProposalRequest = (proposalRequestId,status) => {
  
      proposalAPI.changeStatusProposalRequest(proposalRequestId,status).then(async () => {
        handleMessage("Proposal Request successfully updated","success");
        const updatedRequests = await proposalAPI.getProposalRequests();
        setProposalRequests(updatedRequests); // Update the proposalRequests state
      }
        ).catch(handleMessage("Proposal Request update error","warning"));

    }

    useEffect(() => {
        const resultProposals = async () => {
          try {
           const resultRequests = await proposalAPI.getProposalRequests();
           setProposalRequests(resultRequests);

        } catch (error){

          console.log(error);
        }}
        resultProposals();
      }, []);

      const columns = [
        { id: 'title', label: 'Title', minWidth: 450, maxWidth: 450 },
        { id: 'student_id', label: 'Student', minWidth: 200, maxWidth: 200 },
        {
          id: 'expiration_date',
          label: 'Expiration Date',
          minWidth: 200,
          maxWidth: 200,
          format: (value) => dayjs(value).format('DD/MM/YYYY'),
        },
        { id: 'type', label: 'Type', minWidth: 200, maxWidth: 200 },
        {
          id: 'buttonProposalDetails',
          label: 'Proposal Request details',
          minWidth: 200,
          maxWidth: 200,
          format: (value, row) => (
            <Button
              variant="outlined"
              startIcon={<DescriptionOutlinedIcon />}
              style={{
                fontSize: '12px',
                textTransform: 'none',
                color: '#2196f3',
                borderRadius: '4px',
                border: '1px solid #2196f3',
                transition: 'background-color 0.3s',
                '&:hover': {
                  backgroundColor: '#2196f3',
                  color: 'white',
                },
              }}
              onClick={() => handleProposalRequestClick(row)}
            >
              Proposal Request
            </Button>
          ),
        },
        {
            id: 'buttonStudentDetails',
            label: 'Student details',
            minWidth: 200,
            maxWidth: 200,
            format: (value, row) => (
              <Button
                variant="outlined"
                startIcon={<AccountCircle />}
                style={{
                  fontSize: '12px',
                  textTransform: 'none',
                  color: '#2196f3',
                  borderRadius: '4px',
                  border: '1px solid #2196f3',
                  transition: 'background-color 0.3s',
                  '&:hover': {
                    backgroundColor: '#2196f3',
                    color: 'white',
                  },
                }}
                onClick={() => handleStudentClick(row.studentInfo)}
              >
                Student
              </Button>
            ),
          },
        {
            id: 'acceptProposalRequest',

            minWidth: 200,
            maxWidth: 200,
            format: (value, row) => (
              <Button
              variant="outlined"
              onClick={() => changeStatusOfProposalRequest(row.id, 'approved')}
              style={{
                fontSize: '12px',
                textTransform: 'none',
                color: 'white',
                borderRadius: '4px',
                border: '1px solid #35682D',
                backgroundColor: '#35682D',
              }}
            >
              Approve
            </Button>
            ),
          },
          {
            id: 'rejectProposalRequest',

            minWidth: 200,
            maxWidth: 200,
            format: (value, row) => (
              <Button
              variant="outlined"
              onClick={() => changeStatusOfProposalRequest(row.id, 'rejected')}
              style={{
                fontSize: '12px',
                textTransform: 'none',
                color: 'white',
                borderRadius: '4px',
                border: '1px solid #D32F2F',
                backgroundColor: '#D32F2F',
              }}
            >
              Reject
            </Button>
            ),
          },
      ];     

 return (
    <Grid container mt="10%">
        <StickyHeadTable rows={proposalRequests} columns={columns} noDataMessage={'No proposals request'} pagination={true}/>
        {openDialog && selectedStudent &&(
            <ApplicationDialog
              open={openDialog}
              handleClose={() => {
                setOpenDialog(false);
                setSelectedStudent();
              }}
              item={selectedStudent}
              studentExams={studentExams}
              isSecretary={true}
            />
          )}
          {openDialog && selectedProposalRequest &&(
            <AlertDialog
              open={openDialog}
              handleClose={() => {setOpenDialog(false);setSelectedProposalRequest();}}
              item={selectedProposalRequest}
              handleApply={() => {}}
              loading={false}
              isAppliedProposals={true}
              isSecretary={true}
            />
          )}

    
    </Grid>
 );   
}

export default SecretaryPage;

