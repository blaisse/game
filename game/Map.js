require('./../models/Map');
const mongoose = require('mongoose');
const Maps = mongoose.model('maps');

module.exports = class Map {
    constructor(){

    }
    changeTileToTaken(map, username){
        //field -> taken
        const freeTiles = this.getFreeTiles(map.map);
        const random = Math.floor(Math.random() * freeTiles.length);
        const tile = freeTiles[random];
        const str = `${tile.x}-${tile.y}`;
        // console.log('striong', str);
        // console.log('map?', map.map[str]);
        map.map[str].taken = true;
        map.map[str].username = username;
        // console.log('updated map', map.map);
        // freeTiles[random].taken = true;
        // freeTiles[random].user = username;
        return {str, x: tile.x, y: tile.y};
        
    }
    getFreeTiles(map){
        let tiles = [];
        Object.keys(map).forEach((item) => {
          if(!map[item].taken){
            tiles.push(map[item]);
          }
        }); 
        return tiles;
    }
    mapToArray(map, n){
        let ar = [];
        let finalArray = [];
        Object.keys(map.map).forEach((tile) => {
            ar.push(map.map[tile]);
        });
        // console.log('hm', ar);
        for(let i=0; i<n;i++){//iterate 3 times - 3 columns
            const filtered = ar.filter((tile) => {
                // console.log('wtF?', map, tile);
                return tile.x === i;
            });
            // console.log('f', filtered);
            finalArray.push(filtered);
        }
        return finalArray;
    }
    generateMap(n, name){
        let map = {};
        //add coords as property
        for(let column=0; column<n; column++){
            for(let row=0; row<n; row++){
            map[`${column}-${row}`] = { taken: false, x: column, y: row };
            }
        }
        const m = new Maps({ size: n, map, name });
        m.save().then((ee) => {
            // console.log('?', ee);
        });
        return map;
    }
};