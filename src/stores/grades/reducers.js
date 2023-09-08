import { GRADES_LOADING, GRADES_SET_DATA } from "./constants";
const initialState = {
  loading: false,
  grades: [],
};
export function gradeReducer(state = initialState, action) {
  switch (action.type) {
    case GRADES_LOADING:
      return {
        ...state,
        loading: action.payload,
      };
    case GRADES_SET_DATA:
      return {
        ...state,
        grades: action.payload,
      };
    default:
      return state;
  }
}
