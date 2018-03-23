import React, { Component } from 'react';

import SignUp from './auth/signup';
import SignIn from './auth/signin';

class Front extends Component {
    constructor(props){
        super(props);
    }
    render(){
        // console.log('heh', this.context);
        return <div><SignIn /></div>
    }
}

export default Front;