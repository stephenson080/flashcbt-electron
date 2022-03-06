import {USER_ACTIONS} from '../actions/user-actions';
import {UserActionObject} from '../types';

export interface UserState {
  transactions: any[];
}

const intialState: UserState = {
  transactions: [],
};

export default function userReducer(
  state = intialState,
  action: UserActionObject
) {
  switch (action.type) {
    case USER_ACTIONS.SET_TRANSACTIONS:
      return {
        ...state,
        transactions: action.payload.transactions,
      };

    default:
      return state;
  }
}
