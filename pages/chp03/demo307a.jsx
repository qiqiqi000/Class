import React, { Component } from 'react';
import { reqdoSQL } from '../../api/functions.js';
import data from '../../data/employees.json';
const colStyle={
  paddingLeft:'4px',  
  backgroundColor: '#ffffff',
  whiteSpace:'nowrap',
  overflowY: 'hidden',
  fontSize: 14,
  textOverflow:'ellipsis'
}

const buttonStyle={
  paddingTop: '4px',
  border: '1px solid #ccc',
  height: '28px',
  width: '32px',
  borderRadius: '5px',
  cursor: 'pointer' 
}

//import './tablecss.css';
export default class FixedHeaderTable extends Component {
  render() {
    const tableHeader = Object.keys(data[0]);

    return (
      <div>
        <div className='table-container'>
          <table className='table table-head'>
            <thead>
              <tr>
                {tableHeader.map((key, index) => (
                  <th key={key + '_' + index}>{key}</th>
                ))}
              </tr>
            </thead>
          </table>

          <div className='table-body-container' ref={ref => this.tableBodyRef = ref}>
            <table className='table table-body' >
              <tbody>
                {data.map((item, index) => (
                  <tr key={index}>
                    {tableHeader.map((key, index) => (
                      <td key={key + '_' + index}>{item[key]}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
}
