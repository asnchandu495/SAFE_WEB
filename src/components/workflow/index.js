import React, { Fragment, useEffect, useState } from "react";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import { Link as LinkTo } from "react-router-dom";
import MUIDataTable from "mui-datatables";

import PropTypes from "prop-types";
import Button from "@material-ui/core/Button";
import Tooltip from "@material-ui/core/Tooltip";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import VisibilityIcon from "@material-ui/icons/Visibility";
import GroupAddIcon from "@material-ui/icons/GroupAdd";
import BackupIcon from "@material-ui/icons/Backup";
import AddBoxIcon from "@material-ui/icons/AddBox";
import AddIcon from "@material-ui/icons/Add";
import FilterListIcon from "@material-ui/icons/FilterList";
import UserGroupService from "../../services/userGroupService";
import ConfirmationDialog from "../common/confirmdialogbox";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import ComponentLoadderComponent from "../common/loadder/componentloadder";
import ButtonLoadderComponent from "../common/loadder/buttonloadder";
import ToasterMessageComponent from "../common/toaster";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";

function Workflow(props) {
  const UserGroup = new UserGroupService();
  const [responsive, setResponsive] = useState("vertical");
  const [tableBodyHeight, setTableBodyHeight] = useState("300px");
  const [tableBodyMaxHeight, setTableBodyMaxHeight] = useState("");
  const [userGroupList, setuserGroupList] = useState();
  const [componentLoadder, setComponentLoadder] = useState(true);
  const [Modalopen, setModalOpen] = useState(false);
  const [showLoadder, setshowLoadder] = useState(false);
  const userStatusData = [
    { id: true, name: "Active" },
    { id: false, name: "Inactive" },
  ];
  const columns = [
    {
      label: "Work Flow Name ",
      options: {
        filter: false,
        sort: true,
      },
    },
    {
      label: "User Group",
      options: {
        filter: false,
        sort: true,
      },
    },
    {
      label: "Status",
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
                <Tooltip title="View">
                  <Button
                    variant="contained"
                    color="default"
                    startIcon={<VisibilityIcon />}
                    className={`view-icon`}
                    onClick="#"
                  ></Button>
                </Tooltip>
                <Tooltip title="Edit">
                  <Button
                    variant="contained"
                    color="default"
                    startIcon={<EditIcon />}
                    className={`edit-icon`}
                    onClick="#"
                  ></Button>
                </Tooltip>

                <Tooltip title="Add">
                  <Button
                    variant="contained"
                    color="default"
                    startIcon={<AddIcon />}
                    className={`edit-icon`}
                    onClick="#"
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

                <Tooltip title="Upload">
                  <Button
                    variant="contained"
                    color="default"
                    startIcon={<BackupIcon />}
                    className={`edit-icon`}
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
        noMatch: "There are no users  teams",
      },
    },
    customToolbarSelect: (value, tableMeta, updateValue) => {},
    customToolbar: () => {
      return (
        <div className={`maingrid-actions`}>
          <Tooltip title="Filter By User">
            <Button
              variant="contained"
              startIcon={<FilterListIcon />}
              className={`add-icon`}
              onClick={handleClickOpenModal}
            ></Button>
          </Tooltip>
        </div>
      );
    },
  };

  let data = [
    ["Harper White", "Attorney", "Pittsburgh"],
    ["Kris Humphrey", "Agency Legal Counsel", "Laredo"],
    ["Frankie Long", "Industrial Analyst", "Austin"],
    ["Brynn Robbins", "Business Analyst", "Norfolk"],
    ["Justice Mann", "Business Consultant", "Chicago"],
    ["Addison Navarro", "Business Management Analyst", "New York"],
    ["Jesse Welch", "Agency Legal Counsel", "Seattle"],
    ["Eli Mejia", "Commercial Specialist", "Long Beach"],
    ["Gene Leblanc", "Industrial Analyst", "Hartford"],
    ["Danny Leon", "Computer Scientist", "Newark"],
    ["Lane Lee", "Corporate Counselor", "Cincinnati"],
    ["Jesse Hall", "Business Analyst", "Baltimore"],
    ["Danni Hudson", "Agency Legal Counsel", "Tampa"],
    ["Terry Macdonald", "Commercial Specialist", "Miami"],
    ["Justice Mccarthy", "Attorney", "Tucson"],
    ["Silver Carey", "Computer Scientist", "Memphis"],
    ["Franky Miles", "Industrial Analyst", "Buffalo"],
    ["Glen Nixon", "Corporate Counselor", "Arlington"],
    ["Gabby Strickland", "Business Process Consultant", "Scottsdale"],
    ["Mason Ray", "Computer Scientist", "San Francisco"],
  ];

  function BreadcrumbNavigation(getRoute) {
    props.history.push(getRoute);
  }

  const handleClickOpenModal = () => {
    setModalOpen(true);
  };

  const handleClose = () => {
    setModalOpen(false);
  };

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
  return (
    <div className="innerpage-container">
      <Dialog
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
        open={Modalopen}
      >
        <DialogTitle id="form-dialog-title" onClose={handleClose}>
          Filters
        </DialogTitle>
        <ValidatorForm className={`global-form`} onSubmit="#">
          <DialogContent dividers>
            {!componentLoadder ? (
              <Grid container spacing={3}>
                <Grid item cs={12} container>
                  <Grid item xs={4}>
                    <label className="">User Group </label>
                  </Grid>
                  <Grid item xs={8}>
                    <FormControl variant="outlined" fullWidth>
                      <Autocomplete
                        id="tags-outlined"
                        options={
                          userGroupList && userGroupList.length > 0
                            ? userGroupList
                            : []
                        }
                        getOptionLabel={(option) => option.groupName}
                        // defaultValue="#"
                        // onChange="#"
                        filterSelectedOptions
                        className="global-input autocomplete-select"
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant="outlined"
                            placeholder="Select usergroup"
                          />
                        )}
                      />{" "}
                    </FormControl>
                  </Grid>
                </Grid>
                <Grid item xs={12} container>
                  <Grid item xs={4}>
                    <label className="">Status</label>
                  </Grid>
                  <Grid item xs={8}>
                    <FormControl variant="outlined" fullWidth>
                      <InputLabel
                        id="demo-simple-select-outlined-label"
                        shrink={false}
                        className="select-label"
                      >
                        {/* {formData.isActive != "" ? "Select status" : ""} */}
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-outlined-label"
                        id="demo-simple-select-outlined"
                        placeholder="Select status"
                        name="isActive"
                        // value={formData.isActive}
                        // onChange={handleChange}
                        className="global-input single-select"
                      >
                        <MenuItem value="">None</MenuItem>
                        {userStatusData.length > 0
                          ? userStatusData.map((UserStatus) => {
                              return (
                                <MenuItem value={UserStatus.id}>
                                  {UserStatus.name}
                                </MenuItem>
                              );
                            })
                          : ""}
                      </Select>
                    </FormControl>
                  </Grid>
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
          List Work Flow
        </LinkTo>
      </Breadcrumbs>

      <MUIDataTable
        title={""}
        data={data}
        columns={columns}
        options={options}
        className="global-table"
      />
    </div>
  );
}

export default Workflow;
