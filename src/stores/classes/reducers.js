import { CLASSES_LOADING, CLASSES_SET_DATA } from "./constants";
const initialState = {
  loading: false,
  classes: [],
};
export function classReducer(state = initialState, action) {
  switch (action.type) {
    case CLASSES_LOADING:
      return {
        ...state,
        loading: action.payload,
      };
    case CLASSES_SET_DATA:
      return {
        ...state,
        classes: action.payload,
      };
    default:
      return state;
  }
}
