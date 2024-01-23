import React, { Fragment, useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import Grid from "@material-ui/core/Grid";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import FormHelperText from "@material-ui/core/FormHelperText";
import Dialog from "@material-ui/core/Dialog";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import MuiDialogActions from "@material-ui/core/DialogActions";
import { withStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";
import { connect } from "react-redux";
import * as UserAction from "../../Redux/Action/userAction";
import PropTypes from "prop-types";
import ToasterMessageComponent from "../common/toaster";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import UserService from "../../services/usersService";
import MasterService from "../../services/masterDataService";
import ButtonLoadderComponent from "../common/loadder/buttonloadder";
import ConfirmationDialog from "../common/EventualConsistency";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  paper: {
    position: "absolute",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: "0px solid #ffff !imortant",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  stepButtons: {
    display: "flex",
    justifyContent: "flex-end",
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: "100%",
    margin: 0,
  },
  backButton: {
    marginRight: theme.spacing(1),
  },
  errorSpanMsg: {
    color: "red",
  },
}));

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

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);

function UpdateCovidState(props) {
  const classes = useStyles();

  const usersApiCall = new UserService();
  const masterDataCallApi = new MasterService();

  const [SelectCovidState, setSelectCovidState] = useState();
  const [StateMasterData, setStateMasterData] = useState();
  const [covidstateFieldValidation, setcovidstateFieldValidation] =
    useState(false);
  const [componentLoadder, setcomponentLoadder] = useState(true);
  const [formData, SetformData] = useState({
    id: "",
    temperature: 0,
    temperatureUnit: "F",
    covidStateId: "",
  });
  const [resetformData, SetresetformData] = useState({
    id: "",
    temperature: 0,
    temperatureUnit: "F",
    covidStateId: "",
  });
  const [stateSnackbar, setStateSnackbar] = useState(false);
  const [UserSelectedCovidStateValue, setUserSelectedCovidStateValue] =
    useState();
  const [toasterMessage, setToasterMessage] = useState("");
  const [toasterServerity, settoasterServerity] = useState("");
  const [toasterErrorMessageType, settoasterErrorMessageType] =
    useState("array");
  const [showLoadder, setshowLoadder] = useState(false);
  const [showEventualLoadder, setshowEventualLoadder] = useState(false);
  const [ConfirmationModalActionType, setConfirmationModalActionType] =
    useState("");
  const [ConfirmationHeaderTittle, setConfirmationHeaderTittle] = useState("");
  const [ConfirmationDialogContextText, setConfirmationDialogContextText] =
    useState("");

  const [
    ConfirmationDialogContextTextNext,
    setConfirmationDialogContextTextNext,
  ] = useState("");
  const [openConfirmationModal, setOpenConfirmationModal] = useState(false);
  const [reloadPage, setReloadPage] = useState("NO");

  useEffect(() => {
    setcomponentLoadder(true);
    if (props.selectedUsersForCovidState.length > 0) {
      Promise.all([masterDataCallApi.getCOVIDStates()])
        .then(([covidStates]) => {
          setStateMasterData(covidStates);
        })
        .catch((error) => {
          console.log(error);
        });

      setcomponentLoadder(false);
    } else {
      if (props.SelectedRowId) {
        Promise.all([
          masterDataCallApi.getCOVIDStates(),
          usersApiCall.getCovidStateInfo(props.SelectedRowId),
        ])
          .then(([covidStates, getCovidInfo]) => {
            setStateMasterData(covidStates);
            if (getCovidInfo) {
              let data = {
                id: getCovidInfo.covidStateId,
                stateName: getCovidInfo.stateName,
              };
              setSelectCovidState(data);
              SetformData(getCovidInfo);
              setcomponentLoadder(false);
            } else {
              setcomponentLoadder(false);
            }
          })
          .catch((error) => {
            console.log(error);
          });
      }
    }
  }, [props]);
  //Method to close the popup modal
  const handleClose = () => {
    resetCovidStateFormData();
    props.setopenCovidStateInfoModal(false);
  };
  //Method for delay after update user covid state api is called
  const handleClickOpenEventualModal = () => {
    setOpenConfirmationModal(true);
    setConfirmationModalActionType("UserUpdatecovidstatesuccess");
    setConfirmationHeaderTittle("Success");
    setConfirmationDialogContextText(`Updated user's COVID state.`);
    setConfirmationDialogContextTextNext(
      `Click OK to continue working on the same page.`
    );
  };
  //Method to reset the covid state form
  function resetCovidStateFormData() {
    SetformData(resetformData);
  }
  //Method on change of covid state dropdown {value-covidstate name}
  function handleChangeUpdateCovidState(event, value) {
    setSelectCovidState(value);
  }
  //Method to before update bulk covid state for the users to validate
  function userCovidInfo() {
    if (!SelectCovidState) {
      setcovidstateFieldValidation(true);
      return false;
    } else {
      setcovidstateFieldValidation(false);
      submitUserCovidInformation();
    }
  }
  //Method to update bulk covid state for the users
  function submitUserCovidInformation() {
    setshowLoadder(true);
    settoasterServerity("");
    settoasterErrorMessageType("");
    var data = formData;
    if (props.selectedUsersForCovidState.length > 0) {
      let updateCOVIDStatusbyUsersList = [];
      props.selectedUsersForCovidState.map((user) => {
        updateCOVIDStatusbyUsersList.push({
          id: user.id,
          covidStateId: SelectCovidState.id,
        });
      });
      let sendData = {
        updateCOVIDStatusbyUsersList: updateCOVIDStatusbyUsersList,
      };
      usersApiCall
        .UpdateUserCovidStateBulk(sendData)
        .then((result) => {
          setStateSnackbar(true);
          setToasterMessage("Covid state update to the selected users");
          settoasterServerity("success");
          setTimeout(() => {
            props.setopenCovidStateInfoModal(false);
            props.setSelectedUsersForCovidState([]);
            props.setRowsSelected([]);
            props.setReloadPage("YES");
            resetCovidStateFormData();
            setshowLoadder(false);
            // window.location.reload();
          }, 6000);
        })
        .catch((err) => {
          console.log(err);
          setToasterMessage(err.data.errors);
          settoasterServerity("error");
          setStateSnackbar(true);
          setshowLoadder(false);
        });
    } else {
      data.id = props.SelectedRowId;
      data.covidStateId = SelectCovidState.id;
      usersApiCall
        .UpdateUserCovidState(data)
        .then((result) => {
          // setStateSnackbar(true);
          // setToasterMessage("Updated user's COVID state.");
          // settoasterServerity("success");
          // setTimeout(() => {
          //   props.setopenCovidStateInfoModal(false);
          //   resetCovidStateFormData();
          //   props.setReloadPage(true);
          //   setshowLoadder(false);
          // }, 6000);
          setTimeout(() => {
            props.setopenCovidStateInfoModal(false);
            resetCovidStateFormData();
            props.setReloadPage(true);
            setshowLoadder(false);
            handleClickOpenEventualModal();
            // setModalOpen(true);
          }, 6000);
        })
        .catch((err) => {
          console.log(err);
          setToasterMessage(err.data.errors);
          settoasterServerity("error");
          setStateSnackbar(true);
          setshowLoadder(false);
        });
    }
  }

  return (
    <div>
      <Dialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={props.openCovidStateInfoModal}
        className={`global-dialog covid-state-modal`}
      >
        <DialogTitle id="customized-dialog-title" onClose={handleClose}>
          Update covid state
        </DialogTitle>
        <ValidatorForm className={`global-form`} onSubmit={userCovidInfo}>
          <DialogContent dividers>
            {!componentLoadder ? (
              // <Grid container spacing={3}>
              //   <Grid item sm={12} container>
              //     <FormControl variant="outlined" fullWidth>
              //       <InputLabel
              //         id="demo-simple-select-outlined-label"
              //         shrink={false}
              //         className="select-label"
              //       >
              //         {formData.covidStateId == "" ? "Select covid state" : ""}
              //       </InputLabel>
              //       <Select
              //         labelId="demo-simple-select-outlined-label"
              //         id="demo-simple-select-outlined"
              //         placeholder="Select covid state"
              //         name="covidStateId"
              //         value={formData.covidStateId}
              //         onChange={handleChange}
              //         InputLabelProps={{ shrink: false }}
              //         className="global-input single-select"
              //       >
              //         <MenuItem value="">None</MenuItem>
              //         {StateMasterData && StateMasterData.length > 0
              //           ? StateMasterData.map((stateMasterData) => {
              //               return (
              //                 <MenuItem
              //                   value={stateMasterData.stateName}
              //                   key={stateMasterData.id + "covidstate"}
              //                 >
              //                   {stateMasterData.stateName}
              //                 </MenuItem>
              //               );
              //             })
              //           : ""}
              //       </Select>
              //     </FormControl>
              //     {covidstateFieldValidation ? (
              //       <FormHelperText className="error-message-select">
              //         Please select covid state{" "}
              //       </FormHelperText>
              //     ) : (
              //       ""
              //     )}
              //   </Grid>
              // </Grid>

              <Grid item sm={12}>
                <Autocomplete
                  id="tags-outlined"
                  options={
                    StateMasterData && StateMasterData.length > 0
                      ? StateMasterData
                      : []
                  }
                  getOptionLabel={(option) => option.stateName}
                  defaultValue={SelectCovidState ? SelectCovidState : ""}
                  onChange={handleChangeUpdateCovidState}
                  filterSelectedOptions
                  className="global-input autocomplete-select"
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      placeholder="Select covid state"
                    />
                  )}
                />
                {covidstateFieldValidation ? (
                  <FormHelperText className="error-msg">
                    Please select covid state{" "}
                  </FormHelperText>
                ) : (
                  ""
                )}
              </Grid>
            ) : null}
          </DialogContent>
          <DialogActions>
            <Button
              variant="contained"
              type="submit"
              className="global-submit-btn"
              disabled={showLoadder}
            >
              {showLoadder ? <ButtonLoadderComponent /> : "Submit"}
            </Button>
            <Button onClick={handleClose} className="global-cancel-btn">
              Cancel
            </Button>
          </DialogActions>
        </ValidatorForm>
      </Dialog>
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
        ConfirmationDialogContextTextNext={ConfirmationDialogContextTextNext}
        setOpenConfirmationModal={setOpenConfirmationModal}
        ConfirmationModalActionType={ConfirmationModalActionType}
        showEventualLoadder={showEventualLoadder}
        setshowEventualLoadder={setshowEventualLoadder}
        setcomponentLoadder={setcomponentLoadder}
        setReloadPage={props.setReloadPage}
      />
    </div>
  );
}
//Validate the data received from the props
UpdateCovidState.propTypes = {
  UserData: PropTypes.array.isRequired,
  LoadAllUser: PropTypes.func.isRequired,
  UpdateUser: PropTypes.func.isRequired,
};
//To update the redux store and merge into props component
function mapStateToProps(state, ownProps) {
  return {
    UserData: state.user,
  };
}
// Customizing the functions your component receives, and how they dispatch actions
const mapDispatchToProps = {
  LoadAllUser: UserAction.loadUser,
  UpdateUser: UserAction.UpdateUser,
};
//Connects a React component to a Redux store
export default connect(mapStateToProps, mapDispatchToProps)(UpdateCovidState);
