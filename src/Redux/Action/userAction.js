import {
  LOADUSER_SUCCESS,
  CREATEUSER_SUCCESS,
  DELETEUSER_SUCCESS,
  UPDATEEUSER_SUCCESS,
} from "../utilits";
import UserService from "../../services/usersService";

const usersApiCall = new UserService();

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
        dispatch(UpdateUserSuccess(data));
      })
      .catch((error) => {
        throw error;
      });
  };
}
