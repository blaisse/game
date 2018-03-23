import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';

import { signin } from './../../actions/index';


class SignIn extends Component {
    // constructor(props){
    //     super(props);
    // }
    renderField(field){
        const { meta: { touched, error } } = field;
        return (
            <div className="auth__form__row">
                <label>{field.label}</label>
                <input autoComplete="off" type={field.type} { ...field.input } />
                <div className="auth__form__row__error">{touched ? error : ''}</div>
            </div>
        );
    }
    onSubmit(values){
        this.props.signin(values.username, values.password, () => {
            this.props.history.push('/');
            // console.log('BLOODY', this.props.history.push('/front'));
            // this.context.history.push('/path')
        });
    }
    render(){
        const { handleSubmit } = this.props;
        return (
            <div className="auth">
                <form className="auth__form" onSubmit={handleSubmit(this.onSubmit.bind(this))}>
                    <Field
                        label="Username" 
                        name="username" 
                        type="text"
                        component={this.renderField} 
                    />
                    <Field 
                        label="Password"
                        name="password"
                        type="password"
                        component={this.renderField}
                    />
                    <button type="submit">Sign In</button>
                </form>
            </div>
        );
    }
}

function validate(values){
    const errors = {};

    if(!values.username) errors.username = "Enter username";
    if(!values.password) errors.password = "Enter password";

    return errors;
}

export default reduxForm({
    validate,
    form: 'SignInForm'
})(
    connect(null, { signin })(SignIn)    
);