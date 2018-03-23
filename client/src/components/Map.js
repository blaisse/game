import React, { Component } from 'react';
import { connect } from 'react-redux';

import * as actions from './../actions/user';

import MapTile from './MapTile';

class GameMap extends Component {
    constructor(props){
        super(props);
        this.state = { tile: {} };
    }
    componentWillMount(){
        this.props.fetch_map();
    }
    componentDidMount(){
        // this.getUserTile();  
    }
    renderColumn(startingPoint){
        //display size - 3 - elements from startingPoint onwards
        for(let i=startingPoint; i<startingPoint+3; i++){
            return Object.keys(this.props.map).map((tile, i) => {
                return (
                    <div key={i}>X</div>
                );
            });
        }
    }
    getUserTile(){
        if(this.props.map.length !== 0){
            // console.log('hgelp?', Object.keys(this.props.map));
            const tile = this.props.map.filter((t) => {
                // console.log('?T', t);
                return t.username === localStorage.getItem('username');
            });
            // console.log('hu', tile);
            this.setState({ tile: tile[0] });
        }
    }
    renderMap(){
        if(this.props.map){
            const gameMap = this.props.map;
            // const size = 3;
            return gameMap.map((column, i) => {
                return (
                    <div key={i} className="map__row">
                        {
                            gameMap[i].map((tile, j) => {
                                // return <div key={j} className="map__tile">{tile.x}-{tile.y}</div>;
                                return <MapTile key={j} tile={tile} />;
                            })
                        }
                    </div>
                );
            });
            // return gameMap.map((column) => {
            //     return gameMap.map((row) => {
            //         return (
            //             <div>{row.x}</div>
            //         );
            //     });
            // });
        }
    }
    render(){
        // console.log('map', this.props.map);
        return (
            <div className="map">
            <div className="map__map">{this.renderMap()}</div>
            </div>
        );
    }
}

function mapStateToProps(state){
    return {
        map: state.map
    };
}

export default connect(mapStateToProps, actions)(GameMap);