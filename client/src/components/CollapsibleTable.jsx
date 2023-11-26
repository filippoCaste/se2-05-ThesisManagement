import React from 'react';
import dayjs from 'dayjs';
import { Box, Collapse, Button, IconButton, Table, TableBody, TableCell, TableHead, TableRow, Typography, Chip } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import ArchiveIcon from '@mui/icons-material/Archive';
import applicationsAPI from '../services/applications.api';
import Archive from '@mui/icons-material/Archive';

function Row(props) {
  const { row, isEvenRow, deleteProposal, index } = props;
  const [open, setOpen] = React.useState(false);
  const [statusChangeLoading, setStatusChangeLoading] = React.useState(false);

  const changeStatusOfApplication = async (studentsRow, status) => {
    try {
      setStatusChangeLoading(true);

      const response = await applicationsAPI.changeStatusOfApplication(studentsRow.application_id, status);

      if (response) {
        studentsRow.status = status;
      }
    } catch (error) {
      console.error("Error changing status:", error);
    } finally {
      setStatusChangeLoading(false);
    }
  };

  return (
    <React.Fragment>
      <TableRow sx={{ '& > *': { borderTop: "3px solid #ddd", backgroundColor: isEvenRow ? '#f5f5f5' : '#ffffff' } }}>
        <TableCell style={{ width: '5%' }}>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell style={{ width: '27%' }} component="th" scope="row">{row.p.title}</TableCell>
        <TableCell style={{ width: '10%' }}>{row.p.level === 'MSc' ? "Master of Science" : row.level === 'BSc' ? "Bachelor of Science" : ""}</TableCell>
        <TableCell style={{ width: '14%' }}>{row.p.title_degree}</TableCell>
        <TableCell style={{ width: '11%' }}>{dayjs(row.p.expiration_date).format("DD/MM/YYYY")}</TableCell>
        <TableCell style={{ width: '6%' }}>{row.p.status}</TableCell>
        <TableCell style={{ width: '3%' }}>
          <IconButton style={{ color: "#007FFF" }} aria-label="show detailss" onClick={() => props.onClick(row.p)}>
            <DescriptionOutlinedIcon />
          </IconButton>
        </TableCell>
        <TableCell style={{ width: '3%' }}>
          <IconButton color='success' aria-label="edit" onClick={() => { }}>
            <ArchiveIcon />
          </IconButton>
        </TableCell>
        <TableCell style={{ width: '3%' }}>
          <IconButton color='info' aria-label="edit" onClick={() => { }}>
            <EditIcon />
          </IconButton>
        </TableCell>
        <TableCell style={{ width: '3%' }}>
          <IconButton
            color="error"
            aria-label="delete"
            onClick={() => deleteProposal(index)}
          >
            <DeleteIcon />
          </IconButton>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0, backgroundColor: isEvenRow ? '#f5f5f5' : '#ffffff' }} colSpan={10}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1, height: 'auto' }}>
              <Typography variant="h6" gutterBottom component="div">
                <b>Students who applied</b>
              </Typography>
              {row.students.length > 0 ? (
                <Table size="small" aria-label="purchases">
                  <TableHead>
                    <TableRow>
                      <TableCell style={{ width: '5%' }}><b>Id</b></TableCell>
                      <TableCell style={{ width: '20%' }}><b>Name</b></TableCell>
                      <TableCell style={{ width: '15%' }}><b>Email</b></TableCell>
                      <TableCell style={{ width: '20%' }}><b>Title Degree</b></TableCell>
                      <TableCell style={{ width: '15%' }}><b>Enrollment Year</b></TableCell>
                      <TableCell style={{ width: '10%' }}><b>Nationality</b></TableCell>
                      <TableCell style={{ width: '15%' }}><b>Submission Date</b></TableCell>
                      <TableCell style={{ width: '5%' }} />
                      <TableCell style={{ width: '5%' }} />
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {row.students.map((studentsRow) => (
                      <TableRow key={studentsRow.student_id}>
                        <TableCell style={{ width: '5%' }} component="th" scope="row">{studentsRow.student_id}</TableCell>
                        <TableCell style={{ width: '20%' }}>{studentsRow.student_name + " " + studentsRow.student_surname}</TableCell>
                        <TableCell style={{ width: '15%' }}>{studentsRow.student_email}</TableCell>
                        <TableCell style={{ width: '20%' }}>{studentsRow.student_title_degree}</TableCell>
                        <TableCell style={{ width: '15%' }}>{studentsRow.student_enrollment_year}</TableCell>
                        <TableCell style={{ width: '10%' }}>{studentsRow.student_nationality}</TableCell>
                        <TableCell style={{ width: '15%' }}>{dayjs(studentsRow.submission_date).format("DD/MM/YYYY")}</TableCell>
                        {studentsRow.status === 'submitted' ? (
                          <>
                            <TableCell style={{ width: '5%' }}>
                              <Button
                                variant="outlined"
                                onClick={() => changeStatusOfApplication(studentsRow, 'accepted')}
                                style={{
                                  fontSize: '12px',
                                  textTransform: 'none',
                                  color: 'white',
                                  borderRadius: '4px',
                                  border: '1px solid #35682D',
                                  backgroundColor: '#35682D',
                                }}
                                disabled={statusChangeLoading}
                              >
                                Accept
                              </Button>
                            </TableCell>
                            <TableCell style={{ width: '5%' }}>
                              <Button
                                variant="outlined"
                                onClick={() => changeStatusOfApplication(studentsRow, 'refused')}
                                style={{
                                  fontSize: '12px',
                                  textTransform: 'none',
                                  color: 'white',
                                  borderRadius: '4px',
                                  border: '1px solid #FF0000',
                                  backgroundColor: '#FF0000',
                                }}
                                disabled={statusChangeLoading}
                              >
                                Reject
                              </Button>
                            </TableCell>
                          </>
                        ) : (
                          <TableCell colSpan={2} style={{ width: '10%' }}>
                            <Chip label={studentsRow.status} color={studentsRow.status === 'accepted' ? "success" : "error"} />
                          </TableCell>
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <Typography>No students apply</Typography>
              )}
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

function CollapsibleTable(props) {
  return (
    <Table aria-label="collapsible table">
      <TableHead>
        <TableRow>
          <TableCell style={{ width: '5%' }} />
          <TableCell style={{ width: '27%' }}><b>Title</b></TableCell>
          <TableCell style={{ width: '10%' }}><b>Level</b></TableCell>
          <TableCell style={{ width: '14%' }}><b>Title Degree</b></TableCell>
          <TableCell style={{ width: '11%' }}><b>Expiration Date</b></TableCell>
          <TableCell style={{ width: '6%' }}><b>Status</b></TableCell>
          <TableCell style={{ width: '3%' }}><b>See details</b></TableCell>
          <TableCell style={{ width: '3%' }}><b>Archive</b></TableCell>
          <TableCell style={{ width: '3%' }}><b>Edit</b></TableCell>
          <TableCell style={{ width: '3%' }}><b>Delete</b></TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {props.listProposals.length > 0 ? (
          props.listProposals.map((row, index) => (
            <Row key={row.id} row={row} isEvenRow={index % 2 === 0} onClick={props.onClick} />
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={10}>
              No thesis available
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}

export default CollapsibleTable;
