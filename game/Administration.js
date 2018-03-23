const administration = require('./buildings/administration_buildings');

module.exports = class Administration {
    constructor(){
        this.buildings = administration;
    }
};