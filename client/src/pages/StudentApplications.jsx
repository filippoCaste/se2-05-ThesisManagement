import MainDashboard from '../components/MainDashboard.jsx';
import Box from '@mui/material/Box';

function StudentApplications(props) {
  const appliedProposals = [
    {
      id: 27,
      title: 'Computer vision techniques for mobile testing',
      description:
        'Many End-to-End (E2E) testing tools allow developers to create repeatable test scripts.',
      expiration_date: '2024-07-31',
      cod_degree: '2',
      title_degree: 'COMMUNICATIONS ENGINEERING',
      level: 'MSc',
      supervisor_id: 10000,
      notes: 'http://grains.polito.it/work.php',
      cod_group: 1,
      title_group: 'Elite',
      required_knowledge:
        'programming skills (Python, deep learning frameworks);\r\nexperience in training deep neural networks;\r\nfundamentals of mobile development (Android GUI, the Android Studio development environment);',
      keyword_names: 'AI',
      keyword_types: 'KEYWORD',
      status: 'REJECTED',
      supervisorsInfo: [
        {
          id: 10000,
          name: 'Mario',
          surname: 'Rossi',
          email: 'd10000@polito.it',
          cod_group: 1,
        },
        {
          id: 10001,
          name: 'Giuseppe',
          surname: 'Verdi',
          email: 'd10001@polito.it',
          cod_group: 1,
        },
      ],
    },
    {
      id: 27,
      title: 'Computer vision techniques for mobile testing',
      description:
        'Many End-to-End (E2E) testing tools allow developers to create repeatable test scripts.',
      expiration_date: '2024-07-31',
      cod_degree: '2',
      title_degree: 'COMMUNICATIONS ENGINEERING',
      level: 'MSc',
      supervisor_id: 10000,
      notes: 'http://grains.polito.it/work.php',
      cod_group: 1,
      title_group: 'Elite',
      required_knowledge:
        'programming skills (Python, deep learning frameworks);\r\nexperience in training deep neural networks;\r\nfundamentals of mobile development (Android GUI, the Android Studio development environment);',
      keyword_names: 'AI',
      keyword_types: 'KEYWORD',
      status: 'REJECTED',
      supervisorsInfo: [
        {
          id: 10000,
          name: 'Mario',
          surname: 'Rossi',
          email: 'd10000@polito.it',
          cod_group: 1,
        },
        {
          id: 10001,
          name: 'Giuseppe',
          surname: 'Verdi',
          email: 'd10001@polito.it',
          cod_group: 1,
        },
      ],
    },
    {
      id: 27,
      title: 'Computer vision techniques for mobile testing',
      description:
        'Many End-to-End (E2E) testing tools allow developers to create repeatable test scripts.',
      expiration_date: '2024-07-31',
      cod_degree: '2',
      title_degree: 'COMMUNICATIONS ENGINEERING',
      level: 'MSc',
      supervisor_id: 10000,
      notes: 'http://grains.polito.it/work.php',
      cod_group: 1,
      title_group: 'Elite',
      required_knowledge:
        'programming skills (Python, deep learning frameworks);\r\nexperience in training deep neural networks;\r\nfundamentals of mobile development (Android GUI, the Android Studio development environment);',
      keyword_names: 'AI',
      keyword_types: 'KEYWORD',
      status: 'ACCEPTED',
      supervisorsInfo: [
        {
          id: 10000,
          name: 'Mario',
          surname: 'Rossi',
          email: 'd10000@polito.it',
          cod_group: 1,
        },
        {
          id: 10001,
          name: 'Giuseppe',
          surname: 'Verdi',
          email: 'd10001@polito.it',
          cod_group: 1,
        },
      ],
    },
    {
      id: 27,
      title: 'Computer vision techniques for mobile testing',
      description:
        'Many End-to-End (E2E) testing tools allow developers to create repeatable test scripts.',
      expiration_date: '2024-07-31',
      cod_degree: '2',
      title_degree: 'COMMUNICATIONS ENGINEERING',
      level: 'MSc',
      supervisor_id: 10000,
      notes: 'http://grains.polito.it/work.php',
      cod_group: 1,
      title_group: 'Elite',
      required_knowledge:
        'programming skills (Python, deep learning frameworks);\r\nexperience in training deep neural networks;\r\nfundamentals of mobile development (Android GUI, the Android Studio development environment);',
      keyword_names: 'AI',
      keyword_types: 'KEYWORD',
      status: 'PENDING',
      supervisorsInfo: [
        {
          id: 10000,
          name: 'Mario',
          surname: 'Rossi',
          email: 'd10000@polito.it',
          cod_group: 1,
        },
        {
          id: 10001,
          name: 'Giuseppe',
          surname: 'Verdi',
          email: 'd10001@polito.it',
          cod_group: 1,
        },
      ],
    },
  ];

  return (
    <>
      <Box sx={{ display: 'inline-flex' }} mt={'15vh'} mx={'6vh'}>
        <MainDashboard proposals={appliedProposals} isAppliedProposals={true} />
      </Box>
    </>
  );
}

export default StudentApplications;
