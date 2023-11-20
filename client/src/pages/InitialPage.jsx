import React, {useEffect, useContext} from 'react';
import { UserContext } from '../Contexts';

function InitialPage()
{
  const { user } = useContext(UserContext);

  useEffect(() => {
    if(!user)
      window.location.replace('http://localhost:3001/api/users/login');
  });

    return(
      <>
      </>
    );

}


export default InitialPage;