import React, { useState } from 'react';
import Grid from '@mui/material/Grid';
import CardCustomized from './CardCustomized';
import AlertDialog from './AlertDialog';

function MainDashboard() {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const handleCardClick = (datum) => {
    setSelectedItem(datum);
    setOpenDialog(true);
  };
const data = [
  {
    id: 1,
    title: "Project 1",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    supervisor: "Supervisor 1",
    coSupervisor: "Co-Supervisor 1",
    level: 1,
    keywords: [
      { key: "keyword1", label: "Keyword 1" },
      { key: "keyword2", label: "Keyword 2" },
      { key: "keyword3", label: "Keyword 3" },
    ],
    expirationDate: "10-11-2023",
  },
  {
    id: 2,
    title: "Project 2",
    description: "Description of project 2",
    supervisor: "Supervisor 2",
    coSupervisor: "Co-Supervisor 2",
    level: 2,
    keywords: [
      { key: "keyword4", label: "Keyword 4" },
      { key: "keyword5", label: "Keyword 5" },
    ],
    expirationDate: "15-12-2023",
  },
  {
    id: 3,
    title: "Project 3",
    description: "Description of project 3",
    supervisor: "Supervisor 3",
    coSupervisor: "Co-Supervisor 3",
    level: 3,
    keywords: [
      { key: "keyword6", label: "Keyword 6" },
      { key: "keyword7", label: "Keyword 7" },
      { key: "keyword8", label: "Keyword 8" },
    ],
    expirationDate: "20-01-2024",
  },
  {
    id: 4,
    title: "Project 4",
    description: "Description of project 4",
    supervisor: "Supervisor 4",
    coSupervisor: "Co-Supervisor 4",
    level: 1,
    keywords: [
      { key: "keyword9", label: "Keyword 9" },
      { key: "keyword10", label: "Keyword 10" },
    ],
    expirationDate: "25-02-2024",
  },
  {
    id: 5,
    title: "Project 5",
    description: "Description of project 5",
    supervisor: "Supervisor 5",
    coSupervisor: "Co-Supervisor 5",
    level: 2,
    keywords: [
      { key: "keyword11", label: "Keyword 11" },
      { key: "keyword12", label: "Keyword 12" },
      { key: "keyword13", label: "Keyword 13" },
    ],
    expirationDate: "30-03-2024",
  },
  {
    id: 6,
    title: "Project 6",
    description: "Description of project 6",
    supervisor: "Supervisor 6",
    coSupervisor: "Co-Supervisor 6",
    level: 3,
    keywords: [
      { key: "keyword14", label: "Keyword 14" },
    ],
    expirationDate: "05-04-2024",
  },
  {
    id: 7,
    title: "Project 7",
    description: "Description of project 7",
    supervisor: "Supervisor 7",
    coSupervisor: "Co-Supervisor 7",
    level: 1,
    keywords: [
      { key: "keyword15", label: "Keyword 15" },
      { key: "keyword16", label: "Keyword 16" },
      { key: "keyword17", label: "Keyword 17" },
    ],
    expirationDate: "10-05-2024",
  },
  {
    id: 8,
    title: "Project 8",
    description: "Description of project 8",
    supervisor: "Supervisor 8",
    coSupervisor: "Co-Supervisor 8",
    level: 2,
    keywords: [
      { key: "keyword18", label: "Keyword 18" },
      { key: "keyword19", label: "Keyword 19" },
    ],
    expirationDate: "15-06-2024",
  },
  {
    id: 9,
    title: "Project 9",
    description: "Description of project 9",
    supervisor: "Supervisor 9",
    coSupervisor: "Co-Supervisor 9",
    level: 3,
    keywords: [
      { key: "keyword20", label: "Keyword 20" },
      { key: "keyword21", label: "Keyword 21" },
      { key: "keyword22", label: "Keyword 22" },
    ],
    expirationDate: "20-07-2024",
  },
  {
    id: 10,
    title: "Project 10",
    description: "Description of project 10",
    supervisor: "Supervisor 10",
    coSupervisor: "Co-Supervisor 10",
    level: 1,
    keywords: [
      { key: "keyword23", label: "Keyword 23" },
      { key: "keyword24", label: "Keyword 24" },
    ],
    expirationDate: "25-08-2024",
  },
  {
    id: 11,
    title: "Project 11",
    description: "Description of project 11",
    supervisor: "Supervisor 11",
    coSupervisor: "Co-Supervisor 11",
    level: 2,
    keywords: [
      { key: "keyword25", label: "Keyword 25" },
      { key: "keyword26", label: "Keyword 26" },
      { key: "keyword27", label: "Keyword 27" },
    ],
    expirationDate: "30-09-2024",
  },
  {
    id: 12,
    title: "Project 12",
    description: "Description of project 12",
    supervisor: "Supervisor 12",
    coSupervisor: "Co-Supervisor 12",
    level: 3,
    keywords: [
      { key: "keyword28", label: "Keyword 28" },
      { key: "keyword29", label: "Keyword 29" },
    ],
    expirationDate: "05-10-2024",
  },
  {
    id: 13,
    title: "Project 13",
    description: "Description of project 13",
    supervisor: "Supervisor 13",
    coSupervisor: "Co-Supervisor 13",
    level: 1,
    keywords: [
      { key: "keyword30", label: "Keyword 30" },
      { key: "keyword31", label: "Keyword 31" },
      { key: "keyword32", label: "Keyword 32" },
    ],
    expirationDate: "10-11-2024",
  },
  {
    id: 14,
    title: "Project 14",
    description: "Description of project 14",
    supervisor: "Supervisor 14",
    coSupervisor: "Co-Supervisor 14",
    level: 2,
    keywords: [
      { key: "keyword33", label: "Keyword 33" },
      { key: "keyword34", label: "Keyword 34" },
    ],
    expirationDate: "15-12-2024",
  },
  {
    id: 15,
    title: "Project 15",
    description: "Description of project 15",
    supervisor: "Supervisor 15",
    coSupervisor: "Co-Supervisor 15",
    level: 3,
    keywords: [
      { key: "keyword35", label: "Keyword 35" },
      { key: "keyword36", label: "Keyword 36" },
      { key: "keyword37", label: "Keyword 37" },
    ],
    expirationDate: "20-01-2025",
  },
  {
    id: 16,
    title: "Project 16",
    description: "Description of project 16",
    supervisor: "Supervisor 16",
    coSupervisor: "Co-Supervisor 16",
    level: 1,
    keywords: [
      { key: "keyword38", label: "Keyword 38" },
      { key: "keyword39", label: "Keyword 39" },
    ],
    expirationDate: "25-02-2025",
  },
];





  return (
    <>
      {openDialog && (
        <AlertDialog
          open={openDialog}
          handleClose={() => setOpenDialog(false)}
          item={selectedItem}
        />
      )}
      <Grid container spacing={4} mt={"0.5vh"}>
        {data.map((datum) => (
          <Grid item key={datum?.id} xs={6} sm ={4} md={3} zeroMinWidth>
            <CardCustomized data={datum} onClick={handleCardClick} />
          </Grid>
        ))}
      </Grid>
    </>
  );
}

export default MainDashboard;
