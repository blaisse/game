const buildings = require('./buildings/research_buildings');
const tech = require('./technologies');

module.exports = class Research {
    constructor(){
        this.buildings = buildings;
        this.tech = tech;
    }
    getUserBuildings(user, building, level){
        return user.buildings.filter((build) => {
            return build.building === building && build.level === level;
        }).length;
    }
    getRequirements(user, building, level){
        // console.log('ww', building, level);
        Object.keys(tech).forEach((t) => {
            // const reqBuildings = tech[t].requirement.map((req) => {
            //     return { building: req.requirement, level: req.level };
            // });
            // console.log('gkerogoer', reqBuildings);
            tech[t].requirement.forEach((req) => {
                if(req.building === building && req.level === level){
                    console.log('ME IS CAN UNLOCKLED!');
                }
            });
        });
    }
    tryUnlockResearch(user, building, level){
        // console.log('LMFAO CARAZY', this.getUserBuildings(user, building, level));

        // const research = tech
        // this.getRequirements(user, building, level);
    }
    research(user, research, type){
        const requirement = tech[research].requirement;
        let count = 0;
        requirement.forEach((item) => {
            if(item.type === 'building'){
                //check whether user has met all the requirements
                const filteredBuildings = user.buildings.filter((building) => {
                    return building.building === item.requirement && building.level === item.level;
                });
                if(filteredBuildings.length > 0){
                    console.log('req met!', filteredBuildings);
                } else {
                    console.log('sadly not met!');
                }
            }
        });
    }
}