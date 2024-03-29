import React, { useState, useEffect } from "react";
import Grid from "@material-ui/core/Grid";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import { Link as LinkTo } from "react-router-dom";
import {
  ValidatorForm,
  TextValidator,
  SelectValidator,
} from "react-material-ui-form-validator";
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
import ConfirmationDialog from "../../common/EventualConsistency";

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
  const [showEventualLoadder, setshowEventualLoadder] = useState(false);
  const [ConfirmationModalActionType, setConfirmationModalActionType] =
    useState("");
  const [ConfirmationHeaderTittle, setConfirmationHeaderTittle] = useState("");
  const [ConfirmationDialogContextText, setConfirmationDialogContextText] =
    useState("");

  const [
    ConfirmationDialogContextTextNext,
    setConfirmationDialogContextTextNext,
  ] = useState("");
  const [openConfirmationModal, setOpenConfirmationModal] = useState(false);
  const [reloadPage, setReloadPage] = useState("NO");

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
      // props.loadGlobalSetting(),
      GlobalSettingApi.getLoadGlobalSetting(),
      // props.GetCovidState(),
    ])
      .then(([result, globalSettings]) => {
        setcovidStatelist(result);
        setTempCovidStatelist(result);

        if (globalSettings.covidStateTemperatures.length > 0) {
          globalSettings.covidStateTemperatures.sort(function IHaveAName(a, b) {
            // non-anonymous as you ordered...
            return b.lowerLimit < a.lowerLimit
              ? 1 // if b should come earlier, push a to end
              : b.lowerLimit > a.lowerLimit
              ? -1 // if b should come later, push a to begin
              : 0; // a and b are equal
          });
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
  }, [componentLoadder]);

  function handleChange(e) {
    const { name, value } = e.target.checked;
    if (e.target.checked) {
      setflagStatus(true);
    } else {
      setflagStatus(false);
    }
  }
  //Method on form feilds on change to bind the data with form state{ e is the target element}
  function handleChangeInput(e) {
    const { name, value, checked } = e.target;
    console.log(tempsections);
    if (value != "") {
      if (value == "F") {
        const list = {
          ...tempsections,
          covidStates: [
            ...tempsections.covidStates.map((con) => {
              let FahrenheitValue;
              let number = con.lowerLimit * (9 / 5) + 32;

              if (number == Math.floor(number)) {
                FahrenheitValue = number;
              } else {
                FahrenheitValue = parseFloat(number).toFixed(5);
              }
              console.log(FahrenheitValue);
              let FahrenheitValueUpper;
              let number1 = con.upperLimit * (9 / 5) + 32;
              if (number1 == Math.floor(number1)) {
                FahrenheitValueUpper = number1;
              } else {
                FahrenheitValueUpper = parseFloat(number1).toFixed(5);
              }
              return {
                ...con,
                ["lowerLimit"]: FahrenheitValue,
                ...(con.isNoUpperLimit === false
                  ? {
                      ...con.upperLimit,
                      ["upperLimit"]: FahrenheitValueUpper,
                    }
                  : 0),
                // ["upperLimit"]: parseFloat(
                //   con.upperLimit * (9 / 5) + 32
                // ).toFixed(1),
              };
            }),
          ],
        };

        settempsections(list);
      } else {
        const list = {
          ...tempsections,
          covidStates: [
            ...tempsections.covidStates.map((con) => {
              let celsiusValue;
              let number = ((con.lowerLimit - 32) * 5) / 9;
              console.log(number);

              if (number == Math.floor(number)) {
                celsiusValue = number;
              } else {
                celsiusValue = parseFloat(number).toFixed(5);
              }
              let celsiusUpperLimit;
              let number1 = ((con.upperLimit - 32) * 5) / 9;
              if (number1 == Math.floor(number1)) {
                celsiusUpperLimit = number1;
              } else {
                celsiusUpperLimit = parseFloat(number1).toFixed(5);
              }
              return {
                ...con,
                ["lowerLimit"]: celsiusValue,
                ...(con.isNoUpperLimit === false
                  ? {
                      ...con.upperLimit,
                      ["upperLimit"]: celsiusUpperLimit,
                    }
                  : 0),
                // ["upperLimit"]: parseFloat(
                //   ((con.upperLimit - 32) * 5) / 9
                // ).toFixed(1),
              };
            }),
          ],
        };

        settempsections(list);
      }

      settempsections((tempsections) => ({
        ...tempsections,
        [name]: value,
      }));
    }
  }
  //Method on change of lower limit/upper/no limit on change to bind with form feilds {index is the row index }
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
  //Method for eventual consistency to open popup  to update the global settings
  const handleClickOpenEventualModal = () => {
    setOpenConfirmationModal(true);
    setConfirmationModalActionType("TemperatureRangesettingsSuccess");
    setConfirmationHeaderTittle("Success");
    setConfirmationDialogContextText(`Updated temperature range settings.`);
    setConfirmationDialogContextTextNext(
      `Click OK to continue working on the same page.`
    );
  };
  /**
   * Method on change of covid stata dropdown
   * @param  {} e-target element
   * @param  {} value-selected covid state value
   * @param  {} index-index
   */
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

  //Method to remove the multiple added upper/lower/no limit feilds in row {j is the index}
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
  //Method to add  the multiple added upper/lower/no limit feilds in row {j is row the index}
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

  //Method on click of cancel to redirect to some component
  function handleClickGoBackToPage() {
    settempsections(oldData);
  }
  //Method on click of form submit and call the api and eventual consistency function
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
          if (
            parseFloat(item.lowerLimit) <=
            parseFloat(getCovidStates[i - 1].upperLimit)
          ) {
            isValidTempRange = false;
          }
        }
      }
    });

    if (!isValidTempRange) {
      let errorObject = {
        errors: {
          Message: [
            "The temperature range should not overlap across defined covid states",
          ],
        },
      };
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
    console.log(sendData);

    props
      .updateTemp(sendData)
      .then((result) => {
        // setStateSnackbar(true);
        // setToasterMessage("Updated temperature range settings.");
        // settoasterServerity("success");
        // setisAlertBoxOpened(false);
        setTimeout(() => {
          setComponentLoadder(true);
          // props.setReloadPage(true);
          setshowLoadder(false);
          handleClickOpenEventualModal();
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
                <Grid item xs={3} className="select-validator">
                  <FormControl variant="outlined" fullWidth>
                    <InputLabel
                      id="demo-simple-select-outlined-label"
                      shrink={false}
                      className="select-label"
                    >
                      {!tempsections.temperatureUnit
                        ? "Select temperature"
                        : ""}
                    </InputLabel>
                    <SelectValidator
                      required
                      fullWidth
                      labelId="demo-simple-select-outlined-label"
                      id="demo-simple-select-outlined"
                      value={
                        tempsections.temperatureUnit
                          ? tempsections.temperatureUnit
                          : ""
                      }
                      name="temperatureUnit"
                      onChange={handleChangeInput}
                      validators={["required"]}
                      errorMessages={["Please select temperature UOM"]}
                      InputLabelProps={{ shrink: false }}
                      className="global-input single-select"
                    >
                      <MenuItem value="">
                        <em>None</em>
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
                    </SelectValidator>
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
                                    return !tempsections.covidStates.find(
                                      (sselected) => {
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
                                placeholder="Select covid state"
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
                                    "matchRegexp:^\\d{1,2}(\\.\\d{1,5})?$",
                                    "maxNumber:45",
                                    `minNumber:${parseFloat(
                                      parseFloat(
                                        tempsections.covidStates[i - 1]
                                          .upperLimit
                                      )
                                      //  + parseFloat(0.1)
                                    )}`,
                                  ]
                                : [
                                    "required",
                                    "matchRegexp:^\\d{1,3}(\\.\\d{1,5})?$",
                                    "maxNumber:113",
                                    `minNumber:${parseFloat(
                                      parseFloat(
                                        tempsections.covidStates[i - 1]
                                          .upperLimit
                                      )
                                      // + parseFloat(0.1)
                                    )}`,
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
                                    `Minimum allowed is ${
                                      parseFloat(
                                        tempsections.covidStates[i - 1]
                                          .upperLimit
                                      )
                                      // + parseFloat(0.1)
                                    }`,
                                  ]
                                : [
                                    "Please enter lower limit",
                                    "Entered numbers are not valid",
                                    "Maximum allowed is 113",
                                    `Minimum allowed is ${
                                      parseFloat(
                                        tempsections.covidStates[i - 1]
                                          .upperLimit
                                      )
                                      // + parseFloat(0.1)
                                    }`,
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
                                      `minNumber:${
                                        x.isNoUpperLimit
                                          ? 0
                                          : parseFloat(x.lowerLimit)
                                        //  +
                                        //   parseFloat(0.1)
                                      }`,
                                    ]
                                  : [
                                      "required",
                                      "matchRegexp:^\\d{1,6}(\\.\\d{1,6})?$",
                                      "maxNumber:45",
                                      `minNumber:${
                                        x.isNoUpperLimit
                                          ? 0
                                          : parseFloat(x.lowerLimit)
                                        //  +
                                        //   parseFloat(0.1)
                                      }`,
                                    ]
                                : x.isNoUpperLimit
                                ? [
                                    "matchRegexp:^\\d{1,6}(\\.\\d{1,6})?$",
                                    "maxNumber:113",
                                    `minNumber:${
                                      x.isNoUpperLimit
                                        ? 0
                                        : parseFloat(
                                            parseFloat(x.lowerLimit)
                                            // +
                                            //   parseFloat(0.1)
                                          ).toFixed(5)
                                    }`,
                                  ]
                                : [
                                    "required",
                                    "matchRegexp:^\\d{1,6}(\\.\\d{1,6})?$",
                                    "maxNumber:113",
                                    `minNumber:${
                                      x.isNoUpperLimit
                                        ? 0
                                        : parseFloat(
                                            parseFloat(x.lowerLimit)
                                            //  +
                                            //   parseFloat(0.1)
                                          ).toFixed(5)
                                    }`,
                                  ]
                            }
                            errorMessages={
                              tempsections.temperatureUnit == "C"
                                ? x.isNoUpperLimit
                                  ? [
                                      "Entered numbers are not valid",
                                      `Maximum allowed is ${
                                        x.isNoUpperLimit ? 0 : 45
                                      }`,
                                      `Minimum allowed is ${
                                        x.isNoUpperLimit
                                          ? 0
                                          : parseFloat(x.lowerLimit)
                                        // +
                                        //   parseFloat(0.1)
                                      }`,
                                    ]
                                  : [
                                      "Please enter lower limit",
                                      "Entered numbers are not valid",
                                      `Maximum allowed is ${
                                        x.isNoUpperLimit ? 0 : 45
                                      }`,
                                      `Minimum allowed is ${
                                        x.isNoUpperLimit
                                          ? 0
                                          : parseFloat(x.lowerLimit)
                                        // +
                                        //   parseFloat(0.1)
                                      }`,
                                    ]
                                : x.isNoUpperLimit
                                ? [
                                    "Entered numbers are not valid",
                                    `Maximum allowed is ${
                                      x.isNoUpperLimit ? 0 : 113
                                    }`,
                                    `Minimum allowed is ${
                                      x.isNoUpperLimit
                                        ? 0
                                        : parseFloat(
                                            parseFloat(x.lowerLimit)
                                            //  +
                                            //   parseFloat(0.1)
                                          ).toFixed(5)
                                    }`,
                                  ]
                                : [
                                    "Please enter lower limit",
                                    "Entered numbers are not valid",
                                    `Maximum allowed is ${
                                      x.isNoUpperLimit ? 0 : 113
                                    }`,
                                    `Minimum allowed is ${
                                      x.isNoUpperLimit
                                        ? 0
                                        : parseFloat(
                                            parseFloat(x.lowerLimit)
                                            //  +
                                            //   parseFloat(0.1)
                                          ).toFixed(5)
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
      <ConfirmationDialog
        openConfirmationModal={openConfirmationModal}
        ConfirmationHeaderTittle={ConfirmationHeaderTittle}
        ConfirmationDialogContextText={ConfirmationDialogContextText}
        ConfirmationDialogContextTextNext={ConfirmationDialogContextTextNext}
        setOpenConfirmationModal={setOpenConfirmationModal}
        ConfirmationModalActionType={ConfirmationModalActionType}
        showEventualLoadder={showEventualLoadder}
        setshowEventualLoadder={setshowEventualLoadder}
        setComponentLoadder={setComponentLoadder}
        setReloadPage={setReloadPage}
        componentLoadder={componentLoadder}
      />
    </div>
  );
}

TemperatureRange.propTypes = {
  updateTemp: PropTypes.func.isRequired,
};

function mapStateToProps(state, ownProps) {
  return {
    // loadGlobalSettingsData: state.temperaturerangeState,
    loadGlobalSettingsData: state.loadGlobalSettingsData,
  };
}

const mapDispatchToProps = {
  updateTemp: globalSettingAction.updateTemp,
  // loadGlobalSetting: globalSettingAction.LoadtempGlobalSettingCall,
};

// export default TemperatureRange;
export default connect(mapStateToProps, mapDispatchToProps)(TemperatureRange);
