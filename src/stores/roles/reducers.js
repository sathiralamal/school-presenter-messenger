import { ROLES_LOADING, ROLES_SET_DATA, ROLES_RESET } from "./constants";
const initialState = {
  loading: false,
  roles: [],
};
export function roleReducer(state = initialState, action) {
  console.log("reducers - action.type ", action.type);

  switch (action.type) {
    case ROLES_LOADING:
      return {
        ...state,
        loading: action.payload,
      };
    case ROLES_SET_DATA:
      console.log("reducers - ROLES_SET_DATA ", action);

      return {
        ...state,
        roles: action.payload,
      };
    case ROLES_RESET:
        console.log("reducers - ROLES_RESET")
        return {
          ...state,
          roles: [],
        };
    default:
      return state;
  }
}
