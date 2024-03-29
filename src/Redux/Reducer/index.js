import { combineReducers } from "redux";
import userState from "./userReducer";
import loadEmergencyContactState from "./emergencyContactReducer";
import loadAssignEmergencyContactState from "./assignemergencyContactReducer";
import loadUserDesignationState from "./designationReducer";
import loadCovidStateState from "./covidStateReducer";
import loadGlobalSettingsDataState from "./globalSettingReducer";
import userGroupState from "./userGroupReducer";
import loadfaqState from "./faqReducer";
import loadSiteState from "./siteReducer";
import loadFloorState from "./addFloorReducer";
import loadLocationState from "./addLocationReducer";
import loadAssignFaq from "./assignFaqReducer";
import teamState from "./teamReducer";
import questionaireStates from "./questionaireReducer";
import assignquestionaireStates from "./assignquestionaireReducer";
import questionStates from "./questionReducer";
import workflowStates from "./workflowReducer";
import publishReducers from "./publishFaqReducer";
import gridState from "./gridReducer";
import acmState from "./acmReducer";
//Maintain a single state for each react component
const rootReducer = combineReducers({
  user: userState,
  loadEmergencyContacts: loadEmergencyContactState,
  loadAssignEmergencyContacts: loadAssignEmergencyContactState,
  usergroup: userGroupState,
  userDesignation: loadUserDesignationState,
  covidState: loadCovidStateState,
  loadGlobalSettingsData: loadGlobalSettingsDataState,
  faqState: loadfaqState,
  SiteState: loadSiteState,
  FloorState: loadFloorState,
  LocationState: loadLocationState,
  AssignFaqState: loadAssignFaq,
  team: teamState,
  questionaireState: questionaireStates,
  assignquestionaireState: assignquestionaireStates,
  questionState: questionStates,
  workflowState: workflowStates,
  publishReducer: publishReducers,
  gridHistory: gridState,
  acmData: acmState,
});

export default rootReducer;
