import React, { Component } from 'react'
import '../../css/style.css';
//React.sys.dateformat = 'YYYY/MM/DD';
//const sys={...React.sys}; 
export default class Page208 extends Component {
  constructor(props) { //构造函数  子组件，被调用，参数属性传过来
    super(props);  
    this.state = {
      rowheight: 40,
      formValues: {
        stuid: "202105540101",
        stuname: "上官婉儿",
        deptname: "会计学",
        gender: "女",      
        birthdate: "1970-12-20",
        age: 0,
        hobby: ['下棋','书法','舞蹈']
      },
      initialValues: {}   //变量用来记录formValues的初值this.state.formValues
    }
  };

  componentDidMount(){ //页面启动渲染之后会执行
    //记录各个控件的初值，使用一个formValues变量
    let obj = {...this.state.formValues};
    //或者手动编写递归深拷贝的函数。
    //for (let key in this.state.formValues) obj[key] = this.state.formValues[key];
    this.setState({initialValues: {...this.state.formValues}});
    //计算实际年龄    
    this.caculateAge(this.state.formValues.birthdate);
    //设置年龄只读，文本输入框为只读状态
    document.getElementById("age").readOnly = true;
  }

  handleOkClick = (e) => {
    //步骤7：输出各个控件的值    
    console.log(this.state.formValues);
  }

  handleResetClick = (e) => {
    //步骤8：重新设置各个控件的值为初值
    this.setState({formValues: {...this.state.initialValues}});
  }

  //步骤2：创建myInput函数，采用绝对位置定位,type为'text'时生成文本输入框，type为'date'时生成一个日期选择框
  myInput = function(id, type, label, top, left, height, width){
    if (height == 0) height = 28;
    if (width == 0)  width = 200;
    return (<div key={id+'_div'} style={{position: "absolute", top: top, left: left}}>
      <label key={id+'_label'} id={id+'_label'} className='labelStyle' htmlFor={id}>{label}：</label>      
      <input key={id} id={id} type={type} style={{height: height, width: width}} 
       value={this.state.formValues[id]}
       onChange={(e)=>{
         let id=e.target.id;
         this.setState({formValues:{...this.state.formValues, [id]: e.target.value}}
          ,()=>{if (id=='birthdate') this.caculateAge(e.target.value);});       
       }} 
      />
    </div>);
  }
  //步骤3：创建myCombobox函数，采用绝对位置定位，根据data生成下拉框的选项
  myCombobox = function(id, label, top, left, height, width, items) {
    if (height == 0) height = 28;
    if (width == 0)  width = 200;
    let data = items.split(';');
    return (<div key={id+'_div'} style={{position: "absolute", top: top, left: left}}>
      <label key={id+'_label'} id={id+'_label'} className='labelStyle' htmlFor={id}>{label}：</label>      
      <select key={id} id={id} style={{height: height, width: width}} 
       value={this.state.formValues[id]} 
       onChange={(e)=>{this.setState({formValues:{...this.state.formValues, [id]:e.target.value}});}}>
       {data.map((item, index) => <option key={id+'_'+index}>{item}</option> )}
      </select>
    </div>)
  }
  //步骤4：创建myRadionbutton函数，采用绝对位置定位，根据data生成无线按钮的选项
  myRadiogroup = function(id, label, top, left, height, width, items) {
    if (height == 0) height = 28;
    if (width == 0)  width = 20;
    let data = items.split(';');
    return (<div key={id+'_div'} style={{position: "absolute", top: top, left: left}}>
      <label key={id+'_label'} id={id+'_label'} className='labelStyle' htmlFor={id}>{label}：</label>     
      {data.map((item, index)=>(
       <label key={id+'_labelx'+index} style={{marginRight: width, display: 'inline-block'}}>
         <input type="radio" id={id+'_'+index} key={id+'_'+index} name={id} value={item} 
          checked={this.state.formValues[id] === item}
          onChange={(e)=>{
            let id=e.target.name; 
            this.setState({formValues:{...this.state.formValues, [id]: e.target.value}});
          }}
         />
         {item}
       </label>))}
    </div>)
  }

  //步骤4：创建myRadionbutton函数，采用绝对位置定位，根据data生成无线按钮的选项
  myCheckbox = function(id, label, top, left, height, width, items) {
    if (height == 0) height = 28;
    if (width == 0)  width = 80;
    let data = items.split(';');
    return (<div key={id+'_div'} style={{position: "absolute", top: top, left: left}}>
      <label key={id+'_label'} id={id+'_label'} className='labelStyle' htmlFor={id}>{label}：</label>
      {data.map((item, index)=>(
        <label key={id+'_x'+index} htmlFor={id+'_'+index} style={{marginRight: width, display: 'inline-block'}}>
          <input key={id+'_'+index} id={id+'_'+index} name={id} type="checkbox" value={item} 
           checked={this.state.formValues[id].includes(item)} 
           onChange={(e)=>{
             let id=e.target.name; 
             let data=[...this.state.formValues[id]];
             var index = data.indexOf(e.target.value);
             if (e.target.checked){ //选中时
               if (index === -1) data.push(e.target.value); //原来不存在时添加元素
             }else{
               if (index !== -1) data.splice(index, 1); //不选中时删除元素
             }
             console.log(666,data);
             console.log(667,this.state.initialValues);
             this.setState({formValues:{...this.state.formValues, [id]:data}});
          }}
          />
          {item}
        </label>
       ))}
    </div>)
  }
  
  caculateAge = (birthdate) => {
    if (birthdate === undefined) return;
    let today = new Date();
    let birthday = new Date(birthdate);
    //计算年龄
    var age = today.getFullYear() - birthday.getFullYear();
    //调整年龄，考虑月份和日期
    if (today.getMonth() < birthday.getMonth() || (today.getMonth() === birthday.getMonth() && today.getDate() < birthday.getDate())) age --;
    this.setState({formValues:{...this.state.formValues, age:age}});
  }

  render(){
    let {rowheight, formValues} = this.state;
    //步骤8：输出数组中的React元素
    //console.log(rowheight, formValues);
    return (<div>
      {/* 添加3个textbox，1个datebox */}
      {this.myInput("stuid", "text", "学生编码", 20, 30, 28, 250)}
      {this.myInput("stuname", "text", "学生姓名", 20+1*rowheight, 30, 28, 250)}
      {this.myInput("birthdate", "date", "出生日期", 20+2*rowheight, 30, 28, 110)}
      {this.myInput("age", "text", "年龄", 20+2*rowheight, 260, 28, 50)}
      {/* 添加性别无线按钮 */}
      {this.myRadiogroup("gender", "性别", 20+3*rowheight, 60, 28, 15, '男;女;妖')}
      {/* 添加性别和专业下拉框combobox */}
      {this.myCombobox('deptname', "所属专业", 20+4*rowheight, 30, 28, 250, '信息管理与信息系统;大数据管理与应用;计算机科学与技术;会计学;工商管理')}
      {/* 添加个人兴趣复选框checkbox */}
      {this.myCheckbox('hobby', '个人兴趣', 20+5*rowheight, 30, 28, 15, '下棋;钓鱼;书法;唱歌;编程;舞蹈')}
      {/* 添加一个按钮 */}
      <button key="btnok" style={{position:"absolute", top: 270, left: 110, height: 28, width: 80}} onClick={this.handleOkClick.bind(this)}>确定</button>
      <button key="btnreset" style={{position:"absolute", top: 270, left: 210, height: 28, width: 80}} onClick={this.handleResetClick.bind(this)}>重置</button>
    </div>);
  }
}    