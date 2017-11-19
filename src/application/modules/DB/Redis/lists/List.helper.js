/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 7/2/2017.
 * (C) BIT TECHNOLOGIES
 */

/*
    REDIS LIST

    https://redis.io/commands/lrange

 */


var redis = require ('../../redis_nohm.js');

var List = class{

    constructor (tablePrefix){
        this.tablePrefix = tablePrefix || "List";
    }


    async deleteList(tableName){

        return new Promise( (resolve)=> {
            redis.redisClient.del(this.tablePrefix + ":" + tableName, function (err, answer) {

                console.log("delete ",err,answer);

                resolve (err === null ? answer : null);
            });
        });

    }

    /*
        https://redis.io/commands/lpush    TOP push (push at the front)
        O(1)
     */

    async listLeftPush(tableName, value){

        if (typeof value !== "string")
            value = JSON.stringify(value);

        return new Promise( (resolve)=> {
            redis.redisClient.lpush(this.tablePrefix + ":" + tableName, value, function (err, answer) {

                console.log("list push ",err,answer);

                resolve (err === null ? answer : null);
            });
        });

    }

    /*
        https://redis.io/commands/rpush   TAIL push (push at the end)
         O(1)
     */

    async listRightPush(tableName, value){

        if (typeof value !== "string")
            value = JSON.stringify(value);

        return new Promise( (resolve)=> {
            redis.redisClient.lpush(this.tablePrefix + ":" + tableName, value, function (err, answer) {

                console.log("list push ",err,answer);

                resolve (err === null ? answer : null);
            });
        });

    }

    /*
        https://redis.io/commands/lrem

        O(N)

     */
    async listRemove(tableName, key, count){

        if (typeof count === 'undefined') count = 0; //remove all the occurrences of the key

        return new Promise( (resolve)=> {
            redis.redisClient.lrem (this.tablePrefix + ":" + tableName, count, key, function (err, answer) {

                console.log("lrem ##",key,"###",err,answer);
                resolve (err === null ? answer : null);
            });
        });

    }

    /*
        https://redis.io/commands/lset  -  overwrite key with value
        O(N)
     */

    async listSet(tableName, key, value){

        if (typeof value !== "string")
            value = JSON.stringify(value);

        return new Promise( (resolve)=> {
            redis.redisClient.lset (this.tablePrefix + ":" + tableName, key, value, function (err, answer) {

                console.log("lset ##",key,"###",err,answer);
                resolve (err === null ? answer : null);
            });
        });

    }

    /*
        ltrim - removing the elements that exceed the maximum limit

        O(N) where N is the number of elements to be removed by the operation.
     */

    async listTrim(tableName, minim, maxim){

        if (typeof minim === 'undefined') minim = 0;
        if (typeof maxim === 'undefined') maxim = 99;

        return new Promise( (resolve)=> {
            redis.redisClient.ltrim (this.tablePrefix + ":" + tableName, minim, maxim, function (err, answer) {

                console.log("ltrim ##",minim, maxim,"###",err,answer);
                resolve (err === null ? answer : null);
            });
        });

    }

    /*
     llen - count of the list

     O(1)
     */

    async listLength(tableName){
        if (typeof tableName === 'undefined') tableName = '';

        return new Promise( (resolve)=> {
            redis.redisClient.llen (this.tablePrefix + ":" + tableName, function (err, answer) {

                console.log("llen ##",err, answer,"###",err,answer);
                resolve (err === null ? answer : null);
            });
        });

    }

    /*
     rpop - get and remove last element

     O(1)
     */

    async listRightPop(tableName){
        return new Promise( (resolve)=> {
            redis.redisClient.rpop (this.tablePrefix + ":" + tableName, function (err, answer) {

                console.log("rpop ##","###",err,answer);
                resolve (err === null ? answer : null);
            });
        });

    }

    /*
     lrange - find the notifications between index1, index2

     O(S+N) where S is the distance of start offset from HEAD for small lists, from nearest end (HEAD or TAIL) for large lists; and N is the number of elements in the specified range.
     */

    async listRange(tableName, index1, index2){

        if (typeof index1 === 'undefined') index1 = 0;
        if (typeof index2 === 'undefined') index2 = 10;

        return new Promise( (resolve)=> {
            redis.redisClient.lrange(this.tablePrefix + ":" + tableName, index1, index2, function (err, answer) {

                //console.log("lrange##",index1, index2,"###",err,answer);
                resolve (err === null ? answer : null);
            });
        });

    }

    /*
     keys - get all the elements

     O(N)
     */

    // async listKeys(tableName, regex){
    //
    //     if (typeof regex === 'undefined') regex = '';
    //
    //     return new Promise( (resolve)=> {
    //         redis.redisClient.keys(this.tablePrefix + ":" + tableName, regex , function (err, answer) {
    //
    //             console.log("keys##","###",err,answer);
    //             resolve (err === null ? answer : null);
    //         });
    //     });
    //
    // }



};

module.exports = List;