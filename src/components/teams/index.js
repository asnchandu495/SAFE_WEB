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
import teamService from '../../services/teamService';

import ConfirmationDialog from "../common/confirmdialogbox";
  

import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import { useHistory } from "react-router-dom";

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
const Teams=(props)=> {
  const teamApiCall = new teamService();
    const [ teamList,setTeamList] =useState([]);
    let history = useHistory();
    const [ConfirmationHeaderTittle, setConfirmationHeaderTittle] = useState("");
    
  const [openConfirmationModal, setOpenConfirmationModal] = useState(false);
  const [
    ConfirmationDialogContextText,
    setConfirmationDialogContextText,
  ] = useState("");
  
  const [
    ConfirmationModalActionType,
    setConfirmationModalActionType,
  ] = useState("");
  const [SelectedRowDetails, setSelectedRowDetails] = useState([]);
  
  const [stateSnackbar, setStateSnackbar] = useState(false);
  
  const [toasterMessage, setToasterMessage] = useState("");
  const [toasterServerity, settoasterServerity] = useState("");


    useEffect(() => {
      teamApiCall.getTeamList()
      .then((res)=>{
        // console.log(res);
        setTeamList(res);
      })
      .catch((error) => {
       console.log(error);
     });




     }, []);
     function handleClickUpdateTeams(value) {
      var userId = value[0];
      console.log(value);
      props.history.push(`/teams/add-teams/${userId}`);
    }


    
  function handleClickDeleteUserGrup(value) {
    setSelectedRowDetails(value);
    setOpenConfirmationModal(true);
    setConfirmationModalActionType("DeleteTeams");
    setConfirmationHeaderTittle("Delete Team");
    setConfirmationDialogContextText(
      `Are you sure you want to delete ${value[1]} ?`
    );
  }
 
    // const classes = style();

    

    
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
          name: "teamanager",
          label: "Team Manager",
          options: {
            filter: false,
            sort: true,
            customBodyRender: (value, tableMeta, updateValue) => {
              var thisRowData = tableMeta.rowData;
              if (thisRowData) {
                console.log(thisRowData);
                return  <span>{thisRowData[2].name}</span>
                 
                
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
                        onClick="#"
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
                        onClick={() => handleClickDeleteUserGrup(thisRowData)}
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
     data={teamList}
     columns={columns}
     options={options}
     className="global-table"
     />
           </MuiThemeProvider>
        

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
     </div>
 );
}
  
  export default Teams;
  