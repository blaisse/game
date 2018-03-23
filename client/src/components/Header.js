import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { signout } from './../actions';
import { fetch_newreport } from './../actions/user';
import PropTypes from 'prop-types';

// import comb from './../reducers';
// console.log('comb', comb);
class Header extends Component {
    componentDidMount(){
        this.props.fetch_newreport();
        this.context.socket.on('newReport', () => {
            console.log('NEW REPORT');
            this.props.fetch_newreport();
        });
    }
    handleSignout(){
        // console.log(this);
        // this.props.history.push('/front');
        this.props.signout();
        
    }
    renderAuth(){
        if(this.props.auth.authed){
            return (
                <div onClick={() => this.handleSignout()}>Sign out</div>
            );
        } else {
            return (
                <div>
                    <Link to="/signin">Sign in</Link>
                    <Link to="/signup">Sign up</Link>
                </div>
            );
        }
    }
    renderNewReportNotification(){
        if(this.props.newReport){
            return <span className="header__new-report">&nbsp;</span>;
        }
    }

    render(){
        // console.log('newReport', this.props.newReport);
        return (

            <div className={"header " + (this.props.open ? "header__mobile" : "")}>
        
                <div className="header__content" onClick={this.props.handleMenuClick}>
                    <div className="header__links">
                        <Link onClick={this.handleMenuClick} exact="true" to="/">Overview</Link>
                        <Link exact="true" to="/map">Map</Link>
                        <Link exact="true" to="/chancery">Chancery</Link>
                        <Link exact="true" to="/barracks">Barracks</Link>
                        <Link exact="true" to="/research">Research</Link>
                        <Link exact="true" to="/reports">Reports {this.renderNewReportNotification()}</Link>
                        <Link exact="true" to="/staff">Military Staff</Link>
                    </div>   
                    <div className="header__auth">
                        {this.renderAuth()} 
                    </div>
                </div>
            </div>
        );
    }
}

Header.contextTypes = {
    socket: PropTypes.object
};


function mapStateToProps(state){
    return {
        auth: state.auth,
        newReport: state.newReport
    };
}

export default connect(mapStateToProps, { signout, fetch_newreport })(Header);