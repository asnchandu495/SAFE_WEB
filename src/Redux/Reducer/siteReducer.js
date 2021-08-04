import { CardActions } from "@material-ui/core";
import {
  LOAD_LIST_SITE_SUCCESS,
  CREATE_SITE_SUCCESS,
  UPDATE_SITE_SUCCESS,
  DELETE_SITE_SUCCESS,
  DELETE_SITE_FLOOR_SUCCESS,
  UPDATE_SITE_FLOOR_SUCCESS,
  LOAD__SITE_SECURITY_SUCCESS,
} from "../utilits";
var intialState = [];
export default function loadSiteReducer(state = intialState, action) {
  switch (action.type) {
    case LOAD_LIST_SITE_SUCCESS:
      if (intialState.length == 0) {
        return (intialState = action.loadUserSite);
      } else {
        return state;
      }
    case LOAD__SITE_SECURITY_SUCCESS:
      if (intialState.length == 0 || intialState) {
        return (intialState = action.loadUserSiteSecurity);
      } else {
        return state;
      }

    case CREATE_SITE_SUCCESS:
      return [{ ...action.userSite }, ...state];

    case DELETE_SITE_SUCCESS:
      return state.filter((user) => user.id !== action.userSite);

    case UPDATE_SITE_SUCCESS:
      return state.map((userSite) =>
        userSite.id === action.userSite.id ? action.userSite : userSite
      );

    case UPDATE_SITE_FLOOR_SUCCESS:
      return state.map((userSite) => {
        if (userSite.id === action.userSite.siteId) {
          return {
            ...userSite,
            floors: [...userSite.floors, { ...action.userSite }],
          };
        }
      });

    case DELETE_SITE_FLOOR_SUCCESS:
      return state.map((userSite) => {
        if (userSite.id === action.userSite.siteId) {
          return {
            ...userSite,
            floors: [
              ...userSite.floors.filter(
                (item) => item.id == action.userSite.id
              ),
            ],
          };
        }
      });
    default:
      return state;
  }
}
