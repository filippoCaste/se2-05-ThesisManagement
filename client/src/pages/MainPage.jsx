
import ResponsiveDrawer from "../components/ResponsiveDrawer.jsx";

function MainPage(props) {
  const {openSelectionsMobile} = props;
  return (
   <>
   <ResponsiveDrawer openSelectionsMobile={openSelectionsMobile}/>
   </>
  );
}

export default MainPage;
