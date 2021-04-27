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

function AddActivity(props) {
  const UserGroup = new UserGroupService();
  const workflowId = props.match.params.wid;
  const [userGroupList, setuserGroupList] = useState();
  const [componentLoadder, setComponentLoadder] = useState(true);
  const [Modalopen, setModalOpen] = useState(false);
  const [showLoadder, setshowLoadder] = useState(false);
  const userStatusData = [
    { id: true, name: "Active" },
    { id: false, name: "Inactive" },
  ];
  const [answersToSelect, setAnswersToSelect] = useState([
    { id: "001", name: "Send  Email" },
    { id: "002", name: "Send in-app notification" },
    { id: "003", name: "Send push notification" },
    { id: "004", name: "Contact Tracing-RLAP" },
    { id: "005", name: "Contact Tracing-BLE" },
  ]);
  const [selectedActivities, setSelectedActivities] = useState([
    { id: "001", name: "Send  Email" },
    { id: "002", name: "Send in-app notification" },
    { id: "003", name: "Send push notification" },
  ]);

  useEffect(() => {
    UserGroup.loadUserGroup()
      .then((getUsergrouplist) => {
        setuserGroupList(getUsergrouplist);
        setComponentLoadder(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

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
                <Tooltip title="Add Options To Activity">
                  <Button
                    variant="contained"
                    color="default"
                    startIcon={<AddIcon />}
                    className={`edit-icon`}
                    onClick={() => handleaddOptions(thisRowData)}
                  ></Button>
                </Tooltip>

                <Tooltip title="Delete">
                  <Button
                    variant="contained"
                    color="default"
                    startIcon={<DeleteIcon />}
                    className={`delete-icon`}
                    onClick="#"
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

  let data = [["Send Email"], ["Contact Tracing-Pin Micro"]];

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
    let activityId = value[0];
    props.history.push(`/workflow/${workflowId}/${activityId}/actions`);
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
          Add Activity
        </DialogTitle>
        <ValidatorForm className={`global-form`} onSubmit="#">
          <DialogContent dividers>
            {!componentLoadder ? (
              <Grid container spacing={3}>
                <Grid item sm={12} container>
                  <Autocomplete
                    fullWidth
                    multiple
                    id="tags-outlined"
                    options={
                      answersToSelect && answersToSelect.length > 0
                        ? answersToSelect
                        : []
                    }
                    getOptionLabel={(option) => option.name}
                    // defaultValue={SiteMasterData}
                    // onChange={userSelectSite}
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
                  {""}
                </Grid>
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
      <Breadcrumbs aria-label="breadcrumb" className="global-breadcrumb">
        <LinkTo
          color="inherit"
          href="#"
          to={`/home/dashboard`}
          className="inactive"
        >
          Home
        </LinkTo>
        <LinkTo color="textPrimary" href="#" to="#" className="inactive">
          Work Flow
        </LinkTo>
        <LinkTo color="textPrimary" href="#" to="#" className="inactive">
          WorkFlow name
        </LinkTo>
        <LinkTo color="textPrimary" href="#" to="#" className="active">
          Activities
        </LinkTo>
      </Breadcrumbs>
      <Grid container spacing={3} className="add-activity-section global-form">
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
        data={selectedActivities}
        columns={columns}
        options={options}
        className="global-table"
      />
    </div>
  );
}

export default AddActivity;
