import React, {Component} from "react";
import {connect} from 'react-redux';
import moment from 'moment';
import EntryForm from './EntryForm';

const ReceiptsTable = ({entry, add, modify, remove, close}) => {
    let date = entry.date;

    const _add = () => {
        let id = 0;
        if(entry.receipts && entry.receipts.length > 0) {
            const ids = entry.receipts.map(receipt => receipt.id);
            const max = Math.max(...ids);
            id = max + 1;
        }
        add({id, date, servicesAmount: 0, productsAmount: 0})
    };

    return (
        <div className="flex-container-column full-width justify-content-center align-items-center">
            <table className="w3-table" style={{width: "60%"}}>
                <tbody>
                <tr>
                    <th>receipt num</th>
                    <th>Services</th>
                    <th>Products</th>
                    <th>Total</th>
                    <th></th>
                </tr>
                </tbody>
                <tbody>
                {entry.receipts.map((receipt, index) => {
                    return (
                        <tr key={index}>
                            <td>{receipt.id}</td>
                            <td>{receipt.servicesAmount}</td>
                            <td>{receipt.productsAmount}</td>
                            <td>{receipt.productsAmount + receipt.servicesAmount}</td>
                            <td>
                                <button className="w3-button w3-tiny w3-amber w3-margin-right"
                                        onClick={() => modify(entry, receipt)}>modify
                                </button>
                                <button className="w3-button w3-tiny w3-red"
                                        onClick={() => remove(entry, receipt.id)}>remove
                                </button>
                            </td>
                        </tr>
                    )
                })}
                </tbody>
            </table>
            <div style={{display: "flex", justifyContent: "center"}} className="w3-margin-top">
                <button className="w3-btn w3-tiny w3-blue w3-margin-right"
                        onClick={_add}>ADD
                </button>
                <button className="w3-btn w3-tiny w3-amber w3-margin-right" onClick={() => close()}>CLOSE</button>
            </div>
        </div>
    );
};

class Main extends React.Component {

    // componentDidMount() {
    //     this.props.setEntries({
    //         "02/11/2017": {
    //             date: "02/11/2017",
    //             receipts: [
    //                 {
    //                     id: 1,
    //                     servicesAmount: 10,
    //                     productsAmount: 10,
    //                 },
    //                 {
    //                     id: 2,
    //                     servicesAmount: 5,
    //                     productsAmount: 4,
    //                 }
    //             ]
    //         },
    //         "03/11/2017": {
    //             date: "03/11/2017",
    //             receipts: [
    //                 {
    //                     id: 3,
    //                     servicesAmount: 20,
    //                     productsAmount: 30,
    //                 },
    //                 {
    //                     id: 4,
    //                     servicesAmount: 8,
    //                     productsAmount: 9,
    //                 }
    //             ]
    //         }
    //     });
    // }

    addEntry(entry) {
        this.props.setModalVisibility(true);
        this.props.setCurrentEntry(entry);
        this.props.selectReceiptsDate(entry.date);
    }

    modifyEntry(entry, receipt) {
        this.props.setModalVisibility(true);
        this.props.setCurrentEntry(receipt);
        this.props.selectReceiptsDate(entry.date);
    }

    details(date) {
        this.props.selectReceiptsDate(date);
    }

    remove(date) {
        const e = {...this.props.entries};
        delete e[date];
        this.props.setEntries(e);
    };

    removeEntry(entry, id) {
        const date = entry.date;
        let ledgerEntry = {...this.props.entries[date]};
        let f = ledgerEntry.receipts.filter(receipt => receipt.id !== id);
        ledgerEntry.receipts = f;
        this.props.entries[date] = ledgerEntry;
        this.props.setEntries({...this.props.entries});
    }

    add() {
        let proposedDate = new Date();
        let proposedId = 0
        if(Object.keys(this.props.entries).length > 0) {
            const entries = Object.keys(this.props.entries).sort((date2,date1) => {
                // Turn your strings into dates, and then subtract them
                // to get a value that is either negative, positive, or zero.
                return moment(date2.date, 'DD/MM/YYYY').toDate() - moment(date1.date, 'DD/MM/YYYY').toDate();
            });
            proposedDate = entries[entries.length -1];
            const lastEntry = this.props.entries[proposedDate];
            const ids = lastEntry.receipts.map(receipt => receipt.id);
            const max = Math.max(...ids);
            proposedId = max + 1;
            proposedDate = moment(proposedDate, 'DD/MM/YYYY').add(1, 'days').toDate();
        }
        const date = moment(proposedDate, 'DD/MM/YYYY');
        this.props.setModalVisibility(true);
        this.props.setCurrentEntry({id: proposedId, date, servicesAmount: 0, productsAmount: 0});
        this.props.selectReceiptsDate(date);
    }

    load = () => {
        var element = document.createElement('input');
        element.setAttribute("type", "file");
        element.setAttribute("accept", ".json");
        element.click();
        element.style.display = 'none';
        document.body.appendChild(element);
        document.body.removeChild(element);
        element.onchange = (e) => {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = (e) => {
                const entries = JSON.parse(e.target.result);
                this.props.setEntries(entries);
            };
            reader.readAsText(file);
        };
    };

    download = (filename, text) => {
        var element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        element.setAttribute('download', filename);

        element.style.display = 'none';
        document.body.appendChild(element);

        element.click();

        document.body.removeChild(element);
    };

