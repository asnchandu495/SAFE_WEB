import React, { useState, useEffect } from "react";
import clsx from "clsx";
import { Scrollbars } from "react-custom-scrollbars-2";
import { makeStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import AppBar from "@material-ui/core/AppBar";
import CssBaseline from "@material-ui/core/CssBaseline";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import GroupIcon from "@material-ui/icons/Group";
import DesignationIcon from "@material-ui/icons/AssignmentTurnedIn";
import List from "@material-ui/core/List";
import Typography from "@material-ui/core/Typography";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import CloseIcon from "@material-ui/icons/Close";
import HomeIcon from "@material-ui/icons/Home";
import Collapse from "@material-ui/core/Collapse";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import Divider from "@material-ui/core/Divider";
import AccountCircle from "@material-ui/icons/AccountCircle";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import NotificationsIcon from "@material-ui/icons/Notifications";
import Badge from "@material-ui/core/Badge";
import { Link, withRouter } from "react-router-dom";
import SettingsIcon from "@material-ui/icons/Settings";
import GroupAddIcon from "@material-ui/icons/GroupAdd";
import ContactPhoneIcon from "@material-ui/icons/ContactPhone";
import LiveHelpIcon from "@material-ui/icons/LiveHelp";
import LocalHospitalIcon from "@material-ui/icons/LocalHospital";
import LocationCityIcon from "@material-ui/icons/LocationCity";
import AuthService from "../../services/authService";
import GroupWorkIcon from "@material-ui/icons/GroupWork";
import ListAltIcon from "@material-ui/icons/ListAlt";
import AssessmentIcon from "@material-ui/icons/Assessment";
import Logo from "../assets/Logo-dashboard.svg";
import "./AdminLayout.scss";
import HealingIcon from "@material-ui/icons/Healing";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import * as globalSettingAction from "../../Redux/Action/globalSettingAction";
import * as GridAction from "../../Redux/Action/gridAction";
import WorkIcon from "@material-ui/icons/Work";
import Popover from "@material-ui/core/Popover";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexGrow: 1,
    height: "100vh",
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
    display: "inline-flex",
    height: "100%",
    alignItems: "center",
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    boxShadow: "none",
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    height: "calc(100vh - 60px)",
    marginTop: "60px",
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerContainer: {
    overflowX: "hidden",
  },
  content: {
    flexGrow: 1,
  },
  nested: {
    paddingLeft: theme.spacing(4),
  },
  menuScrollbar: {
    maxHeight: "calc(100vh - 60px) !important",
  },
  contentScrollbar: {
    height: "calc(100vh - 64px) !important",
  },
  mainContent: {
    padding: 15,
    height: "calc(100vh - 60px) !important",
    overflow: "auto",
  },
  button: {
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  actionsContainer: {
    marginBottom: theme.spacing(2),
    borderTop: "1px solid #ccc",
    width: "100%",
    textAlign: "right",
    marginTop: 25,
  },
  resetContainer: {
    padding: theme.spacing(3),
  },
  formRoot: {
    flexGrow: 1,
  },
  menuButton: {
    marginLeft: 15,
  },
  hide: {
    display: "none",
  },
  drawerOpen: {
    width: 240,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    // marginTop: 60,
  },
  drawerClose: {
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: "hidden !important",
    width: 53,
    // marginTop: 60,
  },
}));

