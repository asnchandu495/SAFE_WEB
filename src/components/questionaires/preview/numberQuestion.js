import React, { useState, useEffect } from "react";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import Grid from "@material-ui/core/Grid";

function NumberQuestion(props) {
  //Method on change of answer dropdown e -target element
  function handleChangeAnswer(e) {
    const { name, value } = e.target;
    props.setNumberAnswer((addQuestionData) => ({
      ...props.numberAnswer,
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
                value={props.numberAnswer.answer}
                onChange={handleChangeAnswer}
                className="global-input"
                validators={["matchRegexp:^[0-9]+([.][0-9]+)?$"]}
                errorMessages={["Only numbers and decimals are allowed"]}
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

export default NumberQuestion;
