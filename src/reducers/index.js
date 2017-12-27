import { combineReducers } from 'redux';

const entriesState = function (state = {}, action) {
    switch (action.type) {
        case 'SET_ENTRIES':
            return {...state, entries: action.entries};
        case 'SET_MODAL_VISIBILITY':
            return {...state, showModal: action.showModal};
        case 'SELECT_RECEIPTS_DATE':
            return {...state, selectedDate: action.selectedDate};
        case 'SET_CURRENT_ENTRY':
            return {...state, currentEntry: action.currentEntry};

        // case 'FETCH_IS_LOADING':
        //     return {...state, isLoading: action.isLoading};
        // case 'SET_PROCESSES_FILTER':
        //     return {...state, processesFilter: action.processesFilter};
        // case 'SET_DEFINITIONS_FILTER':
        //     return {...state, definitionsFilter: action.definitionsFilter};
        // case 'SET_INSTANCES_FILTER':
        //     return {...state, instancesFilter: action.instancesFilter};
        // case 'SET_CURRENT_SEARCH_TAB':
        //     return {...state, currentSearchTab: action.currentSearchTab};
        // case 'SHOW_NOTIFICATION':
        //     let showNotification = {...action.notification};
        //     if(typeof(action.notification) === "boolean"){
        //         showNotification = action.notification;
        //     }
        //     return {...state, showNotification};
        // case 'SHOW_MODAL':
        //     let showModal = {...action.modal};
        //     if(typeof(action.modal) === "boolean"){
        //         showModal = action.modal;
        //     }
        //     return {...state, showModal};
        // case 'SHOW_ALERT':
        //     let showAlert = {...action.alert};
        //     if(typeof(action.alert) === "boolean"){
        //         showAlert = action.alert;
        //     }
        //     return {...state, showAlert};
        default:
            return state;
    }
};

export default combineReducers({
    entriesState
});
