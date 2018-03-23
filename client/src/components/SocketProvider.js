import React, { Component } from 'react';
import PropTypes from 'prop-types';

class SocketProvider extends Component {
    constructor(props, context){
        super(props, context);  
        this.socket = context.socket;
    }
    // consolexD(){
    //     console.log('xd');
    // }
    getChildContext(){
        return {
            socket: this.props.socket
        };
    }
    render(){
        return <div>{this.props.children}</div>
    }
}

SocketProvider.childContextTypes = {
    socket: PropTypes.object
};

export default SocketProvider;
