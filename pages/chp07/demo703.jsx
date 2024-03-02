import React from 'react';
import { Form, Input, Select, InputNumber, Checkbox, Radio, DatePicker, Space, Button, ConfigProvider, Cascader, TreeSelect, Divider, QRCode, Rate} from 'antd'
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import locale from 'antd/locale/zh_CN'
import { createRef } from 'react';
import '../../css/style.css';
import { findTreeNode, myDatetoStr, toTreeData, pinyin } from '../../api/functions.js'
import { AntDateBox, AntComboBox, AntRadio, AntCheckBox, AntLabel } from '../../api/antdComponents.js'
import { AntdInputBox, AntdCheckBox, AntdComboBox, AntdRadio, AntdCascader, AntdImage } from '../../api/antdClass.js'
import areaData from '../../data/areas.json';

//https://ant.design/components/overview-cn/ 
//https://ant.design/components/button
//https://ant.design/docs/react/introduce

const dateFormat = 'YYYY-MM-DD';
const rowheight = 45;

export default class Page703 extends React.Component {  
  constructor(props) {
    super(props);  
    this.parentRef = React.createRef();
    this.state = {
      hobbydata: ['下棋','钓鱼','唱歌','书法','弹琴','编程'],      
      deptdata:[{deptname:'信息管理与信息系统',deptid:'0552'},{deptname:'大数据管理与应用',deptid:'0554'},{deptname:'工商管理',deptid:'0550'},{deptname:'计算机科学与技术',deptid:'0612'},{deptname:'会计学',deptid:'0540'}],
      checkallflag: 1,  //1-全选,2-半选,0-全不选，三种状态
      areadata: toTreeData(areaData),
      student:{ //学生的json对象
        stuid: '2021055401002',
        stuname: '诸葛孔明222',
        pycode: 'zhuge',
        qrcode: 'https://ant.design/',
        gender: '女',  //数据类型与后面的一致
        genderx: '女',  //数据类型与后面的一致
        birthdate: dayjs('2001-08-10', dateFormat),
        age: 19,
        popularity: 4.5,
        idnumber: '33010619980516351X',
        photopath: [{url:'mybase/students/2013333502034.jpg'},{url:'mybase/students/2013333570023.jpg'}],
        deptid: '0554',
        deptname: '大数据管理与应用',
        region: '130000', //河北
        province: ['330000', '330600', '330621'],       
        city: '330621', //['330000', '330600', '330621'],
        foods: ['8', '53', '62', '69'],
        hobby: ['唱歌','钓鱼'],
        notes: '毕业于浙江理工大学',
      }
    }
  }

  async componentDidMount() {    
    //console.log(333,this.getPageForm())
    let { student } = this.state;
    let data = this.city?.state.data || [];
    //console.log(919,data,this.city )
    // for (let key in student){
    //  //console.log(99,key, this[key], this[key]?.state.antclass)
    //   if (this[key] && this[key].state.antclass==='cascader'){
    //     let xnode=findTreeNode(data, student[key]);  //有没有空节点
    //     console.log(8,xnode,student[key]);
    //     student[key] = ['330000', '330600', '330621'];
    //   }
    // }
    // console.log(1111,student)
    //this.myForm1.setFieldsValue(student)
    this.handleChange_birthdate(this.state.student.birthdate);  //计算年龄
  }
  
  onFinishFailed=(values)=>{//信息错误时触发
    //console.log(444,values);
  }

  onFinish = (json) => { //提交时触发
    console.log(661, json);
    for (var key in json) {
      if (typeof json[key] === 'object' && typeof json[key].$d === 'object'){ //将日期型数据转成字符串
        //json[key] = myDatetoStr(json[key].$d);
        json[key] = json[key].format(dateFormat);        
      }
    }
    console.log(662, json);
    //动态设置属性只读、隐藏
    this.deptname.setState({visible:false});
    this.age.setState({readOnly:false, visible:false});
  }

  handleClick_reset = (e)=>{
    //重置
    console.log(this.deptname)
    this.deptname.setState({visible:true});
    this.age.setState({readOnly: true, visible:true});
  }

  handleValuesChange = (obj1, obj2) => {  
    //表单中所有数据变化时触发
    console.log(361,obj1);
    console.log(362,obj2);    
    //console.log(364,this.myForm1);
    let id, value;
    for (var key in obj1) {  //只有一个列，提取其id和value值。有没有其他简单方法？
      id=key;
      value=obj1[key];
      if (value == null && this[id] && this[id].state != undefined && this[id].state.antclass=='datebox'){
        value = myDatetoStr(new Date());
        this.myForm1.setFieldValue(id, value); 
      } 
    }
    //根据id值做特殊的onchange处理
    if (id=='birthdate'){
      //根据出生日期计算年龄，将空日期设置为今天日期
      this.handleChange_birthdate(value); 
    }
  };

  handleChange_idnumber = (value) => {
    if (value!='' && value.length==18){
      let birthdate=value.substr(6,4)+'-'+value.substr(10,2)+'-'+value.substr(12,2)
      let now = new Date();    
      //计算出生日期和年龄
      let age = now.getFullYear()-new Date(birthdate).getFullYear();
      if (isNaN(age)) age=0;
      //计算男女
      let x=parseInt(value.substr(16,1));
      this.myForm1.setFieldsValue({'birthdate': dayjs(birthdate, dateFormat), 'age':age, 'gender':x%2 ==1? '男':'女'});
    }else{
       alert('身份证号码格式错误！');
    }
  }  

  handleChange_birthdate = (value) => {  //选中或不选中一个
    let now = new Date();
    let age = now.getFullYear()-new Date(value).getFullYear();
    this.myForm1.setFieldsValue({'birthdate': dayjs(value, dateFormat),'age': age});  //必须把birthdate进行修改，否则onfinish中不会有更新的值    
  };
  
