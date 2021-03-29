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

import ConfirmationDialog from "../../common/confirmdialogbox";

function TimeDetails(props) {
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
              ></Button>
            </Tooltip>
            <Tooltip title="Conditional jump">
              <Button
                variant="contained"
                color="default"
                startIcon={<SettingsIcon />}
                className={`view-icon`}
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
                <label>positiveConformityForTime :</label>
              </Grid>
              <Grid item xs={9}>
                <label>
                  {props.selectedQuestionDetails.positiveConformityForTime
                    .length > 0
                    ? props.selectedQuestionDetails.positiveConformityForTime[0]
                        .expressionType
                    : "dfddfs"}
                </label>
              </Grid>
            </Grid>

            <Grid item xs={12} container>
              <Grid item xs={3}>
                <label>ticks :</label>
              </Grid>
              <Grid item xs={9}>
                <label>
                  {props.selectedQuestionDetails.positiveConformityForTime
                    .length > 0
                    ? props.selectedQuestionDetails.positiveConformityForTime[0]
                        .forAnswer.ticks
                    : "dfddfs"}
                </label>
              </Grid>
            </Grid>

            <Grid item xs={12} container>
              <Grid item xs={3}>
                <label>days :</label>
              </Grid>
              <Grid item xs={9}>
                <label>
                  {props.selectedQuestionDetails.positiveConformityForTime
                    .length > 0
                    ? props.selectedQuestionDetails.positiveConformityForTime[0]
                        .forAnswer.days
                    : "dfddfs"}
                </label>
              </Grid>
            </Grid>

            <Grid item xs={12} container>
              <Grid item xs={3}>
                <label>seconds :</label>
              </Grid>
              <Grid item xs={9}>
                <label>
                  {props.selectedQuestionDetails.positiveConformityForTime
                    .length > 0
                    ? props.selectedQuestionDetails.positiveConformityForTime[0]
                        .forAnswer.seconds
                    : "dfddfs"}
                </label>
              </Grid>
            </Grid>
            <Grid item xs={12} container>
              <Grid item xs={3}>
                <label>Hours :</label>
              </Grid>
              <Grid item xs={9}>
                <label>
                  {props.selectedQuestionDetails.positiveConformityForTime
                    .length > 0
                    ? props.selectedQuestionDetails.positiveConformityForTime[0]
                        .forAnswer.hours
                    : "dfddfs"}
                </label>
              </Grid>
            </Grid>
            <Grid item xs={12} container>
              <Grid item xs={3}>
                <label>Minutes :</label>
              </Grid>
              <Grid item xs={9}>
                <label>
                  {props.selectedQuestionDetails.positiveConformityForTime
                    .length > 0
                    ? props.selectedQuestionDetails.positiveConformityForTime[0]
                        .forAnswer.minutes
                    : "dfddfs"}
                </label>
              </Grid>
            </Grid>
            <Grid item xs={12} container>
              <Grid item xs={3}>
                <label>milliseconds :</label>
              </Grid>
              <Grid item xs={9}>
                <label>
                  {props.selectedQuestionDetails.positiveConformityForTime
                    .length > 0
                    ? props.selectedQuestionDetails.positiveConformityForTime[0]
                        .forAnswer.milliseconds
                    : "dfddfs"}
                </label>
              </Grid>
            </Grid>
            <Grid item xs={12} container>
              <Grid item xs={3}>
                <label>totalDays :</label>
              </Grid>
              <Grid item xs={9}>
                <label>
                  {props.selectedQuestionDetails.positiveConformityForTime
                    .length > 0
                    ? props.selectedQuestionDetails.positiveConformityForTime[0]
                        .forAnswer.totalDays
                    : "dfddfs"}
                </label>
              </Grid>
            </Grid>
            <Grid item xs={12} container>
              <Grid item xs={3}>
                <label>totalHours :</label>
              </Grid>
              <Grid item xs={9}>
                <label>
                  {props.selectedQuestionDetails.positiveConformityForTime
                    .length > 0
                    ? props.selectedQuestionDetails.positiveConformityForTime[0]
                        .forAnswer.totalHours
                    : "dfddfs"}
                </label>
              </Grid>
            </Grid>
            <Grid item xs={12} container>
              <Grid item xs={3}>
                <label>totalMilliseconds :</label>
              </Grid>
              <Grid item xs={9}>
                <label>
                  {props.selectedQuestionDetails.positiveConformityForTime
                    .length > 0
                    ? props.selectedQuestionDetails.positiveConformityForTime[0]
                        .forAnswer.totalMilliseconds
                    : "dfddfs"}
                </label>
              </Grid>
            </Grid>
            <Grid item xs={12} container>
              <Grid item xs={3}>
                <label>totalMinutes :</label>
              </Grid>
              <Grid item xs={9}>
                <label>
                  {props.selectedQuestionDetails.positiveConformityForTime
                    .length > 0
                    ? props.selectedQuestionDetails.positiveConformityForTime[0]
                        .forAnswer.totalMinutes
                    : "dfddfs"}
                </label>
              </Grid>
            </Grid>
            <Grid item xs={12} container>
              <Grid item xs={3}>
                <label>totalSeconds :</label>
              </Grid>
              <Grid item xs={9}>
                <label>
                  {props.selectedQuestionDetails.positiveConformityForTime
                    .length > 0
                    ? props.selectedQuestionDetails.positiveConformityForTime[0]
                        .forAnswer.totalSeconds
                    : "dfddfs"}
                </label>
              </Grid>
            </Grid>

            <Grid item xs={12} container>
              <Grid item xs={3}>
                <label>forRangeEnd: :</label>
              </Grid>
              <Grid item xs={9}>
                <label>
                  {props.selectedQuestionDetails.redFlagForTime.length > 0
                    ? props.selectedQuestionDetails.redFlagForTime[0]
                        .forRangeEnd.days
                    : "dfddfs"}
                </label>
              </Grid>
            </Grid>

            <Grid item xs={12} container>
              <Grid item xs={3}>
                <label>forRangeEnd: ticks:</label>
              </Grid>
              <Grid item xs={9}>
                <label>
                  {props.selectedQuestionDetails.redFlagForTime.length > 0
                    ? props.selectedQuestionDetails.redFlagForTime[0]
                        .forRangeEnd.ticks
                    : "dfddfs"}
                </label>
              </Grid>
            </Grid>

            <Grid item xs={12} container>
              <Grid item xs={3}>
                <label>forRangeEnd: hours:</label>
              </Grid>
              <Grid item xs={9}>
                <label>
                  {props.selectedQuestionDetails.redFlagForTime.length > 0
                    ? props.selectedQuestionDetails.redFlagForTime[0]
                        .forRangeEnd.hours
                    : "dfddfs"}
                </label>
              </Grid>
            </Grid>

            <Grid item xs={12} container>
              <Grid item xs={3}>
                <label>forRangeEnd: milliseconds:</label>
              </Grid>
              <Grid item xs={9}>
                <label>
                  {props.selectedQuestionDetails.redFlagForTime.length > 0
                    ? props.selectedQuestionDetails.redFlagForTime[0]
                        .forRangeEnd.milliseconds
                    : "dfddfs"}
                </label>
              </Grid>
            </Grid>

            <Grid item xs={12} container>
              <Grid item xs={3}>
                <label>forRangeEnd: minutes:</label>
              </Grid>
              <Grid item xs={9}>
                <label>
                  {props.selectedQuestionDetails.redFlagForTime.length > 0
                    ? props.selectedQuestionDetails.redFlagForTime[0]
                        .forRangeEnd.minutes
                    : "dfddfs"}
                </label>
              </Grid>
            </Grid>
            <Grid item xs={12} container>
              <Grid item xs={3}>
                <label>forRangeEnd: seconds:</label>
              </Grid>
              <Grid item xs={9}>
                <label>
                  {props.selectedQuestionDetails.redFlagForTime.length > 0
                    ? props.selectedQuestionDetails.redFlagForTime[0]
                        .forRangeEnd.seconds
                    : "dfddfs"}
                </label>
              </Grid>
            </Grid>

            <Grid item xs={12} container>
              <Grid item xs={3}>
                <label>forRangeEnd: totalDays:</label>
              </Grid>
              <Grid item xs={9}>
                <label>
                  {props.selectedQuestionDetails.redFlagForTime.length > 0
                    ? props.selectedQuestionDetails.redFlagForTime[0]
                        .forRangeEnd.totalDays
                    : "dfddfs"}
                </label>
              </Grid>
            </Grid>

            <Grid item xs={12} container>
              <Grid item xs={3}>
                <label>forRangeEnd: totalHours:</label>
              </Grid>
              <Grid item xs={9}>
                <label>
                  {props.selectedQuestionDetails.redFlagForTime.length > 0
                    ? props.selectedQuestionDetails.redFlagForTime[0]
                        .forRangeEnd.totalHours
                    : "dfddfs"}
                </label>
              </Grid>
            </Grid>

            <Grid item xs={12} container>
              <Grid item xs={3}>
                <label>forRangeEnd: totalMilliseconds:</label>
              </Grid>
              <Grid item xs={9}>
                <label>
                  {props.selectedQuestionDetails.redFlagForTime.length > 0
                    ? props.selectedQuestionDetails.redFlagForTime[0]
                        .forRangeEnd.totalMilliseconds
                    : "dfddfs"}
                </label>
              </Grid>
            </Grid>

            <Grid item xs={12} container>
              <Grid item xs={3}>
                <label>forRangeEnd: totalMinutes:</label>
              </Grid>
              <Grid item xs={9}>
                <label>
                  {props.selectedQuestionDetails.redFlagForTime.length > 0
                    ? props.selectedQuestionDetails.redFlagForTime[0]
                        .forRangeEnd.totalMinutes
                    : "dfddfs"}
                </label>
              </Grid>
            </Grid>

            <Grid item xs={12} container>
              <Grid item xs={3}>
                <label>forRangeEnd: totalSeconds:</label>
              </Grid>
              <Grid item xs={9}>
                <label>
                  {props.selectedQuestionDetails.redFlagForTime.length > 0
                    ? props.selectedQuestionDetails.redFlagForTime[0]
                        .forRangeEnd.totalSeconds
                    : "dfddfs"}
                </label>
              </Grid>
            </Grid>

            <Grid item xs={12} container>
              <Grid item xs={3}>
                <label>redFlagForTime:</label>
              </Grid>
              <Grid item xs={9}>
                <label>
                  {props.selectedQuestionDetails.redFlagForTime &&
                  props.selectedQuestionDetails.redFlagForTime.length > 0
                    ? props.selectedQuestionDetails.redFlagForTime
                        .expressionType
                    : []}
                </label>
              </Grid>
            </Grid>

            <Grid item xs={12} container>
              <Grid item xs={3}>
                <label>ticks :</label>
              </Grid>
              <Grid item xs={9}>
                <label>
                  {props.selectedQuestionDetails.redFlagForTime.length > 0
                    ? props.selectedQuestionDetails.redFlagForTime[0].forAnswer
                        .ticks
                    : "dfddfs"}
                </label>
              </Grid>
            </Grid>

            <Grid item xs={12} container>
              <Grid item xs={3}>
                <label>days :</label>
              </Grid>
              <Grid item xs={9}>
                <label>
                  {props.selectedQuestionDetails.redFlagForTime.length > 0
                    ? props.selectedQuestionDetails.redFlagForTime[0].forAnswer
                        .days
                    : "dfddfs"}
                </label>
              </Grid>
            </Grid>

            <Grid item xs={12} container>
              <Grid item xs={3}>
                <label>hours :</label>
              </Grid>
              <Grid item xs={9}>
                <label>
                  {props.selectedQuestionDetails.redFlagForTime.length > 0
                    ? props.selectedQuestionDetails.redFlagForTime[0].forAnswer
                        .hours
                    : "dfddfs"}
                </label>
              </Grid>
            </Grid>

            <Grid item xs={12} container>
              <Grid item xs={3}>
                <label>milliseconds :</label>
              </Grid>
              <Grid item xs={9}>
                <label>
                  {props.selectedQuestionDetails.redFlagForTime.length > 0
                    ? props.selectedQuestionDetails.redFlagForTime[0].forAnswer
                        .milliseconds
                    : "dfddfs"}
                </label>
              </Grid>
            </Grid>

            <Grid item xs={12} container>
              <Grid item xs={3}>
                <label>minutes :</label>
              </Grid>
              <Grid item xs={9}>
                <label>
                  {props.selectedQuestionDetails.redFlagForTime.length > 0
                    ? props.selectedQuestionDetails.redFlagForTime[0].forAnswer
                        .minutes
                    : "dfddfs"}
                </label>
              </Grid>
            </Grid>

            <Grid item xs={12} container>
              <Grid item xs={3}>
                <label>seconds :</label>
              </Grid>
              <Grid item xs={9}>
                <label>
                  {props.selectedQuestionDetails.redFlagForTime.length > 0
                    ? props.selectedQuestionDetails.redFlagForTime[0].forAnswer
                        .seconds
                    : "dfddfs"}
                </label>
              </Grid>
            </Grid>

            <Grid item xs={12} container>
              <Grid item xs={3}>
                <label>totalDays :</label>
              </Grid>
              <Grid item xs={9}>
                <label>
                  {props.selectedQuestionDetails.redFlagForTime.length > 0
                    ? props.selectedQuestionDetails.redFlagForTime[0].forAnswer
                        .totalDays
                    : "dfddfs"}
                </label>
              </Grid>
            </Grid>

            <Grid item xs={12} container>
              <Grid item xs={3}>
                <label>totalHours :</label>
              </Grid>
              <Grid item xs={9}>
                <label>
                  {props.selectedQuestionDetails.redFlagForTime.length > 0
                    ? props.selectedQuestionDetails.redFlagForTime[0].forAnswer
                        .totalHours
                    : "dfddfs"}
                </label>
              </Grid>
            </Grid>
            <Grid item xs={12} container>
              <Grid item xs={3}>
                <label>totalMilliseconds :</label>
              </Grid>
              <Grid item xs={9}>
                <label>
                  {props.selectedQuestionDetails.redFlagForTime.length > 0
                    ? props.selectedQuestionDetails.redFlagForTime[0].forAnswer
                        .totalMilliseconds
                    : "dfddfs"}
                </label>
              </Grid>
            </Grid>
            <Grid item xs={12} container>
              <Grid item xs={3}>
                <label>totalMinutes :</label>
              </Grid>
              <Grid item xs={9}>
                <label>
                  {props.selectedQuestionDetails.redFlagForTime.length > 0
                    ? props.selectedQuestionDetails.redFlagForTime[0].forAnswer
                        .totalMinutes
                    : "dfddfs"}
                </label>
              </Grid>
            </Grid>

            <Grid item xs={12} container>
              <Grid item xs={3}>
                <label>totalSeconds :</label>
              </Grid>
              <Grid item xs={9}>
                <label>
                  {props.selectedQuestionDetails.redFlagForTime.length > 0
                    ? props.selectedQuestionDetails.redFlagForTime[0].forAnswer
                        .totalSeconds
                    : "dfddfs"}
                </label>
              </Grid>
            </Grid>

            <Grid item xs={12} container>
              <Grid item xs={3}>
                <label>forRangeEnd :</label>
              </Grid>
              <Grid item xs={9}>
                <label>
                  {props.selectedQuestionDetails.redFlagForTime.length > 0
                    ? props.selectedQuestionDetails.redFlagForTime[0].forAnswer
                        .forRangeEnd
                    : ""}
                </label>
              </Grid>
            </Grid>

            <Grid item xs={12} container>
              <Grid item xs={3}>
                <label>forRangeEnd :</label>
              </Grid>
              <Grid item xs={9}>
                <label>
                  {props.selectedQuestionDetails.redFlagForTime.length > 0
                    ? props.selectedQuestionDetails.redFlagForTime[0]
                        .forRangeEnd.ticks
                    : ""}
                </label>
              </Grid>
            </Grid>

            <Grid item xs={12} container>
              <Grid item xs={3}>
                <label>days :</label>
              </Grid>
              <Grid item xs={9}>
                <label>
                  {props.selectedQuestionDetails.redFlagForTime.length > 0
                    ? props.selectedQuestionDetails.redFlagForTime[0]
                        .forRangeEnd.days
                    : ""}
                </label>
              </Grid>
            </Grid>

            <Grid item xs={12} container>
              <Grid item xs={3}>
                <label>hours :</label>
              </Grid>
              <Grid item xs={9}>
                <label>
                  {props.selectedQuestionDetails.redFlagForTime.length > 0
                    ? props.selectedQuestionDetails.redFlagForTime[0]
                        .forRangeEnd.hours
                    : ""}
                </label>
              </Grid>
            </Grid>
            <Grid item xs={12} container>
              <Grid item xs={3}>
                <label>milliseconds :</label>
              </Grid>
              <Grid item xs={9}>
                <label>
                  {props.selectedQuestionDetails.redFlagForTime.length > 0
                    ? props.selectedQuestionDetails.redFlagForTime[0]
                        .forRangeEnd.milliseconds
                    : ""}
                </label>
              </Grid>
            </Grid>
            <Grid item xs={12} container>
              <Grid item xs={3}>
                <label>minutes :</label>
              </Grid>
              <Grid item xs={9}>
                <label>
                  {props.selectedQuestionDetails.redFlagForTime.length > 0
                    ? props.selectedQuestionDetails.redFlagForTime[0]
                        .forRangeEnd.minutes
                    : ""}
                </label>
              </Grid>
            </Grid>
            <Grid item xs={12} container>
              <Grid item xs={3}>
                <label>seconds :</label>
              </Grid>
              <Grid item xs={9}>
                <label>
                  {props.selectedQuestionDetails.redFlagForTime.length > 0
                    ? props.selectedQuestionDetails.redFlagForTime[0]
                        .forRangeEnd.seconds
                    : ""}
                </label>
              </Grid>
            </Grid>
            <Grid item xs={12} container>
              <Grid item xs={3}>
                <label>totalDays :</label>
              </Grid>
              <Grid item xs={9}>
                <label>
                  {props.selectedQuestionDetails.redFlagForTime.length > 0
                    ? props.selectedQuestionDetails.redFlagForTime[0]
                        .forRangeEnd.totalDays
                    : ""}
                </label>
              </Grid>
            </Grid>
            <Grid item xs={12} container>
              <Grid item xs={3}>
                <label>totalHours :</label>
              </Grid>
              <Grid item xs={9}>
                <label>
                  {props.selectedQuestionDetails.redFlagForTime.length > 0
                    ? props.selectedQuestionDetails.redFlagForTime[0]
                        .forRangeEnd.totalHours
                    : ""}
                </label>
              </Grid>
            </Grid>
            <Grid item xs={12} container>
              <Grid item xs={3}>
                <label>totalMilliseconds :</label>
              </Grid>
              <Grid item xs={9}>
                <label>
                  {props.selectedQuestionDetails.redFlagForTime.length > 0
                    ? props.selectedQuestionDetails.redFlagForTime[0]
                        .forRangeEnd.totalMilliseconds
                    : ""}
                </label>
              </Grid>
            </Grid>

            <Grid item xs={12} container>
              <Grid item xs={3}>
                <label>totalMinutes :</label>
              </Grid>
              <Grid item xs={9}>
                <label>
                  {props.selectedQuestionDetails.redFlagForTime.length > 0
                    ? props.selectedQuestionDetails.redFlagForTime[0]
                        .forRangeEnd.totalMinutes
                    : ""}
                </label>
              </Grid>
            </Grid>
            <Grid item xs={12} container>
              <Grid item xs={3}>
                <label>totalSeconds :</label>
              </Grid>
              <Grid item xs={9}>
                <label>
                  {props.selectedQuestionDetails.redFlagForTime.length > 0
                    ? props.selectedQuestionDetails.redFlagForTime[0]
                        .forRangeEnd.totalSeconds
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
