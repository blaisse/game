import React, { Component } from 'react';
import utils from './../utils';
import Timer from './Timer';


class Queue extends Component {
    constructor(props){
        super(props);
        this.state = { remove: false };
        this.triggerRemoveAnimation = this.triggerRemoveAnimation.bind(this);
    }
    renderTimer(item, i){
        // if(i===0){
            // const time = item.completed - new Date().getTime();
            return <Timer handleRemove={this.props.handleRemove} triggerRemoveAnimation={this.triggerRemoveAnimation} item={item} completed={item.completed} queue={this.props.queue} />;//queue={this.props.queue} 
        // }
    }
    triggerRemoveAnimation(){
        // console.log('triggering..');
        this.setState({ remove: true }, () => {
        });
    }
    handleRemoveClass(item){
        if(this.props.update){
            const a = this.props.queue.filter((qq) => {
                return qq.completed === item.completed && qq.construction === item.construction;
            });
            if(a.length === 0){
                return " timer__remove";
            }
            return "";
        }
    }
    renderQueue(){
        if(this.props.queue && this.props.queue.length !== 0){
            return this.props.queue.map((item, i) => {
                console.log('item', item);
                return (
                    <div className={"timer "} key={i}>
                        <div>{item.construction}</div>
                        <div>{utils.dateHMS(item.completed)}</div>
                        {/* <Timer completed={time} /> */}
                        {this.renderTimer(item, i)}
                        {/* {this.calculateTimeLeft(item)} */}
                    </div>
                );
            });
        }
    }
    render(){
        return (
            <div className="right-panel-queue">{this.renderQueue()}</div>
        );
    }
}

export default Queue;