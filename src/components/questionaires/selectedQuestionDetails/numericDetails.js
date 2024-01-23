import React, { useState, useEffect } from "react";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Tooltip from "@material-ui/core/Tooltip";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import SettingsIcon from "@material-ui/icons/Settings";
import Grid from "@material-ui/core/Grid";
import ComponentLoadderComponent from "../../common/loadder/componentloadder";
import ToasterMessageComponent from "../../common/toaster";
import { useHistory } from "react-router-dom";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import ConfirmationDialog from "../../common/confirmdialogbox";
import * as QuestionAction from "../../../Redux/Action/questionAction";
import { connect } from "react-redux";
import PropTypes from "prop-types";

function NumericDetails(props) {
  const history = useHistory();
  const [componentLoadder, setcomponentLoadder] = useState(true);
  const [ConfirmationHeaderTittle, setConfirmationHeaderTittle] = useState("");
  const [openConfirmationModal, setOpenConfirmationModal] = useState(false);
  const [ConfirmationDialogContextText, setConfirmationDialogContextText] =
    useState("");
  const [SelectedRowDetails, setSelectedRowDetails] = useState([]);
  const [stateSnackbar, setStateSnackbar] = useState(false);
  const [toasterMessage, setToasterMessage] = useState("");
  const [toasterServerity, settoasterServerity] = useState("");
  const [toasterErrorMessageType, settoasterErrorMessageType] =
    useState("array");
  const [ConfirmationModalActionType, setConfirmationModalActionType] =
    useState("");
  const [isDeleteMessage, setIsDeleteMessage] = useState(false);

  useEffect(() => {
    if (props.selectedQuestionDetails) {
    }
  }, []);
  /**
   * Handle ClickOpen Confirmation modal
   * Set the action type and the message on the dialogbox and also once the modal opens and checks with commom folder 
      confirmdialogbox component 
   * @param  {} value-id
   */
  function handleClickOpenConfirmationModal(value) {
    setSelectedRowDetails(value);
    setOpenConfirmationModal(true);
    setConfirmationModalActionType("DeleteNumericQuestion");
    setConfirmationHeaderTittle("Delete  Numeric Question");
    if (
      !props.ViewQuestionaireDetails.isSaveasDraft &&
      !props.ViewQuestionaireDetails.isAssignedToUserGroupisAssignedToUserGroup
    ) {
      setConfirmationDialogContextText(
        // `Are you sure you want to delete ${value.question} ?`
        `Deleting of this numeric question might have impact on conditional jump (if there) , order of execution and questionnaire evaluation, please revisit these areas`
      );
      setIsDeleteMessage(true);
    } else {
      setConfirmationDialogContextText(
        // `Are you sure you want to delete ${value.question} ?`
        `Are you sure you want to delete this question ?`
      );
      setIsDeleteMessage(false);
    }
  }
  /**
   * Method on click of edit to update
   * @param  {} getQueDetails-questionid
   */
  function handleClickUpdateQuestions(getQueDetails) {
    history.push(
      `/questionaires/add-questions/${getQueDetails.surveyId}/${getQueDetails.id}?type=${getQueDetails.questionType}`
    );
  }
  /**
   * Method on click of view
   * @param  {} getQueDetails-questionid
   */
  function handleClickConditional(getQueDetails) {
    history.push(
      `/questionaires/${getQueDetails.surveyId}/conditional/numeric/${getQueDetails.id}`
    );
  }

  return (
    <Card className="question-type-card">
      <CardContent className="scrollable-card">
        <Typography gutterBottom variant="h6" component="h6">
          View Question
          <div className="action-buttons-container question-actions">
            <Tooltip title="Edit">
              <Button
                disabled={props.ViewQuestionaireDetails.isAssignedToUserGroup}
                variant="contained"
                color="default"
                startIcon={<EditIcon />}
                className={`edit-icon`}
                onClick={() =>
                  handleClickUpdateQuestions(props.selectedQuestionDetails)
                }
              ></Button>
            </Tooltip>
            <Tooltip title="Conditional jump">
              <Button
                variant="contained"
                color="default"
                startIcon={<SettingsIcon />}
                className={`view-icon`}
                onClick={() =>
                  handleClickConditional(props.selectedQuestionDetails)
                }
              ></Button>
            </Tooltip>

            <Tooltip title="Delete">
              <Button
                disabled={props.ViewQuestionaireDetails.isAssignedToUserGroup}
                variant="contained"
                color="default"
                startIcon={<DeleteIcon />}
                className={`delete-icon`}
                onClick={() =>
                  handleClickOpenConfirmationModal(
                    props.selectedQuestionDetails
                  )
                }
              ></Button>
            </Tooltip>
          </div>
        </Typography>
        <div className="card-form">
          <Grid container item xs={12} spacing={3} direction="column">
            <Grid item xs={12} container>
              <Grid item xs={3}>
                <label>Question type :</label>
              </Grid>
              <Grid item xs={9}>
                <label>
                  {props.selectedQuestionDetails
                    ? props.selectedQuestionDetails.questionType
                    : ""}
                </label>
              </Grid>
            </Grid>
            <Grid item xs={12} container>
              <Grid item xs={3}>
                <label>Question :</label>
              </Grid>
              <Grid item xs={9}>
                <label>
                  {props.selectedQuestionDetails
                    ? props.selectedQuestionDetails.question
                    : ""}
                </label>
              </Grid>
            </Grid>
            <Grid item xs={12} container>
              <Grid item xs={3}>
                <label>Description :</label>
              </Grid>
              <Grid item xs={9}>
                <label>
                  {props.selectedQuestionDetails
                    ? props.selectedQuestionDetails.description
                    : ""}
                </label>
              </Grid>
            </Grid>
            <Grid item xs={12} container>
              <Grid item xs={3}>
                <label>Is mandatory :</label>
              </Grid>
              <Grid item xs={9}>
                <label>
                  {props.selectedQuestionDetails
                    ? props.selectedQuestionDetails.isMandatory
                      ? "Yes"
                      : "No"
                    : ""}
                </label>
              </Grid>
            </Grid>
            {props.selectedQuestionDetails.isPositiveConfirmityRedFlag ? (
              <Grid item xs={12} container>
                <Grid item xs={3}>
                  <label>Red flag :</label>
                </Grid>
                <Grid item xs={9}>
                  <Table
                    aria-label="simple table"
                    className="flag-details-table"
                  >
                    <TableHead>
                      <TableRow>
                        <TableCell>Expression type</TableCell>
                        <TableCell>From</TableCell>
                        <TableCell>To</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {props.selectedQuestionDetails.redFlagForNumber.map(
                        (row) => (
                          <TableRow key={row.numericExpressionType}>
                            <TableCell component="th" scope="row">
                              {row.numericExpressionType}
                            </TableCell>
                            <TableCell>{row.forAnswer}</TableCell>
                            {row.numericExpressionType == "RANGE" ? (
                              <TableCell>{row.forRangeEnd}</TableCell>
                            ) : (
                              <TableCell>-</TableCell>
                            )}
                          </TableRow>
                        )
                      )}
                    </TableBody>
                  </Table>
                </Grid>
              </Grid>
            ) : (
              ""
            )}
            <Grid item xs={12} container>
              <Grid item xs={3}>
                <label>Positive flag :</label>
              </Grid>
              <Grid item xs={9}>
                <Table aria-label="simple table" className="flag-details-table">
                  <TableHead>
                    <TableRow>
                      <TableCell>Expression type</TableCell>
                      <TableCell>From</TableCell>
                      <TableCell>To</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {props.selectedQuestionDetails.positiveConformityForNumber.map(
                      (row) => (
                        <TableRow key={row.numericExpressionType}>
                          <TableCell component="th" scope="row">
                            {row.numericExpressionType}
                          </TableCell>
                          <TableCell>{row.forAnswer}</TableCell>
                          {row.numericExpressionType == "RANGE" ? (
                            <TableCell>{row.forRangeEnd}</TableCell>
                          ) : (
                            <TableCell>-</TableCell>
                          )}
                        </TableRow>
                      )
                    )}
                  </TableBody>
                </Table>
              </Grid>
            </Grid>
          </Grid>
        </div>
      </CardContent>
      {/* <CardActions className="action-container">
        <Button type="button" size="small" color="primary">
          Close
        </Button>
      </CardActions> */}
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
        setSelectedQuestionDetails={props.setSelectedQuestionDetails}
        selectedQuestionDetails={props.selectedQuestionDetails}
        isDeleteMessageWarning={isDeleteMessage}
      />
      <ToasterMessageComponent
        stateSnackbar={stateSnackbar}
        setStateSnackbar={setStateSnackbar}
        toasterMessage={toasterMessage}
        toasterServerity={toasterServerity}
        toasterErrorMessageType={toasterErrorMessageType}
      />
    </Card>
  );
}

// export default NumericDetails;

NumericDetails.propTypes = {
  ListofQuestionsData: PropTypes.array.isRequired,
  DeleteNumericQuestion: PropTypes.func.isRequired,
};

function mapStateToProps(state, ownProps) {
  return {
    ListofQuestionsData: state.questionState,
  };
}

const mapDispatchToProps = {
  DeleteNumericQuestion: QuestionAction.DeleteNumericQuestion,
};

export default connect(mapStateToProps, mapDispatchToProps)(NumericDetails);