  handleClick_ok = (e)=>{
    //console.log(this.state.student);
  }
  
  onSearch_pycode = (value) =>{
    //根据汉字显示拼音
    let s = pinyin(this.myForm1.getFieldValue('stuname')).pinyin;
    //console.log(333,this.myForm1.getFieldValue('stuname'),s);
    this.myForm1.setFieldValue('pycode', s);    
  }

  handleClick_brcode = ()=>{    
    let student={...this.state.student};  
    //随机函数
    let n = Math.floor(Math.random() * 10);
    let qrcodes=['https://ant.design/components/overview-cn/','https://ant.design/components/button','https://ant.design/docs/react/introduce','zstu.edu.cn','www.zstu.edu.cn','www.ifeng.com','www.163.com','mail.163.com','www.sina.com.cn','www.imlab.top'];
    console.log(qrcodes[n])
    //this.myForm1.setFieldsValue({'qrcode':'www.zstu.edu.cn'})  //无效，因为form.item无法设置二维码的name属性
    this.setState({student:{...student, qrcode: qrcodes[n]}})
  }  

  getPageForm =(form)=> {
    return document.getElementById(form);
  }

  render() {
    return (<>
        <Form id="myForm1" ref={ref=>this.myForm1=ref} autoComplete="off" onFinish={this.onFinish} onFinishFailed={this.onFinishFailed} onValuesChange={this.handleValuesChange.bind(this)} initialValues={this.state.student} style={{position:'relative'}} >
          <AntdInputBox type='text' id='stuid' label='学生学号' labelwidth={82} left='14' width='160' top={16+rowheight*0} message='学号不能为空' ref={ref=>this.stuid=ref} />
          <AntdInputBox type='text' id='stuname' label='学生姓名' left='14' width={260} required top={16+rowheight*1} ref={ref=>this.stuname=ref} />
          <AntdInputBox type='search' ref={ref=>this.pycode=ref} id='pycode' label='姓名拼音' labelwidth={82} left='14' width='260' top={16+rowheight*2} onSearch={this.onSearch_pycode.bind(this)} />
          <AntdRadio id='gender' ref={ref=>this.gender=ref} label='性别' labelwidth='82' left='14' items='男;女;妖;仙' top={16+rowheight*3} />
          <AntdRadio id='genderx' ref={ref=>this.genderx=ref} label='性别' labelwidth='52' left='410' items='男;女' top={16+rowheight*3} optionType="button" />
          <AntdInputBox type='date' id='birthdate' ref={ref=>this.birthdate=ref} label='出生日期' labelwidth={82} left={14} width={260} top={16+rowheight*4} />
          <AntdInputBox type='text' id='age' ref={ref=>this.age=ref} label='年龄' labelwidth='52' left={410} width={60} readOnly top={16+rowheight*4}  />
          <AntdInputBox id='idnumber' ref={ref=>this.idnumber=ref} label='身份证号' labelwidth={82} width='260' left='14' type='search' top={16+rowheight*5} enterButton='设置' onSearch={this.handleChange_idnumber.bind(this)} />
          <AntdComboBox id='deptid' ref={ref=>this.deptid=ref} label='所属院系' labelwidth='82' left='14' width='260' top={16+rowheight*6} options={this.state.deptdata} labelfield='deptname' valuefield='deptid' />
          <AntdComboBox id='deptname' ref={ref=>this.deptname=ref} label='所属专业' labelwidth='82' left='410' width='260' items='信息管理与信息系统;大数据管理与应用;工商管理;计算机科学与技术;会计学' top={16+rowheight*6} />
          <AntdComboBox id='region' ref={ref=>this.region=ref} label='所属省份' labelwidth='82' left='14' width='260' sqlprocedure='demo305a' parentnodeid='' top={16+rowheight*7} labelfield='areaname' valuefield='areaid' /> 
          <AntdCascader page={this} form='myForm1' id='city' ref={ref=>this.city=ref} label='所在城市' labelwidth='82' left='410' width='260' sqlprocedure='demo506b' xsqlprocedure='demo702a' top={16+rowheight*7} labelfield='text' valuefield='id' />
          <AntdCheckBox page={this} form='myForm1' checkall='true' id='foods' ref={ref=>this.foods=ref} 
           checkalltext='全选' label='我的最爱' labelwidth='82' left='14' top={16+rowheight*8} width='130' spacing='8'
           items='下棋;钓鱼;唱歌;书法;弹琴;编程' //无效，被存储过程覆盖
           sqlprocedure='demo302b' sqlparams={{categoryid:'D'}} />
           {/* 没有checkall时不需要定义 page={this} form='myForm1' */}
          <AntdCheckBox maxcount={4} id='hobby' ref={ref=>this.hobby=ref} label='个人兴趣' labelwidth='82' left='14' top={16+rowheight*9} xwidth='80' spacing='8' items='中国象棋;钓鱼;程序设计;唱歌;书法;弹琴' />
          <AntdInputBox type='textarea' id='notes' ref={ref => this.notes = ref} placeholder="限输入100字" maxLength={100} top={16+rowheight*10} left={14} height={120} width={745} /> 
          <AntdImage id="photopath" top='10' left='400' height='130' src={this.state.student.photopath} datatype='json' />
          <Button type="primary" name='okbtn' htmlType='submit' onClick={this.handleClick_ok} style={{position:'absolute', top:16+rowheight*10+120, left:320, width:80}}>确定</Button>
          <Button type="default" name='resetbtn' onClick={this.handleClick_reset} style={{position:'absolute', top:16+rowheight*10+120, left:420, width:80}} >重置</Button>
        </Form>
      </>
    );
  }
}
