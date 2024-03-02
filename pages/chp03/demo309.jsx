import React, { Component } from 'react'
import '../../css/style.css';
import { reqdoSQL } from '../../api/functions.js';
import { MyCheckbox, MyCombobox, MyInput, MyRadiogroup } from '../../api/common.js';
//React.sys.dateformat = 'YYYY/MM/DD';
const sys={...React.sys}; 
export default class Page308 extends Component {
  constructor(props) { //构造函数  子组件，被调用，参数属性传过来
    super(props);
    this.state = {
      data: [],
      selectedrow: {},
      rowheight: 40,
      regions: [],
      cities: null,
      sqlparams: null,
      formValues: {
        regionid:''
      },
      initialValues: {},   //变量用来记录formValues的初值this.state.formValues
      keydownFields:'customerid;companyname;contactname;contacttitle;address;regionid;cityid',
    }
  };

  async componentDidMount(){ //页面启动渲染之后会执行
    let p={};
    p.pageno=0;
    p.pagesize=0;
    p.filter='';
    p.sqlprocedure = 'demo307a';
    let rs = await reqdoSQL(p); //调用函数，执行存储过程
    this.setState({data: rs.rows}, () => this.handleLink(rs.rows[0]));
    document.getElementById("companyname").focus();
    document.getElementById("companyname").select();    
    document.getElementById("contacttitle").readOnly = true;    
  }

  handleLink(row){
    for (let key in row){
      //console.log(key,row[key])
      if (key!=='hobby') this[key]?.setState({value: row[key]});
      else this[key]?.setState({value: eval(row[key])});
      //this.address?.setState({value: row.address});
    }    
    this.setState({formValues: row, selectedrow: row}, ()=>this.cityid.setState({sqlparams: {"parentnodeid": row.regionid}, items: null}));
    document.getElementById("companyname").focus();
    //document.getElementById("companyname").select();
  }

  handleOkClick = (e) => {
    //保存数据到数组。  
    const row=[];
    for (let key in this.state.formValues) {
       row[key] = this[key]?.state.value;
    }
    let data=[...this.state.data];  //不是{...this.state.data}
    let index=data.findIndex((item)=>item.customerid === row.customerid);
    if (index>=0) data[index]=row;
    this.setState({data: data, selectedrow: row});    
  }

  handleResetClick = (e) => {
    //设置初值的另一种方式，将this.state.formValues中的值赋值给各个控件ref对应的value值
    let row = this.state.formValues;
    for (let key in row){
      if (key!=='hobby') this[key]?.setState({value: row[key]});
      else this[key]?.setState({value: eval(row[key])});
    } 
  }

  handleChange = async (e) => {
    let id = e.target.id;
    // //第一种方法，提取数据库数据，修改组件中的items选项，存储过程和sqlparams参数写在这个父组件中
    // let p={};
    // p.sqlprocedure='demo304a';
    // p.parentnodeid = e.target.value;
    // let rs = await reqdoSQL(p); //调用函数，执行存储过程
    // this.cityid.setState({items: rs.rows});
    //第二种方法，将参数传给组件，同时必须将items设置为null，否则第二次点击下拉框不会联动更新下拉框    
    this.cityid.setState({sqlparams: {"parentnodeid": e.target.value}, items: null}); 
    //console.log(888,e.target.id, e.target.value)
  }

  handleKeyDown =(e) =>{
    let key = e.key.toLowerCase();   //enter, ArrowUp,ArrowDown
    let id = e.target.id
    if (key==='enter'){
      let fields = this.state.keydownFields.split(';');
      let index = fields.indexOf(id);
      if (index >=0 && index<fields.length){
        index ++ ;
        console.log(fields[index],this[fields[index]])
        //this[fields[index]].current.focus();
        document.getElementById(fields[index]).focus();        
      }
    }
  }

  onfocus = (e) => {
    console.log(e.target.id)
    document.getElementById(e.target.id).select();
  }


  render(){
    let {data, rowheight, formValues} = this.state;
    //步骤8：输出数组中的React元素
    let photoUrl;
    try {
      photoUrl = require('../../photos/'+formValues.customerid+'.jpg');
    } catch (error) {
      photoUrl = null;
    }
    return (
    <div style={{height:'100%', display: 'flex', overflow:'hidden'}}>
      <div style={{overflowY: 'auto', borderRight:'1px solid #95B8E7', width:320, paddingLeft:10}}>
        {data.map((item, index)=>
        <div key={"div"+index} style={{fontSize:14, marginTop:6}}>
          <a key={item.customerid+'_'+index} href='#' className="custom-link" style={{padding:'4px 8px 4px 0px', color:this.state.selectedrow.customerid == item.customerid?'blue': null, backgroundColor:this.state.selectedrow.customerid == item.customerid?'yellow': null}}
           onClick={(e)=>this.handleLink(item)}>
            <input key={'checkbox_'+index} id={item.customerid+'_checkbox_'+index} type="checkbox" value={item.customerid} 
             checked={this.state.selectedrow.customerid == item.customerid} onChange={(e)=>e.target.checked=true} />
            {item.customerid+' '+item.companyname}</a>
        </div>)}
      </div>
      <div style={{overflow: 'auto', borderLeft:'1px solid #95B8E7', marginLeft:3, paddingLeft:16}}>
        <MyInput id="customerid" ref={ref=>this.customerid=ref} type="text" label="客户编码" labelwidth="100" width="200" style={{marginTop:10}} onFocus={this.onfocus} onKeyDown={(e)=>this.handleKeyDown(e)} />
        <MyInput id="companyname" ref={ref=>this.companyname=ref} type="text" label="客户名称" labelwidth="100" width="400" style={{marginTop:10}} onFocus={this.onfocus} onKeyDown={this.handleKeyDown} />
        <MyInput id="contactname" ref={ref=>this.contactname=ref} type="text" label="联系人姓名" labelwidth="100" width="200" style={{marginTop:10}} readOnly={true} onKeyDown={this.handleKeyDown} />
        <MyCombobox id="contacttitle" ref={ref=>this.contacttitle=ref} label="联系人职务" labelwidth="100" width="200" items="销售代表;人事主管;企业法人;销售助理;营销经理;销售内勤;执行董事;销售经理;财务经理;销售代理;营销助理;总经理" style={{marginTop:10}} onKeyDown={this.handleKeyDown} />
        <MyInput id="address" ref={ref=>this.address=ref} type="text" label="客户地址" labelwidth="100" width="400" style={{marginTop:10}} onKeyDown={this.handleKeyDown} />
        <MyCombobox id="regionid" ref={ref=>this.regionid=ref} label="所属省份" labelwidth="100" width="200" sqlprocedure="demo305a" sqlparams={{parentnodeid:""}} style={{marginTop:10}} onKeyDown={this.handleKeyDown} onChange={this.handleChange.bind(this)} />
        <MyCombobox id="cityid" ref={ref=>this.cityid=ref} label="所在城市" labelwidth="100" width="200" sqlprocedure="demo305a" style={{marginTop:10}} onKeyDown={this.handleKeyDown} />
        <button key="btnok" style={{ height: 28, width: 80, marginTop:20, marginLeft:110}} onClick={this.handleOkClick.bind(this)}>保存</button>
        <button key="btnreset" style={{height: 28, width: 80, marginTop:20, marginLeft:20}} onClick={this.handleResetClick.bind(this)}>重置</button>
      </div>
    </div>
    );
  }
}    