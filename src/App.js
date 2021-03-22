import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import AuthLayout from "./components/layouts/AuthLayout";
import Signin from "./components/auth/signin";
import ForgotPassword from "./components/auth/forgotpassword";
import EnterOtp from "./components/auth/enterOTP";
import ResetPassword from "./components/auth/resetpassword";
import AdminLayout from "./components/layouts/AdminLayout";
import Dashboard from "./components/dashboard";
import ListEmergencyContacts from "./components/emergencycontacts";
import AssignEmergencyContacts from "./components/emergencycontacts/assignemergencycontact";
import CreateNew from "./components/emergencycontacts/createNew";
import viewContactDetails from "./components/emergencycontacts/viewContactDetails";
import AddContacts from "./components/emergencycontacts/addContacts";
import ListCovidState from "./components/covidState/index";
import CreateCovidState from "./components/covidState/addCovidState";
import ViewCovidState from "./components/covidState/viewCovidState";
import ListAssignedDesignation from "./components/designation/index";
import AddDesignation from "./components/designation/addDesgination";
import ViewDesignation from "./components/designation/viewDesignation";
import GlobalSetting from "./components/setting/globalsetting";
import TemperatureRange from "./components/setting/temperaturerange";
import UserGroup from "./components/usergroup";
import CreateUserGroup from "./components/usergroup/createusergroup";
import AddedPrimaryUserToUserGroup from "./components/usergroup/addprimaryusertousergroup";
import AddedSecondaryUserToUserGroup from "./components/usergroup/addsecondaryusertousergroup";
import ViewUserGroup from "./components/usergroup/viewusergroup";
import createSite from "./components/site/createSite";
import listSite from "./components/site/index";
import AddFloor from "./components/site/addFloor";
import ListFloor from "./components/site/listFloor";
import Addlocation from "./components/site/addLocation";
import Listlocation from "./components/site/listLocation";
import ViewSite from "./components/site/viewSite";
import ViewAllFAQs from "./components/faqs";
import CreateFAQ from "./components/faqs/createFAQ";
import FaqSections from "./components/faqs/sections";
import ViewFaq from "./components/faqs/viewFAQ";
import AssignedFAQs from "./components/faqs/assignFAQ";
import Users from "./components/users";
import CreateUser from "./components/users/CreateUser";
import UpdateUserDetails from "./components/users/updateUserDetails";
import ImportUsers from "./components/users/ImportUsers";
import ImportUsersHistory from "./components/users/ImportUserHistory";
import ViewUser from "./components/users/viewUsers";
import UserProfie from "./components/profile";
import AddedPrimaryUserTeam from "./components/teams/addedprimaryuserteam"
import Questionaire from "./components/questionaires";
import CreateQuestionarie from "./components/questionaires/createQuestionaire";
import AddQuestion from "./components/questionaires/addQuestion";
import InternalServer from "./components/common/ErrorPage/InternalServerError/index";
import Unauthorized from "./components/common/ErrorPage/Unauthorized/index";


import Teams from "./components/teams";
import CreateTeam from "./components/teams/CreateTeam";
import ViewTeam from "./components/teams/ViewTeam";

