import 'bootstrap/dist/css/bootstrap.min.css';
import theme from './theme.jsx';
import dayjs from 'dayjs';
import { ThemeProvider } from '@mui/material/styles';
import { useState, useEffect, useMemo } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainPage from './pages/MainPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';
import AppNavBar from './components/AppBar.jsx';
import CustomSnackBar from './components/CustomSnackbar.jsx';
import { UserContext, MessageContext } from './Contexts';
import TeacherPage from './pages/TeacherPage.jsx';
import ProposalTeacher from './components/ProposalTeacher.jsx';
import InitialPage from './pages/InitialPage.jsx';
import userAPI from './services/users.api.js';
import { Student, Professor, Secretary } from './models/User.js';
import StudentApplications from './pages/StudentApplications';
import ProposalStudent from './components/ProposalStudent.jsx';
import SecretaryPage from './pages/SecretaryPage.jsx';
import NotificationsPage from './pages/NotificationPage.jsx';

function App() {
  const [message, setMessage] = useState('');
  const [user, setUser] = useState(null);
  const [openSelectionsMobile, setOpenSelectionsMobile] = useState(false);
  const [currentDataAndTime, setCurrentDataAndTime] = useState(dayjs());
  const userObject = useMemo(() => ({ user, setUser }), [user, setUser]);

  const handleMessage = useMemo(() => (messageContent, severity) => {
    setMessage({ text: messageContent, type: severity });
  }, [setMessage]);

  useEffect(() => {
    userAPI
      .getUserInfo()
      .then((userInfo) => {
        if (userInfo?.role === 'student') {
          setUser(new Student(userInfo));
          handleMessage('Student successfully logged in', 'success');
        } else if (userInfo?.role === 'teacher'){
          setUser(new Professor(userInfo));
          handleMessage('Teacher successfully logged in', 'success');
        }
        else if(userInfo?.role === 'secretary'){
          setUser(new Secretary(userInfo));
          handleMessage('Secretary successfully logged in', 'success');
        }
      })
      .catch((err) => {
        handleMessage(err, 'warning'); // warning success
      });
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <UserContext.Provider value={userObject}>
          <MessageContext.Provider value={handleMessage}>
            <CustomSnackBar message={message}></CustomSnackBar>
            <AppNavBar
              openSelectionsMobile={openSelectionsMobile}
              setOpenSelectionsMobile={setOpenSelectionsMobile}
              currentDataAndTime={currentDataAndTime}
              setCurrentDataAndTime={setCurrentDataAndTime}
            />
            <Routes>
              <Route index path="/" element={<InitialPage />} />
              <Route path="*" element={<NotFoundPage />} />
              
              {/********* STUDENT ROUTES **********/}
              <Route
                path="/student"
                element={
                  <MainPage
                    openSelectionsMobile={openSelectionsMobile}
                    currentDataAndTime={currentDataAndTime}
                  />
                }
              />
              <Route
                path="/student/applications"
                element={<StudentApplications />}
              />
              <Route
                path="/student/proposal"
                element={<ProposalStudent />}
              />


              {/********** TEACHER ROUTES **********/}
              <Route path="/teacher" element={<TeacherPage  currentDataAndTime={currentDataAndTime} />} />
              <Route path="/teacher/addProposal" 
               element={<ProposalTeacher  typeOperation="add" />} />

              <Route path='/teacher/updateProposal/:proposalId'  
               element={<ProposalTeacher typeOperation="edit" />} />

              <Route path='/teacher/copyProposal/:proposalId'  
               element={<ProposalTeacher typeOperation="copy" />} />
                
              {/******** SECRETARY ROUTES *******/}
              <Route path="/secretary" element={<SecretaryPage currentDataAndTime={currentDataAndTime}/>}></Route>

              <Route path="/notifications" element={<NotificationsPage handleMessage={handleMessage}/>}></Route>

            </Routes>
          </MessageContext.Provider>
        </UserContext.Provider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
