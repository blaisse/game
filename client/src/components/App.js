import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from '../actions';//assign to obj

import io from 'socket.io-client';

import Home from './Home';
import GameMap from './Map';
import Attack from './Attack';
import Barracks from './Barracks';
import Chancery from './Chancery';
import Research from './Research';
import Header from './Header';
import Reports from './Reports';
import SignUp from './auth/signup';
import SignIn from './auth/signin';
import RightPanel from './Right_panel';
import LeftPanel from './Left_panel';
import MilitaryStaff from './MilitaryStaff';

// import Front from './Front';
import RequireAuth from './auth/requireAuth';

import SocketProvider from './SocketProvider';

class App extends Component {
    constructor(props){
        super(props);
        // this.socket = io('http://localhost:5002');
        this.socket = io('https://text--game.herokuapp.com/');
        // this.socket = io('https://textgame.azurewebsites.net');
        this.user = localStorage.getItem('username');
        this.handleMenuClick = this.handleMenuClick.bind(this);
        this.openMenu = this.openMenu.bind(this);
        this.state = { open: false };
    }
    componentDidMount(){
        //load all necessary data in here?
        //update on socket emits from server

        //why it doesnt listen for it? Only the one in Home does.
        // this.socket.on('errorBuilding', (message) => {
        //     console.log('message App', message.text);
        // });
        this.socket.on('connect', () => {
            console.log('gogo');
            this.socket.emit('join', this.user);
        });
    }
    handleMenuClick(){
        // console.log('handle menu click');
        if(this.state.open){
            this.setState({ open: false });
        }
    }
    openMenu(){
        this.setState({ open: !this.state.open });
    }
    render(){
        // console.log('pre-auth', this.props.auth);
        // if(Object.keys(this.props.auth).length === 0){
        //     console.log('auth', this.props.auth);
        //     return <Front />;
        // }
        return (
            <div>
                <BrowserRouter>
                    <div>
                        <SocketProvider socket={this.socket}>
                            <Header open={this.state.open} handleMenuClick={this.handleMenuClick} />
                            <div className="container">
                            <div className="nav-btn" onClick={this.openMenu}>&times;</div>
                            <LeftPanel />
                            <div className="view">
                            <Switch>
                                {/* <Route exact path="/attack" component={Attack} /> */}
                                <Route path="/attack/:user/:x/:y" component={RequireAuth(Attack)} />{/*  add ? at the end to make it optional */}
                                <Route exact path="/" component={RequireAuth(Home)} />
                                <Route exact path="/map" component={RequireAuth(GameMap)} />
                                <Route exact path="/reports" component={RequireAuth(Reports)} />
                                <Route exact path="/chancery" component={RequireAuth(Chancery)} />
                                <Route exact path="/barracks" component={RequireAuth(Barracks)} />
                                <Route exact path="/research" component={RequireAuth(Research)} />
                                <Route exact path="/staff" component={RequireAuth(MilitaryStaff)} />
                                <Route exact path="/signup" component={SignUp} />
                                <Route exact path="/signin" component={SignIn} />
                                {/* <Route exact path="/front" component={Front} /> */}
                            </Switch>
                            </div>
                            <RightPanel />
                            </div>
                        </SocketProvider>
                    </div>
                </BrowserRouter>
            </div>
        );
    }
}

function mapStateToProps(state){
    return {    
        auth: state.auth
    };
}

export default connect(mapStateToProps, actions)(App);