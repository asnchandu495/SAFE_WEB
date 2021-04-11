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
import Tooltip from "@material-ui/core/Tooltip";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import CancelIcon from "@material-ui/icons/Cancel";
import moment from "moment";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from "@material-ui/pickers";

function QuestionTypeTime(props) {
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

  const handleChangeFlagR = (date, key, e, index) => {
    if (key != null) {
      const list = {
        ...props.timeFlag,
        redFlagForTime: [
          ...props.timeFlag.redFlagForTime.map((con, conIndex) =>
            conIndex == index ? { ...con, [key]: date } : con
          ),
        ],
      };
      props.setTimeFlag(list);
    } else {
      const { name, value } = e.target;
      const list = {
        ...props.timeFlag,
        redFlagForTime: [
          ...props.timeFlag.redFlagForTime.map((con, conIndex) =>
            conIndex == index ? { ...con, [name]: value } : con
          ),
        ],
      };
      props.setTimeFlag(list);
    }
  };

  const handleChangeFlagP = (date, key, e, index) => {
    if (key != null) {
      const list = {
        ...props.timeFlag,
        positiveConformityForTime: [
          ...props.timeFlag.positiveConformityForTime.map((con, conIndex) =>
            conIndex == index ? { ...con, [key]: date } : con
          ),
        ],
      };
      props.setTimeFlag(list);
    } else {
      const { name, value } = e.target;
      const list = {
        ...props.timeFlag,
        positiveConformityForTime: [
          ...props.timeFlag.positiveConformityForTime.map((con, conIndex) =>
            conIndex == index ? { ...con, [name]: value } : con
          ),
        ],
      };
      props.setTimeFlag(list);
    }
  };

  const handleChangeRedFlagSwitch = (e) => {
    const { name, value } = e.target;
    props.setTimeFlag((timeFlag) => ({
      ...props.timeFlag,
      [name]: e.target.checked,
    }));
  };

  const handleAddClickRedFlag = (index, j) => {
    const list = { ...props.timeFlag };
    const thisRedFlagDate = list.redFlagForTime;
    list.redFlagForTime = [
      ...thisRedFlagDate,
      {
        id: "",
        expressionType: "",
        forAnswer: "",
        forRangeEnd: moment().toISOString(),
      },
    ];
    props.setTimeFlag(list);
  };

  const handleRemoveClickRedFlag = (j) => {
    const list = { ...props.timeFlag };
    list.redFlagForTime.splice(j, 1);
    props.setTimeFlag(list);
  };

  const handleAddClickPositiveFlag = (index, j) => {
    const list = { ...props.timeFlag };
    const thisPositiveFlagDate = list.positiveConformityForTime;
    list.positiveConformityForTime = [
      ...thisPositiveFlagDate,
      {
        id: "",
        expressionType: "",
        forAnswer: "",
        forRangeEnd: moment().toISOString(),
      },
    ];
    props.setTimeFlag(list);
  };

  const handleRemoveClickPositiveFlag = (j) => {
    const list = { ...props.timeFlag };
    list.positiveConformityForTime.splice(j, 1);
    props.setTimeFlag(list);
  };

  return (
    <Grid item container xs={12} spacing={1} className="flag-container">
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <Grid item xs={12} sm={12}>
          <Card className="flag-card flag-card-dynamic">
            <CardContent>
              <Grid item container xs={12}>
                <Grid item xs={2}>
                  <label className="required">Red Flag</label>
                </Grid>
                <Grid item xs={6}>
                  <FormControlLabel
                    control={
                      <PurpleSwitch
                        checked={props.timeFlag.isPositiveConfirmityRedFlag}
                        name="isPositiveConfirmityRedFlag"
                        onChange={handleChangeRedFlagSwitch}
                      />
                    }
                  />
                </Grid>
              </Grid>
              {props.timeFlag.isPositiveConfirmityRedFlag ? (
                <Grid item container xs={12}>
                  <Grid item xs={2}>
                    <label
                      className={
                        props.timeFlag.isPositiveConfirmityRedFlag
                          ? "required"
                          : ""
                      }
                    >
                      Red Flag Answer
                    </label>
                  </Grid>
                  <Grid item xs={10}>
                    {props.timeFlag.redFlagForTime &&
                    props.timeFlag.redFlagForTime.length > 0
                      ? props.timeFlag.redFlagForTime.map((x, i) => {
                          return (
                            <Grid
                              item
                              container
                              xs={12}
                              spacing={1}
                              key={`redflag-container${i}`}
                              className="dynamic-flag-container"
                            >
                              <Grid item xs={2}>
                                <FormControl variant="outlined" fullWidth>
                                  <InputLabel
                                    id={`demo-simple-select-outlined-label${i}`}
                                    shrink={false}
                                    className="select-label"
                                  >
                                    {x.expressionType && x.expressionType != ""
                                      ? ""
                                      : "Answer type"}
                                  </InputLabel>
                                  <Select
                                    labelId={`demo-simple-select-outlined-label${i}`}
                                    id={`demo-simple-select-outlined${i}`}
                                    value={
                                      x.expressionType ? x.expressionType : ""
                                    }
                                    name="expressionType"
                                    onChange={(e) =>
                                      handleChangeFlagR(null, null, e, i)
                                    }
                                    placeholder="Answer type"
                                    InputLabelProps={{
                                      shrink: false,
                                    }}
                                    className="global-input single-select"
                                    required={
                                      props.timeFlag.isPositiveConfirmityRedFlag
                                    }
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
                              <Grid item xs={3} className="date-time-pickers">
                                <KeyboardTimePicker
                                  format={
                                    props.loadGlobalSettingsData
                                      ? props.loadGlobalSettingsData.timeFormat
                                      : "hh:mm"
                                  }
                                  ampm={
                                    props.loadGlobalSettingsData
                                      ? props.loadGlobalSettingsData.timeFormat.includes(
                                          "HH"
                                        )
                                        ? false
                                        : true
                                      : "hh:mm"
                                  }
                                  fullWidth
                                  id={`forAnswerR${i}`}
                                  placeholder="Your answer"
                                  name="forAnswer"
                                  value={x.forAnswer}
                                  onChange={(date, event, e) =>
                                    handleChangeFlagR(
                                      date,
                                      "forAnswer",
                                      null,
                                      i
                                    )
                                  }
                                  className="global-input"
                                  label={
                                    props.timeFlag.redFlagForTime[i]
                                      .expressionType == "RANGE"
                                      ? "From"
                                      : "Answer"
                                  }
                                  KeyboardButtonProps={{
                                    "aria-label": "change date",
                                  }}
                                />
                              </Grid>
                              {props.timeFlag.redFlagForTime[i]
                                .expressionType == "RANGE" ? (
                                <>
                                  <Grid
                                    item
                                    xs={3}
                                    className="date-time-pickers"
                                  >
                                    <KeyboardTimePicker
                                      format={
                                        props.loadGlobalSettingsData
                                          ? props.loadGlobalSettingsData
                                              .timeFormat
                                          : "hh:mm"
                                      }
                                      ampm={
                                        props.loadGlobalSettingsData
                                          ? props.loadGlobalSettingsData.timeFormat.includes(
                                              "HH"
                                            )
                                            ? false
                                            : true
                                          : "hh:mm"
                                      }
                                      fullWidth
                                      id={`forRangeEndR${i}`}
                                      placeholder="Your answer"
                                      name="forRangeEnd"
                                      value={x.forRangeEnd}
                                      onChange={(date, event, e) =>
                                        handleChangeFlagR(
                                          date,
                                          "forRangeEnd",
                                          null,
                                          i
                                        )
                                      }
                                      className="global-input"
                                      label="To"
                                      KeyboardButtonProps={{
                                        "aria-label": "change date",
                                      }}
                                    />
                                  </Grid>
                                </>
                              ) : (
                                ""
                              )}
                              <Grid item xs={2} className="row-icons-container">
                                {props.timeFlag.redFlagForTime.length !== 1 && (
                                  <Tooltip title="Remove">
                                    <CancelIcon
                                      className={`delete-row-icon`}
                                      onClick={() =>
                                        handleRemoveClickRedFlag(i)
                                      }
                                    ></CancelIcon>
                                  </Tooltip>
                                )}
                                {props.timeFlag.redFlagForTime.length - 1 ===
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
                        })
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
          <Card className="flag-card flag-card-dynamic">
            <CardContent>
              <Grid item container xs={12}>
                <Grid item xs={2}>
                  <label className="required">Positive Conformity</label>
                </Grid>
                <Grid item xs={10}>
                  {props.timeFlag.positiveConformityForTime &&
                  props.timeFlag.positiveConformityForTime.length > 0
                    ? props.timeFlag.positiveConformityForTime.map((x, i) => {
                        return (
                          <Grid
                            item
                            container
                            xs={12}
                            spacing={1}
                            key={`redflag-container${i}`}
                            className="dynamic-flag-container"
                          >
                            <Grid item xs={2}>
                              <FormControl variant="outlined" fullWidth>
                                <InputLabel
                                  id={`demo-simple-select-outlined-label${i}`}
                                  shrink={false}
                                  className="select-label"
                                >
                                  {x.expressionType && x.expressionType != ""
                                    ? ""
                                    : "Answer type"}
                                </InputLabel>
                                <Select
                                  labelId={`demo-simple-select-outlined-label${i}`}
                                  id={`demo-simple-select-outlined${i}`}
                                  value={
                                    x.expressionType ? x.expressionType : ""
                                  }
                                  name="expressionType"
                                  onChange={(e) =>
                                    handleChangeFlagP(null, null, e, i)
                                  }
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
                            <Grid item xs={3} className="date-time-pickers">
                              <KeyboardTimePicker
                                format={
                                  props.loadGlobalSettingsData
                                    ? props.loadGlobalSettingsData.timeFormat
                                    : "hh:mm"
                                }
                                ampm={
                                  props.loadGlobalSettingsData
                                    ? props.loadGlobalSettingsData.timeFormat.includes(
                                        "HH"
                                      )
                                      ? false
                                      : true
                                    : "hh:mm"
                                }
                                fullWidth
                                id={`forAnswerR${i}`}
                                placeholder="Your answer"
                                name="forAnswer"
                                value={x.forAnswer}
                                onChange={(date, event, e) =>
                                  handleChangeFlagP(date, "forAnswer", null, i)
                                }
                                className="global-input"
                                label={
                                  props.timeFlag.positiveConformityForTime[i]
                                    .expressionType == "RANGE"
                                    ? "From"
                                    : "Answer"
                                }
                                KeyboardButtonProps={{
                                  "aria-label": "change date",
                                }}
                              />
                            </Grid>
                            {props.timeFlag.positiveConformityForTime[i]
                              .expressionType == "RANGE" ? (
                              <>
                                <Grid item xs={3} className="date-time-pickers">
                                  <KeyboardTimePicker
                                    format={
                                      props.loadGlobalSettingsData
                                        ? props.loadGlobalSettingsData
                                            .timeFormat
                                        : "hh:mm"
                                    }
                                    ampm={
                                      props.loadGlobalSettingsData
                                        ? props.loadGlobalSettingsData.timeFormat.includes(
                                            "HH"
                                          )
                                          ? false
                                          : true
                                        : "hh:mm"
                                    }
                                    fullWidth
                                    id={`forRangeEndR${i}`}
                                    placeholder="Your answer"
                                    name="forRangeEnd"
                                    value={x.forRangeEnd}
                                    onChange={(date, event, e) =>
                                      handleChangeFlagP(
                                        date,
                                        "forRangeEnd",
                                        null,
                                        i
                                      )
                                    }
                                    className="global-input"
                                    label="To"
                                    KeyboardButtonProps={{
                                      "aria-label": "change date",
                                    }}
                                  />
                                </Grid>
                              </>
                            ) : (
                              ""
                            )}
                            <Grid item xs={2} className="row-icons-container">
                              {props.timeFlag.positiveConformityForTime
                                .length !== 1 && (
                                <Tooltip title="Remove">
                                  <CancelIcon
                                    className={`delete-row-icon`}
                                    onClick={() =>
                                      handleRemoveClickPositiveFlag(i)
                                    }
                                  ></CancelIcon>
                                </Tooltip>
                              )}
                              {props.timeFlag.positiveConformityForTime.length -
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
                      })
                    : ""}
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </MuiPickersUtilsProvider>
    </Grid>
  );
}

export default QuestionTypeTime;
