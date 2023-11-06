import React from 'react';
import { CardActionArea, CardContent, Typography, Card, Box } from '@mui/material';
import ChipsCustomized from './ChipsCustomized';

function CardCustomized(props) {
  const { data, onClick } = props;

  const handleClick = () => {
    onClick(data);
  };

  return (
    <Card variant="outlined" sx={{ minHeight: "40vh", maxHeight: "40vh" }}>
      <CardActionArea onClick={handleClick}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
            <Typography sx={{ fontWeight: 'bold', mr: '4px' }}>LvL:</Typography>
            <Typography>{data?.level}</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
            <Typography sx={{ fontWeight: 'bold', mr: '4px' }}>Exp. date:</Typography>
            <Typography>{data?.expirationDate} </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
            <Typography sx={{ mr: '10px', fontWeight: "bold" }}>Title:</Typography>
            <Typography variant='h6' sx={{ fontWeight: "bold" }}>{data?.title}</Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography sx={{ fontWeight: 'light', color: 'primary.main' }}>
              {data?.supervisor} (sup) • {data?.coSupervisor} (co-sup)
            </Typography>
          </Box>

          <ChipsCustomized array={data?.keywords} />
          <Typography sx={{ mr: '10px', fontWeight: "bold" }}>Overview:</Typography>
          <Typography sx={{ fontWeight: 'light', color: 'primary.main', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
            {data?.description}
          </Typography>

        </CardContent>
      </CardActionArea>
    </Card>
  );
}

export default CardCustomized;
