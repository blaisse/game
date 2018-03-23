const mongoose = require('mongoose');
const User = mongoose.model('users');

module.exports = (app) => {
    //require auth
    app.post('/api/purchase', async (req, res) => {
        console.log('try to purchase', req.body);
        const user = await User.findOne({ username: 'russia' });
        // user.updateIncome();
        user.calculateBuildingsIncome();
       
        // user.save();
        // console.log('Army:', user.calculateArmyUpkeep());
        res.send(user.getBuildings('upgradable'));
    });
};