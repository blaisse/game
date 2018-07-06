const express = require('express');
const socketIO = require('socket.io');
const http = require('http');
const events = require('events');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const eventEmitter = new events.EventEmitter();

const keys = require('./config/keys');
const units = require('./game/units');
const tech = require('./game/technologies');

require('./models/Map');
const utils = require('./game/utils');
const Game = require('./game/Game');
const game = new Game();

const resource_buildings = require('./game/buildings/resource_buildings');
const administration = require('./game/buildings/administration_buildings');

mongoose.connect(keys.mongoURI);
require('./models/User');

const User = mongoose.model('users');
const Map = mongoose.model('maps');
game.map.generateMap(4, 'first');
const app = express();
app.use(bodyParser.json());
const server = http.createServer(app);
let io = socketIO(server);

require('./game/interval_resources')(io); 

//sort queue by time when should be completed
let queue = [];
let amount = null;
let item = {};
let user = "";
let usersQueue = {};

setInterval(() => {
    let x = [];
    //get first item from each building a user has
    if(Object.keys(usersQueue).length > 0){
        Object.keys(usersQueue).forEach((item) => {
            //item = russia
            // x.push(usersQueue[item][0]);
            Object.keys(usersQueue[item]).forEach((building) => {
                //barracks, stable, chancery..
                x.push(usersQueue[item][building][0]);
            });
        });
        //sort by the time completed
        x.sort((a, b) => {
            return a.completed - b.completed;
        });
        let first = x[0];
        if(first && usersQueue[first.user][first.building].length !== 0){
            const time = new Date().getTime();
            if(time >= first.completed){
                usersQueue[first.user][first.building].shift();
                if(usersQueue[first.user][first.building].length === 0){
                    delete usersQueue[first.user][first.building];
                    // if(Object.keys(usersQueue[first.user].length === 0)){
                    if(Object.keys(usersQueue[first.user]).length === 0){
                        // console.log('length?', Object.keys(usersQueue[first.user].length));
                        delete usersQueue[first.user];
                    }
                }
                eventEmitter.emit('notifyHired', first);
            }
        }
    }
}, 100);

function getFile(type){
    let file;
    //type - resource
    if(type === 'resource'){
        file = resource_buildings;
    } else if(type === 'administration'){
        file = administration;
    }
    return file;
}

