import React, { Component } from 'react';
import { MyCombobox } from '../../api/common.js';
import { pinyin } from '../../api/functions.js';

export default class Demo003 extends Component {


componentDidMount(){
  
  //强制触发一次onChange事件
  // setTimeout(() => {
  //  this.cityid.setState({ sqlparams: {"parentnodeid": this.regionid.state.value}, items: null});
  // }, 100);
  let regionid = document.getElementById('regionid')
  console.log('region value', regionid.value)
  console.log(this.regionid.state)
  console.log(this.regionid)
   }

  handleRegionChange = (value) => {
    this.cityid.setState({value:'', sqlparams: {"parentnodeid": value}, items: null}); 
  }
  render() {
    return (
      <div>
         <MyCombobox id="regionid" ref={ref=>this.regionid=ref}  label="所属省份" labelwidth="85" width="200" style={{marginTop:10}} sqlprocedure="demo305a" sqlparams={{parentnodeid:''}} onChange={(e)=>this.handleRegionChange(e.target.value)} />
         <MyCombobox id="cityid" ref={ref=>this.cityid=ref} label="所在城市" labelwidth="85" width="200" style={{marginTop:10}} sqlprocedure="demo305a" />
      </div>
    )
  }
}
