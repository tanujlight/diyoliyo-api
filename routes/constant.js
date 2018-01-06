/**
 * Created by 75way Technologies on 17/03/2016 AD.
 */

/**
 * The node-module to hold the constants for the server
 */


function define(obj, name, value) {
    Object.defineProperty(obj, name, {
        value:        value,
        enumerable:   true,
        writable:     false,
        configurable: false
    });
}


exports.responseStatus = {};

define(exports.responseStatus, "PARAMETER_MISSING", 100);
define(exports.responseStatus, "INVALID_ACCESS_TOKEN", 101);
define(exports.responseStatus, "ERROR_IN_EXECUTION", 102);
define(exports.responseStatus, "SHOW_ERROR_MESSAGE", 103);
define(exports.responseStatus, "SHOW_MESSAGE", 104);
define(exports.responseStatus, "SHOW_DATA", 105);
define(exports.responseStatus, "EMAIL_ALREADY_REGISTERED", 106);

exports.responseMessage = {};
define(exports.responseMessage, "PARAMETER_MISSING", "Some Parameters Missing");
define(exports.responseMessage, "INVALID_ACCESS_TOKEN", "Please login again, Invalid access.");
define(exports.responseMessage, "ERROR_IN_EXECUTION", "Some error occurred. Please try again.");
define(exports.responseMessage, "SHOW_ERROR_MESSAGE", "Some error occurred. Please try again.");
define(exports.responseMessage, "SHOW_MESSAGE", "Hi there!");
define(exports.responseMessage, "SHOW_DATA", "Success");
define(exports.responseMessage, "EMAIL_ALREADY_REGISTERED","Email is already registered")

exports.deviceType = {};
define(exports.deviceType, "ANDROID",   1);
define(exports.deviceType, "iOS",       2);