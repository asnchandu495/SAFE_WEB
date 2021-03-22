import React, { useState, useEffect } from "react";
import MUIDataTable from "mui-datatables";
import { Link as LinkTo } from "react-router-dom";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Button from "@material-ui/core/Button";
import Tooltip from "@material-ui/core/Tooltip";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import VisibilityIcon from "@material-ui/icons/Visibility";
import ConfirmationDialog from "../common/confirmdialogbox";
import QuestionAnswerOutlinedIcon from "@material-ui/icons/QuestionAnswerOutlined";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import ComponentLoadderComponent from "../common/loadder/componentloadder";
import ToasterMessageComponent from "../common/toaster";
import propTypes from "prop-types";
import { connect } from "react-redux";
import questionaireService from "../../services/questionaireService";
import * as questionaireAction from "../../Redux/Action/questionaireAction";
import prototypes from "prop-types";

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

function Questionaire(props) {
  const questionaireApiCall = new questionaireService();
  const [questionaireList, setQuestionaireList] = useState([
    {
      id: "001",
      languageId: "string",
      name: "Questionaire one",
      description: "string",
    },
    {
      id: "002",
      languageId: "string",
      name: "Questionaire two",
      description: "string",
    },
    {
      id: "oo3",
      languageId: "string",
      name: "Questionaire three",
      description: "string",
    },
  ]);

  const [componentLoadder, setcomponentLoadder] = useState(true);
  const [ConfirmationHeaderTittle, setConfirmationHeaderTittle] = useState("");
  const [openConfirmationModal, setOpenConfirmationModal] = useState(false);
  const [
    ConfirmationDialogContextText,
    setConfirmationDialogContextText,
  ] = useState("");
  const [SelectedRowDetails, setSelectedRowDetails] = useState([]);
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

  useEffect(() => {
    setcomponentLoadder(false);
    // questionaireApiCall.GetAllQuestionarie()
    props
      .LoadData()
      .then((res) => {
        console.log(res);
        setcomponentLoadder(false);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

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
      label: "Name ",
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
                    // onClick={() => handleClickViewTeams(thisRowData)}
                  ></Button>
                </Tooltip>
                <Tooltip title="Edit">
                  <Button
                    variant="contained"
                    color="default"
                    startIcon={<EditIcon />}
                    className={`edit-icon`}
                    // onClick={() => handleClickUpdateTeams(thisRowData)}
                  ></Button>
                </Tooltip>
                <Tooltip title="Delete">
                  <Button
                    variant="contained"
                    color="default"
                    startIcon={<DeleteIcon />}
                    className={`delete-icon`}
                    // onClick={() =>
                    //   handleClickOpenConfirmationModal(thisRowData)
                    // }
                  ></Button>
                </Tooltip>
                <Tooltip title="Add questions">
                  <Button
                    variant="contained"
                    color="default"
                    startIcon={<QuestionAnswerOutlinedIcon />}
                    className={`edit-icon`}
                    onClick={() => gotoAddQuestion(thisRowData)}
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
        noMatch: "There are no questionaires",
      },
    },
  };

  function gotoAddQuestion(getRowData) {
    props.history.push(`/questionaires/add-questions/${getRowData[0]}/0`);
  }

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
              Questionaires
            </LinkTo>
          </Breadcrumbs>

          <MuiThemeProvider theme={theme1}>
            {" "}
            <MUIDataTable
              data={
                questionaireList && questionaireList.length > 0
                  ? questionaireList
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

Questionaire.propTypes = {
  LoadData: propTypes.func.isRequired,
};

function mapStateToProps(state, ownProps) {
  return {
    QuestionaireData: state.questionaireState,
  };
}

const mapDispatchToProps = {
  LoadData: questionaireAction.loadquestions,
};

export default connect(mapStateToProps, mapDispatchToProps)(Questionaire);
