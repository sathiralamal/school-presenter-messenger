import { CONTACTS_LOADING, CONTACTS_LOADING_INVITATION, CONTACTS_SET_CONTACTS,CONTACTS_SET_NEW_CONTACTS, CONTACTS_SET_SEARCH_TEXT, CONTACTS_SET_INVITATIONS, CONTACTS_SET_SELECTED_CONTACTS, CONTACTS_EDIT_CONTACT, CONTACTS_REMOVE_CONTACTS, CONTACTS_RESET_CONTACTS,INVITATIONS_RESET_CONTACTS, CONTACTS_SET_FILTER, CONTACTS_SET_ACCESS_REQUESTS } from "./constants";
const initialState = {
  loading: false,
  loadingInvitation: false,
  contacts: [],
  accessRequests :[],
  contactsNextToken: null,
  invitationNextToken: null,
  accessRequestsNextToken: null,
  searchText: "",
  invitations: [],
  selectedContacts: [],
  filter: null
};
export function contactReducer(state = initialState, action) {
  switch (action.type) {
    case CONTACTS_LOADING:
      return {
        ...state,
        loading: action.payload,
      };
    case CONTACTS_LOADING_INVITATION:
      return {
        ...state,
        loadingInvitation: action.payload,
      };
    case CONTACTS_SET_CONTACTS:{
      console.log("contactReducer action ", action);
      let newContacts = [...state.contacts, ...action.payload.items];
      newContacts = newContacts.filter((v, i, a) => a.findIndex(t => (t.id === v.id)) === i) //check for duplicates
      return {
        ...state,
        contacts: [...newContacts],
        contactsNextToken: action.payload.nextToken
      };}
      case CONTACTS_SET_NEW_CONTACTS:{
        console.log("CONTACTS_SET_NEW_CONTACTS ", action);
        let contacts = []
        if(action?.payload?.items){
          contacts = [...state.contacts, ...action.payload.items];
        } else if(action?.payload?.id){
          contacts = [action.payload,...state.contacts];
        }

        contacts = contacts.filter((v, i, a) => a.findIndex(t => (t.id === v.id)) === i) //check for duplicates
        return {
          ...state,
          contacts: [...contacts],
          contactsNextToken: action.payload.nextToken
        };
      }
    case CONTACTS_SET_SEARCH_TEXT:
      return {
        ...state,
        searchText: action.payload,
      };
    case CONTACTS_SET_ACCESS_REQUESTS:{
      let newAccessRequests = [...action.payload.items];
      newAccessRequests = newAccessRequests.filter((v, i, a) => a.findIndex(t => (t.id === v.id)) === i) //check for duplicates
      let retNewAccessRequests =  {
        ...state,
        accessRequests:newAccessRequests ,
        accessRequestsNextToken: action.payload.nextToken,
        accessRequestsTotalNumberOfPages : action.payload.accessRequestsTotalNumberOfPages
      };
      console.log("CONTACTS_SET_ACCESS_REQUESTS retNewAccessRequests", retNewAccessRequests );
      return retNewAccessRequests;
    }
    case CONTACTS_SET_INVITATIONS:{
      let newInvitations = [...state.invitations, ...action.payload.items];
      newInvitations = newInvitations.filter((v, i, a) => a.findIndex(t => (t.id === v.id)) === i) //check for duplicates
      let retInv =  {
        ...state,
        invitations:newInvitations ,
        invitationNextToken: action.payload.nextToken,
        invitationTotalNumberOfPages : action.payload.invitationTotalNumberOfPages
      };
      return retInv;
    }
    case CONTACTS_SET_SELECTED_CONTACTS:
      return {
        ...state,
        selectedContacts: action.payload,
      };
    case CONTACTS_EDIT_CONTACT:
      let index = state.contacts.findIndex(contact => contact.id === action.payload.id);
      if (index > -1) {
        state.contacts[index] = action.payload
      }
      return {
        ...state,
        contacts: [...state.contacts]
      }
    case CONTACTS_REMOVE_CONTACTS:
      let filteredContacts = state.contacts.filter(contact => !action.payload.includes(contact.id))
      return {
        ...state,
        contacts: [...filteredContacts]
      }
    case CONTACTS_RESET_CONTACTS: 
      return {
        ...state,
        contacts: []
      }
    case INVITATIONS_RESET_CONTACTS: 
      return {
        ...state,
        invitations : []
      }
    case CONTACTS_SET_FILTER:
      return {
        ...state,
        filter: action.payload
      }
    default:
      return state;
  }
}
