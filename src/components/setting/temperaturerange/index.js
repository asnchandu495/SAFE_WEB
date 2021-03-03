import React, { useState } from "react";
import Grid from "@material-ui/core/Grid";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import HomeIcon from "@material-ui/icons/Home";
import WbSunnyIcon from "@material-ui/icons/WbSunny";
import Link from "@material-ui/core/Link";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import { makeStyles } from "@material-ui/core/styles";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Button from "@material-ui/core/Button";
import InputLabel from "@material-ui/core/InputLabel";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import CancelIcon from "@material-ui/icons/Cancel";
import Paper from "@material-ui/core/Paper";
import Tooltip from "@material-ui/core/Tooltip";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import InputAdornment from "@material-ui/core/InputAdornment";

const useStyles = makeStyles((theme) => ({
  gridDispaly: {
    display: "inline-flex",
  },
}));

function TemperatureRange(props) {
  const classes = useStyles();

  const [temperatureConfigForm, setTemperatureConfigForm] = useState([
    {
      id: "",
      covidState: "",
      lowerLimit: "",
      upperLimit: "",
    },
  ]);
  const [covidStates, setCovidState] = useState([
    {
      id: "001",
      stateName: "Safe",
    },
    {
      id: "002",
      stateName: "Suspected",
    },
    {
      id: "003",
      stateName: "Confirmed",
    },
  ]);

  function submitForm(e) {
    e.preventDefault();
    console.log(JSON.stringify(temperatureConfigForm));
  }

  // handle input change
  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    const list = [...temperatureConfigForm];
    list[index][name] = value;
    setTemperatureConfigForm(list);
  };

  // handle click event of the Remove button
  const handleRemoveClick = (index) => {
    const list = [...temperatureConfigForm];
    list.splice(index, 1);
    setTemperatureConfigForm(list);
  };

  // handle click event of the Add button
  const handleAddClick = () => {
    setTemperatureConfigForm([
      ...temperatureConfigForm,
      {
        id: Math.random().toString(36).substring(7),
        covidState: "",
        lowerLimit: "",
        upperLimit: "",
      },
    ]);
  };

  return (
    <div className="innerpage-container">
      <Breadcrumbs aria-label="breadcrumb" className="breadcrumb">
        <Link color="inherit" href="#">
          <HomeIcon className="breadcrumb-icon" />
          Home
        </Link>
        <Link color="inherit" href="#">
          <WbSunnyIcon className="breadcrumb-icon" />
          Temperature range for covid state
        </Link>
      </Breadcrumbs>
      <Paper className="main-paper">
        <ValidatorForm
          className={`auth-form ${classes.form}`}
          onSubmit={submitForm}
        >
          {temperatureConfigForm.map((x, i) => {
            return (
              <Grid container spacing={3}>
                <Grid item xs={3}>
                  <FormControl
                    variant="outlined"
                    className={classes.formControl}
                    fullWidth
                  >
                    <InputLabel id="demo-simple-select-outlined-label">
                      {" "}
                      Select state
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-outlined-label"
                      id="demo-simple-select-outlined"
                      label="Select state"
                      name="covidState"
                      value={x.covidState}
                      onChange={(e) => handleInputChange(e, i)}
                    >
                      <MenuItem value="">None</MenuItem>
                      {covidStates.length > 0
                        ? covidStates.map((cState) => {
                            return (
                              <MenuItem value={cState.id}>
                                {cState.stateName}
                              </MenuItem>
                            );
                          })
                        : ""}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={2}>
                  <TextValidator
                    variant="outlined"
                    validators={["required"]}
                    errorMessages={["Please enter lower limit"]}
                    margin="normal"
                    fullWidth
                    id={`lowerLimit_${i}`}
                    label="Lower limit"
                    name="lowerLimit"
                    value={x.lowerLimit}
                    onChange={(e) => handleInputChange(e, i)}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">F</InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={2} className="no-limit-container">
                  <TextValidator
                    variant="outlined"
                    validators={["required"]}
                    errorMessages={["Please enter upper limit"]}
                    margin="normal"
                    fullWidth
                    id={`upperLimit_${i}`}
                    label="Upper Limit"
                    name="upperLimit"
                    value={x.upperLimit}
                    onChange={(e) => handleInputChange(e, i)}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">F</InputAdornment>
                      ),
                    }}
                  />
                  {i > 0 && (
                    <FormControlLabel
                      control={<Checkbox name="checkedA" />}
                      label="No limit"
                    />
                  )}
                </Grid>
                <Grid item xs={2} className="row-icons-container">
                  {temperatureConfigForm.length !== 1 && (
                    <Tooltip title="Remove">
                      <CancelIcon
                        className={`delete-row-icon`}
                        onClick={() => handleRemoveClick(i)}
                      ></CancelIcon>
                    </Tooltip>
                  )}
                  {temperatureConfigForm.length - 1 === i && (
                    <Tooltip title="Add">
                      <AddCircleIcon
                        className={`add-row-icon`}
                        onClick={handleAddClick}
                      ></AddCircleIcon>
                    </Tooltip>
                  )}
                </Grid>
              </Grid>
            );
          })}
          <span>&nbsp;</span>
          <div className="form-buttons-container">
            <Button variant="contained" color="default" type="reset">
              Cancel
            </Button>
            <Button variant="contained" color="primary" type="submit">
              Save
            </Button>
          </div>
        </ValidatorForm>
      </Paper>
    </div>
  );
}

export default TemperatureRange;
