import React from 'react';
import employeeData from '../../data/employees.json';
//定义按钮的css，在button定义时使用style={textStyle}
const buttonStyle={
  width: 80,
  height: 29,
  marginLeft: 10,
  display: 'inline-block',
  textDecoration: 'none',
  backgroundColor: '#4CAF50', /* 按钮背景颜色 */
  color: '#ffffff', /* 文本颜色 */
  borderRadius: '4px', /* 圆角 */
  border: 'none', /* 去掉边框 */
  cursor: 'pointer',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', /* 阴影效果 */
  transition: 'background-color 0.3s ease', /* 鼠标悬停时的过渡效果 */
};
//定义一个文本框的css，在textbox中应用时使用style={textStyle}
const inputStyle = {
  border: '1px solid #ccc',
  borderRadius: '4px',
  boxShadow: '0 1px 4px rgba(0, 0, 0, 0.1)',
  transition: 'border-color 0.3s ease',
  borderColor: '#4c9aff',
  outline:'none',
  height: 28,
  paddingLeft: 6,
  marginTop: 10,
  width: 200
}
 
export default class Page203 extends React.Component {  
  constructor(props) { //构造函数
    super(props) //调用父类方法
    this.state = { //所有的数据都放在this.state中
      data: employeeData,  //知识点1：state中可以使用组件之外定义的变量
      //知识点2:文本框的最新输入值需要用状态变量记录
      employeeid: 'ZGK456M',
      employeename: '诸葛孔明',
      employee:{ 
        id: 'ZGK456M',
        name: '诸葛孔明',
        pycode: 'zhugekongming',
        gender: '男',
        birthdate: '1968-08-12',
        idnumber: '33010619680812351X'
      }
    }
  }

  inputChange (e) {
    let id=e.target.id;   //keycode
    this.setState({[id]: e.target.value })  //知识点：setState中的属性为变量时，必须使用方括号    
  }
  
  inputChange1(e) {
    this.setState({employeeid: e.target.value })  //知识点：setState中的属性为变量时，必须使用方括号    
  }
  inputChange2(e) {
    this.setState({employeename: e.target.value })  //知识点：setState中的属性为变量时，必须使用方括号    
  }

  deleteData() {
    let items = [...this.state.data];
    if (items.length>0){
      //items.pop();  //不能写items=items.pop()
      items = items.slice(0, -1);
      this.setState({data: items});
    }
    /*错误的写法，items发生变化不会带动state.data的变化
    let items = this.state.data;
    if (items.length>0){
      items.pop();
      console.log(items, this.state.data);
    }
    */  
   console.log(888,this.state)
  }
  
  addData() {
    if (this.state.employeeid!='' && this.state.employeename!=''){
      //新增一个员工对象
      let obj = {employeeid:this.state.employeeid, name:this.state.employeename}
      /* 第一种写法
      let items = [...this.state.data];
      //追加对象到items
      items.push(obj);
      //修改state.data
      this.setState({data: items, employeeid:'',  employeename:'' })
      */
      /* 第二种写法
      let items = [...this.state.data, ...[obj]];
      this.setState({data: items, employeeid:'',  employeename:'' })
      */
      //第三种写法
      this.setState({data: [...this.state.data, obj], employeeid:'',  employeename:''});
    }
  }
	render(){ //
    return(
      <div>
        <div style={{margin:'6px 0px 0px 10px'}}>员工编码: <input id="employeeid" style={inputStyle} 
        value={this.state.employeeid} onChange={this.inputChange1.bind(this)} /></div>
        <div style={{margin:'6px 0px 0px 10px'}}>员工名称: <input id="employeename" style={inputStyle} 
        value={this.state.employeename} onChange={this.inputChange2.bind(this)} /></div>
        <div style={{margin:'10px 0px 0px 10px'}}>
          <button style={buttonStyle} onClick={this.addData.bind(this)}>新增</button>
          <button style={buttonStyle} onClick={this.deleteData.bind(this)}>删除</button>
        </div>
        <ul>
          {
						this.state.data.map((item, index) => {
							return <li key={item.employeeid+'_'+index}>{item.employeeid+' '+item.name}</li>
						})
				  }
        </ul> 
      </div>
    )
	}
}



