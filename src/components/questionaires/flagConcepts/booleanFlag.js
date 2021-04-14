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
  const [answersToSelect, setAnswersToSelect] = useState([
    { id: "TRUE", name: "TRUE" },
    { id: "FALSE", name: "FALSE" },
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    props.setBooleanFlag((booleanFlag) => ({
      ...props.booleanFlag,
      [name]: value,
    }));
  };

  const handleChangeRedFlagSwitch = (e) => {
    const { name, value } = e.target;
    props.setBooleanFlag((booleanFlag) => ({
      ...props.booleanFlag,
      [name]: e.target.checked,
    }));
  };

  return (
    <Grid item container xs={12} spacing={1} className="flag-container">
      <Grid item xs={12} sm={6}>
        <Card className="flag-card">
          <CardContent>
            <Grid item container xs={12}>
              <Grid item xs={4}>
                <label>Red Flag</label>
              </Grid>
              <Grid item xs={6}>
                <FormControlLabel
                  control={
                    <PurpleSwitch
                      checked={props.booleanFlag.isPositiveConfirmityRedFlag}
                      name="isPositiveConfirmityRedFlag"
                      onChange={handleChangeRedFlagSwitch}
                    />
                  }
                />
              </Grid>
            </Grid>
            {props.booleanFlag.isPositiveConfirmityRedFlag ? (
              <Grid item container xs={12}>
                <Grid item xs={4}>
                  <label
                    className={
                      props.booleanFlag.isPositiveConfirmityRedFlag
                        ? "required"
                        : ""
                    }
                  >
                    Red Flag Answer
                  </label>
                </Grid>
                <Grid item xs={6}>
                  <FormControl variant="outlined" fullWidth>
                    <InputLabel
                      id="demo-simple-select-outlined-label"
                      shrink={false}
                      className="select-label"
                    >
                      {props.booleanFlag.positiveResponse != ""
                        ? ""
                        : "Red Flag Answer Type"}
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-outlined-label"
                      id="demo-simple-select-outlined"
                      value={props.booleanFlag.positiveResponse}
                      name="positiveResponse"
                      onChange={handleChange}
                      placeholder="Answer type"
                      InputLabelProps={{
                        shrink: false,
                      }}
                      className="global-input single-select"
                      required={props.booleanFlag.isPositiveConfirmityRedFlag}
                    >
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
                      {answersToSelect.map((ans) => {
                        return (
                          <MenuItem value={ans.id} key={`atypered_${ans.id}`}>
                            {ans.name}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            ) : (
              ""
            )}
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6}>
        <Card className="flag-card">
          <CardContent>
            <Grid item container xs={12}>
              <Grid item xs={6}>
                <label className="required">Positive Conformity Answer</label>
              </Grid>
              <Grid item xs={6}>
                <FormControl variant="outlined" fullWidth>
                  <InputLabel
                    id="demo-simple-select-outlined-label"
                    shrink={false}
                    className="select-label"
                  >
                    {props.booleanFlag.negativeResponse != ""
                      ? ""
                      : "Positive Conformity Answer"}
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-outlined-label"
                    id="demo-simple-select-outlined"
                    value={props.booleanFlag.negativeResponse}
                    name="negativeResponse"
                    onChange={handleChange}
                    placeholder="Answer type"
                    InputLabelProps={{
                      shrink: false,
                    }}
                    className="global-input single-select"
                    required
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    {answersToSelect.map((ans) => {
                      return (
                        <MenuItem
                          value={ans.id}
                          key={`atypepositive_${ans.id}`}
                        >
                          {ans.name}
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
