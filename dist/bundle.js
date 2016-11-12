/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/dist/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/*!***************************************************!*\
  !*** ../UsefulCode/test/specs/binaryTree_spec.js ***!
  \***************************************************/
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by qingcheng on 16/11/12.
	 */
	var BinaryTree = __webpack_require__(/*! ../../binaryTree */ 1);
	
	describe('BinaryTree algorithm test', function() {
	    "use strict";
	    var tree = new BinaryTree();
	    beforeEach(function() {
	        tree.init([
	                {key: 2, val: 'we'},
	                {key: 36, val: '俄访问'},
	                {key:12, val: 'eqr'},
	                {key:5, val: 'go'}
	            ]
	        );
	    });
	
	    it('init', function() {
	        //spyOn跟踪函数调用;spayOn chain and.callThrough will delegate it to actual implementation!ßß
	        spyOn(tree, 'addNode').and.callThrough();
	        tree.init([{key: 66, val: 're'}]);
	        expect(tree.addNode).toHaveBeenCalled();
	        expect(tree.getNodeByKey(66).val).toBe('re');
	    });
	
	    it('preTravers', function() {
	        expect(tree.preTravers()).toBe('2,36,12,5');
	    });
	
	    it('middleTravers', function() {
	        expect(tree.middleTravers()).toBe('2,5,12,36');
	    });
	
	    it('postTravers', function() {
	        expect(tree.postTravers()).toBe('5,12,36,2');
	    });
	
	    it('getNodeByKey', function() {
	        expect(tree.getNodeByKey(12).val).toBe('eqr');
	        expect(tree.getNodeByKey(5).key).toBe(5);
	        expect(tree.getNodeByKey(18)).toBe(null);
	        expect(tree.getNodeByKey()).toBe(null);
	    });
	
	    it('addNode', function() {
	        tree.addNode(1, 'qingcheng');
	        expect(tree.getNodeByKey(1).val).toBe('qingcheng');
	        tree.addNode(22);
	        expect(tree.getNodeByKey(22).val).not.toBeTruthy();
	        tree.addNode(0, 'zero');
	        expect(tree.getNodeByKey(0).val).toBe('zero');
	        expect(function() {
	            tree.addNode('', '34')
	        }).toThrow();
	    });
	
	    it('deleteNode', function() {
	        expect(tree.deleteNode(12).key).toBe(12);
	        expect(tree.getNodeByKey(12)).toBe(null);
	        expect(tree.deleteNode(34)).toBe(null);
	    });
	});

/***/ },
/* 1 */
/*!***********************************!*\
  !*** ../UsefulCode/binaryTree.js ***!
  \***********************************/
