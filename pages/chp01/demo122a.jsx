import React from 'react';
import employeeData from '../../data/employees.json';
export default class Demo122 extends React.Component {
  Table=(data) => {
    return (
      <table>
        <thead>
          <tr>
            {/* 根据第一个对象的属性名生成表头 */}
            {Object.keys(data[0]).map((key) => (
              <th key={key}>{key}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {/* 遍历 JSON 数组的每个对象，生成表格行和单元格 */}
          {data.map((item, index) => (
            <tr key={index}>
              {/* 遍历对象的属性值，生成表格单元格 */}
              {Object.values(item).map((value, index) => (
                <td key={index}>{value}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  }
  render() {
    return (  //输出各个元素变量    
      <div>
        <h1>employees Table</h1>
        <div>{this.Table(employeeData)}</div>
      </div>
    )
  }
}
