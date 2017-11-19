/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 7/9/2017.
 * (C) BIT TECHNOLOGIES
 */

var ScoreCoefficientHelper = require ('../../../../DB/common/score-coefficient/ScoreCoefficient.helper.js');
var HashList = require ('../../../../DB/Redis/lists/HashList.helper.js');
var TopRepliesHelper = require ('../../top-content/helpers/TopReplies.helper.js');

var RepliesSorter = class{

    constructor(){
        this.hashList = new HashList("TopObjects:Sorter:Replies");
    }

    async initializeSorterInDB(id, dtCreation){
        await this.hashList.setHash(id,"dtCreation", dtCreation);
    }

    async destroySorterInDB(id){
        await this.hashList.deleteHash('', id);
    }

    async calculateHotnessVotingScore (id){

        let StatisticsHelper = require('../../../statistics/helpers/Statistics.helper.js');

        let replies = await StatisticsHelper.getTotalRepliesCounter(id);
        let voteDiff = await StatisticsHelper.getVoteUpsCounter(id) - await StatisticsHelper.getVoteDownsCounter(id);

        return voteDiff +  0.4*replies;

    }

    async calculateHotnessCoefficient (id, dtCreation){

        let votingScore = await this.calculateHotnessVotingScore(id);
        return await ScoreCoefficientHelper.calculateHotnessScoreCoefficient(dtCreation, votingScore);
    }

    async getExistingHotnessCoefficient(id, dtCreation, parents){
        let hotnessScore = await this.hashList.getHash(id, 'hotnessScore');
        if (hotnessScore !== null) return hotnessScore;

        return 0;
    }


    async calculateKeepSortedList (id, parents, bDelete){

        let dtCreation = parseInt( await this.hashList.getHash(id, "dtCreation") );

        let previousHotnessScore = await this.hashList.getHash(id, 'hotnessScore');
        let hotnessScore = await this.calculateHotnessCoefficient(id, dtCreation);

        console.log('---------------------------------------------- ');
        console.log("id#"+id+"#");
        console.log("hotnessScore",hotnessScore, "voting score", await this.calculateHotnessVotingScore(id));
        console.log('---------------------------------------------- ');

        if ((bDelete)||(previousHotnessScore !== hotnessScore)) {

            this.hashList.setHash(id, "hotnessScore", hotnessScore);

            TopRepliesHelper.keepSortedObject(id, hotnessScore, parents, bDelete);
        }
    }

};

module.exports = new RepliesSorter();