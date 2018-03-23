import React, { Component } from 'react';
import utils from './../utils';

class BuildingCard extends Component {
    constructor(props){
        super(props);
        this.state = { e: true };
        this.user = localStorage.getItem('username');
    }
    renderR(qq, c){
        // console.log('qq', qq, c);
        return Object.keys(qq).map((b, i) => {
            return (
                <span className={(qq[b] ? '' : 'insufficient')} key={i}>{b}: {c[b]} </span>
            );
        });
    }
    render(){
        const qq = this.props.qq;
        const c = this.props.c;
        const item = this.props.item;
        const possible = this.props.possible;
        return (
            <div className={"chancery__build-item" }
                onClick={() => {
                    if(possible){
                        this.props.socket.emit('build', 
                        {   construct: item.building, 
                            building: 'chancery',
                            type: item.type,
                            user: this.user,
                            level: item.level
                        });
                        // console.log('possssible');
                    } else {
                        console.log('impossiblew');
                        // this.setState({ e: false });
                    }
                }
                } 
                >
                {item.building} to level: {item.level} | {utils.timeBuild(item.levels[item.level].duration)}
                <div>{this.renderR(qq, c)}</div>
                <div>{(this.state.e ? '' : 'Not enough resourcess boi')}</div>
                {/* {x} */}
                {/* <span className="insufficient--colorless">{(possible ? '': 'Not enough resources')}</span> */}
            </div>
        );
    }
}

export default BuildingCard;