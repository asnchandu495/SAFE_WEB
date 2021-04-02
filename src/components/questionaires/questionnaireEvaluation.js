import React, { Fragment, useEffect, useState } from "react";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import { Link as LinkTo } from "react-router-dom";
import MUIDataTable from "mui-datatables";
import { connect } from "react-redux";
import * as UserGroupAction from "../../Redux/Action/userGroupAction";
import PropTypes from "prop-types";
import Button from "@material-ui/core/Button";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import AppBar from "@material-ui/core/AppBar";
import Box from "@material-ui/core/Box";
import UserGroupApiServices from "../../services/userGroupService";
import questionaireService from "../../services/questionaireService";

function QuestionnaireEvaluation(props) {}

// function mapStateToProps(state, ownProps) {
//   return {
//     UserGroupData: state.usergroup,
//   };
// }

// const mapDispatchToProps = {
//   LoadAllUserGroup: UserGroupAction.loadUserGroup,
// };

export default QuestionnaireEvaluation;
