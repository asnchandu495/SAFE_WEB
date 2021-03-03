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

function AllocateUserToPrimaryGroup(props) {
  const usersApiCall = new UserService();
  const masterDataCallApi = new MasterService();
  const userGroupApiCall = new UserGroupService();

  const [BusinessTeamMasterData, setBusinessTeamMasterData] = useState();
  const [formFieldValidation, setformFieldValidation] = useState(false);
  const [UserSelectedTeamValue, setUserSelectedTeamValue] = useState([]);
  const [stateSnackbar, setStateSnackbar] = useState(false);
  const [toasterMessage, setToasterMessage] = useState("");
  const [toasterServerity, settoasterServerity] = useState("");
  const [toasterErrorMessageType, settoasterErrorMessageType] = useState(
    "array"
  );

  const [formData, SetformData] = useState({
    applactionUserToTeamMaping: [],
  });

  useEffect(() => {
    Promise.all([userGroupApiCall.loadUserGroup()])
      .then(([getTeams]) => {
        setBusinessTeamMasterData(getTeams);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  function handleChangeTeam(event, value) {
    console.log(event);
    console.log(value);
    // setUserSelectedTeamValue(value);
  }

  function UserPrimaryGroup(e) {
    // console.log(formData);
    // var data = formData;
    // data.applicationUserId = props.userData.id;
    // data.applicationUserToRoleMapping = UserSelectedTeamValue;
    // console.log(data);
    // console.log(UserSelectedTeamValue);
    // usersApiCall
    //   .UpdateApplicationUserPrimaryGroup(data)
    //   .then((result) => {
    //     console.log(result);
    //     setStateSnackbar(true);
    //     setToasterMessage("Primary group assigned to users");
    //     settoasterServerity("success");
    //   })
    //   .catch((err) => {
    //     setToasterMessage(err.data.errors);
    //     settoasterServerity("error");
    //     setStateSnackbar(true);
    //   });
  }

  return (
    <Card className="user-update-details-card">
      <ValidatorForm className={`global-form`} onSubmit={UserPrimaryGroup}>
        <CardContent>
          <Typography className="card-heading">Update Primary Group</Typography>
          <div className="card-form">
            <Grid container spacing={3}>
              <Grid item sm={9}>
                <Autocomplete
                  id="tags-outlined"
                  options={
                    BusinessTeamMasterData && BusinessTeamMasterData.length > 0
                      ? BusinessTeamMasterData
                      : []
                  }
                  getOptionLabel={(option) => option.groupName}
                  defaultValue={UserSelectedTeamValue}
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
                Please select team{" "}
              </FormHelperText>
            ) : (
              ""
            )}
          </div>
        </CardContent>
      </ValidatorForm>
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
