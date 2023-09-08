import { GROUPS_LOADING, GROUPS_SET_DATA,GROUPS_RESET, GROUPS_REMOVE_DATA, GROUPS_ADD_DATA } from "./constants";
const initialState = {
  loading: false,
  groups: [],
};
export function groupReducer(state = initialState, action) {
  switch (action.type) {
    case GROUPS_LOADING:
      return {
        ...state,
        loading: action.payload,
      };
    case GROUPS_RESET: 
      return {
        ...state,
        groups: []
     }
    case GROUPS_SET_DATA:
      if(state?.groups?.items?.length > 0){
        action.payload.items = removeDuplicateGroups(action.payload.items ,state?.groups?.items);
      }
      return {
        ...state,
        groups: action.payload,
      };
    case GROUPS_REMOVE_DATA:{
      return {
        ...state,
        groups: state.groups?.items?.filter(group => !action.payload.includes(group.id)),
      };
    }
    case GROUPS_ADD_DATA:
      let groupsTemp = [];
      console.log("GROUPS_ADD_DATA state.groups ", state.groups);
      if(state.groups?.items){
        groupsTemp.push(...state.groups.items);
      } else if(Array.isArray(state.groups)){
        groupsTemp.push(...state.groups);
      }
      groupsTemp.push(action.payload);

      return {
        ...state,
        groups: groupsTemp,
      };
    default:
      return state;
  }
}

const removeDuplicateGroups = (newGroups, currentGroups )=>{
  console.log("removeDuplicateGroups newGroups ",newGroups, " currentGroups ", currentGroups );
  let newArray  = currentGroups;
  for(let i=0; i < newGroups.length;i++ ){
      if(currentGroups.findIndex(item => item?.id === newGroups[i]?.id) < 0){
          newArray.push(newGroups[i])
      }else{

      }
  }
  console.log("removeDuplicateGroups newArray ",newArray );

  return newArray;
}