import React, { Component, useState } from 'react';
import { CheckCircleOutlined, BlockOutlined, ReadOutlined, FileOutlined, TagOutlined, PaperClipOutlined, FullscreenOutlined, FullscreenExitOutlined, DownOutlined, UpOutlined, RightOutlined, RedoOutlined, FileAddOutlined, FileExcelOutlined, AuditOutlined, WindowsOutlined, FileUnknownOutlined, FormOutlined, PlusCircleOutlined, EditOutlined, DeleteOutlined, SaveOutlined, PrinterOutlined } from '@ant-design/icons';
import { Tree, Popconfirm, Dropdown, Tabs, Layout, Menu, Button, Image, Form, Input, Select } from 'antd';
import { myNotice, findTreeNode, myStr2JsonArray, reqdoTree, reqdoSQL, addTreeChildrenData, searchTreeNode, myPreventRightClick } from '../../api/functions';
import { MyFormComponent } from '../../api/antdFormClass.js';
import { ConfirmModal,  AntTextBox, AntSearchBox } from '../../api/antdComponents.js'
import { AntdInputBox, AntdCheckBox, AntdComboBox, AntdRadio, AntdCascader } from '../../api/antdClass.js';
import { Resizable } from 'rc-easyui'; 
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
const rowheight=45;
const { TreeNode } = Tree;

export default class Page1003 extends MyFormComponent {
  constructor(props) {
     super(props)    
     this.state = {
        data: [],  //结点数据源
        node: {},   //当前选中的结点
        treewidth: 400,
        formdisabled: true,
        keyfield: 'contentid',
        textfield: ' ContentTitle',
        treefield: 'contentid',
        selectedKeys: [],
        addoredit:'update',
        disablemenu: false,
        message:'',
        menupos:{x:400,y:300},
        nodetext:'',
     }
  }

  async componentDidMount(){
    //提取第一层节点
    let p = {};
    p.style = "expand";
    p.parentnodeid='';
    p.sqlprocedure = 'demo1003a';
    let rs = await reqdoTree(p);
    let rows=rs.rows;
    rows.forEach((item)=>{
      if (item.isparentflag==0) item.isLeaf =true;
    })
    //console.log(999,rs.rows);
    this.setState({data: rows}, () => {
      setTimeout(()=>{
        let e={};
        e.node=rows[0];
        //this.handleSelectNode([rs.rows[0].id], e);
        this.selectTreeNode(rows[0]);
      })
    });
  }

  loadTreeData = async(node) =>{
    let data =[...this.state.data];
    console.log(222,node,node.children,node.id)
    let cnodes = node.children;
    if (node.children && node.children.length>0 && node.children[0].id=='_'+node.id && node.children[0].text.trim()==''){
      //从数据库中提取节点
      let p = {};
      p.style = "expand";
      p.parentnodeid = node.id;
      p.sqlprocedure = 'demo1003a';
      let rs = await reqdoTree(p);
      let rows=rs.rows;
      console.log(991,rows);
      if (cnodes.length == 2 && cnodes[1].id=='_tmp' && cnodes[1].text.trim()==''){
        //保留这个新增的空节点
        rows.push(cnodes[1]);
        this.setState({ node: cnodes[1] }, () => {          
          setTimeout(() => {
            console.log(993,cnodes[1]);
            let e={};
            e.node=cnodes[1];
            cnodes[1] = searchTreeNode(data, cnodes[1]).currentnode;
            //this.handleSelectNode(cnodes[1].id, e)
            this.selectTreeNode(cnodes[1]);
          })
        });
      }
      rows.forEach((item)=>{
        //必须设置叶子节点的isLeaf属性为true
        if (item.isparentflag==0) item.isLeaf=true;
      })
      //替换原数组data中的children值
      data = addTreeChildrenData(data, node, rows); //将rs.rows数据添加为node的子节点
      this.setState({data: data}, () => {
         setTimeout(()=>{
          //将新提取的节点添加到父节点中去
           node.children=rows; //this.myTree1.setState({selectedKeys: [node.id]});
         })
      });
    }
    return data;    
  }

  handleRightClick = (e) => {
    console.log(333,e.event.pageX, e.event.pageY);
    this.setState({menupos:{y: e.event.pageY}})
    //右键时选中这个结点，注意需要使用数组    
    this.handleSelectNode([e.node.id], e)
    this.myTree1.setState({selectedKeys: [e.node.id]});
  }

