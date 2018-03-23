import React, { Component } from 'react';   

class ItemCardCost extends Component {
    renderArrayOfObjects(type, item, display){
        //display -> cost/requirement
        //allows to render cost/requirements
        let enough = {};
        let requiredLevel = {};
        let req = {};
        if(type === 'barracks'){
            req = item[display];
        } else if(type === 'research'){
            req = item[display];
        } else {
            req = item.levels[item.level][display];
        }
        if(req.length > 0 && this.props.buildings && this.props.research){
            // let count = 0;
            req.forEach((singleRequirement) => {
                if(singleRequirement.type === 'buildings'){
                    // console.log('props', this.props.unit, this.props.buildings);
                    // console.log('research', this.props.research);
                    // console.log('buildings', this.props.buildings);
                    // console.log('help', this.props[singleRequirement.type], singleRequirement.kind);
                    let searched = [];
                    if(this.props[singleRequirement.type][singleRequirement.kind]){
                        searched = this.props[singleRequirement.type][singleRequirement.kind].filter((build) => {
                            return build.building === singleRequirement.requirement && build.level >= singleRequirement.level;
                        });
                    }
                    // const searched = this.props[singleRequirement.type][singleRequirement.kind].filter((build) => {
                    //     return build.building === singleRequirement.requirement && build.level >= singleRequirement.level;
                    // });
                    requiredLevel[singleRequirement.requirement] = singleRequirement.level;
                    if(searched.length === 0){
                        //req not met
                        if(!this.props.hireable[this.props.unit].research){
                            enough[singleRequirement.requirement] = true;
                        }
                        enough[singleRequirement.requirement] = false;
                    } else {
                        enough[singleRequirement.requirement] = true;
                    }
                } else if(singleRequirement.type === 'research'){
                    const searched = this.props[singleRequirement.type][singleRequirement.requirement].research;
                    if(searched){
                        enough[singleRequirement.requirement] = true;
                    } else {
                        if(!this.props.hireable[this.props.unit].research){
                            enough[singleRequirement.requirement] = true;
                        }
                        enough[singleRequirement.requirement] = false;
                    }
                }
            });
        }
        return Object.keys(enough).map((e, i) => {
            return (
                <div key={i} className={(enough[e] ? '' : ' insufficient')}>{e} {(requiredLevel[e] ? requiredLevel[e] : '')}</div>
            );
        });
    }
    renderCost(type, item, amount){
        //type - building, unit
        let enough = {};
        //just to display
        let costBasic = {};
        let cost = {};
        if(type === 'barracks'){
            cost = item.cost;
        } else if(type === 'research'){
            cost = item.cost;
        } else {
            cost = item.levels[item.level].cost;
        }
        if(!amount) amount = 1;
        Object.keys(cost).forEach((resource) => {
            costBasic[resource] = cost[resource] * amount;
            if(this.props.resources[resource] < cost[resource] * amount){
                //if item is researched don't check resources
                if(item.research){
                    enough[resource] = true
                } else {
                    enough[resource] = false;
                }
            } else {
                enough[resource] = true;
            } 
        });
        return Object.keys(costBasic).map((c, i) => {
            return (
                <div key={i} className={(enough[c] ? '' : 'insufficient')}>{c}: {costBasic[c]}</div>
            );
        });
    }
    render(){
        if(this.props.display === 'requirement'){
            return (
                <div>{this.renderArrayOfObjects(this.props.type, this.props.hireable[this.props.unit], 'requirement')}</div>
            );
        } else {
            return (
                <div>{this.renderCost(this.props.type, this.props.hireable[this.props.unit], this.props.amount)}
                </div>
            );
        }
    }
}

export default ItemCardCost;