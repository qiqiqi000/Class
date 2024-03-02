import React, { Component, useRef } from 'react'
import { Layout, LayoutPanel, Panel,  Messager, Label, CheckBox, TextBox, DateBox, NumberBox, RadioButton, ComboBox, ButtonGroup, LinkButton, MenuItem, DataList } from 'rc-easyui';
import { MyTextBox, MyDefTextBox, Timer, Weather, MyComboBox } from '../../api/easyUIComponents.js';
import { reqdoSQL, myLoadData } from '../../api/functions.js';
import axios from 'axios';
import { TextLayerInternal } from 'react-pdf/dist/umd/Page/TextLayer.js';
const titleStyle = {
  textAlign: 'center',
  marginTop: '10px'
}
const rowheight=42;

export default class Page502 extends Component {
  constructor(props) {
    super(props);
    //在这里初始化 state
    this.state = {
      data: [],
      row: {},
      fieldset: 'productid;productname;englishname;quantityperunit;unit;unitprice;categoryid;supplierid;categoryname;companyname',
      addoredit: 'update'  //新增或修改状态
    };
  }

  async componentDidUpdate(){
    document.addEventListener('keydown', this.handleKeyEvents);
  }
  
  async componentWillUnmount(){
    document.removeEventListener('keydown', this.handleKeyEvents);
  }

  async componentDidMount(){ //页面启动时就会执行执行，必须使用async异步
    let p={};
    p.filter='';
    p.sqlprocedure='demo502a';
    let rs = await reqdoSQL(p); //调用函数，执行存储过程。必须加await
    //this.myList1.setData(rs.rows);  //更新datalist的数据
    this.setState({data: rs.rows}, () => {
       setTimeout(()=>{
          if (rs.rows.length>0) this.myList1.selectRow(rs.rows[0]);
          //myLoadData(this.companyname);
       })
    });    
  }

  handleKeyEvents= async (e) =>{
    //键盘判断
    if (e.keyCode===13){
      let id=document.activeElement.id;  //获取光标所在的控件id
      if ( id==='categoryid') this.handleBlurCategoryid();
      else if (id==='supplierid') this.handleBlurSupplierid();
    }
    //console.log(e.keyCode);
  }

  handleBlurCategoryid = async () =>{
    let p={};
    p.tablename='categories';
    p.keyfield='categoryid';
    p.keyvalue=this.categoryid.state.value;
    p.sqlprocedure="sys_getTableRow";
    let rs = await reqdoSQL(p);
    let s='';
    if (rs.rows.length>0) s=rs.rows[0].categoryname; 
    this.categoryname.setState({value: s}, () => {
       setTimeout(()=>{
         //myLoadData(this.companyname);
       })
    });
  }

  handleBlurSupplierid = async () =>{
    let p={};
    p.tablename='suppliers';
    p.keyfield='supplierid';
    p.keyvalue=this.supplierid.state.value;
    p.sqlprocedure="sys_getTableRow";
    let rs = await reqdoSQL(p);
    let s='';
    if (rs.rows.length>0) s=rs.rows[0].companyname; 
    this.companyname.setState({value: s}, () => {
       setTimeout(()=>{
          //myLoadData(this.companyname);
       })
    });
  }

  handleSelectRow(row) {
     this.setState({row, row});   
  }

