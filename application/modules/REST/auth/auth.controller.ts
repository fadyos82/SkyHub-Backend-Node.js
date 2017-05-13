var users = require('./users.model.ts');

// passport.use(new LocalStrategy(
//     function (username, password, done){
//         return done(null, user);
//     }
//
// ));

module.exports = {

    /*
        REST API
     */

    postAuthenticateLogin : function (req, res){

        var sEmailUsername = '', sUserPassword = '';

        if (req.hasOwnProperty('body')){

            sEmailUsername = typeof req.body.emailUsername !== 'undefined' ? req.body.emailUsername : '';
            sUserPassword = typeof req.body.password !== 'undefined' ? req.body.password : '';
        }

        console.log(sEmailUsername);
        console.log(sUserPassword);

        return new Promise ( (resolve) => {

            users.findUserFromEmailUsernamePassword(sEmailUsername, sUserPassword).then ( (answer)=>{

                // passport.authenticate('local','','', function (req, res){
                //
                // });

                console.log('User answer',answer);

                if (answer.result === "true")
                {
                    //console.log(loggedInUser.getFullName());
                    //console.log(loggedInUser.getPublicInformation());

                    users.updateLastActivity(answer.user);

                    resolve( {
                        result: 'true',
                        message: 'Welcome back, '+answer.user.getFullName(),
                        user :  answer.user.getPublicInformation(),
                        token: this.getUserToken(answer.user),
                        auth_key: this.generateAuthTokenId(),
                    });

                } else
                resolve({
                    result: 'false',
                    message: answer.message,
                });

            });

        });

    },

    postAuthenticateTokenAsync: function (req, res){

        var sToken = '';
        if (req.hasOwnProperty('body')) {
            sToken = req.body.token || '';
        }

        console.log("Token", sToken);

        return new Promise ( (resolve) => {

            try{
                var userAuthenticatedData = jwt.verify(sToken, constants.SESSION_Secret_key);

                users.findUserById(userAuthenticatedData.id).then ((userAuthenticated)=>{

                    console.log(userAuthenticated.getPublicInformation());

                    resolve({
                        result: "true",
                        user: userAuthenticated.getPublicInformation(),
                    });

                });

            } catch (err){

                resolve({
                    result: "false",
                    message: "Error. Invalid token",
                });

            }

        });
    },

    postAuthenticateRegister: function (req, res){

        var sEmail = '', sUsername = '', sPassword = '', sFirstName = '', sLastName = '', sLastName='', sCountry='', sCity='',sLanguage='', sProfilePic='', sCoverPic='', dbLatitude = 0, dbLongitude = 0;

        if (req.hasOwnProperty('body')){
            sEmail = req.body.email || '';
            sUsername = req.body.username ||  '';
            sPassword = req.body.password || '';
            sFirstName = req.body.firstName ||  '';
            sLastName = req.body.lastName ||  '';
            sCountry = req.body.country || '';
            sCity = req.body.city || '';

            dbLatitude = req.body.latitude || -666;
            dbLongitude = req.body.longitude || -666;

            sLanguage = req.body.language || sCountry;

            sProfilePic = req.body.profilePic || '';
            sCoverPic = req.body.coverPic || '';
        }

        console.log(sEmail);

        return users.registerUser(sEmail, sUsername, sPassword, sFirstName, sLastName, sCountry, sCity, sLanguage, sProfilePic, sCoverPic, dbLatitude, dbLongitude);
    },

    /*
        HELPER FUNCTIONS
     */

    generateAuthTokenId : function()
    {
        var hat = require('hat');
        return hat();
    },

    getUserToken : function(user){

        //console.log('calculating token');

        constants = require ('./../../../../bin/constants.js');
        console.log("SECRET key: "+constants.SESSION_Secret_key);

        var token = jwt.sign({ "id" : user.id}, constants.SESSION_Secret_key, {expiresInMinutes: 60 * 24 * 30* 12 * 5});
        console.log('token = '+token);

        return token;
    }

};