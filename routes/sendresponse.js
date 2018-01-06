var constant = require('./constant.js');

exports.somethingWentWrongError = function (res) {
    
        var errResponse = {
            status: constant.responseStatus.ERROR_IN_EXECUTION,
            message: constant.responseMessage.ERROR_IN_EXECUTION,
            data: {}
        }
        sendData(errResponse,res);
    };
    
    exports.sendSuccessData = function (data,res) {
    
        var successResponse = {
            status: constant.responseStatus.SHOW_DATA,
            message: "",
            data: data
        };
        sendData(successResponse,res);
    };
    
    exports.invalidAccessTokenError = function (res) {
    
        var errResponse = {
            status: constant.responseStatus.INVALID_ACCESS_TOKEN,
            message: constant.responseMessage.INVALID_ACCESS_TOKEN,
            data: {}
        }
        sendData(errResponse,res);
    };
    
    exports.parameterMissingError = function (res,status,key) {
        var errResponse = {
			// if (status == 0 || status == 1){
			// 	var msg = key '+is empty';
			// }else if(status == 2){
			// 	var msg = key '+is undefined';
			// }
            status: constant.responseStatus.PARAMETER_MISSING,
            message: msg,
            data: {}
        }
        sendData(errResponse,res);
    };
    
    exports.sendErrorMessage = function (msg,res) {
    
        var errResponse = {
            status: constant.responseStatus.SHOW_ERROR_MESSAGE,
            message: msg,
            data: {}
        };
        sendData(errResponse,res);
    };
    
    exports.successStatusMsg = function (msg,res) {
    
        var successResponse = {
            status: constant.responseStatus.SHOW_MESSAGE,
            message: msg,
            data: {}
        };
    
        sendData(successResponse,res);
    };
    
    
    exports.emailAlreadyExist = function(msg,res) {
        
        var errResponse = {
            status: constant.responseStatus.EMAIL_ALREADY_REGISTERED,
            message: msg,
            data: {}
        }
    
        sendData(errResponse,res);
    }
    
    
    exports.sendData = function (data,res) {
        sendData(data,res);
    };
    
    
    function sendData(data,res)
    {
        res.type('json');
        res.jsonp(data);
    }