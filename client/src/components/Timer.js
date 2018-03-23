import React, { Component } from 'react';   
import utils from './../utils';

class Timer extends Component {
    constructor(props){
        super(props);
        this.state = { time: 0, id: 0 };
        // this.state = { time: new Date().getTime() };
        this.id = 0;
    }
    // componentWillUpdate(){
    //     clearTimeout(this.state.id);
    // }
    // shouldComponentUpdate(nextProps){
    //     if(nextProps.queue.length > this.props.queue.length){
    //         //new item added
    //         console.log('WTFFFF?----===');
    //         return false;
    //     }
        
    //     return true;
    // }
    // componentWillReceiveProps(nextProps){
        // if(nextProps.queue.length === this.props.queue.length - 1){
    //         //first item deleted, update timer for the next item
    //         // console.log('LMFAO?', this.props.completed, this.props.item);
    //         // const time = nextProps.queue[0].completed - new Date().getTime();
    //         // clearInterval(this.state.id);
    //         // this.setState({ time, id: 0 });
    //         const time = nextProps.queue[0].completed - new Date().getTime();
    //         this.setState({ time });
    //         // clearInterval(this.state.id);
    //         console.log('- 1 :)))))))))', this.props.item.construction);
    //         // return false;
            // console.log('LMFAO LOL XD', this.props.item.construction);

        // }
        // console.log('LMFAO outside XD', this.props.item.construction);
    //     // if(this.state.id !== 0){
    //     //     console.log('KAISER');
    //     // }
    //     // if(nextProps.queue.length > 1){
    //     //     console.log('LOLOLOLOLOLLOOLOL');
    //     //     clearInterval(this.state.id);
    //     //     // return false;
    //     // }
    //     // return true;
    // }
    componentWillMount(){
        // console.log('HE LL O');
        const time = this.props.completed - new Date().getTime();
        this.setState({ time });
    }
    componentWillUnmount(){
        // console.log('cya nerd', this.state.id, this.id);
        // clearTimeout(this.state.id);
        // clearTimeout(this.id);
        // clearInterval(this.state.id);
    }
    renderTime(){
        const s = 1000;
        // console.log('wtf', this.props.completed, this.state.time);
        // const now = new Date().getTime();
        // clearInterval(this.state.id);
        // if(!this.state.next){
        const id = setTimeout(() => {
            this.id = id;
            const time = this.props.completed - new Date().getTime();
            // const time = this.state.time - 1000;
            // console.log('hmh', this.state.time, this.props.item.construction);
            // this.setState({ time });
            // console.log('id???', id);
            // const time = this.state.time-s;
            // console.log('LOL xd ', time);
            if(time >= 0){
                // console.log('send help', time, this.props.item.construction);
                // const x = this.props.queue.filter(q => q.completed === this.props.completed);
                // if(x.length !== 0){
                    this.setState({ time, id }, () => {
                        // console.log('item?', this.props.item.construction, this.props.queue);
                    });
                // }
                
                // clearInterval(id);
            } else {
                // this.props.handleRemove();
                //call parent function to trigger exit animation
                // this.props.triggerAnimation(this.props.timerDiv);
                // this.props.timerDiv.className += " LOLOLHITLER";
                // console.log('?', this.props.timerDiv);
                // this.props.triggerRemoveAnimation();
                // clearTimeout(this.state.id);
            }
        }, s);
    // }
    }
    render(){
        // const x = this.props.queue.filter(q => q.completed === this.props.completed);
        // console.log('HELP MME PLS OMG IT NO WORK', x);
        // console.log('this.props.',this.props.completed);
        // console.log('timer', this.state.time);
        return (
            <div className="timer1">
                {this.renderTime()}
                {utils.timeBuild(this.state.time)}
            </div>
        );
    }
}

export default Timer;