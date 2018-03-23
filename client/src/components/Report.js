import React, { Component } from 'react';
import utils from './../utils';

class Report extends Component {
    renderFlatObj(name, obj){
        return Object.keys(obj).map((item, i) => {
            return <div key={i}>{item}: {this.props.report[name][item]}</div>;
        });
    }
    renderHeader(pr){
        if(this.props.report[pr]){
            return (
                <div>
                     <h4>Looted:</h4>
                    <div>{this.renderFlatObj('looted', this.props.report.looted)}</div>
                </div>
            );
        }
    }
    renderEnemies(){
        if(this.props.report.enemyArmy){

        }
    }
    renderTroopsLost(){
        if(this.props.report.troops){
            return (
                <div>
                    <h4>Troops lost:</h4>
                    {this.renderFlatObj('troops', this.props.report.troops)}
                </div>
            );
        }
    }
    renderReport(){//tabIndex="0" onKeyDown={this.handleKey}
        if(this.props.report.type === 'attacked'){
            return (
                <div onClick={this.props.closeModal}>
                    <div className="reports__modal__close" onClick={this.props.closeModal}>&times;</div>
                    <h3>You have been attacked by <span className="reports__modal__user">{this.props.report.user}</span></h3>
                    <p>Date: {utils.dateHMS(this.props.report.time)}</p>
                    {this.renderHeader('looted')}
                    <h4>Enemy army:</h4>
                    <div>{this.renderFlatObj('enemyArmy', this.props.report.enemyArmy)}</div>
                    {this.renderTroopsLost()}
                </div>
            );
        } else if(this.props.report.type === 'failure'){
            return (
                <div onClick={this.props.closeModal}>
                    <div className="reports__modal__close" onClick={this.props.closeModal}>&times;</div>
                    <h3>You have been defeated by <span className="reports__modal__user">{this.props.report.user}</span></h3>
                    <p>Your puny army has been wiped out.</p>
                    <p>Date: {utils.dateHMS(this.props.report.time)}</p>
                    <h4>Troops lost:</h4>
                    {this.renderFlatObj('troops', this.props.report.troops)}
                    {/* <div>{this.renderFlatObj('enemyArmy', this.props.report.enemyArmy)}</div> */}
                </div>
            );
        } else if(this.props.report.type === 'success'){
            // console.log('army', this.props.report.enemyArmy);
            return (
                <div onClick={this.props.closeModal}>
                    <div className="reports__modal__close" onClick={this.props.closeModal}>&times;</div>
                    <h3>You have defeated <span className="reports__modal__user">{this.props.report.user} GG WP NO RE</span></h3>
                    <p>Date: {utils.dateHMS(this.props.report.time)}</p>
                    <h4>Looted:</h4>
                    <div>{this.renderFlatObj('looted', this.props.report.looted)}</div>
                    <h4>Enemy army:</h4>
                    <div>{this.renderFlatObj('enemyArmy', this.props.report.enemyArmy)}</div>
                    <h4>Troops lost:</h4>
                    <div>{this.renderFlatObj('troops', this.props.report.troops)}</div>
                    <h4>Troops sent:</h4>
                    <div>{this.renderFlatObj('troopsSent', this.props.report.troopsSent)}</div>
                </div>
            );
        } else if(this.props.report.type === 'defence'){
            return (
                <div onClick={this.props.closeModal}>
                    <div className="reports__modal__close" onClick={this.props.closeModal}>&times;</div>
                    <h3>You have been attacked by <span className="reports__modal__user">{this.props.report.user}</span></h3>
                    <p>You have defended your kingdom, all enemy troops have been slaughtered.</p>
                    <p>Date: {utils.dateHMS(this.props.report.time)}</p>
                    <h4>Enemy army:</h4>
                    <div>{this.renderFlatObj('enemyArmy', this.props.report.enemyArmy)}</div>
                    <h4>Troops lost:</h4>
                    <div>{this.renderFlatObj('troops', this.props.report.troops)}</div>
                </div>
            );
        } else if(this.props.report.type === 'pillage'){
            return (
                <div onClick={this.props.closeModal}>
                    <div className="reports__modal__close" onClick={this.props.closeModal}>&times;</div>
                    <h3>You have defeated <span className="reports__modal__user">{this.props.report.user}</span></h3>
                    <p>You found no enemies on your way and were free to pillage.</p>
                    <p>Date: {utils.dateHMS(this.props.report.time)}</p>
                    <h4>Looted:</h4>
                    <div>{this.renderFlatObj('looted', this.props.report.looted)}</div>
                    <h4>Troops sent:</h4>
                    <div>{this.renderFlatObj('troops', this.props.report.troops)}</div>
                </div>
            );
        }
    }
    render(){
        // console.log('report:', this.props.report);
        return (
            <div className="reports__modal">
                {this.renderReport()}
            </div>
        );
    }
}

export default Report;