import React from 'react';
import {
  CardActionArea,
  CardContent,
  Typography,
  Card,
  Box,
} from '@mui/material';
import ChipsCustomized from './ChipsCustomized';
import dayjs from 'dayjs';

function CardCustomized(props) {
  const { proposal, onClick } = props;
  const mainSupervisor = proposal?.supervisorsInfo?.find(
    (supervisor) => supervisor.id === proposal.supervisor_id
  );
  const coSupervisors = proposal?.supervisorsInfo?.filter(
    (supervisor) => supervisor.id !== proposal.supervisor_id
  );

  const handleClick = () => {
    onClick(proposal);
    console.log(proposal);
  };

  return (
    <Card variant="outlined" sx={{ height: '35vh' }}>
      <CardActionArea onClick={handleClick} sx={{ height: '100%' }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
            <Typography sx={{ fontWeight: 'bold', mr: '4px' }}>LvL:</Typography>
            <Typography>{data?.level}</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography sx={{ fontWeight: 'bold', mr: '4px' }}>
              Exp. date:
            </Typography>
            <Typography>
              {dayjs(proposal?.expiration_date).format('YYYY-MM-DD')}{' '}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography sx={{ mr: '10px', fontWeight: 'bold' }}>
              Title:
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              {proposal?.title}
            </Typography>
          </Box>

          <Box
            sx={{
              display: 'inline-flex',
              flexWrap: 'wrap',
              alignItems: 'center',
            }}
          >
            {mainSupervisor && (
              <>
                <Typography sx={{ fontWeight: 'bold', mr: '10px' }}>
                  Supervisor:
                </Typography>
                <Typography>
                  {mainSupervisor.name} ({mainSupervisor.email})
                </Typography>
              </>
            )}

            {/* Display co-supervisors */}
            {coSupervisors?.map((supervisor, index) => (
              <>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography sx={{ mr: '10px', fontWeight: 'bold' }}>
                    coSupervisors:
                  </Typography>
                  <Typography>
                    {supervisor.name} ({supervisor.email})
                  </Typography>
                </Box>
              </>
            ))}
          </Box>
          {proposal?.keyword_names && (
            <Typography sx={{ mr: '10px', fontWeight: 'bold' }}>
              Keywords: {proposal?.keyword_names}
            </Typography>
          )}
          {/* <ChipsCustomized array={[]} /> */}
          <Typography sx={{ mr: '10px', fontWeight: 'bold' }}>
            Overview:
          </Typography>
          <Typography
            sx={{
              fontWeight: 'light',
              color: 'primary.main',
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
            }}
          >
            {proposal?.description}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

export default CardCustomized;
