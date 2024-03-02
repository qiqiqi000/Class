import React from 'react';
import productData from '../../data/products.json';
import categorytreeData from '../../data/categorytree.json';
//const allNodes = [];
export default class Demo126 extends React.Component {
  searchAllTreeNodes = (data)=> {
    //删除树中其他属性，保留id, key, text, parentnodeid等几个属性
    data.forEach((item) => { 
      //删除item中的这些属性，data数组中这个结点的属性也被删除
       delete item.isparentflag;
       delete item.level;
       delete item.ancestor;
       delete item.subcategoryid;
       delete item.description;
       delete item.englishname;
       delete item._rowindex;
       delete item.total;
       //console.log(item.text, item);
      //allNodes.push(item);  //将节点存储到一个数组中，转为线性表存储
      if (item.children?.length>0){ //等同于if (item.children && item.child.length>0)
        //遍历子节点
        this.searchAllTreeNodes(item.children);
      }                   
    });
  }
  render() {      
    console.log(categorytreeData);
    let data = categorytreeData;
    this.searchAllTreeNodes(data);  //调用递归函数
    console.log(JSON.stringify(data));
    console.log(data);
    return (  //输出各个元素变量    
      <div style={{marginLeft:12}}>
      </div>
    )
  }
}
