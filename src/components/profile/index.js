import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import samplePicture from "../common/Image/user.jpg";
import defaultPicture from "../common/Image/defaultuser.png";
import PersonOutlineOutlinedIcon from "@material-ui/icons/PersonOutlineOutlined";
import EmailOutlinedIcon from "@material-ui/icons/EmailOutlined";
import WcOutlinedIcon from "@material-ui/icons/WcOutlined";
import PhoneAndroidOutlinedIcon from "@material-ui/icons/PhoneAndroidOutlined";
import BusinessCenterOutlinedIcon from "@material-ui/icons/BusinessCenterOutlined";
import ContactsOutlinedIcon from "@material-ui/icons/ContactsOutlined";
import UpdateUserDetailsModal from "./UpdateUserDetails";
import ToasterMessageComponent from "../common/toaster";
import ConfirmationDialog from "../common/confirmdialogbox";
import ChangePassword from "./changepassword";
import UserService from "../../services/usersService";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    margin: "auto",
  },
  image: {
    width: 128,
    height: 128,
  },
  img: {
    margin: "auto",
    display: "block",
    maxWidth: "100%",
    maxHeight: "100%",
  },
  button: {
    margin: theme.spacing(1),
  },
  input: {
    display: "none",
  },
  UserDeatils: {
    paddingLeft: 5,
  },
  userCustomizeIcon: {
    fontSize: "1rem !important;",
  },
}));

