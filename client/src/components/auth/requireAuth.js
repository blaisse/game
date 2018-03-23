import React, { Component } from 'react';
import { connect } from 'react-redux';

export default function(ComposedComponent){
    class Auth extends Component {
       componentWillMount(){
           if(!this.props.auth){
            // console.log('wtf? coi', this.props);
            this.props.history.push('/signin');
           }
       }
       render(){
           return <ComposedComponent match={this.props.match} />;
       }
    }
    function mapStateToProps(state){
        return {
            auth: state.auth.authed
        };
    }
    return connect(mapStateToProps)(Auth);
}