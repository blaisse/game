import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from './../actions/user';
import PropTypes from 'prop-types';

// import utils from './../utils';

// import BuildingCard from './BuildingCard';

class Home extends Component {
    constructor(props){
        super(props);
        this.user = localStorage.getItem('username');
        this.state = { e: true, clicked: "" };//useless
        this.handleClick = this.handleClick.bind(this);
    }
    componentWillMount(){
        if(!this.props.built){
            this.props.fetch_buildings('built');
        }
        
    }
    componentDidMount(){
  
    }
    componentWillUnmount(){
        this.context.socket.off('errorBuilding');
    }
    checkResources(cost, item){
        //useless
        let obj = {};
        Object.keys(cost).forEach((res) => {
            if(!obj[item.building]) obj[item.building] = {};
            
            if(this.props.resources[res] < cost[res]){
                // possible = false;
                if(!obj[item.building][res]) obj[item.building][res] = {};
                obj[item.building][res][res] = cost[res];
                obj[item.building][res].enough = false;
            } else {
                if(!obj[item.building][res]) obj[item.building][res] = {};
                obj[item.building][res][res] = cost[res];
                obj[item.building][res].enough = true;
            }
        });
        return obj;
    }
    handleClick(building){
        //make a component to open a few at once..some day..
        switch(building){
            case "chancery":
                // console.log('chancery clicked');
                if(this.state.clicked === building){
                    return this.setState({ clicked: "" });
                }
                this.setState({ clicked: building });
                break;
            case "barracks":
                if(this.state.clicked === building){
                    return this.setState({ clicked: "" });
                }
                this.setState({ clicked: building });
                break;
            default:
                break;
        }
    }
    displayMessage(building, obj){
        if(this.state.clicked === building){
            // console.log(';obj', obj);
            // const data = this.props
            switch(building){
                case "chancery": 
                    return (
                        <div className="idk">
                            <p>Enables constructing basic buildings. Upgrade it to speed up the construction time.</p>
                        </div>
                    );
                case "barracks":
                    const data = obj.levels[obj.level];
                    console.log('d', data);
                    return (
                        <div className="idk">
                            <p>Hire units</p>
                        </div>
                    );
                default:
                    return ( 
                        <div className="idk">
                            
                        </div>
                    );
            }
         
        }
    }
    renderBuildings(kind){
        //kind - buildable / upgradable
        //purpose - resource / military..   
        if(this.props[kind] && Object.keys(this.props[kind]).length !== 0 && this.props[kind]){
            return Object.keys(this.props[kind]).map((type) => {//type -> administration, resource
                return this.props[kind][type].map((building, i) => {
                    return (
                        <div onClick={() =>this.handleClick(building.building)} className="overview__cards__card" key={i}>
                            <div >{building.building} level: {building.level}</div>
                            {this.displayMessage(building.building, building)}
                        </div>
                    );
                });
            });
        } 
    }
   
    render(){
        // console.log('built', this.props.built);
        // console.log('socket?', this.context.socket);
        // console.log('upgradable:', this.props.upgradable);
        return (
            <div className="overview">
                <h3>Overview</h3>
                <div className="overview__cards">
                    {this.renderBuildings('built', 'resource')}
                </div>   
            </div>
        );
    }
}

Home.contextTypes = {
    socket: PropTypes.object
};

function mapStateToProps(state){
    return {
        buildable: state.buildings.buildable,
        upgradable: state.buildings.upgradable,
        built: state.buildings.built,
        resources: state.resources,
        // events: state.events
    };
}

export default connect(mapStateToProps, actions)(Home);