  handleSelectionChange(row) {
    //将json数据赋值到easyui控件中
    row.photopath='/myServer/mybase/products/'+row.productid+'.jpg';  //不是自定义组件
    this.setState({ row:row, addoredit:'update' }, () => {
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
  
  handleAddClick = async (e) =>{
    //清空所有控件
    let tmp=this.state.fieldset.split(';');
    for (let i=0; i<tmp.length; i++){
       this[tmp[i]].setState({value:''});
    }
    this.productid.setState({ value:0 });  //自增列必须为0
    this.setState({ addoredit:'add' });
  }

  handleDeleteClick =  (e) =>{    
    this.msgbox1.confirm({
       msg: '是否确定删除【'+this.state.row.productid+'】这个商品？',
       result: async r => {
          if (r) {
             let p={};
             let xdata={};
             xdata.productid=this.state.row.productid;
             xdata._action='delete';
             xdata._reloadrow=0;
             p.sqlprocedure="demo502c";
             p.data=[];
             p.data.push(xdata);  
             console.log(JSON.stringify(p.data));
             let rs = await reqdoSQL(p); //调用函数，执行存储过程保存数据。必须加await 
             let rowindex=this.state.data.findIndex(item=>item.productid===this.state.row.productid);
             let data=[...this.state.data];
             data.splice(rowindex,1)
             if (rowindex>=data.length-1) rowindex--;
             this.setState({data: data}, () => {
                setTimeout(()=>{
                   if (data.length>0) this.myList1.selectRow(data[rowindex]);
                })
             });
          }
       }
    });
  }

  handleSaveClick = async (e) =>{
    /*
    let p={};
    p.addoredit=this.state.addoredit;
    let tmp=this.state.fieldset.split(';');
    for (let i=0; i<tmp.length; i++){
       p[tmp[i]]=this[tmp[i]].state.value;
    }
    p.sqlprocedure="demo502b";
    */
    let xdata={};
    let tmp=this.state.fieldset.split(';');
    for (let i=0; i<tmp.length; i++){
       xdata[tmp[i]]=this[tmp[i]].state.value;
    }
    xdata._action=this.state.addoredit;
    xdata._reloadrow=1;
    xdata._treeflag=0;
    let p={};
    p.sqlprocedure="demo502c";
    p.data=[];
    p.data.push(xdata);   
    console.log(JSON.stringify(p.data));
    let rs = await reqdoSQL(p); //调用函数，执行存储过程保存数据。必须加await
    //替换数组中的这个元素
    let row = xdata;
    if (rs.rows.length>0) row=rs.rows[0];
    let flag=-1;
    let data=this.state.data;
    for (let i in data){
      if (data[i].productid === xdata.productid){
        flag=i;
        break;
      }  
    }
    if (flag>=0){
       data[flag] = row;
       this.setState({data:data}, () => {
        setTimeout(()=>{
           this.myList1.setData(data);  //更新datalist的数据         
        })
       //this.setState({data: data});
      });
    }
  }

  handleButtonClick = async (e) =>{  //filter
    let p={};
    p.filter=this.filter.state.value;
    p.sqlprocedure='demo502a';
    let rs = await reqdoSQL(p); //调用函数，执行存储过程。必须加await
    this.setState({data: rs.rows}, () => {
      setTimeout(()=>{
        this.myList1.setData(rs.rows);  //更新datalist的数据
        if (rs.rows.length>0) this.myList1.selectRow(rs.rows[0]);
      })
    });
  }

  handleFocus = (e) =>{
    
  }


  getImage(row) {
    return '/myServer/mybase/products/'+row.productid+'.jpg';
  }
  
  addon(icon){    
    let css='';     
    if (icon === 'search') css='textbox-icon icon-search';
    else if (icon === 'help') css='textbox-icon icon-help';
    return (
       <span className={css} onClick={this.handleButtonClick.bind(this)}></span>
    )
  }

 
  renderItem({ row }) {
    return (
      <div style={{marginTop:10}}>
        <div>{row.productid}-{row.productname}-{row.quantityperunit}-{row.unit}-{row.unitprice}元</div>
        <div className="textdiv">{row.categoryname}类-{row.companyname}</div>
        <img src={this.getImage(row)} style={{width:54, width:48}} />        
      </div>
    )
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
    //let p10=MyDefTextBox('companyname','', 72, 20+7*rowheight, 292,0, 300,'','readonly');    
    let p11=MyDefTextBox('photopath','', 72, 0, 0, 0, 100,'','hidden');   //隐藏的文本框，可以保存数据库的值 
    let p91=MyDefTextBox('filter','快速过滤', 72, 2, 16,0, 300,'','');
    let p={};
    p.sqlprocedure='demo502d';
    p.filtertext='';    
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
                <MyTextBox params='filter;快速过滤;72;12;240;0;290;;searchbutton' ref={ref => this.filter = ref} addonRight={this.addon.bind(this, 'search')} />
            </div>
          </LayoutPanel>
          <LayoutPanel region="west" style={{ width: 360 }} split={true}>
            <DataList ref={ref => this.myList1 = ref} idField="productid" data={this.state.data} border={false} style={{height:'100%', width:'100%'}}
             onRowSelect={this.handleSelectRow.bind(this)} 
             onSelectionChange={this.handleSelectionChange.bind(this)}
             renderItem={({ row }) => (
               <div style={{marginTop:15, marginLeft:8}}>
                  <center><img src={this.getImage(row)} style={{width:96, width:64}} /></center>        
                  <div style={{float:'left'}}>{row.productid}-{row.productname}</div>
                  <div style={{float:'right', marginRight:6}}>{row.quantityperunit}-{row.unit}-{row.unitprice}元</div>
                  <div style={{clear:'both'}}></div>
                  <div style={{float:'left'}} className="textdiv">{row.categoryid+'-'+row.categoryname}类</div>
                  <div style={{float:'right', marginRight:6}}>{row.companyname}</div>
                  <div style={{clear:'both'}}></div>
               </div>
             )}             
             xrenderItem={this.renderItem.bind(this)} selectionMode="single" 
            />
          </LayoutPanel>
          <LayoutPanel region="center" style={{ height: '100%' }}>
            <Panel border={false} style={{overflow:'auto', height: '100%' }}>
               <MyTextBox params='productid,商品编码,72,20,20,0,200,,readonly' title="rrrr1" name='ttttt' ref={ref => this.productid = ref} placeholder='商品编码不能为空' onFocus={this.handleFocus.bind(this)} />
               <MyTextBox attr={p2} ref={ref => this.productname = ref} />
               <MyTextBox attr={{id:'englishname', label:'英文名称', labelwidth:72, top:20+2*rowheight, left:20, height:0, width:400}} ref={ref => this.englishname = ref} />
               <MyTextBox id='quantityperunit' label='规格型号' labelwidth='72' top={20+3*rowheight} left='20' height='0' width='200' value='' ref={ref => this.quantityperunit = ref} />
               <MyTextBox attr={p5} ref={ref => this.unit = ref} />
               <MyTextBox attr={p6} ref={ref => this.unitprice = ref} />
               <MyTextBox attr={p7} params='categoryid;所属类别' top={20+6*rowheight} onBlur={this.handleBlurCategoryid.bind(this)} onKeyPress={this.handleKeyEvents.bind(this)} ref={ref => this.categoryid = ref} placeholder="输入类别编码" addonRight={this.addon.bind(this, 'help')} />
               <MyTextBox attr={p8} ref={ref => this.categoryname = ref} />
               <MyTextBox attr={p9} ref={ref => this.supplierid = ref} onBlur={this.handleBlurSupplierid.bind(this)} addonRight={this.addon.bind(this, 'help')} />
               <MyComboBox id='companyname' label='' labelwidth='72' top={20+7*rowheight} left='292' width='300' sqlparams={p}  ref={ref => this.companyname = ref} />

               <MyTextBox attr={p11} ref={ref => this.photopath = ref} />
               <img ref={ref => this.imagepath = ref} src={this.state.row.photopath} style={{position:'absolute', top:20+8*rowheight, left:20, height:224, width:196}} />
            </Panel>
          </LayoutPanel>
        </Layout>
        <Messager title='系统提示' ref={ref => this.msgbox1 = ref}></Messager>        
      </div>              
    )
  }
}