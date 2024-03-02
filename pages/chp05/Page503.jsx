import React from 'react';
import { DataList,  CheckBox, ComboBox, Label, LayoutPanel,ButtonGroup,LinkButton, Layout, Panel} from 'rc-easyui';
import { reqdoSQL } from '../../api/functions.js'
import { MyDefTextBox, MyTextBox } from '../../api/easyUIComponents.js'

const rowheight=42;
export default class Page503 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {  //写属性
      data: [],
      row: {},
      total: 0,
      pageNumber: 1,
      pageSize: 10,
      fieldset: 'productid;productname;englishname;quantityperunit;unit;unitprice;categoryid;supplierid',
      addoredit: 'edit',  //新增或修改状态
      selection: null
    }
  }
  async componentDidMount() {
     this.loadPageData(1, this.state.pageSize);
  }

  loadPageData = async (pageno, pagesize) => {
    var p = {};
    p.sqlprocedure = 'demo503a';
    p.pageno = pageno;
    p.pagesize = pagesize;
    p.keyvalue='';
    p.sortfield='';
    p.filter='';
    const rs = await reqdoSQL(p); //1.获取到数据
    let total = (rs.rows.length===0? 0 : parseInt(rs.rows[0].total)); //2.获取总行数
    var data = new Array(total).fill({});   //3.建立一个总行数长度的数组,其他行为空值
    data.splice((pageno-1)*pagesize,pagesize, ...rs.rows)  //4.替换数组中指定位置的数据
    this.setState({ data:data, pageNumber:pageno, total:total}, () => {
      setTimeout(()=>{
        if (rs.rows.length>0) this.myList1.selectRow(rs.rows[0]);
      })
    });

  }

  myRowSelect = (row) => {
    if (row === undefined) return;
    //将json数据赋值到easyui控件中
    row.photopath='/myServer/mybase/products/'+row.productid+'.jpg';  //不是自定义组件
    this.setState({ row:row, addoredit:'edit' }, () => {
      setTimeout(()=>{
        for (var key in row) {
          if (this[key] !== undefined){
            this[key].setState({ value: row[key] });
          }
        }
        this.productid.setState({ editable:false });  //设置商品编码为只读
      })
    });
  }  

  getImage(row) {
    //if (row === undefined) return;
    return '/myServer/mybase/products/'+row.productid+'.jpg';
  }

  handleSelectionChange(row) {
  }
  
  handleAddClick = async (e) =>{
    let p={};
    this.setState({ addoredit:'add' });
  }

  handleDeleteClick = async (e) =>{
    let p={};
  }

  handleSaveClick = async (e) =>{
    let p={};
    p.addoredit=this.state.addoredit;
    let tmp=this.state.fieldset.split(';');
    for (let i=0; i<tmp.length; i++){
       p[tmp[i]]=this[tmp[i]].state.value;
    }
    p.sqlprocedure="demo502b";
    let rs = await reqdoSQL(p); //调用函数，执行存储过程保存数据。必须加await
    //替换数组中的这个元素
    let row = p;
    if (rs.rows.length>0) row=rs.rows[0];
    let flag=-1;
    let data=this.state.data;
    for (let i in data){
      if (data[i].productid === p.productid){
        flag=i;
        break;
      }  
    }
    if (flag>=0){
       data[flag] = row;
       //this.setState({data: data});
       //this.myList1.setData(data);  //更新datalist的数据
       this.setState({data:data}, () => {
         setTimeout(()=>{
           this.myList1.setData(data);  //更新datalist的数据
         })
      });
    }
  }

  handleButtonClick = async (e) =>{
    let p={};
    p.filter=this.filter.state.value;
    p.sqlprocedure='demo502a';
    let rs = await reqdoSQL(p); //调用函数，执行存储过程。必须加await
    this.setState({data: rs.rows}, () => {
      setTimeout(()=>{
         if (rs.rows.length>0) this.myList1.selectRow(rs.rows[0]);
      })
    });
  }

  addon(icon){    
    let css='';     
    if (icon === 'search') css='textbox-icon icon-search';
    else if (icon === 'help') css='textbox-icon icon-help';
    return (
       <span className={css} onClick={this.handleButtonClick.bind(this)}></span>
    )
  }

  handleFocus = (e) =>{
    
  }

  render() {
    let p1=MyDefTextBox('productid','商品编码', 72, 20+0*rowheight, 20, 0, 200,'','readonly');
    let p2=MyDefTextBox('productname','商品名称', 72, 20+1*rowheight, 20, 0, 400,'','');
    let p3=MyDefTextBox('englishname','英文名称', 72, 20+2*rowheight, 20, 0, 400,'','');
    let p4=MyDefTextBox('quantityperunit','规格型号', 72, 20+3*rowheight, 20, 0, 200,'','');
    let p5=MyDefTextBox('unit','计量单位', 72, 20+4*rowheight, 20, 0, 200,'','');
    let p6=MyDefTextBox('unitprice','单价', 72, 20+5*rowheight, 20, 0, 200,'','');
    let p7=MyDefTextBox('categoryid','所属类别', 72, 20+6*rowheight, 20, 0, 200,'','');  //添加addon时，这个列的宽度增大，后面这个列简介要拉大    
    let p8=MyDefTextBox('categoryname','', 72, 20+6*rowheight, 292, 0, 300,'','readonly');
    let p9=MyDefTextBox('supplierid','供应商', 72, 20+7*rowheight, 20,0, 200,'','');
    let p10=MyDefTextBox('companyname','', 72, 20+7*rowheight, 292,0, 300,'','readonly');    
    let p11=MyDefTextBox('photopath','', 72, 0, 0, 0, 100,'','hidden');   //隐藏的文本框，可以保存数据库的值 
    let p91=MyDefTextBox('filter','快速过滤', 72, 2, 16,0, 300,'','');
    return (
      <div>
        <Layout style={{ width: '100%', height: '100%',position:'absolute' }}>
          <LayoutPanel region="north" style={{  }}>
             <div id="toolbar1" style={{paddingTop:1, paddingLeft:4, backgroundColor:'#E0ECFF',height:50, overflow:'hidden'}}>
               <ButtonGroup>
                  <LinkButton style={{width:52, height:48}} iconAlign="top" iconCls="addIcon" onClick={this.handleAddClick.bind(this)} >新增</LinkButton>
                  <LinkButton style={{width:52, height:48}} iconAlign="top" iconCls="editIcon" disabled>修改</LinkButton>
                  <LinkButton style={{width:52, height:48}} iconAlign="top" iconCls="deleteIcon" onClick={this.handleDeleteClick.bind(this)} >删除</LinkButton>
                  <LinkButton style={{width:52, height:48}} iconAlign="top" iconCls="saveIcon" onClick={this.handleSaveClick.bind(this)} >保存</LinkButton>
                </ButtonGroup>
                <MyTextBox params='filter,快速过滤,72, 12, 240, 0, 290, ,searchbutton' ref={ref => this.filter = ref} addonRight={this.addon.bind(this, 'search')} />
             </div>
          </LayoutPanel>
          <LayoutPanel region="west" style={{ width: 390 }} split={true}>
            <DataList pagination data={this.state.data} style={{ height: '100%' }} border={false}
              onRowSelect={(row) => this.myRowSelect(row)}
              ref={node => this.myList1 = node} selectionMode='single' 
              onPageChange={({ pageNumber, pageSize }) => { this.loadPageData( pageNumber, pageSize ) }}
              renderItem={({ row }) =>{
                if (row === undefined) return;
                else return (
                  <div style={{marginTop:15, marginLeft:8}}>
                    <center><img src={this.getImage(row)} style={{height:64, width:56}} /></center>        
                    <div style={{float:'left'}}>{row.productid}-{row.productname}</div>
                    <div style={{float:'right', marginRight:6}}>{row.quantityperunit}-{row.unit}-{row.unitprice}元</div>
                    <div style={{clear:'both'}}></div>
                    <div style={{float:'left'}} className="textdiv">{row.categoryid+'-'+row.categoryname}类</div>
                    <div style={{float:'right', marginRight:6}}>{row.companyname}</div>
                    <div style={{clear:'both'}}></div>
                  </div>
                )
              }}
              total={this.state.total}
              pageNumber={this.state.pageNumber}
              pageSize={this.state.pageSize}>
            </DataList>
          </LayoutPanel>
          <LayoutPanel region="center" style={{ height: '100%' }}>
            <Panel border={false} style={{overflow:'auto', height: '100%' }}>
               <MyTextBox attr={p1} ref={ref => this.productid = ref} placeholder="商品编码不能为空" onFocus={this.handleFocus.bind(this)} />
               <MyTextBox attr={p2} ref={ref => this.productname = ref} />
               <MyTextBox attr={p3} ref={ref => this.englishname = ref} />
               <MyTextBox attr={p4} ref={ref => this.quantityperunit = ref} />
               <MyTextBox attr={p5} ref={ref => this.unit = ref} />
               <MyTextBox attr={{id:"unitprice", label: "单价", labelwidth: 72, left: 20, top: 20+5*rowheight, width: 200}} ref={ref => this.unitprice = ref} />
               <MyTextBox attr={p7} ref={ref => this.categoryid = ref} placeholder="输入类别编码" addonRight={this.addon.bind(this, 'help')} />
               <MyTextBox attr={p8} ref={ref => this.categoryname = ref} />
               <MyTextBox id='supplierid' label='供应商' labelwidth='72' top={20+7*rowheight} left='20' width='200' ref={ref => this.supplierid = ref} addonRight={this.addon.bind(this, 'help')} />
               <MyTextBox attr={p10} ref={ref => this.companyname = ref} />
               <MyTextBox attr={p11} ref={ref => this.photopath = ref} />
               <img ref={ref => this.imagepath = ref} src={this.state.row.photopath} style={{position:'absolute', top:20+8*rowheight, left:20, height:224, width:196}} />
            </Panel>
          </LayoutPanel>
        </Layout>
      </div>
    );
  }
}
