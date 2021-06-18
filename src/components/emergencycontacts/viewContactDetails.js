import React, { useState, useEffect } from "react";
import Grid from "@material-ui/core/Grid";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import { Link as LinkTo } from "react-router-dom";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import { connect } from "react-redux";
import * as EmergencyContactAction from "../../Redux/Action/emergencyContactAction";
import PropTypes from "prop-types";
import ToasterMessageComponent from "../common/toaster";

function ViewEmergencyContactDetails(props) {
  const getEmergencyContactId = props.match.params.id;

  const [emergencyContact, setEmergencyContact] = useState({
    id: "",
    title: "",
    language: "",
    contactDetails: [
      {
        emergencyContactId: "",
        purpose: "",
        numbers: "",
      },
    ],
  });
  const [emergencyContactId, setEmergencyContactId] = useState(
    getEmergencyContactId
  );
  const [stateSnackbar, setStateSnackbar] = useState(false);
  const [toasterMessage, setToasterMessage] = useState("");
  const [toasterServerity, settoasterServerity] = useState("");
  const [toasterErrorMessageType, settoasterErrorMessageType] =
    useState("array");

  useEffect(() => {
    if (emergencyContactId != 0) {
      setEmergencyContact(props.emergencyContactData);
    }
  }, []);

  function goBack() {
    props.history.push("/emergencycontacts/view");
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
          to={`/emergencycontacts/view`}
          className="inactive"
        >
          Emergency Contacts
        </LinkTo>
        <LinkTo color="textPrimary" href="#" className="active">
          {emergencyContact.title}
        </LinkTo>
      </Breadcrumbs>
      <Paper className="main-paper">
        <form className={`global-form`}>
          <Grid container spacing={3}>
            <Grid item container xs={12}>
              <Grid item xs={3}>
                <label>Title</label>
              </Grid>
              <Grid item xs={3}>
                <label>{emergencyContact.title}</label>
              </Grid>
            </Grid>
            <Grid item container xs={12}>
              <Grid item xs={3}>
                <label>Language</label>
              </Grid>
              <Grid item xs={3}>
                <label>{emergencyContact.language}</label>
              </Grid>
            </Grid>
            <Grid item container xs={12}>
              <Grid item xs={3}>
                <label>Contact Details</label>
              </Grid>
              <Grid container item xs={9}>
                {emergencyContact.contactDetails.map((x, i) => {
                  return (
                    <Grid
                      container
                      spacing={1}
                      item
                      xs={12}
                      className="grid-margin-bottom"
                    >
                      <Grid item xs={10}>
                        <Paper className="main-paper grid-paper">
                          <Grid container spacing={1} item xs={12}>
                            <Grid item xs={4}>
                              <label>{x.purpose}</label>
                            </Grid>
                            <Grid item xs={8}>
                              <label>{x.numbers}</label>
                            </Grid>
                          </Grid>
                        </Paper>
                      </Grid>
                    </Grid>
                  );
                })}
              </Grid>
            </Grid>
            <Grid
              item
              xs={12}
              container
              direction="row"
              justify="flex-end"
              alignItems="center"
            >
              <div className={`form-buttons-container`}>
                <Button
                  variant="contained"
                  type="button"
                  onClick={goBack}
                  className="global-cancel-btn"
                >
                  Close
                </Button>
              </div>
            </Grid>
          </Grid>
        </form>
      </Paper>
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

ViewEmergencyContactDetails.propTypes = {
  addEmergencyContact: PropTypes.func.isRequired,
  emergencyContactData: PropTypes.object.isRequired,
  loadEmergencyContacts: PropTypes.array.isRequired,
};

export function getEmergencyContactById(loadEmergencyContacts, id) {
  return (
    loadEmergencyContacts.find(
      (emergencyContactData) => emergencyContactData.id === id
    ) || null
  );
}

function mapStateToProps(state, ownProps) {
  const id = ownProps.match.params.id;
  const emptyObject = {};
  const emergencyContactData =
    id && state.loadEmergencyContacts.length > 0
      ? getEmergencyContactById(state.loadEmergencyContacts, id)
      : emptyObject;
  return {
    emergencyContactData,
    loadEmergencyContacts: state.loadEmergencyContacts,
  };
}

const mapDispatchToProps = {
  CreateNewEmergencyContact: EmergencyContactAction.CreateNewEmergencyContact,
  UpdateEmergencyContact: EmergencyContactAction.UpdateEmergencyContact,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ViewEmergencyContactDetails);
