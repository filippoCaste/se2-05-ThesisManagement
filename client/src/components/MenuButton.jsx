import { Box, Button, Menu, MenuItem } from "@mui/material";
import React from "react";
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';
import ListIcon from '@mui/icons-material/List';

export default function MenuButton(props) {
    const { userRole } = props;
    let menuList = [];
    if (userRole === 'student') {
        menuList.push("Browse applications")
        menuList.push("Insert new thesis request")
    } else if(userRole === 'teacher') {
        menuList.push("Insert new proposal")
        menuList.push("Browse co-supervised proposals")
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
                        {menuList.map(item => { 
                                return <MenuItem onClick={popupState.close}>{item}</MenuItem>;
                            })}
                    </Menu>
                </React.Fragment>
            )}
        </PopupState>
    )
}