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

function AllocateUserToSupervisor(props) {
  const usersApiCall = new UserService();
  const masterDataCallApi = new MasterService();
  const userGroupApiCall = new UserGroupService();

  const [AllSupervisorRole, setAllSupervisorRole] = useState();
  const [formFieldValidation, setformFieldValidation] = useState({
    supervisor: false,
  });
  const [UserSelectSupervisorData, setUserSelectSupervisorData] = useState([]);
  const [componentLoadder, setcomponentLoadder] = useState(true);
  const [stateSnackbar, setStateSnackbar] = useState(false);
  const [toasterMessage, setToasterMessage] = useState("");
  const [toasterServerity, settoasterServerity] = useState("");
  const [buttonloadder, setbuttonloadder] = useState(false);
  const [toasterErrorMessageType, settoasterErrorMessageType] =
    useState("array");

  const [formData, SetformData] = useState({
    applicationUserSupervisorId: "",
    applicationUserId: "",
  });

  const [resetComponent, setResetComponent] = useState("NO");

  useEffect(() => {
    setcomponentLoadder(true);
    Promise.all([masterDataCallApi.getAllSuperVisor()])
      .then(([getAllSuperVisor]) => {
        setAllSupervisorRole(getAllSuperVisor);
        setUserSelectSupervisorData({
          applicationUserId: props.applicationUserData.supervisorId,
          name: props.applicationUserData.supervisor,
        });
        setResetComponent("NO");
        setcomponentLoadder(false);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [resetComponent]);

  function handleChangeSupervisor(event, value) {
    setUserSelectSupervisorData(value);
    props.setActiveCard("supervisor");
    if (value) {
      setformFieldValidation((ValidationForm) => ({
        ...ValidationForm,
        ["supervisor"]: false,
      }));
    } else {
      setformFieldValidation((ValidationForm) => ({
        ...ValidationForm,
        ["supervisor"]: true,
      }));
    }
  }

  function SelecSupervisorValidation() {
    if (UserSelectSupervisorData) {
      setformFieldValidation((ValidationForm) => ({
        ...ValidationForm,
        ["supervisor"]: false,
      }));
    } else {
      setformFieldValidation((ValidationForm) => ({
        ...ValidationForm,
        ["supervisor"]: true,
      }));
    }
  }

  function cancelEdit() {
    props.setActiveCard("");
    setResetComponent("YES");
    setformFieldValidation({ supervisor: false });
  }
  function UserSupervisor() {
    SelecSupervisorValidation();
    if (UserSelectSupervisorData) {
      UserSupervisorSubmit();
    } else {
      return false;
    }
  }

  function UserSupervisorSubmit() {
    setbuttonloadder(true);
    settoasterServerity("");
    settoasterErrorMessageType("");
    var data = formData;
    data.applicationUserId = props.applicationUserId;
    data.applicationUserSupervisorId =
      UserSelectSupervisorData.applicationUserId;
    usersApiCall
      .UpdateApplicationUserSupervisor(data)
      .then((result) => {
        setStateSnackbar(true);
        setToasterMessage("Supervisor is updated to the user");
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
      {!componentLoadder ? (
        <ValidatorForm className={`global-form`} onSubmit={UserSupervisor}>
          <CardContent>
            <Typography className="card-heading">Update Supervisor</Typography>
            <div className="card-form">
              <Grid container spacing={3}>
                <Grid item sm={9}>
                  <Autocomplete
                    id="tags-outlined"
                    options={
                      AllSupervisorRole && AllSupervisorRole.length > 0
                        ? AllSupervisorRole
                        : []
                    }
                    getOptionLabel={(option) => option.name}
                    defaultValue={UserSelectSupervisorData}
                    onChange={handleChangeSupervisor}
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
                {props.activeCard == "supervisor" ? (
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

              {formFieldValidation.supervisor ? (
                <FormHelperText className="error-msg">
                  Please select supervisor{" "}
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

export default AllocateUserToSupervisor;
