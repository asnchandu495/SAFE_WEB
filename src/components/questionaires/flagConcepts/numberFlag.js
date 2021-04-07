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

function QuestionTypeNumber(props) {
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
    if (name == "numericExpressionType") {
      thisVal = value;
    } else {
      if (value != "") {
        thisVal = parseInt(value);
      }
    }
    const list = {
      ...props.numericFlag,
      redFlagForNumber: [
        ...props.numericFlag.redFlagForNumber.map((con, conIndex) =>
          conIndex == index ? { ...con, [name]: thisVal } : con
        ),
      ],
    };
    props.setNumericFlag(list);
  };

  const handleChangeFlagP = (e, index) => {
    const { name, value } = e.target;
    let thisVal = "";
    if (name == "numericExpressionType") {
      thisVal = value;
    } else {
      if (value != "") {
        thisVal = parseInt(value);
      }
    }
    const list = {
      ...props.numericFlag,
      positiveConformityForNumber: [
        ...props.numericFlag.positiveConformityForNumber.map((con, conIndex) =>
          conIndex == index ? { ...con, [name]: thisVal } : con
        ),
      ],
    };
    props.setNumericFlag(list);
  };

  const handleChangeRedFlagSwitch = (e) => {
    const { name, value } = e.target;
    props.setNumericFlag((numericFlag) => ({
      ...props.numericFlag,
      [name]: e.target.checked,
    }));
  };

  const handleAddClickRedFlag = (index, j) => {
    const list = { ...props.numericFlag };
    const thisRedFlagNumber = list.redFlagForNumber;
    list.redFlagForNumber = [
      ...thisRedFlagNumber,
      {
        id: "",
        numericExpressionType: "",
        forAnswer: 0,
        forRangeEnd: 0,
      },
    ];
    props.setNumericFlag(list);
  };

  const handleRemoveClickRedFlag = (j) => {
    const list = { ...props.numericFlag };
    list.redFlagForNumber.splice(j, 1);
    props.setNumericFlag(list);
  };

  const handleAddClickPositiveFlag = (index, j) => {
    const list = { ...props.numericFlag };
    const thisPositiveFlagNumber = list.positiveConformityForNumber;
    list.positiveConformityForNumber = [
      ...thisPositiveFlagNumber,
      {
        id: "",
        numericExpressionType: "",
        forAnswer: 0,
        forRangeEnd: 0,
      },
    ];
    props.setNumericFlag(list);
  };

  const handleRemoveClickPositiveFlag = (j) => {
    const list = { ...props.numericFlag };
    list.positiveConformityForNumber.splice(j, 1);
    props.setNumericFlag(list);
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
                      checked={props.numericFlag.isPositiveConfirmityRedFlag}
                      name="isPositiveConfirmityRedFlag"
                      onChange={handleChangeRedFlagSwitch}
                    />
                  }
                />
              </Grid>
            </Grid>
            {props.numericFlag.isPositiveConfirmityRedFlag ? (
              <Grid item container xs={12}>
                <Grid item xs={2}>
                  <label
                    className={
                      props.numericFlag.isPositiveConfirmityRedFlag
                        ? "required"
                        : ""
                    }
                  >
                    Red Flag Answer
                  </label>
                </Grid>
                <Grid item xs={10}>
                  {props.numericFlag.redFlagForNumber &&
                  props.numericFlag.redFlagForNumber.length > 0
                    ? props.numericFlag.redFlagForNumber.map((x, i) => {
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
                                  {x.numericExpressionType &&
                                  x.numericExpressionType != ""
                                    ? ""
                                    : "Answer type"}
                                </InputLabel>
                                <Select
                                  labelId={`demo-simple-select-outlined-label${i}`}
                                  id={`demo-simple-select-outlined${i}`}
                                  value={
                                    x.numericExpressionType
                                      ? x.numericExpressionType
                                      : ""
                                  }
                                  name="numericExpressionType"
                                  onChange={(e) => handleChangeFlagR(e, i)}
                                  placeholder="Answer type"
                                  InputLabelProps={{
                                    shrink: false,
                                  }}
                                  className="global-input single-select"
                                  required={
                                    props.numericFlag
                                      .isPositiveConfirmityRedFlag
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
                            <Grid item xs={3} key={`redflag-containerF${i}`}>
                              <TextValidator
                                variant="outlined"
                                fullWidth
                                id={`forAnswerR${i}`}
                                key={`forAnswerR${i}`}
                                placeholder={
                                  props.numericFlag.redFlagForNumber[i]
                                    .numericExpressionType == "RANGE"
                                    ? "From"
                                    : "Your answer"
                                }
                                name="forAnswer"
                                value={x.forAnswer}
                                onChange={(e) => handleChangeFlagR(e, i)}
                                className="global-input"
                                InputLabelProps={{ shrink: false }}
                              />
                            </Grid>
                            {props.numericFlag.redFlagForNumber[i]
                              .numericExpressionType == "RANGE" ? (
                              <>
                                <Grid
                                  item
                                  xs={3}
                                  key={`redflag-containerT${i}`}
                                >
                                  <TextValidator
                                    variant="outlined"
                                    fullWidth
                                    id={`forRangeEndR${i}`}
                                    key={`forRangeEndR${i}`}
                                    placeholder="To"
                                    name="forRangeEnd"
                                    value={x.forRangeEnd}
                                    onChange={(e) => handleChangeFlagR(e, i)}
                                    className="global-input"
                                    InputLabelProps={{ shrink: false }}
                                  />
                                </Grid>
                              </>
                            ) : (
                              ""
                            )}
                            <Grid item xs={2} className="row-icons-container">
                              {props.numericFlag.redFlagForNumber.length !==
                                1 && (
                                <Tooltip title="Remove">
                                  <CancelIcon
                                    className={`delete-row-icon`}
                                    onClick={() => handleRemoveClickRedFlag(i)}
                                  ></CancelIcon>
                                </Tooltip>
                              )}
                              {props.numericFlag.redFlagForNumber.length - 1 ===
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
                <label className="required">Positive Confirmity</label>
              </Grid>
              <Grid item xs={10}>
                {props.numericFlag.positiveConformityForNumber &&
                props.numericFlag.positiveConformityForNumber.length > 0
                  ? props.numericFlag.positiveConformityForNumber.map(
                      (x, i) => {
                        return (
                          <Grid
                            item
                            container
                            xs={12}
                            spacing={1}
                            key={`positiveflag-container${i}`}
                            className="dynamic-flag-container"
                          >
                            <Grid item xs={2}>
                              <FormControl variant="outlined" fullWidth>
                                <InputLabel
                                  id={`demo-simple-select-outlined-label${i}`}
                                  shrink={false}
                                  className="select-label"
                                >
                                  {x.numericExpressionType &&
                                  x.numericExpressionType != ""
                                    ? ""
                                    : "Answer type"}
                                </InputLabel>
                                <Select
                                  labelId={`demo-simple-select-outlined-label${i}`}
                                  id={`demo-simple-select-outlined${i}`}
                                  value={
                                    x.numericExpressionType
                                      ? x.numericExpressionType
                                      : ""
                                  }
                                  name="numericExpressionType"
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
                            <Grid
                              item
                              xs={3}
                              key={`positiveflag-containerF${i}`}
                            >
                              <TextValidator
                                variant="outlined"
                                fullWidth
                                id={`forAnswerP${i}`}
                                key={`forAnswerP${i}`}
                                placeholder={
                                  props.numericFlag.positiveConformityForNumber[
                                    i
                                  ].numericExpressionType == "RANGE"
                                    ? "From"
                                    : "Your answer"
                                }
                                name="forAnswer"
                                value={x.forAnswer}
                                onChange={(e) => handleChangeFlagP(e, i)}
                                className="global-input"
                                InputLabelProps={{ shrink: false }}
                              />
                            </Grid>
                            {props.numericFlag.positiveConformityForNumber[i]
                              .numericExpressionType == "RANGE" ? (
                              <>
                                <Grid
                                  item
                                  xs={3}
                                  key={`positiveflag-containerT${i}`}
                                >
                                  <TextValidator
                                    variant="outlined"
                                    fullWidth
                                    id={`forRangeEndP${i}`}
                                    key={`forRangeEndP${i}`}
                                    placeholder="To"
                                    name="forRangeEnd"
                                    value={x.forRangeEnd}
                                    onChange={(e) => handleChangeFlagP(e, i)}
                                    className="global-input"
                                    InputLabelProps={{ shrink: false }}
                                  />
                                </Grid>
                              </>
                            ) : (
                              ""
                            )}
                            <Grid item xs={2} className="row-icons-container">
                              {props.numericFlag.positiveConformityForNumber
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
                              {props.numericFlag.positiveConformityForNumber
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

export default QuestionTypeNumber;
