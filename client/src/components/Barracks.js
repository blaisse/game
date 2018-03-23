import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from './../actions/user';
import PropTypes from 'prop-types';

import ItemCard from './ItemCard';


class Barracks extends Component {
    componentDidMount(){
        if(!this.props.hireable){
            this.props.fetch_hireable();
        }
        
    }
    renderHireable(){
        if(this.props.hireable){
            // console.log('help', this.props.hireable);
            const hireable = this.props.hireable;
            return Object.keys(hireable).map((unit, i) => {
                return (
                    <ItemCard key={i}
                        type={'barracks'}
                        socket={this.context.socket}
                        resources={this.props.resources} 
                        // renderCost={this.renderCost.bind(this)} 
                        hireable={hireable} 
                        unit={unit} 
                        
                    />
                );
            });
        }
    }
    render(){
        // console.log('send helpsu', this.props.hireable);
        return (
            <div className="order">{this.renderHireable()}</div>
        );
    }
}

function mapStateToProps(state){
    return {
        hireable: state.buildings.hireable,
        resources: state.resources
    };
}

Barracks.contextTypes = {
    socket: PropTypes.object
};


export default connect(mapStateToProps, actions)(Barracks);