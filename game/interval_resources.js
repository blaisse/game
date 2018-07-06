const mongoose = require('mongoose');
const User = mongoose.model('users');

module.exports = (io) => {

setTimeout(async () => {
    //fetch all users - for each:
    //get currect income per hour
    const users = await User.find();
    users.forEach((user) => {
        let upkeep = {};
        if(user.units.length !== 0){
            // console.log('army upkeep', user.calculateArmyUpkeep());
            upkeep = user.calculateArmyUpkeep();
        }
        let buildingsIncome = user.calculateBuildingsIncome();
        // console.log('pls helpss', buildingsIncome);
        Object.keys(user.resources.toJSON()).forEach((resource) => {
            // console.log('res', resource);
            let income = user.resources[resource];
            // console.log('balance', income);
            income += user.income[resource];
            //add income to resource
            if(upkeep[resource]){
                income -= upkeep[resource];
            }
            if(buildingsIncome[resource]){
                income += buildingsIncome[resource];
            }
            // console.log(resource, buildingsIncome[resource]);
            user.resources[resource] = income;
        });
        user.save().then((qqq) => {
            //emit socket?
            io.to(user.username).emit('updateResources');
        });
    });
}, 10000);

}