  handleExpand = async (key,e)=>{
    //console.log(key);
    //console.log(e);
    //let node=e.node;
    //if (!e.expanded) return;
  }

  handleDoubleClick=(e, node)=>{
    //双节结点时选中这个结点，注意需要使用数组
    this.myTree1.setState({selectedKeys: [node.id]});
  }
  
  selectTreeNode = (node) => {
    console.log(111,node);
    if (!node) return;
    let key=node.id;
    this.myTree1.setState({selectedKeys: [key]}, ()=>{
      //定位到这个结点，使用原生的js语句
      if (document.getElementsByClassName('ant-tree-treenode-selected').length>0){          
        document.getElementsByClassName('ant-tree-treenode-selected')[0].scrollIntoView();
      }
      //this.myTree1.scrollTo({key: rows[0].id});//没有效果
      let e={};
      e.node=node;
      this.handleSelectNode(node.id, e);
    });
  }

  
  handleSelectNode = (key, e) => {
    //console.log(0,e)
    //选中一个结点时，判断是否需要删除假结点（如果存在的话）
     let prenode=this.state.node;  //记录上一个结点 
     let node=e.node;
     let { addoredit, data } =this.state;
     let tmpid='_tmp';
     //设置菜单按钮的disabled状态
     this.setState({disablemenu: node.id==tmpid? true: false});
     if (node.id!=tmpid && node.id!=prenode.id && prenode.id==tmpid){
       //删除新增的假结点
       let pnode=prenode.parentnode;
       if (pnode != undefined){
          if (pnode.children){
             let cnodes=pnode.children;
             //let index=cnodes.findIndex((item) => item.id==tmpid);
             //if (index>=0) cnodes.splice(index,1);
             cnodes=cnodes.filter((item) => item.id!==tmpid);  //删除之前的空节点
             data = addTreeChildrenData(data, pnode, cnodes);
          }
       }else{
         //let index=data.findIndex((item) => item.id==tmpid);
         //if (index>=0) data.splice(index,1);
         data=data.filter((item) => item.id!==tmpid);  //删除之前的空节点
       }
     }
     //点击空节点addoredit值不变
     if (node.id != tmpid && node.id != prenode.id) addoredit='show';
     this.setState({data:[...data], addoredit, node, nodetext:node.text}, () => { 
       setTimeout(() => {
         //节点赋值到表单，但正在编辑没有保存过的空节点赋值
         if (this.state.addoredit!='add'){
           //只有点击过选项卡之后，才有表单控件，才可以赋值
           this.setFormValues('myForm1', e.node);        
           let fields = this.getFormFields('myForm1');
           for (let i = 0; i<fields.length;i++){
             //新增状态或同一个节点多次点击还是保持编辑状态
             this[fields[i]]?.setState({editable: addoredit=='add' || addoredit==='update'});
           }
           if (addoredit=='update') this[this.state.keyfield]?.setState({editable: false});  //修改是主键不可修改
         }
       })
     });
   }
 
  expandTreeNode = (key) => {
    //强制用语句展开结点    
    if (this.myTree1.state.expandedKeys.indexOf(key)<0) this.myTree1.setExpandedKeys([...this.myTree1.state.expandedKeys, ...[key]]);
  }

  collapseTreeNode = (key) => {
    //强制用语句展开结点
    this.myTree1.setExpandedKeys(this.myTree1.state.expandedKeys.filter((item) => item!=key));
  }

  handleSearchFilter = async () => {
    //通过数据库查找第一个满足条件的节点，可以设一个参数i，一个个向下查找所有节点
    let p = {};
    p.filter = this.filtertext.state.value;
    p.rowno=1;
    p.sqlprocedure = "demo803c";
    let rs = await reqdoSQL(p);
    let rows=rs.rows;            
    if (rows.length==0) return;
    let data=[...this.state.data]
    //首先找到各层父结点，展开父结点
    if (rows[0].ancestor.trim()!=''){
      let keys=rows[0].ancestor.split('#');
      for (let i=0; i<keys.length-1; i++){
        //展开这个结点，实际上就是在expandedkeys中添加这个结点的key值
        this.expandTreeNode(keys[i]); 
      }
    }
    //最后选中这个结点，实际上就是在selectedkeys中添加这个结点的key值
    this.selectTreeNode(rows[0]);
  }

