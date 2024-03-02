import React from 'react';
import categorytreeData from '../../data/categorytree.json';
export default class Demo127 extends React.Component {
  //采用递归的方法
  findTreeNode = (data, key, parent = null) => {
    for (let node of data) {
      //console.log(node.text);
      if (node.key === key) {
        //console.log(111,node.text);
        if (parent) console.log(999,parent.text);
        //找到节点node，pnode为其父结点对象
        return {node, parent};
      }
      if (node.children && node.children.length>0) {
         //处理node的子节点，这时node为他们的父节点
         const result = this.findTreeNode(node.children, key, node);
         //console.log(444,result);
         if (result) {
            return result;
         }
      }
    }
    return null;
  };


  render() {
    let data = categorytreeData;
    let node, parent, priornode, nextnode, cnodes;
    let result = this.findTreeNode(data, 'H202');
    if (result) {
        node = result.node;
        parent = result.parent;
        //console.log(node,parent);
        if (parent != null){
          let cnodes = parent.children;
          let index = cnodes.findIndex((item)=>item.id == node.id);
          //console.log(222,cnodes, index)
          if (index>0) priornode=cnodes[index-1]; 
          if (index<cnodes.length-1) nextnode=cnodes[index+1];
        }else{
          //没有父节点，也就是第一层节点，那么兄弟节点从data中直接去找
          let index = data.findIndex((item)=>item.id == node.id);
          if (index > 0) priornode = data[index-1]; 
          if (index < data.length-1) nextnode = data[index+1];
        }
    }else{
      //alert(key+'结点找不到!');
    }
    return (
      <div style={{marginLeft:16}}>
        <div>{node ? '"结点：'+node.text+'"已找到' : '结点找不到'}</div>
        <div>{parent ? '"父结点为: '+parent.text+'"' : '无父结点'}</div>
        <div>{priornode ? '上一个兄弟结点为: "' + priornode.text+'"' : '无上一个兄弟结点'}</div>
        <div>{nextnode  ? '下一个兄弟结点为: "' + nextnode.text+'"'  : '无下一个兄弟结点'}</div>        
      </div>
    )
  }
}
