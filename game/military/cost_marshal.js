//if marshalCount === 0, the first marshal will be hired, therefore 0: {...} shows cost
//when there are no marshals hired.
//1: {...} - one marshal is hired, cost for the second one is listed there
module.exports = {
    0: {
        cost: {
            gold: 100,
            silver: 200
        },
        upkeep: {
            gold: 10,
            silver: 20
        },
        duration: 3000,
    },
    1: {
        cost: {
            gold: 200,
            silver: 400
        },
        upkeep: {
            gold: 20,
            silver: 40
        },
        duration: 4000
    },
    2: {
        cost: {
            gold: 200,
            silver: 400
        },
        upkeep: {
            gold: 20,
            silver: 40
        },
        duration: 4000
    }
};