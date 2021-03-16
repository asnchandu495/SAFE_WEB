import { React, useState, useEffect } from "react";
import MUIDataTable from "mui-datatables";
import { Link as LinkTo } from "react-router-dom";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Tooltip from "@material-ui/core/Tooltip";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import VisibilityIcon from "@material-ui/icons/Visibility";
import teamService from "../../services/teamService";
import ConfirmationDialog from "../common/confirmdialogbox";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import { useHistory } from "react-router-dom";
import { connect } from "react-redux";
import * as teamAction from "../../Redux/Action/teamAction";
import ComponentLoadderComponent from "../common/loadder/componentloadder";
import GroupAddIcon from "@material-ui/icons/GroupAdd";
import propTypes from "prop-types";

import ToasterMessageComponent from "../common/toaster";
const style = makeStyles({
  titleItemRight: {
    color: "white",
    backgroundColor: "blue",
    top: "50%",
    height: 30,
    float: "right",
    position: "relative",
    transform: "translateY(-50%)",
  },
  aligndiv: {},
});
const theme1 = createMuiTheme({
  overrides: {
    MUIDataTable: {
      responsiveScroll: {
        overflowX: "none",
        height: "auto",
        maxHeight: "calc(100vh - 290px) !important",
      },
    },
  },
});
function Teams(props) {
  const teamApiCall = new teamService();
  const [teamList, setTeamList] = useState([]);
  let history = useHistory();
  const [ConfirmationHeaderTittle, setConfirmationHeaderTittle] = useState("");

  const [openConfirmationModal, setOpenConfirmationModal] = useState(false);
  const [
    ConfirmationDialogContextText,
    setConfirmationDialogContextText,
  ] = useState("");

  
  const [SelectedRowDetails, setSelectedRowDetails] = useState([]);
  // const [SelectedRowId, setSelectedRowId] = useState("");
  const [stateSnackbar, setStateSnackbar] = useState(false);

  const [toasterMessage, setToasterMessage] = useState("");
  const [toasterServerity, settoasterServerity] = useState("");
  const [toasterErrorMessageType, settoasterErrorMessageType] = useState(
    "array"
  );
  const [
    ConfirmationModalActionType,
    setConfirmationModalActionType,
  ] = useState("");
  const [reloadPage, setReloadPage] = useState("NO");
  const [componentLoadder, setcomponentLoadder] = useState(true);
  useEffect(() => {
    setcomponentLoadder(true);
    props
      .LoadAllTeams()
      .then((res) => {
        setcomponentLoadder(false);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [reloadPage]);

  function handleClickUpdateTeams(value) {
    var userId = value[0];
    props.history.push(`/teams/add-teams/${userId}`);
  }

  function handleClickOpenConfirmationModal(value) {
    
    setSelectedRowDetails(value);
    setOpenConfirmationModal(true);
    setConfirmationModalActionType("DeleteTeams");
    setConfirmationHeaderTittle("Delete Team");
    setConfirmationDialogContextText(
      `Are you sure you want to delete ${value[1]} ?`
    );
  }

  function handleClickaddedsecondaryteams(value) {
    var groupId = value[0];
    props.history.push("/teams/add-primary-user-teams/" + groupId);
  }

  function handleClickViewTeams(value) {
    var teamId = value[0];
    props.history.push("/teams/view-team/" + teamId);
  }

   

  const columns = [
    {
      name: "id",
      label: "id",
      options: {
        display: "excluded",
        print: false,
        filter: false,
      },
    },
    {
      name: "name",
      label: "Team ",
      options: {
        filter: false,
        sort: true,
      },
    },
    {
      name: "manager",
      label: "Team Manager",
      options: {
        filter: false,
        sort: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          var thisRowData = tableMeta.rowData;
          if (thisRowData) {
            return <span>{thisRowData[2].name}</span>;
          }
        },
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
                    onClick={() => handleClickViewTeams(thisRowData)}
                  ></Button>
                </Tooltip>
                <Tooltip title="Edit">
                  <Button
                    variant="contained"
                    color="default"
                    startIcon={<EditIcon />}
                    className={`edit-icon`}
                    onClick={() => handleClickUpdateTeams(thisRowData)}
                  ></Button>
                </Tooltip>

                <Tooltip title="Delete">
                  <Button
                    variant="contained"
                    color="default"
                    startIcon={<DeleteIcon />}
                    className={`delete-icon`}
                    onClick={() => handleClickOpenConfirmationModal(thisRowData)}
                  ></Button>
                </Tooltip>

                <Tooltip title="Assign users as primary team">
                  <Button
                    variant="contained"
                    color="default"
                    startIcon={<GroupAddIcon />}
                    className={`edit-icon`}
                    onClick={() => handleClickaddedsecondaryteams(thisRowData)}
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
    // rowsPerPageOptions: [5, 10, 15, 100],
    // rowsPerPage: 5,
    print: false,
    viewColumns: false,
    download: false,
    selectableRows: false,
    textLabels: {
      body: {
        noMatch: "There are no users  teams",
      },
    },
  };

  return (
    <div className="innerpage-container">
      {componentLoadder ? (
        <ComponentLoadderComponent />
      ) : (
        <>
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
              aria-current="page"
              className="active"
            >
              Teams
            </LinkTo>
          </Breadcrumbs>

          <MuiThemeProvider theme={theme1}>
            {" "}
            <MUIDataTable
              data={
                props.TeamData && props.TeamData.length > 0
                  ? props.TeamData
                  : []
              }
              columns={columns}
              options={options}
              className="global-table"
            />
          </MuiThemeProvider>
        </>
      )}

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
      />
       <ToasterMessageComponent
        stateSnackbar={stateSnackbar}
        setStateSnackbar={setStateSnackbar}
        toasterMessage={toasterMessage}
        toasterServerity={toasterServerity}
        toasterErrorMessageType={toasterErrorMessageType}
      />
    </div>
  );
}

Teams.propTypes = {
  TeamData: propTypes.array.isRequired,
  LoadAllTeams: propTypes.func.isRequired,
};

function mapStateToProps(state, ownProps) {
  return {
    TeamData: state.team,
  };
}

const mapDispatchToProps = {
  LoadAllTeams: teamAction.loadTeam,
};

// export default Teams;

export default connect(mapStateToProps, mapDispatchToProps)(Teams);
