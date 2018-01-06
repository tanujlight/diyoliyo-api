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


router.post('/add_product',function(req,res,next){
	var access_token = req.body.access_token;
	var category_id = req.body.category_id;
	var sub_category_id = req.body.sub_category_id;
	var brand_id = req.body.brand_id;
	var product_name = req.body.product_name;
	var product_description = req.body.product_description;
	var final_price = req.body.final_price;
	var actual_price = req.body.actual_price;
	var measuring_unit = req.body.measuring_unit;
	var product_image = req.body.product_image;
	var manValues = [access_token,brand_id,product_name,product_description,final_price,actual_price,measuring_unit];
	async.waterfall([
		function(callback){
			func.checkBlank(res,manValues,callback);
		},
		function(callback){
			func.check_vendor_token(res,access_token,callback)
		}
	],
		function(){
			var date = new Date();
			if(category_id == '' || typeof(category_id) === 'undefined'){
				product_type=1;
			}else if(category_id != '' && sub_category_id == ''){
				product_type=2;
			}else{
				product_type=3;
			}
			var sql = 'insert into products(category_id,sub_category_id,brand_id,product_name,product_description,final_price,actual_price,measuring_unit,created_on,product_type) values(?,?,?,?,?,?,?,?,?,?)';
			var values = [category_id,sub_category_id,brand_id,product_name,product_description,final_price,actual_price,measuring_unit,date,product_type];
			connection.query(sql,values,function(err1,res1){
				if(err1){
					sendResponse.sendErrorMessage(err1,res);
				}else{
					if(res1.affesctedRows>0){
						var pro_id = res1.insertId;
						for(var i=0;i<images.length;i++){
							var sql2 = 'insert into product_images(image_path,product_id,created_on) values(?,?,?)';
							var values2 = [images[i],pro_id,date];
							connection.query(sql2,values2,function(err2,res2){
								if(err2){
									sendResponse.sendErrorMessage(err2,res);
								}else{
									if(res2.affectedRows>0){
										sendResponse.sendSuccessData({product_id:pro_id},res);
									}else{
										sendResponse.sendErrorMessage('Product images not saved',res);
									}
								}
							})
						}
						
					}else{
						var msg = 'Product not created';
						sendResponse.sendErrorMessage(msg,res);
					}
				}
			})
		}
	)
})


router.post('/forgot_password',function(req,res,next){
	var email = req.body.email;
	if(email == '' || typeof(email) === 'undefied'){
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


//Update Password
router.put('/update_password_vendor', function (req, res, next) {
    var verification_token = req.body.verification_token;
    var new_password = req.body.password;
    // var encrypt_password = md5(new_password);
    var manValues = [verification_token, new_password];
    async.waterfall([
        function (callback) {
            func.checkBlank(res, manValues, callback);
        }],
        function () {
            var sql = "SELECT verification_token, password FROM vendor where verification_token=?";
            var values = [verification_token];
            connection.query(sql, values, function (err, rows) {
                if (err) {
                    console.log("error1")
                    var Msg = 'some error occurred';
                    sendResponse.sendErrorMessage(Msg, res);
                } else {
                    if (rows == "") {
                        var Msg = 'Unauthorised access!';
                        sendResponse.sendErrorMessage(Msg, res);
                    } else {
                        if (verification_token == rows[0].verification_token) {
                            var loginTime = new Date();
                            var code = func.encrypt(verification_token + loginTime);
                            var sql = "update vendor set password = ? , verification_token = ? where verification_token = ?";
                            var values = [new_password, code, verification_token];
                            connection.query(sql, values, function (err, userInsertResult) {
                                if (err) {
                                    console.log("error2")
                                    var Msg = 'Unauthorised access!';
                                    sendResponse.sendErrorMessage(Msg, res);
                                } else {
                                    var Msg = {};
                                    sendResponse.sendSuccessData(Msg, res);
                                }
                            })
                        }
                    }
                }
                ;
            });
        });
});

	
	router.post('/delete_product',function(req,res,next){
		var access_token = req.body.access_token;
		var product_id = req.body.product_id;
		var manValues = [access_token,product_id];
		async.waterfall([
			function(callback){
				func.checkBlank(res,manValues,callback);
			},
			function(callback){
				func.check_vendor_token(res,access_token,callback);
			}
		],
		function(){
			var sql = 'delete from products where product_id = ?';
			var values = [product_id];
			connection.query(sql,values,function(err1,res1){
				if(err1){
					sendResponse.sendErrorMessage(err1,res);
				}else{
					if(res1.affectedRows>0){
						sendResponse.sendSuccessData({},res);
					}else{
						var msg = 'Product not deleted';
						sendResponse.sendErrorMessage(msg,res);
					}
				}
			}
		}
		)
	})
	
module.exports = router;