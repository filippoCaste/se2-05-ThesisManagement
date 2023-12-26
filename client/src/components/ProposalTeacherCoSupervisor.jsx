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
import { useTheme } from '@mui/material/styles'; 
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import API_Proposal from '../services/proposals.api';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import API_Keywords from '../services/keywords.api'
import StickyHeadTable from './TableComponent';
       

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
    );
  }


  
  function ProposalTeacherCoSupervisor(props) {
    const navigate = useNavigate();
    const { currentDataAndTime } = props;
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
  
        
        let keywords = await  API_Keywords.getAllKeywordsWithProposalId();
        let proposals = await API_Proposal.getProposalsByCoSupervisorId(user.id);

         // Filter out duplicates based on proposal_id
        const uniqueProposals = proposals.reduce((unique, p) => {
          if (!unique.some((existingProposal) => existingProposal.proposal_id === p.proposal_id)) {
            unique.push(p);
          }
          return unique;
        }, []);

        updateExpiredStatus(uniqueProposals);
        
        const processedProposals = uniqueProposals.map(p => {
          let supervisorsInfo = [{ 'id': p.supervisor_id, 'name': p.name, 'surname': p.surname }];
          let keywords_proposal = keywords.filter((k) => k.proposal_id == p.proposal_id);
    
          let keyword_names = [];
          if (keywords_proposal) {
            keyword_names = keywords_proposal.map(k => k.name + " ,");
          }
    
          return { ...p, supervisorsInfo, keyword_names };
        });
    
        setListProposals(processedProposals);

        
      }
    };
  
    useEffect(() => {
      fetchData();
    }, [user, currentDataAndTime]);
  
  
    const closeModal = () => {
      setSelectedProposal(null);
      setModalOpen(false);
    };

    
    const handleCardClick = (proposal) => {
      setSelectedProposal(proposal);
      setModalOpen(true);
    };

   
    return ( 
      <Grid container mt="10%">
          <Grid item xs={12} sx={{ mt: '2vh', mx: '4vh' }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={12} align="center">
                <Typography variant="h4"> THESIS AS CO-SUPERVISOR </Typography>
              </Grid>
              <br /><br />
             </Grid>
          </Grid>

          <StickyHeadTable proposals={listProposals}  onClick={handleCardClick} />

          <Dialog open={isModalOpen} onClose={closeModal} maxWidth="md" fullWidth PaperProps={{ sx: {borderRadius: 8,}, }}>
               
               <DialogTitle sx={{borderBottom: `1px solid ${theme.palette.secondary.main}`, color: theme.palette.primary.main, }}>
               {selectedProposal && (
              
                   <Typography variant="h6" sx={{ fontWeight: 'bold' }}> {selectedProposal.title}  </Typography>
               )}
               </DialogTitle>
               
               <DialogContent sx={{padding: '20px', backgroundColor: theme.palette.background.default,}} >
                   {selectedProposal && (
                   <>
                       <p> <b>Proposal: </b> {selectedProposal.proposal_id}</p>
                     
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
                       <p>  <b>Keywords: </b>{selectedProposal.keyword_names} </p>
                       
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
    );

}

ProposalTeacherCoSupervisor.propTypes = {
  currentDataAndTime: PropTypes.string.isRequired
};

Row.propTypes = {
  proposal: PropTypes.shape({
    title: PropTypes.string.isRequired,
    level: PropTypes.string.isRequired,
    title_degree: PropTypes.string.isRequired,
    expiration_date: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    // Add other props as needed
  }).isRequired,
  isEvenRow: PropTypes.bool.isRequired,
  isSM: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
};


export default ProposalTeacherCoSupervisor;