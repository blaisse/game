const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

const utils = require('./../game/utils');

const { Schema } = mongoose;
const units = require('../game/units');
const resource_buildings = require('../game/buildings/resource_buildings');
const administration = require('../game/buildings/administration_buildings');
const military = require('../game/buildings/military_buildings');
const research = require('../game/buildings/research_buildings');
const marshalCost = require('./../game/military/cost_marshal');

const userSchema = new Schema({
    username: {
        type: String,
        unique: true,
    },
    password: String,
    map: String,
    tiles: { type: Schema.Types.Mixed, default: {} },
    reports: [],
    newReport: { type: Boolean, default: false },
    units: [{ unit: String, amount: Number }],
    // buildings: [{ building: String, level: Number, type: String, upgradable: Boolean }],
    buildings: { type: Array, default: [{ building: 'chancery', type: 'administration', level: 1, upgradable: true }] },
    buildable: { type: Array, default: [
        // { building: 'granary', type: 'resource' },
        { building: 'wheat_farm', type: 'resource', level: 1 },
        { building: 'lumbermill', type: 'resource', level: 1 },
        { building: 'pasture', type: 'resource', level: 1 },
        { building: 'quarry', type: 'resource', level: 1 },
        { building: 'silver_mine', type: 'resource', level: 1 },
        { building: 'barracks', type: 'military', level: 1 },
        // { building: 'forge', type: 'research', level: 1 }
    ]},
    upgradable: {
        type: Array, default: [{ building: 'chancery', type: 'administration', level: 2, upgradable: true }]
    },
    hireable: { type: Array, default: "peasant" },
    technologies: {
        military: [String],
        economy: [String]
    },
    marshals: { type: Array },
    research: { type: Array },//researched by the user, name research for easier access in Research.js
    researchable: { type: Array },
    queue: { type: Array },
    queueBuildings: [],
    queueUnits: { type: Array },
    resources: {
        gold: { type: Number, default: 10000 },
        wood: { type: Number, default: 10000 },
        food: { type: Number, default: 10000 },
        iron: { type: Number, default: 10000 },
        stone: { type: Number, default: 10000 },
        silver: { type: Number, default: 5000 } 
    },
    income: {//per per x mins
        gold: { type: Number, default: 2 },
        wood: { type: Number, default: 2 },
        food: { type: Number, default: 2 },
        iron: { type: Number, default: 2 },
        stone: { type: Number, default: 2 },
        silver: { type: Number, default: 2 } 
    }
}, { minimize: false });

userSchema.methods.addResources = function(resources){
    Object.keys(resources).forEach((res) => {
        this.resources[res] += resources[res];
    });
    // console.log('HUH?', this.resources);
}

userSchema.methods.subtractResources = function(ordered, type, level, amount){
    //resources is an object: gold, wood, food etc.
    if(!amount) amount = 1;
    const cost = utils.getCost(ordered, type, level);
    Object.keys(cost).forEach((res) => {
        this.resources[res] -= cost[res] * amount;
        // console.log(res, this.resources[res]);
    });
    //make sure to save at the end when all changes are finished.
    // this.save();
};

userSchema.methods.checkResources = function(ordered, type, level, amount){
    console.log('ordered', ordered);
    const file = utils.getFile(type);
    let cost = {};
    let possible = true;
    if(type === 'tech' || type === 'marshal'){
        cost = file[ordered].cost;
    } else if(type !== 'units'){
        cost = file[ordered][level].cost;
    } else {
        //check whether it works
        cost = file[ordered].cost;
        // console.log('?', cost);
    } 
    if(!amount) amount = 1;
    Object.keys(cost).forEach((res) => {
        // console.log('WTF?', cost[res], amount);
        if(this.resources[res] < cost[res] * amount){
            // console.log('not enough of ', res);
            possible = false;
        }
    });
    return possible;
}

userSchema.methods.checkUpgradable = function(building, type){

};

function assignBuildings(item, upgradable){
    let type = "";
    let file = "";

    if(item.type === 'resource'){
        type = 'resource';
        file = resource_buildings;
    } else if(item.type === 'administration'){
        type = 'administration';
        file = administration;
    } else if(item.type === 'military'){
        type = 'military';
        file = military;
    } else if(item.type === 'research'){
        type = 'research';
        file = research;
    }
    // console.log('NEED HELP', item.level);
    //include duration?
    if(!upgradable[type]){
        upgradable[type] = [];
        upgradable[type].push({ building: item.building, type: item.type, levels: file[item.building], level: item.level });
    } else {
        upgradable[type].push({ building: item.building, type: item.type, levels: file[item.building], level: item.level });
        // upgradable[type].push({ [item.building]: file[item.building] });
    }
}

