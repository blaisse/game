import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as marshalActions from './../actions/marshal';
import PropTypes from 'prop-types';

import Marshal from './military/marshal/Marshal';
import HireMarshal from './military/marshal/HireMarshal';

class MilitaryStaff extends Component {
    componentWillMount(){
        this.props.get_marshals();
    }
    componentDidMount(){
        this.context.socket.on('updateMarshals', () => {
            this.props.get_marshals();
        });
        this.context.socket.on('errorMarshals', (message) => {
            console.log('hue', message);
        });
    }
    renderMarshals(){
        if(this.props.marshals && this.props.marshals.marshals && this.props.marshals.marshals.length !== 0){
            return this.props.marshals.marshals.map((marshal, i) => {
                return <Marshal marshal={marshal} key={i} />;
            });
        }
    }
    renderMarshals2(){
        let ar = [];
        if(this.props.marshals && this.props.marshals.marshals){//&& this.props.marshals.marshals.length !== 0
            for(let i=0;i<this.props.marshals.maxMarshals;i++){
                if(this.props.marshals.marshals[i]){
                    ar.push(<Marshal skills={this.props.marshals.skills} marshal={this.props.marshals.marshals[i]} socket={this.context.socket} key={i} />);
                } else {
                    ar.push(<div className="marshal-single" key={i}><h3>Empty Spot</h3><div className="marshal-single-stats"></div></div>);
                }
            }
        }
        return ar;
    }
    render(){
        return (
            <div className="marshal">
                <div className="marshal-marshals">{this.renderMarshals2()}</div>
                {/* <img src="http://www.firstworldwar.com/photos/graphics/hw_gergenstaff_01.jpg" /> */}
                <HireMarshal marshals={this.props.marshals.marshals} marshalActions={marshalActions} socket={this.context.socket} />
            </div>
        );
    }
}
MilitaryStaff.contextTypes = {
    socket: PropTypes.object
};


function mapStateToProps(state){
    return {
        marshals: state.marshals
    };
}

export default connect(mapStateToProps, marshalActions)(MilitaryStaff);