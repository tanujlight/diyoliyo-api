var express = require('express');
var router = express.Router();
var async = require('async');
var randomstring = require('randomstring');
var md5 = require('md5');
var request = require('request');
var func = require('./../commonfunction');
var sendResponse = require('./../sendresponse');
var moment = require('moment');

router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});


router.post('/admin_login',function(req,res,next){
	var email = req.body.email;
	var password = req.body.password;
	var keys = ['email','password'];
	var manValues = [email,password];
	async.waterfall([
		function(callback){
			func.checkBlank(res,manValues,keys,callback);
		},function(callback){
			func.check_email_existence(res,email,callback);
		}
	],
	function(){
		var sql = 'select * from vendor where email = ? and status = 1';
		var values = [email];
		connection.query(sql,values,function(err1,res1){
			if(err1){
				sendResponse.sendErrorMessage(err1,res);
			}else{
				if(res1.length>0){
					if(res1[0].password == enc_password){
						var data = {"user_id":res1[0].vendor_id,"first_name":res1[0].first_name,"last_name":res1[0].last_name,"gender":res1[0].gender,"email":res1[0].email,"access_token":res1[0].access_token};
						sendResponse.sendSuccessData(data,res);
					}else{
						var msg = 'Password did not matched';
						sendResponse.sendErrorMessage(msg,res);
					}
				}else{
					var msg = 'Please enter valid Email id';
					sendResponse.sendErrorMessage(msg,res);
				}
			}
		}
	}
	)
}

router.post('/create_category',function(req,res,next){
	var access_token = req.body.access_token;
	var category_name = req.body.category_name;
	var manValues = [access_token,category_name];
	var keys = ['access_token','category_name'];
	async.waterfall([
		function(callback){
			func.checkBlank(res,manValues,keys,callback);
		},
		function(callback){
			func.check_admin_token(res,access_token,callback);
		}
	],
	function(){
		var date =  moment(moment.now()).format("YYYY/MM/DD");
		var sql = 'insert into category(category_name,created_on) values(?,?)';
		var values = [category_name,date];
		connection.query(sql,values,function(err1,res1){
			if(err1){
				sendResponse.sendErrorMessage(err1,res);
			}else{
				if(res1.affectedRows>0){
					var data = {"category_id":res1.insertId,"category_name":category_name};
					sendResponse.sendSuccessData(data,res);
				}else{
					var msg = 'Category not created';
					sendResponse.sendErrorMessage(msg,res);
				}
			}
		}
	}
	)
}


router.post('/create_sub_category',function(req,res,next){
	var access_token = req.body.access_token;
	var category_id = req.body.category_id;
	var sub_category_name = req.body.sub_category;
	var manValues = [access_token,category_id,sub_category_name];
	var keys = ['access_token','category_id','sub_category_name'];
	async.waterfall([
		function(callback){
			func.checkBlank(res,manValues,keys,callback);
		},
		function(callback){
			func.check_admin_token(res,access_token,callback);
		},
		function(callback){
			func.check_category_id(res,category_id,callback);
		}
	],
		function(){
			var date = moment(moment.now()).format("YYYY/MM/DD");
			var sql1 = 'select sub_category_name from sub_category where categoy_id = ? and sub_category_name = ?';
			var values1 = [category_id,sub_category_name];
			connection.query(sql1,values1,function(err2,res2){
				if(err2){

				}else{
					if(res2.length>0){
						var msg = 'Sub Category of this name already exists. Please enter other name.';
						sendResponse.sendErrorMessage(msg,res);
					}else{
						var sql = 'insert into sub_category(sub_category_name,category_id,created_on) values(?,?,?)';
						var values = [sub_category_name,category_id,date];
						connection.query(sql,values,function(err1,res1){
							if(err1){
								sendResponse.sendErrorMessage(err1,res);
							}else{
								if(res1.affectedRows>0){
									var data = {"sub_category_id":res1.insertId};
									sendResponse.sendSuccessData(data,res);
								}else{
									var msg = 'Sub-Category not created';
									sendResponse.sendErrorMessage(msg,res);
								}
							}
						}
						}
							}
						})
					}
				}
			})
			
		}
	)
})


router.post('/add_attribute',function(req,res,next){
	var access_token = req.body.access_token;
	var attribute_name = req.body.attribute_name;
	var attribute_values = req.body.attribute_values;
	var values_arr = values.split("##");
	var manValues = [attrbute_name,attribute_values];
	var keys = ["attrbute_name","attribute_values"];
	var date = moment(moment.now()).format("YYYY/MM/DD");
	async.waterfall([
		function(callback){
			func.checkBlank(res,manValues,keys,callback);
		},
		function(callback){
			func.check_admin_token(res,access_token,callback);
		}
		],
		function(){
			var sql = 'insert into attribute(attribute_name,created_on) values(?,?)';
			var values = [attribute_name,date];
			connection.query(sql,values,function(err1,res1){
				if(err1){
					sendResponse.sendErrorMessage(err1,res);
				}else{
					if(res1.affectedRows>0){
					var attribute_id = res1.insertId;
					for(var i=0;i<values_arr.length;i++){
						if(i == 0){
							values1 = '('+attribute_id+','+attribute_value[i]+','+date+')';
						}else{
							values1 = ',('+attribute_id+','+attribute_value[i]+','+date+')';
						}
						if(i == values_arr.length-1){
							var sql1 = 'insert into attribute_values(attribute_id,attribute_value,created_on) values'+values1;
							connection.query(sql1,function(err2,res2){
								if(err2){
									sendResponse.sendErrorMessage(err2,res);
								}else{
									if(res2.affectedRows>0){
										sendResponse.sendSuccessData({},res);
									}else{
										var msg = 'Attribute Values not created';
										sendResponse.sendErrorMessage(msg,res);
									}
								}
							})
						}
					}
				}else{
						var msg = 'Attribute not created';
						sendResponse.sendErrorMessage(msg,res);
				}
			}
		})
	})
})


router.put('/edit_attribute',function(req,res,next){
	var access_token = req.body.access_token;
	var attribute_id = req.body.attribute_id;
	var attribute_name = req.body.attribute_name;
	var attribute_value_id = req.body.attribute_value_id;
	var attribute_value_id_arr = attribute_value_id.split('##');
	var attribute_values = req.body.attribute_values;
	var values_arr = attribute_values.split("##");
	var manValues = [attrbute_name,attribute_values];
	var keys = ["attrbute_name","attribute_values"];
	var date =  moment(moment.now()).format("YYYY/MM/DD");
	async.waterfall([
		function(callback){
			func.checkBlank(res,manValues,keys,callback);
		},
		function(callback){
			func.check_admin_token(res,access_token,callback);
		}
		],
		function(){
			var sql1 = 'delete from attribute_values where attribute_id = ?';
			var values1 = [attribute_id];
			connection.query(sql1,values1,function(err2,res2){
				if(err2){

				}else{
					var sql = 'update attribute set attribute_name=? where attribute_id = ?';
					var values = [category_id,sub_category_id,attribute_name,attribute_id];
					connection.query(sql,values,function(err1,res1){
					if(err1){
						var msg = 'Something went wrong. Please try again later.';
						sendResponse.sendErrorMessage(msg,res);
					}else{
						if(res1.affectedRows>0){
							for(var i=0;i<attribute_value_id_arr.length;i++){
							if(i == 0){
								values1 = '('+attribute_id+','+sub_category_id+','+values_arr[i]+','+date+')';
							}else{
								values1 = ',('+attribute_id+','+sub_category_id+','+values_arr[i]+','+date+')';
							}
							if(i == values_arr.length-1){
								var sql1 = 'insert into attribute_values(attribute_id,attribute_value,created_on) values'+values1;
								connection.query(sql1,function(err2,res2){
								if(err2){
									sendResponse.sendErrorMessage(err2,res);
								}else{
									if(res2.affectedRows>0){
										sendResponse.sendSuccessData({},res);
									}else{
										var msg = 'Attribute Values not created';
										sendResponse.sendErrorMessage(msg,res);
									}
								}
							})
						}
					}
				}else{
					var msg = 'Attribute not created';
					sendResponse.sendErrorMessage(msg,res);
				}
			}
		})
		}
		})
			
	})
})

module.exports = router;