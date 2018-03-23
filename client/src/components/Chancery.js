import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from './../actions/user';
import PropTypes from 'prop-types';

// import utils from './../utils';

import BuildingCard from './BuildingCard';


class Chancery extends Component {
    componentWillMount(){
        if(!this.props.buildable){
            this.props.fetch_buildings('buildable');
        }
        if(!this.props.upgradable){
            this.props.fetch_buildings('upgradable');
        }
    }
    componentWillUnmount(){

    }
    componentDidMount(){
        // this.context.socket.on('buildingCompleted', (constr) => {
        //     console.log('Construction is finished!', constr);
        //     // this.props.fetch_buildings('buildable');
        //     if(constr.type === 'resource'){
        //         this.props.fetch_income();
        //     }
        //     this.props.fetch_buildings('upgradable');
        //     this.props.setEvent('complete', { message: 'Construction finished', completed: `${utils.dateHMS(constr.completed)}` });
        // });

    }
    renderBuildings(kind, purpose){
        //kind - buildable / upgradable
        //purpose - resource / military..   
        if(this.props[kind] && Object.keys(this.props[kind]).length !== 0 && this.props[kind][purpose]){
            return this.props[kind][purpose].map((item, i) => {
                let qq = {};
                let c = {};
                let possible = true;
                Object.keys(item.levels[item.level].cost).forEach((r) => {
                    if(this.props.resources[r] < item.levels[item.level].cost[r]){
                        qq[r] = false;
                        possible = false;
                        c[r] = item.levels[item.level].cost[r];
                    } else {
                        qq[r] = true;
                        c[r] = item.levels[item.level].cost[r];
                    }
                });
                return (
                    <BuildingCard key={i} item={item} qq={qq} c={c} possible={possible} socket={this.context.socket}/>
                );
            });
        } 
    }
    render(){
        // console.log('military', this.props.upgradable);
        return (
            <div className="chancery">
                <div className="chancery__header">From here you order your pleb you start a construction or upgrade buildings.</div>
                {this.renderBuildings('upgradable', 'administration')}
                <div className="chancery__row">{this.renderBuildings('buildable', 'resource')}
                {this.renderBuildings('upgradable', 'resource')}</div>
                {this.renderBuildings('buildable', 'military')}
                {this.renderBuildings('upgradable', 'military')}
                {this.renderBuildings('buildable', 'research')}
                {this.renderBuildings('upgradable', 'research')}
            </div>
        );
    }
}

Chancery.contextTypes = {
    socket: PropTypes.object
};

function mapStateToProps(state){
    return {
        buildable: state.buildings.buildable,
        upgradable: state.buildings.upgradable,
        // built: state.buildings.built,
        resources: state.resources,
        // events: state.events
    };
}

export default connect(mapStateToProps, actions)(Chancery);