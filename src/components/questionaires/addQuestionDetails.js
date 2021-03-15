import React, { useState, useEffect } from "react";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Grid from "@material-ui/core/Grid";
import { TextValidator } from "react-material-ui-form-validator";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { withStyles } from "@material-ui/core/styles";
import Switch from "@material-ui/core/Switch";

function AddQuestionDetails(props) {
  useEffect(() => {}, []);

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
                "Please enter first name",
                "Only alphabets are allowed",
                "Maximum 50 characters",
              ]}
              fullWidth
              id="firstName"
              placeholder="Question..."
              name="firstName"
              value=""
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
              value=""
              className="global-input global-input-multiline"
              InputLabelProps={{ shrink: false }}
            />
          </Grid>
          <Grid item xs={12} sm={12} className="m-top-10">
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
          </Grid>
        </Grid>
        <Grid item xs={12} sm={12} className="question-flags">
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
                        control={
                          <PurpleSwitch checked={true} name="checkedA" />
                        }
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
                              <MenuItem
                                value={aType.id}
                                key={`atypered_${aType.id}`}
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
            <Grid item xs={12} sm={6}>
              <Card className="flag-card">
                <CardContent>
                  <Grid item container xs={12}>
                    <Grid item xs={5}>
                      <label className="required">Red Flag</label>
                    </Grid>
                    <Grid item xs={7}>
                      <FormControlLabel
                        control={
                          <PurpleSwitch checked={true} name="checkedA" />
                        }
                      />
                    </Grid>
                  </Grid>
                  <Grid item container xs={12}>
                    <Grid item xs={5}>
                      <label className="required">
                        Positive Confirmity Answer
                      </label>
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
        </Grid>
      </Grid>
    </CardContent>
  );
}

export default AddQuestionDetails;
