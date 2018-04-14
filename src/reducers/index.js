import { combineReducers } from 'redux';

const sortEntriesByDate = (entries) => {
    var sorted = {},
        key, a = [];

    for (key in entries) {
        if (entries.hasOwnProperty(key)) {
            a.push(key);
        }
    }

    a.sort((date1,date2) => {
        // Turn your strings into dates, and then subtract them
        // to get a value that is either negative, positive, or zero.
        return new Date(date2.date) - new Date(date1.date);
    });

    for (key = 0; key < a.length; key++) {
        sorted[a[key]] = entries[a[key]];
    }
    return sorted;
};

const entriesState = function (state = {}, action) {
    switch (action.type) {
        case 'SET_ENTRIES':

            const entries = action.entries;

            return {...state, entries};
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
