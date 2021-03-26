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

function QuestionTypeDate(props) {
  const [answerTypes, setAnswerTypes] = useState([
    {
      id: "EQ",
    },
    {
      id: "GE",
    },
    {
      id: "GT",
    },
    {
      id: "LE",
    },
    {
      id: "LT",
    },
    {
      id: "NE",
    },
    {
      id: "RANGE",
    },
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

  const handleChangeFlagR = (e, index) => {
    const { name, value } = e.target;
    let thisVal = "";
    if (name == "expressionType") {
      thisVal = value;
    } else {
      thisVal = moment(value).toISOString();
    }
    const list = {
      ...props.datetimeFlag,
      redFlagForDate: [
        ...props.datetimeFlag.redFlagForDate.map((con, conIndex) =>
          conIndex == index ? { ...con, [name]: thisVal } : con
        ),
      ],
    };
    props.setDatetimeFlag(list);
  };

  const handleChangeFlagP = (e, index) => {
    const { name, value } = e.target;
    let thisVal = "";
    if (name == "expressionType") {
      thisVal = value;
    } else {
      thisVal = moment(value).toISOString();
    }
    const list = {
      ...props.datetimeFlag,
      positiveConformityForDate: [
        ...props.datetimeFlag.positiveConformityForDate.map((con, conIndex) =>
          conIndex == index ? { ...con, [name]: thisVal } : con
        ),
      ],
    };
    props.setDatetimeFlag(list);
  };

  const handleChangeRedFlagSwitch = (e) => {
    const { name, value } = e.target;
    props.setDatetimeFlag((datetimeFlag) => ({
      ...props.datetimeFlag,
      [name]: e.target.checked,
    }));
  };

  const handleAddClickRedFlag = (index, j) => {
    const list = { ...props.datetimeFlag };
    const thisRedFlagDate = list.redFlagForDate;
    list.redFlagForDate = [
      ...thisRedFlagDate,
      {
        id: "",
        expressionType: "",
        forAnswer: "",
        forRangeEnd: "",
      },
    ];
    props.setDatetimeFlag(list);
  };

  const handleRemoveClickRedFlag = (j) => {
    const list = { ...props.datetimeFlag };
    list.redFlagForDate.splice(j, 1);
    props.setDatetimeFlag(list);
  };

  const handleAddClickPositiveFlag = (index, j) => {
    const list = { ...props.datetimeFlag };
    const thisPositiveFlagDate = list.positiveConformityForDate;
    list.positiveConformityForDate = [
      ...thisPositiveFlagDate,
      {
        id: "",
        expressionType: "",
        forAnswer: "",
        forRangeEnd: "",
      },
    ];
    props.setDatetimeFlag(list);
  };

  const handleRemoveClickPositiveFlag = (j) => {
    const list = { ...props.datetimeFlag };
    list.positiveConformityForDate.splice(j, 1);
    props.setDatetimeFlag(list);
  };

  return (
    <Grid item container xs={12} spacing={1} className="flag-container">
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
                      checked={props.datetimeFlag.isPositiveConfirmityRedFlag}
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
                {props.datetimeFlag.redFlagForDate &&
                props.datetimeFlag.redFlagForDate.length > 0
                  ? props.datetimeFlag.redFlagForDate.map((x, i) => {
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
                                value={x.expressionType ? x.expressionType : ""}
                                name="expressionType"
                                onChange={(e) => handleChangeFlagR(e, i)}
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
                                      key={`atypered_${aType.id}`}
                                    >
                                      {aType.id}
                                    </MenuItem>
                                  );
                                })}
                              </Select>
                            </FormControl>
                          </Grid>
                          {props.datetimeFlag.redFlagForDate[i]
                            .expressionType == "RANGE" ? (
                            <>
                              <Grid item xs={3}>
                                <TextValidator
                                  variant="outlined"
                                  fullWidth
                                  id={`forAnswerR${i}`}
                                  placeholder="Your answer"
                                  type="date"
                                  name="forAnswer"
                                  value={x.forAnswer}
                                  onChange={(e) => handleChangeFlagR(e, i)}
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
                              </Grid>
                              <Grid item xs={3}>
                                <TextValidator
                                  variant="outlined"
                                  fullWidth
                                  id={`forRangeEndR${i}`}
                                  placeholder="Your answer"
                                  type="date"
                                  name="forRangeEnd"
                                  value={x.forRangeEnd}
                                  onChange={(e) => handleChangeFlagR(e, i)}
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
                            </>
                          ) : (
                            <Grid item xs={3}>
                              <TextValidator
                                variant="outlined"
                                fullWidth
                                id={`forAnswerR${i}`}
                                placeholder="Your answer"
                                type="date"
                                name="forAnswer"
                                value={x.forAnswer}
                                onChange={(e) => handleChangeFlagR(e, i)}
                                className="global-input"
                                InputLabelProps={{ shrink: false }}
                              />
                            </Grid>
                          )}
                          <Grid item xs={2} className="row-icons-container">
                            {props.datetimeFlag.redFlagForDate.length !== 1 && (
                              <Tooltip title="Remove">
                                <CancelIcon
                                  className={`delete-row-icon`}
                                  onClick={() => handleRemoveClickRedFlag(i)}
                                ></CancelIcon>
                              </Tooltip>
                            )}
                            {props.datetimeFlag.redFlagForDate.length - 1 ===
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
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={12}>
        <Card className="flag-card flag-card-dynamic">
          <CardContent>
            <Grid item container xs={12}>
              <Grid item xs={2}>
                <label className="required">Positive Confirmity</label>
              </Grid>
              <Grid item xs={10}>
                {props.datetimeFlag.positiveConformityForDate &&
                props.datetimeFlag.positiveConformityForDate.length > 0
                  ? props.datetimeFlag.positiveConformityForDate.map((x, i) => {
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
                                value={x.expressionType ? x.expressionType : ""}
                                name="expressionType"
                                onChange={(e) => handleChangeFlagP(e, i)}
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
                                      key={`atypered_${aType.id}`}
                                    >
                                      {aType.id}
                                    </MenuItem>
                                  );
                                })}
                              </Select>
                            </FormControl>
                          </Grid>
                          {props.datetimeFlag.positiveConformityForDate[i]
                            .expressionType == "RANGE" ? (
                            <>
                              <Grid item xs={3}>
                                <TextValidator
                                  variant="outlined"
                                  fullWidth
                                  id={`forAnswerR${i}`}
                                  placeholder="Your answer"
                                  type="date"
                                  name="forAnswer"
                                  value={x.forAnswer}
                                  onChange={(e) => handleChangeFlagP(e, i)}
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
                              </Grid>
                              <Grid item xs={3}>
                                <TextValidator
                                  variant="outlined"
                                  fullWidth
                                  id={`forRangeEndR${i}`}
                                  placeholder="Your answer"
                                  type="date"
                                  name="forRangeEnd"
                                  value={x.forRangeEnd}
                                  onChange={(e) => handleChangeFlagP(e, i)}
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
                            </>
                          ) : (
                            <Grid item xs={3}>
                              <TextValidator
                                variant="outlined"
                                fullWidth
                                id={`forAnswerR${i}`}
                                placeholder="Your answer"
                                type="date"
                                name="forAnswer"
                                value={x.forAnswer}
                                onChange={(e) => handleChangeFlagP(e, i)}
                                className="global-input"
                                InputLabelProps={{ shrink: false }}
                              />
                            </Grid>
                          )}
                          <Grid item xs={2} className="row-icons-container">
                            {props.datetimeFlag.positiveConformityForDate
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
                            {props.datetimeFlag.positiveConformityForDate
                              .length -
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
    </Grid>
  );
}

export default QuestionTypeDate;