  handleFilterTreeNode = (node) => {
    //return node.text.indexOf('酒') > -1;
  }

  addChildNode = (pnode) =>{ //增加子节点
    let {node, data} = this.state;
    let xnode;
    let key='_tmp';
    if (node.id==key) return null;
    if (pnode != null){
      let fields = this.getFormFields('myForm1');
      xnode=findTreeNode(data,key);  //有没有空节点
      if (xnode == null){
        this.loadTreeData(pnode);  //展开子节点,有异步
        xnode = {};
        for (let i = 0; i<fields.length;i++) xnode[fields[i]]='';  //将新增节点的值清空
        xnode.text= '';
        xnode.id = key;
        xnode.key = key;
        xnode.parentnodeid = pnode.id;
        xnode.parentnode = pnode;  //记录父结点
        xnode.level = parseInt(pnode.level) + 1;
        xnode.ancestor = pnode.ancestor.trim() + pnode.id + '#';
        xnode.isparentflag=0;
        xnode.isLeaf=true;
        //pnode.addChild(xnode)
        if (pnode.children === undefined) {          
          pnode.children = [];
          pnode.children.push(xnode);
        }else{
          //pnode.addChildNode(xnode)
          pnode.children.push(xnode);
        }
        pnode.isLeaf=false;
        data = addTreeChildrenData(data, pnode, pnode.children);
      }
      this.expandTreeNode(pnode.id);
    }else{
      xnode = {};
      xnode.text= '';   
      xnode.id = '_tmp';
      xnode.key = '_tmp';
      xnode.parentnodeid = '';
      xnode.parentnode= null;  //记录父结点
      xnode.level = 1;
      xnode.ancestor = '';
      xnode.isLeaf=true;
      data.push(xnode);
    }
    //this.myTree1.setState({selectedKeys: [xnode.key]});
    this.setState({ data:[...data], addoredit: 'add', node:xnode }, () => {
      setTimeout(() => {
        this.resetFormValues('myForm1');
        let fields = this.getFormFields('myForm1');
        for (let i = 0; i<fields.length;i++){
          this[fields[i]]?.setState({editable: true});
        }   
        this.selectTreeNode(xnode);
      })
    });
    return xnode;
  }

  handleAddChildClick = async (e) => {  //aaaaaa
    //增加子结点
    let { node } = this.state;
    let xnode = this.addChildNode(node);
    return;
  }

  handleAddClick = async (e) => {  //aaaaaa
    //增加兄弟结点
    let {node, data} = this.state;
    let parentnode=null;
    let key='_tmp';
    if (node.parentnodeid!=''){
      parentnode = searchTreeNode(data, node).parentnode;
      //key=parentnode.id+key;
    }
    if (node.id!=key && node.text.trim()!='') { 
      let xnode = this.addChildNode(parentnode);
    }
  }

  handleUpdateClick = async (e) => {  //eeeeeeeeeee
    //修改记录
    //if (!this.state.node.categoryid) return;
    this.setState({ addoredit: 'update', formdisabled: false})    
    let fields = this.getFormFields('myForm1');
    for (let i = 0; i<fields.length;i++){
      this[fields[i]]?.setState({editable: true});
    }
    this[this.state.keyfield]?.setState({editable: false});
  }

  handleDeleteClick = async (e) =>{  
    this.myDeleteModal.setState({visible: true, description:'是否确定删除【'+this.state.node[this.state.keyfield]+'】这个类别？'});
    return;
  }

  handleDeleteNode = async (e) => {  //ddddddd
    //先删除树中节点，再执行数据库存储过程
    let {node, data} = this.state;
    let xnode = searchTreeNode(data, node);
    console.log(88,xnode); 
    //定位节点
    if (xnode.nextnode!=null) this.selectTreeNode(xnode.nextnode);
    else if (xnode.priornode!=null) this.selectTreeNode(xnode.priornode);
    else if (xnode.parentnode!=null){
      this.selectTreeNode(xnode.parentnode);
      xnode.parentnode.isparentflag=0;
      xnode.isLeaf=true;
    } 
    //删除原来节点
    console.log(89,node); 
    let index=xnode.index;
    if (xnode.parentnode!=null){
       let children = xnode.parentnode.children;
       children = children.filter(item => item.id != node.id);
       console.log(89, children); 
       data = addTreeChildrenData(data, xnode.parentnode, children);
    }else{
       data = data.filter(item => item.id != node.id);
    }  
    this.setState({ data: [...data] }, () => {
      setTimeout(() => {
        //
      })
    })
    let p = {};
    let xdata = {};
    xdata[this.state.keyfield] = node[this.state.keyfield];
    xdata._action = 'delete';
    xdata._reloadrow = 0;
    xdata._treeflag=1;
    xdata._treefield=this.state.treefield;  
    p.sqlprocedure = "demo602b";
    p.data = [];
    p.data.push(xdata);
    //console.log(4444,JSON.stringify(p.data));
    let rs = await reqdoSQL(p); //数据库中删除节点
    this.myDeleteModal.setState({visible: false})
  }