const notifyHired = async (item) => {
    // console.log('research', item);
    if(item["construction"]){
        const file = utils.getFile(item.type);
        const user = await User.findOne({ username: item.user });
        if(user){
            //remove item from queueBuildings---
            let queueBuildings = user.queueBuildings.filter((huh) => {
                return huh.construction !== item.construction && huh.completed !== item.completed;
            });
            if(!queueBuildings) queueBuildings = [];
            user.queueBuildings = queueBuildings;

            const building = user['buildings'].filter((one) => {
                return one.building === item.construction;
            });
            // if(item.type === 'military'){
            //     console.log(game.military.checkUnit(user, item.construction, item.level));
            // }
            // game.research.research(user, 'iron swords');
            //if there is no such building
            if(building.length === 0){
                //Build
                let u = false;
                //USELESS?
                if(file[item.construction][2]){
                    u = true;
                }
                //GET FILE function.. check if upgradable after building level one.
                user['buildings'].push({ building: item.construction, type: item.type, level: 1, upgradable: u });
            } else {
                //Upgrade
                //building is higher than level 1
                //level is read from front, already increased by one.
                let lvl = item.level;
                // lvl++;
                //upgrade building only if this level exists
                //use item.type to get the right file
                if(file[item.construction][lvl]){
                    // console.log('level:', lvl);
                    let old = user['buildings'].filter((o) => {
                        return o.building !== item.construction;
                    });
                    //if it's upgrading to level 2, now check whether level 2 can be upgraded further.. to 3.
                    let l = lvl;
                    l++;
                    let up = false;
                    if(file[item.construction][l]) up = true;
                    old.push({ building: item.construction, level: lvl, type: item.type, upgradable: up });
                    user['buildings'] = old;
                } else {
                    //don't save nor emit if the building cannot be upgraded
                    return;
                }
            }
            if(item.type !== 'resource'){
                // console.log('tpye3', item.type, item.construction, item.level);
                //resoruce building are not unlocking other buildings
                game.tryUnlockBuildings(user, item.type, item.construction, item.level);
            }
            // game.research.tryUnlockResearch(user, item.construction, item.level);

            if(item.type === 'resource'){
                const income = file[item.construction][item.level].income;
                user.updateIncome(income);
            }
            user.save().then((saved) => {
                // console.log('building finished', usersQueue);
                item.socket.emit('updateQueue');
                item.socket.emit('buildingCompleted', { construction: item.construction, completed: item.completed, type: item.type });
            });
            //comment out and move out of io connection?
            
        }            
    } else if(item.type === 'research'){
        const t = 'tech';
        const file = utils.getFile(t);
        const user = await User.findOne({ username: item.user });
        if(user){
            user.research.push(item.item);
            let queueBuildings = user.queueBuildings.filter((huh) => {
                return huh.construction !== item.construction && huh.completed !== item.completed;
            });
            if(!queueBuildings) queueBuildings = [];
            user.queueBuildings = queueBuildings;
            // game.tryUnlockBuildings(user, );    
            //try to unlock research if needed
            // console.log('R E S EA R C H');
            game.tryUnlockResearch(user, item.item);
            const unlockedUnit = game.tryUnlockUnit(user, item.item);
            //try to unlock units? buildings?
            const filtered = user.queue.filter((res) => {
                return res.item !== item.item;
            });   
            user.queue = filtered;
            user.save().then(() => {
                io.to(item.user).emit('updateQueue');
                io.to(item.user).emit('updateResearch');
                if(unlockedUnit){
                    io.to(item.user).emit('updateHireable');
                    
                }
                // item.socket.emit('updateResearch');
            });
            // console.log('item?', item);    
            //push to user.research
        }
    } else if(item.type === 'marshal'){
        console.log('masrshal hired--');

    } else {
    //UNITS - ARMY
    //save to db then notify
    // console.log('u', usersQueue);
    const user = await User.findOne({ username: item.user });
    if(user){
        const ar = user['units'].filter((u) => {
            return u.unit === item.unit;
        });
        //reduce income
        // console.log('type', item.type);
        const file = utils.getFile('units');
        const income = file[item.unit].upkeep;
        user.updateIncome(income, true);

        if(ar.length === 0){
            user["units"].push({ unit: item.unit, amount: 1 });
            user.save().then((qq) => {
                io.to(item.user).emit('hired', { unit: item.unit, completed: item.completed });
            });
        } else {
            let old = ar[0];
            old.amount++;
            const filtered = user["units"].filter((army) => {
                return army.unit !== item.unit;
            });
            filtered.push(old);
            user["units"] = filtered;
            user.save().then((he) => {
                io.to(item.user).emit('hired', { unit: item.unit, completed: item.completed });
                // item.socket.emit('hello', {'greet': 'hello', unit: item.unit});
            });
        }
    }
    
    }
};

eventEmitter.on('notifyHired', notifyHired);

