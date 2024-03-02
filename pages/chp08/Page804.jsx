import { Tree } from 'antd'
import React, { Component } from 'react'
import { findTreeNode, reqdoTree, reqdoSQL, addTreeChildrenData, searchTreeNode } from '../../api/functions';
import { BlockOutlined, DownOutlined,  UpOutlined, FileOutlined, TagOutlined, PaperClipOutlined } from '@ant-design/icons';
import { Layout, Menu, Button, Image, Form } from 'antd';
import { AntdInputBox } from '../../api/antdClass.js'
import { AntTextBox } from '../../api/antdComponents.js'
const { Header, Content, Footer, Sider } = Layout;
//https://ant.design/components/overview-cn/ 
/*
主要知识点：
1）树控件的数据不是一次性从数据库提取全部节点，而是一层层从数据库提取节点，即分层提取结点的方法概念。
2）分层提取的过程：第一步提取根节点，点击这个根节点的召开符号时，提取这个根节点的子节点，同理提取每个父节点的子节点
3）数据写存储过程，怎样提取一个节点的子节点。
4）树控件中找到一个事件，在这个事件中书写代码从数据库中提取这个节点的子节点，注意只提取一次。
5）使用switcherIcon={<DownOutlined />设置父节点展开收缩的图表
6）在titleRender中为叶子结点设置图标样式
7）查找某个结点的方法：在树控件中使用递归或使用ancestor值分层展开节点后再定位查找结点
8）titleRender太频繁，会耗费资源,节点多的时候尽量不要使用

*/
export default class Page804 extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: [],
            node: {},
            filteredData: [],
            filterno: -1,
        }
    }
    async componentDidMount() {
      //提取第一层节点
      let p = {};
      p.style = "expand";
      p.sqlprocedure = "demo804a";
      p.parentnodeid = "";
      let rs = await reqdoTree(p);
      let rows=rs.rows;
      rows.forEach((item)=>{
        if (item.isparentflag==0) item.isLeaf =true;
      })
      //console.log(999,rs.rows);
      this.setState({data: rows}, () => {
        setTimeout(()=>{
          this.myTree1.setState({selectedKeys: [rows[0].id]});
        })
     });
    }

    expandTreeNode = (key) => {
      //强制用语句展开结点
      if (this.myTree1.state.expandedKeys.indexOf(key)<0) this.myTree1.setExpandedKeys([...this.myTree1.state.expandedKeys, ...[key]]);
    }
    
    handleExpand = async (key,e)=>{
      //console.log(key);
      //console.log(e);
      //let node=e.node;
      //if (!e.expanded) return;
    }

    handleLoadData = async(node) => {
      let data =[...this.state.data];
      data = await this.loadTreeData(data, node)
      this.setState({data: data}, () => {
         setTimeout(()=>{
           //this.myTree1.setState({selectedKeys: [node.id]});
         })
      });
      return data;      
    }

    loadTreeData = async (data, node) => {
      //节点展开时加载数据时触发
      //if (node?.children[0].id=='_'+node.id && node?.children[0].text.trim()==''){
      if (node.children && node.children.length>0 && node.children[0].id=='_'+node.id && node.children[0].text.trim()==''){
        let p = {};
        p.style = "expand";
        p.parentnodeid = node.id;
        p.sqlprocedure = 'demo804a';
        let rs = await reqdoTree(p);
        //必须设置叶子节点的isLeaf属性为true
        let rows=rs.rows;
        rows.forEach((item)=>{
          if (item.isparentflag==0) item.isLeaf=true;
        })
        //data = addTreeChildrenData(data, node, rows); //将rs.rows数据添加为node的子节点
        let pnode = findTreeNode(data, node.id);
        if (pnode){
          pnode.children = rows; //替换原数组data中的children值
          pnode.isLeaf = false;
        }
      }
      return data;
    }


    handleSelect=(key, e)=>{
      this.setState({node: e.node})
    }

    handleDoubleClick=(e, node)=>{
      //双节结点时选中这个结点，注意需要使用数组
      this.myTree1.setState({selectedKeys: [node.id]});
    }  
    
    handleSearchFilter = async () => {
      /*
      let p = {};
      p.filter = this.filtertext.state.value;
      p.rowno=1;
      p.sqlprocedure = "demo804d";
      let rs = await reqdoSQL(p);  //查找结点
      if (rs.rows.length==0) return;
      let data=[...this.state.data]
      //找到各层父节点，展开父节点
      if (rs.rows[0].ancestor.trim()!=''){
        let array=rs.rows[0].ancestor.split('#');  
        for (let i=0; i<array.length-1; i++){
           let node = findTreeNode(data, array[i]);
           data = await this.loadTreeData(data, node)           
           this.expandTreeNode(node.id);
        }//for
      }
      this.setState({data: data}, () => {
        setTimeout(()=>{
          //this.myTree1.setState({selectedKeys: [node.id]});
        })
      });
      this.myTree1.setState({selectedKeys: [rs.rows[0].id]}, ()=>{
        //第二次点击才会滚动到节点，为什么？
        if (document.getElementsByClassName('ant-tree-treenode-selected').length>0){
            document.getElementsByClassName('ant-tree-treenode-selected')[0].scrollIntoView()
        }
        //this.myTree1.scrollTo({key: rs.rows[0].id});  //没有效果                    
      });//选中结点
      */
      let {filterno} = this.state;
      filterno = 0;
      let p = {};
      p.filter = this.filtertext.state.value;
      p.sqlprocedure = 'demo804e';
      let rs=await reqdoSQL(p);  //提取全部的满足条件的记录
      this.setState({filteredData:rs.rows, filterno}, ()=>this.locateNode());
    }

    locateNode= async ()=>{
      let {filterno, filteredData} = this.state;
      let data = [...this.state.data];  //不能放到上面解构
      if (filteredData.length>0){
        if (filterno >= filteredData.length) filterno = filteredData.length-1;
        if (filterno < 0) filterno = 0;      
        let row = filteredData[filterno];
        //找到各层父节点，展开父节点
        if (row.ancestor.trim()!=''){
          let array=row.ancestor.split('#');  
          for (let i=0; i<array.length-1; i++){
             let node = findTreeNode(data, array[i]);
             data = await this.loadTreeData(data, node)
             this.expandTreeNode(node.id);
          } //for
        }
        this.setState({data:data, filterno}, () => {
          setTimeout(()=>{
            this.myTree1.setState({selectedKeys: [row.id]}, ()=>{
              if (document.getElementsByClassName('ant-tree-treenode-selected').length>0){
                  document.getElementsByClassName('ant-tree-treenode-selected')[0].scrollIntoView()
              }
              //this.myTree1.scrollTo({key: rs.rows[0].id});  //没有效果                    
            });//选中结点    
          })
        });
      }  
    }

    handleMoveClick = async(id) => {      
      let {filterno,data, filteredData}=this.state;
      if (id=='movedown') filterno ++;
      else if (id=='moveup' && filterno>0)  filterno --;
      this.setState({filterno}, () => this.locateNode());
    }
        
    render() {
      return (
        <Layout style={{overflow:'hidden'}}>
        <Header style={{ padding:0, paddingLeft:4, height: 35, lineHeight:'30px', backgroundColor: '#E0ECFF', borderBottom:'1px solid #95B8E7', overflow:'hidden'}}>
           <Form name='filterbar'>
              <AntdInputBox id='filtertext' label='快速查找' labelwidth='72' top='2' left='16' width='350' type='search' ref={ref => this.filtertext = ref} onSearch={this.handleSearchFilter.bind(this)} />
              <Button type='link' id='moveup' style={{position:'absolute', top :1, left:450, width:35}} onClick={(e)=>this.handleMoveClick('moveup')}>{<UpOutlined />}</Button>
              <Button type='link' id='movedown' style={{position:'absolute', top :1, left:480, width:35}} onClick={(e)=>this.handleMoveClick('movedown')}>{<DownOutlined />}</Button>
           </Form>
        </Header>
        <Content style={{overflow:'auto', position:'relative'}}>
           <Tree ref={ref => this.myTree1 = ref} treeData={this.state.data}
            fieldNames={{title:'text', key:'id'}} 
            showLine ={ true } checkable={false} switcherIcon={<DownOutlined /> }
            expandAction="doubleClick" 
            onSelect={this.handleSelect.bind(this)} 
            onDoubleClick={this.handleDoubleClick.bind(this)}
            onExpand = {this.handleExpand.bind(this)}
            loadData = {this.handleLoadData.bind(this)}
            titleRender = {(node)=>{
              let html
              if (node.isLeaf) html=<span style={{marginLeft:8}}><FileOutlined style={{marginRight:2}} />{node.text}</span>
              else html=<span style={{marginLeft:8}}><BlockOutlined style={{marginRight:2}} />{node.text}</span>                  
              return(html)
            }} >
           </Tree>
           </Content>
        </Layout>
      )
    }
  }