  handleSaveClick = async (e) => {  //sssssssssssssave
    let { node, data } = this.state;
    let xdata= this.myForm1.getFieldsValue();
    xdata = this.getFormValues('myForm1', xdata);  //转换数据内容
    xdata._action=this.state.addoredit;
    xdata.parentnodeid=node.parentnodeid;
    xdata.isparentflag=node.isparentflag;
    xdata.level=node.level;
    xdata.ancestor=node.ancestor;
    xdata._reloadrow=1;
    xdata._treeflag=1;
    xdata._treefield=this.state.treefield;
    let p={};
    p.sqlprocedure="demo602b";
    p.data=[];
    p.data.push(xdata);
    console.log(JSON.stringify(p.data));
    let rs = await reqdoSQL(p); //调用函数，执行存储过程保存数据。必须加await
    console.log(881,rs.rows[0]);
    if (rs.rows.length>0 && (rs.rows[0]._error==undefined || rs.rows[0]._error=='')){ //数据验证
      if (rs.rows[0].key==undefined) rs.rows[0].key=rs.rows[0].id;
      node=searchTreeNode(data, node);  //按旧结点的id找到其父节点和子节点
      //console.log(882,node);
      let index=node.index;   //子节点在父节点中的序号 
      if (node.parentnode) {
        let cnodes = node.parentnode.children;
        //let index = cnodes.findIndex(item => item.id == node.id);
        if (index>=0){ //避免错误
          cnodes.splice(index, 1, rs.rows[0]);  //替换data中这个节点的数据，新增节点从_tmp改成新值
          if (node.children){
            cnodes[index].children=node.children;  //保留其子节点
            cnodes[index].isLeaf=false;
          }else{
            cnodes[index].isLeaf=true;
          }
          cnodes[index].parentnode=node.parentnode;  //保留期父节点
          if (cnodes[index].parentnode.isparentflag==0){
            cnodes[index].parentnode.isparentflag=1;
            cnodes[index].parentnode.isLeaf=false;
          } 
          //console.log(884,cnodes[index]);
          //console.log(885,cnodes);
          data = addTreeChildrenData(data, node.parentnode, cnodes);  //数据修改到保存data中
          node=cnodes[index];
        }
      }else{
        //let index = data.findIndex(item => item.id == node.id);
        console.log(999,index)
        if (index>=0){
          data.splice(index, 1, rs.rows[0])
          if (!node.children) data[index].isLeaf=true;
          data[index].children=node.children;
          data[index].parentnode=node.parentnode;
          //data[index]={...data[index], ...rs.rows[0]};
          node=data[index];
        }
      }
      this.setState({ data:[...data], addoredit: 'update', node:node }, () => {
         setTimeout(() => {
            this.selectTreeNode(node);
            this.categoryid.setState({ editable: false })
         })
      });
    }else{
       myNotice('类别编码重复，记录保存失败！','error');  //
    }
  }

  handleRefresh = () =>{  //rrrrrrrr 
    console.log(this.filtertext);
    this.filtertext.setState({value: ''});    //不会清空
    this.setState({ data:[], node:{}, addoredit:'update', formdisabled: true, selectedKeys: [], disablemenu: false},() => {
      setTimeout(()=>{        
        this.loadTreeData();
      })
    });    
  }

  handleMyMenu1Click =(e)=>{
    //右键菜单程序
    //console.log(444,e);
    let key=e.key;
    if (key=='menu-delete') this.handleDeleteClick(e);
    else if (key=='menu-addchild') this.handleAddChildClick(e);
    else if (key=='menu-add') this.handleAddClick(e);
    else if (key=='menu-edit') this.handleUpdateClick(e);
    else if (key=='menu-save') this.handleSaveClick(e);
  }  

