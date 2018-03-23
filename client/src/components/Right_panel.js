import React, { Component } from 'react';   
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import * as actions from './../actions/user';
import utils from './../utils';

import Timer from './Timer';
import Queue from './Queue';

class RightPanel extends Component {
    constructor(props){
        super(props);
        this.state = { time: 0, update: false };
        this.triggerAnimation = this.triggerAnimation.bind(this);
        this.handleRemove = this.handleRemove.bind(this);
    }
    componentDidMount(){
        this.props.fetch_queue_buildings();

        this.context.socket.on('updateQueue', () => {
            // this.setState({ update: true });
            this.props.fetch_queue_buildings();
        });

        this.context.socket.on('removeQueue', () => {
            //useless
            setTimeout(() => {
                this.props.fetch_queue_buildings();
            }, 2000);
        });

        this.context.socket.on('attacked', (time) => {
            this.props.setEvent('attacked', { message: "You have been attacked" });
            //update reports too!
            this.props.fetch_units();
            this.props.fetch_reports();
        });
        this.context.socket.on('hired', (unit) => {
            this.props.setEvent('hired', { message: `${unit.unit} hired`, completed: `${utils.dateHMS(unit.completed)}` });
        });
        this.context.socket.on('updateHireable', () => {
            this.props.fetch_hireable();
        });
        this.context.socket.on('buildingCompleted', (constr) => {
            console.log('Construction is finished!', constr);
            // this.props.fetch_buildings('buildable');
            if(constr.type === 'resource'){
                this.props.fetch_income();
            }
            // this.props.fetch_queue_buildings();
            this.props.fetch_buildings('built');
            this.props.fetch_buildings('upgradable');
            this.props.fetch_buildings('buildable');
            this.props.fetch_research();
            this.props.setEvent('complete', { message: 'Construction finished', completed: `${utils.dateHMS(constr.completed)}` });
        });
        this.context.socket.on('updateBuildable', (buildable) => {
            // console.log('woowowow');
            this.props.fetch_buildings('buildable');
            this.props.fetch_buildings('upgradable');
            // this.props.fetch_resources();
        });
        this.context.socket.on('updateUpgradable', (buildable) => {
            // console.log('woowowow');
            //in DB it's still and upgradable even though the building is in queue
            // this.props.fetch_buildings('buildable');
            this.props.fetch_buildings('upgradable');
            // this.props.fetch_resources();
        });
        this.context.socket.on('updateResearch', () => {
            this.props.fetch_research();
        });
        this.context.socket.on('errorBuilding', (message) => {
            console.log('message', message.text);
            //save error to global state
            this.props.setEvent('error', message.text);
        }); 
    }
    renderEvents(){
        if(this.props.events){
            const events = this.props.events;
            return Object.keys(events).map((event, i) => {
                //render TIME and MESSAGE, eventName: { message: String, completed: Number }
                return (
                    <div className="right-panel-events" key={i}>{events[event].completed} {events[event].message}</div>
                );
            });
        }
    }
    removeInterval(id){

    }
    handleRemove(){
        console.log('eeeeeee');
        this.props.delete_queue(this.props.queue);
    }
    renderTimer(item, i){
        // if(i===0){
            // const time = item.completed - new Date().getTime();
            return <Timer timerDiv={this.timerDiv} triggerAnimation={this.triggerAnimation} item={item} completed={item.completed} removeInterval={this.removeInterval}queue={this.props.queue}  />;//queue={this.props.queue} 
        // }
    }
    // calculateTimeLeft(item){
    //     const left = item.completed - new Date().getTime();
    //     const id = setInterval(() => {
    //         // this.setState({ time });
    //     }, 1000);
    // }
    triggerAnimation(item){
        console.log('triggering animation..', item);

    }
    renderQueue(){
        if(this.props.queue && this.props.queue.length !== 0){
            return this.props.queue.map((item, i) => {
                return (
                    <div className="timer" key={i}>
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
        // console.log('eueue', this.props.queue);
        return (
            <div className="right-panel">   
                {this.renderEvents()}
                <Queue handleRemove={this.handleRemove} queue={this.props.queue} update={this.state.update} />
                {/* <div className="right-panel-queue">{this.renderQueue()}</div> */}
                {/* <div className="right-panel-events">00:00:00 Teutonic knight hired</div> */}
            </div>
        );
    }
}

RightPanel.contextTypes = {
    socket: PropTypes.object
};

function mapStateToProps(state){
    return {
        events: state.events,
        queue: state.buildings.queue
    };
}

export default connect(mapStateToProps, actions)(RightPanel);