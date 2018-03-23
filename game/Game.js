const Military = require('./Military');
const Research = require('./Research');
const Administration = require('./Administration');
const Map = require('./Map');
// console.log('military', Military.display());
module.exports = class Game {
    constructor(){
        this.military = new Military();
        this.research = new Research();//type: research
        this.administration = new Administration();
        this.map = new Map();
        // this.researchable = this.research
        // this.resources = new Resources();
    }
    getUserBuilding(user, type, building, level){
        //user[type] -> user.buildings, type is taken off of requirement property
        // console.log('get user building', type, building, level);
        return user[type].filter((singleBuilding) => {
            //required level <= level in user db
            return building === singleBuilding.building && level <= singleBuilding.level;
        }).length;
    }
    getUserResearch(user, research){
        //type = research
        return user['research'].filter((re) => {
            return re === research;
        }).length;
    }
    tryUnlockUnit(user, research){
        let flag = false;
        const res = this.research.tech[research];
        const filtered = res.allows.filter((r) => {
            return r.type === 'unit';
        });
        //filtered - all the units that this research allows to hire, or is a part of a few that allows it
        if(filtered.length > 0){
            filtered.forEach((req) => {
                let count = 0;
                const unit = this.military.units[req.unit];
                unit.requirement.forEach((unitReq) => {
                    if(this.getUserResearch(user, unitReq.requirement) > 0){
                        count++;
                    }  
                });
                //if all requirements are met push one unit
                if(count === unit.requirement.length){
                    user.hireable.push(req.unit);
                    flag = true;
                }
                  
            });
        }
        return flag;
    }
    tryUnlockResearch(user, research){//unit
        const res = this.research.tech[research];//the one just researched
        // console.log('res', res);
        const filtered = res.allows.filter((r) => {
            return r.type === 'research';//unit
        });
        // console.log('fff', filtered);
        //filtered[0] has type: research, unit: long swords
        filtered.forEach((r) => {
            const update = this.research.tech[r.unit];//unit
            let count = 0;
            update.requirement.forEach((req) => {
                if(req.type === 'buildings'){
                    if(this.getUserBuilding(user, req.type, req.requirement, req.level) > 0){
                        count++;
                    }
                }
                
                if(req.type === 'research'){
                    if(this.getUserResearch(user, req.requirement) > 0){
                        count++;
                    }
                }
            });
            if(count === update.requirement.length){
                user.researchable.push(r.unit);
            }

        });

    }
    tryUnlockBuildings(user, type, building, level){
        //all the required buildings need to have 'allows' specified
        const build = this[type].buildings[building][level];
        if(build.allows){
            build.allows.forEach((item) => {
                // console.log('WTF?', item);
                if(item.type !== 'researchable'){
                    let count = 0;
                    const b = this[item.type].buildings[item.allow][item.level];
                    // console.log('b', b);
                    b.requirement.forEach((req) => {
                        const ar = user[req.type].filter((singleBuilding) => {
                            return req.building === singleBuilding.building && req.level <= singleBuilding.level;
                        });
                        if(ar.length > 0){
                            count++;
                        }
                    });
                    // console.log('c', count);
                    if(count === b.requirement.length){
                        //it's pushing to buildable, if i decide to unlock separate building levels i will need to be changed
                        user.buildable.push({ building: item.allow, type: item.type, level: item.level });
                    } else {
                        // console.log('cant build yet lol');
                    }

                } else if(item.type === 'researchable') {
                    // console.log('researchable gogo');
                    // this.tryUnlockResearch(user, req.);
                    let count = 0;
                    const b = this.research.tech[item.allow];
                    // console.log('BBBB', b);
                    b.requirement.forEach((req) => {
                        // console.log('LENGTH', this.getUserBuilding(user, req.type, req.building, req.level));
                        if(req.type === 'buildings'){
                            if(this.getUserBuilding(user, req.type, req.requirement, req.level) > 0){
                                count++;
                            }
                        }
                        
                        if(req.type === 'research'){
                            if(this.getUserResearch(user, req.requirement) > 0){
                                count++;
                            }
                        }
                    });
                    if(count === b.requirement.length){
                        user.researchable.push(item.allow);
                    }
                }
            });
            // console.log(this[build.allows.type].buildings[build.allows.allow][build.allows.level]);
        }
    }
    getIncome(file){
        console.log('getting income', file);
    }
    checkResearch(){
        //make a methods that get data from all sub objets?
    }
}


