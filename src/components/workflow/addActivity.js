import React, { Fragment, useEffect, useState } from "react";
import Grid from "@material-ui/core/Grid";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import { Link as LinkTo } from "react-router-dom";
import MUIDataTable from "mui-datatables";
import PropTypes from "prop-types";
import Button from "@material-ui/core/Button";
import Tooltip from "@material-ui/core/Tooltip";
import DeleteIcon from "@material-ui/icons/Delete";
import AddIcon from "@material-ui/icons/Add";
import UserGroupService from "../../services/userGroupService";
import Dialog from "@material-ui/core/Dialog";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import DialogContent from "@material-ui/core/DialogContent";
import ComponentLoadderComponent from "../common/loadder/componentloadder";
import ButtonLoadderComponent from "../common/loadder/buttonloadder";
import ToasterMessageComponent from "../common/toaster";
import { withStyles } from "@material-ui/core/styles";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogActions from "@material-ui/core/DialogActions";
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import { makeStyles } from "@material-ui/core/styles";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import ConfirmationDialog from "../common/confirmdialogbox";
import workflowService from "../../services/workflowService";
import FormHelperText from "@material-ui/core/FormHelperText";

function AddActivity(props) {
  const UserGroup = new UserGroupService();
  const [formFieldValidation, setformFieldValidation] = useState({
    addactivity: false,
  });
  const workflowApiCall = new workflowService();
  const workflowId = props.match.params.wid;
  const [userGroupList, setuserGroupList] = useState();
  const [Modalopen, setModalOpen] = useState(false);
  const [showLoadder, setshowLoadder] = useState(false);
  const [allActivities, setAllActivities] = useState([]);
  const [selectedActivities, setSelectedActivities] = useState([]);
  const [workflowDetails, setWorkflowDetails] = useState([]);
  const [componentLoadder, setComponentLoadder] = useState(true);
  const [userSelectedActivities, setUserSelectedActivities] = useState([]);
  const [oldUserSelectedActivities, setOldUserSelectedActivities] = useState(
    []
  );
  const [formData, setFormData] = useState({
    aimWorkflowId: props.match.params.wid,
    selectedWorkflowActivities: [],
  });
  const [SelectedRowDetails, setSelectedRowDetails] = useState([]);
  const [openConfirmationModal, setOpenConfirmationModal] = useState(false);
  const [ConfirmationDialogContextText, setConfirmationDialogContextText] =
    useState("");
  const [ConfirmationModalActionType, setConfirmationModalActionType] =
    useState("");
  const [ConfirmationHeaderTittle, setConfirmationHeaderTittle] = useState("");
  const [stateSnackbar, setStateSnackbar] = useState(false);
  const [toasterMessage, setToasterMessage] = useState("");
  const [toasterServerity, settoasterServerity] = useState("");
  const [toasterErrorMessageType, settoasterErrorMessageType] =
    useState("array");
  const [reloadPage, setReloadPage] = useState("NO");

  useEffect(() => {
    setComponentLoadder(true);
    Promise.all([
      workflowApiCall.getWorkflowDetails(workflowId),
      workflowApiCall.getMasterActivities(),
    ])
      .then(([workflowDetails, getAllActivities]) => {
        setWorkflowDetails(workflowDetails);
        setSelectedActivities(workflowDetails.selectedWorkflowActivities);
        setUserSelectedActivities(workflowDetails.selectedWorkflowActivities);
        setOldUserSelectedActivities(
          workflowDetails.selectedWorkflowActivities
        );
        let newActivities = getAllActivities.filter(
          (elem) =>
            !workflowDetails.selectedWorkflowActivities.find(
              ({ uniqueActivityId }) =>
                elem.uniqueActivityId == uniqueActivityId
            ) && elem
        );
        setAllActivities(newActivities);
        setComponentLoadder(false);
        setReloadPage("NO");
      })
      .catch((error) => {
        console.log(error);
      });
  }, [reloadPage]);

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

  const DialogActions = withStyles((theme) => ({
    root: {
      margin: 0,
      padding: theme.spacing(1),
    },
  }))(MuiDialogActions);

  const columns = [
    {
      name: "id",
      label: "Id",
      options: {
        display: "excluded",
        print: false,
        filter: false,
      },
    },
    {
      name: "name",
      label: "Activity Name ",
      options: {
        filter: false,
        sort: true,
      },
    },
    {
      name: "uniqueActivityId",
      label: "uniqueActivityId",
      options: {
        display: "excluded",
        print: false,
        filter: false,
      },
    },
    {
      label: "Action",
      name: "",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value, tableMeta, updateValue) => {
          var thisRowData = tableMeta.rowData;
          if (thisRowData) {
            return (
              <div className={`action-buttons-container`}>
                <Tooltip title="Assign Options To Activity">
                  <Button
                    variant="contained"
                    color="default"
                    startIcon={<AddIcon />}
                    className={`edit-icon`}
                    onClick={() => handleaddOptions(thisRowData)}
                  ></Button>
                </Tooltip>

                <Tooltip title="Revoke Activity">
                  <Button
                    variant="contained"
                    color="default"
                    startIcon={<DeleteIcon />}
                    className={`delete-icon`}
                    onClick={() =>
                      handleClickOpenConfirmationModal(thisRowData)
                    }
                  ></Button>
                </Tooltip>
              </div>
            );
          }
        },

        setCellProps: (value) => {
          return {
            style: { width: "250px", minWidth: "250px", textAlign: "center" },
          };
        },
      },
    },
  ];

  const options = {
    filter: false,
    filterType: "dropdown",
    responsive: "scroll",
    fixedHeader: true,
    rowsPerPageOptions: [5, 10, 15, 100],
    rowsPerPage: 5,
    print: false,
    viewColumns: false,
    download: false,
    selectableRows: false,
    textLabels: {
      body: {
        noMatch: "There are no activities",
      },
    },
  };

  function BreadcrumbNavigation(getRoute) {
    props.history.push(getRoute);
  }

  const handleClickOpenModal = () => {
    setModalOpen(true);
  };

  const handleClose = () => {
    setModalOpen(false);
  };

  function handleaddOptions(value) {
    let uActivityId = value[2];
    let activityId = value[0];
    props.history.push(
      `/workflow/${workflowId}/${activityId}/${uActivityId}/actions`
    );
  }

  function userSelectActivity(event, value) {
    setUserSelectedActivities(value);
    if (value) {
      setformFieldValidation((ValidationForm) => ({
        ...ValidationForm,
        ["addactivity"]: false,
      }));
    } else {
      setformFieldValidation((ValidationForm) => ({
        ...ValidationForm,
        ["addactivity"]: true,
      }));
    }
  }

  const handleClickOpenConfirmationModal = (value) => {
    setSelectedRowDetails(value);
    setOpenConfirmationModal(true);
    setConfirmationModalActionType("DeleteActivity");
    setConfirmationHeaderTittle("Delete Activity");
    setConfirmationDialogContextText(
      `Are you sure you want to delete ${value[1]} ?`
    );
  };

  function validateAddActivity() {
    let defaultSelectedValue = allActivities.filter((act) => {
      return userSelectedActivities.find((sact) => {
        return sact.uniqueActivityId == act.uniqueActivityId;
      });
    });
    if (defaultSelectedValue.length > 0) {
      setformFieldValidation((ValidationForm) => ({
        ...ValidationForm,
        ["addactivity"]: false,
      }));
    } else {
      setformFieldValidation((ValidationForm) => ({
        ...ValidationForm,
        ["addactivity"]: true,
      }));
    }
  }

  function submitActivityForm() {
    validateAddActivity();
    let defaultSelectedValue = allActivities.filter((act) => {
      return userSelectedActivities.find((sact) => {
        return sact.uniqueActivityId == act.uniqueActivityId;
      });
    });
    if (defaultSelectedValue.length > 0) {
      submitActivityForm1();
    } else {
      return false;
    }
  }

  function submitActivityForm1() {
    // e.preventDefault();
    if (userSelectedActivities.length > 0) {
      let selectedWorkflowActivities = userSelectedActivities.map((act) => ({
        id: act.id ? act.id : "",
        uniqueActivityId: act.uniqueActivityId,
        name: act.name,
        isDelete: false,
      }));

      formData.selectedWorkflowActivities = selectedWorkflowActivities;
      setshowLoadder(true);
      workflowApiCall
        .UpdateActivities(formData)
        .then((result) => {
          setStateSnackbar(true);
          setToasterMessage("Updated workflow activities.");
          settoasterServerity("success");
          setTimeout(() => {
            setshowLoadder(false);
            setReloadPage("YES");
            setModalOpen(false);
          }, 6000);
        })
        .catch((err) => {
          setToasterMessage(err.data.errors);
          settoasterServerity("error");
          setStateSnackbar(true);
          setshowLoadder(false);
        });
    }
  }

  return (
    <div className="innerpage-container">
      <Dialog
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
        open={Modalopen}
        className="modal-min-widtn"
      >
        <DialogTitle id="form-dialog-title" onClose={handleClose}>
          Assign Activity
        </DialogTitle>
        <ValidatorForm className={`global-form`} onSubmit={submitActivityForm}>
          <DialogContent dividers>
            <Grid container spacing={3}>
              <Grid item sm={12} container>
                <Autocomplete
                  fullWidth
                  multiple
                  id="tags-outlined"
                  options={
                    allActivities && allActivities.length > 0
                      ? allActivities
                      : []
                  }
                  getOptionLabel={(option) => option.friendlyName}
                  defaultValue={allActivities.filter((act) => {
                    return userSelectedActivities.find((sact) => {
                      return sact.uniqueActivityId == act.uniqueActivityId;
                    });
                  })}
                  onChange={userSelectActivity}
                  filterSelectedOptions
                  className="global-input autocomplete-select"
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      placeholder="Select activities"
                    />
                  )}
                />
                {formFieldValidation.addactivity ? (
                  <FormHelperText className="error-msg">
                    Please select activity
                  </FormHelperText>
                ) : (
                  ""
                )}
              </Grid>
            </Grid>
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
      <Breadcrumbs aria-label="breadcrumb" className="global-breadcrumb">
        <LinkTo
          color="inherit"
          href="#"
          to={`/home/dashboard`}
          className="inactive"
        >
          Home
        </LinkTo>
        <LinkTo
          color="textPrimary"
          href="#"
          to={`/workflow/allWorkflow`}
          className="inactive"
        >
          Workflow
        </LinkTo>
        <LinkTo
          color="textPrimary"
          href="#"
          to={`/workflow/view-workflow/${workflowId}`}
          className="inactive"
        >
          {workflowDetails ? workflowDetails.workFlowName : ""}
        </LinkTo>
        <LinkTo color="textPrimary" href="#" className="active">
          Activities
        </LinkTo>
      </Breadcrumbs>
      {!componentLoadder ? (
        <>
          <Grid
            container
            spacing={3}
            className="add-activity-section global-form"
          >
            <Grid item xs={2}>
              <div className={`form-buttons-container`}>
                <Button
                  variant="contained"
                  type="button"
                  className="global-submit-btn global-filter-btn"
                  onClick={handleClickOpenModal}
                >
                  ADD ACTIVITY
                </Button>
              </div>
            </Grid>
          </Grid>
          <MUIDataTable
            title={""}
            data={
              selectedActivities && selectedActivities.length > 0
                ? selectedActivities
                : []
            }
            columns={columns}
            options={options}
            className="global-table"
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
            SelectedRowDetails={SelectedRowDetails}
            setReloadPage={setReloadPage}
          />
          <ToasterMessageComponent
            stateSnackbar={stateSnackbar}
            setStateSnackbar={setStateSnackbar}
            toasterMessage={toasterMessage}
            toasterServerity={toasterServerity}
            toasterErrorMessageType={toasterErrorMessageType}
          />
        </>
      ) : (
        <ComponentLoadderComponent></ComponentLoadderComponent>
      )}
    </div>
  );
}

export default AddActivity;
