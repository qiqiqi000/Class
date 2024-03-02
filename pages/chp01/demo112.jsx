import React from 'react';
//定义一个textbox边框的css，在textbox中应用时使用style={textStyle}
const textStyle = {
    border: '1px solid #ccc',
    borderRadius: '4px',
    boxShadow: '0 1px 4px rgba(0, 0, 0, 0.1)',
    //transition: 'border-color 0.3s ease',
    borderColor: '#4c9aff',
    height: 28,
    paddingLeft: 6,
    marginTop: 10
}
//定义一个类组件
export default class Demo112 extends React.Component {
  onClick = () => {  //构造一个箭头函数，完成按钮点击事件
    //15+3*6+(5*60-190)
    //获取表达式和计算结果两个元素
    let exp = document.getElementById('exp');
    let rs = document.getElementById('result');
    let s1 = exp.value;  //提取表达式的字符串
    s1 = s1.trim(); //去掉表达式左右边的空格
    let s2='';
    let error='';
    try{
      if (s1 === ''){
         throw new Error("表达式不能为空");
      }else{
         s2 = eval(s1);   //对字符串中的内容按js语句去执行
      }
    }catch(e){
       alert(s1+'\n'+e.message)
       //异常处理代码块
       error = e.message;
       console.log("捕获到异常：" + e.message);
    }finally{
       console.log("输入表达式：" + s1);
    }
    if (error === ''){
       rs.value=s2;
    }
  }
  render() { 
    return (  //输出元素变量
      <div style={{marginLeft:10, marginTop:20}}>
         <div> 
            <label>表达式：</label>
            <input type="text" id="exp" style={textStyle} required maxLength="100" size="75"  />
         </div>
         <div>
            <label>计算结果：</label>                    
            <input type="text" id="result" style={textStyle} readOnly size="25"  />
         </div>
         <p><button onClick={() => this.onClick()}>开始计算</button></p>
       </div>
    )
  }
}
