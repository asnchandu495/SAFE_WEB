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

function TimeDetails(props) {
  const history = useHistory();
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
    if (props.selectedQuestionDetails) {
      console.log(props.selectedQuestionDetails.positiveConformityForTime);
    }
  }, []);

  function handleClickOpenConfirmationModal(value) {
    console.log("time");
    console.log(value);
    setSelectedRowDetails(value);
    setOpenConfirmationModal(true);
    setConfirmationModalActionType("DeleteTimeQuestion");
    setConfirmationHeaderTittle("Delete  Time Question");
    setConfirmationDialogContextText(
      `Are you sure you want to delete ${value.question} ?`
    );
  }

  function handleClickUpdateQuestions(getQueDetails) {
    history.push(
      `/questionaires/add-questions/${getQueDetails.surveyId}/${getQueDetails.id}?type=${getQueDetails.questionType}`
    );
  }

  function handleClickConditional(getQueDetails) {
    history.push(
      `/questionaires/${getQueDetails.surveyId}/conditional/time/${getQueDetails.id}`
    );
  }

  return (
    <Card className="question-type-card">
      <CardContent className="scrollable-card">
        <Typography gutterBottom variant="h6" component="h6">
          View question details
          <div className="action-buttons-container question-actions">
            <Tooltip title="Edit">
              <Button
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

export default TimeDetails;
