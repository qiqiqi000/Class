import React, { Component } from 'react'
import { reqdoSQL } from '../../api/functions.js'
import {MyCombobox} from '../../api/common.js';

const divStyle = {
   margin: '10px 0px 0px 16px'
}
export default class Page305 extends Component {
  state = {
    regionData: [], //省份数据集
    cityData: [],  //城市数据集
    districtData: [],  //显示数据集
    regionname: "",  //选中的省份
    cityname: "",  //选中的城市
    districtname: ""  //选中的县区
  }

  async componentDidMount() {
    //加载原生html组件数据库的数据
    let p = {}
    p.parentnodeid = "";
    p.sqlprocedure = "demo305a";
    let rs = await reqdoSQL(p);
    this.setState({ regionData: rs.rows })
    //myCombobox组件。根据省份combobox组件的初值，强制触发onchange事件
    let value = this.regionid.state.value;
    let elem = document.getElementById('regionid'); 
    this.cityid.setState({sqlparams: {"parentnodeid": elem.value}, items: null}, ()=>{
      console.log(555,this.cityid.state.value, document.getElementById('regionid').options[0].value)
    });
  }

  handleChange = async (e) => {
    //定义onChange联动事件
    let id = e.target.id;  //获取下拉框的id
    let p = {};
    p.parentnodeid = e.target.value;  //获取下拉框的value值  
    p.sqlprocedure = "demo305a";
    //执行存储过程获取下一级城市或县区的选项
    let rs = await reqdoSQL(p);  //执行存储过程
    let rows = rs.rows;  
    //获取选项的序号，目的是为了获取当前选中选项的文本值
    let selectedIndex = document.getElementById(id).selectedIndex;
    let areaname = document.getElementById(id).options[selectedIndex].text;
    if (id === 'region') {
      //点击的是省份选项，下一级提取出来的是城市选项
      let cityData = rows;
      p.parentnodeid = rows[0].areaid;
      //再次执行存储过程，提取县区的选项
      rs = await reqdoSQL(p);
      let districtData = rs.rows; //一些树节点的子节点可能为空，要分情况更新state
      if (districtData.length === 0) this.setState({ cityData, districtData, regionname: areaname, cityname: cityData[0].areaname, districtname:'' })
      else this.setState({ cityData, districtData, regionname: areaname, cityname: cityData[0].areaname, districtname: districtData[0].areaname })
    }else if (id === 'city') {
      //点击的是城市选项，提取县区的选项
      if(rows.length === 0) this.setState({ districtData: [], cityname: areaname, districtname: '' });
      else this.setState({ districtData: rows, cityname: areaname, districtname: rows[0].areaname });
    }else if (id === 'district') this.setState({ districtname: areaname });
  }

  handleSelect = async (e) =>{
    let id = e.target.id;
    console.log(id);
    if (id=='regionid'){
      //第一种方法，提取数据库数据，修改组件中的items选项，存储过程和sqlparams参数写在这个父组件中
      let p={};
      p.sqlprocedure='demo305a';
      p.parentnodeid = e.target.value;
      let rs = await reqdoSQL(p); //调用函数，执行存储过程
      this.cityid.setState({value:'', items: rs.rows},()=>{
        //console.log(551,this.cityid.state.value, document.getElementById('cityid').options[0].value);
        let value = document.getElementById('cityid').options[0].value;
        this.districtid.setState({value:'', sqlparams: {"parentnodeid": value}, items: null}); 
      });
    }else if (id=='cityid'){
      //第二种方法，将参数传给组件，同时必须将items设置为null，否则第二次点击下拉框不会联动更新下拉框    
      this.districtid.setState({value:'', sqlparams: {"parentnodeid": e.target.value}, items: null}); 
    }
  }

  render() {
    const { regionData, cityData, districtData, regionname, cityname, districtname } = this.state;
    /*
    const regionitems = regionData.map(item => <option key={item.areaid} value={item.areaid}>{item.areaname}</option>)
    const cityitems = cityData.map((item, index) => (<option key={item.areaid} value={item.areaid}>{item.areaname}</option>))
    const districtitems = districtData.map((item, index) => {
      return (<option key={item.areaid} value={item.areaid}>{item.areaname}</option>)
    })
    */
    //在regionitem数组头部增加一个空<option>标签，样式设置为隐形，方便onChange事件的触发
    //regionitems.unshift(<option key='nulloption' style={{ display: 'none' }} value=''></option>)
    console.log(111,this.regionid,this.cityid,this.districtid);
    return (
      <div>
        <h3>&nbsp;&nbsp;三级地区联动下拉框</h3>
        <hr />
        <div style={divStyle}>选择省份：
          <select id='region' onChange={this.handleChange} className='comboboxStyle' style={{width: 200}}>
            {regionData.map(item => <option key={item.areaid} value={item.areaid}>{item.areaname}</option>)}
          </select>
        </div>
        <div style={divStyle}>选择城市：
          <select id='city' onChange={this.handleChange} className='comboboxStyle' style={{width: 200}}>
            {cityData.map((item, index) => <option key={item.areaid} value={item.areaid}>{item.areaname}</option>)}
          </select>
        </div>
        <div style={divStyle}>选择县区：
          <select id='district' onChange={this.handleChange} className='comboboxStyle' style={{width: 200}}>
            {districtData.map((item, index) => <option key={item.areaid} value={item.areaid}>{item.areaname}</option>)}
          </select>
        </div>
        <div style={divStyle}>当前的区域：{regionname} {cityname} {districtname}</div>
        <h3>&nbsp;&nbsp;使用myCombobox组件实现下拉框联动</h3>
        <div style={{marginLeft:16}}>
          <hr />
          <MyCombobox id="regionid" ref={ref=>this.regionid=ref} label="所属省份" labelwidth="75" width="200" style={{marginTop:10}} sqlprocedure="demo305a" sqlparams={{parentnodeid:''}} onChange={this.handleSelect.bind(this)} />
          <MyCombobox id="cityid" ref={ref=>this.cityid=ref} label="所在城市" labelwidth="75" width="200" style={{marginTop:10}} sqlprocedure="demo305a" onChange={this.handleSelect.bind(this)} />
          <MyCombobox id="districtid" ref={ref=>this.districtid=ref} label="所辖县区" labelwidth="75" width="200" sqlprocedure="demo305a" style={{marginTop:10}}  />
          {/* <div style={divStyle}>当前的选项：省份：{this.regionid.state.value}</div>
          <div style={divStyle}>城市：{this.cityid.state.value}</div>
          <div style={divStyle}>城区：{this.districtid.state.value}</div> */}
        </div>
      </div>
      )
  }
}
