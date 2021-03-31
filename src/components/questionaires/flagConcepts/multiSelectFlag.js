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
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import Tooltip from "@material-ui/core/Tooltip";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import CancelIcon from "@material-ui/icons/Cancel";

function QuestionTypeMultiSelect(props) {
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

  useEffect(() => {}, []);

  const handleChangeFlagR = (getSelectedVal, index) => {
    console.log(getSelectedVal);
    const list = {
      ...props.multiChoiceFlag,
      redFlagForMultipleChoice: [
        ...props.multiChoiceFlag.redFlagForMultipleChoice.map((con, conIndex) =>
          conIndex == index
            ? {
                options: getSelectedVal,
              }
            : con
        ),
      ],
    };
    props.setMultiChoiceFlag(list);
  };

  const handleChangeFlagP = (getSelectedVal, index) => {
    const list = {
      ...props.multiChoiceFlag,
      positiveConformityMultiChoice: [
        ...props.multiChoiceFlag.positiveConformityMultiChoice.map(
          (con, conIndex) =>
            conIndex == index
              ? {
                  options: getSelectedVal,
                }
              : con
        ),
      ],
    };
    props.setMultiChoiceFlag(list);
  };

  const handleChangeRedFlagSwitch = (e) => {
    const { name, value } = e.target;
    props.setMultiChoiceFlag((multiChoiceFlag) => ({
      ...props.multiChoiceFlag,
      [name]: e.target.checked,
    }));
  };

  const handleAddClickRedFlag = (index, j) => {
    const list = { ...props.multiChoiceFlag };
    const thisRedFlagMultiChoice = list.redFlagForMultipleChoice;
    list.redFlagForMultipleChoice = [
      ...thisRedFlagMultiChoice,
      {
        options: [
          {
            optionId: "",
            option: "",
          },
        ],
      },
    ];
    props.setMultiChoiceFlag(list);
  };

  const handleRemoveClickRedFlag = (j) => {
    const list = { ...props.multiChoiceFlag };
    list.redFlagForMultipleChoice.splice(j, 1);
    props.setMultiChoiceFlag(list);
  };

  const handleAddClickPositiveFlag = (index, j) => {
    const list = { ...props.multiChoiceFlag };
    const thisPositiveFlagMultiChoice = list.positiveConformityMultiChoice;
    list.positiveConformityMultiChoice = [
      ...thisPositiveFlagMultiChoice,
      {
        options: [
          {
            optionId: "",
            option: "",
          },
        ],
      },
    ];
    props.setMultiChoiceFlag(list);
  };

  const handleRemoveClickPositiveFlag = (j) => {
    const list = { ...props.multiChoiceFlag };
    list.positiveConformityMultiChoice.splice(j, 1);
    props.setMultiChoiceFlag(list);
  };

  return (
    <Grid item container xs={12} spacing={1} className="flag-container">
      <Grid item xs={12} sm={12}>
        <Card className="flag-card flag-card-dynamic flag-card-dynamic-choices">
          <CardContent>
            <Grid item container xs={12}>
              <Grid item xs={2}>
                <label className="required">Red Flag</label>
              </Grid>
              <Grid item xs={6}>
                <FormControlLabel
                  control={
                    <PurpleSwitch
                      checked={
                        props.multiChoiceFlag.isPositiveConfirmityRedFlag
                      }
                      name="isPositiveConfirmityRedFlag"
                      onChange={handleChangeRedFlagSwitch}
                    />
                  }
                />
              </Grid>
            </Grid>
            <Grid item container xs={12}>
              <Grid item xs={2}>
                <label className="required">Red Flag Answer</label>
              </Grid>
              <Grid item xs={10}>
                {props.multiChoiceFlag.redFlagForMultipleChoice &&
                props.multiChoiceFlag.redFlagForMultipleChoice.length > 0
                  ? props.multiChoiceFlag.redFlagForMultipleChoice.map(
                      (x, i) => {
                        return (
                          <Grid
                            item
                            container
                            xs={12}
                            spacing={1}
                            key={`redflag-container${i}`}
                            className="dynamic-flag-container"
                          >
                            <Grid item xs={9}>
                              <FormControl variant="outlined" fullWidth>
                                <Autocomplete
                                  id={`tags-outlinedR${i}`}
                                  multiple
                                  options={
                                    props.addQuestionWithChoices
                                      .surveyResponseChoices &&
                                    props.addQuestionWithChoices
                                      .surveyResponseChoices.length > 0
                                      ? props.addQuestionWithChoices
                                          .surveyResponseChoices
                                      : []
                                  }
                                  getOptionLabel={(opt) => opt.option}
                                  defaultValue={x.options}
                                  onChange={(e, v) => handleChangeFlagR(v, i)}
                                  filterSelectedOptions
                                  className="global-input autocomplete-select"
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      variant="outlined"
                                      placeholder="Select answer"
                                    />
                                  )}
                                />
                              </FormControl>
                            </Grid>
                            <Grid item xs={2} className="row-icons-container">
                              {props.multiChoiceFlag.redFlagForMultipleChoice
                                .length !== 1 && (
                                <Tooltip title="Remove">
                                  <CancelIcon
                                    className={`delete-row-icon`}
                                    onClick={() => handleRemoveClickRedFlag(i)}
                                  ></CancelIcon>
                                </Tooltip>
                              )}
                              {props.multiChoiceFlag.redFlagForMultipleChoice
                                .length -
                                1 ===
                                i && (
                                <Tooltip title="Add">
                                  <AddCircleIcon
                                    className={`add-row-icon`}
                                    onClick={handleAddClickRedFlag}
                                  ></AddCircleIcon>
                                </Tooltip>
                              )}
                            </Grid>
                          </Grid>
                        );
                      }
                    )
                  : ""}
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={12}>
        <Card className="flag-card flag-card-dynamic flag-card-dynamic-choices">
          <CardContent>
            <Grid item container xs={12}>
              <Grid item xs={2}>
                <label className="required">Positive Confirmity</label>
              </Grid>
              <Grid item xs={10}>
                {props.multiChoiceFlag.positiveConformityMultiChoice &&
                props.multiChoiceFlag.positiveConformityMultiChoice.length > 0
                  ? props.multiChoiceFlag.positiveConformityMultiChoice.map(
                      (x, i) => {
                        return (
                          <Grid
                            item
                            container
                            xs={12}
                            spacing={1}
                            key={`redflag-container${i}`}
                            className="dynamic-flag-container"
                          >
                            <Grid item xs={9}>
                              <FormControl variant="outlined" fullWidth>
                                <Autocomplete
                                  id={`tags-outlinedP${i}`}
                                  multiple
                                  options={
                                    props.addQuestionWithChoices
                                      .surveyResponseChoices &&
                                    props.addQuestionWithChoices
                                      .surveyResponseChoices.length > 0
                                      ? props.addQuestionWithChoices
                                          .surveyResponseChoices
                                      : []
                                  }
                                  getOptionLabel={(opt) => opt.option}
                                  defaultValue={x.options}
                                  onChange={(e, v) => handleChangeFlagP(v, i)}
                                  filterSelectedOptions
                                  className="global-input autocomplete-select"
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      variant="outlined"
                                      placeholder="Select answer"
                                    />
                                  )}
                                />
                              </FormControl>
                            </Grid>
                            <Grid item xs={2} className="row-icons-container">
                              {props.multiChoiceFlag
                                .positiveConformityMultiChoice.length !== 1 && (
                                <Tooltip title="Remove">
                                  <CancelIcon
                                    className={`delete-row-icon`}
                                    onClick={() =>
                                      handleRemoveClickPositiveFlag(i)
                                    }
                                  ></CancelIcon>
                                </Tooltip>
                              )}
                              {props.multiChoiceFlag
                                .positiveConformityMultiChoice.length -
                                1 ===
                                i && (
                                <Tooltip title="Add">
                                  <AddCircleIcon
                                    className={`add-row-icon`}
                                    onClick={handleAddClickPositiveFlag}
                                  ></AddCircleIcon>
                                </Tooltip>
                              )}
                            </Grid>
                          </Grid>
                        );
                      }
                    )
                  : ""}
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}

export default QuestionTypeMultiSelect;