export default function UserProfile() {
  const classes = useStyles();

  const usersApiCall = new UserService();

  const [openModal, setopenModal] = useState(false);
  const [imageBinaryData, setImageBinaryData] = useState("");
  const [stateSnackbar, setStateSnackbar] = useState(false);
  const [toasterMessage, setToasterMessage] = useState("");
  const [toasterServerity, settoasterServerity] = useState("");
  const [toasterErrorMessageType, settoasterErrorMessageType] =
    useState("array");
  const [openConfirmationModal, setOpenConfirmationModal] = useState(false);
  const [ConfirmationHeaderTittle, setConfirmationHeaderTittle] = useState("");
  const [ConfirmationDialogContextText, setConfirmationDialogContextText] =
    useState("");
  const [ConfirmationModalActionType, setConfirmationModalActionType] =
    useState("");
  const [componentLoadder, setcomponentLoadder] = useState(true);
  const [loggedinUserDetails, setLoggedinUserDetails] = useState();

  useEffect(() => {
    usersApiCall
      .getProfileDetails()
      .then((profileInfo) => {
        setLoggedinUserDetails(profileInfo);
        setcomponentLoadder(false);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  function changePicture(e) {
    var files = e.target.files;
    var FR = new FileReader();
    FR.addEventListener("load", function (e) {
      setImageBinaryData(e.target.result);
    });
    FR.readAsDataURL(files[0]);
  }

  function OpenUpdateUserDetailsModal() {
    setopenModal(true);
  }

  function handleChangeremovePicture() {
    // setImageBinaryData("");
    setConfirmationModalActionType("RemoveProfilePhoto");
    setOpenConfirmationModal(true);
    setConfirmationHeaderTittle("Remove Profile Picture");
    setConfirmationDialogContextText(
      "Are you sure you want to remove profile picture ?"
    );
  }

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <Grid container spacing={2}>
          <Grid item>
            <Grid item>
              <div className={classes.image}>
                {loggedinUserDetails
                  ? (() => {
                      if (loggedinUserDetails.profileImage) {
                        return (
                          <img
                            className={classes.img}
                            alt="complex"
                            src={loggedinUserDetails.profileImage}
                          />
                        );
                      } else if (loggedinUserDetails.uploadedProfileImage) {
                        return (
                          <img
                            className={classes.img}
                            alt="complex"
                            src={loggedinUserDetails.uploadedProfileImage}
                          />
                        );
                      } else {
                        return (
                          <img
                            className={classes.img}
                            alt="complex"
                            src={defaultPicture}
                          />
                        );
                      }
                    })()
                  : ""}
              </div>
            </Grid>
          </Grid>
          <Grid item xs={12} sm container className="ProfileDetailsContainer">
            {!componentLoadder ? (
              <Grid item xs container direction="column">
                <Grid item xs>
                  <Grid style={{ display: "flex" }}>
                    <Grid>
                      <Typography gutterBottom variant="subtitle1">
                        <PersonOutlineOutlinedIcon />
                      </Typography>
                    </Grid>
                    <Grid className={classes.UserDeatils}>
                      <Typography gutterBottom variant="subtitle2">
                        {loggedinUserDetails.firstName}{" "}
                        {loggedinUserDetails.lastName}
                      </Typography>
                    </Grid>
                  </Grid>
                  <Grid style={{ display: "flex" }}>
                    <Grid>
                      <Typography gutterBottom variant="subtitle1">
                        <WcOutlinedIcon />
                      </Typography>
                    </Grid>
                    <Grid className={classes.UserDeatils}>
                      <Typography gutterBottom variant="subtitle2">
                        {loggedinUserDetails.gender}
                      </Typography>
                    </Grid>
                  </Grid>
                  <Grid style={{ display: "flex" }}>
                    <Grid>
                      <Typography gutterBottom variant="subtitle1">
                        <EmailOutlinedIcon />
                      </Typography>
                    </Grid>
                    <Grid className={classes.UserDeatils}>
                      <Typography gutterBottom variant="subtitle2">
                        {loggedinUserDetails.emailID}
                      </Typography>
                    </Grid>
                  </Grid>
                  <Grid style={{ display: "flex" }}>
                    <Grid>
                      <Typography gutterBottom variant="subtitle1">
                        <PhoneAndroidOutlinedIcon />
                      </Typography>
                    </Grid>
                    <Grid className={classes.UserDeatils}>
                      <Typography gutterBottom variant="subtitle2">
                        {loggedinUserDetails.contactNumber}
                      </Typography>
                    </Grid>
                  </Grid>
                  <Grid style={{ display: "flex" }}>
                    <Grid>
                      <Typography gutterBottom variant="subtitle1">
                        <BusinessCenterOutlinedIcon />
                      </Typography>
                    </Grid>
                    <Grid className={classes.UserDeatils}>
                      <Typography gutterBottom variant="subtitle2">
                        {loggedinUserDetails.designation.name}
                      </Typography>
                    </Grid>
                  </Grid>
                  <Grid style={{ display: "flex" }}>
                    <Grid>
                      <Typography gutterBottom variant="subtitle1">
                        <ContactsOutlinedIcon />
                      </Typography>
                    </Grid>
                    <Grid className={classes.UserDeatils}>
                      <Typography gutterBottom variant="subtitle2">
                        {loggedinUserDetails.address1},{" "}
                        {loggedinUserDetails.country.name},{" "}
                        {loggedinUserDetails.zipCode}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            ) : (
              ""
            )}
          </Grid>
          <Grid item xs={12} sm container className="ProfileDetailsContainer">
            {!componentLoadder ? (
              <ChangePassword userId={loggedinUserDetails.id}></ChangePassword>
            ) : (
              ""
            )}
          </Grid>
        </Grid>
      </Paper>
      <UpdateUserDetailsModal
        openModal={openModal}
        setopenModal={setopenModal}
      />
      <ToasterMessageComponent
        stateSnackbar={stateSnackbar}
        setStateSnackbar={setStateSnackbar}
        toasterMessage={toasterMessage}
        toasterServerity={toasterServerity}
        toasterErrorMessageType={toasterErrorMessageType}
      />
      <ConfirmationDialog
        openConfirmationModal={openConfirmationModal}
        ConfirmationHeaderTittle={ConfirmationHeaderTittle}
        ConfirmationDialogContextText={ConfirmationDialogContextText}
        setOpenConfirmationModal={setOpenConfirmationModal}
        setStateSnackbar={setStateSnackbar}
        setToasterMessage={setToasterMessage}
        settoasterServerity={settoasterServerity}
        ConfirmationModalActionType={ConfirmationModalActionType}
        setImageBinaryData={setImageBinaryData}
      />
    </div>
  );
}