function App(props) {
  const AuthContainer = () => {
    return (
      <AuthLayout>
        <Route exact path="/" component={Signin}></Route>
        <Route path="/ForgotPassword" component={ForgotPassword}></Route>
        <Route path="/verify-otp" component={EnterOtp}></Route>
        <Route path="/reset-password/:id" component={ResetPassword}></Route>
      </AuthLayout>
    );
  };

  const ErrorPageContainer = () => (
    <div>
      <Route path="/InternalServerError" component={InternalServer} />
      <Route path="/Unauthorized" component={Unauthorized} />
    </div>
  );

  const AdminContainer = () => {
    return (
      <AdminLayout>
        <Route path="/home/dashboard" component={Dashboard}></Route>
        <Route
          path="/emergencycontacts/view"
          component={ListEmergencyContacts}
        ></Route>
        <Route
          path="/emergencycontacts/create/:id"
          component={CreateNew}
        ></Route>
        <Route
          path="/emergencycontacts/add-contacts/:id"
          component={AddContacts}
        ></Route>
        <Route
          path="/emergencycontacts/view-contact-details/:id"
          component={viewContactDetails}
        ></Route>
        <Route
          path="/emergencycontacts/assign"
          component={AssignEmergencyContacts}
        ></Route>
        <Route
          path="/covidstate/all-covidstate"
          component={ListCovidState}
        ></Route>
        <Route
          path="/covidstate/add-covidstate"
          component={CreateCovidState}
        ></Route>
        <Route
          path="/covidstate/update-covidstate/:id"
          component={CreateCovidState}
        ></Route>
        <Route
          path="/covidstate/view-covidstate/:id"
          component={ViewCovidState}
        ></Route>
        <Route
          path="/designation/all-designation"
          component={ListAssignedDesignation}
        ></Route>
        <Route
          path="/designation/create-designation/:id"
          component={AddDesignation}
        ></Route>
        <Route
          path="/designation/update-designation/:id"
          component={AddDesignation}
        ></Route>
        <Route
          path="/designation/view-designation/:id"
          component={ViewDesignation}
        ></Route>
        <Route path="/setting/global-setting" component={GlobalSetting}></Route>
        <Route
          path="/setting/temperature-range"
          component={TemperatureRange}
        ></Route>
        <Route path="/usergroups/allusergroups" component={UserGroup}></Route>
        <Route
          path="/usergroups/add-usergroup/:id"
          component={CreateUserGroup}
        ></Route>
        <Route
          path="/usergroups/update-usergroup/:id"
          component={CreateUserGroup}
        ></Route>
        <Route
          path="/usergroups/add-primaryuser-to-usergroup/:id"
          component={AddedPrimaryUserToUserGroup}
        ></Route>
        <Route
          path="/usergroups/add-secondaryuser-to-usergroup/:id"
          component={AddedSecondaryUserToUserGroup}
        ></Route>
        <Route
          path="/usergroups/view-usergroup/:id"
          component={ViewUserGroup}
        ></Route>
        <Route path="/site/create-site" component={createSite}></Route>
        <Route path="/site/update-site/:id" component={createSite}></Route>
        <Route path="/site/all-site" component={listSite}></Route>
        <Route path="/site/view-site/:id" component={ViewSite}></Route>
        <Route path="/site/add-floor" component={AddFloor}></Route>
        <Route path="/site/:siteId/list-floor" component={ListFloor}></Route>
        <Route path="/site/add-location" component={Addlocation}></Route>
        <Route
          path="/site/:siteId/list-location"
          component={Listlocation}
        ></Route>
        <Route path="/faq/allfaqs" component={ViewAllFAQs}></Route>
        <Route path="/faq/add-faq/:id" component={CreateFAQ}></Route>
        <Route
          path="/faq/faq-sections/:id/:secId"
          component={FaqSections}
        ></Route>
        <Route path="/faq/view-faq/:id" component={ViewFaq}></Route>
        <Route path="/faq/assigned-faqs" component={AssignedFAQs}></Route>
        <Route path="/users/allusers" component={Users}></Route>
        <Route
          path="/users/update-user-details/:id"
          component={UpdateUserDetails}
        ></Route>
        <Route path="/users/add-user" component={CreateUser}></Route>
        <Route path="/users/view-user/:id" component={ViewUser}></Route>
        <Route path="/users/update-user/:id" component={CreateUser}></Route>
        <Route exact path="/users/import-users" component={ImportUsers}></Route>
        <Route
          path="/users/import-users-history"
          component={ImportUsersHistory}
        ></Route>
        <Route path="/user/view-profile" component={UserProfie}></Route>
        <Route path="/teams/allteams" component={Teams}></Route>
        <Route path="/teams/add-teams/:id" component={CreateTeam}></Route>
        <Route
          path="/teams/add-primary-user-teams/:id"
          component={AddedPrimaryUserTeam}
        ></Route>

       <Route path="/teams/view-team/:id" component={ViewTeam}></Route>




        <Route
          path="/questionaires/allquestionaires"
          component={Questionaire}
        ></Route>
        <Route
          path="/questionaires/create-questionaire/:id"
          component={CreateQuestionarie}
        ></Route>
        <Route
          path="/questionaires/add-questions/:id/:qid"
          component={AddQuestion}
        ></Route>
      </AdminLayout>
    );
  };

  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={AuthContainer}></Route>
        <Route path="/ForgotPassword" component={AuthContainer}></Route>
        <Route path="/verify-otp" component={AuthContainer}></Route>
        <Route path="/reset-password/:id" component={AuthContainer}></Route>
        <Route path="/home/dashboard" component={AdminContainer}></Route>
        <Route
          path="/emergencycontacts/view"
          component={AdminContainer}
        ></Route>
        <Route
          path="/emergencycontacts/create/:id"
          component={AdminContainer}
        ></Route>
        <Route path="/users/view-user/:id" component={AdminContainer}></Route>
        <Route
          path="/emergencycontacts/add-contacts/:id"
          component={AdminContainer}
        ></Route>
        <Route
          path="/emergencycontacts/view-contact-details/:id"
          component={AdminContainer}
        ></Route>
        <Route
          path="/emergencycontacts/assign"
          component={AdminContainer}
        ></Route>
        <Route
          path="/covidstate/all-covidstate"
          component={AdminContainer}
        ></Route>
        <Route
          path="/covidstate/add-covidstate"
          component={AdminContainer}
        ></Route>
        <Route
          path="/covidstate/update-covidstate/:id"
          component={AdminContainer}
        ></Route>
        <Route
          path="/covidstate/view-covidstate/:id"
          component={AdminContainer}
        ></Route>
        <Route
          path="/designation/all-designation"
          component={AdminContainer}
        ></Route>
        <Route
          path="/designation/create-designation/:id"
          component={AdminContainer}
        ></Route>
        <Route
          path="/deupdate-designationsignation//:id"
          component={AdminContainer}
        ></Route>
        <Route
          path="/designation/view-designation/:id"
          component={AdminContainer}
        ></Route>
        <Route
          path="/setting/global-setting"
          component={AdminContainer}
        ></Route>
        <Route
          path="/setting/temperature-range"
          component={AdminContainer}
        ></Route>
        <Route
          path="/usergroups/allusergroups"
          component={AdminContainer}
        ></Route>
        <Route
          path="/usergroups/add-usergroup/:id"
          component={AdminContainer}
        ></Route>
        <Route
          path="/usergroups/update-usergroup/:id"
          component={AdminContainer}
        ></Route>
        <Route
          path="/usergroups/view-usergroup/:id"
          component={AdminContainer}
        ></Route>
        <Route
          path="/usergroups/add-primaryuser-to-usergroup/:id"
          component={AdminContainer}
        ></Route>
        <Route
          path="/usergroups/add-secondaryuser-to-usergroup/:id"
          component={AdminContainer}
        ></Route>
        <Route path="/site/create-site" component={AdminContainer}></Route>
        <Route path="/site/update-site/:id" component={AdminContainer}></Route>
        <Route path="/site/all-site" component={AdminContainer}></Route>
        <Route path="/site/add-floor" component={AdminContainer}></Route>
        <Route
          path="/site/:siteId/list-floor"
          component={AdminContainer}
        ></Route>
        <Route path="/site/view-site/:id" component={AdminContainer}></Route>
        <Route path="/site/add-location" component={AdminContainer}></Route>
        <Route
          path="/site/:siteId/list-location"
          component={AdminContainer}
        ></Route>
        <Route path="/faq/allfaqs" component={AdminContainer}></Route>
        <Route path="/faq/add-faq/:id" component={AdminContainer}></Route>
        <Route
          path="/faq/faq-sections/:id/:secId"
          component={AdminContainer}
        ></Route>
        <Route path="/faq/assigned-faqs" component={AdminContainer}></Route>
        <Route path="/faq/view-faq/:id" component={AdminContainer}></Route>
        <Route path="/users/allusers" component={AdminContainer}></Route>
        <Route path="/users/add-user" component={AdminContainer}></Route>
        <Route path="/users/update-user/:id" component={AdminContainer}></Route>
        <Route
          path="/users/update-user-details/:id"
          component={AdminContainer}
        ></Route>
        <Route
          exact
          path="/users/import-users"
          component={AdminContainer}
        ></Route>
        <Route
          path="/users/import-users-history"
          component={AdminContainer}
        ></Route>
        <Route path="/users/view-user/:id" component={AdminContainer}></Route>
        <Route path="/user/view-profile" component={AdminContainer}></Route>
        <Route path="/teams/allteams" component={AdminContainer}></Route>
        <Route path="/teams/add-teams/:id" component={AdminContainer}></Route>
        <Route path="/teams/add-primary-user-teams/:id"  component={AdminContainer}
        ></Route>
        <Route
          path="/teams/view-team/:id"
          component={AdminContainer}
        ></Route>
        <Route
          path="/questionaires/allquestionaires"
          component={AdminContainer}
        ></Route>
        <Route
          path="/questionaires/create-questionaire/:id"
          component={AdminContainer}
        ></Route>
        <Route
          path="/questionaires/add-questions/:id/:qid"
          component={AdminContainer}
        ></Route>
        <Route path="/InternalServerError" component={ErrorPageContainer} />
        <Route path="/Unauthorized" component={ErrorPageContainer} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
