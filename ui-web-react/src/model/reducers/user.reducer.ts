import { User, UserInfo, INITIAL_USER } from "../types/datatypes";
import Optional from "optional-js";
import { AnyAction } from "redux";
import {
  USER_LOGIN,
  USER_LOGOUT,
  USER_REGISTRATION,
  USER_AUTHORIZED_FAIL,
  USER_AUTHORIZED_OK,
  UserInfoAuthorizedAction,
} from "../actions/user.actions";
import { ReducerTransformerFn } from "./reducers";

const userTransformers: Map<any, ReducerTransformerFn<User>> = new Map<
  any,
  ReducerTransformerFn<User>
>()
  .set(USER_LOGIN, transformUserLogin)
  .set(USER_REGISTRATION, transformUserLogin)
  .set(USER_LOGOUT, transformUserLogout)
  .set(USER_AUTHORIZED_FAIL, transformUserLogout)
  .set(USER_AUTHORIZED_OK, transformUserAuthOk);

function transformUserLogin(state: User, action: AnyAction) {
  return {
    isFetching: true,
    info: Optional.empty<UserInfo>(),
  };
}

function transformUserLogout(state: User, action: AnyAction) {
  return {
    isFetching: false,
    info: Optional.empty<UserInfo>(),
  };
}

function transformUserAuthOk(state: User, action: AnyAction) {
  return {
    isFetching: false,
    info: (action as UserInfoAuthorizedAction).userInfo,
  };
}

export function userReducer(state: User = INITIAL_USER, action: AnyAction) {
  const transformer = userTransformers.get(action.type);
  return !!transformer ? transformer(state, action) : state;
}
