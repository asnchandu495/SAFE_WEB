import React, { useState, useEffect } from "react";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import Grid from "@material-ui/core/Grid";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";

function MultiselectQuestion(props) {
  function handleChangeAnswer(e) {
    const { name, value } = e.target;
    props.setSingleselectAnswer((addQuestionData) => ({
      ...props.singleselectAnswer,
      [name]: value,
    }));
  }

  const handleChangeMultiSelectChoices = (getSelectedVal) => {
    const list = {
      ...props.multiselectAnswer,
      answers: getSelectedVal,
    };
    console.log(list);
    props.setMultiselectAnswer(list);
  };

  return (
    <>
      {props ? (
        <div>
          <Grid container item xs={12} spacing={3} direction="column">
            <Grid item xs={12} container>
              <label>Q) {props.currentQuestion.question}</label>
            </Grid>
            <Grid item xs={12} container>
              <Grid item xs={6}>
                <FormControl variant="outlined" fullWidth>
                  <Autocomplete
                    id={`tags-outlinedP`}
                    multiple
                    options={
                      props.currentQuestion.surveyResponseChoices &&
                      props.currentQuestion.surveyResponseChoices.length > 0
                        ? props.currentQuestion.surveyResponseChoices
                        : []
                    }
                    getOptionLabel={(opt) => opt.option}
                    defaultValue={props.multiselectAnswer.answers}
                    onChange={(e, v) => handleChangeMultiSelectChoices(v)}
                    filterSelectedOptions
                    className="global-input autocomplete-select"
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        inputProps={{
                          ...params.inputProps,
                          required: props.multiselectAnswer.answers.length == 0,
                        }}
                        placeholder="Select answer"
                      />
                    )}
                  />
                </FormControl>
              </Grid>
            </Grid>
          </Grid>
        </div>
      ) : (
        ""
      )}
    </>
  );
}

export default MultiselectQuestion;
