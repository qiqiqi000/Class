import React from 'react';
import { Panel, Tree, Layout, LayoutPanel, TextBox, DataList} from 'rc-easyui';
import { reqdoSQL,  reqdoTree } from '../../api/functions.js'
export default class Page505 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {  //写属性
      data: [],
      listdata: []
    }
  }

  async componentDidMount() {
    this.loadTreeData();
  }

  loadTreeData = async () => {  
     let p={};
     p.style="full";
     //p.keyvalue='';
	   p.sqlprocedure = 'demo505a'; 
     let rs = await reqdoTree(p); //调用函数，执行存储过程，返回树节点
     this.setState({data: rs.rows}, () => {
       setTimeout(()=>{
         if (rs.rows.length>0) this.myTree1.selectNode(rs.rows[0]);
       })
    });
  }

  async handleSelectionChange(node) {   
     let p={};
     p.categoryid=node.categoryid;
     if (parseInt(node.isparentflag) === 0) p.sqlprocedure = 'demo505b';
     else p.sqlprocedure = 'demo505c';
     let rs = await reqdoSQL(p); //调用函数，执行存储过程，返回树节点
     this.setState({listdata: rs.rows});
  }
  
  handleDblClick(node){
    if (node.isparentflag>0){
      if (node.state==='closed') this.myTree1.expandNode(node);
      else this.myTree1.collapseNode(node);
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
  
  render() {
    //作业：添加叶子节点的商品节点个数
    return (
      <div>
        <Layout style={{ width: '100%', height: '100%',position:'absolute' }}>
          <LayoutPanel region="north" style={{ height: 34 }}>
            <div id="toolbar1" style={{backgroundColor:'#E0ECFF',height:33, overflow:'hidden'}}>
              <TextBox style={{ marginBottom: '10px', width: '100%' }} placeholder="快速过滤..." onChange={this.handleFilter.bind(this)} />
            </div>
          </LayoutPanel>
          <LayoutPanel region="west" style={{ width:300 }} split>
             <Tree data={this.state.data} checkbox border={false} ref={node => this.myTree1 = node} style={{ overflow:'auto',width:'100%', height:'100%', position:'absolute' }}
                render={this.renderNode} onSelectionChange={this.handleSelectionChange.bind(this)}>
             </Tree>
          </LayoutPanel>
         <LayoutPanel region="center" style={{ height:'100%' }}>
            <DataList data={this.state.listdata} style={{ height: '100%' }} border={false}
              ref={node => this.myList1 = node} selectionMode='single' 
              renderItem={({ row }) =>{
                if (row === undefined) return;
                else return (
                  <div style={{marginTop:15, marginLeft:8}}>
                    <div style={{float:'left'}}>{row.productid}-{row.productname}</div>
                    <div style={{float:'right', marginRight:6}}>{row.quantityperunit}-{row.unit}-{row.unitprice}元</div>
                    <div style={{clear:'both'}}></div>
                  </div>
                )
              }}
              />
         </LayoutPanel>
         </Layout>
      </div>
    );
  }
}
