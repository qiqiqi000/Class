import React from 'react';
import { Panel, Tree, Layout, LayoutPanel, TextBox} from 'rc-easyui';
import { reqdoSQL,  reqdoTree, searchTreeNode, addTreeChildrenData } from '../../api/functions.js'
export default class Page506 extends React.Component {
  //举例总结树的集中构造的方法知识点：1）本身就含4个列的树，一次性展开节点；2）编造4个列的树，本身就含4个列的树，一次性展开节点；3）本身就含4个列的树，逐级展开，一般使用1个存储过程；4）本身不含4个列的树，自己展开，一般要多个存储过程，或一个存储过程中使用if语句分层处理；5）把含4个列的表与不含4个列的表合成做成树，一次性展开；6）把含4个列的结果与不含4个列的结果做成树，分层展开。
  constructor(props) {
    super(props);
    this.state = {  //写属性
      data: []
    }
  }

  async componentDidMount() {
    this.loadTreeData();
  }

  loadTreeData = async () => {
    let p={};
    p.style="expand";
    p.parentnodeid='';
	  p.sqlprocedure = 'demo506a';
    let rs = await reqdoTree(p); //调用函数，执行存储过程，返回树节点
    //console.log(JSON.stringify(rs.rows));
    this.setState({data: rs.rows}, () => {
      setTimeout(()=>{
        if (rs.rows.length>0) this.myTree1.selectNode(rs.rows[0]);
      })
    });
  }

  handleSelectionChange(node) {
    this.setState({ node: node })
  }

  handleTreeDblClick(node){
    if (node.isparentflag>0){
      if (node.state==='closed') this.myTree1.expandNode(node);
      else this.myTree1.collapseNode(node);
    }
  }

  handleContextMenu(e){
    e.originalEvent.preventDefault();
    this.myTree1.selectNode(e.node);
  }

  async handleNodeExpand(node) {  //新增和展开子节点
    if (node.children && node.children.length===1 && node.children[0].text.trim()===''){
        let p={};
        p.style="expand";
        p.parentnodeid=node.id;
        p.sqlprocedure = 'demo506a';
        let rs = await reqdoTree(p);
        //*第一种方法
        let data =[...this.state.data];
        //替换原数组data中的children值
        data = addTreeChildrenData(data, node, rs.rows); //将rs.rows数据添加为node的子节点
        this.setState({data: data}, () => {
          setTimeout(()=>{
            //this.myTree1.collapseNode(node);  //使用this.data更新数据时可以省略这条语句
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
  
  render() {
    return (
      <div>
        <Layout style={{ width: '100%', height: '100%',position:'absolute' }}>
        <LayoutPanel region="north" style={{ height: 34 }}>
            <div id="toolbar1" style={{backgroundColor:'#E0ECFF',height:33, overflow:'hidden'}}>
              <TextBox style={{ marginBottom: '10px', width: '100%' }} placeholder="快速过滤..." onChange={this.handleFilter.bind(this)} />
            </div>
        </LayoutPanel>
        <LayoutPanel region="west" style={{ width:300 }} split>
            <Tree data={this.state.data} border={false} ref={node => this.myTree1 = node} style={{ overflow:'auto',width:'100%', height:'100%', position:'absolute' }}
              xrender={this.renderNode} onSelectionChange={this.handleSelectionChange.bind(this)}
              onNodeDblClick={this.handleTreeDblClick.bind(this)}
              onNodeContextMenu={this.handleContextMenu.bind(this)}
              onNodeExpand={this.handleNodeExpand.bind(this)} >
            </Tree>
         </LayoutPanel>         
         </Layout>
      </div>
    );
  }
}
