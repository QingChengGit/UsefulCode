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
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/dist/";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by liuxinxin on 2016/11/18.
	 */
	var Validator = __webpack_require__(2);

	describe('formValid test', function() {
	    var el = document.createElement('div'),
	        str,
	        valid;

	    str = '<div>' +
	        '<input type="text" name="user" validate="required,length:4" />' +
	        '<input type="password" name="pwd" validate="require,areaValid" />' +
	        '<input type="text" name="code" validate="length:5,number" />' +
	        '<textarea name="text" validate="areaValid"></textarea>' +
	        '</div>';
	    el.innerHTML = str;
	    document.body.appendChild(el);
	    beforeEach(function() {
	        valid = new Validator(el);
	        el.querySelector('[name="user"]').value = 'wertregf';
	        el.querySelector('[name="pwd"]').value = 'xxs';
	        el.querySelector('[name="code"]').value = 'ew2';
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
	        expect(valid.verify()).not.toBeTruthy();
	        el.querySelector('[name="code"]').value = '87865';
	        el.querySelector('[name="user"]').value = '878s';
	        expect(valid.verify()).toBeTruthy();

	    });

	    it('addValidator test', function() {
	        valid.addValidator({
	            name: 'areaValid',
	            method: function(val){
	                return val.indexOf('AA') > -1;
	            }
	        });
	        el.querySelector('[name="text"]').value = '87AA8';
	        el.querySelector('[name="code"]').value = '46234';
	        el.querySelector('[name="pwd"]').value = 'weAAr';
	        el.querySelector('[name="user"]').value = 'wq8s';
	        expect(valid.verify()).toBeTruthy();
	        el.querySelector('[name="text"]').value = '87nttny8';
	        expect(valid.verify()).not.toBeTruthy();
	    });
	});

/***/ },
/* 1 */,
/* 2 */
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
	        self = this;

	    if(!el){
	        throw Error('the element that is being verified can not be null!');
	    }
	    //compatible greater or equal than IE9
	    children = toArray(el.querySelectorAll('input'));
	    children = children.concat(toArray(el.querySelectorAll('textarea')));
	    children.forEach(function(item, index, arr) {
	        name = item.getAttribute('name');
	        valids = item.getAttribute('validate');
	        /*
	            use validate property as the validate rules's sign。
	            if there have multi validate rule,use "," as separator.
	            for example:
	            validate = "required,length:6,email"
	         */
	        if(name && valids){
	            valids = valids.split(',');
	            valids.length && (validObj = new Validator(name));
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
	                            return f(e.value, val);
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
	            tag = self.el.querySelector('[name="'+ item.name + '"]');
	            (function(e, arg) {
	                item.validFns.push(function() {
	                    return method(e.value, arg);
	                });
	            })(tag, matchRs[2]);
	            tag = null;
	            matchRs = null;
	        }
	    });
	};

	MiddleValidator.prototype.verify = function verify() {
	    var rs = true,
	        m = 0,
	        n,
	        fns;

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
	            break;
	        }
	        m++;
	    }
	    if(rs){
	        //清理内存
	        this.validators = [];
	    }
	    return rs;
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

/***/ }
/******/ ]);