/******/ (function(modules) { // webpackBootstrap
	/******/ 	// The module cache
	/******/ 	var installedModules = {};

	/******/ 	// The require function
	/******/ 	function __webpack_require__(moduleId) {

		/******/ 		// Check if module is in cache
		/******/ 		if(installedModules[moduleId])
		/******/ 			return installedModules[moduleId].exports;

		/******/ 		// Create a new module (and put it into the cache)
		/******/ 		var module = installedModules[moduleId] = {
			/******/ 			i: moduleId,
			/******/ 			l: false,
			/******/ 			exports: {}
			/******/ 		};

		/******/ 		// Execute the module function
		/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

		/******/ 		// Flag the module as loaded
		/******/ 		module.l = true;

		/******/ 		// Return the exports of the module
		/******/ 		return module.exports;
		/******/ 	}


	/******/ 	// expose the modules object (__webpack_modules__)
	/******/ 	__webpack_require__.m = modules;

	/******/ 	// expose the module cache
	/******/ 	__webpack_require__.c = installedModules;

	/******/ 	// identity function for calling harmory imports with the correct context
	/******/ 	__webpack_require__.i = function(value) { return value; };

	/******/ 	// define getter function for harmory exports
	/******/ 	__webpack_require__.d = function(exports, name, getter) {
		/******/ 		Object.defineProperty(exports, name, {
			/******/ 			configurable: false,
			/******/ 			enumerable: true,
			/******/ 			get: getter
			/******/ 		});
		/******/ 	};

	/******/ 	// getDefaultExport function for compatibility with non-harmony modules
	/******/ 	__webpack_require__.n = function(module) {
		/******/ 		var getter = module && module.__esModule ?
			/******/ 			function getDefault() { return module['default']; } :
			/******/ 			function getModuleExports() { return module; };
		/******/ 		__webpack_require__.d(getter, 'a', getter);
		/******/ 		return getter;
		/******/ 	};

	/******/ 	// Object.prototype.hasOwnProperty.call
	/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };

	/******/ 	// __webpack_public_path__
	/******/ 	__webpack_require__.p = "/dist/";

	/******/ 	// Load entry module and return exports
	/******/ 	return __webpack_require__(__webpack_require__.s = 1);
	/******/ })
