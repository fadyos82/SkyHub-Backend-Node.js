/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 7/1/2017.
 * (C) BIT TECHNOLOGIES
 */


let HashList = require ('../../../DB/Redis/lists/HashList.helper.js');
let commonFunctions = require ('../../common/helpers/CommonFunctions.helper.js');

let VoteType = require ('../models/VoteType.js');
let VotingInfoHashList = require ('./VotingInfo.hashlist.js');
let NotificationsCreator = require ('../../notifications/NotificationsCreator.js');

class VotingsHashList {

    //sortedList
    constructor(){
        this.hashList = new HashList("Voting");
    }

    async initializeVoteInDB(parentId, parents){
        await this.hashList.setHash(parentId, 'parents', parents);
    }

    async submitVote (parentId, userAuthenticated, voteType ){

        if ((typeof userAuthenticated === "undefined")||(userAuthenticated === null)) return {result: false, notAuthenticated:true, message: 'Authenticated User is not defined'};

        let userId = userAuthenticated;
        if (typeof userAuthenticated === 'object') userId = userAuthenticated.id||'';
        if (userId === '') return {result: false, notAuthenticated:true, message: 'Authenticated User is not defined'};

        if ((voteType !== VoteType.VOTE_UP) && (voteType !== VoteType.VOTE_DOWN)&&(voteType !== VoteType.VOTE_NONE))
            return{
                result: false,
                message: 'invalid vote value: '+VoteType.VOTE_NONE,
            };

        let foundVoteType = await this.hashList.getHash(parentId, userId);
        if (foundVoteType !== null) foundVoteType = parseInt(foundVoteType)

        if ((voteType === VoteType.VOTE_UP)&&(foundVoteType === null)){
            NotificationsCreator.newVote(parentId, userAuthenticated, voteType);
        }

        await this.hashList.setHash(parentId, userId, voteType);
        await VotingInfoHashList.changeVoteValue(parentId, foundVoteType, voteType);

        return {
            result: true,
            vote:{
                ups: await VotingInfoHashList.getVoteUpsValue(parentId),
                downs: await VotingInfoHashList.getVoteDownsValue(parentId),
                parentId: parentId,
                votes: await VotingInfoHashList.getVotesWithOnlyUserVote(parentId, userAuthenticated),
            }
        };

    }

    //NOT FINISHED
    async getAllVotes(parentId, userAuthenticated){

        //verific daca userAuthenticated is owner of the parentId
        let userAuthenticatedId = userAuthenticated;
        if (typeof userAuthenticated === 'object') userAuthenticatedId = userAuthenticated.id;

        let hashRests = await this.hashList.getAllHash(parentId);

        let result = [];

        let i = 0;
        while (i < hashRests.length){
            let userId = hashRests[i];
            let voteType = hashRests[i+1];

            if ((voteType === VoteType.VOTE_UP)||(userId === userAuthenticatedId))
                result.push({
                    userId: userId,
                    voteType: voteType,
                });

            i+=2;
        }

        return result;

    }



    async getVote (parentId, userAuthenticated, onlyUserVote){

        if (typeof userAuthenticated === "undefined") userAuthenticated = null;
        if (typeof onlyUserVote === "undefined") onlyUserVote = true;

        return {
            result:true,
            vote: {
                ups: await VotingInfoHashList.getVoteUpsValue(parentId),
                downs: await VotingInfoHashList.getVoteDownsValue(parentId),
                parentId: parentId,
                votes: ( onlyUserVote ? await VotingInfoHashList.getVotesWithOnlyUserVote(parentId, userAuthenticated) : await this.getAllVotes(parentId, userAuthenticated) ),
            }
        }
    }

    async deleteVoting(parentId){
        let undefined;
        return await this.hashList.deleteHash(undefined,parentId);
    }

    async test(){

        console.log("submitVote", await this.submitVote('parent1', {id: 22}, VoteType.VOTE_UP ));
        console.log("submitVote", await this.submitVote('parent1', {id: 22}, VoteType.VOTE_UP ));
        console.log("submitVote", await this.submitVote('parent1', {id: 22}, VoteType.VOTE_UP ));
        console.log("submitVote", await this.submitVote('parent1', {id: 24}, VoteType.VOTE_UP ));
        console.log("submitVote", await this.submitVote('parent1', {id: 26}, VoteType.VOTE_DOWN ));
        console.log("getVote", await this.getVote('parent1') );
        console.log("submitVote", await this.submitVote('parent1', {id: 26}, VoteType.VOTE_UP ));
        console.log("getVote", await this.getVote('parent1') );

    }

};


module.exports = new VotingsHashList();