function AdminLayout(props) {
  const { children } = props;
  const classes = useStyles();
  const authApiCall = new AuthService();
  const [openUsers, setOpenUsers] = useState(false);
  const [openSetting, setopenSetting] = useState(false);
  const [openUserManagment, setopenUserManagment] = useState(false);
  const [openEmergencyContact, setopenEmergencyContact] = useState(false);
  const [openDesiginationMenu, setopenDesiginationMenu] = useState(false);
  const [openCovidStateMenu, setopenCovidStateMenu] = useState(false);
  const [openFAQMenu, setopenFAQMenu] = useState(false);
  const [openSiteMenu, setopenSiteMenu] = useState(false);
  const [openTeamMenu, setTeamMenu] = useState(false);
  const [openQuestionaires, setOpenQuestionaires] = useState(false);
  const [openWorkflow, setOpenWorkflow] = useState(false);
  const [openReports, setOpenReports] = useState(false);
  const [gridPages, setGridPages] = useState([
    { name: "users", page: 1 },
    { name: "sites", page: 1 },
    { name: "designations", page: 1 },
    { name: "covidStates", page: 1 },
    { name: "faqs", page: 1 },
    { name: "userGroups", page: 1 },
    { name: "emergencyContacts", page: 1 },
    { name: "teams", page: 1 },
    { name: "questionnaire", page: 1 },
    { name: "workflows", page: 1 },
  ]);
  const [anchorEl, setAnchorEl] = useState(null);
  const isMenuOpen = Boolean(anchorEl);
  const [anchorElNotifications, setAnchorElNotifications] = useState(null);
  const openNotifications = Boolean(anchorElNotifications);
  const idNotifications = openNotifications ? "simple-popover" : undefined;

  useEffect(() => {
    if (!authApiCall.loggedIn()) {
      props.history.push("/");
    }
    props.loadGlobalSetting();
    props.loadGridsPages(gridPages);

    if (window.performance) {
      if (performance.type == 1) {
        props.loadGlobalSetting();
      }
    }
  }, []);

  const handleClickLevelMenu = () => {
    setOpenDrawer(true);
    setOpenUsers(!openUsers);
    setopenEmergencyContact(false);
    setopenUserManagment(false);
    setopenDesiginationMenu(false);
    setopenCovidStateMenu(false);
    setopenFAQMenu(false);
    setopenSetting(false);
    setopenSiteMenu(false);
    setTeamMenu(false);
    setOpenQuestionaires(false);
  };

  const handleClickSetting = (value) => {
    setOpenDrawer(true);
    setopenSetting(!openSetting);
    setOpenUsers(false);
    setopenEmergencyContact(false);
    setopenUserManagment(false);
    setopenDesiginationMenu(false);
    setopenCovidStateMenu(false);
    setopenFAQMenu(false);
    setopenSiteMenu(false);
    setTeamMenu(false);
    setOpenQuestionaires(false);
  };

  const handleClickUserManagment = (value) => {
    setOpenDrawer(true);
    setopenUserManagment(!openUserManagment);
    setOpenUsers(false);
    setopenEmergencyContact(false);
    setopenDesiginationMenu(false);
    setopenCovidStateMenu(false);
    setopenFAQMenu(false);
    setopenSetting(false);
    setopenSiteMenu(false);
    setTeamMenu(false);
    setOpenQuestionaires(false);
  };

  const handleClickEmergencyContact = (value) => {
    setOpenDrawer(true);
    setopenEmergencyContact(!openEmergencyContact);
    setOpenUsers(false);
    setopenUserManagment(false);
    setopenDesiginationMenu(false);
    setopenCovidStateMenu(false);
    setopenFAQMenu(false);
    setopenSetting(false);
    setopenSiteMenu(false);
    setTeamMenu(false);
    setOpenQuestionaires(false);
  };

  const handleClickLevelMenuForOpenDesignation = (value) => {
    setOpenDrawer(true);
    setopenEmergencyContact(false);
    setOpenUsers(false);
    setopenUserManagment(false);
    setopenDesiginationMenu(!openDesiginationMenu);
    setopenCovidStateMenu(false);
    setopenFAQMenu(false);
    setopenSetting(false);
    setopenSiteMenu(false);
    setTeamMenu(false);
    setOpenQuestionaires(false);
  };

  const handleClickLevelMenuCovidState = (value) => {
    setOpenDrawer(true);
    setopenEmergencyContact(false);
    setOpenUsers(false);
    setopenUserManagment(false);
    setopenDesiginationMenu(false);
    setopenCovidStateMenu(!openCovidStateMenu);
    setopenFAQMenu(false);
    setopenSetting(false);
    setopenSiteMenu(false);
    setTeamMenu(false);
    setOpenQuestionaires(false);
  };

  const handleClickLevelMenuFAQ = () => {
    setOpenDrawer(true);
    setopenEmergencyContact(false);
    setOpenUsers(false);
    setopenUserManagment(false);
    setopenDesiginationMenu(false);
    setopenCovidStateMenu(false);
    setopenSetting(false);
    setopenSiteMenu(false);
    setopenFAQMenu(!openFAQMenu);
    setTeamMenu(false);
    setOpenQuestionaires(false);
  };

  const handleClickLevelSiteMenu = () => {
    setOpenDrawer(true);
    setopenEmergencyContact(false);
    setOpenUsers(false);
    setopenUserManagment(false);
    setopenDesiginationMenu(false);
    setopenCovidStateMenu(false);
    setopenSetting(false);
    setopenSiteMenu(!openSiteMenu);
    setopenFAQMenu(false);
    setTeamMenu(false);
    setOpenQuestionaires(false);
  };

  const handleClickTeams = (value) => {
    setOpenDrawer(true);
    setopenUserManagment(false);
    setOpenUsers(false);
    setopenEmergencyContact(false);
    setopenDesiginationMenu(false);
    setopenCovidStateMenu(false);
    setopenFAQMenu(false);
    setopenSetting(false);
    setopenSiteMenu(false);
    setTeamMenu(!openTeamMenu);
    setOpenQuestionaires(false);
  };

  const handleClickopenQuestionaire = () => {
    setOpenDrawer(true);
    setopenEmergencyContact(false);
    setOpenUsers(false);
    setopenUserManagment(false);
    setopenDesiginationMenu(false);
    setopenCovidStateMenu(false);
    setopenSetting(false);
    setopenSiteMenu(false);
    setopenFAQMenu(false);
    setTeamMenu(false);
    setOpenQuestionaires(!openQuestionaires);
  };

  const handleClickopenWorkflow = () => {
    setOpenDrawer(true);
    setopenEmergencyContact(false);
    setOpenUsers(false);
    setopenUserManagment(false);
    setopenDesiginationMenu(false);
    setopenCovidStateMenu(false);
    setopenSetting(false);
    setopenSiteMenu(false);
    setopenFAQMenu(false);
    setTeamMenu(false);
    setOpenQuestionaires(false);
    setOpenWorkflow(!openWorkflow);
  };

  const handleClickopenReports = () => {
    setOpenDrawer(true);
    setopenEmergencyContact(false);
    setOpenUsers(false);
    setopenUserManagment(false);
    setopenDesiginationMenu(false);
    setopenCovidStateMenu(false);
    setopenSetting(false);
    setopenSiteMenu(false);
    setopenFAQMenu(false);
    setTeamMenu(false);
    setOpenQuestionaires(false);
    setOpenWorkflow(false);
    setOpenReports(!openReports);
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  const goToProfilePage = () => {
    setAnchorEl(null);
    props.history.push("/user/view-profile");
  };

  const UseLogOut = () => {
    setAnchorEl(null);
    localStorage.removeItem("id_token");
    localStorage.removeItem("id_tokenExpiry");
    props.history.push("/");
  };

  const menuId = "primary-search-account-menu";
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={goToProfilePage}>Profile</MenuItem>
      <MenuItem onClick={UseLogOut}>Logout</MenuItem>
    </Menu>
  );

  const [openDrawer, setOpenDrawer] = useState(false);

  const handleDrawerOpen = () => {
    if (openDrawer) {
      setOpenDrawer(false);
    } else {
      setOpenDrawer(true);
    }
  };

  const handleDrawerClose = () => {
    setOpenDrawer(false);
  };

  function collapseAllMenu() {
    setopenEmergencyContact(false);
    setOpenUsers(false);
    setopenUserManagment(false);
    setopenDesiginationMenu(false);
    setopenCovidStateMenu(false);
    setopenSetting(false);
    setopenSiteMenu(false);
    setopenFAQMenu(false);
    setTeamMenu(false);
    setOpenQuestionaires(false);
  }

  const handleClickNotifications = (event) => {
    setAnchorElNotifications(event.currentTarget);
  };

  const handleCloseNotifications = () => {
    setAnchorElNotifications(null);
  };

  return (
    <div className={`${classes.root} top-header`}>
      <CssBaseline />
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            <span className="logo-container">
              <img src={Logo} alt="Sutherland" title="Sutherland"></img>
            </span>
            <span>
              <IconButton
                edge="start"
                color="inherit"
                aria-label="menu"
                onClick={handleDrawerOpen}
                className={clsx(classes.menuButton)}
              >
                <MenuIcon />
              </IconButton>
            </span>
            {/* {openDrawer ? (
              <IconButton
                edge="start"
                color="inherit"
                aria-label="menu"
                onClick={handleDrawerOpen}
                className={clsx(classes.menuButton)}
              >
                <CloseIcon />
              </IconButton>
            ) : (
              <IconButton
                edge="start"
                color="inherit"
                aria-label="menu"
                onClick={handleDrawerOpen}
                className={clsx(classes.menuButton)}
              >
                <MenuIcon />
              </IconButton>
            )} */}
          </Typography>
          <IconButton aria-label="show 17 new notifications" color="inherit">
            <Badge badgeContent={5} color="secondary">
              <NotificationsIcon onClick={handleClickNotifications} />
              <Popover
                id={idNotifications}
                open={openNotifications}
                anchorEl={anchorElNotifications}
                onClose={handleCloseNotifications}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "center",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "center",
                }}
                className="notification-container"
              >
                <ul>
                  <li>
                    <b>Saravana</b> has requested a change of WFM location.
                  </li>
                  <li>
                    <b>Sunil</b> has requested a change of WFM location.
                  </li>
                  <li>
                    <b>Hajira</b> has submitted a new profile selfie.
                  </li>
                  <li>
                    <b>Saravana</b> has requested a change of WFM location.
                  </li>
                  <li>
                    <b>Sunil</b> has requested a change of WFM location.
                  </li>
                  <li>
                    <b>Hajira</b> has submitted a new profile selfie.
                  </li>
                </ul>
              </Popover>
            </Badge>
          </IconButton>
          <IconButton
            edge="end"
            aria-label="account of current user"
            aria-controls={menuId}
            aria-haspopup="true"
            onClick={handleProfileMenuOpen}
            color="inherit"
          >
            <AccountCircle />
          </IconButton>
        </Toolbar>
      </AppBar>
      {renderMenu}

      <Drawer
        className={clsx(classes.drawer, {
          [classes.drawerOpen]: openDrawer,
          [classes.drawerClose]: !openDrawer,
        })}
        variant="permanent"
        classes={{
          paper: clsx({
            [classes.drawerOpen]: openDrawer,
            [classes.drawerClose]: !openDrawer,
          }),
        }}
      >
        <Scrollbars
          autoHide
          autoHideTimeout={1000}
          autoHideDuration={200}
          renderTrackVertical={({ style, ...props }) => (
            <div
              {...props}
              style={{
                ...style,
                backgroundColor: "#f6f6f6",
                right: "0px",
                bottom: "2px",
                top: "2px",
                borderRadius: "3px",
                width: "5px",
              }}
            />
          )}
          renderThumbVertical={({ style, ...props }) => (
            <div
              {...props}
              style={{
                ...style,
                width: "5px",
                borderRadius: "4px",
                backgroundColor: "#cccccc",
                left: "0px",
              }}
            />
          )}
          // autoHeight
        >
          <div className={`${classes.drawerContainer} side-menu`}>
            <List>
              <ListItem
                button
                component={Link}
                to="/home/dashboard"
                onClick={collapseAllMenu}
              >
                <ListItemIcon>
                  <HomeIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Home"
                  className={clsx({
                    [classes.hide]: !openDrawer,
                  })}
                />
              </ListItem>
              <Divider></Divider>
              <ListItem button onClick={handleClickLevelMenu}>
                <ListItemIcon>
                  <GroupIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Users"
                  className={clsx({
                    [classes.hide]: !openDrawer,
                  })}
                />
                {openUsers ? (
                  <ExpandLess className="exp-coll-icon" />
                ) : (
                  <ExpandMore className="exp-coll-icon" />
                )}
              </ListItem>
              <Collapse in={openUsers} timeout="auto" unmountOnExit>
                <List
                  component="div"
                  disablePadding
                  className={clsx({
                    [classes.hide]: !openDrawer,
                  })}
                >
                  <ListItem
                    button
                    className={classes.nested}
                    component={Link}
                    to="/users/allusers"
                  >
                    <ListItemIcon>
                      <ArrowForwardIcon />
                    </ListItemIcon>
                    <ListItemText primary="View" />
                  </ListItem>
                  <ListItem
                    button
                    className={classes.nested}
                    component={Link}
                    to="/users/add-user"
                  >
                    <ListItemIcon>
                      <ArrowForwardIcon />
                    </ListItemIcon>
                    <ListItemText primary="Create" />
                  </ListItem>
                  <ListItem
                    button
                    className={classes.nested}
                    component={Link}
                    to="/users/import-users-history"
                  >
                    <ListItemIcon>
                      <ArrowForwardIcon />
                    </ListItemIcon>
                    <ListItemText primary="Import" />
                  </ListItem>
                  {/* <ListItem
                    button
                    className={classes.nested}
                    component={Link}
                    to="/users/import-users"
                  >
                    <ListItemIcon>
                      <ArrowForwardIcon />
                    </ListItemIcon>
                    <ListItemText primary="Import" />
                  </ListItem> */}
                </List>
              </Collapse>
              <Divider></Divider>
              <ListItem button onClick={handleClickLevelSiteMenu}>
                <ListItemIcon>
                  <LocationCityIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Site"
                  className={clsx({
                    [classes.hide]: !openDrawer,
                  })}
                />
                {openSiteMenu ? (
                  <ExpandLess className="exp-coll-icon" />
                ) : (
                  <ExpandMore className="exp-coll-icon" />
                )}
              </ListItem>
              <Collapse in={openSiteMenu} timeout="auto" unmountOnExit>
                <List
                  component="div"
                  disablePadding
                  className={clsx({
                    [classes.hide]: !openDrawer,
                  })}
                >
                  <ListItem
                    button
                    className={classes.nested}
                    component={Link}
                    to="/site/all-site"
                  >
                    <ListItemIcon>
                      <ArrowForwardIcon />
                    </ListItemIcon>
                    <ListItemText primary="View" />
                  </ListItem>
                  <ListItem
                    button
                    className={classes.nested}
                    component={Link}
                    to="/site/create-site"
                  >
                    <ListItemIcon>
                      <ArrowForwardIcon />
                    </ListItemIcon>
                    <ListItemText primary="Create site" />
                  </ListItem>
                </List>
              </Collapse>
              <Divider></Divider>
              <ListItem button onClick={handleClickLevelMenuForOpenDesignation}>
                <ListItemIcon>
                  <DesignationIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Designation"
                  className={clsx({
                    [classes.hide]: !openDrawer,
                  })}
                />
                {openDesiginationMenu ? (
                  <ExpandLess className="exp-coll-icon" />
                ) : (
                  <ExpandMore className="exp-coll-icon" />
                )}
              </ListItem>
              <Collapse in={openDesiginationMenu} timeout="auto" unmountOnExit>
                <List
                  component="div"
                  disablePadding
                  className={clsx({
                    [classes.hide]: !openDrawer,
                  })}
                >
                  <ListItem
                    button
                    className={classes.nested}
                    component={Link}
                    to="/designation/all-designation"
                  >
                    <ListItemIcon>
                      <ArrowForwardIcon />
                    </ListItemIcon>
                    <ListItemText primary="View" />
                  </ListItem>
                  <ListItem
                    button
                    className={classes.nested}
                    component={Link}
                    to="/designation/create-designation/0"
                  >
                    <ListItemIcon>
                      <ArrowForwardIcon />
                    </ListItemIcon>
                    <ListItemText primary="Create" />
                  </ListItem>
                </List>
              </Collapse>
              <Divider></Divider>
              <ListItem button onClick={handleClickLevelMenuCovidState}>
                <ListItemIcon>
                  <LocalHospitalIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Covid State"
                  className={clsx({
                    [classes.hide]: !openDrawer,
                  })}
                />
                {openCovidStateMenu ? (
                  <ExpandLess className="exp-coll-icon" />
                ) : (
                  <ExpandMore className="exp-coll-icon" />
                )}
              </ListItem>
              <Collapse in={openCovidStateMenu} timeout="auto" unmountOnExit>
                <List
                  component="div"
                  disablePadding
                  className={clsx({
                    [classes.hide]: !openDrawer,
                  })}
                >
                  <ListItem
                    button
                    className={classes.nested}
                    component={Link}
                    to="/covidstate/all-covidstate"
                  >
                    <ListItemIcon>
                      <ArrowForwardIcon />
                    </ListItemIcon>
                    <ListItemText primary="View" />
                  </ListItem>
                  <ListItem
                    button
                    className={classes.nested}
                    component={Link}
                    to="/covidstate/add-covidstate"
                  >
                    <ListItemIcon>
                      <ArrowForwardIcon />
                    </ListItemIcon>
                    <ListItemText primary="Create" />
                  </ListItem>
                </List>
              </Collapse>
              <Divider></Divider>
              <ListItem button onClick={handleClickLevelMenuFAQ}>
                <ListItemIcon>
                  <LiveHelpIcon />
                </ListItemIcon>
                <ListItemText
                  primary="FAQ"
                  className={clsx({
                    [classes.hide]: !openDrawer,
                  })}
                />
                {openFAQMenu ? (
                  <ExpandLess className="exp-coll-icon" />
                ) : (
                  <ExpandMore className="exp-coll-icon" />
                )}
              </ListItem>
              <Collapse in={openFAQMenu} timeout="auto" unmountOnExit>
                <List
                  component="div"
                  disablePadding
                  className={clsx({
                    [classes.hide]: !openDrawer,
                  })}
                >
                  <ListItem
                    button
                    className={classes.nested}
                    component={Link}
                    to="/faq/allfaqs"
                  >
                    <ListItemIcon>
                      <ArrowForwardIcon />
                    </ListItemIcon>
                    <ListItemText primary="View" />
                  </ListItem>
                  <ListItem
                    button
                    className={classes.nested}
                    component={Link}
                    to="/faq/add-faq/0"
                  >
                    <ListItemIcon>
                      <ArrowForwardIcon />
                    </ListItemIcon>
                    <ListItemText primary="Create" />
                  </ListItem>
                  <ListItem
                    button
                    className={classes.nested}
                    component={Link}
                    to="/faq/assigned-faqs"
                  >
                    <ListItemIcon>
                      <ArrowForwardIcon />
                    </ListItemIcon>
                    <ListItemText primary="Assign" />
                  </ListItem>
                  <ListItem
                    button
                    className={classes.nested}
                    component={Link}
                    to="/faq/publish-faqs"
                  >
                    <ListItemIcon>
                      <ArrowForwardIcon />
                    </ListItemIcon>
                    <ListItemText primary="Drafts" />
                  </ListItem>
                </List>
              </Collapse>
              <Divider></Divider>
              <ListItem button onClick={handleClickSetting}>
                <ListItemIcon>
                  <SettingsIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Settings"
                  className={clsx({
                    [classes.hide]: !openDrawer,
                  })}
                />
                {openSetting ? (
                  <ExpandLess className="exp-coll-icon" />
                ) : (
                  <ExpandMore className="exp-coll-icon" />
                )}
              </ListItem>
              <Collapse in={openSetting} timeout="auto" unmountOnExit>
                <List
                  component="div"
                  disablePadding
                  className={clsx({
                    [classes.hide]: !openDrawer,
                  })}
                >
                  <ListItem
                    button
                    className={classes.nested}
                    component={Link}
                    to="/setting/global-setting"
                  >
                    <ListItemIcon>
                      <ArrowForwardIcon />
                    </ListItemIcon>
                    <ListItemText primary="Global Setting" />
                  </ListItem>

                  <ListItem
                    button
                    className={classes.nested}
                    component={Link}
                    to="/setting/temperature-range"
                  >
                    <ListItemIcon>
                      <ArrowForwardIcon />
                    </ListItemIcon>
                    <ListItemText primary="Temperature Range" />
                  </ListItem>
                </List>
              </Collapse>
              <Divider></Divider>
              <ListItem button onClick={handleClickUserManagment}>
                <ListItemIcon>
                  <GroupAddIcon />
                </ListItemIcon>
                <ListItemText
                  primary="User Groups"
                  className={clsx({
                    [classes.hide]: !openDrawer,
                  })}
                />
                {openUserManagment ? (
                  <ExpandLess className="exp-coll-icon" />
                ) : (
                  <ExpandMore className="exp-coll-icon" />
                )}
              </ListItem>
              <Collapse in={openUserManagment} timeout="auto" unmountOnExit>
                <List
                  component="div"
                  disablePadding
                  className={clsx({
                    [classes.hide]: !openDrawer,
                  })}
                >
                  <ListItem
                    button
                    className={classes.nested}
                    component={Link}
                    to="/usergroups/allusergroups"
                  >
                    <ListItemIcon>
                      <ArrowForwardIcon />
                    </ListItemIcon>
                    <ListItemText primary="View" />
                  </ListItem>
                  <ListItem
                    button
                    className={classes.nested}
                    component={Link}
                    to="/usergroups/add-usergroup/0"
                  >
                    <ListItemIcon>
                      <ArrowForwardIcon />
                    </ListItemIcon>
                    <ListItemText primary="Create" />
                  </ListItem>
                </List>
              </Collapse>
              <Divider></Divider>

              <ListItem button onClick={handleClickEmergencyContact}>
                <ListItemIcon>
                  <ContactPhoneIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Emergency Contacts"
                  className={clsx({
                    [classes.hide]: !openDrawer,
                  })}
                />
                {openEmergencyContact ? (
                  <ExpandLess className="exp-coll-icon" />
                ) : (
                  <ExpandMore className="exp-coll-icon" />
                )}
              </ListItem>
              <Collapse in={openEmergencyContact} timeout="auto" unmountOnExit>
                <List
                  component="div"
                  disablePadding
                  className={clsx({
                    [classes.hide]: !openDrawer,
                  })}
                >
                  <ListItem
                    button
                    className={classes.nested}
                    component={Link}
                    to="/emergencycontacts/view"
                  >
                    <ListItemIcon>
                      <ArrowForwardIcon />
                    </ListItemIcon>
                    <ListItemText primary="View" />
                  </ListItem>
                  <ListItem
                    button
                    className={classes.nested}
                    component={Link}
                    to="/emergencycontacts/create/0"
                  >
                    <ListItemIcon>
                      <ArrowForwardIcon />
                    </ListItemIcon>
                    <ListItemText primary="Create" />
                  </ListItem>
                  <ListItem
                    button
                    className={classes.nested}
                    component={Link}
                    to="/emergencycontacts/assign"
                  >
                    <ListItemIcon>
                      <ArrowForwardIcon />
                    </ListItemIcon>
                    <ListItemText primary="Assign" />
                  </ListItem>
                </List>
              </Collapse>
              <Divider></Divider>
              <ListItem button onClick={handleClickTeams}>
                <ListItemIcon>
                  <GroupWorkIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Teams"
                  className={clsx({
                    [classes.hide]: !openDrawer,
                  })}
                />
                {openTeamMenu ? (
                  <ExpandLess className="exp-coll-icon" />
                ) : (
                  <ExpandMore className="exp-coll-icon" />
                )}
              </ListItem>
              <Collapse in={openTeamMenu} timeout="auto" unmountOnExit>
                <List
                  component="div"
                  disablePadding
                  className={clsx({
                    [classes.hide]: !openDrawer,
                  })}
                >
                  <ListItem
                    button
                    className={classes.nested}
                    component={Link}
                    to="/teams/allteams"
                  >
                    <ListItemIcon>
                      <ArrowForwardIcon />{" "}
                    </ListItemIcon>
                    <ListItemText primary="View" />
                  </ListItem>

                  <ListItem
                    button
                    className={classes.nested}
                    component={Link}
                    to="/teams/add-teams/0"
                  >
                    <ListItemIcon>
                      <ArrowForwardIcon />
                    </ListItemIcon>
                    <ListItemText primary="CREATE" />
                  </ListItem>
                </List>
              </Collapse>
              <Divider></Divider>
              <ListItem button onClick={handleClickopenQuestionaire}>
                <ListItemIcon>
                  <ListAltIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Questionnaire"
                  className={clsx({
                    [classes.hide]: !openDrawer,
                  })}
                />
                {openQuestionaires ? (
                  <ExpandLess className="exp-coll-icon" />
                ) : (
                  <ExpandMore className="exp-coll-icon" />
                )}
              </ListItem>
              <Collapse in={openQuestionaires} timeout="auto" unmountOnExit>
                <List
                  component="div"
                  disablePadding
                  className={clsx({
                    [classes.hide]: !openDrawer,
                  })}
                >
                  <ListItem
                    button
                    className={classes.nested}
                    component={Link}
                    to="/questionaires/allquestionaires"
                  >
                    <ListItemIcon>
                      <ArrowForwardIcon />
                    </ListItemIcon>
                    <ListItemText primary="View" />
                  </ListItem>
                  <ListItem
                    button
                    className={classes.nested}
                    component={Link}
                    to="/questionaires/create-questionaire/0"
                  >
                    <ListItemIcon>
                      <ArrowForwardIcon />
                    </ListItemIcon>
                    <ListItemText primary="Create" />
                  </ListItem>
                  <ListItem
                    button
                    className={classes.nested}
                    component={Link}
                    to="/questionaires/adopt-questionaire"
                  >
                    <ListItemIcon>
                      <ArrowForwardIcon />
                    </ListItemIcon>
                    <ListItemText primary="Adopt from Existing" />
                  </ListItem>
                  <ListItem
                    button
                    className={classes.nested}
                    component={Link}
                    to="/questionaires/assign"
                  >
                    <ListItemIcon>
                      <ArrowForwardIcon />
                    </ListItemIcon>
                    <ListItemText primary="Assign" />
                  </ListItem>
                </List>
              </Collapse>
              <Divider></Divider>
              <ListItem
                button
                component={Link}
                to="/selfhealthcheck/configurehealth"
                onClick={collapseAllMenu}
              >
                <ListItemIcon>
                  <HealingIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Health check"
                  className={clsx({
                    [classes.hide]: !openDrawer,
                  })}
                />
              </ListItem>
              <Divider></Divider>

              <ListItem button onClick={handleClickopenWorkflow}>
                <ListItemIcon>
                  <WorkIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Workflow"
                  className={clsx({
                    [classes.hide]: !openDrawer,
                  })}
                />
                {openWorkflow ? (
                  <ExpandLess className="exp-coll-icon" />
                ) : (
                  <ExpandMore className="exp-coll-icon" />
                )}
              </ListItem>
              <Collapse in={openWorkflow} timeout="auto" unmountOnExit>
                <List
                  component="div"
                  disablePadding
                  className={clsx({
                    [classes.hide]: !openDrawer,
                  })}
                >
                  <ListItem
                    button
                    className={classes.nested}
                    component={Link}
                    to="/workflow/allWorkflow"
                  >
                    <ListItemIcon>
                      <ArrowForwardIcon />{" "}
                    </ListItemIcon>
                    <ListItemText primary="View" />
                  </ListItem>

                  <ListItem
                    button
                    className={classes.nested}
                    component={Link}
                    to="/workflow/create-workflow/0"
                  >
                    <ListItemIcon>
                      <ArrowForwardIcon />
                    </ListItemIcon>
                    <ListItemText primary="CREATE" />
                  </ListItem>
                </List>
              </Collapse>
              <Divider></Divider>

              <ListItem button onClick={handleClickopenReports}>
                <ListItemIcon>
                  <AssessmentIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Reports"
                  className={clsx({
                    [classes.hide]: !openDrawer,
                  })}
                />
                {openReports ? (
                  <ExpandLess className="exp-coll-icon" />
                ) : (
                  <ExpandMore className="exp-coll-icon" />
                )}
              </ListItem>
              <Collapse in={openReports} timeout="auto" unmountOnExit>
                <List
                  component="div"
                  disablePadding
                  className={clsx({
                    [classes.hide]: !openDrawer,
                  })}
                >
                  <ListItem
                    button
                    className={classes.nested}
                    component={Link}
                    to="/reports/locationdensity"
                  >
                    <ListItemIcon>
                      <ArrowForwardIcon />{" "}
                    </ListItemIcon>
                    <ListItemText primary="Location Density" />
                  </ListItem>

                  <ListItem
                    button
                    className={classes.nested}
                    component={Link}
                    to="/reports/densitythreshold"
                  >
                    <ListItemIcon>
                      <ArrowForwardIcon />
                    </ListItemIcon>
                    <ListItemText primary="Density Threshold Breaches" />
                  </ListItem>

                  <ListItem
                    button
                    className={classes.nested}
                    component={Link}
                    to="/reports/office-staff"
                  >
                    <ListItemIcon>
                      <ArrowForwardIcon />
                    </ListItemIcon>
                    <ListItemText primary="Number Of Staff In Office" />
                  </ListItem>

                  <ListItem
                    button
                    className={classes.nested}
                    component={Link}
                    to="/reports/social-distancing"
                  >
                    <ListItemIcon>
                      <ArrowForwardIcon />
                    </ListItemIcon>
                    <ListItemText primary="Social Distancing Breaches" />
                  </ListItem>

                  <ListItem
                    button
                    className={classes.nested}
                    component={Link}
                    to="/reports/access-breaches"
                  >
                    <ListItemIcon>
                      <ArrowForwardIcon />
                    </ListItemIcon>
                    <ListItemText primary="Access Breaches" />
                  </ListItem>

                  <ListItem
                    button
                    className={classes.nested}
                    component={Link}
                    to="/reports/contact-trace-history"
                  >
                    <ListItemIcon>
                      <ArrowForwardIcon />
                    </ListItemIcon>
                    <ListItemText primary="Contact Trace History" />
                  </ListItem>

                  <ListItem
                    button
                    className={classes.nested}
                    component={Link}
                    to="/reports/geo-fencing-breaches"
                  >
                    <ListItemIcon>
                      <ArrowForwardIcon />
                    </ListItemIcon>
                    <ListItemText primary="Geo Fencing Threshold Breaches" />
                  </ListItem>
                </List>
              </Collapse>
              <Divider></Divider>
            </List>
          </div>
        </Scrollbars>
      </Drawer>

      <main className={classes.content}>
        <Toolbar />
        <div className={classes.mainContent}>{children}</div>
      </main>
    </div>
  );
}

AdminLayout.propTypes = {
  loadGlobalSetting: PropTypes.func.isRequired,
  loadGridsPages: PropTypes.func.isRequired,
};

function mapStateToProps(state, ownProps) {
  return {
    loadGlobalSettingsData: state.loadGlobalSettingsData,
  };
}

const mapDispatchToProps = {
  loadGlobalSetting: globalSettingAction.loadGlobalSetting,
  loadGridsPages: GridAction.loadGridsPages,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(AdminLayout));
