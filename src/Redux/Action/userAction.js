import {
  LOADUSER_SUCCESS,
  CREATEUSER_SUCCESS,
  DELETEUSER_SUCCESS,
  UPDATEEUSER_SUCCESS,
} from "../utilits";
import UserService from "../../services/usersService";
//Actions are javscript objects that maintain 2 properties type and payload.These actions are "dispatched" by redux store store dispatch api method
//constructor
const usersApiCall = new UserService();
//To change the state invokes action creators return an action object  known as action from mapDispatchToProps help you to fire an action

export function LoadUserSuccess(loadUser) {
  return { type: LOADUSER_SUCCESS, loadUser };
}

export function CreateUserSuccess(user) {
  return { type: CREATEUSER_SUCCESS, user };
}

export function UpdateUserSuccess(user) {
  return { type: UPDATEEUSER_SUCCESS, user };
}

export function DeleteUserSuccess(user) {
  return { type: DELETEUSER_SUCCESS, user };
}

// export function loadUser() {
//   return function (dispatch) {
//     return usersApiCall
//       .ListApplicationUsers()
//       .then((response) => {
//         dispatch(LoadUserSuccess(response));
//       })
//       .catch((error) => {
//         throw error;
//       });
//   };
// }

export function loadUser(data) {
  return function (dispatch) {
    return usersApiCall
      .ListFliteredData(data)
      .then((response) => {
        dispatch(LoadUserSuccess(response));
      })
      .catch((error) => {
        throw error;
      });
  };
}

export function deleteUser(data) {
  return function (dispatch) {
    return usersApiCall
      .DeleteApplicationUser(data)
      .then((response) => {
        dispatch(DeleteUserSuccess(data));
      })
      .catch((error) => {
        throw error;
      });
  };
}

export function deletemultipleUsers(data) {
  return function (dispatch) {
    return usersApiCall
      .DeleteApplicationMultipleUsers(data)
      .then((response) => {
        dispatch(DeleteUserSuccess(data));
      })
      .catch((error) => {
        throw error;
      });
  };
}

export function CreateUser(data) {
  return function (dispatch) {
    return usersApiCall
      .AddApplicationUser(data)
      .then((response) => {
        data.id = response.id;
        dispatch(CreateUserSuccess(data));
      })
      .catch((error) => {
        throw error;
      });
  };
}

export function UpdateUser(data) {
  return function (dispatch) {
    return usersApiCall
      .UpdateApplicationUser(data)
      .then((response) => {
        console.log(data);
        dispatch(UpdateUserSuccess(data));
      })
      .catch((error) => {
        throw error;
      });
  };
}
