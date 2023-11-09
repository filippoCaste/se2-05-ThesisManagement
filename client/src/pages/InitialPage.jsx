import React from 'react';
import { useAuth0 } from "@auth0/auth0-react";

function InitialPage() {
    const {
        user,
        isAuthenticated,
        loginWithRedirect,
        logout,
      } = useAuth0();

    return (
        <></>

       
    );
};

export default InitialPage;