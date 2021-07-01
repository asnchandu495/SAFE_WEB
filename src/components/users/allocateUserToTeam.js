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

function AllocateUserToTeam(props) {
  const usersApiCall = new UserService();
  const masterDataCallApi = new MasterService();
  const userGroupApiCall = new UserGroupService();

  const [BusinessTeamMasterData, setBusinessTeamMasterData] = useState();
  const [formFieldValidation, setformFieldValidation] = useState({
    team: false,
  });
  const [UserSelectedTeamValue, setUserSelectedTeamValue] = useState([]);
  const [stateSnackbar, setStateSnackbar] = useState(false);
  const [toasterMessage, setToasterMessage] = useState("");
  const [toasterServerity, settoasterServerity] = useState("");
  const [componentLoadder, setcomponentLoadder] = useState(true);
  const [buttonloadder, setbuttonloadder] = useState(false);
  const [toasterErrorMessageType, settoasterErrorMessageType] =
    useState("array");
  const [formData, SetformData] = useState({
    applicationUserId: "",
    applicationUserToTeamMapping: [],
  });
  const [resetComponent, setResetComponent] = useState("NO");
  useEffect(() => {
    setcomponentLoadder(true);
    setUserSelectedTeamValue(props.siteTeamData[0]);
    Promise.all([masterDataCallApi.getTeams()])
      .then(([getTeams]) => {
        setBusinessTeamMasterData(getTeams);
        setResetComponent("NO");
        setcomponentLoadder(false);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [resetComponent]);

  function handleChangeTeam(event, value) {
    setUserSelectedTeamValue(value);
    props.setActiveCard("userTeam");
    if (value) {
      setformFieldValidation((ValidationForm) => ({
        ...ValidationForm,
        ["team"]: false,
      }));
    } else {
      setformFieldValidation((ValidationForm) => ({
        ...ValidationForm,
        ["team"]: true,
      }));
    }
  }

  function SelectTeamValidation() {
    if (UserSelectedTeamValue) {
      setformFieldValidation((ValidationForm) => ({
        ...ValidationForm,
        ["team"]: false,
      }));
    } else {
      setformFieldValidation((ValidationForm) => ({
        ...ValidationForm,
        ["team"]: true,
      }));
    }
  }

  // function cancelEdit() {
  //   setcomponentLoadder(true);
  //   console.log(props.siteTeamData);
  //   setUserSelectedTeamValue(props.siteTeamData);
  //   setcomponentLoadder(false);
  //   props.setActiveCard("");
  // }
  function UserTeamUpdate() {
    SelectTeamValidation();
    if (UserSelectedTeamValue) {
      UserTeamUpdateSubmit();
    } else {
      return false;
    }
  }

  function UserTeamUpdateSubmit() {
    setbuttonloadder(true);
    settoasterServerity("");
    settoasterErrorMessageType("");
    var data = formData;
    data.applicationUserId = props.applicationUserId;
    data.applicationUserToTeamMapping = [UserSelectedTeamValue];
    usersApiCall
      .UpdateApplicationUserTeam(data)
      .then((result) => {
        setStateSnackbar(true);
        setToasterMessage("Teams assigned to users");
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

  function cancelEdit() {
    props.setActiveCard("");
    setResetComponent("YES");
  }

  return (
    <Card className="user-update-details-card">
      {!componentLoadder ? (
        <ValidatorForm className={`global-form`} onSubmit={UserTeamUpdate}>
          <CardContent>
            <Typography className="card-heading">Update Teams</Typography>
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
                    getOptionLabel={(option) => option.name}
                    defaultValue={UserSelectedTeamValue}
                    onChange={handleChangeTeam}
                    filterSelectedOptions
                    className="global-input autocomplete-select"
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        placeholder="Select user team"
                      />
                    )}
                  />
                </Grid>
                {props.activeCard == "userTeam" ? (
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

              {formFieldValidation.team ? (
                <FormHelperText className="error-msg">
                  Please select team{" "}
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

export default AllocateUserToTeam;
