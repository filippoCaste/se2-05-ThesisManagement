import React, { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import { Button, Typography, Dialog, DialogActions, DialogContent, DialogTitle}  from '@mui/material';
import { UserContext } from '../Contexts';
import { useTheme } from '@mui/material/styles'; 
import API_Proposal from '../services/proposals.api';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import API_Keywords from '../services/keywords.api'
import StickyHeadTable from './TableComponent';
       

  function ProposalTeacherCoSupervisor(props) {
    const navigate = useNavigate();
    const { currentDataAndTime } = props;
    const theme = useTheme();
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
            keyword_names = keywords_proposal.map(k => k.name + ", ");
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




export default ProposalTeacherCoSupervisor;