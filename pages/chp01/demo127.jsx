import React from 'react';
import data from '../../data/treeData.json';
export default class Demo127 extends React.Component {
  searchAllTreeNodes = (data, parent = null, nodes = [])=> {
    data.forEach((item) => { 
      //在遍历结点的地方处理结点
      let node = {...item};
      //1)设置isparentflag为1或0，只有父节点时才设置为1
      node.isparentflag = (node.children?.length>0)? 1 : 0;
      //2）前面必须记录其父节点parent，根据父节点来计算其子结点的level和ancestor的值
      if (parent == null){
        //没有父结点表示该节点为第一层结点，level为1，无祖先结点
        node.level = 1;
        node.ancester = ' ';
      }else{
        //存在父节点时，level值为父节点的level+1，祖先结点为父结点的祖先结点加上父结点。也就是说，你的祖先就是你老爸的祖先加上你老爸。
        node.level = parent.level + 1;
        node.ancester = parent.ancester+ node.parentnodeid+'#' //祖先结点用#分隔，最右边也有#;
      }
      nodes.push(node); //添加到数组
      if (node.children?.length>0){ //等同于if (node.children && node.child.length>0)
        this.searchAllTreeNodes(node.children, node, nodes);
      }                   
    });
    return nodes;
  }

  render() {      
    let nodes = this.searchAllTreeNodes(data);  //调用递归函数
    console.log(data);
    return ( 
      <div style={{marginLeft:12}}>
        {  //输出各个节点，每个节点按照level值像右凹进一定量的像素
         nodes.map((node)=>{
            return (<div key={node.id} style={{marginLeft:24*(node.level-1)}}>{node.text+'（第'+node.level+'层）'}</div>)
          })
        }
      </div>
    )
  }
}
