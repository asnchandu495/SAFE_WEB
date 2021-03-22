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
    { id: "001", name: "TRUE" },
    { id: "002", name: "FALSE" },
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
              <Grid item xs={6}>
                <label className="required">Red Flag</label>
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
                    {props.booleanFlag.redFlagResponse != ""
                      ? ""
                      : "Answer type"}
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-outlined-label"
                    id="demo-simple-select-outlined"
                    value={props.booleanFlag.redFlagResponse}
                    name="redFlagResponse"
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
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6}>
        <Card className="flag-card">
          <CardContent>
            <Grid item container xs={12}>
              <Grid item xs={6}>
                <label className="required">Positive Confirmity Answer</label>
              </Grid>
              <Grid item xs={6}>
                <FormControl variant="outlined" fullWidth>
                  <InputLabel
                    id="demo-simple-select-outlined-label"
                    shrink={false}
                    className="select-label"
                  >
                    {props.booleanFlag.positiveRedFlagResponse != ""
                      ? ""
                      : "Answer type"}
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-outlined-label"
                    id="demo-simple-select-outlined"
                    value={props.booleanFlag.positiveRedFlagResponse}
                    name="positiveRedFlagResponse"
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