/***/ function(module, exports) {

	/**
	 * Created by qingcheng on 16/11/8.
	 */
	/*
	 二叉查找树（Binary Search Tree），也称有序二叉树（ordered binary tree）,排序二叉树（sorted binary tree），
	 是指一棵空树或者具有下列性质的二叉树：
	
	 1. 若任意节点的左子树不空，则左子树上所有结点的键值均小于它的根结点的键值；
	
	 2. 若任意节点的右子树不空，则右子树上所有结点的键值均大于它的根结点的键值；
	
	 3. 任意节点的左、右子树也分别为二叉查找树。
	
	 4. 没有键值相等的节点（no duplicate nodes）
	 */
	
	function Node(key, val) {
	    "use strict";
	    if(key != '0' && !key){
	        throw Error("node's key can not be empty");
	    }
	    this.key = key;
	    this.val = val;
	    this.parent = this.left = this.right = void 0;
	}
	
	function BinaryTree(comparison) {
	    "use strict";
	    this.root = void 0;
	    this.comparison = comparison;
	}
	
	BinaryTree.prototype.addNode = function addNode(key, val) {
	    "use strict";
	    var p = new Node(key, val);
	    _insertNode(this, p);
	    return p;
	};
	
	BinaryTree.prototype.deleteNode = function deleteNode(key) {
	    "use strict";
	    var target = this.getNodeByKey(key),
	        chainRoot,
	        chainLeaf,
	        chainOneChild,
	        chainTwoChild;
	
	    if(!target){
	        return null;
	    }
	    chainRoot = new Chain(_deleteRootNode);
	    chainLeaf = new Chain(_deleteLeafNode);
	    chainOneChild = new Chain(_deleteHasOneChildNode);
	    chainTwoChild = new Chain(_deleteHasTwoChildNode);
	
	    chainRoot.setNextProcessor(chainLeaf);
	    chainLeaf.setNextProcessor(chainOneChild);
	    chainOneChild.setNextProcessor(chainTwoChild);
	
	    chainRoot.run(this, target);
	    return target;
	};
	
	BinaryTree.prototype.getNodeByKey = function getNodeByKey(key) {
	    "use strict";
	    return _searchByKey(this, key);
	};
	
	BinaryTree.prototype.preTravers = function preTravers() {
	    "use strict";
	    //前序遍历
	    var root = this.root,
	        rs = [];
	
	    if(!root){
	        return '';
	    }
	    _preTravers(root, rs);
	
	    return rs.join();
	};
	
	BinaryTree.prototype.middleTravers = function middleTravers() {
	    "use strict";
	    //中序遍历
	    var root = this.root,
	        rs = [];
	
	    if(!root){
	        return '';
	    }
	    _middleTravers(root, rs);
	
	    return rs.join();
	};
	
	BinaryTree.prototype.postTravers = function postTravers() {
	    "use strict";
	    //后序遍历
	    var root = this.root,
	        rs = [];
	
	    if(!root){
	        return '';
	    }
	    _postTravers(root, rs);
	
	    return rs.join();
	};
	
	BinaryTree.prototype.init = function init(data) {
	    "use strict";
	    var self = this;
	    if(typeof data === 'undefined'){
	        _clearTree(self);
	        return;
	    }
	    if(Object.prototype.toString.call(data) === '[object Array]'){
	        _clearTree(self);
	        data.forEach(function(item, index) {
	            self.addNode(item.key, item.val);
	        });
	    }
	};
	
	function _insertNode(tree, node) {
	    "use strict";
	    var p,
	        flag = true;
	
	    if(!tree.root){
	        tree.root = node;
	        return;
	    }
	    p = tree.root;
	    while(p && flag){
	        if(_compare(node.key, p.key, tree.comparison)){
	            //node's key greater than p's key
	            if(!p.right){
	                p.right = node;
	                flag = false;
	            }else{
	                p = p.right;
	            }
	        }else{
	            if(!p.left){
	                p.left = node;
	                flag = false;
	            }else{
	                p = p.left;
	            }
	        }
	    }
	    node.parent = p;
	}
	
	function _searchByKey(tree, key) {
	    "use strict";
	    var p;
	
	    p = tree.root;
	    if((key != '0' && !key) || !p){
	        return null;
	    }
	    while(p){
	        if(p.key === key){
	            return p;
	        }else{
	            if(_compare(key, p.key)){
	                p = p.right;
	            }else{
	                p = p.left;
	            }
	        }
	    }
	    return null;
	}
	
	function _compare(a, b, comparison) {
	    "use strict";
	    // if a > b return true otherwise return false;
	    if(typeof comparison === 'function'){
	        return comparison(a, b);
	    }else{
	        return a > b;
	    }
	}
	
	function _clearTree(tree) {
	    "use strict";
	    if(tree.root){
	        //clear tree
	        tree.root.left = tree.root.right = null;
	        tree.root = null;
	    }
	}
	
	function _deleteRootNode(tree, node) {
	    var successor;
	
	    if(node.parent){
	        return "nextProcess";
	    }
	    if(!node.left && !node.right){
	        tree.root = null;
	    }else if(node.left && node.right){
	        successor = _getSuccessor(node);
	        tree.root = successor;
	        successor.parent = null;
	        successor.left = node.left;
	        successor.right = node.right;
	    }else{
	        tree.root = node.left || node.right;
	        if(node.left){
	            node.left.parent = null;
	        }else{
	            node.right.parent = null;
	        }
	    }
	    node.left = node.right = null;
	}
	
	function _deleteLeafNode(tree, node) {
	    if(node.left || node.right){
	        return "nextProcess";
	    }
	    //node is leaf node
	    if(node.parent.left === node){
	        node.parent.left = null;
	    }else{
	        node.parent.right = null;
	    }
	    node.parent = null;
	}
	
	function _deleteHasOneChildNode(tree, node) {
	    if(node.left && node.right){
	        return "nextProcess";
	    }
	    if(node.parent.left === node){
	        node.parent.left = node.left || node.right;
	        if(node.left){
	            node.left.parent = node.parent;
	            node.left = null;
	        }else{
	            node.right.parent = node.parent;
	            node.right = null;
	        }
	        node.parent = null;
	    }
	}
	
	function _deleteHasTwoChildNode(tree, node) {
	    var successor;
	
	    if(!(node.left && node.right)){
	        return "nextProcess";
	    }
	    successor = _getSuccessor(node);
	    successor.parent = node.parent;
	    successor.left = node.left;
	    successor.right = node.right;
	
	    node.parent = node.left = node.right = null;
	}
	/*
	    获取node节点的后继节点，主要用于删除二叉树中的某个节点有两个子节点的情况
	 */
	function _getSuccessor(node) {
	    var cur = node;
	        p = node.left;
	
	    while(p){
	        p = p.left;
	        cur = cur.left;
	    }
	    return cur;
	}
	
	function Chain(fn){
	    this.fn = fn;
	    this.nextProcessor = null;
	}
	
	Chain.prototype.setNextProcessor = function setNextProcessor(processor) {
	    if(!processor || processor instanceof Chain){
	        this.nextProcessor = processor;
	    }
	};
	
	Chain.prototype.run = function runChain() {
	    var rs,
	        self = this;
	
	    rs = this.fn.apply(self, arguments);
	    if(rs === 'nextProcess'){
	        this.nextProcessor && this.nextProcessor.run.apply(this.nextProcessor, arguments);
	    }
	};
	
	function _preTravers(node, out) {
	    "use strict";
	    out.push(node.key);
	
	    if(node.left){
	        _preTravers(node.left, out);
	    }
	    if(node.right){
	        _preTravers(node.right, out);
	    }
	}
	
	function _middleTravers(node, out) {
	    "use strict";
	
	    if(node.left){
	        _middleTravers(node.left, out);
	    }
	    out.push(node.key);
	    if(node.right){
	        _middleTravers(node.right, out);
	    }
	}
	
	function _postTravers(node, out) {
	    "use strict";
	
	    if(node.left){
	        _postTravers(node.left, out);
	    }
	    if(node.right){
	        _postTravers(node.right, out);
	    }
	    out.push(node.key);
	}
	
	module.exports = BinaryTree;

/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map