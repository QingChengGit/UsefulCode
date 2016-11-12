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