  handleResize=(e)=>{
    this.setState({treewidth: e.width});
  }

  renderItem = (nodeData) => {
    console.log(999,nodeData)
    const [isEditing, setIsEditing] = useState(false);
    const [inputValue, setInputValue] = useState(nodeData.title);
    return (
      <div>
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            autoFocus
          />
      </div>
    );
   };

  render() {   
    const items1 = [{
      label: '新增结点',
      key: 'menu-add',
      disabled: this.state.disablemenu,
      icon: <PlusCircleOutlined />
    },{
      label: '新增子结点',
      key: 'menu-addchild',
      disabled: this.state.disablemenu,
      icon: <PlusCircleOutlined />
    },{
      type: 'divider',
      key: 'sep11',
     },{
      label: '修改结点',
      key: 'menu-edit',
      icon: <EditOutlined />
    },{
     type: 'divider',
     key: 'sep12',
    },{
      label: '删除结点',
      key: 'menu-delete',
      icon: <DeleteOutlined />
    },{
      type: 'divider',
      key: 'sep13',
    },{
      label: '保存',
      key: 'menu-save',
      icon: <SaveOutlined />
    }];
    return (< >
      <Layout style={{overflow:'hidden'}}>
        <Header style={{ padding:0, paddingLeft:4, height: 35, lineHeight:'30px', backgroundColor: '#E0ECFF', borderBottom:'1px solid #95B8E7', overflow:'hidden'}}>
          <Form name='filterbar'>
            <div style={{marginTop:1, paddingTop:1}}>
               <Button type="text" icon={<PlusCircleOutlined />} style={{padding:0, width:72, height:30}} disabled={this.state.disablemenu} onClick={this.handleAddClick.bind(this)}>新增</Button>
               <Button type="text" icon={<EditOutlined />} style={{padding:0, width:72, height:30}} onClick={this.handleUpdateClick.bind(this)}>修改</Button>
               <Button type="text" icon={<DeleteOutlined />} style={{padding:0, width:72, height:30}} onClick={this.handleDeleteClick.bind(this)}>删除</Button>
               <Button type="text" icon={<SaveOutlined />} style={{padding:0, width:72, height:30}} onClick={this.handleSaveClick.bind(this)}>保存</Button>
               <Button type="text" icon={<RedoOutlined />} style={{padding:0, width:72, height:30}} onClick={this.handleRefresh.bind(this)}>刷新</Button>
            </div>
            <AntTextBox params='filtertext,快速过滤,72,0,400,30,350,search' ref={ref => this.filtertext = ref} onSearch={this.handleSearchFilter.bind(this)} />
          </Form>
        </Header>
        <Dropdown menu={{ items:items1, onClick:this.handleMyMenu1Click.bind(this) }} overlayStyle={{width:160}} trigger={['contextMenu']}>
        <Content style={{overflow:'auto', position:'relative', height:'100%', marginLeft:4, borderLeft:'1px solid #95B8E7'}}>
              <Tree id='myTree1' ref={ref => this.myTree1 = ref} style={{marginTop:10}}
              treeData={this.state.data} fieldNames={{title:'text', key:'id'}}
              checkable={false} showLine={true} autoExpandParent virtual 
              icon={<PaperClipOutlined />} showIcon={false} 
              expandAction="doubleClick" blockNode={false}  
              onSelect={this.handleSelectNode.bind(this)} 
              onDoubleClick={this.handleDoubleClick.bind(this)}
              onExpand = {this.handleExpand.bind(this)}
              loadData = {this.loadTreeData.bind(this)} 
              onRightClick={this.handleRightClick.bind(this)}
              filterTreeNode={this.handleFilterTreeNode.bind(this)}
              //renderItem={renderItem}
              titleRender = {(node)=>{
                return(
                  <div >
                    <Input value={node.text} style={{lineHeight:28, marginBottom:4, height:'28px', width:'300px'}}
                    onChange={(e) => {console.log(e.target.value); node.text = e.target.value }}
                    />
                  </div>
                );
              }}              
              />
          </Content>
        </Dropdown>
      </Layout>
      <ConfirmModal ref={ref=>this.myDeleteModal=ref} onConfirm={this.handleDeleteNode.bind(this)} />
    </>

    )
  }
}
