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

function QuestionTypeSingleSelect(props) {
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

  const handleChangeFlagR = (getSelectedVal, index) => {
    const list = {
      ...props.singleChoiceFlag,
      redFlagForSingleChoice: [
        ...props.singleChoiceFlag.redFlagForSingleChoice.map((con, conIndex) =>
          conIndex == index
            ? {
                ...con,
                ["option"]: getSelectedVal.option,
                ["optionId"]: getSelectedVal.optionId,
              }
            : con
        ),
      ],
    };
    props.setSingleChoiceFlag(list);
  };

  const handleChangeFlagP = (getSelectedVal, index) => {
    const list = {
      ...props.singleChoiceFlag,
      positiveConformitySingleChoice: [
        ...props.singleChoiceFlag.positiveConformitySingleChoice.map(
          (con, conIndex) =>
            conIndex == index
              ? {
                  ...con,
                  ["option"]: getSelectedVal.option,
                  ["optionId"]: getSelectedVal.optionId,
                }
              : con
        ),
      ],
    };
    props.setSingleChoiceFlag(list);
  };

  const handleChangeRedFlagSwitch = (e) => {
    const { name, value } = e.target;
    props.setSingleChoiceFlag((singleChoiceFlag) => ({
      ...props.singleChoiceFlag,
      [name]: e.target.checked,
    }));
  };

  const handleAddClickRedFlag = (index, j) => {
    const list = { ...props.singleChoiceFlag };
    const thisRedFlagSingleChoice = list.redFlagForSingleChoice;
    list.redFlagForSingleChoice = [
      ...thisRedFlagSingleChoice,
      {
        optionId: "",
        option: "",
      },
    ];
    props.setSingleChoiceFlag(list);
  };

  const handleRemoveClickRedFlag = (j) => {
    const list = { ...props.singleChoiceFlag };
    list.redFlagForSingleChoice.splice(j, 1);
    props.setSingleChoiceFlag(list);
  };

  const handleAddClickPositiveFlag = (index, j) => {
    const list = { ...props.singleChoiceFlag };
    const thisPositiveFlagSingleChoice = list.positiveConformitySingleChoice;
    list.positiveConformitySingleChoice = [
      ...thisPositiveFlagSingleChoice,
      {
        optionId: "",
        option: "",
      },
    ];
    props.setSingleChoiceFlag(list);
  };

  const handleRemoveClickPositiveFlag = (j) => {
    const list = { ...props.singleChoiceFlag };
    list.positiveConformitySingleChoice.splice(j, 1);
    props.setSingleChoiceFlag(list);
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
                        props.singleChoiceFlag.isPositiveConfirmityRedFlag
                      }
                      name="isPositiveConfirmityRedFlag"
                      onChange={handleChangeRedFlagSwitch}
                    />
                  }
                />
              </Grid>
            </Grid>
            {props.singleChoiceFlag.isPositiveConfirmityRedFlag ? (
              <Grid item container xs={12}>
                <Grid item xs={2}>
                  <label
                    className={
                      props.singleChoiceFlag.isPositiveConfirmityRedFlag
                        ? "required"
                        : ""
                    }
                  >
                    Red Flag Answer
                  </label>
                </Grid>
                <Grid item xs={10}>
                  {props.singleChoiceFlag.redFlagForSingleChoice &&
                  props.singleChoiceFlag.redFlagForSingleChoice.length > 0
                    ? props.singleChoiceFlag.redFlagForSingleChoice.map(
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
                              <Grid item xs={5}>
                                <FormControl variant="outlined" fullWidth>
                                  <Autocomplete
                                    id="tags-outlined"
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
                                    defaultValue={x}
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
                                {props.singleChoiceFlag.redFlagForSingleChoice
                                  .length !== 1 && (
                                  <Tooltip title="Remove">
                                    <CancelIcon
                                      className={`delete-row-icon`}
                                      onClick={() =>
                                        handleRemoveClickRedFlag(i)
                                      }
                                    ></CancelIcon>
                                  </Tooltip>
                                )}
                                {props.singleChoiceFlag.redFlagForSingleChoice
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
            ) : (
              ""
            )}
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={12}>
        <Card className="flag-card flag-card-dynamic flag-card-dynamic-choices">
          <CardContent>
            <Grid item container xs={12}>
              <Grid item xs={2}>
                <label className="required">Positive Conformity</label>
              </Grid>
              <Grid item xs={10}>
                {props.singleChoiceFlag.positiveConformitySingleChoice &&
                props.singleChoiceFlag.positiveConformitySingleChoice.length > 0
                  ? props.singleChoiceFlag.positiveConformitySingleChoice.map(
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
                            <Grid item xs={5}>
                              <FormControl variant="outlined" fullWidth>
                                <Autocomplete
                                  id="tags-outlined"
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
                                  defaultValue={x}
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
                              {props.singleChoiceFlag
                                .positiveConformitySingleChoice.length !==
                                1 && (
                                <Tooltip title="Remove">
                                  <CancelIcon
                                    className={`delete-row-icon`}
                                    onClick={() =>
                                      handleRemoveClickPositiveFlag(i)
                                    }
                                  ></CancelIcon>
                                </Tooltip>
                              )}
                              {props.singleChoiceFlag
                                .positiveConformitySingleChoice.length -
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

export default QuestionTypeSingleSelect;
