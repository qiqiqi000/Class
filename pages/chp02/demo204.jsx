import React from 'react';

export class TextBox204 extends React.Component {  
  constructor(props) { //构造函数  子组件，被调用，参数属性传过来
    super(props);
    console.log(props);    
    //知识点1：将调用这个控件时设置的属性props提取出来，赋值到变量中
    let {top, left, height, width, value} = props;  // top=props.top;
    //对这几个属性的值进行特殊处理
    if (!top || isNaN(top)) top = 0; //容错
    if (!left || isNaN(left)) left = 0; //容错
    if (!height || isNaN(height)) height = 30; //容错
    if (!width || isNaN(width)) width = 200; //容错
    if (!top || isNaN(top)) top = 0; //容错
    if (value === undefined) value = '';
    //转成数值型数据
    top = parseInt(top);  //top='20'  top=20
    left = parseInt(left);
    height = parseInt(height);
    width = parseInt(width);
    //知识点2：将修改后的属性值与原来props的属性合并在一起，赋值到attr这个变量中。props只读不能被修改。
    //props.top=top;  错误的
    //let attr={...props};
    //attr.top=top;
    //attr.left=left;
    //...
    let attr = {top, left, height, width, value};
    attr={...props, ...attr};
    //attr={...attr, ...props};   //错误的
    //console.log(attr);
    //定义state状态变量
    this.state = {
      value: value,
      params: attr,
      inputStyle: {  //知识点3：在状态变量中也可以是一个css变量，因为width的值是动态变化的。
        border: '1px solid #ccc',
        borderRadius: '4px',
        boxShadow: '0 1px 4px rgba(0, 0, 0, 0.1)',
        transition: 'border-color 0.3s ease',
        borderColor: '#4c9aff',
        outline:'none',
        paddingLeft: 4,
        position:'absolute', 
        height: '100%',
        width: '100%' 
      }
    }
  }

  render(){
    //为了引用变量的方便，把状态变量中的属性值提取出来
    let {id, top, left, height, width, value, label, onChange} = this.state.params;
    console.log(555,onChange)
    //console.log(id, top, left, height, width, value, label)
    return(
     <div key={id+'_div'} style={{position:'absolute', top:top, left:left, height:height, width:width}}>
      <label className='labelStyle' style={{display:'inline-block'}}>{label}：</label>
        <input key={id} id={id} type='text' { ...this.props } style={this.state.inputStyle} 
         value={this.state.value} onChange={(e) => { this.setState({value: e.target.value }); onChange?.(e) } } />
     </div>
    )
  }
}

export class InfoCard extends React.Component {  
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
        {/* 定义文本框输入提示符 */}
        <span key={id+'_label'} className="labelStyle" style={{display:'inline-block', width:1*labelwidth}}>{label}：</span> 
        {/* 定义文本框 */}
        <span style={{display:'inline-block'}}>
          <input key={id} id={id} { ...this.props } style={{height:1*height, width:1*width-5}}
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
      <div style={{marginTop:'10px'}}>
        <fieldset style={{width:300, backgroundColor:'#E0ECFF'}}>
          <legend>员工信息卡</legend>
          <p>员工编号：<u>&nbsp;{this.props.empid}&nbsp;</u></p>
          <p>员工姓名：<u>&nbsp;{this.props.name}&nbsp;</u></p>
          <p>职务：<u>&nbsp;{this.props.title}&nbsp;</u></p>
          <p>家庭地址：<u>&nbsp;{this.props.address}&nbsp;</u></p>
        </fieldset>
     </div>
    )
  }
}

export default class Page204 extends React.Component {  
  constructor(props) { //构造函数  父组件
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

  handleChange = (e) => {
    let s = this.employeeid.state.value;
    console.log(222222, s, e.target.value)
  }

  render(){
    //引用这个组件4次，ref
    return(<>
      <TextBox204 ref={ref=>this.employeeid=ref} id='employeeid' label='员工编码' top='20' left='24' height='32'
       width='200' value='ZG456M' onChange={this.handleChange.bind(this)} />  
      <TextBox204 ref={ref=>this.employeename=ref} id='employeename' label='员工名称' top='70' left='24'
       width='400' value='诸葛孔明'  />
      <TextBox204 ref={ref=>this.title=ref} id='title' label='职务' top='120' left='56' />      
      <TextBox204 ref={ref=>this.address=ref} id='address' label='家庭地址' top='170' left='24' width='400' />      
      <div style={{position:'absolute', top: 210,  left: 24}}>
          <button className='buttonStyle' style={{width: 80, height: 29}} 
           onClick={()=>this.handleClick()}>确定</button>
      </div>      
      <div style={{position:'absolute', top: 260,  left: 24}}>
        员工信息：{this.state.message}
      </div>
      <div style={{position:'absolute', top: 300,  left: 24}}>
        <ChildComponent id='xxx1' empid='ZGJ123M' name='诸葛建楠' address='浙江省杭州市西湖区' title='副总经理' />
        <ChildComponent id='xxx2' empid='FZY323F' name='冯智艳' address='浙江省杭州市拱墅区' title='销售代表' />
      </div>
    </>)
  }  
}


