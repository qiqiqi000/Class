import React from 'react';
import en from 'rc-easyui/dist/locale/easyui-lang-zh_CN';
import { Form, FormField, Panel, Label, CheckBox, TextBox, DateBox, NumberBox, RadioButton, ComboBox, LinkButton } from 'rc-easyui';
import '../../css/style.css';
 
export default class Page401 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rowheight: 42,
      hobbydata: ['下棋','钓鱼','书法','唱歌','编程'],
      deptdata:[{deptname:'信息管理与信息系统',deptid:'0552'},{deptname:'大数据管理与应用',deptid:'0554'},{deptname:'工商管理',deptid:'0550'},{deptname:'计算机科学与技术',deptid:'0612'},{deptname:'会计学',deptid:'0540'}],
      student:{ //学生的json对象
        stuid: '2021055401002',
        stuname: '诸葛孔明',
        gender: '2',
        birthdate: new Date('2001-08-10'),
        age:0,
        idnumber: '33010619980516351X',
        hobby: ['唱歌','编程'],
        deptname: '',
        notes: ''
      }
    }
  }

  handleChange_gender(value, checked) {
    if (checked) {
      //this.setState({gender: value });
      let student = Object.assign({}, this.state.student);
      student.gender=value;
      this.setState({student: student });
    }
  }  
  handleChange_hobby(e){
    let student = Object.assign({}, this.state.student);
    student.hobby=[...this.state.student.hobby];
    this.setState({student: student });
    //this.setState({hobby: [...this.state.hobby]});
    //console.log(111,this.state.hobby);
  }
  
  handleChange_idnumber(value) {
    let student = Object.assign({}, this.state.student);
    student.idnumber=value ;
    //this.setState({ idnumber: value });  //33010619980516351X
    if (value!=''){
      let s1=value.substr(6,4);
      let s2=value.substr(10,2);
      let s3=value.substr(12,2);
      let date=new Date(s1+'-'+s2+'-'+s3);
      //this.setState({birthdate: date});
      student.birthdate=date;
      console.log(222,value, date);
    }
    this.setState({student: student });
  }

  handleChange(name, value) {  //同一个函数，用name来区分
    let student = Object.assign({}, this.state.student);
    student[name] = value;
    this.setState({student: student });
    console.log(name,value);
  }

  handleClick(e) {
    /*
    let s1=document.getElementById('stuid').value;
    let s2=document.getElementById('stuname').value;
    let s3=document.getElementById('gender1').value;
    let s4=document.getElementById('gender2').value;
    let s5=document.getElementById('birthdate').value;
    let s6=document.getElementById('age').value;
    let s7=document.getElementById('idnumber').value;
    let s8=document.getElementById('deptname').value;
    let s9=this.state.student.hobby;
    console.log(s1,s2,s3,s4,s5,s6,s7,s8,s9);
    */
   console.log(this.state.student);
  }

  render() {
    return (
      <div>
        <Panel title="学生基本信息栏" collapsible >
          <div style={{position:'relative', height:600}} >
          <Label htmlFor="stuid" className="labelStyle" style={{position:'absolute', top:'20px', left:'16px'}}>学生学号:</Label>
          <TextBox inputId="stuid" id="stuid" value={this.state.student.stuid} xonChange={(value) => this.setState({ stuid: value })}
          onChange={(value) => this.handleChange("stuid", value)}
          style={{position:'absolute', top:'20px', left:'84px', width:'200px'}}></TextBox>

          <Label htmlFor="stuname" className="labelStyle" style={{position:'absolute', top:20+this.state.rowheight*1, left:'16px'}}>学生姓名:</Label>
          <TextBox inputId="stuname" id="stuname" value={this.state.student.stuname} onChange={(value) => this.handleChange("stuname", value)}
          style={{position:'absolute', top:20+this.state.rowheight*1, left:84, width:200}}></TextBox>

          <Label className="labelStyle" style={{position:'absolute', top:20+this.state.rowheight*2, left:'16px'}}>性别:</Label>
          <RadioButton inputId="gender1" id="gender1" value='1' groupValue={this.state.student.gender} style={{position:'absolute', top:20+this.state.rowheight*2+5, left:80}}
            onChange={(checked) => this.handleChange_gender('1', checked)} />
          <Label htmlFor="gender1" style={{position:'absolute', top:20+this.state.rowheight*2, left:104}}>男</Label>
          <RadioButton inputId="gender2" id="gender2" value='2' groupValue={this.state.student.gender} style={{position:'absolute', top:20+this.state.rowheight*2+5, left:150}}
            onChange={(checked) => this.handleChange_gender('2', checked)} />
          <Label htmlFor="gender2" style={{position:'absolute', top:20+this.state.rowheight*2, left:175}}>女</Label>

          <Label htmlFor="birthdate" className="labelStyle" style={{position:'absolute', top:20+this.state.rowheight*3, left:16}}>出生日期:</Label>
          <DateBox inputId="birthdate" id="birthdate" format="yyyy-MM-dd" value={this.state.student.birthdate} onChange={(value) => this.handleChange("birthdate", value)}
          calendarOptions={{
            validator: (date) => {
                var now = new Date();
                var d1 = new Date('1970-01-01');
                var d2 = new Date(now.getFullYear(), now.getMonth(), now.getDate()-10);
                return d1 <= date && date <= d2;
            }
          }}
          style={{position:'absolute', top:20+this.state.rowheight*3, left:84, width:200}}></DateBox>

          <Label htmlFor="age" className="labelStyle" style={{position:'absolute', top:20+this.state.rowheight*3, left:376}}>年龄:</Label>
          <NumberBox inputId="age" id="age" value={this.state.student.age} precision={2} spinners={false} onChange={(value) => this.handleChange("age", value)}
           style={{position:'absolute', top:20+this.state.rowheight*3, left:422, width:70, textAlign:'right'}}></NumberBox>

          <Label htmlFor="idnumber" className="labelStyle" style={{position:'absolute', top:20+this.state.rowheight*4, left:'16px'}}>身份证号:</Label>
          <TextBox inputId="idnumber" id="idnumber" value={this.state.student.idnumber} onChange={this.handleChange_idnumber.bind(this)}
          style={{position:'absolute', top:20+this.state.rowheight*4, left:84, width:200}}></TextBox>

          <Label htmlFor="deptname" className="labelStyle" style={{position:'absolute', top:20+this.state.rowheight*5, left:16}}>所属院系：</Label>
          <ComboBox  inputId="deptname" id="deptname" data={this.state.deptdata} value={this.state.student.deptname} style={{position:'absolute', top:20+this.state.rowheight*5, left:84, width:200}}
          valueField="deptid" textField="deptname" editable={false} panelStyle={{ width: 250 }} onChange={(value) => this.handleChange("deptname", value)}
          xonChange={(value) => this.setState({deptname: value })} />

          <Label  className="labelStyle" style={{position:'absolute', top:20+this.state.rowheight*6, left:16}}>个人兴趣：</Label>
          {
            this.state.hobbydata.map((hobby,index) => {
              return (
                <span key={hobby}>
                  <CheckBox inputId={hobby} multiple value={hobby} values={this.state.student.hobby} 
                  style={{position:'absolute', top:20+this.state.rowheight*6+5, left:16+index*90+70 }} onChange={this.handleChange_hobby.bind(this)}></CheckBox>
                  <Label htmlFor={hobby} style={{position:'absolute', top:20+this.state.rowheight*6, left:16+index*90+95 }}>{hobby}</Label>
                </span>
              )
            })          
          }
          <Label htmlFor="notes" className="labelStyle" style={{position:'absolute', top:20+this.state.rowheight*7, left:16}}>个人简介:</Label>
          <TextBox inputId="notes" id="notes" multiline value={this.state.student.notes} style={{position:'absolute', top:20+this.state.rowheight*7, left:84, width:600, height:150}}></TextBox>
          <LinkButton id="btnok" iconCls="okIcon" iconAlign="left" onClick={this.handleClick.bind(this)} style={{position:'absolute', top:20+this.state.rowheight*7+150+8, left:84, width:100}}>确定</LinkButton>
          </div>
        </Panel>
      </div>
    );
  }
}
