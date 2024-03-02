import React, { Component } from 'react';
import ReactDOM from "react-dom";
import { SheetComponent } from "@antv/s2-react";
import '@antv/s2-react/dist/style.min.css';
import * as echarts from 'echarts';
import { myNotice, findTreeNode, myStr2JsonArray, reqdoTree, reqdoSQL, addTreeChildrenData, searchTreeNode, myPreventRightClick } from '../../api/functions';
import { MyFormComponent } from '../../api/antdFormClass.js';
import { ConfirmModal, AntTextBox, AntSearchBox } from '../../api/antdComponents.js'
import { BlockOutlined, ReadOutlined, FileOutlined, TagOutlined, PaperClipOutlined, FullscreenOutlined, FullscreenExitOutlined, DownOutlined, UpOutlined, RightOutlined, RedoOutlined, FileAddOutlined, FileExcelOutlined, AuditOutlined, WindowsOutlined, FileUnknownOutlined, FormOutlined, PlusCircleOutlined, EditOutlined, DeleteOutlined, SaveOutlined, PrinterOutlined } from '@ant-design/icons';
import { Popconfirm, Dropdown, Tabs, Layout, Menu, Button, Image, Form, Select } from 'antd';
import { Tree } from 'antd';
import { Resizable } from 'rc-easyui';
import { type } from '@testing-library/user-event/dist/type';
const { Header, Content, Footer, Sider } = Layout;
//https://ant.design/components/overview-cn/ 
const rowheight = 45;
const { TreeNode } = Tree;
//export default class Page1001 extends Component {
export default class Page1001 extends MyFormComponent {
  constructor(props) {
    super(props)
    this.state = {
      data: [],  //结点数据源
      node: {},   //当前选中的结点
      record: {}, //当前选中的结点，用来保存转换格式后的旧数据
      treewidth: 300,
      formdisabled: true,
      keyfield: 'categoryid',
      textfield: 'categoryid;;categoryname',
      treefield: 'categoryid',
      selectedKeys: [],
      addoredit: 'update',
      disablemenu: false,
      message: '',
      menupos: { x: 400, y: 300 },
      tmpnodeid: '_tmp',
      activeTabKey: 'myTab1',
    }
  }

