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
import Input from "@material-ui/core/Input";
import ListItemText from "@material-ui/core/ListItemText";
import Checkbox from "@material-ui/core/Checkbox";

function QuestionTypeMultiSelect(props) {
  const [answersToSelect, setAnswersToSelect] = useState([
    { id: "001", name: "Option 1" },
    { id: "002", name: "Option 2" },
    { id: "003", name: "Option 3" },
    { id: "004", name: "Option 4" },
  ]);
  const [personName, setPersonName] = React.useState([]);

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

  const handleChangeMultiple = (event) => {
    setPersonName(event.target.value);
  };

  return (
    <Grid item container xs={12} spacing={1} className="flag-container">
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
                      : "Red Flag Answer Type"}
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-outlined-label"
                    id="demo-simple-select-outlined"
                    value={props.addQuestion.redFlagAnswerType}
                    name="redFlagAnswerType"
                    onChange={handleChange}
                    placeholder="Red Flag Answer Type"
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
                    {/* {personName.length > 0 ? "" : "Answer type"} */}
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-outlined-label"
                    id="demo-simple-select-outlined"
                    value={personName}
                    name="positiveFlagAnswerType"
                    onChange={handleChangeMultiple}
                    // placeholder="Answer type"
                    InputLabelProps={{
                      shrink: false,
                    }}
                    className="global-input single-select"
                    multiple
                    input={<Input />}
                    renderValue={(selected) => selected.join(", ")}
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
                          <Checkbox
                            checked={personName.indexOf(ans.name) > -1}
                          />
                          <ListItemText primary={ans.name} />
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

export default QuestionTypeMultiSelect;
