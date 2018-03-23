const buildings = require('./buildings/military_buildings');
const Marshal = require('./military/Marshal');
const units = require('./units');

module.exports = class Military {
    constructor(){
        this.buildings = buildings;
        this.marshal = new Marshal();
        this.units = units;
    }
    calculateXp(enemy){
        let xp = 0;
        enemy.forEach((unit) => {
            const unitXp = units[unit.unit].experience;
            xp += unit.amount * unitXp;
        });
        return xp;
    }
    calculateDead(left, army, type){
        //type => attack/defence
        const alive = {};
        // console.log('left:', left);
        // console.log('army', army);
        let x = true;
        // let y = true;
        let count = 0;
        let c = {};
        while(x){
            if(type === 'defence'){
                console.log('army', army);
                // x = false;
                army.forEach((unit) => {
                    if(left === 0 || Object.keys(c).length === army.length){
                        x = false;
                    }
                    if(left >= units[unit.unit][type] && unit.amount !== 0 && !c[unit.unit]){
                        console.log('left', left, unit.unit);
                        left -= units[unit.unit][type];
                        // console.log('left2', left);
                        unit.amount--;
                        if(!alive[unit.unit]){
                            alive[unit.unit] = 1;
                        } else {
                            alive[unit.unit]++;
                        }
                    } else {
                        c[unit.unit] = true;
                    }
                });
            } else {
                Object.keys(army).forEach((unit) => {//count === Object.keys(army).length
                    if(left === 0 || Object.keys(c).length === Object.keys(army).length){
                        x = false;
                    }
                    if(left >= units[unit][type] && army[unit] !== 0 && !c[unit]){
                        left -= units[unit][type];
                        army[unit]--;
                        if(!alive[unit]){
                            alive[unit] = 1;
                        } else {
                            alive[unit]++;
                        }
                    } else {
                        c[unit] = true;
                    }
                });
            }
        }
        // console.log('DEAD TO DEATH', dead);
        console.log('army2', army);
        
        return {army,alive};
    }
    killDefendingUnits(totalArmy, lostUnits){
        if(lostUnits === 'everyone'){
            const lost = JSON.parse(JSON.stringify(totalArmy));
            totalArmy.length = 0;
            return lost;
            // totalArmy = new Array();
        } else {

        }
        
        // let ar = totalArmy.length;
        // // ar.forEach((totalUnit) => {
        //     for(let i=0;i<ar;i++){
        //         console.log('ararrrrrr', ar, i);
        //         lostUnits.forEach((lostUnit) => {
        //             console.log('xd?', totalArmy[i]);
        //             if(totalArmy[i].amount === lostUnit.amount){
        //                 // ar = ar.filter((u) => {
        //                 //     return u.unit !== lostUnit.unit;
        //                 // });
        //                 const j = totalArmy.indexOf(totalArmy[i]);
        //                 // console.log(j);
        //                 totalArmy.splice(j, 1);
        //                 // ar = x;
        //                 // console.log('WTF?', ar);
        //             }
        //         });
        //     }
         
        // });
        // console.log('ar', ar);
        // totalArmy = ar;
    }
    killAttackingUnits(totalArmy, unitsAttacking){
        // console.log('totalArmy', totalArmy);
        // console.log('units', unitsAttacking);
        totalArmy.forEach((totalUnit) => {
            if(unitsAttacking[totalUnit.unit]){
                // console.log('found!', totalUnit.unit);
                totalUnit.amount -= unitsAttacking[totalUnit.unit];
            }
        });
        totalArmy.forEach((unit) => {
            if(unit.amount === 0){
                console.log('ZERO DELTE!');
            }
        });
    }
    plunderResources(loot, resources){
        resources = resources.toJSON();
        let lootedResources = {};
        let notEnough = {};
        const len = Object.keys(resources).length;
        const eachResources = Math.floor(loot/len);
        // console.log('e', eachResources);
        const left = eachResources*len;
        let additional = loot-left;
        let looted = 0;
        Object.keys(resources).forEach((res) => {
          if(resources[res] >= eachResources && !notEnough[res]){
            resources[res] -= eachResources;
            lootedResources[res] = eachResources;
            looted += eachResources;
          } else {
            notEnough[res] = eachResources - resources[res];
            looted += resources[res];
            lootedResources[res] = resources[res];
            resources[res] = 0;
          }
        });
        
        if(Object.keys(notEnough).length !== 0){
          let total = 0;
          Object.keys(notEnough).forEach((item) => {
            total += notEnough[item];
          });
          // console.log('total', total);
          
          Object.keys(resources).forEach((res) => {
            if(resources[res] >= total && !notEnough[res]){
              resources[res] -= total;
              looted += total;
              lootedResources[res] += total;
              total = 0;
              return;
            } else {
              total = total - resources[res];
              looted += resources[res];
              lootedResources[res] += resources[res];
              resources[res] = 0;
            }
          });
          if(total === 0){
            //can still remove additional
            // console.log('total is zero', additional);
            Object.keys(resources).forEach((res) => {
              if(resources[res] >= additional){
                resources[res] -= additional;
                lootedResources[res] += additional;
                looted += additional;
                additional = 0;
                return;
              } else {
                additional = additional - resources[res];
                lootedResources[res] += resources[res];
                looted += resources[res];
                resources[res] = 0;
              }
            });
            // console.log('additional wwww', additional);
          }
          // console.log('TOTAL', total);
          // console.log('LOOTED', looted);
        } else {
          //remove additional and it's done
            Object.keys(resources).forEach((res) => {
              if(resources[res] >= additional){
                resources[res] -= additional;
                looted += additional;
                lootedResources[res] += additional;
                additional = 0;
                return;
              } else {
                additional = additional - resources[res];
                looted += resources[res];
                lootedResources[res] += resources[res];
                resources[res] = 0;
              }
            });
            
        }
        // console.log('looted', lootedResources);
        return lootedResources;
    }
    calculateLoot(army){
        let loot = 0;
        Object.keys(army).forEach((unit) => {
            loot += this.units[unit].loot * army[unit];
        });
        return loot;
    }
    //the difference is that in Defence array of objects is provided, in Attack an object
    calculateDefence(army){
        let total = 0;
        // console.log('wttt', this.units);
        // console.log('army', army);
        army.forEach((unit) => {
            total += this.units[unit.unit].defence * unit.amount;
        });
        return total;
    }
    calculateAttack(army){
        let total = 0;
        Object.keys(army).forEach((unit) => {
            total += this.units[unit].attack * army[unit];
        });
        return total;
    }
    getBuildings(){
        return this.buildings;
    }
    getCost(building){
        
    }
    checkUnit(user, building, level){
        //check reqs again when research is finished
        const searched = this.buildings[building][level];
        if(searched.unit){
            // console.log('units help', units[searched.unit]);
            const unit = units[searched.unit];
            if(unit.requirement){
                units[searched.unit].requirement.forEach((req) => {
                    //check whether user has met all the requirements
                    if(req.type === 'research'){
                        //requirement can be a research or a building
                        const userResearch = user.researchable.filter((research) => {
                            return research === req.requirement;
                        });
                        if(userResearch.length !== 0){
                            // console.log('REQ MET!');
                            user.hireable.push(searched.unit);
                        } else {
                            // console.log('gtfo kid');
                        }
                    } else if(req.type === 'building') {

                    }
                });            
            } else {
                //unit has no requirements
                user.hireable.push(searched.unit);
            }
            return searched.unit;//uselss just doesn't return undefined
        }
    }
}
