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

import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";

import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import CovidStateApiServices from "../../../services/masterDataService";
import Checkbox from "@material-ui/core/Checkbox";
import InputAdornment from "@material-ui/core/InputAdornment";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import GlobalSettingApiServices from "../../../services/globalSettingService";

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
      id: "1",
      uomTempvalue: "Farenheit",
    },
    {
      id: "2",
      uomTempvalue: "Celsius",
    },
  ];

  // const [faqId, setFaqId] = useState(getFaqId);
  // const [faqIdSecId, setFaqIdSecId] = useState(getFaqIdSecId);
  const [muivalidatorForm, setmuivalidatorForm] = useState(false);
  const [stateSnackbar, setStateSnackbar] = useState(false);
  const [toasterMessage, setToasterMessage] = useState("");
  const [toasterServerity, settoasterServerity] = useState("");
  const [covidStatelist, setcovidStatelist] = useState([]);
  const [globalsettings, setglobalsettingsId] = useState();
  const [toasterErrorMessageType, settoasterErrorMessageType] = useState(
    "array"
  );
  const [showLoadder, setshowLoadder] = useState(false);
  const [componentLoadder, setComponentLoadder] = useState(true);
  const [faqTittle, setfaqTittle] = useState("");
  const [tempsections, settempsections] = useState({
    // id: "",
    // faqId: "",
    globalSettingsId: globalsettings,
    temperatureUnit: "",
    covidStates: [
      {
        id: "",
        lowerLimit: 0,
        upperLimit: 0,
        covidState: {
          id: "",
          state: "",
        },
      },
    ],
  });
  useEffect(() => {
    Promise.all([
      CovidStateApi.getCOVIDStates(),
      GlobalSettingApi.getLoadGlobalSetting(),
    ])
      .then(([result, globalSettings]) => {
        // setcomponentLoadder(false);
        setcovidStatelist(result);
        console.log(globalSettings.id);
        tempsections.globalSettingsId = globalSettings.id;
      })
      .catch((err) => {
        console.log("eror");
        console.log(err);
      });
    setComponentLoadder(false);
    //   if (getFaqIdSecId != 0) {
    //     faqApiCall
    //       .getFaqById(props.match.params.id)
    //       .then((faqDetails) => {
    //         setfaqTittle(faqDetails.title);
    //         let allSections = faqDetails.sections;
    //         let selectedSection = allSections.filter((sec) => {
    //           return sec.id == getFaqIdSecId;
    //         });
    //         if (selectedSection.length > 0) {
    //           settempsections(selectedSection[0]);
    //         }
    //         setComponentLoadder(false);
    //       })
    //       .catch((error) => {
    //         console.log(error);
    //       });
    //   } else {
    //     faqApiCall
    //       .getFaqById(props.match.params.id)
    //       .then((faqDetails) => {
    //         setfaqTittle(faqDetails.title);
    //         setComponentLoadder(false);
    //       })
    //       .catch((err) => {
    //         console.log(err);
    //       });
    //   }
  }, []);
  function handleChangeInput(e) {
    const { name, value } = e.target;
    settempsections((tempsections) => ({
      ...tempsections,
      [name]: value,
    }));
  }
  const handleInputChangeContacts = (e, index) => {
    const { name, value } = e.target;
    const list = {
      ...tempsections,
      covidStates: [
        ...tempsections.covidStates.map((con, conIndex) =>
          conIndex == index ? { ...con, [name]: value } : con
        ),
      ],
    };
    settempsections(list);
  };
  const handleRemoveClickContacts = (j) => {
    const list = { ...tempsections };
    list.covidStates.splice(j, 1);
    settempsections(list);
  };
  const handleAddClickContacts = (index, j) => {
    const list = { ...tempsections };
    const thistempsections = list.covidStates;
    list.covidStates = [
      ...thistempsections,
      // {
      //   questionNameId: "",
      //   questionName: "",
      //   answer: "",
      // },
      {
        id: "",
        lowerLimit: 0,
        upperLimit: 0,
        covidState: {
          id: "",
          state: "",
        },
      },
    ];
    settempsections(list);
  };
  function handleClickGoBackToPage() {
    // props.history.push("/emergencycontacts/view");
  }
  function submitForm(e) {
    e.preventDefault();
    let sendData = tempsections;
    console.log(JSON.stringify(sendData));
    // ValidateSubmitForm();
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
      <Breadcrumbs aria-label="breadcrumb" className="global-breadcrumb">
        <LinkTo
          color="inherit"
          href="#"
          to={`/home/dashboard`}
          className="inactive"
        >
          Home
        </LinkTo>
        <LinkTo
          color="textPrimary"
          href="#"
          to={`/faq/allfaqs`}
          className="inactive"
        >
          Temperature Range
        </LinkTo>
      </Breadcrumbs>
      {!componentLoadder ? (
        <Paper className="main-paper">
          <ValidatorForm className={`global-form`} onSubmit={submitForm}>
            <Grid container spacing={3}>
              <Grid item container xs={12}>
                <Grid item xs={3}>
                  <label className="required">Temperature Unit</label>
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
                              <MenuItem
                                key={tempvalue.id}
                                value={tempvalue.uomTempvalue}
                              >
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
                      <Grid container spacing={3}>
                        <Grid
                          container
                          spacing={1}
                          item
                          xs={12}
                          className={[classes.gridDispaly].join(" ")}
                          key={`section-container${i}`}
                        >
                          <Grid item xs={3}>
                            <label className="required">
                              Select COVID state
                            </label>
                          </Grid>
                          <Grid item xs={2}>
                            <Autocomplete
                              id="tags-outlined"
                              // /options={teamManagers}
                              options={
                                covidStatelist && covidStatelist.length > 0
                                  ? covidStatelist
                                  : []
                              }
                              getOptionLabel={(option) => option.stateName}
                              onChange={(e) => handleInputChangeContacts(e, i)}
                              // defaultValue={formData.manager ? formData.manager : {}}
                              defaultValue={x.covidState}
                              filterSelectedOptions
                              className="global-input autocomplete-select"
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  variant="outlined"
                                  placeholder="Select  covid state"
                                />
                              )}
                            />
                          </Grid>
                          <Grid item xs={2}>
                            <TextValidator
                              variant="outlined"
                              validators={["required", "matchRegexp:^.{0,60}$"]}
                              errorMessages={[
                                "Please enter upperLimit",
                                "Maximum 60 characters",
                              ]}
                              fullWidth
                              id={`upperLimit_${i}`}
                              placeholder="upperLimit name *"
                              name="upperLimit"
                              value={x.upperLimit}
                              onChange={(e) => handleInputChangeContacts(e, i)}
                              className="global-input"
                              InputLabelProps={{ shrink: false }}
                              InputProps={{
                                endAdornment: (
                                  <InputAdornment position="end">
                                    F
                                  </InputAdornment>
                                ),
                              }}
                            />
                          </Grid>
                          <Grid item xs={2}>
                            <TextValidator
                              variant="outlined"
                              validators={["required"]}
                              errorMessages={["Please enter lowerLimit"]}
                              fullWidth
                              id={`lowerLimit_${i}`}
                              placeholder="lowerLimit *"
                              name="lowerLimit"
                              value={x.lowerLimit}
                              onChange={(e) => handleInputChangeContacts(e, i)}
                              className="global-input"
                              InputLabelProps={{ shrink: false }}
                              InputProps={{
                                endAdornment: (
                                  <InputAdornment position="end">
                                    F
                                  </InputAdornment>
                                ),
                              }}
                            />
                          </Grid>
                          <Grid item xs={2} className="row-icons-container">
                            {
                              <FormControlLabel
                                control={<Checkbox name="checkedA" />}
                                label="No limit"
                              />
                            }
                          </Grid>

                          <Grid item xs={1} className="row-icons-container">
                            {tempsections.covidStates.length !== 1 && (
                              <Tooltip title="Remove">
                                <CancelIcon
                                  className={`delete-row-icon`}
                                  onClick={() => handleRemoveClickContacts(i)}
                                ></CancelIcon>
                              </Tooltip>
                            )}
                            {tempsections.covidStates.length - 1 === i && (
                              <Tooltip title="Add">
                                <AddCircleIcon
                                  className={`add-row-icon`}
                                  onClick={handleAddClickContacts}
                                ></AddCircleIcon>
                              </Tooltip>
                            )}
                          </Grid>
                        </Grid>
                      </Grid>
                    );
                  })
                : ""}

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

export default TemperatureRange;
