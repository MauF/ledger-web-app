import React, {Component} from 'react';
import {connect} from 'react-redux';
import moment from 'moment';
import DatePicker from 'antd/lib/date-picker';

class EntryForm extends React.Component {

    constructor(props) {
        super(props);
        this.date = {};
        this.entryData = {};
    }

    handleChange(field, v) {
        const value = v || this.entryData[field].value;
        const entry = {...this.props.entry};
        entry[field] = value === "" ? value : Number(value);
        this.props.setCurrentEntry(entry);
    }

    save(entry) {
        let {date, id} = entry;
        date = (date instanceof moment) ? moment(date).format('DD/MM/YYYY') : date;
        let ledgerEntry = this.props.entries[date];
        if (!ledgerEntry) {
            ledgerEntry = {date, receipts: []}
        }
        let isPresent = false;
        let f = ledgerEntry.receipts.map(receipt => {
            if (receipt.id === id) {
                isPresent = true;
                return entry;
            }
            return receipt;
        });
        if (!isPresent) {
            f = [...f, entry];
        }
        ledgerEntry.receipts = f;
        this.props.entries[date] = ledgerEntry;
        this.props.setEntries(this.props.entries);
        this.cancel();
    };

    cancel() {
        this.props.setModalVisibility(false);
        this.props.setCurrentEntry(undefined);
    };

    render() {
        const entry = this.props.entry;
        const date = this.props.selectedDate;
        const parsedDate = (date instanceof moment) ? moment(date).format('DD/MM/YYYY') : date;

        if (!entry) {
            return "";
        }

        return (
            <div className="w3-container w3-card-4">
                <h2 className="w3-text-blue">{`Receipt ${entry.id} of the ${parsedDate}`}</h2>
                <div>
                    <label className="w3-text-blue"><b>Date</b></label>
                    <DatePicker className="w3-input" value={moment(date, 'DD/MM/YYYY')} format={'DD/MM/YYYY'}
                                ref={(input) => this.date = input}
                                onChange={(date, dateString) => this.props.selectReceiptsDate(dateString)}/>
                </div>
                <p>
                    <label className="w3-text-blue"><b>Receipt#</b></label>
                    <input type="number" className="w3-input w3-border" value={entry.id}
                           ref={(input) => this.entryData.id = input}
                           onChange={(event) => this.handleChange("id")}/>
                </p>
                <p>
                    <label className="w3-text-blue"><b>Services</b></label>
                    <input type="number" className="w3-input w3-border" value={entry.servicesAmount}
                           ref={(input) => this.entryData.servicesAmount = input}
                           onChange={(event) => this.handleChange("servicesAmount")}/>
                </p>
                <p>
                    <label className="w3-text-blue"><b>Products</b></label>
                    <input type="number" className="w3-input w3-border" value={entry.productsAmount}
                           ref={(input) => this.entryData.productsAmount = input}
                           onChange={(event) => this.handleChange("productsAmount")}/>
                </p>
                <div style={{display: "flex", justifyContent: "flex-end"}} className="w3-margin-bottom">
                    <button className="w3-btn w3-blue w3-margin-right"
                            disabled={entry.id === 0} onClick={() => this.save({...entry, date})}>OK
                    </button>
                    <button className="w3-btn w3-red" onClick={() => this.cancel()}>CANCEL</button>
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
        entry: state.entriesState.currentEntry,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        setEntries: (entries) => dispatch({type: "SET_ENTRIES", entries}),
        setModalVisibility: (showModal) => dispatch({type: "SET_MODAL_VISIBILITY", showModal}),
        setCurrentEntry: (currentEntry) => dispatch({type: "SET_CURRENT_ENTRY", currentEntry}),
        selectReceiptsDate: (selectedDate) => dispatch({type: "SELECT_RECEIPTS_DATE", selectedDate}),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(EntryForm);