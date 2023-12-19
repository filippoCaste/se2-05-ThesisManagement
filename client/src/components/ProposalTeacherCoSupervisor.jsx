import React, { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import { Button, IconButton, Table, TableBody, TableCell, TableHead, TableRow, 
    Typography, useMediaQuery,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle} 
from '@mui/material';

import { UserContext } from '../Contexts';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useTheme } from '@mui/material/styles'; // Import the useTheme hook
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import UnfoldMoreOutlinedIcon from '@mui/icons-material/UnfoldMoreOutlined';
import Modal from '@mui/material/Modal';
import Paper from '@mui/material/Paper';

import API_Proposal from '../services/proposals.api';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

function Row(props) {
    const { proposal, isEvenRow, isSM, onClick } = props;
  
    const [anchorEl, setAnchorEl] = React.useState(null);
    const openActions = Boolean(anchorEl);
  
    const handleClick = (event) => {
      if (anchorEl === event.currentTarget) {
        setAnchorEl(null);
      } else {
        setAnchorEl(event.currentTarget);
      }
    };
  
    const handleClose = () => {
      setAnchorEl(null);
    };
  
    return (
      <React.Fragment>
        <TableRow sx={{ '& > *': { borderTop: "3px solid #ddd", backgroundColor: isEvenRow ? '#f5f5f5' : '#ffffff' } }}>
          <TableCell style={{ width: isSM ? '80%' : '25%' }} component="th" scope="row">{proposal.title}</TableCell>
          {!isSM ?
            <>
              <TableCell style={{ width: '10%' }}>
                {proposal.level === 'MSc' && "Master of Science"}
                {proposal.level === 'BSc' && "Bachelor of Science"}
                {proposal.level !== 'MSc' && proposal.level !== 'BSc' && ""}
              </TableCell>
              <TableCell style={{ width: '14%' }}>{proposal.title_degree}</TableCell>
              <TableCell style={{ width: '11%' }}>{dayjs(proposal.expiration_date).format("DD/MM/YYYY")}</TableCell>
              <TableCell style={{ width: '6%' }}>{proposal.status}</TableCell>
              <TableCell style={{ width: '3.6%' }}>
                <IconButton style={{ color: "#007FFF" }} aria-label="show details" onClick={() => onClick(proposal)}>
                  <DescriptionOutlinedIcon />
                </IconButton>
              </TableCell>
            </>
            :
            <TableCell style={{ width: '15%' }}>
              <IconButton style={{ color: "#007FFF" }} aria-label="show more"
                aria-controls={openActions ? 'basic-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={openActions ? 'true' : undefined}
                onClick={handleClick}>
                <MoreHorizIcon />
                <Menu
                  id="basic-menu"
                  anchorEl={anchorEl}
                  open={openActions}
                  onClose={handleClose}
                  MenuListProps={{
                    'aria-labelledby': 'basic-button',
                  }}
                >
                  <MenuItem style={{ color: "#007FFF" }} aria-label="show details" onClick={() => { onClick(proposal); handleClose(); }}><DescriptionOutlinedIcon /></MenuItem>
                </Menu>
              </IconButton>
            </TableCell>
          }
        </TableRow>
      </React.Fragment>
    );
  }
  
  function ProposalTeacherCoSupervisor(props) {
    const navigate = useNavigate();
    const { currentDataAndTime, typeOperation } = props;
    const theme = useTheme();
    const isSM = useMediaQuery(theme.breakpoints.down('md'));
    dayjs.extend(customParseFormat);
  
    const { user } = useContext(UserContext);
    const [listProposals, setListProposals] = useState([]);
    const [isModalOpen, setModalOpen] = useState(false);
    const [selectedProposal, setSelectedProposal] = useState(null);
  
    const fetchData = async () => {
      if (user) {
        const updateExpiredStatus = (proposals) => {
          proposals?.forEach(item => {
            if (dayjs(item.expiration_date).isBefore(currentDataAndTime.subtract(1, 'day'))) {
              item.status = "archived";
            }
          });
        };
  
        const proposals = await API_Proposal.getProposalsByCoSupervisorId(user.id);

        updateExpiredStatus(proposals);
        setListProposals(proposals);
      }
    };
  
    useEffect(() => {
      fetchData();
    }, [user, currentDataAndTime]);
  
    const openModal = (proposal) => {
      console.log("QUII: ",proposal)
      setSelectedProposal(proposal);
      setModalOpen(true);
    };
  
    const closeModal = () => {
      setSelectedProposal(null);
      setModalOpen(false);
    };
  
    return (
      <Grid container mt="10%">
        <Grid item xs={12} sx={{ mt: '2vh', mx: '4vh' }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={12} align="center">
              <Typography variant="h4"> THESIS AS CO-SUPERVISOR </Typography>
              <br /> <br />
            </Grid>
            <br /><br />
  
            <Table aria-label="collapsible table" >
              <TableHead>
                <TableRow>
                  <TableCell style={{ width: isSM ? "80%" : "25%" }} >
                    <b>Title</b>
                  </TableCell>
                  {!isSM ?
                    <>
                      <TableCell style={{ width: '10%' }} >
                        <b>Level</b>
                      </TableCell>
                      <TableCell style={{ width: '14%' }} >
                        <b>Title Degree</b>
                      </TableCell>
                      <TableCell style={{ width: '11%' }} >
                        <b>Expiration Date</b>
                      </TableCell>
                      <TableCell style={{ width: '6%' }} >
                        <b>Status</b>
                      </TableCell>
                      <TableCell style={{ width: '3.6%' }}><b>See details</b></TableCell>
                    </>
                    : <><TableCell style={{ width: '15%' }}><b>Actions</b></TableCell></>}
                </TableRow>
              </TableHead>
              <TableBody>
                {listProposals.length > 0 ? (
                  listProposals.map((proposal, index) => (
                    <Row
                      key={index}
                      proposal={proposal}
                      isEvenRow={index % 2 === 0}
                      isSM={isSM}
                      onClick={openModal} 
                    />
                  ))
                ) : (
                  <TableRow>
                    <TableCell />
                    <TableCell colSpan={9} >
                      No thesis available
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
  
            <Dialog open={isModalOpen} onClose={closeModal} maxWidth="md" fullWidth PaperProps={{ sx: {borderRadius: 8,}, }}>
               
                <DialogTitle sx={{borderBottom: `1px solid ${theme.palette.secondary.main}`, color: theme.palette.primary.main, }}>
                {selectedProposal && (
               
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}> {selectedProposal.title}  </Typography>
                )}
                </DialogTitle>
                
                <DialogContent sx={{padding: '20px', backgroundColor: theme.palette.background.default,}} >
                    {selectedProposal && (
                    <>
                        <p> <b>Description: </b> {selectedProposal.description}</p>
                        <p> <b>Notes: </b> {selectedProposal.notes}</p>
                        <p> <b>Expiration Date: </b> { dayjs(selectedProposal.expiration_date).format('DD/MM/YYYY')}</p>
                        <p> <b>Level: </b> {selectedProposal.level=="MSc"? "Master Of Science" : "Bachelor Of Science"}</p>
                        <p> <b>Deegre: </b> {selectedProposal.title_degree}</p>
                        <p> <b>Group: </b> {selectedProposal.title_group}</p>
                        <p> <b>Required Knowledge: </b> {selectedProposal.required_knowledge}</p>
                        <p>
                            <b>Supervisor: </b>{selectedProposal.name + " " + selectedProposal.surname}
                            <span style={{ marginLeft: '10px', marginRight: '250px' }}></span>
                            <b>Email: </b>{selectedProposal.email}
                        </p>
                    </>
                    )}
                </DialogContent>

                <DialogActions sx={{padding: '20px', borderTop: `1px solid ${theme.palette.secondary.main}`, justifyContent: 'space-between',}}>
                {selectedProposal && (
                  <Button onClick={closeModal} color="secondary">
                     <Typography variant="button" sx={{ color: theme.palette.secondary.main }}> Close </Typography>
                  </Button>
                   )}
                </DialogActions>

            </Dialog>
          
            <br /> <br />
            <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={2}>
                <Button variant="contained" color="primary" 
                 onClick={() => navigate('/teacher')}
                 style={{
                    position: 'fixed',
                    bottom: '20px', 
                    left: '20px', 
                    zIndex: 1000, 
                  }}
                > 
                 {' '}  BACK   </Button>
                </Grid>
            </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}

ProposalTeacherCoSupervisor.propTypes = {
  currentDataAndTime: PropTypes.string,
};

export default ProposalTeacherCoSupervisor;