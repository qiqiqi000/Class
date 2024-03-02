import { Tree } from 'antd'
import React, { Component } from 'react'
import { myStr2Json, reqdoTree, reqdoSQL, addTreeChildrenData, searchTreeNode } from '../../api/functions';
import { MyFormComponent } from '../../api/antdFormClass.js';
import { FolderOpenOutlined, FolderOutlined, FileAddOutlined, DownOutlined, UpOutlined, SettingOutlined, FileOutlined, DingdingOutlined, TwitterOutlined, PaperClipOutlined } from '@ant-design/icons';
import { Table, Tabs, Layout, Menu, Button, Image, Form } from 'antd';
import { AntdInputBox, AntdCheckBox, AntdComboBox, AntdRadio, AntdCascader } from '../../api/antdClass.js';
import { AntTextBox, AntNumberBox, AntDateBox, AntComboBox, AntRadio, AntCheckBox, AntImage, AntLabel } from '../../api/antdComponents.js'
//import { DataNode, DirectoryTreeProps } from 'antd/es/tree';

const { Header, Content, Footer, Sider } = Layout;
//https://ant.design/components/overview-cn/ 

//主题样式（颜色）修改目录路径：/Users/yons/Desktop/task/server-commerce/node_modules/antd/lib/style/themes/default.less:
/*主要知识点：
 1）一次性提取数据与分层加载数据两者结合的方法原理
 2）数据库存储过程的实现方法与节点数据的加载过程
 3）树控件的onSelect事件中处理比较复杂的事务：加载其他表单与表格控件的数据
 4）使用blockNode属性在选中结点时整行显示选中的背景色
 5）在titleRender中设置结点小图标，编写小图标的展开收缩的事件, this.myTree1.setState.expandedKeys=['A','A2']
 6）在return中定义Tabs选项卡的多个items
 7）选项卡的table滚动条的出现方法
 8）如何动态控制一个表单的隐藏与显示状态。 
 9）如何提取数据表中json列的值，显示多个图片的值。
 10）初始页面加载时选中节点并触发事件，选中结点的方法this.myTree1.setState.selectedKeys=['A1','A3']
 */
const rowheight=42;
const { DirectoryTree } = Tree;
export default class Page805 extends MyFormComponent {
    constructor(props) {
        super(props)
        this.state = {
           data: [],  //节点数据源
           node: {},  //当前选中节点
           expandedFlag: {}, //用一个对象变量来记录每一个主键的节点是否被选中，例如this.state.expandedFlag.A1=true，表示节点已经展开；expandedFlag.A1=false/undefined表示节点没有展开
           keyfield: 'productid',
           showForm1: true,
           tab1Title: '商品类别信息',
           columns: [
              {key:"rowno_",title:'序号',dataIndex:'id', width:'50px', fixed:'left', className:'rownumberStyle',
              render:(text,record,index)=>index+1},
              {key:"orderid",dataIndex:'orderid',title:'订单编号', width:80, fixed:'left',align:'center'},
              {key:"orderdate",dataIndex:'orderdate',title:'订单日期', width:80,fixed:'left', align:'center'},
              {key:"customerid",dataIndex:'customerid',title:'客户编码', width:80, align:'center'},
              {key:"companyname",dataIndex:'companyname',title:'客户名称', width:'200px', ellipsis: true},
              {key:"quantity",dataIndex:'quantity',title:'销售量', width:80, align:'right'},
              {key:"amount",dataIndex:'amount',title:'销售额', width:80, align:'right'}
           ],
           griddata: []
        }
    }

    async componentDidMount() {
      //提取第一层节点
      let p={};
      p.style = "full";      
      p.sqlprocedure = 'demo507b'; //部分一次性加载，部分分层加载（商品分层加载）   
      let rs = await reqdoTree(p);
      let rows=rs.rows;
      //必须设置叶子节点的isLeaf属性为true
      rows.forEach((item)=>{
        if (item.isparentflag==0) item.isLeaf=true;
      })
      this.setState({data: rows}, () => {
        setTimeout(()=>{
          this.myTree1.setState({selectedKeys: [rows[0].id]});
          let e={};
          e.node={...rows[0]}
          this.handleSelect([rows[0].id], e);
        })
     });
    }

    loadData = async (node) => {
      //节点展开时加载数据时触发
      let data =[...this.state.data];
      if (node && node.children && node.children.length==1 && node.children[0].text.trim()==''){        
        let p = {};
        p.style = "expand";
        p.parentnodeid = node.id;
        p.sqlprocedure = 'demo507c';
        let rs = await reqdoTree(p);        
        let rows=rs.rows;
        //必须设置叶子节点的isLeaf属性为true
        rows.forEach((item)=>{
          if (item.isparentflag==0) item.isLeaf=true;
        })
        //替换原数组data中的children值
        data = addTreeChildrenData(data, node, rows); //将rs.rows数据添加为node的子节点
        this.setState({data: data}, () => {
           setTimeout(()=>{
             //this.myTree1.setState({selectedKeys: [node.id]});
           })
        });
      }
      return data;      
    }

