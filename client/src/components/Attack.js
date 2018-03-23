import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import * as actions from './../actions/marshal';

import ItemCard from './ItemCard';

class Attack extends Component {
    constructor(props){
        super(props);
        this.state = { units: {}, selectedMarshal: {} };
        this.user = localStorage.getItem('username');

        this.handleAttackClick = this.handleAttackClick.bind(this);
        this.selectMarshal = this.selectMarshal.bind(this);
    }
    componentWillMount(){
        this.props.get_marshals();
    }
    renderAttack(){
        // console.log('match', this.props);
        if(this.props.match && this.props.match.params.user){
            return <div className="attack__user">{this.props.match.params.user}</div>;
        }
    }
    renderCoords(){
        if(this.props.match && this.props.match.params.x && this.props.match.params.y){
            return <div>{this.props.match.params.x}:{this.props.match.params.y}</div>;
        }
    }
    displayUnits(){
        // console.log('units', this.props.units);
        if(this.props.units){
            return this.props.units.map((unit, i) => {
                return (
                    <ItemCard
                        key={i}
                        type={'attack'}
                        socket={this.context.socket}
                        // resources={this.props.resources} 
                        // renderCost={this.renderCost.bind(this)} 
                        // hireable={hireable} 
                        unit={unit} 
                        addStateUnits={this.addStateUnits.bind(this)}
                    />
                );
            });
        }
    }
    addStateUnits(unit, amount){
        // console.log('update styate', unit, amount);
        let units = this.state.units;
        units[unit] = amount;
        this.setState({ units }, () => {
            // console.log('state', this.state.units);
        });
    }
    handleAttackClick(){
        // console.log(this.state.units);
        // this.context.socket.emit('attack', { units: this.state.units, attacking: this.user, attacked: this.props.match.params.user });
        if(Object.keys(this.state.units).length !== 0){
            this.context.socket.emit('attack',
            this.state.units,
            this.user,
            this.props.match.params.user,
            this.props.match.params.x,
            this.props.match.params.y,
            this.state.selectedMarshal
            );  
            this.props.history.push('/map'); 
        }
    }
    renderButton(){
        if(this.props.units.length !== 0){
            return <button onClick={this.handleAttackClick}>ATTACK LMFAOOAOAO</button>;
        } else {
            return <div>You have no units, ROFL GOOD LUCK WITH THAT.</div>;
        }
    }
    renderTravelTime(){
        
    }
    selectMarshal(marshal){
        // console.log('marshal selected', marshal);
        if(this.state.selectedMarshal.name === marshal.name){
            this.setState({ selectedMarshal: {} });
        } else {
            this.setState({ selectedMarshal: marshal });
        }
    }
    renderMarshals(){
        if(this.props.marshals && this.props.marshals.marshals && this.props.marshals.marshals.length !== 0){
            return this.props.marshals.marshals.map((marshal, i) => {
                return (
                <div 
                    onClick={() => this.selectMarshal(marshal)} 
                    className={"marshal-attack-single " + (this.state.selectedMarshal.name === marshal.name ? "marshal-attack-single-selected":"")} 
                    key={i}>
                {marshal.rank} {marshal.name} {marshal.level}
                </div>
                );
            });
        }
    }
    render(){
        // console.log('marshals', this.props.marshals);
        // console.log('params:', this.props.match.params);
        return (
            <div className="attack">
                <h3>Attack the noob lmfao</h3>
                {this.displayUnits()}
                <div className="marshal-attack">{this.renderMarshals()}</div>
                {this.renderAttack()}
                {this.renderCoords()}
                {this.renderButton()}
                {/* <button onClick={this.handleAttackClick}>ATTACK LMFAOOAOAO</button> */}
            </div>
        );
    }
}

Attack.contextTypes = {
    socket: PropTypes.object
};

function mapStateToProps(state){
    return {
        units: state.units,
        marshals: state.marshals
    };
}

export default withRouter(connect(mapStateToProps, actions)(Attack));