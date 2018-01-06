var express = require('express');
var router = express.Router();
var async = require('async');
var randomstring = require('randomstring');
var md5 = require('md5');
var request = require('request');
var func = require('./../commonfunction');
var sendResponse = require('./../sendresponse');


router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});


router.post('/customer_login',function(req,res,next){
	var email = req.body.email;
	var password = req.body.password;
	var manValues = [email,password];
	var keys = ["email","password"];
	async.waterfall([
		// function(callback){
		// 	func.checkBlank(res,manValues,keys,callback)
		// },
		// function(callback){
		// 	func.checkCustomerEmail(res,email,callback);
		// }
	],
	function(){
		console.log('Main Fxn.')
		var sql = 'select * from customer where email = ?';
		var values = [email];
		connection.query(sql,values,function(err1,res1){
			if(err1){
				sendResponse.sendErrorMessage(err1,res);
			}else{
				if(res1.length>0){
					if(res1[0].password == password){
						var data = {"customer_id":res1[0].customer_id,"first_name":res1[0].first_name,"last_name":res1[0].last_name,"access_token":res1[0].access_token,"email":res1[0].email,"is_member":res1[0].is_member};
						sendResponse.sendSuccessData(data,res);
					}else{
						var msg = 'Password did not matched';
						sendResponse.sendErrorMessage(msg,res);
					}
				}else{
					var msg = 'Invalid Email.';
					sendResponse.sendErrorMessage(msg,res);
				}
			}
		})
	}
	)
})


router.put('/change_password_customer',function(req,res,next){
	var access_token = req.body.access_token;
	var old_password  = req.body.old_password;
	var new_password = req.body.new_password;
	var manValues = [access_token,old_password,new_password];
	var keys = ["access_token","old_password","new_password"];
	async.waterfall([
			function(callback){
				func.checkBlank(res,manValues,keys,callback);
			},
			function(callback){
				func.check_customer_token(res,access_token,callback);
			}
		],
		function(){
			var sql = 'select password from customers where access_token = ?';
			var values = [access_token];
			connection.query(sql,values,function(err1,res1){
				if(err1){
					sendResponse.sendErrorMessage(err1,res);
				}else{
					var enc_old_password = md5(old_password);
					var enc_new_password = md5(new_password);
					if(res1[0].password == enc_old_password){
						var sql1 = 'update customer set password = ? where access_token = ?';
						var values1 = [enc_new_password,access_token];
						connection.query(sql1,values1,function(err2,res2){
							if(err2){
								sendResponse.sendErrorMessage(err2,res);
							}else{
								sendResponse.sendSuccessData({},res);
							}
						})
					}else{
						var msg = 'Old password did not matched.';
						sendResponse.sendErrorMessage(msg,res);
					}
				}
			})
		}
		)
})


router.post('/forgot_password_customer',function(req,res,next){
	var email = req.body.email;
	if(email == '' || typeof(email) === 'undefined'){
		var msg = 'email is missing';
		sendResponse.sendErrorMessage(msg,res);
	}else{
		var sql = 'select * from customer where email = ?';
		var values = [email];
		connection.query(sql,values,function(err1,res1){
			if(err1){
				sendResponse.sendErrorMessage(err1,res);
			}else{
				if(res1.length>0){
					var str = '<p>Hi,</p>';
					str += "<p>We have received a password change request for your account.</p>";
                    str += "<p>If you made this request, then please click the below link to reset your password.</p>";
                    str += "<a href="+forgot_password_url+'?'+ activation_code + ">Click Here</a>";
                    str += "<p>If you did not ask to change your password, then please ignore this email. Another user may have entered your email by mistake. No changes will be made to your account.</p>"
                    str += "<p>Regards,</p>";
                    str += "<p>Team DiyoLiyo </p>";
                    var mailOptions = { to: email, subject: 'Password Recovery', html: str };
                    transporter.sendMail(mailOptions, function (error, info) {
                        if (error) {
                            console.log(error)
                            var errorMsg = 'some error occurred';
                            sendResponse.sendErrorMessage(errorMsg, res);
                        } else {
                        	var date = new Date();
                        	var activation_code = func.encrypt(email + date);
                        	var sql1= "update customer set activation_code = ? where email = ?";
                            var values2= [activation_code, email];
                            connection.query(sql, values, function (err, userInsertResult) {
                                if (err) {
                                    var errorMsg = 'some error occurred';
                                    sendResponse.sendErrorMessage(errorMsg, res);
                                } else {
                                    console.log('mail sent')
                                    var Msg = {}
                                    sendResponse.sendSuccessData(Msg, res);
                                }
                            })
                        }
                    })
				}else{
					var msg = 'Please enter valid email id';
					sendResponse.sendErrorMessage(msg,res);
				}
			}
		})
	}
})

	





module.exports = router;