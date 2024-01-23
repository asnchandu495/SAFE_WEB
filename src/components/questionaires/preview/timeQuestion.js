import React, { useState, useEffect } from "react";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import Grid from "@material-ui/core/Grid";
import "date-fns";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import moment from "moment";

function TimeQuestion(props) {
  //Method on change of answer dropdown e -target element
  function handleChangeAnswer(date, name) {
    props.setTimeAnswer((addQuestionData) => ({
      ...props.timeAnswer,
      [name]: date,
    }));
  }

  return (
    <>
      {props ? (
        <div>
          <Grid container item xs={12} spacing={3} direction="column">
            <Grid item xs={12} container>
              <label>Q) {props.currentQuestion.question}</label>
            </Grid>
            <Grid item xs={12} container>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <Grid item xs={3} className="date-time-pickers">
                  <KeyboardTimePicker
                    format={
                      props.loadGlobalSettingsData
                        ? props.loadGlobalSettingsData.timeFormat != null
                          ? props.loadGlobalSettingsData.timeFormat
                          : "hh:mm"
                        : "hh:mm"
                    }
                    ampm={
                      props.loadGlobalSettingsData
                        ? props.loadGlobalSettingsData.timeFormat != null
                          ? props.loadGlobalSettingsData.timeFormat.includes(
                              "HH"
                            )
                            ? false
                            : true
                          : true
                        : true
                    }
                    fullWidth
                    id={`answer`}
                    placeholder="Your answer"
                    name="answer"
                    label="Answer"
                    value={props.timeAnswer.answer}
                    onChange={(date, event, e) =>
                      handleChangeAnswer(date, "answer")
                    }
                    className="global-input"
                    KeyboardButtonProps={{
                      "aria-label": "change date",
                    }}
                  />
                </Grid>
              </MuiPickersUtilsProvider>
            </Grid>
          </Grid>
        </div>
      ) : (
        ""
      )}
    </>
  );
}

export default TimeQuestion;