    render() {
        const {entries, selectedDate, showModal} = this.props;

        let parsedEntries = entries === {} ? [] : Object.values(entries).map(entry => {
            // array.reduce(function(total, currentValue, currentIndex, arr), initialValue)
            const totServices = entry.receipts.reduce((tot, receipt) => {
                return tot + receipt.servicesAmount;
            }, 0);

            const totProducts = entry.receipts.reduce((tot, receipt) => {
                return tot + receipt.productsAmount;
            }, 0);

            const receipts = entry.receipts.sort(function(a, b) {
                return a.id - b.id;
            });

            const receiptFromTo = receipts.length ===0 ? "-" : `${receipts[0].id} ... ${receipts[entry.receipts.length - 1].id}`;

            return {...entry, totServices, totProducts, receiptFromTo}
        });


        parsedEntries = parsedEntries.sort((date2,date1) => {
            // Turn your strings into dates, and then subtract them
            // to get a value that is either negative, positive, or zero.
            return moment(date2.date, 'DD/MM/YYYY').toDate() - moment(date1.date, 'DD/MM/YYYY').toDate();
        });

        return (
            <div className="flex-container-column full-height full-width">
                <div style={{display: showModal ? 'block' : 'none'}} className="w3-modal">
                    <div className="w3-modal-content">
                        <EntryForm/>
                    </div>
                </div>
                <div style={{display: "flex", justifyContent: "center"}}>
                    <h2 style={{display: "flex", flex: 1, justifyContent: "flexStart"}}>Ledger</h2>
                    <div style={{display: "flex", justifyContent: "flex-end"}} className="w3-margin-top">
                        <button className="w3-btn w3-amber w3-round-large w3-margin-right" onClick={this.load}>LOAD</button>
                        <button className="w3-btn w3-blue w3-round-large w3-margin-right"
                                onClick={() => this.download("ledger.json", JSON.stringify(this.props.entries, null, 2))}>
                            DOWNLOAD
                        </button>
                    </div>
                </div>
                {parsedEntries.length == 0 ? <div style={{display: "flex", justifyContent: "center"}}>no data present...</div> : <table className="w3-table w3-centered w3-bordered">
                    <tbody>
                    <tr>
                        <th>Date</th>
                        <th>receipts from ... to</th>
                        <th>Total</th>
                        <th>Services</th>
                        <th>Products</th>
                        <th></th>
                    </tr>
                    </tbody>
                    <tbody>
                    {parsedEntries.map((entry, index) => {
                        if (entry.date === selectedDate) {
                            return (
                                <tr key={index}>
                                    <td>{entry.date}</td>
                                    <td colSpan={5}>
                                        <ReceiptsTable entry={entry}
                                                       add={(entry) => {
                                                           this.addEntry(entry);
                                                       }}
                                                       modify={(entry, receipt) => {
                                                           this.modifyEntry(entry, receipt);
                                                       }}
                                                       remove={(entry, id) => {
                                                           this.removeEntry(entry, id);
                                                       }}
                                                       close={() => {
                                                           this.props.selectReceiptsDate(undefined);
                                                       }}
                                        />
                                    </td>
                                </tr>
                            )
                        }
                        return (
                            <tr key={index}>
                                <td>{entry.date}</td>
                                <td>{entry.receiptFromTo}</td>
                                <td>{entry.totServices + entry.totProducts}</td>
                                <td>{entry.totServices}</td>
                                <td>{entry.totProducts}</td>
                                <td>
                                    <button className="w3-button w3-tiny w3-blue w3-margin-right"
                                            onClick={() => {
                                                let id = 0;
                                                if(entry.receipts && entry.receipts.length > 0) {
                                                    const ids = entry.receipts.map(receipt => receipt.id);
                                                    const max = Math.max(...ids);
                                                    id = max + 1;
                                                }
                                                this.addEntry({
                                                    id,
                                                    date: entry.date,
                                                    servicesAmount: 0,
                                                    productsAmount: 0
                                                })}}>add
                                    </button>
                                    <button className="w3-button w3-tiny w3-amber w3-margin-right"
                                            onClick={() => this.details(entry.date)}>details
                                    </button>
                                    <button className="w3-button w3-tiny w3-red"
                                            onClick={() => this.remove(entry.date)}>remove
                                    </button>
                                </td>
                            </tr>
                        )
                    })}
                    </tbody>
                </table>}
                <div style={{display: "flex", justifyContent: "center"}} className="w3-margin-top">
                    <button className="w3-btn w3-blue w3-margin-right" onClick={() => this.add()}>ADD</button>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        entries: state.entriesState.entries,
        showModal: state.entriesState.showModal,
        selectedDate: state.entriesState.selectedDate,
        currentEntry: state.entriesState.currentEntry,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        setEntries: (entries) => dispatch({type: "SET_ENTRIES", entries}),
        setModalVisibility: (showModal) => dispatch({type: "SET_MODAL_VISIBILITY", showModal}),
        selectReceiptsDate: (selectedDate) => dispatch({type: "SELECT_RECEIPTS_DATE", selectedDate}),
        setCurrentEntry: (currentEntry) => dispatch({type: "SET_CURRENT_ENTRY", currentEntry}),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Main);
