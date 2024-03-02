import React from 'react';
import { Tree,Panel, DataGrid, Tabs, TabPanel, GridColumn, Messager, CheckBox, ComboBox, Label, Layout, LayoutPanel, LinkButton, Dialog, ComboTree } from 'rc-easyui';
import { Menu, MenuItem, MenuSep, GridColumnGroup, GridHeaderRow } from 'rc-easyui';
import { MyComboBox, MyTextBox, MyFileUpload, MyComboTree } from '../../api/easyUIComponents.js'
import { reqdoSQL, reqdoTree, updateTreeNodeData, addTreeChildrenData, searchTreeNode, myStr2JsonArray } from '../../api/functions.js'

const rowheight=42;
export default class Page602 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {  //写属性
      data: [],
      addoredit:'update',
      node: {},
      keyfield:'categoryid',
      textfield:'categoryid;;categoryname',
      fieldset: 'categoryid;categoryname;englishname'
    }
  }

  async componentDidMount() {
    this.loadTreeData();
  }

  handleContextMenu(event) {  //定义右键菜单
    event.preventDefault();
    this.menu.showContextMenu(event.pageX, event.pageY);
 }  

  loadTreeData = async () => {
     let p={};
     p.style="full";
	   p.sqlprocedure = 'demo505a';
     let rs = await reqdoTree(p); //调用函数，执行存储过程，返回树结点
     //this.setState({data:rs.rows});
    //console.log(JSON.stringify(rs.rows));
     this.setState({data: rs.rows}, () => {
       setTimeout(()=>{
         if (rs.rows.length>0){
           this.myTree1.selectNode(rs.rows[0]);
           for (let i=0; i<rs.rows.length;i++){
              //this.myTree1.collapseNode(rs.rows[i]);
           }
           this.myTree1.selectNode(rs.rows[0]);
         }
       })
    });
  }
 
  async handleExpand(node) {
    if (node.children && node.children.length === 1 && node.children[0].text.trim() === '') {
        let p = {};
        console.log(111, node);
        p.level = parseInt(node.level) + 1;
        console.log(p.level);
        p.style = "expand";
        p.parentnodeid = node.id;
        p.sqlprocedure = 'treecategory';
        let rs = await reqdoTree(p);
        console.log(rs.rows);
        let xdata = this.state.data1;
        xdata = addTreeChildrenData(node, xdata, rs.rows);
        this.setState({ data1: xdata }, () => {
            setTimeout(() => {
                this.myTree2.expandNode(node);
            })
        });
    }
  }    
  
  handleFilter(value) {
    this.myTree1.doFilter(value);
  }

  renderNode({ node }) {
    let count = null;
    if (node.children && node.children.length) {
      count = <span style={{ color: 'blue' }}> ({node.children.length})</span>
    }
    return (
      <span>{node.text}{count}</span>
    )
  }

  async handleSelectionChange(node) {
    //选中一个结点，同时删除假结点（如果存在的话）
    let prenode=this.state.node;  //记录上一个结点 
    let data=this.state.data;
    //console.log(991,prenode);
    if (node.id!='_tmp' && node.id!=prenode.id && prenode.id=='_tmp'){
      //删除新增的假结点
      if (prenode.parentnode!=undefined){
        let cnodes=prenode.parentnode.children;
        let index=cnodes.findIndex(item => item.id=='_tmp');
        if (index>=0) cnodes.splice(index,1);
        console.log(999,cnodes);
        prenode.parentnode.children=cnodes;
      }else{
        let index=data.findIndex(item => item.id=='_tmp');
        if (index>=0) data.splice(index,1);
      }
    }
    //赋值到表单
    this.setState({node:node});
    setTimeout(()=>{
      let tmp=this.state.fieldset.split(';');  
      for (let i = 0; i<tmp.length;i++){
         if (this[tmp[i]]){
            this[tmp[i]].setState({value: node[tmp[i]], editable: true});
         }
      }
      this.categoryid.setState({ editable: false });
    });      
  }

  addChildNode = (node) =>{
    let {data} = this.state;
    let xnode = {};
    xnode.id = '_tmp';
    xnode.text= '';
    if (node!=null){
      xnode.parentnodeid = node.id;
      xnode.parentnode=node;  //记录父结点
      xnode.level = parseInt(node.level) + 1;
      xnode.ancestor = node.ancestor.trim() + node.id + '#';
      xnode.isparentflag=0;
      if (node.children === undefined) {
        node.children = [];
        node.children.push(xnode);
      }else{
        node.children.push(xnode);
      }
      data=addTreeChildrenData(data, node, node.children);
    }else{      
      xnode.parentnodeid = '';
      xnode.parentnode= null;  //记录父结点
      xnode.level = 1;
      xnode.ancestor = '';
      data.push(xnode);
    }
    this.myTree1.selectNode(xnode);
    this.setState({ addoredit: 'add' }, () => {
      setTimeout(() => {
        let tmp=this.state.fieldset.split(';');  
        for (let i = 0; i<tmp.length;i++){
           if(this[tmp[i]]!== undefined){
              this[tmp[i]].setState({value:''});
           }
        }
        this.categoryid.setState({editable: true});
      })
    });  
    return xnode;
  }

  handleAddSubNodeClick = async (e) => {  //aaaaaa
    //增加子结点
    let {node} = this.state;
    let xnode = this.addChildNode(node);
    return;
  }

  handleAddNodeClick = async (e) => {  //aaaaaa
    //增加兄弟结点
    let {node, data} = this.state;
    let parentnode=null;
    if (node.parentnodeid!='') parentnode = searchTreeNode(data, node).parentnode;
    let xnode = this.addChildNode(parentnode);
  }

  handleUpdateClick = async (e) => {
    //修改记录
    //if (!this.state.node.categoryid) return;
    this.setState({ addoredit: 'update'});
    let tmp=this.state.fieldset.split(';');  
    for (let i = 0; i<tmp.length;i++){
       if (this[tmp[i]]){
          this[tmp[i]].setState({editable: true});
       }
    }
    this.categoryid.setState({editable: false});
    //let {node} = this.state;
  }

  handleDeleteClick = (e) => {  //ddddddd
    //删除记录
    this.myMessage1.confirm({
      msg: '是否确定删除【' + this.categoryid.state.value + '】这个商品？',
      result: async r => {
        if (r) {
          //先删除树中节点，再执行数据库存储过程
          let {node, data} = this.state;
          let xnode = searchTreeNode(data, node); 
          //定位节点
          if (xnode.nextnode!=null) this.myTree1.selectNode(xnode.nextnode);
          else if (xnode.priornode!=null) this.myTree1.selectNode(xnode.priornode);
          else if (xnode.parentnode!=null){
            this.myTree1.selectNode(xnode.parentnode);
            xnode.parentnode.isparentflag=0;
          } 
          //删除原来节点
          let index=xnode.index;
          if (node.parent!=null){
            let children = node.parent.children;
            children = children.filter(item => item.id != node.id);
            data = addTreeChildrenData(data, node.parent, children);
          }else{
            data = data.filter(item => item.id != node.id);
            this.setState({ data: data }, () => {
              setTimeout(() => {
              })
            })
          }  
          let p = {};
          let xdata = {};
          xdata.categoryid = this.categoryid.state.value;
          xdata._action = 'delete';
          xdata._reloadrow = 0;
          xdata._treeflag=1;
          xdata._treefield='categoryid';          
          p.sqlprocedure = "demo602b";
          p.data = [];
          p.data.push(xdata);
          console.log(4444,JSON.stringify(p.data));
          let rs = await reqdoSQL(p); //数据库中删除节点
        }
      }
    });
  }

  handleSaveClick = async (e) => {  //sssssssssssssave
    let { node, data } = this.state;
    let xdata={};
    xdata.parentnodeid=node.parentnodeid;
    xdata.isparentflag=node.isparentflag;
    xdata.level=node.level;
    xdata.ancestor=node.ancestor;
    //console.log(444,node);
    let tmp=this.state.fieldset.split(';');
    for (let i=0; i<tmp.length; i++){
       if (this[tmp[i]]){
          if (tmp[i]==='photopath'){
             xdata[tmp[i]]= myStr2JsonArray(this[tmp[i]].state.value);
          }else{
             xdata[tmp[i]]=this[tmp[i]].state.value;
          } 
       }
    }
    xdata._action=this.state.addoredit;
    xdata._reloadrow=1;
    xdata._treeflag=1;
    xdata._treefield='categoryid';    
    let p={};
    p.sqlprocedure="demo602b";
    p.data=[];
    p.data.push(xdata);
    console.log(JSON.stringify(p.data));
    let rs = await reqdoSQL(p); //调用函数，执行存储过程保存数据。必须加await
    console.log(888,rs.rows[0]);    
    if (rs.rows.length>0){
      /*
      this.myTree1.beginEdit(node);
      setTimeout(() => {
        //方法1。直接修改子节点，速度比较慢
        Object.assign(node, rs.rows[0]);
        //console.log(889,rs.rows[0]);
        //console.log(889,node);
        node.text= rs.rows[0].categoryid+' '+rs.rows[0].categoryname;
        node.id = rs.rows[0].categoryid;        
        //console.log(555,node);
        this.myTree1.endEdit(node);
      });
      */
      //方法2.修改data的值
      if (node.parent != undefined) {
        let cnodes = node.parent.children;
        let index = cnodes.findIndex(item => item.id == node.id);
        cnodes.splice(index, 1, rs.rows[0])
        cnodes[index].children=node.children;
        cnodes[index].parent=node.parent;
        if (node.parent.isparentflag==0) node.parent.isparentflag=1;
        data = addTreeChildrenData(data, node.parent, cnodes);
        node=cnodes[index];
      }else{
        let index = data.findIndex(item => item.id == node.id);
        data.splice(index, 1, rs.rows[0])
        data[index].children=node.children;
        data[index].parent=node.parent;
        node=data[index];
      }        
      this.setState({ data:data, addoredit: 'update', node:node }, () => {
         setTimeout(() => {
            //this.myTree1.collapseNode(node);  //使用this.data更新数据时可以省略这条语句
            this.myTree1.selectNode(node);
            this.categoryid.setState({ editable: false })
         })
      });
    }
  }

  handleButtonClick = async (flag) => {  //filter
    if (flag == 'fliter1') {
      let p = {};
      p.filter = this.filter.state.value;
      p.sqlprocedure = 'demo502a';
      let rs = await reqdoSQL(p); //调用函数，执行存储过程。必须加await
      this.setState({ data: rs.rows }, () => {
        setTimeout(() => {
          //this.myGrid1.setData(rs.rows);
          if (rs.rows.length > 0) this.myGrid1.selectRow(rs.rows[0]);
        })
      });
    }else if (flag == 'categoryid') {
      this.win2.open();
    }else if (flag == 'supplierid') {
      this.win3.open();
    }
  }

  handleContextMenu(e) {
    e.preventDefault();
    this.myMenu1.showContextMenu(e.clientX, e.clientY)
  }  
  
  render() {
    //作业：添加叶子结点的商品结点个数
    return (
      <div>
        <Layout style={{ width: '100%', height: '100%',position:'absolute' }}>
          <LayoutPanel region="west" border={false} style={{ width:300 }} split>
             <Tree data={this.state.data} checkbox={false} border={false} ref={node => this.myTree1 = node} style={{ overflow:'auto',width:'100%', height:'100%', position:'absolute' }}
                xrender={this.renderNode} onSelectionChange={this.handleSelectionChange.bind(this)}
                onNodeContextMenu={({ node, originalEvent }) => { originalEvent.preventDefault(); this.myTree1.selectNode(node); this.myMenu1.showContextMenu(originalEvent.pageX, originalEvent.pageY); }} >
             </Tree>
          </LayoutPanel>
          <LayoutPanel region="center" style={{ height:'100%' }}>
            <Layout style={{ width: '100%', height: '100%',position:'absolute' }}>
              <LayoutPanel region="north" style={{ height: 34 }}>
                <div id="toolbar1" style={{backgroundColor:'#E0ECFF',height:33, overflow:'hidden'}}>
                  <LinkButton style={{ width: 68, height: 28 }} iconAlign="left" iconCls="addIcon" onClick={this.handleAddSubNodeClick.bind(this)} >新增</LinkButton>
                  <LinkButton style={{ width: 68, height: 28 }} iconAlign="left" iconCls="editIcon" onClick={this.handleUpdateClick.bind(this)} >修改</LinkButton>
                  <LinkButton style={{ width: 68, height: 28 }} iconAlign="left" iconCls="deleteIcon" onClick={this.handleDeleteClick.bind(this)} >删除</LinkButton>
                  <LinkButton style={{ width: 68, height: 28 }} iconAlign="left" iconCls="saveIcon" onClick={this.handleSaveClick.bind(this)} >保存</LinkButton>
                  <MyTextBox params='filter,快速过滤,70,2,300,0,290' ref={ref => this.filter1 = ref} addonRight={() => <span className='textbox-icon icon-search' onClick={this.handleButtonClick.bind(this, 'filter1')}></span>} />
                </div>
              </LayoutPanel>
              <LayoutPanel region="center" style={{ height:'100%' }}>
                <Tabs ref={ref => this.myTabs = ref}  border={false} style={{ height: '100%', width: '100%', position: 'absolute' }}  tabPosition='top'>
                  <TabPanel ref={ref => this.myTab1 = ref} key="myTab1" title="基本信息" style={{ overflow: 'auto', height: '100%', width: '100%', position: 'absolute' }} >
                    <div style={{ position: 'absolute', width: '100%', height: '100%' }} 
                    onContextMenu={this.handleContextMenu.bind(this)} >                    
                    <MyTextBox params='categoryid,类别编码,72,20,20,0,200' ref={ref => this.categoryid = ref} />
                    <MyTextBox params='categoryname,类别名称,72,0,20,0,350' top={20 + 1 * rowheight} ref={ref => this.categoryname = ref} />
                    <MyTextBox params='englishname,英文名称,72,0,20,0,350' top={20 + 2 * rowheight} ref={ref => this.englishname = ref} />
                    </div>
                  </TabPanel>
                </Tabs>
              </LayoutPanel>
            </Layout>
         </LayoutPanel>
        </Layout>
        <Messager title='系统提示' ref={ref => this.myMessage1 = ref}></Messager>
        <div>
          <Menu ref={r => this.myMenu1 = r} onItemClick={value => this[`handle${value}Click`]?.()} >
            <MenuItem text="新增兄弟结点" iconCls="addIcon" value='AddNode'></MenuItem>
            <MenuItem text="新增子结点" iconCls="addIcon" value='AddSubNode'></MenuItem>
            <MenuItem text="修改结点" iconCls="editIcon" value='Update'></MenuItem>
            <MenuSep></MenuSep>
            <MenuItem text="删除结点" iconCls="deleteIcon" value='Delete'></MenuItem>
            <MenuSep></MenuSep>
            <MenuItem text="保存结点" iconCls="saveIcon" value='Save'></MenuItem>
          </Menu>
        </div>
     </div>
    );
  }
}
