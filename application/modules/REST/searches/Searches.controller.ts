/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 6/16/2017.
 * (C) BIT TECHNOLOGIES
 */

module.exports = {

    /*
     REST API
     */

    async searchTopContent (req, res){

        let userAuthenticated = await AuthenticatingUser.loginUser(req);

        let sParent = ''; let iPageIndex=1; let iPageCount = 8;

        if (req.hasOwnProperty('body')){
            sParent = req.body.parent || '';
            iPageIndex = req.body.pageIndex || 1;
            iPageCount = req.body.pageCount || 8;
        }

        console.log('Getting Top Content : ', sParent);

        return TopContentHelper.getTopContent(userAuthenticated, sParent, iPageIndex, iPageCount);

    },

async postGetContent (req, res){

    let userAuthenticated = await AuthenticatingUser.loginUser(req);

    let sId = '';

    if (req.hasOwnProperty('body')){

        sId = req.body.id ||'';

    }

    console.log(""); console.log(""); console.log(""); console.log("");
    //console.log(req);
    console.log('Getting Content : ', '"'+sId,res.body);

    return TopContentHelper.getContent(userAuthenticated, sId);

}


}