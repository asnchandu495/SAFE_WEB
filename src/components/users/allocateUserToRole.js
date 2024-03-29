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

var value = [
  {
    id: "Supervisor",
    // description: "Supervisor",
  },
];

function AllocateUserToRole(props) {
  const usersApiCall = new UserService();
  const masterDataCallApi = new MasterService();
  const userGroupApiCall = new UserGroupService();

  const [BusinessUserRolesData, setBusinessUserRolesData] = useState();
  const [formFieldValidation, setformFieldValidation] = useState({
    role: false,
  });
  const [UserSelectedRoleValue, setUserSelectedRoleValue] = useState([]);
  const [stateSnackbar, setStateSnackbar] = useState(false);
  const [toasterMessage, setToasterMessage] = useState("");
  const [toasterServerity, settoasterServerity] = useState("");
  const [componentLoadder, setcomponentLoadder] = useState(true);
  const [buttonloadder, setbuttonloadder] = useState(false);
  const [toasterErrorMessageType, settoasterErrorMessageType] =
    useState("array");

  const [formData, SetformData] = useState({
    applicationUserId: "",
    applicationUserToRoleMapping: [],
  });
  const [resetComponent, setResetComponent] = useState("NO");
  useEffect(() => {
    setcomponentLoadder(true);
    setUserSelectedRoleValue(props.siteRoleData);
    Promise.all([masterDataCallApi.getUserRoles()])
      .then(([getUserRoles]) => {
        setBusinessUserRolesData(getUserRoles);
        setResetComponent("NO");
        setcomponentLoadder(false);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [resetComponent]);

  //Method on change of select user roles dropdown value -name of the role
  function handleChangeTeam(event, value) {
    setUserSelectedRoleValue(value);
    props.setActiveCard("userRole");
    if (value) {
      setformFieldValidation((ValidationForm) => ({
        ...ValidationForm,
        ["role"]: false,
      }));
    } else {
      setformFieldValidation((ValidationForm) => ({
        ...ValidationForm,
        ["role"]: true,
      }));
    }
  }
  //Method to validate the form feild after submit
  function SelectRoleValidation() {
    if (UserSelectedRoleValue.length > 0) {
      setformFieldValidation((ValidationForm) => ({
        ...ValidationForm,
        ["role"]: false,
      }));
    } else {
      setformFieldValidation((ValidationForm) => ({
        ...ValidationForm,
        ["role"]: true,
      }));
    }
  }
  //Method to cancel the values inside text feild and reset the card
  function cancelEdit() {
    props.setActiveCard("");
    setResetComponent("YES");
  }

  //Method after update role forn submit to validate if the text feild isnt empty
  function UserRoleUpdate() {
    SelectRoleValidation();
    if (UserSelectedRoleValue.length > 0) {
      UserRoleUpdateSubmit();
    } else {
      return false;
    }
  }

  //Method if the role feild isn't empty call the api on submit
  function UserRoleUpdateSubmit() {
    setbuttonloadder(true);
    settoasterServerity("");
    settoasterErrorMessageType("");
    var data = formData;
    data.applicationUserId = props.applicationUserId;
    data.applicationUserToRoleMapping = UserSelectedRoleValue;
    usersApiCall
      .UpdateApplicationUserRole(data)
      .then((result) => {
        setStateSnackbar(true);
        setToasterMessage("Roles assigned to users");
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
  //Update Roles card
  return (
    <Card className="user-update-details-card">
      {!componentLoadder ? (
        <ValidatorForm className={`global-form`} onSubmit={UserRoleUpdate}>
          <CardContent>
            <Typography className="card-heading">
              {" "}
              <label className="required">Update Roles</label>
            </Typography>
            <div className="card-form">
              <Grid container spacing={3}>
                <Grid item sm={9}>
                  <Autocomplete
                    multiple
                    id="tags-outlinedRole"
                    options={
                      BusinessUserRolesData && BusinessUserRolesData.length > 0
                        ? BusinessUserRolesData
                        : []
                    }
                    getOptionLabel={(option) => option.description}
                    defaultValue={BusinessUserRolesData.filter((role) => {
                      return UserSelectedRoleValue.find((selectedRole) => {
                        return selectedRole.id == role.id;
                      });
                    })}
                    onChange={handleChangeTeam}
                    filterSelectedOptions
                    className="global-input autocomplete-select"
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        placeholder="Select user role"
                      />
                    )}
                  />
                </Grid>
                {props.activeCard == "userRole" ? (
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

              {formFieldValidation.role ? (
                <FormHelperText className="error-msg">
                  Please select roles{" "}
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

export default AllocateUserToRole;
