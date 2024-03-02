import React from 'react';
import * as echarts from 'echarts';
//import ReactEcharts from 'echarts-for-react';
import { Panel, Tree, TreeGrid, GridColumn, Layout, LayoutPanel, TextBox, DateBox, Label} from 'rc-easyui';
import { reqdoSQL,  reqdoTree, searchTreeNode, addTreeChildrenData } from '../../api/functions.js'
//npm install install echarts --save
//npm install --save echarts -for -react

export default class Page506 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {  //写属性
      myTree1Data: [],
      datevalue: new Date("2019-12-01")
    }
  }

  async componentDidMount() {
    this.loadTreeData1();
    this.myChart = echarts.init(this.mainchart);
  }

  loadTreeData1 = async () => {
    let p={};
    p.style = "full";
	  p.sqlprocedure = 'demo507a';
    let rs = await reqdoTree(p); //调用函数，执行存储过程，返回树节点
    //找到第一个叶子节点，选中它    
    this.setState({myTree1Data: rs.rows}, () => {
      setTimeout(()=>{
        if (rs.rows.length>0) this.myTree1.selectNode(rs.rows[0]);
      })
    });
  }


  loadChartData = async (id) => {
    let day=new Date(this.state.datevalue);
    let p={};
    p.style = "full";
    p.xyear =day.getFullYear();
    p.id = id;
	  p.sqlprocedure = 'demo606a';
    console.log(p);
    let rs = await reqdoSQL(p); //调用函数，执行存储过程，返回树节点
    console.log(rs.rows);
    let xtitle=Array(12,'');
    for (let i=1; i<=12; i++) xtitle[i-1]=i+'月份';
    let xdata1=Array(12).fill(0);
    xdata1=Array.from({length:12},()=>{return 0});
    let xdata2=Array(12).fill(0);
    let xdata3=Array(12).fill(0);
    for (let i=0; i<rs.rows.length; i++)  {
      let m=parseInt(rs.rows[i].xmonth)-1;  //1
      xdata1[m]=parseFloat(rs.rows[i].amt);
      xdata2[m]=parseFloat(rs.rows[i].qty);
      xdata3[m]=parseFloat(rs.rows[i].profit,2);
    }  
    var option;
    const colors = ['#5470C6', '#91CC75', '#EE6666'];
    option = {
      color: colors,
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross'
        }
      },
      grid: {
        right: '20%'
      },
      toolbox: {
        feature: {
          dataView: { show: true, readOnly: false },
          restore: { show: true },
          saveAsImage: { show: true }
        }
      },
      legend: {
        data: ['销售额', '销售量', '利润额']
      },
      xAxis: [
        {
          type: 'category',
          axisTick: {
            alignWithLabel: true
          },
          // prettier-ignore
          data: xtitle // ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        }
      ],
      yAxis: [
        {
          type: 'value',
          name: 'Evaporation',
          position: 'right',
          alignTicks: true,
          axisLine: {
            show: true,
            lineStyle: {
              color: colors[0]
            }
          },
          axisLabel: {
            formatter: '{value}元'
          }
        },
        {
          type: 'value',
          name: 'Precipitation',
          position: 'right',
          alignTicks: true,
          offset: 80,
          axisLine: {
            show: true,
            lineStyle: {
              color: colors[1]
            }
          },
          axisLabel: {
            formatter: '{value} 元'
          }
        },
        {
          type: 'value',
          name: '温度',
          position: 'left',
          alignTicks: true,
          axisLine: {
            show: true,
            lineStyle: {
              color: colors[2]
            }
          },
          axisLabel: {
            formatter: '{value} °C'
          }
        }
      ],
      series: [
        {
          name: 'Evaporation',
          type: 'bar',
          data: xdata1 //[2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3]
        },
        {
          name: 'Precipitation',
          type: 'bar',
          yAxisIndex: 1,
          data: xdata2 //[2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3]
        },
        {
          name: 'Temperature',
          type: 'line',
          yAxisIndex: 2,
          data: xdata3 //[2.0, 2.2, 3.3, 4.5, 6.3, 10.2, 20.3, 23.4, 23.0, 16.5, 12.0, 6.2]
        }
      ]
    };
    option && this.myChart.setOption(option);



  }
    

  handleSelectionChange(node) {
   this.loadChartData(node.id);
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
        p.sqlprocedure = 'demo506a';
        let rs = await reqdoTree(p);
        //node.children=rs.rows;
        let xdata = this.state.data;
        //替换原数组data中的children值
        //eval('xdata'+searchTreeNode(node, xdata)+'=rs.rows');  //获取数组下标，例如olddata[0].children[1].children[1].children
        xdata = addTreeChildrenData(node, xdata, rs.rows); //将rs.rows数据添加为node的子节点
        //console.log(xdata);
        //this.setState({data: xdata});
        //this.myTree1.collapseNode(node);  //使用this.data更新数据时可以省略这条语句
        this.setState({data: xdata}, () => {
          setTimeout(()=>{
            //this.myTree1.collapseNode(node);  //使用this.data更新数据时可以省略这条语句
            this.myTree1.expandNode(node);  
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
      <span>
        {node.text}
        {count}
      </span>
    )
  }

  handleDateChange(value){
    //let day=new Date(value);
    //let date=day.getFullYear()+'-'+('0'+(1+day.getMonth())).slice(-2)+'-'+('0'+day.getDate()).slice(-2);
    this.setState({datevalue: value});
    return;
    //let day=new Date(value);
    //let date=day.getFullYear+'-'+(day.getMonth()+101).splice(-2)+'-'+(100+day.getDay()).splice(-2);
    //console.log(date);
    
  }
  
  render() {
    const dbProps = {
      value: this.state.datevalue,
      onChange: this.handleDateChange.bind(this)
    }
    return (
      <div>
        <Layout style={{ width: '100%', height: '100%',position:'absolute' }}>
          <LayoutPanel region="north" style={{ height: 34 }}>
              <div id="toolbar1" style={{backgroundColor:'#E0ECFF',height:33, overflow:'hidden'}}>
                <TextBox style={{ marginBottom:0, width:400 }} placeholder="快速过滤..." onChange={this.handleFilter.bind(this)} />
                <Label htmlFor="date1" className="labelStyle" style={{ marginLeft:10, width: 70 }}>订单月份:</Label>
                <DateBox inputId="date1" ref={ref => this.date1 = ref} format="yyyy-MM-dd" style={{ marginLeft:0, width: 220 }} {...dbProps} ></DateBox>
          
              </div>
          </LayoutPanel>
          <LayoutPanel region="west" style={{ width:300 }} split>
              <Tree data={this.state.myTree1Data} border={false} ref={node => this.myTree1 = node} style={{ overflow:'auto',width:'100%', height:'100%', position:'absolute' }}
                xrender={this.renderNode} 
                onSelectionChange={this.handleSelectionChange.bind(this)}
                onNodeDblClick={this.handleDblClick.bind(this, "myTree1")}
                onNodeContextMenu={this.handleContextMenu.bind(this, "myTree1")}
                xonNodeExpand={this.handleNodeExpand.bind(this)} >
              </Tree>
          </LayoutPanel>
          <LayoutPanel region="center" style={{ height:'100%' }}>
            <div ref={node => this.mainchart = node} style={{ height:'100%' }} ></div>
          </LayoutPanel>
        </Layout>
      </div>
    );
  }
}
