import React, { Component } from 'react';

import MarshalSingleSkill from './MarshalSingleSkill';

export default class MarshalSkills extends Component {
    // constructor(props){
    //     super(props);
    // }
    renderSkills(){
        const skills = this.props.skills;
        //marshal has no skills, render all skills
        if(this.props.marshal.skills.length === 0 || this.props.marshal.skills.length !== 0){
            return Object.keys(skills).map((skill, i) => {
                const marshalSkill = this.props.marshal.skills.filter((skillOne) => {
                    return skillOne.name === skill;
                });
                let allowClick = false;
                if(marshalSkill.length !== 0 && marshalSkill[0].level !== Object.keys(skills[skill].levels).length){
                    allowClick = true;
                } else {
                    const neededLevel = skills[skill].requirements.level;
                    if(this.props.marshal.level >= neededLevel && marshalSkill.length === 0) allowClick = true;
                    if(marshalSkill.length !== 0 && marshalSkill[0].level !== Object.keys(skills[skill].levels).length) allowClick = false;
                }
                return <MarshalSingleSkill allowClick={allowClick} skills={this.props.skills} socket={this.props.socket} key={i} skillName={skill} skill={skills[skill]} marshal={this.props.marshal} />;
            });
        }
    }
    render(){
        return (
            <div>{this.renderSkills()}</div>
        );
    }
}