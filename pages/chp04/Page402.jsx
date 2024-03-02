import React from 'react';
import { Form, FormField, Panel, Label, CheckBox, TextBox, DateBox, NumberBox, RadioButton, ComboBox, LinkButton } from 'rc-easyui';
import '../../css/style.css';
import { MyTextField } from '../../api/easyUIComponents.js'
 
//构造函数，生成文本框textbox

export default class Page402 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rowheight: 42,
      inputValues:{ //所有输入值都存放在这里
        stuid: '',
        stuname: '',
        school:'',
        phone: '',
        email: '',
        address: '',
        notes: ''
      }
    }
  }

  render() {
    const p1 = MyTextField('stuid','学生学号',  72, 20, 20, 0, 200,'20210554003201','')
    const p2 = MyTextField('stuname','学生姓名',72, 20, 350,28,200,'诸葛孔明','')
    const p3 = MyTextField('school','就读学校', 72, 70, 20, 28,200,'浙江理工大学','readonly')
    return (
      <div>
        <Panel title="学生基本信息栏" collapsible >
          <div style={{position:'relative', height:600}}>
            {p1}
            {p2}
            {p3}
            {MyTextField('phone','联系电话',72, 120, 20, 28, 200,'13857133456','')}
            {MyTextField('email','Email',  72, 120, 350, 28, 200,'zxywolf@126.com','')}
            {MyTextField('notes','个人简介',  72, 170, 20, 150, 530,'诸葛孔明，男，2002年出生与杭州市，2021年就读浙江理工大学','textarea')}
          </div>
        </Panel>
      </div>
    )
  }
}