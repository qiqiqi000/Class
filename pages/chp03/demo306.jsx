import React, { Component } from 'react';
import { reqdoSQL, reqdoTree, myGetTextSize } from '../../api/functions.js';
//使用3种图表
const right = require('../../icons/right.png');
const down = require('../../icons/down.png');
const file = require('../../icons/file.png');
//参考：https://blog.csdn.net/DcTbnk/article/details/107779422
const sys=React.sys;
export default class Page306 extends Component {
  constructor(props) {
    super(props);
    //在这里初始化 state
    this.state = {
      nodeHeight: 32,  //行高
      textHeight: 10,
      data: [],   //树形结构数据源
      expanded: {},  //节点是否展开，expanded.A1=true，expanded.A=true表示已经展开，否则没有展开状态
      selectedNode: {},   //当前选中的节点
    };
  }

  async componentDidMount(){ //页面启动时就会执行执行，必须使用async异步
    //计算节点的文字高度
    let textHeight = myGetTextSize('字', '', sys.label.fontsize, '').height;  //width
    let p={};
    p.sqlprocedure = 'demo306b';
    //let rs = await reqdoTree(p); //直接生成树型结构的存储过程
    //let data = rs.rows; 
    let rs = await reqdoSQL(p);  //生成线性结构，再转成树型结构
    let data = this.toTreeData(rs.rows);
    //console.log(333,JSON.stringify(data));
    console.log(333,data);
    this.setState({data, textHeight});
  }

  toTreeData = (data) => {
    //将线性表结构的数据转成树形结构数据
    if (!data || data.length == 0 || !Array.isArray(data)) return [];
    let result = [];
    let map = {};
    data.forEach(item => {
      map[item.id] = item;
    });
    data.forEach(item => {
      let parent = map[item.parentnodeid];
      if (parent) {
        (parent.children || (parent.children = [])).push(item);
      } else {
        result.push(item);
      }
    });
    return result;
  }  

  handleClick=(e, node)=>{
    //console.log(1,node)
    let id = node.id;  //属性
    //点击展开图标或双击节点文字时触发
    if (node.isparentflag === 0) return;
    let expanded={...this.state.expanded}
    let flag = expanded[id];  //expand['A1']
    if (flag === undefined) flag = false;
    expanded[id] = !flag;
    this.setState({expanded});
  }

  handleSelect=(e, node)=>{
    //console.log(3,node)
    this.setState({selectedNode: node});
  }
  
  generateTree(data) {
    return (
      <ul style={{margin:0, padding:0}}>
        {data.map(node =>{
          let {selectedNode, expanded, nodeHeight, textHeight}= this.state;
           let showflag = false;
           if (node.parentnodeid!='') showflag = expanded[node.parentnodeid];   //A101-->a1   A1-->a
           if (showflag === undefined) showflag = false;
           let src = file;
           if (node.children?.length>0){  //(node.isparentflag>0){
             if (expanded[node.id]) src = down
             else src = right;
           }
           return (
             <li key={node.id} id={node.id} style={{marginTop: (nodeHeight-textHeight)/2, marginLeft: node.level==1? 0:20, listStyleType: 'none', display:(node.level==1 || showflag)? 'block':'none'}}>
               <img key={'img_'+node.id} id={'img_'+node.id} src={src} style={{cursor:'pointer', height:12, marginRight: 0}} onClick={(e)=>this.handleClick(e, node)}/>
               <a href='#' className='custom-link' onClick={(e)=>this.handleSelect(e, node)}
                onDoubleClick={(e)=>this.handleClick(e, node)}
                style={{color: selectedNode.id == node.id? 'blue': null, backgroundColor: selectedNode.id == node.id? 'yellow': null}}>
                {node.text}
               </a>
               {node.children!=undefined && node.children.length > 0 && this.generateTree(node.children)}
             </li>
          )
        })}        
      </ul>
    );
  }
  
  render(){  
    let {data}= this.state;
    return (
      <div style={{marginLeft:12, fontSize: sys.label.fontsize}}>
        {this.generateTree(data)}
      </div>
    )
  }
}