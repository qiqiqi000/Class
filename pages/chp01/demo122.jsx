import React from 'react';
//从数据文件中提取数据是先导入文件
import employeeData from '../../data/employees.json';
//设置table及其单元格的css样式
const tableStyle = {
  borderCollapse: 'collapse', // 合并单元格边框
};
const cellStyle = {
  border: '1px solid black', // 设置单元格边框
  padding: '8px', // 设置单元格内边距
  width: '120px'
};
const headerStyle = {
  border: '1px solid black', // 设置单元格边框
  padding: '8px', // 设置单元格内边距
  textAlign: 'center', // 居中对齐单元格内容
  width: '120px',
  position: 'sticky',
  top: 0  
};

export default class Demo122 extends React.Component {
  //在类组件中定义第一个函数，用来生成表格的表头。
  Header = (data) => {
    //遍历json数据，提取第一个json对象的属性名称作为表头的列标题，作为html元素存放在一个数组html中。每个th标签必须有一个互补重复的key值
    let html=[];
    for (let key in data[0]){
      html.push(<th key={key} style={headerStyle}>{key}</th>);
    }
    return html;  //返回标题，是react元素
  }

  //在类组件中定义第二个函数，用来生成表体多行所列的数据内容。
  Tbody=(data)=>{
    //遍历JSON数组的每个对象，生成表格行和单元格 
    let html = [];
    //循环提取每一行
    for (let index in data){
      let cols=[];
      //循环提取每一列，并将每一列存储到一个cols数组中
      for (let key in data[index]){
        cols.push(<td key={key+'_'+index} style={cellStyle}>{data[index][key]}</td>);
      }
      //在各个列之前添<tr>标签，实现react元素变量的拼接，存储到html数组中。
      html.push(<tr key={index}>{cols}</tr>);
    }
    return html; //返回表体中的行，也是react元素
  }
  
  render() {
    return (
      <div style={{marginLeft:10, marginTop:10}}>
        {/* 在组件中设置表格的html页面结构 */}
        <table style={tableStyle}>
          <thead>
            <tr>
              {/* 调用函数，显示表头 */}
              {this.Header(employeeData)}
            </tr>
          </thead>
          <tbody>
            {/* 调用函数，生成表格行和单元格 */}
            {this.Tbody(employeeData)}
          </tbody>
        </table>
      </div>
    )
  }
}
