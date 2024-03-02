import { Tree } from 'antd'
import React, { Component } from 'react'
import { findTreeNode, reqdoTree, reqdoSQL, toTreeData, addTreeChildrenData, searchTreeNode, myPreventRightClick } from '../../api/functions.js';
import { ReadOutlined, FileOutlined, TagOutlined, PaperClipOutlined } from '@ant-design/icons';
import { Layout, Menu, Button, Image, Form, Select } from 'antd';
import { AntTextBox, AntSearchBox } from '../../api/antdComponents.js'
import { AntdInputBox } from '../../api/antdClass.js'
const { Header, Content, Footer, Sider } = Layout;
//https://ant.design/components/overview-cn/ 

/*
主要知识点：
1）树控件的功能与定义方式：分层展开结点。
2）树控件的数据结构：json数组+children，由treeData属性指定
3）树控件的基本属性：checkable, ShowLine，fieldNames，autoExpandParent及其作用
4）树结点文本显示内容与方式的修改，使用titleRender属性+return语句
5）树结点中显示小图标的方法：icon={<PaperClipOutlined />}与showIcon={true}两个同时设置，也可以通过titleRender去设置不同结点的不同图标
6）树控件选中结点的事件onSelect，返回结点的key值和e值，其中e.node为当前选中的结点json值
7）树控件的双击事件onDoubleClick，一般用于展开结点或收缩结点            
8）树控件的右键事件onRightClick，一般用于显示自定义菜单
9）光标定位到某个结点的方法：在树控件的selectedKeys中添加这个结点的key值
10）打钩选中某个结点的方法：在树控件的checkedKeys中添加这个结点的key值
11）展开某个结点的方法：使用树控件的setExpandedKeys方法在树控件的expandedKeys中添加这个结点的key值。
12）查找某个结点的方法：在树控件中使用递归或使用ancestor值分层查找结点
13）使用this.state变量记录当前选中的那个结点
14）通过ant-tree-node-selected，ant-tree-node-content-wrapper设置节点高度背景颜色等样式
*/
export default class Page803 extends Component {
  constructor(props) {
     super(props)    
     this.state = {
        data: [],  //结点数据源
        node: {}   //当前选中的结点
     }
  }

  async componentDidMount(){    
    //方法1：提取树型结构数据  
    // let p={};
    // p.style="full";
    // p.sqlprocedure="demo803a";
    // let rs=await reqdoTree(p);   
    // let data = rs.rows;
    // console.log(111,JSON.stringify(rs.rows));    
    //方法2：提取线性结构数据
    let p={};
    p.sqlprocedure="demo803b";
    let rs = await reqdoSQL(p);   
    let data = toTreeData(rs.rows);
    console.log(991,data);
    console.log(992,rs.rows);
    //console.log(4444,JSON.stringify(data));
    this.setState({ data: data }, () => {
      setTimeout(() => {
        let key='H201';
        let node = findTreeNode(data, key);
        let parents=node._ancestors; 
        if (parents){
          let keys = parents.map((item)=>item.id);
          //keys.push('A','C','B','A1','A2')
          this.myTree1.setExpandedKeys(keys);
          this.myTree1.setState({checkedKeys:keys}); //???
        }
        this.myTree1.setState({selectedKeys: [key]});
        //定位到这个结点，使用原生的js语句
        if (document.getElementsByClassName('ant-tree-treenode-selected').length>0){          
           document.getElementsByClassName('ant-tree-treenode-selected')[0].scrollIntoView()
        }
        //this.myTree1.scrollTo({key: key});//没有效果
        //this.myTree1.setExpandedKeys(['A']);
        //this.myTree1.setExpandedKeys(['A','B','A1']);
        // this.myTree1.setExpandedKeys([...this.myTree1.state.expandedKeys, ...[data[0].children[1].id]]);
        // this.myTree1.setExpandedKeys([...this.myTree1.state.expandedKeys, ...[data[1].id]]);
        //this.myTree1.setState({selectedKeys: [data[0].children[1].children[0].id] });  //A201
        //console.log(993,this.myTree1.state.expandedKeys);
      })
    });
  }

  handleSelect = (key, e) => {
    //console.log(555,key,e);
    //console.log(555,e.node);
    this.setState({node: e.node});  //记录选中的结点
  }

  handleRightClick = (e) => {    
    //右键时选中这个结点，注意需要使用数组
    this.myTree1.setState({selectedKeys: [e.node.id]});
  }

  handleDoubleClick=(e, node)=>{
    //双节结点时选中这个结点，注意需要使用数组
    this.myTree1.setState({selectedKeys: [node.id]});
  }
  
  expandTreeNode = (key) => {
    //强制用语句展开结点
    if (this.myTree1.state.expandedKeys.indexOf(key)<0) this.myTree1.setExpandedKeys([...this.myTree1.state.expandedKeys, ...[key]]);
  }

  handleSearchFilter = async () => {
    //结点定位于过滤
    let p = {};
    p.filter = this.filtertext.state.value;
    p.rowno=1;
    p.sqlprocedure = "demo804d";
    let rs = await reqdoSQL(p);  //查找结点
    if (rs.rows.length==0) return;
    let rows = rs.rows;
    let data=[...this.state.data]
    //找到各层父节点，展开各个父节点
    if (rows[0].ancestor.trim()!=''){
       let array=rows[0].ancestor.split('#');  
       for (let i=0; i<array.length-1; i++){
          let pnode = findTreeNode(data, array[i]);
          if (pnode !== null){
             this.expandTreeNode(pnode.id);
          }
       }
    }        
    this.myTree1.setState({selectedKeys: [rows[0].id]}, ()=>{
      //第二次点击才会滚动到节点，为什么？
      if (document.getElementsByClassName('ant-tree-treenode-selected').length>0){
          document.getElementsByClassName('ant-tree-treenode-selected')[0].scrollIntoView()
      }
      //this.myTree1.scrollTo({key: rs.rows[0].id});  //没有效果                    
    });//选中结点   
  }

  handleFilterTreeNode = (node) => {
    return node.text.indexOf('酒') >=0;
  }

  render() {
    return (
      <Layout style={{overflow:'hidden'}}>
        <Header style={{ padding:0, paddingLeft:4, height: 35, lineHeight:'30px', backgroundColor: '#E0ECFF', borderBottom:'1px solid #95B8E7', overflow:'hidden'}}>
          <Form name='filterbar'>
             <AntdInputBox id='filtertext' label='快速查找' labelwidth='72' top='2' left='16' width='350' type='search' ref={ref => this.filtertext = ref} onSearch={this.handleSearchFilter.bind(this)} />
          </Form>
        </Header>
        <Content style={{overflow:'auto', position:'relative', height:'100%'}}>
          <Tree ref={ref => this.myTree1 = ref} 
            treeData={this.state.data} 
            fieldNames={{title:'text', key:'id'}}
            checkable={true} showLine 
            autoExpandParent virtual             
            icon={<PaperClipOutlined />} 
            showIcon={true}
            expandAction="doubleClick" 
            blockNode={true}
            onSelect={this.handleSelect.bind(this)}    
            onDoubleClick={this.handleDoubleClick.bind(this)}
            onRightClick={this.handleRightClick.bind(this)}
            filterTreeNode={this.handleFilterTreeNode.bind(this)}
             />
          </Content>
      </Layout>
    )
  }
}
