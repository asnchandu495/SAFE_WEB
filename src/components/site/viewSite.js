import React, { Fragment, useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import { Link as LinkTo } from "react-router-dom";
import SiteServices from "../../services/siteService";
import ComponentLoadderComponent from "../common/loadder/componentloadder";
import MUIDataTable from "mui-datatables";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  backButton: {
    marginRight: theme.spacing(1),
  },
  instructions: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    padding: 25,
  },
  stepButtons: {
    display: "flex",
    justifyContent: "flex-end",
  },
  icon: {
    marginRight: theme.spacing(0.5),
    marginBottom: -3,
    width: 20,
    height: 20,
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: "100%",
    margin: 0,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  errorSpanMsg: {
    color: "red",
  },
}));

const theme1 = createMuiTheme({
  overrides: {
    MUIDataTable: {
      responsiveScroll: {
        overflowX: "none",
        height: "auto",
        maxHeight: "500px !important",
      },
    },
  },
});

function ViewSite(props) {
  const siteId = props.match.params.id;
  const siteApiCall = new SiteServices();
  const classes = useStyles();
  const [componentLoadder, setComponentLoadder] = useState(true);
  const [viewSiteValue, setviewSiteValue] = useState();

  useEffect(() => {
    siteApiCall
      .getSiteById(siteId)
      .then((result) => {
        setviewSiteValue(result);
        setComponentLoadder(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  function BreadcrumbNavigation(getRoute) {
    props.history.push(getRoute);
  }

  function handleClickGoBack() {
    props.history.push("/site/all-site");
  }

  const floorOptions = {
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
        noMatch: "There are no floors",
      },
    },
  };

  const locationOptions = {
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
        noMatch: "There are no locations",
      },
    },
  };

  const floorColumns = [
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
      name: "floorName",
      label: "Floors",
      options: {
        filter: false,
        sort: true,
      },
    },
    {
      name: "locationCount",
      label: "No of locations",
      options: {
        filter: false,
        sort: true,
      },
    },
  ];

  const locationColumns = [
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
      name: "locationName",
      label: "Floor",
      options: {
        filter: false,
        sort: true,
      },
    },
    {
      name: "locationName",
      label: "Location",
      options: {
        filter: false,
        sort: true,
      },
    },
    {
      name: "isPinMicroActive",
      label: "Pin micro status",
      options: {
        filter: false,
        sort: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          var thisRowData = tableMeta.rowData;
          if (thisRowData) {
            return <span>{thisRowData[3] ? "Active" : "Inactive"}</span>;
          }
        },
      },
    },
    {
      name: "densityTreasHold",
      label: "Low",
      options: {
        filter: false,
        sort: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          var thisRowData = tableMeta.rowData;
          if (thisRowData) {
            return (
              <span>
                {thisRowData[4].lowerLimit.from} -{" "}
                {thisRowData[4].lowerLimit.to}
              </span>
            );
          }
        },
      },
    },
    {
      name: "densityTreasHold",
      label: "Medium",
      options: {
        filter: false,
        sort: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          var thisRowData = tableMeta.rowData;
          if (thisRowData) {
            return (
              <span>
                {thisRowData[4].mediumLimit.from} -{" "}
                {thisRowData[4].mediumLimit.to}
              </span>
            );
          }
        },
      },
    },
    {
      name: "densityTreasHold",
      label: "High",
      options: {
        filter: false,
        sort: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          var thisRowData = tableMeta.rowData;
          if (thisRowData) {
            return (
              <span>
                {thisRowData[4].higherLimit.from} -{" "}
                {thisRowData[4].higherLimit.to}
              </span>
            );
          }
        },
      },
    },
  ];

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
              color="inherit"
              href="#"
              to={`/site/all-site`}
              className="inactive"
            >
              Sites
            </LinkTo>
            <LinkTo
              color="textPrimary"
              href="#"
              aria-current="page"
              className="active"
            >
              {viewSiteValue.name}
            </LinkTo>
          </Breadcrumbs>
          <Paper className={`main-paper`}>
            <div className={`global-form inline-form`}>
              <Grid container spacing={3} direction="row">
                <Grid item sm={6} container>
                  <Grid item xs={4}>
                    <label>Site Name :</label>
                  </Grid>
                  <Grid item xs={8}>
                    <label>{viewSiteValue.name}</label>
                  </Grid>
                </Grid>
                <Grid item sm={6} container>
                  <Grid item xs={4}>
                    <label>Description:</label>
                  </Grid>
                  <Grid item xs={8}>
                    <label>{viewSiteValue.description}</label>
                  </Grid>
                </Grid>
                <Grid item sm={6} container>
                  <Grid item xs={4}>
                    <label>Address1 :</label>
                  </Grid>
                  <Grid item xs={8}>
                    <label>{viewSiteValue.address1}</label>
                  </Grid>
                </Grid>
                <Grid item sm={6} container>
                  <Grid item xs={4}>
                    <label>Address2 :</label>
                  </Grid>
                  <Grid item xs={8}>
                    <label>{viewSiteValue.address2}</label>
                  </Grid>
                </Grid>
                <Grid item sm={6} container>
                  <Grid item xs={4}>
                    <label>City :</label>
                  </Grid>
                  <Grid item xs={8}>
                    <label>{viewSiteValue.city}</label>
                  </Grid>
                </Grid>
                <Grid item sm={6} container>
                  <Grid item xs={4}>
                    <label>State/Region/Province :</label>
                  </Grid>
                  <Grid item xs={8}>
                    <label>{viewSiteValue.state}</label>
                  </Grid>
                </Grid>
                <Grid item sm={6} container>
                  <Grid item xs={4}>
                    <label>Country :</label>
                  </Grid>
                  <Grid item xs={8}>
                    <label>{viewSiteValue.countryId}</label>
                  </Grid>
                </Grid>
                <Grid item sm={6} container>
                  <Grid item xs={4}>
                    <label>Postal Code/Zip Code :</label>
                  </Grid>
                  <Grid item xs={8}>
                    <label>{viewSiteValue.zipCode}</label>
                  </Grid>
                </Grid>
                <Grid item sm={6} container>
                  <Grid item xs={4}>
                    <label>Site Manager :</label>
                  </Grid>
                  <Grid item xs={8}>
                    <label>{viewSiteValue.siteManager}</label>
                  </Grid>
                </Grid>

                <Grid item sm={6} container>
                  <Grid item xs={4}>
                    <label>Security Manager :</label>
                  </Grid>
                  <Grid item xs={8}>
                    <label>{viewSiteValue.securityManager}</label>
                  </Grid>
                </Grid>

                <Grid item sm={6} container className="inner-page-grid">
                  <MuiThemeProvider theme={theme1}>
                    {" "}
                    <MUIDataTable
                      title={""}
                      data={
                        viewSiteValue.sitetofloormappings &&
                        viewSiteValue.sitetofloormappings.length > 0
                          ? viewSiteValue.sitetofloormappings
                          : []
                      }
                      columns={floorColumns}
                      options={floorOptions}
                      className="global-table table-wo-action full-width-grid"
                    />
                  </MuiThemeProvider>
                </Grid>

                <Grid item sm={6} container className="inner-page-grid">
                  <MuiThemeProvider theme={theme1}>
                    {" "}
                    <MUIDataTable
                      title={""}
                      data={
                        viewSiteValue.locationSiteMappings &&
                        viewSiteValue.locationSiteMappings.length > 0
                          ? viewSiteValue.locationSiteMappings
                          : []
                      }
                      columns={locationColumns}
                      options={locationOptions}
                      className="global-table table-wo-action full-width-grid"
                    />
                  </MuiThemeProvider>
                </Grid>
                <Grid
                  item
                  xs={12}
                  container
                  direction="row"
                  justify="flex-end"
                  alignItems="center"
                >
                  <div className={`form-buttons-container`}>
                    <Button
                      variant="contained"
                      type="button"
                      onClick={handleClickGoBack}
                      className="global-cancel-btn"
                    >
                      Close
                    </Button>
                  </div>
                </Grid>
              </Grid>
            </div>
          </Paper>
        </>
      )}
    </div>
  );
}
export default ViewSite;
