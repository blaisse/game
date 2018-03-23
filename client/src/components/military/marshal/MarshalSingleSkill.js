import React, { Component } from 'react';

export default class MarshalSingleSkill extends Component {
    constructor(props){
        super(props);
        this.state = { levelNeededMatched: false, displayError: false };

        this.handleClick = this.handleClick.bind(this);
    }
    renderRequirements(){
        
    }
    handleClick(){
        //username, marshalName, skillName
        if(this.props.allowClick && this.props.marshal.skillPoints > 0){
            let level = this.props.marshal.skills.filter((skill) => {
                return skill.name === this.props.skillName;
            });
            if(level.length !== 0){
                level = level[0].level;
            } else {
                level = 1;
            }            
            const marshal = this.props.marshal;
            this.props.socket.emit('marshalSkillUp',
                localStorage.getItem('username'),
                marshal,
                this.props.skillName,
                this.props.skill,
                level
            );
        } else {
            if(this.props.allowClick){
                this.setState({ displayError: true });
            }
        }
        if(this.state.displayError) this.setState({ displayError: false });
    }
    renderSkill(){
        const marshalSkill = this.props.marshal.skills.filter((skill) => {
            return skill.name === this.props.skillName;
        });
        if(marshalSkill.length !== 0){
            // console.log('wtf?', marshalSkill);
            const lastLevel = Object.keys(this.props.skills[this.props.skillName].levels).length;//
            // console.log('pls',lastLevel, this.props.skillName, this.props.skills);
            //display marshal skill
            return <div>{marshalSkill[0].name}: {marshalSkill[0].level} / {lastLevel}</div>;
        } else {
            return this.checkPossibility();
        }
    }
    checkPossibility(){ 
        const neededLevel = this.props.skill.requirements.level;
        if(this.props.marshal.level >= neededLevel){
            // console.log('huh?222');
            // this.setState({ levelNeededMatched: true });
            return <div>Requires: <span className=" marshal-single-skill-possible">level: {neededLevel}</span></div>;
        } else {
            // console.log('hey?122');
            return <div>Requires: <span className=" marshal-single-skill-impossible">level: {neededLevel}</span></div>;
        }
      
    }
    renderLevel(){
        if(this.props.marshal.skills.length !== 0){
            const learntSkill = this.props.marshal.skills.filter(skill => {
                return skill.name === this.props.skillName;
            });
            if(learntSkill.length !== 0){
                return learntSkill[0].level;
            } else return "";
           
        } else {
            return "";
        }
    }
    renderContentOrError(){
        if(!this.state.displayError){
            return (
                <div>
                    <h4>{this.props.skillName} </h4>
                    {this.renderSkill()}
                </div>
            );
        } else {
            return <div className="marshal-single-skill-box-error">Not enough skillpoints! Click again</div>;
        }
    }
    render(){
        // console.log('marshal-san', this.props.marshal);
        // console.log('skillName', this.props.skillName, this.props.skill);
        return (//{this.renderLevel()}
            <div className="marshal-single-skill-box" onClick={this.handleClick}>
                {this.renderContentOrError()}
            </div>
        );
    }
}