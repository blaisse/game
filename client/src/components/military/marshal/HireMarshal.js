import React, { Component } from 'react';

class HireMarshal extends Component {
    constructor(props){
        super(props);
        this.state = { value: "", error: "" };

        this.handleHire = this.handleHire.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
    }
    componentDidMount(){
        this.props.socket.on('marshalInsufficientResources', () => {
            this.setState({ error: "Insufficient Resources" });
        });
    }
    handleHire(){
        //first character uppercase
        if(this.state.value){
            const value = this.state.value.trim();
            const first = value[0].toUpperCase();
            const remaning = value.slice(1, value.length);
            const upperCasedName = first + remaning;
            //name cannot be a duplicate
            const name = this.props.marshals.filter((marshal) => {
                return marshal.name === upperCasedName;
            });            
            if(value.length >= 5 && name.length === 0){
                // this.props.marshalActions.hire_marshal(this.state.value);
                //emit: user, marshal name, building (staff), type (marshal)
                this.props.socket.emit('marshal',
                    localStorage.getItem('username'),
                    upperCasedName,
                    'staff',
                    'marshal'
                );
                this.setState({ value: "", erorr: "" });
            } else if(upperCasedName.length < 5){
                this.setState({ error: "Name must have at least 5 characters" });
            } else if(name.length !== 0){
                this.setState({ error: "Name already taken!" });
            }
        }
    }
    renderError(){
        if(this.state.error){
            return <div>{this.state.error}</div>;
        }
    }
    handleInputChange(e){
        this.setState({ value: e.target.value, error: "" });
    }
    render(){
        return (
            <div className="marshal-hire">
                <input placeholder="Name.." type="text" value={this.state.value} onChange={this.handleInputChange} />
                {this.renderError()}
                <button onClick={this.handleHire}>Hire a marshal</button>
            </div>
        );
    }
}

export default HireMarshal;