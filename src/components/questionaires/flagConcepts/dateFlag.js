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
import { TextValidator } from "react-material-ui-form-validator";
import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward";
import InputAdornment from "@material-ui/core/InputAdornment";

function QuestionTypeDate(props) {
  const [answerTypes, setAnswerTypes] = useState([
    { id: "001", name: "=" },
    { id: "002", name: ">" },
    { id: "003", name: ">=" },
    { id: "004", name: "<" },
    { id: "005", name: "<=" },
    { id: "006", name: "Range" },
  ]);

  const PurpleSwitch = withStyles({
    switchBase: {
      color: "#be1d56",
      "&$checked": {
        color: "#26235d",
      },
      "&$checked + $track": {
        backgroundColor: "#26235d",
      },
    },
    checked: {},
    track: {},
  })(Switch);

  const handleChangeFlagR = (e) => {
    const { name, value } = e.target;
    props.setDatetimeFlag((prevState) => ({
      ...prevState,
      redFlagForDate: {
        ...prevState.redFlagForDate,
        [name]: value,
      },
    }));
  };

  const handleChangeFlagP = (e) => {
    const { name, value } = e.target;
    props.setDatetimeFlag((prevState) => ({
      ...prevState,
      positiveConformityForDate: {
        ...prevState.positiveConformityForDate,
        [name]: value,
      },
    }));
  };

  const handleChangeRedFlagSwitch = (e) => {
    const { name, value } = e.target;
    props.setDatetimeFlag((booleanFlag) => ({
      ...props.datetimeFlag,
      [name]: e.target.checked,
    }));
  };

  return (
    <Grid item container xs={12} spacing={1} className="flag-container">
      <Grid item xs={12} sm={6}>
        <Card className="flag-card">
          <CardContent>
            <Grid item container xs={12}>
              <Grid item xs={6}>
                <label className="required">Red Flag</label>
              </Grid>
              <Grid item xs={6}>
                <FormControlLabel
                  control={
                    <PurpleSwitch
                      checked={props.datetimeFlag.isPositiveConfirmityRedFlag}
                      name="isPositiveConfirmityRedFlag"
                      onChange={handleChangeRedFlagSwitch}
                    />
                  }
                />
              </Grid>
            </Grid>
            <Grid item container xs={12}>
              <Grid item xs={6}>
                <label className="required">Red Flag Answer</label>
              </Grid>
              <Grid item xs={6}>
                <FormControl variant="outlined" fullWidth>
                  <InputLabel
                    id="demo-simple-select-outlined-label"
                    shrink={false}
                    className="select-label"
                  >
                    {props.datetimeFlag.redFlagForDate.expressionType &&
                    props.datetimeFlag.redFlagForDate.expressionType != ""
                      ? ""
                      : "Answer type"}
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-outlined-label"
                    id="demo-simple-select-outlined"
                    value={
                      props.datetimeFlag.redFlagForDate.expressionType
                        ? props.datetimeFlag.redFlagForDate.expressionType
                        : ""
                    }
                    name="expressionType"
                    onChange={handleChangeFlagR}
                    placeholder="Answer type"
                    InputLabelProps={{
                      shrink: false,
                    }}
                    className="global-input single-select"
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    {answerTypes.map((aType) => {
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
            <Grid item container xs={12}>
              <Grid item xs={6}>
                <label>&nbsp;</label>
              </Grid>
              <Grid item xs={6} className="arrow-container">
                <ArrowDownwardIcon></ArrowDownwardIcon>
              </Grid>
            </Grid>
            <Grid item container xs={12}>
              <Grid item xs={6}>
                <label>&nbsp;</label>
              </Grid>
              <Grid item xs={6}>
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
                  placeholder="Your answer"
                  name="firstName"
                  value=""
                  autoFocus
                  className="global-input"
                  InputLabelProps={{ shrink: false }}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6}>
        <Card className="flag-card">
          <CardContent>
            <Grid item container xs={12}>
              <Grid item xs={6}>
                <label className="required">Positive Confirmity</label>
              </Grid>
              <Grid item xs={6}>
                <FormControl variant="outlined" fullWidth>
                  <InputLabel
                    id="demo-simple-select-outlined-label1"
                    shrink={false}
                    className="select-label"
                  >
                    {props.datetimeFlag.positiveConformityForDate
                      .expressionType &&
                    props.datetimeFlag.positiveConformityForDate
                      .expressionType != ""
                      ? ""
                      : "Answer type"}
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-outlined-label1"
                    id="demo-simple-select-outlined"
                    value={
                      props.datetimeFlag.positiveConformityForDate
                        .expressionType
                        ? props.datetimeFlag.positiveConformityForDate
                            .expressionType
                        : ""
                    }
                    name="expressionType"
                    onChange={handleChangeFlagP}
                    placeholder="Answer type"
                    InputLabelProps={{
                      shrink: false,
                    }}
                    className="global-input single-select"
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    {answerTypes.map((aType) => {
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
            <Grid item container xs={12}>
              <Grid item xs={6}>
                <label>&nbsp;</label>
              </Grid>
              <Grid item xs={6} className="arrow-container">
                <ArrowDownwardIcon></ArrowDownwardIcon>
              </Grid>
            </Grid>
            <Grid item container xs={12}>
              <Grid item xs={6}>
                <label>&nbsp;</label>
              </Grid>
              <Grid item xs={6} className="range-input">
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
                  placeholder="Your answer"
                  name="firstName"
                  value=""
                  autoFocus
                  className="global-input"
                  InputLabelProps={{ shrink: false }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment
                        position="start"
                        className="adornment-input"
                      >
                        From{" "}
                      </InputAdornment>
                    ),
                  }}
                />
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
                  placeholder="Your answer"
                  name="firstName"
                  value=""
                  autoFocus
                  className="global-input"
                  InputLabelProps={{ shrink: false }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment
                        position="start"
                        className="adornment-input"
                      >
                        To{" "}
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}

export default QuestionTypeDate;
