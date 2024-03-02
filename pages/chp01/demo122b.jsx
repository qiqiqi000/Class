import React from 'react';
import employeeData from '../../data/employees.json';
export default class Demo122 extends React.Component {
  Header = (data) => {
    let html=[];
    for (let key in data){
      html.push(<th key={key}>{key}</th>);
    }
    return html
  }

  Tbody=(data)=>{
    //遍历JSON数组的每个对象，生成表格行和单元格 
    let html = [];
    for (let index in data){
      html.push(<tr key={index}><td key={index}>{data[index]}</td></tr>);
    }
    return html;
  }
  render() {
    return (  //输出各个元素变量    
      <div>
        <table>
          <thead>
            <tr>
              {/* 根据第一个对象的属性名生成表头 */}
              {this.Header(employeeData)}
            </tr>
          </thead>
          <tbody>
            {/* 遍历 JSON 数组的每个对象，生成表格行和单元格 */}
            {this.Tbody(employeeData)}
          </tbody>
        </table>
      </div>
    )
  }
}
