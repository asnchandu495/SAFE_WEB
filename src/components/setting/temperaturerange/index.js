import React, { useState, useEffect } from "react";
import Grid from "@material-ui/core/Grid";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import { Link as LinkTo } from "react-router-dom";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import Tooltip from "@material-ui/core/Tooltip";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import CancelIcon from "@material-ui/icons/Cancel";
import ToasterMessageComponent from "../../common/toaster";
import ButtonLoadderComponent from "../../common/loadder/buttonloadder";
import ComponentLoadderComponent from "../../common/loadder/componentloadder";
import FaqService from "../../../services/faqService";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Prompt } from "react-router-dom";
import * as globalSettingAction from "../../../Redux/Action/globalSettingAction";

import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import FormHelperText from "@material-ui/core/FormHelperText";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import CovidStateApiServices from "../../../services/masterDataService";
import Checkbox from "@material-ui/core/Checkbox";
import InputAdornment from "@material-ui/core/InputAdornment";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import GlobalSettingApiServices from "../../../services/globalSettingService";
import AlertBoxComponent from "../../common/alert";
import { SignalCellularNullTwoTone } from "@material-ui/icons";
import TooltipComponent from "../../common/tooltip";

const useStyles = makeStyles((theme) => ({
  gridDispaly: {
    display: "inline-flex",
  },
}));

const languages = [{ id: "English", language: "English" }];

