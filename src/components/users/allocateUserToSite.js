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

function AllocateUserToSite(props) {
  const usersApiCall = new UserService();
  const masterDataCallApi = new MasterService();
  const userGroupApiCall = new UserGroupService();

  const [BusinessTeamMasterData, setBusinessTeamMasterData] = useState();
  const [formFieldValidation, setformFieldValidation] = useState({
    site: false,
  });
  const [UserSelectedTeamValue, setUserSelectedTeamValue] = useState([]);
  const [componentLoadder, setcomponentLoadder] = useState(true);
  const [stateSnackbar, setStateSnackbar] = useState(false);
  const [toasterMessage, setToasterMessage] = useState("");
  const [toasterServerity, settoasterServerity] = useState("");
  const [buttonloadder, setbuttonloadder] = useState(false);
  const [toasterErrorMessageType, settoasterErrorMessageType] =
    useState("array");
  const [formData, SetformData] = useState({
    applicationUserId: "",
    sites: [],
  });
  const [resetComponent, setResetComponent] = useState("NO");

  useEffect(() => {
    setcomponentLoadder(true);
    setUserSelectedTeamValue(props.siteData[0]);
    Promise.all([masterDataCallApi.getSites()])
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
    props.setActiveCard("userSite");
    if (value) {
      setformFieldValidation((ValidationForm) => ({
        ...ValidationForm,
        ["site"]: false,
      }));
    } else {
      setformFieldValidation((ValidationForm) => ({
        ...ValidationForm,
        ["site"]: true,
      }));
    }
  }

  function cancelEdit() {
    props.setActiveCard("");
    setResetComponent("YES");
    setformFieldValidation({ site: false });
  }

  function SelectSiteValidation() {
    if (UserSelectedTeamValue) {
      setformFieldValidation((ValidationForm) => ({
        ...ValidationForm,
        ["site"]: false,
      }));
    } else {
      setformFieldValidation((ValidationForm) => ({
        ...ValidationForm,
        ["site"]: true,
      }));
    }
  }

  function UserSitesUpdate() {
    SelectSiteValidation();
    if (UserSelectedTeamValue) {
      UserSitesUpdateSubmit();
    } else {
      return false;
    }
  }

  function UserSitesUpdateSubmit() {
    setbuttonloadder(true);
    settoasterServerity("");
    settoasterErrorMessageType("");
    var data = formData;
    data.applicationUserId = props.applicationUserId;
    data.sites = [UserSelectedTeamValue];
    usersApiCall
      .UpdateSitesToUser(data)
      .then((result) => {
        setStateSnackbar(true);
        setToasterMessage("Sites assigned to users");
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
        <ValidatorForm className={`global-form`} onSubmit={UserSitesUpdate}>
          <CardContent>
            <Typography className="card-heading">
              {" "}
              <label className="required">Update Sites</label>
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
                    getOptionLabel={(option) => option.name}
                    defaultValue={UserSelectedTeamValue}
                    onChange={handleChangeTeam}
                    filterSelectedOptions
                    className="global-input autocomplete-select"
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        placeholder="Select site"
                      />
                    )}
                  />
                </Grid>
                {props.activeCard == "userSite" ? (
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

              {formFieldValidation.site ? (
                <FormHelperText className="error-msg">
                  Please select site{" "}
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

export default AllocateUserToSite;
