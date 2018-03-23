import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from './../actions/user';
import PropTypes from 'prop-types';


import ItemCard from './ItemCard';

class Research extends Component {
    componentWillMount(){
        // this.props.fetch_researchable();
        if(!this.props.built){
            this.props.fetch_buildings('built');
        }
        this.props.fetch_research();
    }
    selectClass(name){

    }
    renderResearch(){
        // console.log('built', this.props.research);
        // const res = this.props.research;
        if(this.props.research){
            return Object.keys(this.props.research).map((name, i) => {
                return (
                    // <div className={(res[name].researchable ? ' researchable' : '') || (res[name].research ? ' research' : '')} 
                    //     key={i}>
                        <ItemCard 
                            key={i}
                            type={'research'}
                            socket={this.context.socket}
                            resources={this.props.resources} 
                            hireable={this.props.research}
                            research={this.props.research}
                            buildings={this.props.built}
                            unit={name}
                        />
                    // </div>
                );
            });
        }
    }
    render(){
        // console.log('research boy', this.props.research);
        return (
            <div>
                <h3>Research</h3>
                <div className="order">{this.renderResearch()}</div>
            </div>
        );
    }
}

Research.contextTypes = {
    socket: PropTypes.object
};

function mapStateToProps(state){
    return {
        researchable: state.research.researchable,
        research: state.research.research,
        resources: state.resources,
        built: state.buildings.built
    };
}

export default connect(mapStateToProps, actions)(Research);