/************************************************************************/
/******/ ([
	/* 0 */
	/***/ function(module, exports) {

		/**
		 * Created by qingcheng on 16/11/18.
		 */
		var internalValidMap = {
			"required": function(val) {
				return !!(val == 0 || val);
			},
			"number": function(val) {
				var value = val == 'null' ? '' : val;
				return !isNaN(value);
			},
			"length": function(val, l) {
				val  = val + '';
				return val.length == l;
			}
		};

		function Validator(name) {
			this.name = name;
			this.validTypes = '';
			this.validFns = null;
			this.erMsg = '';
		}

		function MiddleValidator(el) {
			this.el = el;
			this.validators = [];
		}

		MiddleValidator.prototype.init = function init() {
			var el = typeof this.el === 'string' ? document.querySelector(this.el) : this.el,
				children,
				name,
				valids,
				validType,
				validVal,
				validObj,
				fn,
				validFlag = 'valid-name',
				self = this;

			if(!el){
				throw Error('the element that is being verified can not be null!');
			}
			//compatible greater or equal than IE9
			children = toArray(el.querySelectorAll('[' + validFlag + ']'));
			children.forEach(function(item, index, arr) {
				name = item.getAttribute(validFlag);
				valids = item.getAttribute('validate');
				/*
				 use validate property as the validate rules's sign。
				 if there have multi validate rule,use "," as separator.
				 for example:
				 validate = "required,length:6,email"
				 */
				if(name && valids!= null){
					validObj = new Validator(name);
					valids = valids.split(';');
					if(valids[1]){
						validObj.erMsg = valids[1].split(':')[1];
					}
					valids = valids[0].split(',');
					validObj.validFns = [];
					validObj.validTypes = [];
					valids.forEach(function(valid) {
						validObj.validTypes.push(valid);
						valid = valid.split(':');
						validType = valid[0];
						validVal = valid[1];
						if(fn = internalValidMap[validType]){
							(function(f, e, val) {
								"use strict";
								validObj.validFns.push(function() {
									var data = e.value || e.getAttribute('valid-value');
									return f(data, val);
								});
							})(fn, item, validVal);
						}
					});
					fn = null;
					validObj.validTypes = validObj.validTypes.join();
					self.validators.push(validObj);
				}
			});
		};

		MiddleValidator.prototype.addValidator = function addValidator(opt) {
			var methodName = opt.name,
				method = opt.method,
				self = this,
				reg,
				matchRs,
				tag;
			if(typeof method !== 'function'){
				throw Error('the method of added validator must be function!');
			}
			internalValidMap[methodName] = method;
			reg = new RegExp(',?(' + methodName + '(:\w+)?)');
			self.validators.forEach(function(item) {
				"use strict";
				matchRs = item.validTypes.match(reg);
				if(matchRs && matchRs[1]){
					tag = self.el.querySelector('[valid-name="'+ item.name + '"]');
					(function(e, arg) {
						item.validFns.push(function() {
							var data = e.value || e.getAttribute('valid-value');
							return method(data, arg);
						});
					})(tag, matchRs[2]);
					tag = null;
					matchRs = null;
				}
			});
		};

		MiddleValidator.prototype.verify = function verify(showAllMsg) {
			var rs = true,
				m = 0,
				n,
				fns,
				erMsgs = [];

			while(m < this.validators.length){
				n = 0;
				fns = this.validators[m].validFns;
				while(n < fns.length){
					rs = fns[n]();
					if(!rs){
						break;
					}
					n++;
				}
				if(!rs){
					erMsgs.push([this.validators[m].name, this.validators[m].erMsg]);
					if(!showAllMsg){
						break;
					}
				}
				//if showAllMsg is true and previous validator vaildFns result is false
				//at this case if current validator validFns.length is 0,then it's erMsg
				//will bell push erMsgs arry!so we need do this.
				rs = true;
				m++;
			}
			erMsgs.length && (rs = false);
			if(rs){
				//清理内存,测试时需去掉
				//this.validators = [];
			}
			return {
				isValid: rs,
				erMsg: erMsgs
			};
		};

		function toArray(likeArr) {
			var rs = [],
				i = 0,
				l;

			if(!likeArr){
				return rs;
			}
			l = likeArr.length;
			for(i;i < l;i += 1){
				rs.push(likeArr[i]);
			}

			return rs;
		}

		module.exports = MiddleValidator;

		/***/ },
	/* 1 */
	/***/ function(module, exports, __webpack_require__) {

		/**
		 * Created by liuxinxin on 2016/11/18.
		 */
		var Validator = __webpack_require__(0);

		describe('formValid test', function() {
			var el = document.createElement('div'),
				str,
				valid,
				rs;

			str = '<div>' +
				'<input type="text" valid-name="user" validate="required,length:4;erMsg:请输入长度4位的用户名!" />' +
				'<input type="password" valid-name="pwd" validate="require,areaValid;erMsg:请输入合法的密码!" />' +
				'<input type="text" valid-name="code" validate="length:5,number;erMsg:验证码长度为5位数字!" />' +
				'<textarea valid-name="text" validate="areaValid;erMsg:内容必须包含AA字符!"></textarea>' +
				'<div valid-name="checkbox" validate="required;erMsg:请选择要吃的东西!">' +

				'<input type="checkbox" name="vehicle" value="Bike" />西红柿<br />' +
				'<input type="checkbox" name="vehicle" value="Car" />鸡蛋<br />' +
				'<input type="checkbox" name="vehicle" value="Airplane" />米饭<br />' +
				'</div>' +
				'</div>';
			el.innerHTML = str;
			document.body.appendChild(el);
			beforeEach(function() {
				valid = new Validator(el);
				el.querySelector('[valid-name="user"]').value = 'wertregf';
				el.querySelector('[valid-name="pwd"]').value = 'xxs';
				el.querySelector('[valid-name="code"]').value = 'ew2';
				el.querySelector('[valid-name="checkbox"]').setAttribute('valid-value', 'Car');
				valid.init();
			});

			it('init test', function() {
				valid = new Validator('wer');
				expect(function() {
					valid.init();
				}).toThrow();
				valid = new Validator(el);
				expect(function() {
					valid.init();
				}).not.toThrow();
			});

			it('verify test', function() {
				rs = valid.verify(true);
				console.log(rs);
				expect(rs.isValid).not.toBeTruthy();
				expect(rs.erMsg[0][1]).toBe('请输入长度4位的用户名!');
				el.querySelector('[valid-name="code"]').value = '87865';
				el.querySelector('[valid-name="user"]').value = '878s';
				rs = valid.verify();
				expect(rs.isValid).toBeTruthy();
				expect(rs.erMsg.length).toBe(0);
			});

			it('addValidator test', function() {
				valid.addValidator({
					name: 'areaValid',
					method: function(val){
						return val.indexOf('AA') > -1;
					}
				});
				el.querySelector('[valid-name="text"]').value = '87AA8';
				el.querySelector('[valid-name="code"]').value = '46234';
				el.querySelector('[valid-name="pwd"]').value = 'weAAr';
				el.querySelector('[valid-name="user"]').value = 'wq8s';
				rs = valid.verify();
				expect(rs.isValid).toBeTruthy();
				el.querySelector('[valid-name="text"]').value = '87nttny8';
				rs = valid.verify();
				expect(rs.isValid).not.toBeTruthy();
				expect(rs.erMsg[0][1]).toBe('内容必须包含AA字符!');
			});
		});

		/***/ }
	/******/ ]);