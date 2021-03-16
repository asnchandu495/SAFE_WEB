import React, { useState, useEffect } from "react";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { withStyles } from "@material-ui/core/styles";
import Switch from "@material-ui/core/Switch";
import CardContent from "@material-ui/core/CardContent";

function QuestionTypeBollean(props) {
  const PurpleSwitch = withStyles({
    switchBase: {
      color: "red",
      "&$checked": {
        color: "red",
      },
      "&$checked + $track": {
        backgroundColor: "red",
      },
    },
    checked: {},
    track: {},
  })(Switch);

  const handleChange = (e) => {
    const { name, value } = e.target;
    props.setAddQuestion((addQuestion) => ({
      ...props.addQuestion,
      [name]: value,
    }));
  };

  return (
    <Grid item container xs={12} spacing={1}>
      <Grid item xs={12} sm={6}>
        <Card className="flag-card">
          <CardContent>
            <Grid item container xs={12}>
              <Grid item xs={5}>
                <label className="required">Red Flag</label>
              </Grid>
              <Grid item xs={7}>
                <FormControlLabel
                  control={<PurpleSwitch checked={true} name="checkedA" />}
                />
              </Grid>
            </Grid>
            <Grid item container xs={12}>
              <Grid item xs={5}>
                <label className="required">Red Flag Answer</label>
              </Grid>
              <Grid item xs={7}>
                <FormControl variant="outlined" fullWidth>
                  <InputLabel
                    id="demo-simple-select-outlined-label"
                    shrink={false}
                    className="select-label"
                  >
                    {props.addQuestion.redFlagAnswerType != ""
                      ? ""
                      : "Answer type"}
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-outlined-label"
                    id="demo-simple-select-outlined"
                    value={props.addQuestion.redFlagAnswerType}
                    name="redFlagAnswerType"
                    onChange={handleChange}
                    placeholder="Answer type"
                    InputLabelProps={{
                      shrink: false,
                    }}
                    className="global-input single-select"
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    {props.answerTypes.map((aType) => {
                      return (
                        <MenuItem value={aType.id} key={`atypered_${aType.id}`}>
                          {aType.name}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6}>
        <Card className="flag-card">
          <CardContent>
            <Grid item container xs={12}>
              <Grid item xs={5}>
                <label className="required">Red Flag</label>
              </Grid>
              <Grid item xs={7}>
                <FormControlLabel
                  control={<PurpleSwitch checked={true} name="checkedA" />}
                />
              </Grid>
            </Grid>
            <Grid item container xs={12}>
              <Grid item xs={5}>
                <label className="required">Positive Confirmity Answer</label>
              </Grid>
              <Grid item xs={7}>
                <FormControl variant="outlined" fullWidth>
                  <InputLabel
                    id="demo-simple-select-outlined-label"
                    shrink={false}
                    className="select-label"
                  >
                    {props.addQuestion.positiveFlagAnswerType != ""
                      ? ""
                      : "Answer type"}
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-outlined-label"
                    id="demo-simple-select-outlined"
                    value={props.addQuestion.positiveFlagAnswerType}
                    name="positiveFlagAnswerType"
                    onChange={handleChange}
                    placeholder="Answer type"
                    InputLabelProps={{
                      shrink: false,
                    }}
                    className="global-input single-select"
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    {props.answerTypes.map((aType) => {
                      return (
                        <MenuItem
                          value={aType.id}
                          key={`atypepositive${aType.id}`}
                        >
                          {aType.name}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}

export default QuestionTypeBollean;
