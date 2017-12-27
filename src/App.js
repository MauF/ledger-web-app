import React, {Component} from 'react';

import Main from './components/Main';

import {HashRouter as Router, Route} from 'react-router-dom';

const Test = () => <div>test!</div>;

class App extends Component {

    // constructor(props) {
    //     super(props);
    //     this.state = {
    //         currentEntry: {
    //             date: new Date(),
    //             receiptNum: 1,
    //             servicesAmount: 0,
    //             productsAmount: 0,
    //         }
    //     };
    // }
    //
    // updateEntry= (entry) => {
    //     console.log("updating ", entry);
    //     this.setState({currentEntry: entry});
    // };
    //
    // addEntry= (entry) => {
    //     console.log("adding", entry);
    // };
    //
    // cancel= () => {
    //     console.log("cancel");
    // };

    // render() {
    //     return <EntryForm entry={this.state.currentEntry} updateEntryFn={this.updateEntry} addEntryFn={this.addEntry} cancelFn={this.cancel}/>
    // }

    // render() {
    //     return <EntriesTable entries={[]} date={new Date()} dateFormat={'DD/MM/YYYY'}/>
    // }

    render() {
        return (
            <Router className="flex-container flex full-height full-width overflow-auto">
                <div className="flex-container flex full-height full-width overflow-auto justify-content-center align-items-center">
                    <Route exact path="/" component={Main}/>
                    <Route exact path="/test" component={Test}/>
                </div>
            </Router>
        );
    }
}

export default App;
