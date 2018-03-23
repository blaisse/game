import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';

import { signup } from './../../actions/index';


class SignUp extends Component {
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
        console.log('values', values);
        this.props.signup(values.username, values.password, () => {
            this.props.history.push("/");
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
                    <button type="submit">Sign Up</button>
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
    form: 'SignUpForm'
})(
    connect(null, { signup })(SignUp)    
);