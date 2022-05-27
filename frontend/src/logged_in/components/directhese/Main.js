import React, { memo, useCallback, useState, Fragment, useContext, useEffect} from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import withStyles from '@mui/styles/withStyles';
import Routing from "./Routing";
import NavBar from "./navigation/NavBar";
import ConsecutiveSnackbarMessages from "../../../shared/components/ConsecutiveSnackbarMessages";
import smoothScrollTop from "../../../shared/functions/smoothScrollTop";
import UserContext from "../../../shared/components/UserContext";

const axios = require('axios');

const styles = (theme) => ({
  main: {
    marginTop: theme.spacing(11),
    marginLeft: theme.spacing(9),
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    [theme.breakpoints.down('sm')]: {
      marginLeft: 0,
    },
  },
});


function Main(props) {
 
  const { classes } = props;
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [docs, setDocs] = useState([]);
  const [pushMessageToSnackbar, setPushMessageToSnackbar] = useState(null);
  const [selectedTab, setSelectedTab] = useState(null);
  const { userData } = useContext(UserContext);
  

  const getPushMessageFromChild = useCallback(
    (pushMessage) => {
      setPushMessageToSnackbar(() => pushMessage);
    },
    [setPushMessageToSnackbar]
  );
  const handleMobileDrawerOpen = useCallback(() => {
    setIsMobileDrawerOpen(true);
  }, [setIsMobileDrawerOpen]);

  const handleMobileDrawerClose = useCallback(() => {
    setIsMobileDrawerOpen(false);
  }, [setIsMobileDrawerOpen]);
 

  const selectDirt = useCallback(() => {
    smoothScrollTop();
    document.title = "Directeur de These";
    setSelectedTab("Dirt");
  }, [setSelectedTab]);

  useEffect(() => {

    const fetchRandomDocList = async() => {

   

      await axios.get("http://localhost:5000/users/secdoc").then(function (response) {

      const doclist = response.data;

      const docs = [];

      for (let i = 0; i < doclist.length; i += 1) {

        const randomdoc = doclist[i];

        console.log(randomdoc.dirprenom);

        if((userData.user.dept === randomdoc.dept) && ((userData.user.ensnom === randomdoc.dirnom))){

        const target = {

          id: i,

          _id : randomdoc._id,

          nom: randomdoc.nom,

          prénom:  randomdoc.prenom,

          intit:  randomdoc.intithe,

          etav: null,

          datesou : randomdoc.datesout,

        };

        docs.push(target);

      }

      }

      setDocs(docs);

    })

    .catch(function (error) {

      console.log(error);

    });

   

      };

      fetchRandomDocList();

  }, []);


  return (
    <Fragment>
      
      <NavBar
        selectedTab={selectedTab}
        mobileDrawerOpen={isMobileDrawerOpen}
        handleMobileDrawerOpen={handleMobileDrawerOpen}
        handleMobileDrawerClose={handleMobileDrawerClose}
      />
      <ConsecutiveSnackbarMessages
        getPushMessageFromChild={getPushMessageFromChild}
      />
      <main className={classNames(classes.main)} >
        <Routing    
          pushMessageToSnackbar={pushMessageToSnackbar}
          dirt={docs}
          setDirt={setDocs}
          selectDirt={selectDirt}    
        />
      </main>
    </Fragment>
  );
}

Main.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(memo(Main));
