import { Box, Button, Menu, MenuItem } from "@mui/material";
import React from "react";
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';
import ListIcon from '@mui/icons-material/List';
import { useNavigate } from "react-router-dom";

/**
 * Generates a menu button component based on the user's role.
 *
 * @param {Object} props - The props object containing the user's role.
 * @param {string} props.userRole - The role of the user.
 * @return {JSX.Element} The generated menu button component.
 */
export default function MenuButton(props) {
    const navigate = useNavigate();
    const { userRole } = props;
    let menuList = [];
    if (userRole === 'student') {
        menuList.push("Browse applications")
        menuList.push("Insert new thesis request")
    } else if(userRole === 'teacher') {
        menuList.push("Insert new proposal")
        menuList.push("Browse co-supervised proposals")
    }

    const handleClick = (index) => {
        if(userRole === 'student') {
            let path = '/student';
            if(index === 0) {
                path = '/student/applications';
            } else if(index === 1) {
                path = '/student/proposal';
            }
            navigate(path);
        } else if(userRole === 'teacher') {
            let path = '/teacher';
            if(index === 0) {
                path = '/teacher/addProposal';
            } else if(index === 1) {
                path = '/teacher/browseCoSupervisor'
            }
            navigate(path);
        }
    }

    return (
        <PopupState variant="popover" popupId="popup-menu">
            {(popupState) => (
                <React.Fragment>
                    <Box
                        sx={{
                            position: 'fixed',
                            bottom: 80,
                            right: 90,
                        }}
                    >
                        <Button variant="contained" {...bindTrigger(popupState)} style={{ position: "fixed", borderRadius: 100, height: '8vh' }}>
                            <ListIcon />
                        </Button>
                    </Box>
                    <Menu {...bindMenu(popupState)}>
                        {menuList.map((item, index) => { 
                                return <MenuItem key={item} onClick={() => handleClick(index)}>{item}</MenuItem>;
                            })}
                    </Menu>
                </React.Fragment>
            )}
        </PopupState>
    )
}