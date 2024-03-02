//知识1：导入React的useState、forwardRef、useRef钩子函数hook。
import React, { useState, forwardRef, useRef } from 'react';  
import { reqdoSQL } from '../../api/functions';
//React.sys.rowheight = 35;
//知识2：函数组件中带2个参数，其中一个是ref，由调用它的父组件传递给它
const ComboBox205 = forwardRef((props, ref) => {
  //将调用这个控件时设置的属性props提取出来，赋值到变量中
  let {items, value} = props;
  //从items中提取每个选项，并用map将数组array中元素转成json对象。
  let array = items.split(';'); 
  let data = array.map((item, index) =>{ return {"label": item, "index": index}});
  //设置下拉框的初值，先从属性中提取和判断value的值
  if (value === undefined || value === '') value = data[0].label;  //array[0]
  //知识2：定义一个state状态变量，赋值用set+变量（变量首字母大写），在useState中设置初值。
  const [selectedOption, setSelectedOption] = useState(value);
  //处理某些属性的值。由于props不可以赋值或修改，故定义一个attr变量
  let attr={...props, data, value};  
  if (attr.width === undefined) attr.width = 200;
  if (attr.height === undefined) attr.height = 30;
  //知识3：选择选项时触发onChange事件，将用户选择的值赋值给state变量（再次使用set+变量方法）
  const handleChange = (e) =>{
    //selectedOption=e.target.value
    setSelectedOption(e.target.value);
  }
  //定义一个下拉框的css样式变量，写在本函数内。
  const selectStyles = {
    width: 1*attr.width,
    height: 1*attr.height,
    paddingLeft: '10px',
    fontSize: '14px',
    outline: 'none',
    border: '1px solid var(--dropdown-border-color, #ccc)',
    borderRadius: '4px',
    backgroundColor: 'var(--dropdown-background-color, #fff)',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
  };
  return(
    <div {...props}>  {/* 知识4：继承原来下拉框的属性，例如style */}
      <label htmlFor={attr.id}>{attr.label}：</label>
        { /* 知识5：设置ref */ }
        <select id={attr.id} ref={ref} style={selectStyles} onChange={handleChange}
         value={selectedOption}>  {/* 知识6：设置下拉框value值为状态变量的值 */}
         {attr.data.map((item, index) => 
            <option key={index} value={item.label}>{item.label}</option>
         )}            
        </select>
    </div>
  )
})

//定义父函数组件Demo205
const Page205 = () => {
  //知识5：使用钩子函数定义ref变量
  const titleRef = useRef(null);
  const partyRef = useRef(null);
  const degreeRef = useRef(null);
  const xxxRef = useRef(null);
  //定义一个state变量，初值为空
  let [message, setMessage] = useState(''); 
  //定义按钮点击事件
  const handleClick = (e) =>{
    console.log(titleRef.current.value, partyRef.current.value, degreeRef.current.value);
    //setMessage会触发重新渲染
    /*
    let p={};
    p.title=titleRef.current.value;
    //...
    p.sqlprocedure='demo3032'
    rs=await reqdoSQL(p)
    */
    setMessage(titleRef.current.value +',' + partyRef.current.value+ ','+ degreeRef.current.value);
  }

  return (<div>
    <div style={{marginTop:10, marginLeft:10}}>
      {/* 知识6：在调用子组件时使用ref，以便引用这个组件 */} 
      <ComboBox205 ref={titleRef} id='title' label='选择职称' width='300' items="教授;副教授;讲师;助教;研究员;助理研究员;其他" />
    </div>

    <div style={{marginTop:10, marginLeft:10}}>
      <ComboBox205 ref={partyRef} id='party' label='选择党派' items="中国党员;民建同盟;九三学社;致公党;民革;中国国民党;无党派" />
    </div>

    {/* 在ComboBox205直接使用style，传递给子组件的div中 */}    
    <ComboBox205 ref={degreeRef} id='degree' style={{marginTop:10, marginLeft:10}} label='选择学历' 
    items="博士研究生;硕士研究生;大学本科;大学专科;高中;初中;小学;无;reerewr;r;wer;ewr;ewrt;4et4e" value='大学本科' />

    <button onClick={handleClick} style={{marginTop:10, marginLeft:10, width:80}}>确定</button>
    <div style={{marginTop:10, marginLeft:10}}>选项：{message}</div>
  </div>);
};
//知识7：默认导出，导出的组件可以在应用程序的其他部分进行导入和使用。
export default Page205;

