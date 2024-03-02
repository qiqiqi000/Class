import { Tree } from 'antd'
import React, { Component } from 'react'
import { myNotice, findTreeNode, myStr2JsonArray, reqdoTree, reqdoSQL, addTreeChildrenData, searchTreeNode, myPreventRightClick } from '../../api/functions';
import { MyFormComponent } from '../../api/antdFormClass.js';
import { ConfirmModal,  AntTextBox, AntSearchBox } from '../../api/antdComponents.js'
import { BlockOutlined, ReadOutlined, FileOutlined, TagOutlined, PaperClipOutlined, FullscreenOutlined, FullscreenExitOutlined, DownOutlined, UpOutlined, RightOutlined, RedoOutlined, FileAddOutlined, FileExcelOutlined, AuditOutlined, WindowsOutlined, FileUnknownOutlined, FormOutlined, PlusCircleOutlined, EditOutlined, DeleteOutlined, SaveOutlined, PrinterOutlined } from '@ant-design/icons';
import { Popconfirm, Dropdown, Tabs, Layout, Menu, Button, Image, Form, Select } from 'antd';
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
//export default class Page1001 extends Component {
export default class Page1001 extends MyFormComponent{
  constructor(props) {
     super(props)    
     this.state = {
        data: [],  //结点数据源
        node: {},   //当前选中的结点
        record: {}, //当前选中的结点，用来保存转换格式后的旧数据
        treewidth: 400,
        formdisabled: true,
        keyfield: 'categoryid',
        textfield: 'categoryid;;categoryname',
        treefield: 'categoryid',
        selectedKeys: [],
        addoredit:'update',
        disablemenu: false,
        message:'',
        menupos:{x:400,y:300},
        tmpnodeid: '_tmp',      
     }
  }

  async componentDidMount(){
    //提取数据
    this.loadTreeData();
  }

  loadTreeData = async() =>{
    let p={};
    p.style="full";
    p.sqlprocedure="demo803a";
    let rs=await reqdoTree(p);
    //console.log(111,JSON.stringify(rs.rows));
    //console.log(991,rs.rows);
    this.setState({ data: rs.rows }, () => {
      setTimeout(() => {
        let e={};
        e.node=rs.rows[0];
        //this.handleSelectNode([rs.rows[0].id], e);
        this.selectTreeNode(rs.rows[0]);
      })
    });
  }

  handleRightClick = (e) => {
    //console.log(333,e.event.pageX, e.event.pageY);
    this.setState({menupos:{y: e.event.pageY}})
    //右键时选中这个结点，注意需要使用数组    
    this.handleSelectNode([e.node.id], e)
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
    this.selectTreeNode(rows[0].id);
  }

  handleFilterTreeNode = (node) => {
    //return node.text.indexOf('酒') > -1;
  }

