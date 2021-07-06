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

function AllocateUserToSecondaryGroup(props) {
  const usersApiCall = new UserService();
  const masterDataCallApi = new MasterService();
  const userGroupApiCall = new UserGroupService();

  const [BusinessTeamMasterData, setBusinessTeamMasterData] = useState();
  const [formFieldValidation, setformFieldValidation] = useState({
    group: false,
  });
  const [UserSelectedSecondaryGroupValue, setUserSelectedSecondaryGroupValue] =
    useState([]);
  const [componentLoadder, setcomponentLoadder] = useState(true);
  const [stateSnackbar, setStateSnackbar] = useState(false);
  const [toasterMessage, setToasterMessage] = useState("");
  const [toasterServerity, settoasterServerity] = useState("");
  const [buttonloadder, setbuttonloadder] = useState(false);
  const [toasterErrorMessageType, settoasterErrorMessageType] =
    useState("array");

  const [formData, SetformData] = useState({
    isPrimary: false,
    applicationUserId: "",
    groups: [],
  });
  const [resetComponent, setResetComponent] = useState("NO");

  useEffect(() => {
    setcomponentLoadder(true);
    setUserSelectedSecondaryGroupValue(props.secondaryGroup);
    Promise.all([userGroupApiCall.loadUserGroup()])
      .then(([getTeams]) => {
        let primaryGroup = props.applicationUserData.group;
        if (primaryGroup) {
          let filteredSGroupData = getTeams.filter((sgroup) => {
            return sgroup.id != primaryGroup.id;
          });
          setBusinessTeamMasterData(filteredSGroupData);
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
    setUserSelectedSecondaryGroupValue(value);
    props.setActiveCard("secondaryGroup");
    if (value) {
      setformFieldValidation((ValidationForm) => ({
        ...ValidationForm,
        ["group"]: false,
      }));
    } else {
      setformFieldValidation((ValidationForm) => ({
        ...ValidationForm,
        ["group"]: true,
      }));
    }
  }

  function cancelEdit() {
    props.setActiveCard("");
    setResetComponent("YES");
  }

  function SelectGroupValidation() {
    if (UserSelectedSecondaryGroupValue.length > 0) {
      setformFieldValidation((ValidationForm) => ({
        ...ValidationForm,
        ["group"]: false,
      }));
    } else {
      setformFieldValidation((ValidationForm) => ({
        ...ValidationForm,
        ["group"]: true,
      }));
    }
  }

  function UserSecondaryGroup() {
    SelectGroupValidation();
    if (UserSelectedSecondaryGroupValue.length > 0) {
      UserSecondaryGroupSubmit();
    } else {
      return false;
    }
  }

  function UserSecondaryGroupSubmit() {
    setbuttonloadder(true);
    settoasterServerity("");
    settoasterErrorMessageType("");
    var data = formData;
    data.applicationUserId = props.applicationUserId;
    data.groups = UserSelectedSecondaryGroupValue;
    usersApiCall
      .UpdateApplicationUserSecondaryGroup(data)
      .then((result) => {
        setStateSnackbar(true);
        setToasterMessage("Secondary group assigned to users");
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
        <ValidatorForm className={`global-form`} onSubmit={UserSecondaryGroup}>
          <CardContent>
            <Typography className="card-heading">
              <label className="">Update Secondary Group</label>
            </Typography>
            <div className="card-form">
              <Grid container spacing={3}>
                <Grid item sm={9}>
                  <Autocomplete
                    multiple
                    id="tags-outlined"
                    options={
                      BusinessTeamMasterData &&
                      BusinessTeamMasterData.length > 0
                        ? BusinessTeamMasterData
                        : []
                    }
                    getOptionLabel={(option) => option.groupName}
                    defaultValue={BusinessTeamMasterData.filter((group) => {
                      return UserSelectedSecondaryGroupValue.find(
                        (selectedGroup) => {
                          return selectedGroup.id == group.id;
                        }
                      );
                    })}
                    onChange={handleChangeTeam}
                    filterSelectedOptions
                    className="global-input autocomplete-select"
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        placeholder="Select secondary group"
                      />
                    )}
                  />
                </Grid>
                {props.activeCard == "secondaryGroup" ? (
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

              {formFieldValidation.group ? (
                <FormHelperText className="error-msg">
                  Please select group{" "}
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

export default AllocateUserToSecondaryGroup;
