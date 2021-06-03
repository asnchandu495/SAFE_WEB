import React, { useState, useEffect } from "react";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import Grid from "@material-ui/core/Grid";

function ShorttextQuestion(props) {
  function handleChangeAnswer(e) {
    const { name, value } = e.target;
    props.setShorttextAnswer((addQuestionData) => ({
      ...props.shorttextAnswer,
      [name]: value,
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
              <TextValidator
                variant="outlined"
                fullWidth
                placeholder="Your answer"
                name="answer"
                value={props.shorttextAnswer.answer}
                onChange={handleChangeAnswer}
                className="global-input"
                validators={["required", "matchRegexp:^.{0,200}$"]}
                errorMessages={[
                  "Please enter question",
                  "Maximum 200 characters",
                ]}
                InputLabelProps={{ shrink: false }}
              />
            </Grid>
          </Grid>
        </div>
      ) : (
        ""
      )}
    </>
  );
}

export default ShorttextQuestion;