    handleSelect = async (keys, e) => {
      //选中节点
      let node = e.node;
      this.setState({node:node, showForm1:!node.isLeaf || parseInt(node.level)==1, tab1Title:node.isLeaf? '商品基本信息':'商品类别信息'}, () => {
        setTimeout( async () => {
          if (node.isLeaf && parseInt(node.level)>1){
            this.setFormValues('myForm2', node);
            //this.imagepath.setState({src:'myServer/mybase/products/'+node[this.state.keyfield]+'.jpg'});  //需要这里赋值，state.row还是旧的
            //从数据库中提取和加载数据到网格
            let p={}
            p.productid=node.id
            p.sqlprocedure = 'demo805a';
            let rs = await reqdoSQL(p);
            let rows=rs.rows;
            this.setState({griddata: rs.rows});
          }else{
            this.setFormValues('myForm1', node);
          }       
        })
      });
    }

    handleDoubleClick=(e, node)=>{
      //双节结点时选中这个结点，注意需要使用数组
      this.myTree1.setState({selectedKeys: [node.id]});
    }
    

    handleSearchFilter = async () => {
      let p = {};
      p.filter = this.filtertext.state.value;
      p.rowno=1;
      p.sqlprocedure = "demo805d";
      let rs = await reqdoSQL(p);
      if (rs.rows.length==0) return;
      let data=[...this.state.data]
      //找到各层父节点，展开父节点
      if (rs.rows[0].ancestor.trim()!=''){
        let keys=rs.rows[0].ancestor.split('#');  
        let pstr='';
        for (let i=0; i<keys.length-1; i++){
          let node={};
          node.id=keys[i];
          node.isparentflag=1;
          node.ancestor=pstr;
          pstr+=keys[i]+'#';
          let pnode=searchTreeNode(this.state.data, node).currentnode;
          if (pnode==null){  //找不到结点时添加一个虚拟假节点，为加载结点
            pnode=node;  
            pnode.children=[{id:'_'+keys[i], text:''}]
          }
          setTimeout(()=>{
            this.loadData(pnode);
            this.expandTreeNode(keys[i]);
          })             
        }
      }        
      this.myTree1.setState({selectedKeys: [rs.rows[0].id]}, ()=>{
        //第二次点击才会滚动到节点，为什么？
        if (document.getElementsByClassName('ant-tree-treenode-selected').length>0){
            document.getElementsByClassName('ant-tree-treenode-selected')[0].scrollIntoView()
        }
        //this.myTree1.scrollTo({key: rs.rows[0].id});  //没有效果                    
      });//选中结点
    }
        
    
    expandTreeNode = (key) => {
      //强制用语句展开结点
      if (this.myTree1.state.expandedKeys.indexOf(key)<0) this.myTree1.setExpandedKeys([...this.myTree1.state.expandedKeys, ...[key]]);
    }

    handleExpand=(key, e)=>{
      //console.log(e.node)
      //console.log(e.node.expanded)
      let node = e.node;
      //展开或收缩节点时，设置this.state.expandedFlag.A1=true/false的值
      let data={...this.state.expandedFlag}
      data[node.id]=!node.expanded;  //直接开始为false，收缩时为true，前面加!
      this.setState({expandedFlag: data});
    }

    handleIconClick=(node)=>{
      //点击小按钮图标，展开或收缩节点
      //判断当前节点是否是展开状态，从this.myTree1.state.expandedKeys找这个元素      
      let flag;
      if (this.myTree1.state.expandedKeys.indexOf(node.id)<0){  //不存在这个节点，表示节点原来不是展开状态，现在变成展开状态
        flag=true;
        //数组中添加节点
        this.myTree1.setExpandedKeys([...this.myTree1.state.expandedKeys, ...[node.id]]);  //展开节点
        this.loadData(node);  //分层加载数据
      }else{ 
        flag=false;
        //数组中删除节点
        this.myTree1.setExpandedKeys(this.myTree1.state.expandedKeys.filter((item) => item!=node.id)); //收缩节点
      }
      let data={...this.state.expandedFlag}
      data[node.id]=flag;
      this.setState({expandedFlag: data});
    }

    handleLocateIcon=(e)=>{
      console.log(e);
    }

