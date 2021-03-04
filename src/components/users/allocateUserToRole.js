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

function AllocateUserToRole(props) {
  const usersApiCall = new UserService();
  const masterDataCallApi = new MasterService();
  const userGroupApiCall = new UserGroupService();

  const [BusinessUserRolesData, setBusinessUserRolesData] = useState();
  const [formFieldValidation, setformFieldValidation] = useState(false);
  const [UserSelectedRoleValue, setUserSelectedRoleValue] = useState([]);
  const [stateSnackbar, setStateSnackbar] = useState(false);
  const [toasterMessage, setToasterMessage] = useState("");
  const [toasterServerity, settoasterServerity] = useState("");
  const [componentLoadder, setcomponentLoadder] = useState(true);
  const [toasterErrorMessageType, settoasterErrorMessageType] = useState(
    "array"
  );

  const [formData, SetformData] = useState({
    applicationUserId: "",
    applicationUserToRoleMapping: [],
  });

  useEffect(() => {
    setcomponentLoadder(true);
    setUserSelectedRoleValue(props.siteRoleData);
    Promise.all([masterDataCallApi.getUserRoles()])
      .then(([getUserRoles]) => {
        setBusinessUserRolesData(getUserRoles);
        setcomponentLoadder(false);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  function handleChangeTeam(event, value) {
    setUserSelectedRoleValue(value);
  }

  function UserRoleUpdate(e) {
    console.log(formData);
    var data = formData;
    data.applicationUserId = props.userData.id;
    data.applicationUserToRoleMapping = UserSelectedRoleValue;
    console.log(data);
    console.log(UserSelectedRoleValue);
    usersApiCall
      .UpdateApplicationUserRole(data)
      .then((result) => {
        console.log(result);
        setStateSnackbar(true);
        setToasterMessage("Roles assigned to users");
        settoasterServerity("success");
      })
      .catch((err) => {
        setToasterMessage(err.data.errors);
        settoasterServerity("error");
        setStateSnackbar(true);
      });
  }


  return (
    <Card className="user-update-details-card">
      {!componentLoadder ? (
        <ValidatorForm className={`global-form`} onSubmit={UserRoleUpdate}>
          <CardContent>
            <Typography className="card-heading">Update Roles</Typography>
            <div className="card-form">
              <Grid container spacing={3}>
                <Grid item sm={9}>
                  <Autocomplete
                    multiple
                    id="tags-outlined"
                    options={
                      BusinessUserRolesData && BusinessUserRolesData.length > 0
                        ? BusinessUserRolesData
                        : []
                    }
                    getOptionLabel={(option) => option.description}
                    defaultValue={UserSelectedRoleValue}
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
                  >
                    <CheckIcon />
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    type="button"
                    size="small"
                    className="inlne-action-btns cancel-icon"
                  >
                    <CloseIcon />
                  </Button>
                </Grid>
              </Grid>

              {formFieldValidation.Team ? (
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