userSchema.methods.getBuildings = function(kind){
    let upgradable = {};
    let buildings;
    if(kind === 'buildable'){
        buildings = this.buildable;
    } else if(kind === 'upgradable'){
        // buildings = this.buildings;
        buildings = this.upgradable;
    } else if(kind === 'built'){
        buildings = this.buildings;
    }
    buildings.forEach((item) => {
        // if(kind === 'upgradable'){//&& item.upgradable
            // item.level++;
            assignBuildings(item, upgradable);
        // } else if(kind === 'buildable'){
            // assignBuildings(item, upgradable);
        // }
    });
    // console.log('upupupu', upgradable);
    return upgradable;
}

userSchema.methods.totalArmyNumber = function(){
   return this.units.reduce((a, b) => {
        return a.amount + b.amount;
   });
};

userSchema.methods.updateIncome = function(income, upkeep){
    // console.log('upkeep', upkeep);
    //upkeep - Boolean
    //income - Object with income/upkeep
    Object.keys(income).forEach((res) => {
        if(upkeep){
            this.income[res] -= income[res];
        } else {
            this.income[res] += income[res];
        }
    });
    // this.income[resource] += amount;
};

// userSchema.methods.updateIncome

userSchema.methods.calculateBuildingsIncome = function(){
    let income = {};
    //loop over each possible building and check whether current user has built it
    Object.keys(resource_buildings).forEach((building) => {
        const x = this.buildings.filter((item) => {
            return item.building === building;
        });
        //if currect user has the building, carry on
        if(x.length !== 0){
            //income of the building, pasture - food, gold, iron..
            const buildingIncome = resource_buildings[building][x[0].level].income;
            //loop over each resource currect building produces
            Object.keys(buildingIncome).forEach((item) => {
                //make final object that sums up resources income from all the buildings
                if(!income[item]){
                    income[item] = buildingIncome[item];
                } else {
                    //property - wood - exists, add to existing value
                    let old = income[item];
                    old += buildingIncome[item];
                    income[item] = old;
                    // console.log('old', old, building, buildingIncome[item]);
                }
            });
        }
    });
    return income;
}

userSchema.methods.calculateArmyUpkeep = function(){
    //return an object with total amount of each resource needed to be paid for upkeep
    //of the army
    let cost = {};
    this.units.forEach((item) => {
        const unitUpkeep = units[item.unit].upkeep; //food, gold
        const amount = item.amount;
        cost[item.unit] = {};
        Object.keys(unitUpkeep).forEach((res) => {
            cost[item.unit][res] = amount * unitUpkeep[res];
        });
    });
    //now cost has every unit with total upkeep of each resource
    let total = {};
    Object.keys(cost).forEach((un) => {
        Object.keys(cost[un]).forEach((r) => {
            if(total[r]){
                total[r] = total[r] + cost[un][r];
            } else {
                total[r] = cost[un][r];
            }
        });
    }); 
    return total;
}

userSchema.pre('save', function(next){
    // console.log('user email schema: ', this.email);
    //check whether it's a new user or .save() - it would call .pre() again
    //and change hash
    modelClass.findOne({ username: this.username }).then((found) => {
        if(!found){
            const user = this;
            bcrypt.genSalt(10, function(err, salt){
                if(err) return next(err);
                bcrypt.hash(user.password, salt, null, function(err, hash){
                    if(err) return next(err);
                    user.password = hash;
                    next();
                });
            });
        } else {
            next();
        }
    });
});//$2a$10$31S8bHO6oQ5cRVCe5b7Pk.Jq8w8qPKGJS/S9DbUzlLekwE8v5T5Na
userSchema.methods.comparePasswords = function(inputPassword, callback){
    // console.log(inputPassword, this.password);
    bcrypt.compare(inputPassword, this.password, function(err, isMatch){
        // console.log(isMatch);
        if(err){
            // console.log('err?');
            return callback(err);//+r
        }
        // console.log('matching?', isMatch);//FALSE?
        callback(null, isMatch);
    });
}

const modelClass = mongoose.model('users', userSchema);