function TemperatureRange(props) {
  const CovidStateApi = new CovidStateApiServices();
  const GlobalSettingApi = new GlobalSettingApiServices();
  const faqApiCall = new FaqService();
  const classes = useStyles();
  // const getFaqId = props.match.params.id;
  // const getFaqIdSecId = props.match.params.secId;

  const uomTemp = [
    {
      id: "F",
      uomTempvalue: "Fahrenheit",
    },
    {
      id: "C",
      uomTempvalue: "Celsius",
    },
  ];

  // const [faqId, setFaqId] = useState(getFaqId);
  // const [faqIdSecId, setFaqIdSecId] = useState(getFaqIdSecId);
  const [flagStatus, setflagStatus] = useState(false);
  const [isFormSubmit, setisFormSubmit] = useState(false);
  const [muivalidatorForm, setmuivalidatorForm] = useState(false);
  const [stateSnackbar, setStateSnackbar] = useState(false);
  const [toasterMessage, setToasterMessage] = useState("");
  const [toasterServerity, settoasterServerity] = useState("");
  const [covidStatelist, setcovidStatelist] = useState([]);
  const [tempCovidStatelist, setTempCovidStatelist] = useState([]);
  const [isAlertBoxOpened, setisAlertBoxOpened] = useState(false);
  const [globalsettingsId, setglobalsettingsId] = useState();
  const [toasterErrorMessageType, settoasterErrorMessageType] =
    useState("array");
  const [showLoadder, setshowLoadder] = useState(false);
  const [componentLoadder, setComponentLoadder] = useState(true);
  const [tempsections, settempsections] = useState({
    id: "",
    globalSettingsId: globalsettingsId,
    temperatureUnit: "",
    covidStates: [
      {
        id: "",
        lowerLimit: 0,
        upperLimit: 0,
        covidState: {
          id: "",
          stateName: "",
        },
        isNoUpperLimit: false,
      },
    ],
  });
  const [oldData, setOldData] = useState({
    id: "",
    globalSettingsId: globalsettingsId,
    temperatureUnit: "",
    covidStates: [
      {
        id: "",
        lowerLimit: 0,
        upperLimit: 0,
        covidState: {
          id: "",
          stateName: "",
        },
        isNoUpperLimit: false,
      },
    ],
  });
  const [stateCount, setStateCount] = useState(0);

  useEffect(() => {
    Promise.all([
      CovidStateApi.getCOVIDStates(),
      GlobalSettingApi.getLoadGlobalSetting(),
    ])
      .then(([result, globalSettings]) => {
        setcovidStatelist(result);
        setTempCovidStatelist(result);
        if (globalSettings.covidStateTemperatures.length > 0) {
          tempsections.covidStates = globalSettings.covidStateTemperatures;
          oldData.covidStates = globalSettings.covidStateTemperatures;
        }
        tempsections.globalSettingsId = globalSettings.id;
        oldData.globalSettingsId = globalSettings.id;
        tempsections.temperatureUnit = globalSettings.temperatureUnit;
        oldData.temperatureUnit = globalSettings.temperatureUnit;
        setComponentLoadder(false);
      })
      .catch((err) => {
        console.log(err);
      });
    // setComponentLoadder(false);
  }, []);

  function handleChange(e) {
    const { name, value } = e.target.checked;
    if (e.target.checked) {
      setflagStatus(true);
    } else {
      setflagStatus(false);
    }
  }

  function handleChangeInput(e) {
    const { name, value } = e.target;
    settempsections((tempsections) => ({
      ...tempsections,
      [name]: value,
    }));
  }

  const handleInputChangeContacts = (e, index) => {
    const { name, value, checked } = e.target;
    const list = {
      ...tempsections,
      covidStates: [
        ...tempsections.covidStates.map((con, conIndex) => {
          if (name == "lowerLimit") {
            return conIndex == index ? { ...con, [name]: value } : con;
          } else if (name == "upperLimit") {
            return conIndex == index ? { ...con, [name]: value } : con;
          } else {
            if (checked) {
              return conIndex == index
                ? { ...con, [name]: checked, ["upperLimit"]: 0 }
                : con;
            } else {
              return conIndex == index
                ? { ...con, [name]: checked, ["upperLimit"]: 0 }
                : con;
            }
          }
        }),
      ],
    };

    // parseFloat(settempsections(list));
    settempsections(list);
  };

  function handleChangeCovidState(e, value, index) {
    let thisValue;
    if (value) {
      thisValue = { id: value.id, state: value.stateName };
    } else {
      thisValue = value;
    }

    const list = {
      ...tempsections,
      covidStates: [
        ...tempsections.covidStates.map((con, conIndex) =>
          conIndex == index
            ? {
              ...con,
              ["covidState"]: thisValue,
            }
            : con
        ),
      ],
    };

    // const listmain = {
    //   ...tempsections,
    //   covidStates: [
    //     ...tempsections.covidStates.map((con, conIndex) => {
    //       return conIndex - 1 == index - 1
    //         ? { ...con, ["isNoUpperLimit"]: false }
    //         : con;
    //     }),
    //   ],
    // };
    settempsections(list);
  }

  const handleRemoveClickContacts = (j) => {
    const list = { ...tempsections };
    list.covidStates.splice(j, 1);

    const listmain = {
      ...list,
      covidStates: [
        ...list.covidStates.map((con, conIndex) => {
          return conIndex - 1 == j - 1
            ? { ...con, ["isNoUpperLimit"]: true }
            : con;
        }),
      ],
    };

    settempsections(listmain);
  };

  const handleAddClickContacts = (index, j) => {
    const list = { ...tempsections };
    const thistempsections = list.covidStates;
    list.covidStates = [
      ...thistempsections,
      {
        id: "",
        lowerLimit: 0,
        upperLimit: 0,
        covidState: {
          id: "",
          stateName: "",
        },
        isNoUpperLimit: false,
      },
    ];
    settempsections(list);
  };

  function handleClickGoBackToPage() {
    settempsections(oldData);
  }

  function submitForm(e) {
    e.preventDefault();
    settoasterServerity("");
    settoasterErrorMessageType("");
    setshowLoadder(true);
    setisFormSubmit(true);
    let sendData = tempsections;

    let getCovidStates = sendData.covidStates;

    let isValidTempRange = true;

    getCovidStates.forEach((item, i) => {
      if (!item.isNoUpperLimit) {
        if (parseFloat(item.upperLimit) <= parseFloat(item.lowerLimit)) {
          isValidTempRange = false;
        }
      }
      if (i > 0) {
        if (!item.isNoUpperLimit) {
          console.log(item);
          if (parseFloat(item.lowerLimit) <= parseFloat(getCovidStates[i - 1].upperLimit)) {
            isValidTempRange = false;
          }
        }
      }
      console.log(isValidTempRange);
    });

    if (!isValidTempRange) {
      let errorObject = { "errors": { "Message": ["Please enter valid range"] } };
      setToasterMessage(errorObject.errors);
      settoasterServerity("error");
      setStateSnackbar(true);
      setshowLoadder(false);
      return false;
    }

    getCovidStates.forEach((item) => {
      item.upperLimit = parseFloat(item.upperLimit);
      item.lowerLimit = parseFloat(item.lowerLimit);
    });
    sendData.covidStates = getCovidStates;
    sendData.id = sendData.globalSettingsId;
    props
      .updateTemp(sendData)
      .then((result) => {
        setStateSnackbar(true);
        setToasterMessage("Updated temperature range settings.");
        settoasterServerity("success");
        setisAlertBoxOpened(false);
        setTimeout(() => {
          setshowLoadder(false);
        }, 6000);
      })
      .catch((err) => {
        setToasterMessage(err.data.errors);
        settoasterServerity("error");
        setStateSnackbar(true);
        setshowLoadder(false);
      });
  }

  function ValidateSubmitForm() {
    setshowLoadder(true);
    let sendData = tempsections;
  }

  function BreadcrumbNavigation(getRoute) {
    props.history.push(getRoute);
  }

  return (
    <div className="innerpage-container">
      <AlertBoxComponent isAlertBoxOpened={isAlertBoxOpened} />
      <Breadcrumbs aria-label="breadcrumb" className="global-breadcrumb">
        <LinkTo
          color="inherit"
          href="#"
          to={`/home/dashboard`}
          className="inactive"
        >
          Home
        </LinkTo>
        <LinkTo color="textPrimary" href="#" to="#" className="active">
          Temperature Range
          <TooltipComponent
            isMarginBottom={true}
            tooltipMessage={`Temperature range defined to determines user's COVID state depending on their body temperature.`}
          ></TooltipComponent>
        </LinkTo>
      </Breadcrumbs>
      {!componentLoadder ? (
        <Paper className="main-paper">
          <ValidatorForm className={`global-form`} onSubmit={submitForm}>
            <Grid container spacing={3}>
              <Grid item container xs={12}>
                <Grid item xs={3}>
                  <label className="required">Temperature UOM</label>
                </Grid>
                <Grid item xs={2}>
                  <FormControl variant="outlined" fullWidth>
                    <InputLabel
                      id="demo-simple-select-outlined-label"
                      shrink={false}
                      className="select-label"
                    >
                      {tempsections.temperatureUnit == ""
                        ? "Select temperatures"
                        : ""}
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-outlined-label"
                      id="demo-simple-select-outlined"
                      value={tempsections.temperatureUnit}
                      name="temperatureUnit"
                      onChange={handleChangeInput}
                      placeholder="dsfs"
                      required
                      InputLabelProps={{ shrink: false }}
                      className="global-input single-select"
                    >
                      <MenuItem value="">
                        <em>Select</em>
                      </MenuItem>
                      {uomTemp.length > 0
                        ? uomTemp.map((tempvalue) => {
                          return (
                            <MenuItem key={tempvalue.id} value={tempvalue.id}>
                              {tempvalue.uomTempvalue}
                            </MenuItem>
                          );
                        })
                        : ""}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
              {tempsections.covidStates && tempsections.covidStates.length > 0
                ? tempsections.covidStates.map((x, i) => {
                  return (
                    <Grid
                      container
                      item
                      xs={12}
                      spacing={3}
                      className={`${classes.gridDispaly} temperature-states`}
                      key={`section-container${i}`}
                    >
                      <Grid item xs={3}>
                        <label className="required">Covid State</label>
                      </Grid>
                      <Grid item xs={2}>
                        <Autocomplete
                          id="tags-outlined"
                          options={
                            covidStatelist && covidStatelist.length > 0
                              ? covidStatelist.filter((cstate) => {
                                console.log(cstate);
                                return !tempsections.covidStates.find(
                                  (sselected) => {
                                    console.log(sselected);
                                    if (sselected.covidState) {
                                      return (
                                        sselected.covidState.id == cstate.id
                                      );
                                    }
                                  }
                                );
                              })
                              : []
                          }
                          getOptionLabel={(option) => option.stateName}
                          onChange={(e, v) => handleChangeCovidState(e, v, i)}
                          name="covidState"
                          defaultValue={x.covidState}
                          filterSelectedOptions
                          className="global-input autocomplete-select"
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              required
                              variant="outlined"
                              placeholder="Select  covid state"
                            />
                          )}
                        />
                      </Grid>
                      <Grid item xs={2}>
                        <TextValidator
                          variant="outlined"
                          validators={
                            i == 0
                              ? tempsections.temperatureUnit == "C"
                                ? [
                                  "required",
                                  "matchRegexp:^\\d{1,6}(\\.\\d{1,6})?$",
                                  "maxNumber:45",
                                  "minNumber:30",
                                ]
                                : [
                                  "required",
                                  "matchRegexp:^\\d{1,6}(\\.\\d{1,6})?$",
                                  "maxNumber:113",
                                  "minNumber:86",
                                ]
                              : tempsections.temperatureUnit == "C"
                                ? [
                                  "required",
                                  "matchRegexp:^\\d{1,2}(\\.\\d{1,1})?$",
                                  "maxNumber:45",
                                  `minNumber:${parseFloat(parseFloat(
                                    tempsections.covidStates[i - 1].upperLimit
                                  ) + parseFloat(0.1))}`,
                                ]
                                : [
                                  "required",
                                  "matchRegexp:^\\d{1,3}(\\.\\d{1,1})?$",
                                  "maxNumber:113",
                                  `minNumber:${parseFloat(parseFloat(
                                    tempsections.covidStates[i - 1].upperLimit
                                  ) + parseFloat(0.1))}`,
                                ]
                          }
                          errorMessages={
                            i == 0
                              ? tempsections.temperatureUnit == "C"
                                ? [
                                  "Please enter lower limit",
                                  "Entered numbers are not valid",
                                  "Maximum allowed is 45",
                                  "Minimum allowed is 30",
                                ]
                                : [
                                  "Please enter lower limit",
                                  "Entered numbers are not valid",
                                  "Maximum allowed is 113",
                                  "Minimum allowed is 86",
                                ]
                              : tempsections.temperatureUnit == "C"
                                ? [
                                  "Please enter lower limit",
                                  "Entered numbers are not valid",
                                  "Maximum allowed is 45",
                                  `Minimum allowed is ${parseFloat(
                                    tempsections.covidStates[i - 1].upperLimit
                                  ) + parseFloat(0.1)}`,
                                ]
                                : [
                                  "Please enter lower limit",
                                  "Entered numbers are not valid",
                                  "Maximum allowed is 113",
                                  `Minimum allowed is ${parseFloat(
                                    tempsections.covidStates[i - 1].upperLimit
                                  ) + parseFloat(0.1)}`,
                                ]
                          }
                          id={`lowerLimit_${i}`}
                          placeholder="Lower Limit"
                          name="lowerLimit"
                          value={x.lowerLimit}
                          onChange={(e) => handleInputChangeContacts(e, i)}
                          className="global-input"
                          InputLabelProps={{ shrink: false }}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                {tempsections.temperatureUnit
                                  ? tempsections.temperatureUnit
                                  : ""}
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Grid>
                      <Grid item xs={2}>
                        <TextValidator
                          variant="outlined"
                          validators={
                            tempsections.temperatureUnit == "C"
                              ? x.isNoUpperLimit
                                ? [
                                  "matchRegexp:^\\d{1,6}(\\.\\d{1,6})?$",
                                  "maxNumber:45",
                                  `minNumber:${x.isNoUpperLimit
                                    ? 0
                                    : parseFloat(x.lowerLimit) + parseFloat(0.1)
                                  }`,
                                ]
                                : [
                                  "required",
                                  "matchRegexp:^\\d{1,6}(\\.\\d{1,6})?$",
                                  "maxNumber:45",
                                  `minNumber:${x.isNoUpperLimit
                                    ? 0
                                    : parseFloat(x.lowerLimit) + parseFloat(0.1)
                                  }`,
                                ]
                              : x.isNoUpperLimit
                                ? [
                                  "matchRegexp:^\\d{1,6}(\\.\\d{1,6})?$",
                                  "maxNumber:113",
                                  `minNumber:${x.isNoUpperLimit
                                    ? 0
                                    : parseFloat(parseFloat(x.lowerLimit) + parseFloat(0.1)).toFixed(1)
                                  }`,
                                ]
                                : [
                                  "required",
                                  "matchRegexp:^\\d{1,6}(\\.\\d{1,6})?$",
                                  "maxNumber:113",
                                  `minNumber:${x.isNoUpperLimit
                                    ? 0
                                    : parseFloat(parseFloat(x.lowerLimit) + parseFloat(0.1)).toFixed(1)
                                  }`,
                                ]
                          }
                          errorMessages={
                            tempsections.temperatureUnit == "C"
                              ? x.isNoUpperLimit
                                ? [
                                  "Entered numbers are not valid",
                                  `Maximum allowed is ${x.isNoUpperLimit ? 0 : 45
                                  }`,
                                  `Minimum allowed is ${x.isNoUpperLimit
                                    ? 0
                                    : parseFloat(x.lowerLimit) + parseFloat(0.1)
                                  }`,
                                ]
                                : [
                                  "Please enter lower limit",
                                  "Entered numbers are not valid",
                                  `Maximum allowed is ${x.isNoUpperLimit ? 0 : 45
                                  }`,
                                  `Minimum allowed is ${x.isNoUpperLimit
                                    ? 0
                                    : parseFloat(x.lowerLimit) + parseFloat(0.1)
                                  }`,
                                ]
                              : x.isNoUpperLimit
                                ? [
                                  "Entered numbers are not valid",
                                  `Maximum allowed is ${x.isNoUpperLimit ? 0 : 113
                                  }`,
                                  `Minimum allowed is ${x.isNoUpperLimit
                                    ? 0
                                    : parseFloat(parseFloat(x.lowerLimit) + parseFloat(0.1)).toFixed(1)
                                  }`,
                                ]
                                : [
                                  "Please enter lower limit",
                                  "Entered numbers are not valid",
                                  `Maximum allowed is ${x.isNoUpperLimit ? 0 : 113
                                  }`,
                                  `Minimum allowed is ${x.isNoUpperLimit
                                    ? 0
                                    : parseFloat(parseFloat(x.lowerLimit) + parseFloat(0.1)).toFixed(1)
                                  }`,
                                ]
                          }
                          id={`upperLimit_${i}`}
                          placeholder="Upper Limit"
                          name="upperLimit"
                          value={x.upperLimit}
                          onChange={(e) => handleInputChangeContacts(e, i)}
                          className="global-input"
                          InputLabelProps={{ shrink: false }}
                          disabled={x.isNoUpperLimit}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                {tempsections.temperatureUnit
                                  ? tempsections.temperatureUnit
                                  : ""}
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Grid>
                      {tempsections.covidStates.length - 1 === i && (
                        <Grid item xs={2} className="row-icons-container">
                          {
                            <FormControlLabel
                              control={<Checkbox name="isNoUpperLimit" />}
                              onChange={(e) =>
                                handleInputChangeContacts(e, i)
                              }
                              label="No Limit"
                              name="isNoUpperLimit"
                              checked={x.isNoUpperLimit}
                            />
                          }
                        </Grid>
                      )}
                      <Grid item xs={1} className="row-icons-container">
                        {tempsections.covidStates.length !== 1 && (
                          <Tooltip title="Remove">
                            <CancelIcon
                              className={`delete-row-icon`}
                              onClick={() => handleRemoveClickContacts(i)}
                            ></CancelIcon>
                          </Tooltip>
                        )}
                        {!x.isNoUpperLimit
                          ? tempsections.covidStates.length - 1 === i && (
                            <Tooltip title="Add">
                              <AddCircleIcon
                                className={`add-row-icon`}
                                onClick={handleAddClickContacts}
                              ></AddCircleIcon>
                            </Tooltip>
                          )
                          : ""}
                      </Grid>
                    </Grid>
                  );
                })
                : ""}
              {isFormSubmit && !tempsections.covidStates ? (
                <FormHelperText className={classes.errorSpanMsg}>
                  Please select value{" "}
                </FormHelperText>
              ) : (
                ""
              )}
              <Grid item container xs={12}>
                <Grid item xs={3}>
                  <label>&nbsp;</label>
                </Grid>
                <Grid item xs={9}>
                  <div className={`form-buttons-container`}>
                    <Button
                      variant="contained"
                      type="submit"
                      className="global-submit-btn"
                      disabled={showLoadder}
                    >
                      {showLoadder ? <ButtonLoadderComponent /> : "Submit"}
                    </Button>
                    <Button
                      variant="contained"
                      type="reset"
                      onClick={handleClickGoBackToPage}
                      className="global-cancel-btn"
                    >
                      Cancel
                    </Button>
                    &nbsp;
                  </div>
                </Grid>
              </Grid>
            </Grid>
          </ValidatorForm>
        </Paper>
      ) : (
        <ComponentLoadderComponent />
      )}
      <ToasterMessageComponent
        stateSnackbar={stateSnackbar}
        setStateSnackbar={setStateSnackbar}
        toasterMessage={toasterMessage}
        toasterServerity={toasterServerity}
        toasterErrorMessageType={toasterErrorMessageType}
      />
    </div>
  );
}

TemperatureRange.propTypes = {
  updateTemp: PropTypes.func.isRequired,
};

function mapStateToProps(state, ownProps) {
  return {
    loadGlobalSettingsData: state.temperaturerangeState,
  };
}

const mapDispatchToProps = {
  updateTemp: globalSettingAction.updateTemp,
};

// export default TemperatureRange;
export default connect(mapStateToProps, mapDispatchToProps)(TemperatureRange);