  async componentDidMount() {
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
        this.handleSelectNode([rows[0].id], e);
      })
   });
    //this.drawCharts(10);
  }

  
  handleTabSelect =(key)=>{
    //console.log(444,key,e)
    this.setState({activeTabKey: key},()=> this.drawCharts());
  }

  drawCharts = async () => {
    let {node, activeTabKey} =this.state;
    let type, div;
    if (activeTabKey==='myTab1'){ 
      type='line'; 
      div='myDiv1';
    } else if (activeTabKey==='myTab2'){
      type='bar'; 
      div='myDiv2';      
    }    
    //
    let p={};
    p.sqlprocedure='demo1201a';
    p.date1='2019-01-01';
    p.date2='2019-12-31';
    p.categoryid=node.id;
    console.log(99,p)
    let rs=await reqdoSQL(p);
    console.log(rs.rows);
    let category=[];
    let data=[];
    for (let i=0; i<rs.rows.length; i++){
      category.push(rs.rows[i].xmonth);
      data.push(parseFloat(rs.rows[i].amt))
    }

    let chartDom = document.getElementById(div);
    let myChart = echarts.init(chartDom);
    let option = {
      xAxis: {
        type: 'category',
        data: category, //['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          data: data, //[820, 932, 901, 934, 1290, 1330, 1320],
          type: type, //'line',
          smooth: true
        }
      ]
    };    
    option && myChart.setOption(option);    
    myChart.on('click', async (params) =>{
      console.log(category[params.dataIndex]);
      p={};
      p.date1=category[params.dataIndex] + "-01";
      p.date2=category[params.dataIndex] + "-31";
      p.sqlprocedure='demo1201b';
      p.categoryid=node.id;
      rs=await reqdoSQL(p);
      category=[];
      data=[];
      for (let i=0; i<rs.rows.length; i++){
        category.push(rs.rows[i].xday);
        data.push(parseFloat(rs.rows[i].amt))
      }
      chartDom = document.getElementById(div);
       myChart = echarts.init(chartDom);
      option = {
        xAxis: {
          type: 'category',
          data: category, //['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            data: data, //[820, 932, 901, 934, 1290, 1330, 1320],
            type: type, //'line',
            smooth: true
          }
        ]
      };    
      option && myChart.setOption(option);    
      myChart.off("click");


      // 1. 准备数据

    });
    fetch(
      'https://gw.alipayobjects.com/os/bmw-prod/cd9814d0-6dfa-42a6-8455-5a6bd0ff93ca.json',
    )
      .then((res) => res.json())
      .then((res) => {
        const s2Options = {
          width: 600,
          height: 480,
          hierarchyType: 'tree',
        };
    
        const s2DataConfig = {
          fields: {
            rows: ['province', 'city'],
            columns: ['type', 'sub_type'],
            values: ['number'],
          },
          meta: res.meta,
          data: res.data,
        };
    
        const sex = ['男', '女'];
    
        const PartDrillDown = {
          drillConfig: {
            dataSet: [
              {
                name: '客户性别',
                value: 'sex',
                type: 'text',
              },
            ],
          },
    
          fetchData: (meta, drillFields) =>
            new Promise((resolve) => {
              const dataSet = meta.spreadsheet.dataSet;
              const field = drillFields[0];
              const rowDatas = dataSet.getMultiData(meta.query);
              const drillDownData = [];
              rowDatas.forEach((data) => {
                const { city, number, province, sub_type: subType, type } = data;
                const number0 = Math.ceil(Math.random() * (number - 50)) + 50;
                const number1 = number - number0;
                const dataItem0 = {
                  city,
                  number: number0,
                  province,
                  sub_type: subType,
                  type,
                  [field]: sex[0],
                };
                drillDownData.push(dataItem0);
                const dataItem1 = {
                  city,
                  number: number1,
                  province,
                  sub_type: subType,
                  type,
                  [field]: sex[1],
                };
    
                drillDownData.push(dataItem1);
              });
    
              resolve({
                drillField: field,
                drillData: drillDownData,
              });
            }),
        };
    
        ReactDOM.render(
          <SheetComponent
            dataCfg={s2DataConfig}
            options={s2Options}
            partDrillDown={PartDrillDown}
            adaptive={false}
          />,
          document.getElementById(div),
        );
      });
    
  }
    

