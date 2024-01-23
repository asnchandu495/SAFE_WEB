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

function DateQuestion(props) {
  /**
   * Method to select the date from date picker
   * @param  {} date-date
   * @param  {} name="string"-answer
   */
  function handleChangeAnswer(date, name) {
    props.setDateAnswer((addQuestionData) => ({
      ...props.dateAnswer,
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
                  <KeyboardDatePicker
                    format={"dd/MM/yyyy"}
                    fullWidth
                    id={`answer`}
                    placeholder="Your answer"
                    name="answer"
                    label="Answer"
                    value={props.dateAnswer.answer}
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

export default DateQuestion;
