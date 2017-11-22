/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 6/14/2017.
 * (C) BIT TECHNOLOGIES
 */

var TopObjectsList = require('DB/Redis/lists/sorted-lists/TopObjectsList.helper.js');
import MaterializedParentsHelper from 'DB/common/materialized-parents/MaterializedParents.helper';

class TopContent {

    //sortedList
    constructor(){
        this.topObjectsList = new TopObjectsList("Content");
    }

    async getTopContent(userAuthenticated, parent, pageIndex, pageCount){

        return this.topObjectsList.getTopObjects(userAuthenticated, parent, pageIndex, pageCount);
    }

    async getContent(userAuthenticated, id){
        return MaterializedParentsHelper.getObject(userAuthenticated, id);
    }

    async keepSortedObject( key, score, parents, bDelete ){
        return this.topObjectsList.keepSortedObject(key, score, parents, bDelete);
    }

    async test(){

    }

};

module.exports = new TopContent();