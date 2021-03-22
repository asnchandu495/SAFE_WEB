import React, { useState, useEffect } from "react";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import { TextValidator } from "react-material-ui-form-validator";
import QuestionTypeBollean from "./flagConcepts/booleanFlag";
import QuestionTypeDate from "./flagConcepts/dateFlag";
import QuestionTypeMultiSelect from "./flagConcepts/multiSelectFlag";
import QuestionTypeNumber from "./flagConcepts/numberFlag";
import QuestionTypeSingleSelect from "./flagConcepts/singleSelectFlag";
import QuestionTypeTime from "./flagConcepts/timeFlag";

function AddQuestionDetails(props) {
  useEffect(() => {}, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    props.setAddQuestionBoolean((addQuestionBoolean) => ({
      ...props.addQuestionBoolean,
      [name]: value,
    }));
  };

  return (
    <CardContent>
      <Typography gutterBottom variant="h6" component="h6">
        Question details
      </Typography>
      <Grid item xs={12} sm={12}>
        <Grid item xs={12} sm={12} className="question-details">
          <Grid item xs={12} sm={12}>
            <TextValidator
              variant="outlined"
              validators={[
                "required",
                "matchRegexp:^[a-zA-Z ]*$",
                "matchRegexp:^.{0,50}$",
              ]}
              errorMessages={[
                "Please enter question",
                "Only alphabets are allowed",
                "Maximum 50 characters",
              ]}
              fullWidth
              id="question"
              placeholder="Question..."
              name="question"
              value={props.addQuestionBoolean.question}
              onChange={handleChange}
              autoFocus
              className="global-input"
              InputLabelProps={{ shrink: false }}
            />
          </Grid>
          <Grid item xs={12} sm={12} className="m-top-10">
            <TextValidator
              variant="outlined"
              fullWidth
              id="description"
              placeholder="Add description"
              validators={["matchRegexp:^.{0,150}$"]}
              errorMessages={["Maximum 150 characters"]}
              name="description"
              multiline
              rows={2}
              value={props.addQuestionBoolean.description}
              onChange={handleChange}
              className="global-input global-input-multiline"
              InputLabelProps={{ shrink: false }}
            />
          </Grid>
          {/* <Grid item xs={12} sm={12} className="m-top-10">
            <TextValidator
              variant="outlined"
              validators={[
                "required",
                "matchRegexp:^[a-zA-Z ]*$",
                "matchRegexp:^.{0,50}$",
              ]}
              errorMessages={[
                "Please enter first name",
                "Only alphabets are allowed",
                "Maximum 50 characters",
              ]}
              fullWidth
              id="firstName"
              placeholder="Answers. Comma separated"
              name="firstName"
              value=""
              autoFocus
              className="global-input"
              InputLabelProps={{ shrink: false }}
            />
          </Grid> */}
        </Grid>
        <Grid item xs={12} sm={12} className="question-flags">
          <QuestionTypeBollean
            setAddQuestionBoolean={props.setAddQuestionBoolean}
            addQuestionBoolean={props.addQuestionBoolean}
            answerTypes={props.answerTypes}
          ></QuestionTypeBollean>
        </Grid>
      </Grid>
    </CardContent>
  );
}

export default AddQuestionDetails;
