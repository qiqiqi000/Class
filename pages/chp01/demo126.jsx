import React from 'react';
//import data from '../../data/treeData.json';
import data from '../../data/productTree.json';
const allNodes = [];
export default class Demo126 extends React.Component {
  searchAllTreeNodes = (data, nodes=[])=> {
    data.forEach((item) => { 
      //console.log(item);
      allNodes.push(item);
      nodes.push(item);
      if (item.children?.length>0){ //等同于if (item.children && item.child.length>0)
        //遍历子节点
        this.searchAllTreeNodes(item.children, nodes);
      }
    });
    return nodes;
  }

  printTreeLevels(data) { //非递归树节点遍历算法
    //let result=[];
    let maxLevel = 0;
    let nodes=[...data];
    while (nodes.length>0){
      let node=nodes.shift();
      if (!node.parentnodeid || node.parentnodeid=='') node.level = 1;
      if (node.level>maxLevel) maxLevel = node.level;
      //result.push(node);
      //console.log(666,node.text);
      if (node.children?.length>0){
        for (let child of node.children) child.level = node.level + 1;
        nodes.unshift(...node.children);
      } 
    }
    console.log('maxLevel=', maxLevel)
    //return result;
  }

  findTreeNode = (data, pnode={}, path=[])=> {
    for (const node of data) {
      if (node.id === '88') {  //135
        //1.求一个88号商品的父节点
        console.log('parent=', pnode)
        //2.求88号商品的兄弟节点
        if (pnode.children){
          console.log('brothers=', pnode.children)         
        }
        //3.求88号商品的祖先节点
        console.log('ancestors=', path)
        return path;
      }
      //console.log(222, node)
      if (node.children) {
        pnode = node;
        const result = this.findTreeNode(node.children, pnode, path.concat(node));  //A101,A102时都是return []，A103时return 3层
        console.log(111,node, result,path)
        if (result.length > 0) {
          console.log(888,result,node)
          return result;
        }
      }
  }
  return [];
}

/*
    data.forEach((item) => { 
      //console.log(item);
      if (item.id=='88'){
        //1.求一个88号商品的父节点
        console.log('parent=', pnode)
        //2.求88号商品的兄弟节点
        if (pnode.children){
          console.log('brothers=', pnode.children)         
        }
        //3.求88号商品的祖先节点
        console.log('ancestor=', ancestor.concat(item))
        return ancestor.concat(item);
        //4.求10号商品的json路径[?].children[?].children....
      }
      if (item.children?.length>0){ //等同于if (item.children && item.child.length>0)
        //遍历子节点
        pnode = item;
        ancestor.push(item)
        let result = this.findTreeNode(item.children, pnode,  ancestor.concat(item));
        if (result.length > 0) {
          return result;
        }
      }
    });
    return [];
  }
  */

  render() {
    console.log(data)
    let nodes=this.searchAllTreeNodes(data);  //调用递归函数
    //let nodes=[];
    let path=this.findTreeNode(data);  //调用递归函数
    this.printTreeLevels(data);  //调用非递归函数
    console.log(777,path);
    return (  //输出各个元素变量    
      <div style={{marginLeft:12}}>
        {nodes.map((node)=>{
          return (<div key={node.id} style={{marginLeft:(node.level-1)*20}}>{node.text}</div>)
        })}
      </div>
    )
  }
}
