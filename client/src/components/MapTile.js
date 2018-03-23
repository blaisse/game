import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class MapTile extends Component {
    constructor(props){
        super(props);
        this.state = { open: false };
        this.user = localStorage.getItem('username');
    }
    displayUser(){
        if(this.props.tile.username){
            return <span>{this.props.tile.username}</span>;
        }
    }
    handleClick(){
        if(this.props.tile.username){
            // console.log(this.props.tile.username);
            if(this.state.open){
                this.setState({ open: false });
            } else {
                this.setState({ open: true });
            }
            
        }
    }
    renderMenu(){
        if(this.props.tile.username !== this.user){
            //clicked user is not me
            const tile = this.props.tile;
            return <p><Link to={`/attack/${tile.username}/${tile.x}/${tile.y}`}>Attack this noob</Link></p>;
        } else {
            return <p>This is your empire! Or a village by the looks of it..</p>;
        }
    }
    renderMenuContainer(){
        if(this.state.open){
            return (
                <div className="map__tile__menu">
                    <p>{this.props.tile.username}</p>
                    <p>Field: {this.props.tile.x}:{this.props.tile.y}</p>
                    {this.renderMenu()}
                </div>
            );
        }
    }
    renderName(){
        if(this.props.tile && this.props.tile.username){
            return <div className="map__tile__front-user">{this.props.tile.username}</div>;
        }
    }
    renderClass(){
        if(this.props.tile.username === this.user){
            return "map__tile__me";
        }
        if(this.props.tile.username){
            return "map__tile__username";
        }
        return "";
    }
    render(){
        return (
            <div onClick={this.handleClick.bind(this)}//+(this.props.tile.username ? "map__tile__username" : "")
                 className={"map__tile " + this.renderClass()}>
                {this.renderMenuContainer()}
                {this.renderName()}
            </div>
        );
    }
}

export default MapTile;