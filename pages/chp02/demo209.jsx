import React, { Component } from 'react'
import '../../css/style.css';
import {MyCheckbox, MyCombobox, MyInput, MyRadiogroup} from '../../api/common.js';
import studata from '../../data/students.json';
//React.sys.dateformat = 'YYYY/MM/DD';
const sys={...React.sys}; 
export default class Page209 extends Component {
  constructor(props) { //构造函数  子组件，被调用，参数属性传过来
    super(props);
    this.state = {
      data: studata,
      selectedrow: {},
      formValues: {
        stuid: "2013333502055",
        stuname: "上官婉儿",
        deptname: "会计学",
        gender: "女",      
        birthdate: "1970-12-20",
        address: "浙江省杭州市西湖区",
        age: 0,
        hobby: ['下棋','书法','舞蹈']
      },
      keydownfields:'stuid;stuname;birthdate;age;address;deptname',
    }
  };

  componentDidMount(){ //页面启动渲染之后会执行
    //用代码模拟点击事件，选中第一个学生。
    this.handleLink(this.state.data[0]);    
    document.getElementById("stuname").focus();
    document.getElementById("stuname").select();    
    document.getElementById("age").readOnly = true;    
  }

  handleLink(row){
    for (let key in row){
      if (key!=='hobby') this[key]?.setState({value: row[key]});
      else this[key]?.setState({value: eval(row[key])});
    } 
    //this.address?.setState({value: row.address});
    this.setState({formValues: row, selectedrow: row});    
    //计算实际年龄    
    this.caculateAge(row.birthdate);
    document.getElementById("stuname").focus();
  }

  handleOkClick = (e) => {
    let {data, selectedrow} = this.state;
    //保存数据到数组和selectedrow中。
    for (let key in selectedrow) {
      if (this[key]) selectedrow[key] = this[key].state.value;
      else selectedrow[key]='';
    }
    let index = data.findIndex((item)=>item.stuid === selectedrow.stuid);
    if (index>=0) data[index] = selectedrow;
    this.setState({data, selectedrow});
  }

  handleResetClick = (e) => {
    //设置初值的另一种方式，将this.state.selectedrow中的值赋值给各个控件ref对应的value值
    let {data, selectedrow} = this.state;
    for (let key in selectedrow){
      if (key!=='hobby') this[key]?.setState({value: selectedrow[key]});
      else this[key]?.setState({value: eval(selectedrow[key])});
    } 
    //计算实际年龄    
    this.caculateAge(this.state.selectedrow.birthdate);
    //this.setState({})
  }
  
  caculateAge = (birthdate) => {
    if (birthdate === undefined) return;
    let today = new Date();
    let birthday = new Date(birthdate);
    //计算年龄
    var age = today.getFullYear() - birthday.getFullYear();
    //调整年龄，考虑月份和日期
    if (today.getMonth() < birthday.getMonth() || (today.getMonth() === birthday.getMonth() && today.getDate() < birthday.getDate())) age --;
    this.age.setState({value: age});
  }

  handleKeyDown =(e) =>{
    let key = e.key.toLowerCase();   //enter, ArrowUp,ArrowDown
    let id = e.target.id
    if (key==='enter'){
      let fields = this.state.keydownfields.split(';');
      let index = fields.indexOf(id);
      if (index >=0 && index<fields.length){
        index ++ ;
        console.log(fields[index],this[fields[index]])
        //this[fields[index]].current.focus();
        document.getElementById(fields[index]).focus();        
      }
    }
  }

  render(){
    let {data, selectedrow} = this.state;
    //步骤8：输出数组中的React元素
    let photoUrl;
    try {
      photoUrl = require('../../photos/' + selectedrow.stuid + '.jpg');
    } catch (error) {
      photoUrl = null;
    }     
    return (
    <div style={{height:'100%', display: 'flex', overflow:'hidden'}}>
      <div style={{overflowY: 'auto', borderRight:'1px solid #95B8E7', width:260, paddingLeft:10}}>
        {data.map((item, index)=>
        <div key={"div"+index} style={{fontSize:14, marginTop:6}}>
          <a key={item.stuid+'_'+index} href='#' className="custom-link" style={{padding:'4px 8px 4px 0px', color:this.state.selectedrow.stuid == item.stuid?'blue': null, backgroundColor:this.state.selectedrow.stuid == item.stuid?'yellow': null}}
           onClick={(e)=>this.handleLink(item)}>
            <input key={'checkbox_'+index} id={item.stuid+'_checkbox_'+index} type="checkbox" value={item.stuid} 
             checked={this.state.selectedrow.stuid == item.stuid} onChange={(e)=>e.target.checked=true} />
            {item.stuid+' '+item.stuname}</a>
        </div>)}
      </div>
      <div style={{overflow: 'auto', borderLeft:'1px solid #95B8E7', marginLeft:3, paddingLeft:16}}>
        <MyInput id="stuid" ref={ref=>this.stuid=ref} type="text" label="学生编码" labelwidth="80" height="40" width="200" style={{marginTop:10}} readOnly={true} onKeyDown={this.handleKeyDown} />
        <MyInput id="stuname" ref={ref=>this.stuname=ref} type="text" label="学生姓名" labelwidth="80" width="200" style={{marginTop:10}} onKeyDown={this.handleKeyDown} />
        <MyInput id="birthdate" ref={ref=>this.birthdate=ref} type="date" label="出生日期" labelwidth="80" width="120" style={{marginTop:10}} onChange={(e)=>this.caculateAge(e.target.value)} onKeyDown={this.handleKeyDown} />
        <MyInput id="age" ref={ref=>this.age=ref} type="text" label="年龄" labelwidth="80" width="60" style={{marginTop:10}} readOnly={true} onKeyDown={this.handleKeyDown} />
        <MyRadiogroup id="gender" ref={ref=>this.gender=ref} label="性别" labelwidth="80" width="20" items="男;女;妖" style={{marginTop:10}} />
        <MyInput id="address" ref={ref=>this.address=ref} type="text" label="家庭地址" labelwidth="80" width="200" style={{marginTop:10}} onKeyDown={this.handleKeyDown} />
        <MyCombobox id="deptname" ref={ref=>this.deptname=ref} label="所属专业" labelwidth="80" width="200" items="信息管理与信息系统;大数据管理与应用;计算机科学与技术;会计学;工商管理" style={{marginTop:10}} onKeyDown={this.handleKeyDown} />
        <MyCheckbox id="hobby" ref={ref=>this.hobby=ref} label= "个人兴趣" labelwidth="80" width="44" items="下棋;钓鱼;书法;唱歌;编程;舞蹈" style={{marginTop:10}} count="4" />
        <img src={photoUrl} style={{position:'absolute', top: 12, left:600, height:200}} /> 
        <button key="btnok" style={{ height: 28, width: 80, marginTop:20, marginLeft:80}} onClick={this.handleOkClick.bind(this)}>保存</button>
        <button key="btnreset" style={{height: 28, width: 80, marginTop:20, marginLeft:20}} onClick={this.handleResetClick.bind(this)}>重置</button>
      </div>
    </div>
    );
  }
}    