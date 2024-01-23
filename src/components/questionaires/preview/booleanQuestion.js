import React, { useState, useEffect } from "react";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import Grid from "@material-ui/core/Grid";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";

function BooleanQuestion(props) {
  const [booleanOptions, setBooleanOptions] = useState([
    { id: "true", value: "True" },
    { id: "false", value: "False" },
  ]);
  //Method on change of answer dropdown e -target element
  function handleChangeAnswer(e) {
    const { name, value } = e.target;
    props.setBooleanAnswer((addQuestionData) => ({
      ...props.booleanAnswer,
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
              <Grid item xs={6}>
                <FormControl variant="outlined" fullWidth>
                  <InputLabel
                    id="demo-simple-select-outlined-label"
                    shrink={false}
                    className="select-label"
                  >
                    {props.booleanAnswer.answer === "" ? "Select answer" : ""}
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-outlined-label"
                    id="demo-simple-select-outlined"
                    value={props.booleanAnswer.answer}
                    name="answer"
                    onChange={handleChangeAnswer}
                    placeholder="Select answer"
                    InputLabelProps={{
                      shrink: false,
                    }}
                    className="global-input single-select"
                    required
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    {booleanOptions.map((ans) => {
                      return (
                        <MenuItem value={ans.id} key={`atypered_${ans.id}`}>
                          {ans.value}
                        </MenuItem>
                      );
                    })}
                  </Select>
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

export default BooleanQuestion;
