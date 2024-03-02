import React from 'react';
import { Panel, Tree, TreeGrid, GridColumn, Layout, LayoutPanel, TextBox, DateBox, Label} from 'rc-easyui';
import { reqdoSQL,  reqdoTree, searchTreeNode, addTreeChildrenData } from '../../api/functions.js'
export default class Page506 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {  //写属性
      myTree1Data: [],
      myTree2Data: [],
      datevalue1: new Date("2019-07-01"),
      datevalue2: new Date("2019-12-31")
    }
  }

  async componentDidMount() {
    this.loadTreeData1();
  }

  loadTreeData1 = async () => {
    let p={};
    //全部一次性展开   
    /*
    p.style = "full";
	  p.sqlprocedure = 'demo507a';    
    //部分一次性展开，部分分层展开（商品分层展开）   
    */
    p.style='full';
    p.sqlprocedure = 'demo507b';
    let rs = await reqdoTree(p); //调用函数，执行存储过程，返回树节点 
    //找到第一个叶子节点，选中它    
    this.setState({myTree1Data: rs.rows}, () => {
      setTimeout(()=>{
        if (rs.rows.length>0) this.myTree1.selectNode(rs.rows[0]);
      })
    });
  }

  loadTreeData2 = async (productid) => {
    let day1=new Date(this.state.datevalue1);
    let day2=new Date(this.state.datevalue2);
    let p={};
    p.style = "full";
    p.date1 =day1.getFullYear()+'-'+('0'+(1+day1.getMonth())).slice(-2)+'-'+('0'+day1.getDate()).slice(-2);
    p.date2 =day2.getFullYear()+'-'+('0'+(1+day2.getMonth())).slice(-2)+'-'+('0'+day2.getDate()).slice(-2);
    p.productid = productid;
	  p.sqlprocedure = 'demo507d';
    let rs = await reqdoTree(p); //调用函数，执行存储过程，返回树节点
    this.setState({myTree2Data: rs.rows}, () => {
      setTimeout(()=>{
        //if (rs.rows.length>0) this.myTree2.selectNode(rs.rows[0]);
      })
    });
  }    

  handleSelectionChange(node) {
   this.loadTreeData2(node.id);
    //this.setState({ selection: selection })
  }

  handleDblClick(tree, node){
    if (node.isparentflag>0){
      if (tree==="myTree1"){
        if (node.state==='closed') this.myTree1.expandNode(node);
        else this.myTree1.collapseNode(node);
      }else{
        if (node.state==='closed') this.myTree2.expandRow(node);
        else this.myTree2.collapseRow(node);          
      }
    }
  }

  handleContextMenu(tree, e){
    e.originalEvent.preventDefault();
    if (tree==="myTree1"){
      this.myTree1.selectNode(e.node);
    }else{
      this.myTree2.selectRow(e.row)
    }
  }

  async handleNodeExpand(node) {  //新增和展开子节点
    if (node.children && node.children.length===1 && node.children[0].text.trim()===''){
        let p={};
        p.style="expand";
        p.parentnodeid=node.id;
        p.sqlprocedure = 'demo507c';
        let rs = await reqdoTree(p);
        //*第一种方法
        let data = [...this.state. myTree1Data];
        //替换原数组data中的children值
        data = addTreeChildrenData(data, node, rs.rows); //将rs.rows数据添加为node的子节点
        this.setState({myTree1Data: data}, () => {
          setTimeout(()=>{
            this.myTree1.expandNode(node);  
          })
        });
        /*
        //*第二种方法，不需要更新data数据。有人认为速度较慢
        node.children=rs.rows;
        setTimeout(()=>{
           this.myTree1.collapseNode(node);
           this.myTree1.expandNode(node);  
        })
       */
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
      <span>
        {node.text}
        {count}
      </span>
    )
  }

  handleDateChange(id,value){
    console.log(555,id,value);
    if (id==='date1') this.setState({datevalue1: value});
    else this.setState({datevalue2: value});
  }
  
  render() {
    const dbProps = {
      //value: this.state.datevalue1,
      //onChange: this.handleDateChange.bind(this)
    }
    return (
      <div>
        <Layout style={{ width: '100%', height: '100%',position:'absolute' }}>
          <LayoutPanel region="north" style={{ height: 34 }}>
              <div id="toolbar1" style={{backgroundColor:'#E0ECFF',height:33, overflow:'hidden'}}>
                <TextBox style={{ marginBottom:0, width:400 }} placeholder="快速过滤..." onChange={this.handleFilter.bind(this)} />
                <Label htmlFor="date1" className="labelStyle" style={{ marginLeft:10, width: 70 }}>订单区间:</Label>
                <DateBox inputId="date1" value={this.state.datevalue1} ref={ref => this.date1 = ref} onChange={this.handleDateChange.bind(this,'date1')} format="yyyy-MM-dd" style={{ marginLeft:0, width: 160 }} {...dbProps} ></DateBox>
                <Label htmlFor="date2" className="labelStyle" style={{ marginLeft:10, width:20 }}>~</Label>
                <DateBox inputId="date2" value={this.state.datevalue2} ref={ref => this.date2 = ref} onChange={this.handleDateChange.bind(this,'date2')}format="yyyy-MM-dd" style={{ marginLeft:0, width: 160 }} {...dbProps} ></DateBox>
              </div>
          </LayoutPanel>
          <LayoutPanel region="west" style={{ width:300 }} split>
              <Tree data={this.state.myTree1Data} border={false} ref={node => this.myTree1 = node} style={{ overflow:'auto',width:'100%', height:'100%', position:'absolute' }}
                xrender={this.renderNode} 
                onSelectionChange={this.handleSelectionChange.bind(this)}
                onNodeDblClick={this.handleDblClick.bind(this, "myTree1")}
                onNodeContextMenu={this.handleContextMenu.bind(this, "myTree1")}
                onNodeExpand={this.handleNodeExpand.bind(this)} >
              </Tree>
          </LayoutPanel>
          <LayoutPanel region="center" style={{ height:'100%' }}>
              <TreeGrid data={this.state.myTree2Data} ref={node => this.myTree2 = node} style={{ overflow:'auto', width:'780px', height:'100%', position:'absolute' }}
                idField="id" treeField="id" 
                rowCss={(row) => {
                    if (row.isparentflag>0) return {background:'#b8eecf', fontStyle:'italic'};
                    else return null;
                }}
                onRowDblClick={this.handleDblClick.bind(this, "myTree2")}
                onRowContextMenu={this.handleContextMenu.bind(this, "myTree2")} >
                <GridColumn field="id" title="客户编码/订单号" halign="center" width="140px"></GridColumn>
                <GridColumn field="text" title="客户名称/订单日期" halign="center" width="220px"></GridColumn>
                <GridColumn field="quantity" title="销售数量" align="right" halign="center" width="90px"></GridColumn>
                <GridColumn field="unitprice" title="销售单价" align="right" halign="center" width="90px"></GridColumn>
                <GridColumn field="amount" title="销售金额"  align="right" halign="center" width="100px"></GridColumn>
              </TreeGrid>
          </LayoutPanel>
        </Layout>
      </div>
    );
  }
}