  selectTreeNode = (node) => {
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
     ///console.log(11110, e.node)
     //选中一个结点时，判断是否需要删除假结点（如果存在的话）
     let prenode=this.state.node;  //记录上一个结点 
     let node=e.node;
     let { tmpnodeid, addoredit, data } =this.state;
     //设置菜单按钮的disabled状态
     this.setState({disablemenu: node.id == tmpnodeid? true: false});
     //if (node.id!=tmpid && node.id!=prenode.id && prenode.id==tmpid){
     if (node.id != tmpnodeid && prenode.id == tmpnodeid){
        //删除新增的假结点
       let pnode = prenode.parentnode;
       if (pnode){
          pnode = findTreeNode(data, pnode.id);
          if (pnode.children){
             let children = pnode.children;
             pnode.children = children.filter((item) => item.id !== tmpnodeid);  //删除之前的空节点
             //data = addTreeChildrenData(data, pnode, cnodes);
          }
       }else{
         data = data.filter((item) => item.id !== tmpnodeid);  //删除之前的空节点
       }
     }
     //点击空节点addoredit值不变
     if (node.id != tmpnodeid && node.id != prenode.id) addoredit='show';
     //let record = mySetFormValues(this, null, 'myForm1', e.node);
     let record = this.setFormValues('myForm1', e.node);     
     this.setState({data:[...data], addoredit, node, record}, () => { 
       setTimeout(() => {
         //节点赋值到表单，但正在编辑没有保存过的空节点赋值
         if (this.state.addoredit!='add'){
           //只有点击过选项卡之后，才有表单控件，才可以赋值
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
 
  addChildNode = (pnode) =>{ //增加子节点
    let {tmpnodeid, node} = this.state;
    let data=[...this.state.data];
    let xnode;
    if (node.id == tmpnodeid) return null;
    if (pnode != null){
      let fields = this.getFormFields('myForm1');
      xnode = findTreeNode(data, tmpnodeid);  //有没有空节点
      if (xnode == null){
        xnode = {};
        for (let i = 0; i<fields.length;i++) xnode[fields[i]]='';  //将新增节点的值清空
        xnode.text= '';
        xnode.id = tmpnodeid;
        xnode.key = tmpnodeid;
        xnode.parentnodeid = pnode.id;
        xnode.parentnode = pnode;  //记录父结点
        xnode.level = parseInt(pnode.level) + 1;
        xnode.ancestor = pnode.ancestor.trim() + pnode.id + '#';
        xnode.isparentflag=0;
        xnode.isLeaf=true;
        if (pnode.children === undefined) {       
          pnode.children = [];
          pnode.children.push(xnode);
        }else{
          pnode.children.push(xnode);
        }
        pnode.isLeaf = false;
        pnode.isparentflag = 1;
        //data = addTreeChildrenData(data, pnode, pnode.children);
      }else{
        //删除原来空节点
      }
      this.expandTreeNode(pnode.id);
    }else{
      xnode = {};
      xnode.text= '';   
      xnode.id = tmpnodeid;
      xnode.key = tmpnodeid;
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
    let { node, data } = this.state;
    let parentnode = findTreeNode(data, node.id);
    let xnode = this.addChildNode(parentnode);
  }

  handleAddClick = async (e) => {  //aaaaaa
    //增加兄弟结点
    let {node, data, tmpnodeid} = this.state;
    let parentnode = null;
    if (node.parentnodeid!=''){
      //parentnode = searchTreeNode(data, node).parentnode;
      parentnode = findTreeNode(data, node.parentnodeid);
    }
    if (node.id != tmpnodeid && node.text.trim()!='') { 
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
    let {node, data, treefield, keyfield} = this.state;
    //let xnode = searchTreeNode(data, node);
    let xnode = findTreeNode(data, node.id);
    console.log(999,xnode);
    //定位到新节点
    if (xnode._nextnode!=null){
      this.selectTreeNode(xnode._nextnode);
    }else if (xnode._priornode!=null){
      this.selectTreeNode(xnode._priornode);
    }else if (xnode._parentnode!=null){
      this.selectTreeNode(xnode._parentnode);
      xnode._parentnode.isparentflag = 0;
      xnode._parentnode.isLeaf = true;
    } 
    //删除原来节点
    console.log(89,node.id,xnode._parentnode.id); 
    //let index = xnode.index;
    if (xnode._parentnode != null){
       let pnode = findTreeNode(data, xnode._parentnode.id);  //找到与data关联的父节点
       let children = pnode.children;
       pnode.children = children.filter(item => item.id != node.id);       
       //data = addTreeChildrenData(data, xnode.parentnode, children);
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
    xdata._treeflag = 1;
    xdata._treefield = treefield;
    p.sqlprocedure = "demo1001b";  //"demo602b";
    p.data = [];
    p.data.push(xdata);
    //console.log(4444,JSON.stringify(p.data));
    let rs = await reqdoSQL(p); //数据库中删除节点
    console.log(888,rs.rows);
    this.myDeleteModal.setState({visible: false})
  }

  handleSaveClick = async (e) => {  //sssssssssssssave
    let { tmpnodeid, node, data, record, addoredit, treefield } = this.state;
    if (addoredit!='add' && addoredit!='update') return;
    let xdata = this.getFormValues('myForm1');  //提取表单值并转换数据内容
    xdata._action=addoredit;
    xdata.parentnodeid=node.parentnodeid;
    xdata.isparentflag=node.isparentflag;
    xdata.level=node.level;
    xdata.ancestor=node.ancestor;
    xdata._reloadrow = 1;
    xdata._treeflag = 1;
    xdata._treefield = treefield;
    let p={};
    p.sqlprocedure="demo1001b";
    p.data=[];
    p.data.push(xdata);
    if (addoredit != 'add') p.data.push(record);  //修改数据时添加旧数据行
    //console.log(775,JSON.stringify(p.data));
    //调用函数，执行存储过程保存数据。必须加await
    let rs = await reqdoSQL(p); 
    console.log(881,rs.rows[0]);
    if (rs.rows.length>0 && (rs.rows[0]._error==undefined || rs.rows[0]._error=='')){ //数据验证
      if (rs.rows[0].key==undefined) rs.rows[0].key=rs.rows[0].id;
      //rs.rows[0]
      let node;
      if  (addoredit=='add') node = findTreeNode(data, tmpnodeid);  //找到临时节点，也就是当前节点
      else node = findTreeNode(data, rs.rows[0].id);  //找到当前节点
      if (!node) return;
      //node.id=rs.rows[0].id;
      //node.text=rs.rows[0].text;
      //node.categoryname=rs.rows[0].categoryname;
      Object.assign(node, rs.rows[0]);
      console.log(882, node);
      this.setState({ data:[...data], addoredit: 'show', node:node }, () => {
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

  render() {
    const menuitems = [{
      label: '新增兄弟结点',
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
        <Dropdown menu={{ items:menuitems, onClick:this.handleMyMenu1Click.bind(this) }} overlayStyle={{width:160}} trigger={['contextMenu']}>
          <Layout>
          <Resizable onResizing={this.handleResize.bind(this)} minWidth={200} maxWidth={400}>
            <div style={{width:this.state.treewidth}}>
              <Sider theme='light' width={this.state.treewidth} collapsed={this.state.collapsed} collapsible={false} zeroWidthTriggerStyle={true} collapsedWidth={60} style={{overflow:'auto', margin:0, padding:0, height:'100%', position:'relative', marginLeft:0, borderRight:'1px solid #95B8E7'}}>
                <Tree ref={ref => this.myTree1 = ref} treeData={this.state.data} fieldNames={{title:'text', key:'id'}}
                checkable={false} showLine={true} autoExpandParent virtual 
                icon={<PaperClipOutlined />} showIcon={true} 
                expandAction="doubleClick" blockNode={true}  
                onSelect={this.handleSelectNode.bind(this)}            
                onDoubleClick={this.handleDoubleClick.bind(this)}
                onRightClick={this.handleRightClick.bind(this)}
                filterTreeNode={this.handleFilterTreeNode.bind(this)}              
                />
              </Sider>
            </div>
          </Resizable>        
          <Content style={{overflow:'auto', position:'relative', height:'100%', marginLeft:4, borderLeft:'1px solid #95B8E7'}}>
              <Form name="myForm1" ref={ref=>this.myForm1=ref} disabled={this.state.formdisabled} autoComplete="off" style={{position:'relative', height:'100%', overflow:'hidden'}} >
                <Tabs id="myTab" activeKey={this.state.activetabkey} size="small" tabBarGutter={24}                 
                  style={{marginLeft:16, padding:0, paddingRight:20, height:'100%', width:'100%', position:'relative', overflow:'hidden'}}
                  items={[              
                    {label: '类别信息', key: 'myTab1', forceRender:true, children: 
                      <div style={{padding:0, margin:0, position:'relative', height:'100%', overflow:'auto'}} >
                        <AntTextBox params='categoryid,类别编码,82,0,2,0,140' top={2+rowheight*0} ref={ref=>this.categoryid=ref} />
                        <AntTextBox params='categoryname,类别名称,82,0,2,0,300' top={2+rowheight*1} ref={ref=>this.categoryname=ref} />
                        <AntTextBox params='englishname,英文名称,82,0,2,0,300' top={2+rowheight*2} ref={ref=>this.englishname=ref} />
                      </div>
                    }
                  ]}
                />
              </Form>
          </Content>
          </Layout>
        </Dropdown>
      </Layout>
      <ConfirmModal ref={ref=>this.myDeleteModal=ref} onConfirm={this.handleDeleteNode.bind(this)} />
    </>

    )
  }
}
