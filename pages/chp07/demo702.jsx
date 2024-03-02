import React from 'react';
import { Form, Input, Select, InputNumber, Checkbox, Radio, DatePicker, Space, Button, ConfigProvider, Cascader, TreeSelect, Divider, QRCode, Rate} from 'antd'
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import locale from 'antd/locale/zh_CN'
import { createRef } from 'react';
import '../../css/style.css';
import { myDatetoStr, reqdoSQL, reqdoTree, toTreeData } from '../../api/functions.js'
import areaData from '../../data/areas.json';
import treeData from '../../data/treeData.json';
//https://ant.design/components/overview-cn/ 
//https://ant.design/components/button
//https://ant.design/docs/react/introduce

const dateFormat = 'YYYY-MM-DD';
const rowheight = 45;

export default class Page702 extends React.Component {
  constructor(props) {
    super(props);    
    this.state = {
      rowheight: 42,
      hobbyData: ['下棋','钓鱼','唱歌','书法','弹琴','编程'],      
      deptData:[{deptname:'信息管理与信息系统',deptid:'0552'},{deptname:'大数据管理与应用',deptid:'0554'},{deptname:'工商管理',deptid:'0550'},{deptname:'计算机科学与技术',deptid:'0612'},{deptname:'会计学',deptid:'0540'}],
      checkallflag: 1,  //1-全选,2-半选,0-全不选，三种状态
      areaData: toTreeData(areaData),
      treeData: treeData,
      student:{ //学生的json对象
        stuid: '2021055401002',
        stuname: '诸葛孔明',
        pycode: 'zhuge',
        qrcode: 'https://ant.design/',
        gender: 2,  //数据类型与后面的一致
        birthdate: dayjs('2001-08-10', dateFormat),
        age: 19,
        popularity: 4.5,
        idnumber: '33010619980516351X',
        hobby: ['唱歌','编程'],
        deptname: '0554',
        city: '330621', //绍兴县
        province: ['330000', '330600', '330621'],       
        notes: '毕业于浙江理工大学'
      }
    }
  }

  async componentDidMount() {    
    console.log(222,this.state.areaData);     
    this.handleChange_hobby(this.state.student.hobby); //设置checkall的状态
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
  }

  cityData = () => { //生成下拉框选项数据格式
    let data=this.state.areaData.map(item => {
      return ({label:item.text, value:item.id})
    });
    return data;
  }

  hobbyOptions = () =>{ //生成下拉框选项数据格式
    let data=this.state.hobbyData.map(item => {
      return ({label:item, value:item})
    });
    return data;
  }
    
  handleValuesChange = (obj1, obj2) => {  
    //表单中所有数据变化时触发
    console.log(obj1);
    console.log(obj2);    
    let id, value;
    for (var key in obj1) {  //只有一个列，提取其id和value值。有没有其他简单方法？
      id=key;
      value=obj1[key];
    }
    //根据id值做特殊的onchange处理
    if (id=='idnumberxxx') this.handleChange_idnumber(value);  //根据身份证号计算出生日期和年龄
    else if (id=='hobby') this.handleChange_hobby(value);  //设置全选checkbox的三种状态
    else if (id=='birthdate'){
      //根据出生日期计算年龄，将空日期设置为今天日期
      if (value == null) value = myDatetoStr(new Date());
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
      this.myForm1.setFieldsValue({'birthdate': dayjs(birthdate, dateFormat), 'age':age, 'gender':x%2 ==1? 1:2});
    }else{
       alert('身份证号码格式错误！');
    }
  }  

  handleChange_birthdate = (value) => {  //选中或不选中一个
    let now = new Date();
    let age = now.getFullYear()-new Date(value).getFullYear();
    this.myForm1.setFieldsValue({'birthdate': dayjs(value, dateFormat),'age': age});  //必须把birthdate进行修改，否则onfinish中不会有更新的值    
  };
  
  handleChange_hobby= (values) => {  
    //选中或不选中一个，做多可选择4个 
    //用this.state.student.hobby记录原来选的hobby
    let student=this.state.student;
    if (values.length > 3){
      //取消刚选的那一个
      values = this.state.student.hobby;
      this.myForm1.setFieldValue('hobby', values);
    }
    this.setState({student:{...student, hobby:values}});
  };

  handleClick_reset = (e)=>{
    console.log(e);
  }

  handleClick_ok = (e)=>{
    //console.log(this.state.student);
  }
  
  onSearch_pycode = (value) =>{
    //根据汉字显示拼音
    console.log(333,this.myForm1.getFieldValue('stuname'));
  }

