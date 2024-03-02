import React, { Component } from 'react';
import { reqdoSQL } from '../../api/functions.js';
import { Form, FormField, Panel, Label, CheckBox, TextBox, DateBox, NumberBox, RadioButton, ComboBox, LinkButton } from 'rc-easyui';
import '../../css/style.css';
export default class Page501 extends Component {
  constructor(props) {
    super(props);
    //在这里初始化 state
    this.state = {
      rowheight:42,
      provinceData:[],
      cityData:[],
      districtData:[],
      provinceValue:'',
      cityValue:'',
      districtValue:'',
      province:'',
      city:'',
      district:''
    };
  }
  
  async componentDidMount(){ //初始状态时提取省份的数据
    console.log(111);
    let p={};
    p.parentnodeid='';
    p.sqlprocedure = 'demo304a';
    let rs = await reqdoSQL(p); //调用函数，执行存储过程
    this.setState({provinceData: rs.rows});  
    this.setState({provinceValue: rs.rows[0].areaid});  
    this.setState({province: rs.rows[0].areaname});  
    this.handleSelectProvince(rs.rows[0]);
    //console.log(rs.rows); 
  }

  async handleSelectProvince(row) { 
    if (row.areaid === null || row.areaid === '') return;
    console.log(112,row);
    let p={};
    p.parentnodeid=row.areaid;
    p.sqlprocedure = 'demo304a';
    let rs = await reqdoSQL(p); //调用函数，执行存储过程
    this.setState({province: row.areaname});  //可以放在onchange事件中
    this.setState({cityData:rs.rows});  
    if (rs.rows.length>0){
      this.setState({cityValue:rs.rows[0].areaid});
      this.setState({city:rs.rows[0].areaname});
      this.handleSelectCity(rs.rows[0]);  //强制选择城市，触发事件后，会选择第一个城区选项
    }else{
      this.setState({cityValue:''});
      this.setState({city:''});
      this.handleSelectCity(null);  //强制选择城市，触发事件后，会选择第一个城区选项
    } 
  }

  async handleSelectCity(row) { 
    if (row === null || row.areaid === ''){
      this.setState({districtValue: ''});  
      this.setState({district: ''});  
      return;
    }
    console.log(113,row);
    let p={};
    p.parentnodeid=row.areaid;
    p.sqlprocedure = 'demo304a';
    let rs = await reqdoSQL(p); //调用函数，执行存储过程
    this.setState({districtData: rs.rows});  
    if (rs.rows.length>0){ 
      this.setState({districtValue: rs.rows[0].areaid});  
      this.setState({district: rs.rows[0].areaname});        
    }else{
      this.setState({districtValue: ''});  
      this.setState({district: ''});  
    }

  }

  render(){  
    return (
      <div style={{marginLeft:8}}>
          <Label htmlFor="province" className="labelStyle" style={{position:'absolute', top:20+this.state.rowheight*0, left:16}}>所在省份：</Label>
          <ComboBox  inputId="province" id="province" data={this.state.provinceData} value={this.state.province} 
          style={{position:'absolute', top:20+this.state.rowheight*0, left:84, width:200}}
          valueField="areaid" textField="areaname" editable={false} panelStyle={{ width: 250 }} 
          onSelectionChange={( selection ) => this.handleSelectProvince(selection)}
          renderItem={({ row, rowIndex }) => (
            <div>{row.areaid}:{row.areaname}</div>
          )}
          onChange={(value) => this.setState({provinceValue: value })} />

          <Label htmlFor="city" className="labelStyle" style={{position:'absolute', top:20+this.state.rowheight*1, left:16}}>所在城市：</Label>
          <ComboBox  inputId="city" id="city" data={this.state.cityData} value={this.state.cityValue} 
          style={{position:'absolute', top:20+this.state.rowheight*1, left:84, width:200}}
          valueField="areaid" textField="areaname" editable={false} panelStyle={{ width: 250 }} 
          onSelectionChange={( selection ) => this.handleSelectCity(selection)}
          onChange={(value) => this.setState({cityValue: value })} />

          <Label htmlFor="district" className="labelStyle" style={{position:'absolute', top:20+this.state.rowheight*2, left:16}}>所在城区：</Label>
          <ComboBox  inputId="district" id="district" data={this.state.districtData} value={this.state.district} 
          style={{position:'absolute', top:20+this.state.rowheight*2, left:84, width:200}}
          valueField="areaid" textField="areaname" editable={false} panelStyle={{ width: 250 }}           
          onChange={(value) => this.setState({districtValue: value })} />

          <Label id="msg" className="labelStyle" style={{position:'absolute', top:20+this.state.rowheight*3, left:16, width:500}}>
            所选的区域：{this.state.province}，{this.state.city}，{this.state.district}
          </Label>
     </div>   
    )
  }
}

