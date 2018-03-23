import React, { Component } from 'react';
import ItemCardCost from './ItemCardCost';
import utils from './../utils';

class ItemCard extends Component {
    constructor(props){
        super(props);
        this.state = { amount: "" };
        this.user = localStorage.getItem('username');
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleMax = this.handleMax.bind(this);
        this.handleMaxAmountClick = this.handleMaxAmountClick.bind(this);
    }
    handleChange(event){
        // const val = parseInt(event.target.value);
        this.setState({ amount: event.target.value });
    }
    handleSubmit(event){
        event.preventDefault();
        const val = Number(this.state.amount);
        const valNumber = Number.isInteger(Number(this.state.amount));
        // console.log('???', val, Number.isInteger(val));
        // console.log('val', val);
        if(valNumber && val > 0){            
            //emit socket
            this.props.socket.emit('recruit', { 
                unit: this.props.unit, 
                building: 'barracks', 
                amount: this.state.amount, 
                user: this.user 
            });
            this.setState({ amount: "" });
        }
    }
    handleClickOrder(){
        if(this.props.type === 'research' && this.props.hireable[this.props.unit].researchable){
            // console.log('me is click');
            this.props.socket.emit('research', {
                research: this.props.unit,
                user: this.user,
                building: 'researchCenter',
                type: 'research'
            });
        }
    }
    handleMax(amount){
        // console.log('very hello', p);
        this.setState({ amount });
    }
    calculateMax(){
        // console.log('??--', this.props.hireable[this.props.unit]);
        const { cost } = this.props.hireable[this.props.unit];
        let possible = [];
        Object.keys(cost).forEach((resource) => {
            let total = Math.floor(this.props.resources[resource]/cost[resource]);
            possible.push(total);
            // console.log('total', resource, total);
        });
        possible.sort((a, b) => {
            return a-b;
        });
        // console.log('Total', possible);
        return <div onClick={() => this.handleMax(possible[0])} className="order__card-max">Max: {(possible[0] > 0 ? possible[0] : 0)}</div>;
    }
    renderAmountCost(){
        return (
            <div className="order__card__cost">
                <p className="order__card__heading">Cost:</p>
                <ItemCardCost 
                    type={this.props.type}
                    unit={this.props.unit} 
                    hireable={this.props.hireable} 
                    resources={this.props.resources}
                    amount={this.state.amount}
                />
                {/* {this.props.renderCost('unit', hireable[unit])} */}
            </div>
        );
    }
    renderHeading(){
        if(this.props.hireable[this.props.unit].requirement.length !== 0){
            return (
                <p className="order__card__heading">Requirements</p>
            );
        }
    }
    renderAmountCost2(){
        // console.log('resea', this.props.research);
        // console.log('buildings', this.props.buildings);
        // console.log('send help pls ', this.props.hireable[this.props.unit]);
        return (
            <div className="order__card__cost">
                {this.renderHeading()}
                <ItemCardCost
                    display={'requirement'} 
                    type={this.props.type}
                    unit={this.props.unit} 
                    hireable={this.props.hireable} 
                    resources={this.props.resources}
                    research={this.props.research}
                    buildings={this.props.buildings}
                    amount={this.state.amount}
                />
                {/* {this.props.renderCost('unit', hireable[unit])} */}
            </div>
        );
    }
    renderCompletion(){
        if(this.props.hireable[this.props.unit].completed){
            return (
                <div>Finish at: {utils.dateHMS(this.props.hireable[this.props.unit].completed)}</div>
            );
        }
    }
    renderCompleted(){
        if(this.props.hireable && this.props.hireable[this.props.unit].research){
            return (
                <div className="order__card__researched">Researched</div>
            );
        }
    }
    displayFlatObject(type){
        //type -> 'allows'
        const unit = this.props.hireable[this.props.unit];
        // console.log('unit', unit);
        return unit[type].map((allow, i) => {
            return <div key={i}>{allow.type}: {allow.unit}</div>
        });
    }
    renderUpkeep(){
        const unit = this.props.hireable[this.props.unit];
        return Object.keys(unit.upkeep).map((res, i) => {
            return <div className="order__card__cost" key={i}>{res}: {unit.upkeep[res]}</div>;
        });
    }
    renderAccordingToType(type){
        const hireable = this.props.hireable;
        const unit = this.props.unit;
        if(type === 'barracks'){   
            // console.log('unit', unit, this.props.hireable);
            return (
                <div>
                    <h4>{this.props.unit}</h4>
                    <ul className="order__card__data">
                        <li>Completion time: {hireable[unit].duration/1000}s</li>
                        <li>Health: {hireable[unit].hp}</li>
                        <li>Loot capacity: {hireable[unit].loot}</li>
                        <li>Movement: {hireable[unit].movement}</li>
                        <li>Spot(?) taken: {hireable[unit].spot}</li>
                    </ul>
                    {this.renderAmountCost()}
                    <p className="order__card__heading">Upkeep:</p>
                    {this.renderUpkeep()}
                    <div className="order__card__hire">
                    {this.calculateMax()}
                        <form onSubmit={this.handleSubmit}>
                            <input type="text" value={this.state.amount} onChange={this.handleChange}/>
                            <button className="order__card-button">Hire</button>
                        </form>
                    </div>
                </div>
            );
        } else if(type === 'research'){
            return (
                //className={(hireable[unit].researchable ? ' researchable' : '') || (hireable[unit].research ? ' research' : '')}
                <div>
                    <h4>{this.props.unit}</h4>
                    <ul>
                        <li>Completion time: {hireable[unit].duration/1000}s</li>
                        <p className="order__card__heading">Allows:</p>
                        {this.displayFlatObject('allows')}
                        {this.renderAmountCost()}
                        {this.renderAmountCost2()}
                        {this.renderCompletion()}
                    </ul>
                </div>
            );
        } else if(type === 'attack'){
            //there is a difference in this.props.unit, in type: attack it's an object
            //whereas in barracks and research string with a name
            //beacuse there i iterate over hireable
            // console.log('gogo attack', this.props.unit);
        return (
            <div>
                <h4>{this.props.unit.unit}</h4>
                {this.displayMaxAmount()}
                <input type="text" ref={input => this.amountInput = input} onChange={this.handleParentState.bind(this)} />
            </div>
        );
        }
    }
    handleMaxAmountClick(){
        //ref={input => this.amountInput = input}
        this.amountInput.value = this.props.unit.amount;
        // this.setState({ amount: this.props.unit.amount });
        this.props.addStateUnits(this.props.unit.unit, this.props.unit.amount.toString());
    }
    displayMaxAmount(){
        if(this.props.unit){
            return (
                <div className="order__card-max" onClick={this.handleMaxAmountClick}>Max: {this.props.unit.amount}</div>
            );
        }
    }
    handleParentState(e){
        e.preventDefault();
        this.setState({ amount: e.target.value });
        // console.log('amount', this.props.unit.amount); 
        if(e.target.value > this.props.unit.amount){
            this.props.addStateUnits(this.props.unit.unit, this.props.unit.amount.toString());
        } else {
            this.props.addStateUnits(this.props.unit.unit, e.target.value);
        }
        // console.log('e', e.target.value);
    }
    render(){
        // console.log('itemCard socket', this.context.socket);
        return (
            <div onClick={this.handleClickOrder.bind(this)}
            className={"order__card " 
            + (this.props.hireable && this.props.hireable[this.props.unit].researchable ? ' researchable' : '')
            + (this.props.hireable && this.props.hireable[this.props.unit].research ? ' research' : '') 
            + (this.props.hireable && this.props.hireable[this.props.unit].queue ? ' queue' : '')
            }>
                {this.renderCompleted()}
                {/* <h4>{this.props.unit}</h4> */}
                
                {this.renderAccordingToType(this.props.type)}
            </div>
        );
    }
}

export default ItemCard;