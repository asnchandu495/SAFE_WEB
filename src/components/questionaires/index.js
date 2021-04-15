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
import PlaylistAddCheckIcon from "@material-ui/icons/PlaylistAddCheck";
import UnfoldMoreIcon from "@material-ui/icons/UnfoldMore";
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
  const [questionaireList, setQuestionaireList] = useState([]);

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

  const [reloadPage, setReloadPage] = useState("NO");
  useEffect(() => {
    setcomponentLoadder(true);

    props
      .LoadData()
      .then((res) => {
        setcomponentLoadder(false);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [reloadPage]);

  function handleClickOpenConfirmationModal(value) {
    setSelectedRowDetails(value);
    setOpenConfirmationModal(true);
    setConfirmationModalActionType("DeleteQuestionaire");
    setConfirmationHeaderTittle("Delete Questionnaire");
    setConfirmationDialogContextText(
      `Are you sure you want to delete the questionnaire - ${value[1]} ?`
    );
  }
  function handleClickViewQuestion(value) {
    var questionId = value[0];
    props.history.push("/questionaires/view-questionaire/" + questionId);
  }

  function handleClickUpdateQuestions(value) {
    var questionId = value[0];
    props.history.push(`/questionaires/create-questionaire/${questionId}`);
  }

  function handleClickOrderofExecution(value) {
    var questionId = value[0];
    props.history.push(`/questionaires/order-of-execution/${questionId}`);
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
      label: "  Questionnaire ",
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
                <Tooltip title="Edit">
                  <Button
                    variant="contained"
                    color="default"
                    startIcon={<EditIcon />}
                    className={`edit-icon`}
                    onClick={() => handleClickUpdateQuestions(thisRowData)}
                  ></Button>
                </Tooltip>
                <Tooltip title="Delete">
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
                <Tooltip title="Add questions">
                  <Button
                    variant="contained"
                    color="default"
                    startIcon={<QuestionAnswerOutlinedIcon />}
                    className={`edit-icon`}
                    onClick={() => gotoViewQuestion(thisRowData)}
                  ></Button>
                </Tooltip>
                <Tooltip title="Order of execution">
                  <Button
                    variant="contained"
                    color="default"
                    startIcon={<UnfoldMoreIcon />}
                    className={`delete-icon`}
                    onClick={() => handleClickOrderofExecution(thisRowData)}
                  ></Button>
                </Tooltip>
                <Tooltip title="Questionnaire Evaluation">
                  <Button
                    variant="contained"
                    color="default"
                    startIcon={<PlaylistAddCheckIcon />}
                    className={`view-icon`}
                    onClick={() => questionaireEvaluation(thisRowData)}
                  ></Button>
                </Tooltip>
              </div>
            );
          }
        },
        setCellProps: (value) => {
          return {
            style: { width: "300px", minWidth: "300px", textAlign: "center" },
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
        noMatch: "There are no questionnaire",
      },
    },
  };

  function gotoAddQuestion(getRowData) {
    props.history.push(`/questionaires/add-questions/${getRowData[0]}/0`);
  }

  function gotoViewQuestion(getRowData) {
    props.history.push(`/questionaires/view-questions/${getRowData[0]}`);
  }

  function questionaireEvaluation(getRowData) {
    props.history.push(
      `/questionaires/questionnaire-evaluation/${getRowData[0]}`
    );
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
              to={`/questionaires/allquestionaires`}
              aria-current="page"
              className="active"
            >
              Questionnaire
            </LinkTo>
          </Breadcrumbs>

          <MuiThemeProvider theme={theme1}>
            {" "}
            <MUIDataTable
              data={props.QuestionaireData ? props.QuestionaireData : []}
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
  QuestionaireData: propTypes.array.isRequired,
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
