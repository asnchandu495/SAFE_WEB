import React, { Fragment, useEffect, useState } from "react";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import Grid from "@material-ui/core/Grid";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import { Link as LinkTo } from "react-router-dom";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";
import ToasterMessageComponent from "../common/toaster";
import ButtonLoadderComponent from "../common/loadder/buttonloadder";
import ComponentLoadderComponent from "../common/loadder/componentloadder";
import FaqService from "../../services/faqService";
import AlertBoxComponent from "../common/alert";
import MasterDataService from "../../services/masterDataService";

function CreateFAQ(props) {
  const paramsId = props.match.params.id;
  const faqApiCall = new FaqService();
  const masterApiCall = new MasterDataService();

  const [stateSnackbar, setStateSnackbar] = useState(false);
  const [toasterMessage, setToasterMessage] = useState("");
  const [toasterServerity, settoasterServerity] = useState("");
  const [componentLoadder, setComponentLoadder] = useState(true);
  const [isAlertBoxOpened, setisAlertBoxOpened] = useState(false);
  const [toasterErrorMessageType, settoasterErrorMessageType] = useState(
    "array"
  );
  const [showLoadder, setshowLoadder] = useState(false);
  const [formData, SetformData] = useState({
    id: "",
    title: "",
    languageId: "",
  });
  const [allLanguages, setAllLanguages] = useState([]);

  useEffect(() => {
    if (paramsId != 0) {
      Promise.all([
        faqApiCall.getFaqById(props.match.params.id),
        masterApiCall.getAllLanguages(),
      ])
        .then(([faqDetails, getLanguages]) => {
          let newFormData = {
            id: faqDetails.id,
            title: faqDetails.title,
            // languageId: faqDetails.languageId,
            languageId: "01",
          };
          SetformData(newFormData);
          setAllLanguages(getLanguages);
          setComponentLoadder(false);
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      masterApiCall
        .getAllLanguages()
        .then((res) => {
          setAllLanguages(res);
          setComponentLoadder(false);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [props.userGroupDatas]);

  function submitForm(e) {
    setshowLoadder(true);
    e.preventDefault();
    if (paramsId != 0) {
      var data = formData;
      faqApiCall
        .UpdateFaq(data)
        .then((result) => {
          setStateSnackbar(true);
          setToasterMessage("FAQ updated");
          settoasterServerity("success");
          setisAlertBoxOpened(false);
          setTimeout(() => {
            setshowLoadder(false);
            props.history.push("/faq/view-faq/" + formData.id);
          }, 6000);
        })
        .catch((err) => {
          setToasterMessage(err.data.errors);
          settoasterServerity("error");
          setStateSnackbar(true);
          setshowLoadder(false);
        });
    } else {
      var data = formData;
      faqApiCall
        .CreateFAQ(data)
        .then((result) => {
          setStateSnackbar(true);
          setToasterMessage("FAQ created");
          settoasterServerity("success");
          setisAlertBoxOpened(false);
          setTimeout(() => {
            setshowLoadder(false);
            SetformData({
              id: "",
              title: "",
              language: "",
            });
            props.history.push(`/faq/faq-sections/${result.id}/0`);
          }, 6000);
        })
        .catch((err) => {
          setToasterMessage(err.data.errors);
          settoasterServerity("error");
          setStateSnackbar(true);
          setshowLoadder(false);
        });
    }
  }

  function handleChange(e) {
    setisAlertBoxOpened(true);
    const { name, value } = e.target;
    SetformData((formData) => ({
      ...formData,
      [name]: value,
    }));
  }

  function BreadcrumbNavigation(getRoute) {
    props.history.push(getRoute);
  }

  function redirectToParent() {
    props.history.push("/faq/allfaqs");
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
        <LinkTo
          color="textPrimary"
          href="#"
          to={`/faq/allfaqs`}
          className="inactive"
        >
          FAQs
        </LinkTo>
        <LinkTo color="textPrimary" href="#" className="active">
          {paramsId != 0 ? "Update FAQ" : "Create FAQ"}
        </LinkTo>
      </Breadcrumbs>
      {!componentLoadder ? (
        <>
          <Paper className={`main-paper`}>
            <ValidatorForm className={`global-form`} onSubmit={submitForm}>
              <Grid container spacing={3}>
                <Grid item container xs={12}>
                  <Grid item xs={3}>
                    <label className="required">Title</label>
                  </Grid>
                  <Grid item xs={5}>
                    <TextValidator
                      variant="outlined"
                      validators={[
                        "required",
                        "matchRegexp:^[a-zA-Z0-9 ]*$",
                        "matchRegexp:^.{0,50}$",
                      ]}
                      errorMessages={[
                        "Please enter title",
                        "Special charcters are not allowed",
                        "Maximum 50 characters",
                      ]}
                      fullWidth
                      id="title"
                      placeholder="Title"
                      name="title"
                      onChange={handleChange}
                      value={formData.title}
                      className="global-input"
                      InputLabelProps={{ shrink: false }}
                    />
                  </Grid>
                </Grid>
                <Grid item container xs={12}>
                  <Grid item xs={3}>
                    <label className="required">Language</label>
                  </Grid>
                  <Grid item xs={3}>
                    <FormControl variant="outlined" fullWidth>
                      <InputLabel
                        id="demo-simple-select-outlined-label"
                        shrink={false}
                        className="select-label"
                      >
                        {formData.languageId == "" ? " Select language" : ""}
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-outlined-label"
                        id="demo-simple-select-outlined"
                        placeholder="Select language"
                        name="languageId"
                        value={formData.languageId ? formData.languageId : ""}
                        onChange={handleChange}
                        required
                        InputLabelProps={{ shrink: false }}
                        className="global-input single-select"
                      >
                        <MenuItem value="">None</MenuItem>
                        {allLanguages.length > 0
                          ? allLanguages.map((lan) => {
                              return (
                                <MenuItem value={lan.id}>{lan.name}</MenuItem>
                              );
                            })
                          : ""}
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
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
                        onClick={redirectToParent}
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
        </>
      ) : (
        <ComponentLoadderComponent></ComponentLoadderComponent>
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

export default CreateFAQ;
