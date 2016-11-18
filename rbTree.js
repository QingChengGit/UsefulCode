/**
 * Created by qingcheng on 16/11/14.
 */
/*
    红黑树是每个节点都带有颜色属性的二叉查找树，颜色或红色或黑色.
     性质1. 节点是红色或黑色。
     性质2. 根节点是黑色。
     性质3. 每个红色节点的两个子节点都是黑色。(从每个叶子到根的所有路径上不能有两个连续的红色节点)
     性质4. 从任一节点到其每个叶子的所有路径都包含相同数目的黑色节点。

 层次(Level)： 结点的层次是从根开始定义起，根为第一层，根的孩子为第二层，依次递推。

 深度(Depth)： 树中结点的最大层次称为树的深度。
 */
function RBTree(comparison) {
    "use strict";
    /*
        for comparison(a, b) if it return true indicate a > b
      otherwise a < b, because RBTree node's key cannot be equal.
     */
    this.comparison = comparison;
    this.root = null;
}

function Node(key, val) {
    "use strict";
    this.key = key;
    this.val = val;
    //set node's default color is red
    this.isRed = true;
    this.parent = this.left = this.right = null;
}

RBTree.prototype.init = function init(data) {
    "use strict";

};

RBTree.prototype.add = function add(key, val) {
    "use strict";

};

RBTree.prototype.delete = function remove(key) {
    "use strict";

};

RBTree.prototype.getNodeByKey = function getNodeByKey(key) {
    "use strict";
    var p = this.root;

    while(p){
        if(key === p.key){
            return p;
        }
        if(_compare(key, p.key, this)){
            p = p.right;
        }else{
            p = p.left;
        }
    }
    return null;
};

/*
    a concept:
    如果被插入节点node和node的父节点都是他们对应的父节点的左子节点或者右子节点,则node节点是一个外侧子孙节点,
    否则node节点是一个内侧子孙节点。
 */
function _insertNode(tree, node) {
    "use strict";
    var p = tree.root,
        side = 'left',
        isSameSide = false;

    if(!tree.root){
        tree.root = node;
        //root node's color must be black!
        node.isRed = false;
        return;
    }
    while(p){
        if(node.key === p.key){
            p.val = node.val;
            return;
        }
        if(p.left && p.right){
            if(p.left.isRed && p.right.isRed){
                //如果p的两个子节点都为红色节点,则执行颜色变化
                //将p颜色变成红色,p的两个子节点变成黑色
                p.isRed = true;
                p.left.isRed = p.right.isRed = true;
                //此处需要检测p和p的父节点是否都是红色节点,从而导致不符合红黑树的定义规则
                if(p.parent.isRed){
                    //如果父节点也是红色,此时需要进行旋转
                    
                }
            }
        }
        if(_compare(node.key, p.key, tree)){
            if(p.right){
                p = p.right;
            }else{
                side = 'right';
                break;
            }
        }else{
            if(p.left){
                p = p.left;
            }else{
                break;
            }
        }
    }
    //now p is the inserted point
    if(!p.isRed){
        //if p's color is black then insert node directed!
        node.parent = p;
    }else{
        if((p.parent.left === p && side === 'left') ||
            (p.parent.right === p && side === 'right')){
            isSameSide = true;
        }
        if(isSameSide){
            //是外侧子孙节点
        }else{
            //是内侧子孙节点
        }
    }
}

function _compare(a, b, tree) {
    "use strict";
    if(typeof tree.comparison === 'function'){
        return tree.comparison(a, b);
    }else{
        return a > b;
    }
}

function _rotateLeft(node) {
    "use strict";
    var p = node.parent,
        g = p.parent;

    if(!g.parent){
        tree.root = p;
        p.parent = null;
        p.isRed = false;
    }else{
        p.parent = g.parent;
    }
    if(p.left){
        g.right = p.left;
        p.left.parent = g;
    }
    p.left = g;
    p.isRed = false;
    if(p.left)

    g.parent = p;
    g.isRed = !g.isRed;
}

function _rotateRight(tree, node) {
    "use strict";
    //以node节点的爷爷节点(grandpa)为顶点执行右旋转
    var p = node.parent,
        g = p.parent;

    if(!g.parent){
        //说明g是root节点
        tree.root = p;
        p.parent = null;
        //root节点必须为黑色
        p.isRed = false;

    }else{
        p.parent = g.parent;
    }
    if(p.right){
        g.left = p.right;
        p.right.parent = g;
    }
    p.right = g;
    //修改p的颜色
    p.isRed = false;

    g.parent = p;
    //修改g的颜色
    g.isRed = !g.isRed;
}