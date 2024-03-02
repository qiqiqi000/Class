import React from 'react';
import data from '../../data/categorytree.json';
export default class Demo130 extends React.Component {
    //递归函数算法，为每个叶子结点增加一个amount列并赋值
    searchAllTreeNodes = (data, nodes = [])=> {
    data.forEach((item) => { 
      if (item.isparentflag == 0) item.amount = 1; //item.amount=parseFloat((Math.random()*90+10).toFixed(2));
      else item.amount = 0;
      //将结点以线性表形式存储到nodes数组中，此排序与结点的值无关，与父节点子结点相关
      nodes.push(item);
      if (item.children?.length>0){
        //遍历子节点
        this.searchAllTreeNodes(item.children, nodes);
      }                   
    });
    return nodes;
  }
  //非递归算法，逐级汇总amount值
  sumupTreeNodes = (nodes)=> {
    //生成一个10个元素的数组，用来保存每一层所有节点amount的汇总值，树结点最多10层（不是10个结点）
    let arr = new Array(10).fill(0);
    //自底向上汇总
    for (let i=nodes.length-1; i>=0; i--){
        let node = nodes[i];
        let isparentflag = parseInt(node.isparentflag);
        let level = parseInt(node.level);
        if (isparentflag == 1){
          //如果是父节点（例如H2，level=2,则其amount值为array[3]，也就是H201,H202,H203的值之和
          node.amount = arr[level+1];
          arr[level+1]=0;
          arr[level] += node.amount; //父结点的值求出来之后，现需要累加到arr[level]中，例如H2的值也要与H3累计，为父结点H的计算做准备
        }else{
           //console.log(node.text, node.amount, arr[level], level)
           arr[level] += node.amount;
        }        
    };
    return nodes;
  }
  
  render() {      
    let nodes = this.searchAllTreeNodes(data);  //调用递归函数设置amount的值
    console.log(nodes);
    nodes= this.sumupTreeNodes(nodes); //调用非递归函数，计算父节点的值
    console.log(nodes);
    return (  //输出各个结点的值    
      <div style={{marginLeft:12}}>
        {  //输出各个节点，每个节点按照level值像右凹进一定量的像素
         nodes.map((node)=>{
            return (<div key={node.id} style={{color:node.isparentflag>0? 'red':'black', marginLeft:24*(node.level-1)}}>{node.text+', amount='+node.amount}</div>)
          })
        }
      </div>
    )
  }
}
