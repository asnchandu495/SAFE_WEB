import React, { Fragment, useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import FormHelperText from "@material-ui/core/FormHelperText";
import { ValidatorForm } from "react-material-ui-form-validator";
import Grid from "@material-ui/core/Grid";
import CloseIcon from "@material-ui/icons/Close";
import CheckIcon from "@material-ui/icons/Check";
import UserService from "../../services/usersService";
import UserGroupService from "../../services/userGroupService";
import MasterService from "../../services/masterDataService";
import ToasterMessageComponent from "../common/toaster";
import CircularProgress from "@material-ui/core/CircularProgress";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import ButtonLoadderComponent from "../common/loadder/buttonloadder";
import { withStyles } from "@material-ui/core/styles";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogActions from "@material-ui/core/DialogActions";
import IconButton from "@material-ui/core/IconButton";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";


const theme1 = createMuiTheme({
  overrides: {
    MUIDataTable: {
      responsiveScroll: {
        overflowX: "none",
        height: "auto",
        maxHeight: "calc(100vh - 310px) !important",
      },
    },
  },
});

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  backButton: {
    marginRight: theme.spacing(1),
  },
  instructions: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    padding: 25,
  },
  stepButtons: {
    display: "flex",
    justifyContent: "flex-end",
  },
  icon: {
    marginRight: theme.spacing(0.5),
    marginBottom: -3,
    width: 20,
    height: 20,
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: "100%",
    margin: 0,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  errorSpanMsg: {
    color: "red",
  },
  HideGrid: {
    display: "none",
  },
}));
function AllocateUserToPrimaryGroup(props) {
  const usersApiCall = new UserService();
  const masterDataCallApi = new MasterService();
  const userGroupApiCall = new UserGroupService();
  const classes = useStyles();
  const [BusinessTeamMasterData, setBusinessTeamMasterData] = useState();
  const [formFieldValidation, setformFieldValidation] = useState({
    primaryGroup: false,
  });
  const [UserSelectedPrimaryGroupValue, setUserSelectedPrimaryGroupValue] =
    useState([]);
  const [componentLoadder, setcomponentLoadder] = useState(true);
  const [stateSnackbar, setStateSnackbar] = useState(false);
  const [toasterMessage, setToasterMessage] = useState("");
  const [toasterServerity, settoasterServerity] = useState("");
  const [buttonloadder, setbuttonloadder] = useState(false);
  const [toasterErrorMessageType, settoasterErrorMessageType] =
    useState("array");
  const [formData, SetformData] = useState({
    isPrimary: true,
    applicationUserId: "",
    groups: [],
  });
  const [resetComponent, setResetComponent] = useState("NO");
  const [Modalsubmit, setModalsubmit] = useState(false);
  const [showLoadder, setshowLoadder] = useState(false);

  const [ShowYesLoadder, setshowYesLoadder] = useState(false);
  const DialogTitle = withStyles(styles)((props) => {
    const { children, classes, onClose, ...other } = props;
    return (
      <MuiDialogTitle disableTypography className={classes.root} {...other}>
        <Typography variant="h6">{children}</Typography>
        {onClose ? (
          <IconButton
            aria-label="close"
            className={classes.closeButton}
            onClick={onClose}
          >
            <CloseIcon />
          </IconButton>
        ) : null}
      </MuiDialogTitle>
    );
  });

  const DialogActions = withStyles((theme) => ({
    root: {
      margin: 0,
      padding: theme.spacing(1),
    },
  }))(MuiDialogActions);

  useEffect(() => {
    setcomponentLoadder(true);
    setUserSelectedPrimaryGroupValue([props.primaryGroup]);
    Promise.all([userGroupApiCall.loadUserGroup()])
      .then(([getTeams]) => {
        let secondaryGroups =
          props.applicationUserData.applicationUserToSecondaryGroup;
        if (secondaryGroups.length > 0) {
          let filteredPGroupData = getTeams.filter(
            (elem) => !secondaryGroups.find(({ id }) => elem.id == id)
          );
          setBusinessTeamMasterData(filteredPGroupData);
        } else {
          setBusinessTeamMasterData(getTeams);
        }
        setResetComponent("NO");
        setcomponentLoadder(false);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [resetComponent]);

  function handleChangeTeam(event, value) {
    setUserSelectedPrimaryGroupValue(value);
    props.setActiveCard("primaryGroup");
    if (value) {
      setformFieldValidation((ValidationForm) => ({
        ...ValidationForm,
        ["primaryGroup"]: false,
      }));
    } else {
      setformFieldValidation((ValidationForm) => ({
        ...ValidationForm,
        ["primaryGroup"]: true,
      }));
    }
  }

  function SelecPrimaryGroupValidation() {
    if (UserSelectedPrimaryGroupValue) {
      setformFieldValidation((ValidationForm) => ({
        ...ValidationForm,
        ["primaryGroup"]: false,
      }));
    } else {
      setformFieldValidation((ValidationForm) => ({
        ...ValidationForm,
        ["primaryGroup"]: true,
      }));
    }
  }

  function cancelEdit() {
    props.setActiveCard("");
    setformFieldValidation({ primaryGroup: false });
    setResetComponent("YES");
  }

  function UserPrimaryGroup() {
    SelecPrimaryGroupValidation();
    if (UserSelectedPrimaryGroupValue) {
      setModalsubmit(true);
      // UserPrimaryGroupSubmit();

    } else {
      return false;
    }
  }
  const handlesubmitClose = () => {
    props.setActiveCard("");
    setformFieldValidation({ primaryGroup: false });
    setResetComponent("YES");
    setModalsubmit(false);

  };

  function handleClickYes() {
    setshowYesLoadder(true);
    setbuttonloadder(true);

    settoasterServerity("");
    settoasterErrorMessageType("");

    var data = formData;
    data.applicationUserId = props.applicationUserId;
    data.groups = [UserSelectedPrimaryGroupValue];
    usersApiCall
      .UpdateApplicationUserPrimaryGroup(data)
      .then((result) => {
        setStateSnackbar(true);
        setToasterMessage("Primary group assigned to users");
        settoasterServerity("success");
        setTimeout(() => {
          props.setIsUpdated("YES");
          props.setActiveCard("");
          setbuttonloadder(false);
        }, 6000);
      })
      .catch((err) => {
        setToasterMessage(err.data.errors);
        settoasterServerity("error");
        setStateSnackbar(true);
        setbuttonloadder(false);
      });
  }

  return (
    <Card className="user-update-details-card">
      <Dialog
        onClose={handlesubmitClose}
        aria-labelledby="customized-dialog-title"
        open={Modalsubmit}
        className="global-dialog confirmation-dialog global-form"
      >
        <DialogTitle id="customized-dialog-title" onClose={handlesubmitClose}>
          Assign user
        </DialogTitle>
        <DialogContent dividers>
          <Typography gutterBottom>
            Whichever FAQ , Questionnaire , Emergency Contact and Workflow is assigned to this user group, will be applicable for the selected user(s). Are you sure you want to go ahead with the change ?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handlesubmitClose}
            className="no-button"
            disabled={showLoadder}
          >
            No
          </Button>
          <Button
            onClick={handleClickYes}
            className="yes-button"
            disabled={showLoadder}
          >
            {ShowYesLoadder ? <ButtonLoadderComponent /> : "Yes"}
          </Button>
        </DialogActions>
      </Dialog>
      {!componentLoadder ? (
        <ValidatorForm className={`global-form`} onSubmit={UserPrimaryGroup}>
          <CardContent>
            <Typography className="card-heading">
              Update Primary Group
            </Typography>
            <div className="card-form">
              <Grid container spacing={3}>
                <Grid item sm={9}>
                  <Autocomplete
                    id="tags-outlined"
                    options={
                      BusinessTeamMasterData &&
                        BusinessTeamMasterData.length > 0
                        ? BusinessTeamMasterData
                        : []
                    }
                    getOptionLabel={(option) => option.groupName}
                    defaultValue={
                      UserSelectedPrimaryGroupValue
                        ? UserSelectedPrimaryGroupValue[0]
                        : ""
                    }
                    onChange={handleChangeTeam}
                    filterSelectedOptions
                    className="global-input autocomplete-select"
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        placeholder="Select primary group"
                      />
                    )}
                  />
                </Grid>
                {props.activeCard == "primaryGroup" ? (
                  <Grid
                    item
                    sm={3}
                    className="grid-no-pad-left-right details-action-container"
                  >
                    <Button
                      variant="contained"
                      color="primary"
                      type="submit"
                      size="small"
                      className="inlne-action-btns save-icon"
                      disabled={buttonloadder}
                    >
                      {!buttonloadder ? (
                        <CheckIcon />
                      ) : (
                        <CircularProgress
                          size={15}
                          thickness={5}
                          color={"white"}
                        />
                      )}
                    </Button>
                    <Button
                      variant="contained"
                      color="primary"
                      type="button"
                      size="small"
                      className="inlne-action-btns cancel-icon"
                      onClick={cancelEdit}
                    >
                      <CloseIcon />
                    </Button>
                  </Grid>
                ) : (
                  ""
                )}
              </Grid>

              {formFieldValidation.primaryGroup ? (
                <FormHelperText className="error-msg">
                  Please select primary group{" "}
                </FormHelperText>
              ) : (
                ""
              )}
            </div>
          </CardContent>
        </ValidatorForm>
      ) : null}
      <ToasterMessageComponent
        stateSnackbar={stateSnackbar}
        setStateSnackbar={setStateSnackbar}
        toasterMessage={toasterMessage}
        toasterServerity={toasterServerity}
        toasterErrorMessageType={toasterErrorMessageType}
      />
    </Card>
  );
}

export default AllocateUserToPrimaryGroup;
