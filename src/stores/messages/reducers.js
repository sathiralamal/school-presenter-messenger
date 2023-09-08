import { MESSAGES_LOADING, CONVERSATION_SET_DATA, MESSAGES_ADD_DATA, MESSAGES_MERGE_DATA, MESSAGES_SET_TOKEN, MESSAGES_SET_DATA, MESSAGES_RESET } from "./constants";
const initialState = {
  loading: false,
  messages: [],
  tokens:{
    nextTokenConversationCreatedByGroup: null,
    nextTokenConversationCreatedByMe: null,
    nextTokenConversationCreatedByOther: null,
    nextTokenConversationCreatedByGroupAdmin : null
  }
};
export function messageReducer(state = initialState, action) {
  switch (action.type) {
    case MESSAGES_LOADING:
      return {
        ...state,
        loading: action.payload,
      };
    case CONVERSATION_SET_DATA:
      return {
        ...state,
        messages: action.payload
      };
    case MESSAGES_SET_DATA:
        console.log("messageReducer MESSAGES_SET_DATA action ", action, " action.payload ", action.payload);
        console.log("messageReducer MESSAGES_SET_DATA state ", state);
        const foundItem = state.messages.find(item => item?.id === action.payload[0]?.id);
        let newArray = state.messages;

        if(foundItem){
          
          newArray = state.messages.map(item => item?.id === action.payload[0]?.id ? action.payload[0] : item);
          const index = newArray.findIndex(item => item => item?.id === action.payload[0]?.id);
          // Shift the payload Item to the first in the last
          
        }
        
        
        
        return {
          ...state,
          messages: newArray
      };
    case MESSAGES_ADD_DATA:
      return {
        ...state,
        messages: [...state.messages, ...action.payload]
      };
    case MESSAGES_RESET:
        return {
          ...state,
          messages: [],
          tokens: {
          }
        };
    case MESSAGES_MERGE_DATA:{
      console.log("messageReducer MESSAGES_MERGE_DATA state.messages ", state.messages , " action.payload ", action.payload);

      return { 
        ...state,
          messages: [...state.messages, ...action.payload]
      };
    }
    case MESSAGES_SET_TOKEN:
      return {
        ...state,
        tokens: {
          nextToken:action.payload.nextToken,
            total:action.payload.total,
            pageNumber:action.payload.pageNumber,
            totalNumberOfPages:action.payload.totalNumberOfPages
        }
      };
    default:
      return state;
  }
}
