var sendResponse = require('./sendresponse');


//exports.checkBlank = function (res, manValues, callback) {
  //  var checkBlankData = checkBlank(manValues);

//    if (checkBlankData) {
//        sendResponse.parameterMissingError(res);
//    }
//    else {
//        callback(null);
//    }	
//}

//function checkBlank(arr) {

//    var arrlength = arr.length;

    //for (var i = 0; i < arrlength; i++) {
        //if (arr[i] == '') {
            //return 1;
          //  break;
        //}
       // else if (arr[i] == undefined) {
           // return 1;
         //   break;
       // }
        //else if (arr[i] == '(null)') {
          //  return 1;
        //    break;
      //  }
    //}
  //  return 0;
//}

exports.checkBlank = function (res, manValues, keys, callback) {


    for (var i = 0; i < manValues.length; i++) {
        if (manValues[i] == '') {
			var status = 0;
            sendResponse.parameterMissingError(res,status,keys[i]);
            break;
        }
        else if (manValues[i] == undefined) {
			var status = 1;
            sendResponse.parameterMissingError(res,status,keys[i]);
            break;
        }
        else if (manValues[i] == '(null)') {
			var status = 2;
            sendResponse.parameterMissingError(res,status,keys[i]);
            break;
        }
    
}

/*
 * ------------------------------------------------------
 *  check App Version
 *  INPUT : appVersion
 *  OUTPUT : update popup and critical
 * ------------------------------------------------------
 */

exports.checkAppVersion = function (res,deviceType, appVersion, callback) {

    var sql = "SELECT `id`, `type`, `version`, `critical`,`last_critical_version` FROM `app_version` WHERE `type`=? limit 1";
    var values = [deviceType];
    dbConnection.Query(res, sql, values, function (appVersionResponse) {

        console.log(appVersionResponse);

        appVersion = parseInt(appVersion);

        if(appVersionResponse[0].last_critical_version > appVersion)
        {
            callback(null, 1, 1);
        }
        else if (appVersionResponse[0].version > appVersion) {
            callback(null, 1, appVersionResponse[0].critical);
        }
        else {
            callback(null, 0, 0);
        }
    });
};

/*
 * -----------------------------------------------------------------------------
 * Encryption code
 * INPUT : string
 * OUTPUT : crypted string
 * -----------------------------------------------------------------------------
 */
exports.encrypt = function (text) {

    var crypto = require('crypto');
    var cipher = crypto.createCipher('aes-256-cbc', 'd6F3Efeq');
    var crypted = cipher.update(text, 'utf8', 'hex');
    crypted += cipher.final('hex');
    return crypted;
}


/*
 * ------------------------------------------------------
 * Authenticate a user through Access token and return extra data
 * Input:Access token{Optional Extra data}
 * Output: User_id Or Json error{Optional Extra data}
 * ------------------------------------------------------
 */
exports.authenticateAccessTokenAndReturnExtraData = function (accesstoken, arr, res, callback) {

    var sql = "SELECT `user_id`";
    arr.forEach(function (entry) {
        sql += "," + entry;
    });
    sql += " FROM `users`";
    sql += " WHERE `access_token`=? LIMIT 1";
    var values = [accesstoken];
    dbConnection.Query(res, sql, values, function (result) {

        if (result.length > 0) {

            return callback(null, result);

        } else {
            sendResponse.invalidAccessTokenError(res);
        }
    });

}


/*
 * --------------------------------------------------------------------------
 * to check email already exists or not
 * ---------------------------------------------------------------------------
 */
exports.check_email_availability = function(res, email, callback) {
    var sql = "SELECT `userEmail` FROM `ni_user` WHERE `userEmail`=? limit 1";
    var values = [email];
    connection.query(sql, values, function (err, userResponse) {
        if (userResponse.length) {
            var errorMsg = 'You are already registered with us, Please login to enjoy the services';
            sendResponse.sendErrorMessage(errorMsg, res);
        } else
        {
            callback();
        }
    });
}

/*
 * --------------------------------------------------------------------------
 * to check user already exists or not
 * ---------------------------------------------------------------------------
 */
exports.user_registered_check = function(res, email, callback) {
    var sql = "SELECT * FROM `ni_user` WHERE `userEmail`=? limit 1";
    var values = [email];
    connection.query(sql, values, function (err, userResponse) {
        if (userResponse.length) {
            callback();
        } else
        {
            var errorMsg = 'You are not registered with us.Please register first to enjoy the services';
            sendResponse.sendErrorMessage(errorMsg, res);
        }
    });
}


/*
 * --------------------------------------------------------------------------
 * to check user already exists or not
 * ---------------------------------------------------------------------------
 */
exports.userCustomerEmail = function(res, email, callback) {
    var sql = "SELECT * FROM `customer` WHERE `email`=? limit 1";
    var values = [email];
    console.lo('c Fx.1')
    connection.query(sql, values, function (err, userResponse) {
        if(err){
            console.lo('c Fx.1.1')
            var msg = 'Something went wrong. Please try again later.';
            sendResponse.sendErrorMessage(msg,res);
        }else{
            console.lo('c Fx.1.2')
            if (userResponse.length) {
            callback();
        } else
        {
            var errorMsg = 'You are not registered with us.Please register first to enjoy the services';
            sendResponse.sendErrorMessage(errorMsg, res);
        }
        }
        
    });
}


/*
 * ----------------------------------------------------------------------------------------------------------------------------------------
 * check User Is Valid or Not
 * INPUT : access_token
 * ----------------------------------------------------------------------------------------------------------------------------------------
 */
exports.checkUser = function(res, access_token, callback) {
    var sql = "SELECT * FROM `ni_user` WHERE `token`=? limit 1";
    var values = [access_token];
    connection.query(sql, values, function (err, userResponse) {
        if (userResponse.length == '0' || userResponse.length == 0) {
            var errorMsg = 'Invalid Attempt';
            sendResponse.sendErrorMessage(errorMsg, res);
        } else
        {
            callback();
        }
    });
}

/*
 * ----------------------------------------------------------------------------------------------------------------------------------------
 * check Game ID Is Valid or Not
 * INPUT : gameId
 * ----------------------------------------------------------------------------------------------------------------------------------------
 */
exports.checkGameId = function(res, gameID, callback) {
    var sql = "SELECT * FROM `ni_game` WHERE `gameId`=? limit 1";
    var values = [gameID];
    connection.query(sql, values, function (err, userResponse) {
        if (userResponse.length == '0' || userResponse.length == 0) {
            var errorMsg = 'Game Id is Missing';
            sendResponse.sendErrorMessage(errorMsg, res);
        } else
        {
            callback();
        }
    });
}

/*
 * ----------------------------------------------------------------------------------------------------------------------------------------
 * check UserId Is Valid or Not
 * INPUT : userId
 * ----------------------------------------------------------------------------------------------------------------------------------------
 */
exports.checkUserId = function(res, userId, callback) {
    var sql = "SELECT * FROM `ni_user` WHERE `userId`=? limit 1";
    var values = [userId];
    connection.query(sql, values, function (err, userResponse) {
        if (userResponse.length == '0' || userResponse.length == 0) {
            var errorMsg = 'Invalid Attempt';
            sendResponse.sendErrorMessage(errorMsg, res);
        } else
        {
            callback();
        }
    });
};
}