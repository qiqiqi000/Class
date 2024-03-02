import React from 'react';
export class TextBox204 extends React.Component {  
  constructor(props) { //构造函数
    super(props);
    //知识点1：将调用这个控件时设置的属性props提取出来，赋值到变量中
    //console.log(props);
    let {top, left, height, width, value} = props;
    //对这几个属性的值进行特殊处理
    if (isNaN(top) || top === undefined) top = 0;
    if (isNaN(left) || left === undefined) left = 0;
    if (isNaN(height) || height === undefined) height = 28;
    if (isNaN(width) || width === undefined) width = 200;
    if (value===undefined) value = '';
    //转成数值型数据
    top = parseInt(top);
    left = parseInt(left);
    height = parseInt(height);
    width = parseInt(width);
    //知识点2：将修改后的属性值与原来props的属性合并在一起，赋值到attr这个变量中。props只读不能被修改。
    let attr = {top, left, height, width, value};
    attr={...props, ...attr};
    //console.log(attr);
    //定义state状态变量
    this.state = {
      value: value,
      attr: attr,
      inputStyle: {  //知识点3：在状态变量中也可以是一个css变量，因为width的值是动态变化的。
        border: '1px solid #ccc',
        borderRadius: '4px',
        boxShadow: '0 1px 4px rgba(0, 0, 0, 0.1)',
        transition: 'border-color 0.3s ease',
        borderColor: '#4c9aff',
        outline:'none',
        paddingLeft: 6,
        position:'absolute', 
        height: '100%',  //实现确定的
        width: width  //实现不确定的
      }
    }
  }

  handleChange (e) {
    //知识点4：在setState方法中定义事件，如果原来props属性中存在
    //this.setState({value: e.target.value},()=>{this.props.onChange?.(e)});
    this.setState({value: e.target.value })
  }

  render(){
    //为了引用变量的方便，把状态变量中的属性值提取出来
    let {id, top, left, height, width, value, label} = this.state.attr;
    //console.log(id, top, left, height, width, value, label)
    return(
     <div key={id+'_div'} className='labelStyle' style={{position:'absolute', top:top, left:left, height:height, width:width}}>{label}： 
        <input key={id} id={id} style={this.state.inputStyle} value={this.state.value} 
        onChange={this.handleChange.bind(this)} 
        { ...this.props } />
     </div>
    )
  }
}

export class Inputbox204 extends React.Component {  
  constructor(props) { //构造函数
    super(props);
    //定义state状态变量
    this.state = {
      value: this.props.value
    }
  }
  render(){
    //为了引用变量的方便，把状态变量中的属性值提取出来
    let {id, value, height, width, label, labelwidth} = this.props;
    console.log(id, value, height, width, label, labelwidth)
    return(
      <div>
        <span key={id+'_label'} className='labelStyle' style={{display:'inline-block', width:1*labelwidth}}>{label}：</span> 
        <span style={{display:'inline-block'}}>
          <input key={id} id={id} { ...this.props } style={{height:1*height, width:1*width}}
           value={this.state.value} onChange={(e)=>this.setState({value: e.target.value })} 
          />
         </span>
     </div>
    )
  }
}


export class ChildComponent extends React.Component {  
  constructor(props) { //构造函数
    super(props);
  }
  render(){
    return(
      <div style={{marginTop:10}}>
        <fieldset style={{width:300, backgroundColor:'#E0ECFF'}}>
          <legend>员工信息卡</legend>
          <p>员工编号：<u>&nbsp;{this.props.employeeid}&nbsp;</u></p>
          <p>员工姓名：<u>&nbsp;{this.props.name}&nbsp;</u></p>
          <p>职务：<u>&nbsp;{this.props.title}&nbsp;</u></p>
          <p>家庭地址：<u>&nbsp;{this.props.address}&nbsp;</u></p>
        </fieldset>
     </div>
    )
  }
}


export default class Demo204 extends React.Component {  
  constructor(props) { //构造函数
    super(props);
    this.state = {
      message: '',
    }
  }

  handleClick = (e) =>{
    let employeeid = this.employeeid.state.value;
    let employeename = this.employeename.state.value;
    let title = this.title.state.value;
    let address = this.address.state.value;
    let obj= {employeeid, employeename, title, address} 
    console.log(obj);
    this.setState({message: JSON.stringify(obj)});
  }

  render(){
    //引用这个组件4次，ref
    return(<>
      <TextBox204 ref={ref=>this.employeeid=ref} id='employeeid'   label='员工编码' top='20' left='24' width='200' value='ZG456M' />
      <TextBox204 ref={ref=>this.employeename=ref} id='employeename' label='员工名称' top='70' left='24' width='400' value='诸葛孔明' />
      <TextBox204 ref={ref=>this.title=ref} id='title' label='职务' top='120' left='56' />
      <TextBox204 ref={ref=>this.address=ref} id='address' label='家庭地址' top='170' left='24' width='400' />
      <div style={{position:'absolute', top: 210,  left: 24}}>
          <button className='buttonStyle' style={{width: 80, height: 29}} 
           onClick={()=>this.handleClick()}>确定</button>
      </div>
      <div style={{position:'absolute', top: 260,  left: 24}}>
        <ChildComponent id='xxx1' employeeid='ZGJ123M' name='诸葛建楠' address='浙江省杭州市西湖区' title='副总经理' />
        <ChildComponent id='xxx2' employeeid='FZY323F' name='冯智艳' address='浙江省杭州市拱墅区' title='销售代表' />
      </div>
    </>)
  }  
}


