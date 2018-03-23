import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import * as actions from './../actions/user';

class LeftPanel extends Component {
    componentWillReceiveProps(nextProps){
        if(nextProps.auth !== this.props.auth && nextProps.auth){
            this.props.fetch_resources();
            this.props.fetch_units();
            this.props.fetch_income();
        }
    }
    componentWillMount(){
        this.props.fetch_resources();
        this.props.fetch_units();
        this.props.fetch_income();
    }
    componentDidMount(){
        // this.props.fetch_resources();
        this.context.socket.on('hello', () => {
            // console.log('HOLA?');
            this.props.fetch_units();
        });
        this.context.socket.on('hired', (unit) => {
            // this.props.setEvent('complete', `${utils.dateHMS(unit.completed)} ${unit.unit} hired`);
            this.props.fetch_units();
            this.props.fetch_income();            
        });
        this.context.socket.on('updateResources', () => {
            console.log('resources');
            this.props.fetch_resources();
        });
    }
    renderResources(){
        if(Object.keys(this.props.resources).length !== 0 && Object.keys(this.props.income).length !== 0){
             return Object.keys(this.props.resources).map((res, i) => {
                return (
                    <div className="left-panel__resources-resource" key={i}>{res}: {this.props.resources[res]} ( {this.props.income[res]} )</div>
                ); 
            });
        }
    }
    // renderInsufficient(){
    //     if(this.props.events.error){
    //         console.log('there is indeed an error');
    //         return (
    //             <div>{this.props.events.error}</div>
    //         );
    //     }
    // }
    renderUnits(){
        if(this.props.units.length !== 0){
            return this.props.units.map((unit, i) => {
                return (
                    <div key={i}>{unit.unit}: {unit.amount}</div>
                );
            });
        }
    }
    render(){
        return (
            <div className="left-panel">
                <div className="left-panel__resources">{this.renderResources()}</div>
                {/* <div>{this.renderInsufficient()}</div> */}
                <div className="left-panel__resources">{this.renderUnits()}</div>
            </div>
        );
    }
}

LeftPanel.contextTypes = {
    socket: PropTypes.object
};

function mapStateToProps(state){
    return {
        resources: state.resources,
        income: state.income,
        // events: state.events,
        units: state.units,
        auth: state.auth.authed
    };
}

export default connect(mapStateToProps, actions)(LeftPanel);