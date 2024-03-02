import React from 'react';
//从数据文件中提取数据是先导入文件
import employeeData from '../../data/employees.json';
import customerData from '../../data/customers.json';
import productData from '../../data/simpleproducts.json';
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

function MyList(props){ 
    let {data, title, id} = props;
    let array=[];  //定义一个空数组
    data.forEach(function(item, index){
       let age = new Date().getFullYear() - new Date(item.birthdate).getFullYear();
       let id=item.employeeid.toLowerCase().trim();
       let gender = (id.slice(-1) == 'f'? '女' : '男');
       array.push(<li key={id+'_'+index}>{item.name+','+item.title+','+gender+','+age}</li>);
    });
    return (
      <ul>
        {array}        
      </ul>
    )    
}

const MyTable = ( props ) => { //组件名称必须以大写子母开始
  let {dataArray, title, id} =props;
  let array = [];  //定义一个空数组
  let header = [];
  let rows = [];
  //生成表头
  Object.keys(dataArray[0]).forEach((key, index) => {
    header.push(<th key={id+'_'+key} style={headerStyle}>{key}</th>);    
  });
  //生成表体
  dataArray.forEach((item, rowindex) => {
    let cols = [];
    //遍历对象的属性值，生成表格单元格
    Object.values(item).forEach((value, colindex) => {
      cols.push(<td key={id+'_'+rowindex+'_'+colindex} style={cellStyle}>{value}</td>);
    });
    rows.push(<tr key={id+'_'+rowindex}>{cols}</tr>)
  });
  return (
      <table style={tableStyle}>
        <thead>
          <tr>{header}</tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
    );
  }

const Demo124 = () => {   
  return (
    <div>
      <h1>第一个组件实例：</h1>
      <MyList id='employees' data={employeeData} />
      <h1>第二个组件实例：</h1>
      <MyTable id='products' dataArray={productData} />
    </div>
  );  
};
export default Demo124;
