import  { React, useState, useEffect } from 'react';
import MUIDataTable from 'mui-datatables';


import { Link as LinkTo } from "react-router-dom";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Tooltip from "@material-ui/core/Tooltip";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import VisibilityIcon from "@material-ui/icons/Visibility";
 

import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";

const style = makeStyles({
  titleItemRight: {
    color: "white",
    backgroundColor: "blue",
    top: "50%",
    height: 30,
    float: "right",
    position: "relative",
    transform: "translateY(-50%)"
  },
  aligndiv:{
    
  },
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
const Teams=()=> {
    // const [ data,setdata] =useState([]);
 
    const classes = style();

    let data=[
        ["Team1", "Team 1", "Manager 1"],
        ["Team1", "Team 2", "Manager 2"],
        ["Team3", "Team 3", "Manager 3  "],
      ];
    
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
          name: "floors",
          label: "Team Manager",
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
        // rowsPerPageOptions: [5, 10, 15, 100],
        // rowsPerPage: 5,
        print: false,
        viewColumns: false,
        download: false,
        selectableRows: false,
        textLabels: {
          body: {
            noMatch: "There are no users assign teams",
          },
        },
      };
    
 
 
 return (
   
     <div>
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
     data={data}
     columns={columns}
     options={options}
     className="global-table"
     />
           </MuiThemeProvider>
        
     </div>
 );
}
  
  export default Teams;
  