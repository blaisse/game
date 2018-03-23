const stats = require('./stats_marshal');
const cost = require('./cost_marshal');
const skills = require('./skills_marshal');

module.exports = class Marshal {
    constructor(name, level, battlesWon, battlesLost){
        this.name = name;
        this.level = level;
        this.battlesLost = battlesLost;
        this.battlesWon = battlesWon;
    }
    getSkills(){
        return skills;
    }
    hire(user, name){
        const marshal = {
            name,
            level: 1,
            skills: [],
            experience: 0,
            battlesWon: 0,
            battlesLost: 0,
            skillPoints: 20,
            rank: 'Officer',
            hired: new Date().getTime()
        };
        marshal.nextLevel = stats[marshal.level].experienceNeeded;
        user.marshals.push(marshal);
    }
    addExperience(user, marshal, xp){
        //filter other marshals then push an updated marshal to this array
        const otherMarshals = user.marshals.filter((m) => {
            return m.hired !== marshal.hired;
        });
        //while there is more xp - possible multiple level ups
        while(xp + marshal.experience >= marshal.nextLevel){
            //subtract the necessary amount of experience to level up
            xp = xp - (marshal.nextLevel - marshal.experience);
            marshal.experience = 0;
            marshal.level++;
            marshal.skillPoints++;
            //new experience tier (level 1: 100, level: 200, etc)
            marshal.nextLevel = stats[marshal.level].experienceNeeded;
        }
        //add left over experience
        if(xp > 0){
            marshal.experience = xp;
        }
        otherMarshals.push(marshal);
        otherMarshals.sort((a,b) => {
            return a.hired - b.hired;
        });
        user.marshals = otherMarshals;
        return marshal;
    }
    getMax(user){
        const chancery = user.buildings.filter((building) => {
            return building.building === 'chancery';
        });
        return chancery[0].level;
    }
    getUpkeep(marshalCount){
        //marshalCount = 1, 2, 3.. the cost increases the more marshals are hired
        return cost[marshalCount].upkeep;
    }
    skillUp(user, marshal, skillName, level){
        if(marshal.skillPoints >= 1 && skills[skillName].levels[level]){
            const otherMarshals = user.marshals.filter((oneMarshal) => {
                return marshal.name !== oneMarshal.name;
            });
            const skillLearned = marshal.skills.filter((skill) => {
                return skill.name === skillName;
            });
            //skill not known to this marshal, push 
            if(skillLearned.length === 0){
                marshal.skills.push({ name: skillName, level: 1 });
            } else {
                const marshalSkills = marshal.skills.filter((skill) => {
                    return skill.name !== skillName;
                });
                //++ would make the marshal's skill level 6, reference
                let level = ++skillLearned[0].level;
                if(skills[skillName].levels[level]){
                    marshalSkills.push({ name: skillName, level });
                    marshal.skills = marshalSkills;
                } else return console.log('ccant jsut cant');
            }
            marshal.skillPoints--;
            otherMarshals.push(marshal);
            user.marshals = otherMarshals;
        } else console.log('no skill points!');

    }
};