//sssssssss
handleSelectNode = (key, e) => {
  console.log(11110, e.node.id)
  //选中一个结点时，判断是否需要删除假结点（如果存在的话）
  let node = e.node;
  this.setState({node }, () => {
    setTimeout(() => {
      this.drawCharts();
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

  handleRightClick = (e) => {
    console.log(333, e.event.pageX, e.event.pageY);
    this.setState({ menupos: { y: e.event.pageY } })
    //右键时选中这个结点，注意需要使用数组    
    this.handleSelectNode([e.node.id], e)
    this.myTree1.setState({ selectedKeys: [e.node.id] });
  }

  handleDoubleClick = (e, node) => {
    //双节结点时选中这个结点，注意需要使用数组
    this.myTree1.setState({ selectedKeys: [node.id] });
  }

  expandTreeNode = (key) => {
    //强制用语句展开结点
    if (this.myTree1.state.expandedKeys.indexOf(key) < 0) this.myTree1.setExpandedKeys([...this.myTree1.state.expandedKeys, ...[key]]);
  }

  collapseTreeNode = (key) => {
    //强制用语句展开结点
    this.myTree1.setExpandedKeys(this.myTree1.state.expandedKeys.filter((item) => item != key));
  }

  handleSearchFilter = async () => {
    //通过数据库查找第一个满足条件的节点，可以设一个参数i，一个个向下查找所有节点
    let p = {};
    p.filter = this.filtertext.state.value;
    p.rowno = 1;
    p.sqlprocedure = "demo803c";
    let rs = await reqdoSQL(p);
    let rows = rs.rows;
    if (rows.length == 0) return;
    let data = [...this.state.data]
    //首先找到各层父结点，展开父结点
    if (rows[0].ancestor.trim() != '') {
      let keys = rows[0].ancestor.split('#');
      for (let i = 0; i < keys.length - 1; i++) {
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
    let key = node.id;
    this.myTree1.setState({ selectedKeys: [key] }, () => {
      //定位到这个结点，使用原生的js语句
      if (document.getElementsByClassName('ant-tree-treenode-selected').length > 0) {
        document.getElementsByClassName('ant-tree-treenode-selected')[0].scrollIntoView();
      }
      //this.myTree1.scrollTo({key: rows[0].id});//没有效果
      let e = {};
      e.node = node;
      this.handleSelectNode(node.id, e);
    });
  }

  addChildNode = (pnode) => { //增加子节点
   
  }

  handleAddChildClick = async (e) => {  //aaaaaa
    //增加子结点
    let { node, data } = this.state;
    let parentnode = findTreeNode(data, node.id);
    let xnode = this.addChildNode(parentnode);
  }

  handleAddClick = async (e) => {  //aaaaaa
    //增加兄弟结点
    let { node, data, tmpnodeid } = this.state;
    let parentnode = null;
    if (node.parentnodeid != '') {
      //parentnode = searchTreeNode(data, node).parentnode;
      parentnode = findTreeNode(data, node.parentnodeid);
    }
    if (node.id != tmpnodeid && node.text.trim() != '') {
      let xnode = this.addChildNode(parentnode);
    }
  }

  handleUpdateClick = async (e) => {  //eeeeeeeeeee
    //修改记录
    //if (!this.state.node.categoryid) return;
    this.setState({ addoredit: 'update', formdisabled: false })
    let fields = this.getFormFields('myForm1');
    for (let i = 0; i < fields.length; i++) {
      this[fields[i]]?.setState({ editable: true });
    }
    this[this.state.keyfield]?.setState({ editable: false });
  }

  handleDeleteClick = async (e) => {
    this.myDeleteModal.setState({ visible: true, description: '是否确定删除【' + this.state.node[this.state.keyfield] + '】这个类别？' });
    return;
  }

  handleDeleteNode = async (e) => {  //ddddddd
    
  }

  handleSaveClick = async (e) => {  //sssssssssssssave
       
  }

  handleRefresh = () => {  //rrrrrrrr 
    console.log(this.filtertext);
    this.filtertext.setState({ value: '' });    //不会清空
    this.setState({ data: [], node: {}, addoredit: 'update', formdisabled: true, selectedKeys: [], disablemenu: false }, () => {
      setTimeout(() => {
        this.loadTreeData();
      })
    });
  }

  handleMyMenu1Click = (e) => {
    //右键菜单程序
    //console.log(444,e);
    let key = e.key;
    if (key == 'menu-delete') this.handleDeleteClick(e);
    else if (key == 'menu-addchild') this.handleAddChildClick(e);
    else if (key == 'menu-add') this.handleAddClick(e);
    else if (key == 'menu-edit') this.handleUpdateClick(e);
    else if (key == 'menu-save') this.handleSaveClick(e);
  }

  handleResize = (e) => {
    this.setState({ treewidth: e.width });
  }

  render() {
    const items1 = [{
      label: '新增兄弟结点',
      key: 'menu-add',
      disabled: this.state.disablemenu,
      icon: <PlusCircleOutlined />
    }, {
      label: '新增子结点',
      key: 'menu-addchild',
      disabled: this.state.disablemenu,
      icon: <PlusCircleOutlined />
    }, {
      type: 'divider',
      key: 'sep11',
    }, {
      label: '修改结点',
      key: 'menu-edit',
      icon: <EditOutlined />
    }, {
      type: 'divider',
      key: 'sep12',
    }, {
      label: '删除结点',
      key: 'menu-delete',
      icon: <DeleteOutlined />
    }, {
      type: 'divider',
      key: 'sep13',
    }, {
      label: '保存',
      key: 'menu-save',
      icon: <SaveOutlined />
    }];
    //cccccccccccccharts
    return (< >
      <Layout style={{ overflow: 'hidden' }}>
        <Header style={{ padding: 0, paddingLeft: 4, height: 35, lineHeight: '30px', backgroundColor: '#E0ECFF', borderBottom: '1px solid #95B8E7', overflow: 'hidden' }}>
          <Form name='filterbar'>
            <div style={{ marginTop: 1, paddingTop: 1 }}>
              <Button type="text" icon={<RedoOutlined />} style={{ padding: 0, width: 72, height: 30 }} onClick={this.handleRefresh.bind(this)}>刷新</Button>
            </div>
          </Form>
        </Header>
        <Dropdown menu={{ items: items1, onClick: this.handleMyMenu1Click.bind(this) }} overlayStyle={{ width: 160 }} trigger={['contextMenu']}>
          <Layout>
            <Resizable onResizing={this.handleResize.bind(this)} minWidth={200} maxWidth={400}>
              <div style={{ width: this.state.treewidth }}>
                <Sider theme='light' width={this.state.treewidth} collapsed={this.state.collapsed} collapsible={false} zeroWidthTriggerStyle={true} collapsedWidth={60} style={{ overflow: 'auto', margin: 0, padding: 0, height: '100%', position: 'relative', marginLeft: 0, borderRight: '1px solid #95B8E7' }}>
                  <Tree ref={ref => this.myTree1 = ref} treeData={this.state.data} fieldNames={{ title: 'text', key: 'id' }}
                    checkable={false} showLine={true} autoExpandParent virtual
                    icon={<PaperClipOutlined />} showIcon={true}
                    expandAction="doubleClick" blockNode={true}
                    onSelect={this.handleSelectNode.bind(this)}
                    loadData={this.loadData.bind(this)}
                    onDoubleClick={this.handleDoubleClick.bind(this)}
                    onRightClick={this.handleRightClick.bind(this)}
                    filterTreeNode={this.handleFilterTreeNode.bind(this)}
                  />
                </Sider>
              </div>
            </Resizable>
            <Content style={{ overflow: 'auto', position: 'relative', height: '100%', marginLeft: 4, borderLeft: '1px solid #95B8E7' }}>
              <Tabs id="myTab" activeKey={this.state.activeTabKey} size="small" tabBarGutter={24} 
              onChange={this.handleTabSelect.bind(this)}
 
                style={{ marginLeft: 16, padding: 0, paddingRight: 20, height: '100%', width: '100%', position: 'relative', overflow: 'hidden' }}
                items={[{
                  label: '折线图', key: 'myTab1', forceRender: true, children:
                    <div id="myDiv1" style={{ padding: 0, margin: 0, position: 'relative', height: '100%', overflow: 'auto' }} >
                    </div>
                }, {
                  label: '柱状图', key: 'myTab2', forceRender: true, children:
                    <div id="myDiv2" style={{ padding: 0, margin: 0, position: 'relative', height: '100%', overflow: 'auto' }} >
                    </div>
                }, {
                  label: '圆饼图', key: 'myTab3', forceRender: true, children:
                    <div id="myDiv3"  style={{ padding: 0, margin: 0, position: 'relative', height: '100%', overflow: 'auto' }} >
                    </div>
                }
                ]}
              />
            </Content>
          </Layout>
        </Dropdown>
      </Layout>
      <ConfirmModal ref={ref => this.myDeleteModal = ref} onConfirm={this.handleDeleteNode.bind(this)} />
    </>

    )
  }
}
