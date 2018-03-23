import React, { Component } from 'react';

import MarshalSkills from './MarshalSkills';

export default class Marshal extends Component {
    // constructor(props){
    //     super(props);
    // }
    render(){
        // console.log('marshal', this.props.marshal);
        // console.log('skills:--', this.props.skills);
        const marshal = this.props.marshal;
        const percent = (marshal.experience/marshal.nextLevel)*100;
        const style = { width: `${percent}%` };
        return (
            <div className="marshal-single">
            <h3>{marshal.rank} {marshal.name} {marshal.level}</h3>
                <div className="marshal-single-stats">
                    <p>Experience: {marshal.experience} / {marshal.nextLevel}</p> 
                    <div className="marshal-single-stats-bar">
                        <div style={style} className="marshal-single-stats-bar-progress"></div>
                    </div>
                </div>
                <div className="marshal-single-stats-skillpoints">Skill points: {this.props.marshal.skillPoints}</div>
                <MarshalSkills marshal={this.props.marshal} skills={this.props.skills} socket={this.props.socket} />
            </div>
        );
    }
}