    render() {
      return (
        <Layout style={{overflow:'hidden'}}>
          <Header theme='light' style={{ padding:0, paddingLeft:4, height: 35, lineHeight:'30px', backgroundColor: '#E0ECFF', borderBottom:'1px solid #95B8E7', overflow:'hidden'}}>
            <Form name='filterbar'>
              <AntTextBox params='filtertext,快速查找,72,0,16,30,350,search' ref={ref => this.filtertext = ref} onSearch={this.handleSearchFilter.bind(this)} />
              <AntTextBox params='filtercounter,,0,1,438,30,55,readonly' ref={ref => this.filtercounter = ref} />
              <DownOutlined id='btnmovedown' onClick={this.handleLocateIcon.bind(this)} style={{position:'absolute', top:10, left:510}} />
              <UpOutlined  id='btnmoveup' onClick={this.handleLocateIcon.bind(this)} style={{position:'absolute', top:9, left:540}} />
            </Form>
          </Header>
          <Layout>
            <Sider theme='light' width={320} style={{overflow:'auto', position:'relative', marginRight:3, borderRight:'1px solid #95B8E7'}} >
              <Tree ref={ref => this.myTree1 = ref} treeData={this.state.data}
                fieldNames={{title:'text', key:'id'}} switcherIcon={<DownOutlined />} 
                showLine ={true} checkable={false} blockNode={true}
                expandAction="doubleClick" 
                onSelect={this.handleSelect.bind(this)} 
                onDoubleClick={this.handleDoubleClick.bind(this)}
                onExpand={this.handleExpand.bind(this)}
                loadData={this.loadData.bind(this)}
                titleRender={(node)=>{
                  let html;  //FolderOpenOutlined
                  //console.log(1999,node.id,node.text,this.state.nodes[node.id]);
                  if (node.isLeaf) html=<span><FileOutlined style={{marginRight:2, marginLeft:4}} />{node.text}</span>
                  else if (this.state.expandedFlag[node.id]) html=<span><FolderOpenOutlined onClick={(e)=>this.handleIconClick(node)} style={{marginRight:2, marginLeft:4}} />{node.text}</span>
                  else html=<span><FolderOutlined onClick={(e)=>this.handleIconClick(node)} style={{marginRight:2, marginLeft:4}} />{node.text}</span>
                  return(html)                
                }} />
            </Sider>
            <Content style={{marginLeft:0, borderLeft:'1px solid #95B8E7',position:'relative', overflow:'hidden', height:'100%'}}>
               <Tabs defaultActiveKey="myTab1" size="small" tabBarGutter={16}
                style={{ height: '100%', width: '100%', position:'relative', overflow:'hidden'}}
                items={[{
                   label: (<span><DingdingOutlined style={{marginLeft:8, marginRight:6}} />{this.state.tab1Title}</span>), key: 'myTab1', 
                   children: <>
                     <Form name="myForm1" ref={ref=>this.myForm1=ref} autoComplete="off" initialValues={this.state.node} style={{display: this.state.showForm1? 'block' : 'none', position:'relative', height:280, overflow:'auto', margin:0}} >
                        <AntTextBox params='categoryid,类别编码,82,0,14,0,160,disabled' top={6+rowheight*0} ref={this.productid} />
                        <AntTextBox params='categoryname,类别名称,82,0,14,0,300,readonly' top={6+rowheight*1} />
                        <AntTextBox params='englishname,英文名称,82,0,14,0,300,readonly' top={6+rowheight*2} />
                        <AntTextBox params='description,类别描述,82,0,14,200,700,readonly;textarea' top={6+rowheight*3}   />
                     </Form>
                     <Form name="myForm2" ref={ref=>this.myForm2=ref} autoComplete="off" initialValues={this.state.node} style={{display: !this.state.showForm1? 'block' : 'none', position:'relative', height:'100%', overflow:'auto', margin:0}} >
                        <AntTextBox params='productid,商品编码,82,0,14,0,160,disabled' top={6+rowheight*0} ref={this.productid} />
                        <AntTextBox params='productname,商品名称,82,0,14,0,300,readonly' top={6+rowheight*1} />
                        <AntTextBox params='quantityperunit,规格型号,82,0,14,0,300,readonly' top={6+rowheight*2} />
                        <AntTextBox params='unit,计量单位,82,0,14,0,160,readonly' top={6+rowheight*3}  />
                        <AntNumberBox params='unitprice,单价,82,0,14,0,160' top={16+rowheight*4} min={0.01} precision={2} />
                        <AntTextBox params='subcategoryid,类别编码,82,0,14,0,160,readonly' top={16+rowheight*5}  />
                        <AntTextBox params='subcategoryname,类别名称,82,0,14,0,300,readonly' top={16+rowheight*6}  />
                        <AntTextBox params='supplierid,供应商编码,82,0,14,0,160,readonly' top={16+rowheight*7}  />
                        <AntTextBox params='suppliername,供应商名称,82,0,14,0,300,readonly' top={16+rowheight*8}  />
                        <AntImage params='photopath,图片预览,82,0,14,0,300' datatype='json' top={16+rowheight*9} ref={ref=>this.photopath=ref} fieldNames={{url:'filename'}} />
                     </Form>
                   </>                   
                  },{
                    label: (<span><TwitterOutlined style={{marginRight:6}}/>商品订单信息</span>), key: 'myTab2', 
                    children: <Table ref={ref => this.myGrid1 = ref} sticky size='small' rowKey='key'
                       scroll={{}} bordered={true} 
                       style={{position:'relative', width:850, height:'100%', overflow:'auto', margin:0}}                        
                       columns={this.state.columns} dataSource={this.state.griddata} pagination={false} />
                  }]}
                />
            </Content>
          </Layout>
        </Layout>
      )
    }
  }
