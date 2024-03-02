import React from 'react';
import treeData from '../../data/categorytree.json';
export default class Demo129 extends React.Component {
  getTreeNodePath = (data, node)=>{  //其中node是一个JSON对象，包括id和ancestor
    //找到一个节点node在data数组中的路径，例如H201：data[7].children[1].children[0]
    let path='';  //结点路径
    let index=-1;  //子节点在父节点中的序号
    let parent = null;  //结点node的父结点，即最后一个祖先结点
    let xdata = [...data];  //因为xdata会变化而data不能变，因此使用省略号赋值数组
    if (node.ancestor!==undefined && node.ancestor!==''){
      //按#分隔，根据祖先结点ancestor中的每一个值去查找各层的祖先结点
      let tmp = node.ancestor.split('#');  //例如H#H2#
      for (let i=0; i<tmp.length-1; i++){  //以‘#’分割，数组中最后一个字符为空字符，故循环减少一次
          index = xdata.findIndex(item => item.id == tmp[i]);
          if (index >= 0){  //找到祖先结点
            path += '['+index+'].children';  //累加路径
            parent=xdata[index];  //记录父结点
            xdata = xdata[index].children;  //将父结点的下一层节点赋值给xdata，继续查找祖先结点
          }else{
            break;
          }
      }
      //循环退出，祖先结点处理完成，得到的path举例为[7].children[1].children。
      //求node结点在其父结点中的下标号，将上面的path变成[7].children[1].children[0]
      if (parent?.children){
        index = parent.children.findIndex(item => item.id == node.id);
        if (index >= 0) path+='['+index+']';
    }
    }else{
      //没有父结点就是根结点，即第一层结点，直接在data数组中找下标
      index = data.findIndex(item => item.id == node.id);
      if (index>=0) path='['+index+']';
    }
    if (path!=='') path='data'+path;  //下标之前添加data这个数组的名称，[7].children[1].children[0]变成data[7].children[1].children[0]
    return path;
  }
  //创建添加子结点的函数
  addChildNode = (data, node, child)=>{  //将child放到node.children里，其中child也是一个JSON对象
    //1）提取结点node的路径
    let path = this.getTreeNodePath(data, node);
    console.log(111, path);
    //2）从data中提取node结点的值（原来可能只有id和ancestor两个值）
    node = eval(path);  //相当于执行node=data[7].children[1].children[0]语句，更新node的值，将data中对应的node全部值赋值到node变量中，包括level等。
    console.log(112, node);
    //3）计算和设置新增子结点child的4个标志值
    child.parentnodeid = node.id;
    child.isparentflag = 0;
    child.level = parseInt(node.level) + 1;
    child.ancestor= node.ancestor + node.id+ '#';
    //4）取node的子结点，在原来子结点数组中添加一个结点元素child，将新的子结点按数组格式赋值到node.children属性中
    if (!node.children) node.children=[];  //若node不存在子结点，则新增一个node.children属性
    node.children.push(child);
    //5）修改node结点的isparentflag的值，如果原来不是父结点（即值是0），则修改为1。
    if (node.isparentflag ==0 ) node.isparentflag = 1;
    //node的值修改后，data值自动得到修改，不需要修改data数组中的值
    console.log(data);
    //console.log(path+'.children='+JSON.stringify(node.children))
    return data;
  }
  render() {
    let data = treeData;
	  //调用函数，查看第一层结点的路径
    console.log(this.getTreeNodePath(data,{id:'A',ancestor:''}));
	  //调用函数，在一个第2层的结点中添加一个子结点
    let node={}; //定义一个结点（实际上是父节点），只需要赋2个值，其他值从data中提取
    node.id='H2';  
    node.ancestor='H#';
    let child = {id:'H205', text:'aaaaaaaaaa'};  //新增子结点的两个值，其他值在函数中计算出来
    let newnode = this.addChildNode(data, node, child); //调用函数
    //同理，通用函数，在一个第3层的结点中添加一个子结点
    node.id='A202';
    node.ancestor='A#A2#';
    child = {id:'A20201', text:'bbbbbbbbbb'}
    newnode = this.addChildNode(data, node, child);
    return ( 
      <div style={{marginLeft:12}}>
      </div>
    )
  }
}
