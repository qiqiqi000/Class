import React from 'react';
import employeeData from '../../data/employees.json';
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

const MyTable = ( props ) => { //组件名称必须以大写子母开始
  //let dataArray = props.dataArray;
  //let title= props.title;
  let {dataArray, title, id} =props;
  console.log(props);
   return (<div>{title}
      <table style={tableStyle}>
        <thead>
          <tr>
            {/* 根据第一个对象的属性名生成表头 */}
            {Object.keys(dataArray[0]).map((key) => (
              <th key={id+'_'+key} style={headerStyle}>{key}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {/* 遍历 JSON 数组的每个对象，生成表格行和单元格 */}
          {dataArray.map((item, rowindex) => (
            <tr key={id+'-' + rowindex}>
              {/* 遍历对象的属性值，生成表格单元格 */}
              {Object.values(item).map((value, colindex) => (
                <td key={id+'_'+rowindex+'_'+colindex} style={cellStyle}>{value}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table></div>
    );
  }

  const Demo123 = () => {   
    return (
      <div>
        <MyTable id="employees" dataArray={employeeData} title="员工信息表" />
        <MyTable id="products"  dataArray={productData}  title="商品信息表" />
      </div>
    );  
  };
  export default Demo123;