  handleClick_brcode = ()=>{    
    let student={...this.state.student};  
    //随机函数
    let n = Math.floor(Math.random() * 10);
    let qrcodes=['https://ant.design/components/overview-cn/','https://ant.design/components/button','https://ant.design/docs/react/introduce','https://zstu.edu.cn','https://www.zstu.edu.cn','https://www.ifeng.com','https://www.163.com','mail.163.com','https://www.sina.com.cn','https://www.imlab.top'];
    console.log(qrcodes[n])
    //this.myForm1.setFieldsValue({'qrcode':'www.zstu.edu.cn'})  //无效，因为form.item无法设置二维码的name属性
    this.setState({student:{...student, qrcode: qrcodes[n]}})
  }
  render() {
    return (
      <ConfigProvider locale={locale}>
        <Form name="myForm1" ref={ref => this.myForm1 = ref} labelCol={{style:{width:82}}} autoComplete="off" onFinish={this.onFinish} onFinishFailed={this.onFinishFailed} onValuesChange={this.handleValuesChange.bind(this)} initialValues={this.state.student} style={{position:'relative'}} >          
          <Form.Item label='学生学号' name='stuid' className='labelStyle' style={{position:'absolute', top:16+rowheight*0, left:20}} rules={[{required: true }]}>
              <Input style={{width:160}} id='stuid' key='stuid' ref={ref => this.stuid = ref}  />
          </Form.Item>         
          <Form.Item label='学生姓名' name='stuname' className='labelStyle'  style={{position:'absolute', top:16+rowheight*1, left:20}} rules={[{required: true }]}>
            <Input style={{width:300}} id='stuname' key='stuname' ref={ref => this.stuname = ref}  />
          </Form.Item>       
          <Form.Item label='姓名拼音' name='pycode' className='labelStyle' style={{position:'absolute', top:16+rowheight*2, left:20}} >
            <Input.Search id='pycode' key='pycode' style={{width:300, height:28}} ref={ref => this.pycode = ref}
             onSearch={this.onSearch_pycode} enterButton size='medium' 
             rules={[{pattern:/^[A-Za-z0-9][\s\S]+$/,message:'请输入英文',validateTrigger:'onBlur'}]} />
          </Form.Item>          
          <Form.Item label='性别' name='gender' key='gender' className='labelStyle' style={{position:'absolute', top:16+rowheight*3, left:20}}>
            <Radio.Group id='gender' ref={ref => this.gender = ref} optionType="button" buttonStyle="solid" style={{marginLeft:0}} options={[{label:'男', value: 1},{label:'女', value: 2}]}>
            </Radio.Group>            
          </Form.Item>         
          <Form.Item label='人气指数' name='popularity' className='labelStyle' style={{position:'absolute', top:16+rowheight*3, left:210}}>
            <Rate allowHalf count={5} tooltips={['低','较低','一般','较高','非常高']} style={{color:'red', fontSize:'18px', marginTop:-8}} />
          </Form.Item>          
          <Form.Item label='出生日期' name='birthdate' key='birthdate' className='labelStyle' mode='date' 
           style={{position:'absolute', top:16+rowheight*4, left:20, width:220}} >
              <DatePicker id='birthdate' name='birthdate' ref={ref => this.birthdate = ref} format={dateFormat} />
          </Form.Item>          
          <Form.Item label='年龄' name='age' key='age' className='labelStyle' style={{position:'absolute', top:16+rowheight*4, left:280}} >
            <Input id='age' ref={ref => this.age = ref} style={{width:66}} readOnly />
          </Form.Item>          
          <Form.Item label='身份证号' name='idnumber' key='idnumber' className='labelStyle' style={{position:'absolute', top:16+rowheight*5, left:20}} >
              <Input.Search id='idnumber' style={{width:300}} ref={ref => this.idnumber = ref} enterButton="设置" size="medium" onSearch={this.handleChange_idnumber.bind(this)} />
          </Form.Item>   

          <Form.Item label='家庭籍贯' name='province' key='province' className='labelStyle' style={{position:'absolute', top:16+rowheight*6, left:20}} >
              <Cascader id='province' ref={ref => this.province = ref} 
              fieldNames={{label:'text', value:'id'}} options={this.state.areaData} style={{width:300}} />
          </Form.Item>          

          {/* 两个控件使用同一个areaData，key相同会出错警告 */}
          {/* <Form.Item label='' name='city' className='labelStyle' style={{position:'absolute', top:16+rowheight*6, left:410}} >
             <TreeSelect id='city' style={{ width: 280 }} dropdownStyle={{ maxHeight: 300, overflow: 'auto' }}
              fieldNames={{label:'text', value:'id'}} treeData={this.state.areaData} treeDefaultExpandAll  />
          </Form.Item> */}
          
          <Form.Item label='所属院系' name='deptname' key='deptname' className='labelStyle' style={{position:'absolute', top:16+rowheight*7, left:20}}  >
              <Select id='deptname' style={{width:300}} ref={ref => this.deptname = ref} fieldNames={{label:'deptname', value:'deptid'}} options={this.state.deptData} />
          </Form.Item> 
          
          <Form.Item label='个人兴趣' name='hobby' key='hobby' className='labelStyle' style={{position:'absolute', top:16+rowheight*8, left:20}} >
            <Checkbox.Group id='hobby' ref={ref => this.hobby = ref} options={this.hobbyOptions()} />
          </Form.Item>
          <Form.Item label='（仅限3项）' className='labelStyle' style={{position:'absolute', top:16+rowheight*8, left:500}} colon={false} />
          <Form.Item label='个人简历' name='notes' className='labelStyle' style={{position:'absolute', top:16+rowheight*9, left:20}} >
            <Input.TextArea id='notes' ref={ref => this.notes = ref} autoSize={{ minRows: 4, maxRows: 4 }} placeholder="限输入1000字" maxLength={1000} style={{width:600}} showCount />
            {/* autosize可以隐藏textarea的伸展图表 */}
          </Form.Item>
          <Form.Item style={{position:'absolute', top:16+rowheight*1, left:470}} >
          <QRCode errorLevel="H" size={170} value={this.state.student.qrcode} icon="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg"  />
          </Form.Item>
          <Button name='barcodebtn' onClick={this.handleClick_brcode} style={{position:'absolute', top:16+rowheight*4+46, left:485, width:140}}>刷新二维码</Button>          
          <Divider style={{position:'absolute', top:16+rowheight*10+60}} />
          <Button type="primary" name='okbtn' htmlType='submit' onClick={this.handleClick_ok} style={{position:'absolute', top:16+rowheight*10+100, left:220, width:80}}>确定</Button>
          <Button type="default" name='resetbtn' onClick={this.handleClick_reset} style={{position:'absolute', top:16+rowheight*10+100, left:320, width:80}} >重置</Button>
        </Form>
      </ConfigProvider>
    );
  }
}
