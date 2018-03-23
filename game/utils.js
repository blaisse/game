const resource_buildings = require('./buildings/resource_buildings');
const administration = require('./buildings/administration_buildings');
const military = require('./buildings/military_buildings');
const research = require('./buildings/research_buildings');
const marshalCost = require('./military/cost_marshal');
const units = require('./units');
const tech = require('./technologies');

module.exports = {
    getFile: function(type){
        let file;
        //type - resource
        if(type === 'resource'){
            file = resource_buildings;
        } else if(type === 'administration'){
            file = administration;
        } else if(type === 'military'){
            file = military;
        } else if(type === 'research'){
            file = research;
        } else if(type === 'tech'){
            file = tech;
        } else if(type === 'units'){
            file = units;
        } else if(type === 'marshal'){
            file = marshalCost;
        }
        return file;
    },
    getCost: function(ordered, type, level){
        const file = this.getFile(type);
        let cost = {};
        if(type === 'tech' || type === 'marshal'){
            cost = file[ordered].cost;
        } else if(type !== 'units'){
            cost = file[ordered][level].cost;
        } else {
            //check whether it works
            cost = file[ordered].cost;
        } 
        return cost;
    },
    checkUpgradable: function(building, level, type){
        
    }
};