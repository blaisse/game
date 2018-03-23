import React, { Component } from 'react';
import { connect } from 'react-redux';
// import { CSSTransition } from 'react-transition-group';
import * as actions from './../actions/user';
import Report from './Report';
import utils from './../utils';

class Reports extends Component {
    constructor(props){
        super(props);
        this.state = { display: false, report: {}, sort: 'default', sorted: [] };
        this.closeModal = this.closeModal.bind(this);
        // this.handleClick = this.handleClick.bind();
    }
    componentWillMount(){
        this.props.fetch_reports();
        this.props.set_newreport();
    }
    renderModal(){//<Report report={this.state.report} />
        if(this.state.display){
            return (
                // <div className="reports__modal">MODAL?</div>
                <Report report={this.state.report} closeModal={this.closeModal} />
            );
        }
    }
    closeModal(){
        console.log('closing modal');
        this.setState({ display: false, report: {} });
    }
    handleClick(report){
        this.setState({ display: true, report });
        if(!report.read){
            console.log('work>?', report);
            this.props.set_read_reports(report.id).then(() => {
                if(this.state.sort !== "default"){
                    console.log('wtf?', this.state.sort);
                    this.handleSort(this.state.sort);
                }
                
            });
        }
    }
    handleSort(type){
        if(type === 'user'){//&& this.state.sort !== 'user'
            let toBeSorted = this.props.reports.slice().sort((a, b) => {
                return a.user > b.user;
            });
            this.setState({ sort: type, sorted: toBeSorted });
        } else if(type === 'default'){//&& this.state.sort !== 'default'
            this.setState({ sort: type, sorted: [] });
        } else if(type === 'outcome'){// && this.state.sort !== 'outcome'
            let toBeSorted = this.props.reports.slice().sort((a, b) => {
                if(a.outcome === "Victory"){
                    return -1;
                }
                if(a.outcome === "Defeat"){
                    return 1;
                }
                return 0;
            });
            this.setState({ sort: type, sorted: toBeSorted });
        }
       
    }
    renderUnread(report){
        if(!report.read){
            return <span className="reports__list__item__unread">Unread</span>;
        }
    }
    renderBy(report){
        //(report.type!=='pillage' || report.type !== 'failure' ? " by" : "")
        if(report.type === 'pillage'){
            return "";
        }
        if(report.type === 'failure'){
            return "";
        }
        return "";
    }
    renderReportsList(){
        if(this.props.reports.length !== 0 && this.state.sorted.length === 0){
            // console.log('why not here?', this.props.reports);
            return this.props.reports.map((report, i) => {
                return (
                    <div
                        className="reports__list__item"
                        key={i}
                        onClick={() => this.handleClick(report)}>
                    {utils.dateHMS(report.time)} - {report.type} - <span className="reports__list__item__user">{report.user}</span> - <span className={(report.outcome === 'Defeat' ? 'reports__list__item__defeat' : 'reports__list__item__victory')}>{report.outcome} {this.renderUnread(report)}</span>
                    </div>
                );
            });
        } else if(this.state.sorted.length !== 0){
            //here is an error i suppose - maps sorted state
            return this.state.sorted.map((report, i) => {
                return (
                    <div
                    className="reports__list__item"
                    key={i}
                    onClick={() => this.handleClick(report)}>
                    {utils.dateHMS(report.time)} - {report.type} - <span className="reports__list__item__user">{report.user}</span> - <span className={(report.outcome === 'Defeat' ? 'reports__list__item__defeat' : 'reports__list__item__victory')}>{report.outcome} {this.renderUnread(report)}</span>
                    </div>
                );
            });
        } else {
            return <div>No reports</div>;
        }
    }
    renderDefaultSortButton(){
        if(this.state.sorted.length !== 0){
            return <span onClick={() => this.handleSort('default')}>Sort by time</span>;
        }
    }
    renderSort(){
        if(this.props.reports.length !== 0){
            return (
                <div className="reports-sort">
                    {/* {this.renderDefaultSortButton()} */}
                    <span className="reports-sort-text">Sort by:</span>
                    <span className={"reports-sort-span "+(this.state.sort === 'default' ? 'reports-sort-span-clicked' : '')} onClick={() => this.handleSort('default')}>time</span>
                    <span className={"reports-sort-span "+(this.state.sort === 'user' ? 'reports-sort-span-clicked' : '')} onClick={() => this.handleSort('user')}>user</span>
                    <span className={"reports-sort-span "+(this.state.sort === 'outcome' ? 'reports-sort-span-clicked' : '')} onClick={() => this.handleSort('outcome')}>outcome</span>
                </div>
            );
        }
    }
    render(){
        // console.log('ss', this.state.sorted);
        return (
            <div className="reports">
                {this.renderSort()}
            
                <div className="reports__list">
               
                {this.renderReportsList()}
                </div>
            
                {this.renderModal()}
            </div>
        );
    }
}

function mapStateToProps(state){
    return {
        reports: state.reports
    };
}

export default connect(mapStateToProps, actions)(Reports);