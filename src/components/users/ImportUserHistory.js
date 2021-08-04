import React, { Fragment, useState, useEffect } from "react";
import Typography from "@material-ui/core/Typography";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import { Link as LinkTo } from "react-router-dom";
import MUIDataTable from "mui-datatables";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Tooltip from "@material-ui/core/Tooltip";
import ToasterMessageComponent from "../common/toaster";
import HomeIcon from "@material-ui/icons/Home";
import GroupIcon from "@material-ui/icons/Group";
import GetAppIcon from "@material-ui/icons/GetApp";
import fileUploadService from "../../services/fileUploadService";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import ComponentLoadderComponent from "../common/loadder/componentloadder";
import BackupIcon from "@material-ui/icons/Backup";
import moment from "moment";

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

function ImportUserHistory(props) {
  const apiCallImportUserHistory = new fileUploadService();
  const [stateSnackbar, setStateSnackbar] = useState(false);
  const [toasterMessage, setToasterMessage] = useState("");
  const [toasterServerity, settoasterServerity] = useState("");
  const [toasterErrorMessageType, settoasterErrorMessageType] =
    useState("array");

  const [componentLoadder, setcomponentLoadder] = useState(true);
  const [importuserHistoryDetails, setimportuserHistoryDetails] = useState([]);

  useEffect(() => {
    apiCallImportUserHistory
      .listimportUesrHistoryDetails()
      .then((result) => {
        setimportuserHistoryDetails(result);
        setcomponentLoadder(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const options = {
    filter: false,
    filterType: "dropdown",
    responsive: "scroll",
    fixedHeader: true,
    rowsPerPageOptions: [5, 10, 15, 100],
    rowsPerPage: 5,
    jumpToPage: true,
    print: false,
    viewColumns: false,
    download: false,
    selectableRows: false,
    textLabels: {
      body: {
        noMatch: "There are no users",
      },
      pagination: {
        jumpToPage: "Go to page:",
      },
    },

    customToolbarSelect: (value, tableMeta, updateValue) => {},
    customToolbar: (value, tableMeta, updateValue) => {
      return (
        <div className={`maingrid-actions`}>
          <Tooltip title="Import  Users">
            <Button
              variant="contained"
              startIcon={<BackupIcon />}
              className={`add-icon`}
              onClick={handleupload}
            ></Button>
          </Tooltip>
        </div>
      );
    },
  };

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
      name: "transactionId",
      label: "",
      options: {
        display: "excluded",
        print: false,
        filter: false,
      },
    },
    {
      name: "createdDate",
      label: "Imported Date",
      options: {
        customBodyRender: (value, tableMeta, updateValue) => {
          var thisRowData = tableMeta.rowData;
          if (thisRowData) {
            var thisCreatedDate = thisRowData[2];
          }
          return <span>{moment(thisCreatedDate).format("DD MMM YYYY")}</span>;
        },
        print: false,
        filter: true,
      },
    },

    {
      name: "createdByName",
      label: "Imported By",
      options: {
        print: false,
        filter: true,
      },
    },

    {
      name: "totalRecords",
      label: "No Of New Records",
      options: {
        filter: false,
        sort: true,
      },
    },
    {
      name: "processedRecords",
      label: "No Of New Records Updated",
      options: {
        filter: false,
        sort: true,
      },
    },
    {
      label: "Actions",
      name: "",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value, tableMeta, updateValue) => {
          var thisRowData = tableMeta.rowData;
          var slectedId = thisRowData[1];
          if (thisRowData) {
            return (
              <div className={`action-buttons-container`}>
                <Tooltip title="Download">
                  <Button
                    variant="contained"
                    color="default"
                    startIcon={<GetAppIcon />}
                    className={`edit-icon`}
                    onClick={() => downloadSelectedFile(slectedId)}
                  ></Button>
                </Tooltip>
              </div>
            );
          }
        },
        setCellProps: (value) => {
          return {
            style: { width: "250px", minWidth: "250px" },
          };
        },
      },
    },
  ];

  const downloadSelectedFile = (getValue) => {
    var getFileId = getValue;
    apiCallImportUserHistory
      .downloadselectedUploadFile(getFileId)
      .then((success) => {
        var blob = new Blob([success], {
          type: "data:application/vnd.ms-excel",
        });
        var downloadUrl = URL.createObjectURL(blob);
        var a = document.createElement("a");
        a.href = downloadUrl;
        a.download = getFileId + ".xlsx";
        document.body.appendChild(a);
        a.click();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  function BreadcrumbNavigation(getRoute) {
    props.history.push(getRoute);
  }
  function handleupload() {
    props.history.push("/users/import-users");
  }
  return (
    <div className="innerpage-container">
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
          to={`/users/allusers`}
          className="inactive"
        >
          Users
        </LinkTo>
        <LinkTo
          color="textPrimary"
          href="#"
          aria-current="page"
          className="active"
        >
          Import History
        </LinkTo>
      </Breadcrumbs>
      {componentLoadder ? (
        <ComponentLoadderComponent />
      ) : (
        <MuiThemeProvider theme={theme1}>
          {" "}
          <MUIDataTable
            title={""}
            data={importuserHistoryDetails}
            columns={columns}
            options={options}
            className="global-table"
          />
        </MuiThemeProvider>
      )}

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

export default ImportUserHistory;
