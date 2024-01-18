import React, { useEffect, useState, useContext} from 'react';
import StickyHeadTable from './GenericTable';
import { UserContext, MessageContext } from '../Contexts';
import { Grid, Button, IconButton, Typography, Dialog, DialogTitle, DialogActions, DialogContentText, DialogContent, Chip, useMediaQuery, Tooltip } from '@mui/material';
import proposalAPI from '../services/proposals.api';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import AccountCircle from '@mui/icons-material/AccountCircle';
import ApplicationDialog from './ApplicationDialog';
import careerAPI from '../services/career.api';
import AlertDialog from './AlertDialog';
import DoneIcon from '@mui/icons-material/Done';
import CloseIcon from '@mui/icons-material/Close';
import BuildIcon from '@mui/icons-material/Build';
import { useTheme } from "@mui/material/styles";

export default function ProposalRequests() {
    const navigate = useNavigate();
    const { user } = useContext(UserContext);
    const [proposalRequests,setProposalRequests] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState();
    const [selectedProposalRequest, setSelectedProposalRequest] = useState();
    const [openDialog, setOpenDialog] = useState(false);
    const [studentExams, setStudentExams] = useState([]);
    const [requestChangeDialog, setRequestChangeDialog] = useState(false);
    const [requestChangeNote, setRequestChangeNote] = useState("");
    const [updateStatus, setUpdateStatus] = useState(false);
    const handleMessage = useContext(MessageContext);
    const theme = useTheme();
    const isSM = useMediaQuery(theme.breakpoints.down("md"));
    const columnsLargeScreen = [
      { id: 'title', label: 'Title', width: "20%"},
      { id: 'student', label: 'Student', width: "15%",
          format: (value, row) => (
              <Typography>{row.studentInfo.student_name} {row.studentInfo.student_surname}</Typography>
          ) 
      },
      {
        id: 'expiration_date',
        label: 'Expiration Date',
        width: "10%",
        format: (value) => <Typography>{dayjs(value).format('DD/MM/YYYY')}</Typography>,
      },
      { id: 'type', label: 'Type', width: "10%" },
      {
        id: 'buttonProposalDetails',
        label: 'Proposal Request details',
        width: "15%",
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
          width: "10%",
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
        id: 'actions',
        label: 'Actions',
        width: "20%",
        format: (value, row) => {
          if(row.status === 'approved') {
            return (
              <>
                <Button
                  variant="outlined"
                  onClick={() => changeStatusOfProposalRequest(row.id, 'Approve')}
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
                <Button
                  variant="outlined"
                  onClick={() => changeStatusOfProposalRequest(row.id, 'Reject')}
                  style={{
                    fontSize: '12px',
                    textTransform: 'none',
                    color: 'white',
                    borderRadius: '4px',
                    border: '1px solid #D32F2F',
                    backgroundColor: '#D32F2F',
                    marginLeft: "1%"
                  }}
                >
                  Reject
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => handleRequestChange(true)}
                  style={{
                    fontSize: '12px',
                    textTransform: 'none',
                    color: 'white',
                    borderRadius: '4px',
                    border: '1px solid #5F5F5F',
                    backgroundColor: '#5F5F5F',
                    marginLeft: "1%"
                  }}
                >
                  Request Change
                </Button>
                <Dialog
                  open={requestChangeDialog}
                  onClose={() => setRequestChangeDialog(false)}
                  >
                      <DialogTitle id="responsive-dialog-title">
                          {"Request Change"}
                      </DialogTitle>
                      <DialogContent>
                          <DialogContentText>Note:</DialogContentText>
                          <textarea
                              rows="4"
                              cols="50"
                              type="text"
                              list="teacherSuggestions"
                              placeholder="Teacher Opinion"
                              value={requestChangeNote}
                              onChange={(event) =>
                              setRequestChangeNote(event.target.value)
                              }
                              style={{ width: "100%", marginTop: "8px" }}
                          />
                      </DialogContent>
                      <DialogActions>
                          <Button
                              onClick={handleCloseDialog}
                              variant="outlined"
                              color="secondary"
                          >
                              Cancel
                          </Button>
                          <Button
                              onClick={() =>
                              changeStatusOfProposalRequest(row.id, "Request Change")
                              }
                              variant="contained"
                              color="primary"
                          >
                              Confirm
                          </Button>
                      </DialogActions>
                  </Dialog>
              </>
            )
          } else if (row.status === 'Approve' || row.status === 'Reject') {
            return (
              <Chip label={row.status === 'Approve' ? 'Approved' : 'Rejected'} color={row.status === 'Approve' ? 'success' : 'error'} />
            )
          } else if (row.status === 'Request Change') {
            return (
              <Chip label={'Request Change'} color={'default'} />
            );
          }
        }
      }
    ];

    const columnsSmallScreen = [
      { id: 'title', label: 'Title', width: "50%"},
      {
        id: 'buttonProposalDetails',
        width: "5%",
        format: (value, row) => (
          <Tooltip title="Proposal Request details">
            <IconButton
              variant="outlined"
              style={{
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
              <DescriptionOutlinedIcon />
            </IconButton>
          </Tooltip>
        ),
      },
      {
          id: 'buttonStudentDetails',
          width: "5%",
          format: (value, row) => (
            <Tooltip title="Student details">
              <IconButton
                variant="outlined"
                style={{
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
                <AccountCircle />
              </IconButton>
          </Tooltip>
          ),
      },
      {
        id: 'actions',
        label: 'Actions',
        width: "40%",
        format: (value, row) => {
          if(row.status === 'approved') {
            return (
              <>
                <Tooltip title="Approve">
                  <IconButton
                    variant="outlined"
                    onClick={() => changeStatusOfProposalRequest(row.id, 'Approve')}
                    style={{
                      color: 'success',
                      borderRadius: '4px',
                      border: '1px solid #35682D',
                    }}
                  >
                    <DoneIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Reject">
                  <IconButton
                    variant="outlined"
                    onClick={() => changeStatusOfProposalRequest(row.id, 'Reject')}
                    style={{
                      color: '#D32F2F',
                      borderRadius: '4px',
                      border: '1px solid #D32F2F',
                      marginLeft: "1%"
                    }}
                  >
                    <CloseIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Request Change">
                  <IconButton
                    variant="outlined"
                    onClick={() => handleRequestChange(true)}
                    style={{
                      color: '#5F5F5F',
                      borderRadius: '4px',
                      border: '1px solid #5F5F5F',
                      marginLeft: "1%"
                    }}
                  >
                    <BuildIcon />
                  </IconButton>
                </Tooltip>
                <Dialog
                  open={requestChangeDialog}
                  onClose={() => setRequestChangeDialog(false)}
                  >
                      <DialogTitle id="responsive-dialog-title">
                          {"Request Change"}
                      </DialogTitle>
                      <DialogContent>
                          <DialogContentText>Note:</DialogContentText>
                          <textarea
                              rows="4"
                              cols="50"
                              type="text"
                              list="teacherSuggestions"
                              placeholder="Teacher Opinion"
                              value={requestChangeNote}
                              onChange={(event) =>
                              setRequestChangeNote(event.target.value)
                              }
                              style={{ width: "100%", marginTop: "8px" }}
                          />
                      </DialogContent>
                      <DialogActions>
                          <Button
                              onClick={handleCloseDialog}
                              variant="outlined"
                              color="secondary"
                          >
                              Cancel
                          </Button>
                          <Button
                              onClick={() =>
                              changeStatusOfProposalRequest(row.id, "Request Change")
                              }
                              variant="contained"
                              color="primary"
                          >
                              Confirm
                          </Button>
                      </DialogActions>
                  </Dialog>
              </>
            )
          } else if (row.status === 'Approve' || row.status === 'Reject') {
            return (
              <Chip label={row.status === 'Approve' ? 'Approved' : 'Rejected'} color={row.status === 'Approve' ? 'success' : 'error'} />
            )
          } else if (row.status === 'Request Change') {
            return (
              <Chip label={'Request Change'} color={'default'} />
            );
          }
        }
      }
    ];

    const columns = isSM ? columnsSmallScreen : columnsLargeScreen;

    useEffect(() => {
        proposalAPI.getProposalRequestsByTeacherId(user.id).then((res) => {
            setProposalRequests(res);
        }).catch((err) => {
            console.log(err);
        });
    }, [user.id, updateStatus]);

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

    const handleRequestChange = (status) => {
        setRequestChangeDialog(status);
    };
    
    const handleCloseDialog = () => {
        setRequestChangeNote("");
        setRequestChangeDialog(false);
    };
  
    const changeStatusOfProposalRequest = async (id, action) => {
        await proposalAPI.updateThesisRequestStatusApi(
          id,
          action,
          action === "Request Change" ? requestChangeNote : undefined
        )
          .then(async () => {
            let successMessage = "";
    
            // Determine the success message based on the selected action
            switch (action) {
              case "Approve":
                successMessage = "Proposal request approved successfully";
                break;
              case "Change Request":
                successMessage = "Proposal request status changed successfully";
                break;
              case "Reject":
                successMessage = "Proposal request rejected successfully";
                break;
              default:
                successMessage = "Proposal request status updated successfully";
            }
            setUpdateStatus(!updateStatus);
            handleMessage(successMessage, "success");
          })
          .catch(() =>
            handleMessage("Thesis request status update error", "warning")
          );
        if (action == "Request Change") {
          handleCloseDialog();
        }
      };

    return (
        <Grid container mt="8%" >
            <Button variant="contained" color="primary" onClick={() => {navigate(`/${user.role}`)}} sx={{ alignSelf: "flex-start", marginLeft: "2%", marginBottom: "1%"}}>
                Go back
            </Button>
            <StickyHeadTable rows={proposalRequests} columns={columns} noDataMessage={'No proposals request'} pagination={true} />
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
};