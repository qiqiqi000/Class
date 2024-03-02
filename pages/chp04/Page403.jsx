import React from 'react';
import { Form, FormField, Panel, Label, CheckBox, TextBox, DateBox, NumberBox, RadioButton, ComboBox, LinkButton } from 'rc-easyui';
import '../../css/style.css';
import { MyTextBox, MyDefTextBox, MyComboBox, MyDefComboBox } from '../../api/easyUIComponents.js'
 
//构造函数，生成文本框textbox

export default class Page403 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rowheight: 42      
    }
  }
  My2Json = (id, label, labelwidth, top, left, height, width, items, value, style) => { 
    let p = { id, label, labelwidth, top, left, height, width, items, value, style }; //转成json
    return p;
  }
  render() {
    let p1 = MyDefTextBox('stuid','学生学号',  72, 20, 20, 0, 240,'20210554003201','')
    let p2 = MyDefTextBox('stuname','学生姓名',72, 70, 20, 28,240,'诸葛孔明','')
    let p3=this.My2Json('gender','性别',       72, 120, 20, 0, 240,'男;女;tt;ee', '男','');
    let p4 = MyDefTextBox('school','就读学校', 72, 170, 20, 28,240,'浙江理工大学','readonly')
    let p5=this.My2Json('deptname','所属院系', 72, 220, 20, 0, 240,'信息管理与信息系统;大数据管理与应用;工商管理;计算机科学与技术;会计学;电子信息工程;智能科学与技术', '大数据管理与应用','');
    let p6 ={id:'phone', label:'电话号码', labelwidth:72, top:270, left:20, height:28, width:240, value:'12343556565'}
    return (
      <div>
        <Panel title="学生基本信息栏" collapsible >
          <div style={{position:'relative', height:320}}>
            <MyTextBox  attr={p1}></MyTextBox>
            <MyTextBox  attr={p2}></MyTextBox>
            <MyComboBox attr={p3}></MyComboBox>
            <MyTextBox  attr={p4}></MyTextBox>
            <MyComboBox attr={p5}></MyComboBox>
            <MyTextBox  attr={p6}></MyTextBox>
          </div>
        </Panel>
      </div>
    )
  }
}