// let notifyHired = () => { console.log('wilhelm ii') };
io.on('connection', (socket) => {
    socket.on('join', (user) => {
        socket.join(user);
    });
    //notifyHired gets called twice. WHY?
    //it didn't work because on each browser connection socket - io.on - duplicates event listener!
    socket.on('attack', async (units, attacking, attacked, x, y, selectedMarshal) => {
        // console.log('units-', units, attacking, attacked);  
        console.log('selectedMarshal', selectedMarshal);      
        const user = await User.findOne({ username: attacking });
        const userAttacked = await User.findOne({ username: attacked });
        if(userAttacked && user){
            const coord = `${x}-${y}`;
            if(userAttacked.tiles[coord]){
                //for now the attacking army comes from the capital
                const time = new Date().getTime();
                const attackPower = game.military.calculateAttack(units);
                //there are some units, fight.
                if(userAttacked.units.length !== 0){   
                    const defence = game.military.calculateDefence(userAttacked.units);
                    //defenders will win in same power
                    if(defence > attackPower){
                        //all attackers are dead
                        //calculate surviving defenders
                        game.military.killAttackingUnits(user.units, units);
                        const left = attackPower-defence;
                        const dead = game.military.calculateDead(attackPower, userAttacked.units, 'defence');
                        // console.log('dead', dead);
                        let lostTroops = {};
                        Object.keys(dead.alive).forEach((u) => {
                            lostTroops[u] = dead.alive[u];
                        });
                        // console.log('lost', lostTroops);
                        userAttacked.newReport = true;
                        userAttacked.reports.unshift({ 
                            id: new mongoose.Types.ObjectId,
                            message: `You have been attacked by ${user.username}`,
                            read: false,
                            type: 'defence',
                            outcome: 'Victory',
                            user: user.username,
                            enemyArmy: units,
                            troops: lostTroops,
                            time 
                        });
                        user.newReport = true;
                        user.reports.unshift({ 
                            id: new mongoose.Types.ObjectId,
                            message: `You have been defeated by ${userAttacked.username}`,
                            read: false,
                            type: 'failure',
                            outcome: 'Defeat',
                            user: userAttacked.username,
                            enemyArmy: null,
                            troops: units,
                            time 
                        });

                        userAttacked.markModified('units');
                        userAttacked.save().then(() => {
                            io.to(userAttacked.username).emit('attacked');
                            io.to(userAttacked.username).emit('newReport');
                            // io.to(userAttacked.username).emit('updateResources');;
                        });
                        // user.markModified('resources');
                        user.save().then(() => {
                            socket.emit('attacked');
                            socket.emit('newReport');
                            // socket.emit('updateResources');
                        });
                    } else if(attackPower > defence){
                        //attackers have more power
                        let enemy = {};
                        userAttacked.units.forEach((unit) => {
                            enemy[unit.unit]=unit.amount;
                        });
                        let enemyUnits = {};
                        Object.keys(units).forEach((u) => {
                            enemyUnits[u] = units[u];
                        });
                        // let troopsSent = {};
                        // Object.keys(units).forEach((u) => {
                        //     enemyUnits[u] = units[u];
                        // });
                        // const enemy = userAttacked.units;
                        const l = game.military.killDefendingUnits(userAttacked.units, 'everyone');
                        //calculate marshals xp
                        const xp = game.military.calculateXp(l);
                        const xpMarshal = game.military.marshal.addExperience(user, selectedMarshal, xp);
                        const left = attackPower-defence;
                        const dead = game.military.calculateDead(left, units, 'attack');
                        
                        game.military.killAttackingUnits(user.units, dead.army);

                        const loot = game.military.calculateLoot(dead.alive);
                        const looted = game.military.plunderResources(loot, userAttacked.resources);

                        userAttacked.newReport = true;
                        userAttacked.reports.unshift({ 
                            id: new mongoose.Types.ObjectId,
                            message: `You have been attacked by ${user.username}`,
                            read: false,
                            type: 'attacked',
                            outcome: 'Defeat',
                            looted,
                            user: user.username,
                            enemyArmy: enemyUnits,
                            troops: enemy,
                            time 
                        });
                        user.newReport = true;
                        user.reports.unshift({ 
                            id: new mongoose.Types.ObjectId,
                            message: `You have defeated ${userAttacked.username}`,
                            read: false,
                            type: 'success',
                            outcome: 'Victory',
                            user: userAttacked.username,
                            looted,
                            enemyArmy: enemy,
                            troopsSent: enemyUnits,
                            troops: dead.army,
                            time 
                        });
                        userAttacked.markModified('resources');
                        userAttacked.markModified('units');
                        userAttacked.save().then(() => {
                            io.to(userAttacked.username).emit('attacked');
                            io.to(userAttacked.username).emit('updateResources');
                            io.to(userAttacked.username).emit('newReport');
                        });
                        user.addResources(looted);
                        user.markModified('resources');
                        user.save().then(() => {
                            socket.emit('attacked');
                            socket.emit('updateResources');
                            socket.emit('newReport');
                        });
                    } else {
                        //same power, defender wins.
                        let enemy = {};
                        userAttacked.units.forEach((unit) => {
                            enemy[unit.unit]=unit.amount;
                        });
                        game.military.killAttackingUnits(user.units, units);
                        //change user.units to those in the city only
                        game.military.killDefendingUnits(userAttacked.units, 'everyone');
                        userAttacked.newReport = true;
                        userAttacked.reports.unshift({ 
                            id: new mongoose.Types.ObjectId,
                            message: `You have been attacked by ${user.username}`,
                            read: false,
                            type: 'attacked',
                            outcome: 'Victory',
                            user: user.username,
                            enemyArmy: units,
                            troops: enemy,
                            time 
                        });
                        user.newReport = true;
                        user.reports.unshift({ 
                            id: new mongoose.Types.ObjectId,
                            message: `You have been defeated by ${userAttacked.username}`,
                            read: false,
                            type: 'failure',
                            outcome: 'Defeat',
                            user: userAttacked.username,
                            troops: units,
                            time 
                        });
                        userAttacked.markModified('units');
                        userAttacked.save().then(() => {
                            io.to(userAttacked.username).emit('attacked');
                            io.to(userAttacked.username).emit('newReport');
                        });
                        user.save().then(() => {
                            socket.emit('attacked');
                            socket.emit('newReport');
                        });
                    }
                } else {
                    //empty place, no fight
                    const loot = game.military.calculateLoot(units);
                    const looted = game.military.plunderResources(loot, userAttacked.resources);
                    //add attack to DB?
                    userAttacked.newReport = true;
                    userAttacked.reports.unshift({ 
                        id: new mongoose.Types.ObjectId,
                        message: `You have been attacked by ${user.username}`,
                        read: false,
                        type: 'attacked',
                        outcome: 'Defeat',
                        user: user.username,
                        looted,
                        enemyArmy: units,
                        time 
                    });
                    user.newReport = true;
                    user.reports.unshift({ 
                        id: new mongoose.Types.ObjectId,
                        message: `You have defeated ${userAttacked.username}`,
                        read: false,
                        type: 'pillage',
                        outcome: 'Victory',
                        looted,
                        user: userAttacked.username,
                        troops: units,
                        time 
                    });
                    //make a report for the attacker
                    userAttacked.markModified('resources');
                    userAttacked.save().then(() => {
                        io.to(userAttacked.username).emit('attacked', {time});
                        io.to(userAttacked.username).emit('updateResources');
                        io.to(userAttacked.username).emit('newReport');
                    });
                    user.addResources(looted);
                    user.markModified('resources');
                    user.save().then(() => {
                        socket.emit('updateResources');
                        socket.emit('newReport');
                    });
                }
            } else {
                //perhaps emit an error to client
            }
      
        }
    });

    socket.on('build', async (construction) => {
        // console.log('constr', construction);
        const user = await User.findOne({ username: construction.user });
        if(user){
            // console.log('user found! -- check resources');
            //check resources
            const possible = user.checkResources(construction.construct, construction.type, construction.level);
            if(possible){
                //subtract resources
                const b = user['buildable'].filter((buildable) => {
                    return buildable.building !== construction.construct;
                });
                user['buildable'] = b;
                user.subtractResources(construction.construct, construction.type, construction.level);
                const file = utils.getFile(construction.type);
                const time = new Date().getTime();
                //this if is here so that it does not gets added to the queue
                let level = construction.level;
                // level++;
                if(file[construction.construct][level]){
                    if(usersQueue[construction.user] && usersQueue[construction.user][construction.building]){
                        //chancery is in use
                        const building = construction.building;
                        const construct = construction.construct;
                        //getting the last item in array - sorted by time completed
                        const last = usersQueue[construction.user][building][usersQueue[construction.user][building].length-1];
                        //calculate duration for a new item, add its duration to the duration of the last item in array
                        const duration = last.completed + file[construct][construction.level].duration;
                        usersQueue[construction.user][construction.building].push({
                            user: construction.user,
                            construction: construction.construct,
                            building: construction.building,
                            type: construction.type,
                            level: construction.level,
                            completed: duration,
                            socket
                        });
                        //REFACTOR OMFG ITS SO BAD ----------------------------------
                        //check whether it can be upgraded
                        let heh = level;
                        heh++;
                        const pos = file[construction.construct][heh] ? true : false;
                        //remove the old building from upgradable when clicked to upgrade it
                        let withoutOldBuilding = user.upgradable.filter((building) => {
                            return building.building !== construction.construct;
                        });
                        user.upgradable = withoutOldBuilding;
                        if(pos){
                            user.upgradable.push({ building: construction.construct, type: construction.type, level: heh });
                        }
                        //add to user's queue - timer?
                        user.queueBuildings.push({
                            construction: construction.construct, 
                            level: construction.level, 
                            completed: duration 
                        });
                        //probably move it outside
                        user.save().then(() => {
                            socket.emit('updateQueue');
                            socket.emit('updateBuildable');
                            socket.emit('updateUpgradable');
                            socket.emit('updateResources');
                        });

                    } else {
                        if(!usersQueue[construction.user]){
                            usersQueue[construction.user] = {};
                        }
                        usersQueue[construction.user][construction.building] = [];
                        const duration = time + file[construction.construct][construction.level].duration;
                        usersQueue[construction.user][construction.building].push({
                            user: construction.user,
                            construction: construction.construct,
                            building: construction.building,
                            type: construction.type,
                            level: construction.level,
                            completed: duration,
                            socket
                        });

                        //check whether it can be upgraded
                        let heh = level;
                        heh++;
                        const pos = file[construction.construct][heh] ? true : false;
                        //remove the old building from upgradable when clicked to upgrade it
                        let withoutOldBuilding = user.upgradable.filter((building) => {
                            return building.building !== construction.construct;
                        });
                        user.upgradable = withoutOldBuilding;
                        if(pos){
                            user.upgradable.push({ building: construction.construct, type: construction.type, level: heh });
                        }
                        //add to user's queue - timer?
                        // console.log('heelo?');
                        user.queueBuildings.push({
                             construction: construction.construct, 
                             level: construction.level, 
                             completed: duration 
                        });
                        // console.log('heelo?', user.queue);
                        // user.markModified('queueBuildings');
                        //probably move it outside
                        user.save().then(() => {
                            console.log('xD');
                            socket.emit('updateQueue');
                            socket.emit('updateBuildable');
                            socket.emit('updateUpgradable');
                            socket.emit('updateResources');
                        });
                    }   
                } else {
                    socket.emit('errorBuilding', { text: 'Cannot upgrade the building further!' });
                }
            } else {
                console.log('not enough resources..');
                socket.emit('errorBuilding', { text: 'Not enough resources.' });
            }
        }
        // console.log('construction level', construction.type);
        
        // console.log('queue', usersQueue);
    });

    function usersQueueAdd(socket, user, building, item, type){
        //TO DO: getFile -> tech?
        //item -> research - "iron swords"
        const time = new Date().getTime();
        let addDuration = 0;
        const file = utils.getFile(type);
        if(usersQueue[user.username] && usersQueue[user.username][building]){
            //building already has an order
            const last = usersQueue[user.username][building][usersQueue[user.username][building].length-1];
            addDuration = last.completed + file[item].duration;
        } else {
            //the user doesnt building anything at all right now
            if(!usersQueue[user.username]){
                usersQueue[user.username] = {};
            }
            usersQueue[user.username][building] = [];
            addDuration = time + file[item].duration;
        }
        user.queue.push({ item, completed: addDuration });
        usersQueue[user.username][building].push({
            user: user.username,
            type,
            building,
            item,
            completed: addDuration,
            socket
        });
        return addDuration;
        // console.log('research?', usersQueue);
    }

    socket.on('recruit', async (player) => {
        const amount = player.amount;
        const user = await User.findOne({ username: player.user });
        if(user){
            const possible = user.checkResources(player.unit, 'units', null, amount);
            if(possible){
                user.subtractResources(player.unit, 'units', null, amount);
                //read recruitment duration from a separate file
                const time = new Date().getTime();
                if(usersQueue[player.user] && usersQueue[player.user][player.building]){
                    const last = usersQueue[player.user][player.building][usersQueue[player.user][player.building].length-1];
                    //add duration to the first one, then push the new last one................
                    //    const newTime = last.completed + dur; 
                    for(let i=1; i<=player.amount; i++){
                        const singleRecruitTime = last.completed + i * units[player.unit].duration;
                        usersQueue[player.user][player.building].push(
                            { 
                                    user: player.user,
                                    unit: player.unit,
                                    building: player.building,
                                    completed: singleRecruitTime,
                                    socket
                            }
                        );
                    }
                } else {
                    if(!usersQueue[player.user]){
                        usersQueue[player.user] = {};
                    }
                    usersQueue[player.user][player.building] = [];

                    for(let i=1; i<=player.amount; i++){
                        const singleRecruitTime = time + i * units[player.unit].duration;//use time from a file
                        usersQueue[player.user][player.building].push(
                            { 
                                user: player.user, 
                                unit: player.unit,
                                building: player.building, 
                                completed: singleRecruitTime,
                                socket
                            });
                    }
                }
                user.save().then(() => {
                    socket.emit('updateResources');
                });
            } else {
                socket.emit('errorBuilding', { text: 'Not enough resources.' });
            }
        }

    });

    socket.on('research', async (front) => { 

        const user = await User.findOne({ username: front.user });
        if(user){
            const possible = user.checkResources(front.research, 'tech');

            if(possible){
                const duration = usersQueueAdd(socket, user, front.building, front.research, front.type);
                user.subtractResources(front.research, 'tech');
                
                const filtered = user.researchable.filter((r) => {
                    return front.research !== r;
                });
                user.researchable = filtered;

                user.queueBuildings.push({
                    construction: front.research, 
                    completed: duration 
                });

                user.save().then(() => {
                    socket.emit('updateQueue');
                    socket.emit('updateResearch');
                });
            }
        }
    });

    socket.on('marshal', async (username, name, building, type) => {
        //type => marshal, building => staff
        const user = await User.findOne({ username });
        if(user){
            const marshalCount = user.marshals.length;
            //allow to hire marshal based on chancery level?
            if(marshalCount >= 2){
                return socket.emit('errorMarshals', "You can't hire more marshals");
            }
            const possible = user.checkResources(marshalCount, type);
            if(possible){
                game.military.marshal.hire(user, name);
                user.subtractResources(marshalCount, type);
                const upkeep = game.military.marshal.getUpkeep(marshalCount);
                user.updateIncome(upkeep, true);
                // const duration = usersQueueAdd(socket, user, building, marshalCount, type);
                user.save().then(() => {
                    socket.emit('updateMarshals');
                    socket.emit('updateResources');
                });
            } else {
                socket.emit('marshalInsufficientResources');
            }
        }
    });

    socket.on('marshalSkillUp', async (username, marshal, skillName, skill, level) => {
        console.log('skipp up', level);
        const user = await User.findOne({ username });
        if(user){
            game.military.marshal.skillUp(user, marshal, skillName, level);

            user.markModified('skills');
            user.save().then(() => {
                socket.emit('updateMarshals');
            });
        }
    });
    
});

// eventEmitter.on('notifyHired', notifyHired);

require('./routes/authRoutes')(app);
require('./routes/purchaseRoutes')(app);
require('./routes/buildingRoutes')(app);
require('./routes/mapRoutes')(app);
require('./routes/militaryRoutes')(app);

if(process.env.NODE_ENV === 'production'){
    app.use(express.static('client/build'));

    //if route is not specified above in requires or app.use, send index.html
    const path = require('path');
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });
}

const PORT = process.env.PORT || 5002;
server.listen(PORT, () => {
    console.log('running');
});