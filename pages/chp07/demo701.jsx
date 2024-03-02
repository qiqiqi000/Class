import React from 'react';
import { Image, Row, Col, Form, Input, Select, InputNumber, Checkbox, Radio, DatePicker, Space, Button, ConfigProvider, Divider } from 'antd'
import { DatePickerProps } from 'antd';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
//import locale from 'antd/locale/zh_CN'
import { createRef } from 'react';
//import '../../css/style.css';
import { myDatetoStr } from '../../api/functions.js'
//https://ant.design/components/overview-cn/
//https://ant.design/components/button
//https://ant.design/docs/react/introduce
//设置日期的格式，可以使用React.sys中的全局变量
const sys = { ...React.sys }
const dateFormat = sys.dateFormat; //'YYYY-MM-DD';
const { TextArea, Search } = Input;   //解构，也可以用input.TextArea
export default class Page701 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rowheight: 42,  //行高
      hobbyArray: ['下棋', '钓鱼', '唱歌', '书法', '编程'],  //个人兴趣的数据源，不是一个json数据，后面需要将其转成json
      hobbyData: [], //将hobbyArray转成hobbyData，它是一个json对象的数组
      deptData: [{ deptname: '信息管理与信息系统', deptid: '0552' }, { deptname: '大数据管理与应用', deptid: '0554' }, { deptname: '工商管理', deptid: '0550' }, { deptname: '计算机科学与技术', deptid: '0612' }, { deptname: '会计学', deptid: '0540' }],
      checkallflag: 1,  //全选按钮的状态。1-全选,2-半选,0-全不选，三种状态
      //定义一个学生对象，作为表单的初值
      student: {
        stuid: '2021055401002',
        stuname: '诸葛孔明',
        pycode: 'zhugekong',
        gender: 1,  //数据类型与后面的一致
        birthdate: dayjs('2001-08-10', dateFormat),  //birthdate: new Date('2001-08-10')这样是错误的, moment('2023-01-01', 'YYYY-MM-DD')？行不行
        photopath: sys.serverpath + 'mybase/students/2013333502034.jpg',
        age: 19,
        idnumber: '33010619980516351X',
        hobby: ['唱歌', '编程'],
        deptname: '0554',
        notes: '毕业于浙江理工大学'
      }
    }
  }
  async componentDidMount() {
    //页面加载时设置checkall的状态 和计算年龄
    this.handleChange_hobby(this.state.student.hobby); //设置checkall的状态
    this.handleChange_birthdate(this.state.student.birthdate);  //计算年龄
  }

  onFinishFailed = (values) => {
    //表单提交出错时触发，这里没有使用
    //console.log(444,values);
  }

  onFinish = (json) => {
    //表单提交时自动触发，不需要写按钮点击事件，因为按钮定义式有submit
    //console.log(661, json);
    //json.photopath=[{filename:'aaa.jpg'},{filename:'aaa2.jpg'}];
    //遍历数据json数据，对日期变量或其他变量特殊值需要进行特殊处理是才这里写代码
    for (var key in json) {
      if (typeof json[key] === 'object' && !Array.isArray(json[key]) && json[key].$d instanceof Date) { //将日期型数据转成字符串
        json[key] = json[key].format(dateFormat);
      }
    }
    //数据转换之后的其他操作（例如数据保存之类的）写在这个后面
    console.log(662, json);
  }

  deptOptions = () => {
    //生成院系deptid下拉框选项的数据格式。也可以不转换，在deptid控件中使用fieldNames设置label列为deptname，value列为deptid
    let data = this.state.deptData.map(item => {
      return ({ label: item.deptname, value: item.deptid })
    });
    return data;
  }

  hobbyOptions = () => { //生成下拉框选项数据格式
    let data = this.state.hobbyArray.map(item => {
      return ({ label: item, value: item, checked: true })
    });
    console.log(667, data);
    return data;
  }

  handleValuesChange = (obj1, obj2) => {
    //表单中所有数据变化时触发。obj1为表单中当前修改的列，只有一个列
    //obj2为修改之后表单中所有控件的最新值
    console.log(obj1);
    console.log(obj2);
    let id = Object.keys(obj1)[0]
    let value = obj1[id];
    // for (var key in obj1) {  //json中只有一个列，提取其id和value值。有没有其他简单方法？
    //   id=key;
    //   value=obj1[key];
    // }    
    //根据id值做特殊的onchange处理
    if (id == 'idnumber') this.handleChange_idnumber(value);  //根据身份证号计算出生日期和年龄
    else if (id == 'hobby') this.handleChange_hobby(value);  //设置全选checkbox的三种状态
    else if (id == 'checkallhobby') this.handleChange_checkallhobby(value);  //全选或不选hobby
    else if (id == 'birthdate') {
      //根据出生日期计算年龄，将空日期设置为今天日期
      if (value === null || value === undefined) value = myDatetoStr(new Date());
      this.handleChange_birthdate(value);
    }
  };

  handleChange_idnumber = (value) => {
    //根据身份证号得到出生日期
    if (value != '') {
      let birthdate = value.substr(6, 4) + '-' + value.substr(10, 2) + '-' + value.substr(12, 2)
      let now = new Date();
      let age = now.getFullYear() - new Date(birthdate).getFullYear();
      if (isNaN(age)) age = 0;
      this.myForm1.setFieldsValue({ 'birthdate': dayjs(birthdate, dateFormat), 'age': age });
    }
  }

  handleChange_birthdate = (value) => {  //根据出生日期计算年龄
    let now = new Date();
    let age = now.getFullYear() - new Date(value).getFullYear();
    //必须把birthdate进行修改，否则onfinish中不会有更新的值
    this.myForm1.setFieldsValue({ 'birthdate': dayjs(value, dateFormat), 'age': age });
  };

  handleChange_hobby = (value) => {
    //选择个人兴趣的checkbox时，如何动态设置“全选”checkbox的状态，选中时需要设置其value为['1']（有单引号），复制设置其value为[]
    let x = 0;
    if (value.length == this.state.hobbyArray.length) x = 1;
    else if (value.length > 0) x = 2;
    this.setState({ checkallflag: x }, () => {
      if (x == 1) this.myForm1.setFieldsValue({ 'checkallhobby': ['1'] });
      else this.myForm1.setFieldsValue({ 'checkallhobby': [] });
    });
  };

  handleChange_checkallhobby = (value) => {  //全选或全不选
    let hobby;
    if (value.length > 0) hobby = this.state.hobbyArray; //全选
    else hobby = [];   //全不选
    this.setState({ checkallflag: (hobby.length > 0 ? 1 : 0) }, () => this.myForm1.setFieldsValue({ 'hobby': hobby }));
  };

  handleChange_checkall = (e) => {  //全选或全不选,单个checkbox的onchange事件
    let hobby;
    if (e.target.checked) hobby = this.state.hobbyArray; //全选
    else hobby = [];   //全不选
    this.setState({ checkallflag: (hobby.length > 0 ? 1 : 0) }, () => {
      setTimeout(() => {
        this.myForm1.setFieldsValue({ 'hobby': hobby });
      })
    });
  };

  handleClick_reset = (e) => {
    console.log(e);
  }

  handleClick_ok = (e) => {
    //console.log(this.state.student);
  }

  render() {
    console.log(1888, this.state.checkallflag);
    return (
      <Form name="myForm1" ref={ref => this.myForm1 = ref} autoComplete="off" onFinish={this.onFinish}
        //onFinishFailed={this.onFinishFailed} 
        onValuesChange={this.handleValuesChange.bind(this)}  //表单的onchange事件
        initialValues={this.state.student}  //表单的初值，为一个json对象
      >
        <Form.Item label='学生学号' name='stuid' className='labelStyle' style={{ margin:'15px 0px 0px 26px' }} >
          <Input style={{ width: 160 }} id='stuid' ref={ref => this.stuid = ref} />
        </Form.Item>

        <Form.Item label='学生姓名' name='stuname' className='labelStyle' style={{ margin: '15px 0px 0px 26px' }} >
          <Input style={{ width: 300 }} id='stuname' ref={ref => this.stuname = ref} />
        </Form.Item>

        <Form.Item label='姓名拼音' name='pycode' className='labelStyle' style={{ margin: '15px 0px 0px 26px' }} >
          <Input id='pycode' style={{ width: 300 }} ref={ref => this.pycode = ref}
            rules={[{ pattern: /^[A-Za-z0-9][\s\S]+$/, message: '请输入英文', validateTrigger: 'onBlur' }]} />
        </Form.Item>

        <Form.Item label='性别' name='gender' className='labelStyle' style={{ margin: '15px 0px 0px 54px' }} >
          <Radio.Group id='gender' ref={ref => this.gender = ref}>
            <Radio value={1}>男</Radio>
            <Radio style={{ marginLeft: 15 }} value={2}>女</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item label='出生日期' name='birthdate' className='labelStyle' mode='date' style={{ display: 'inline-block', margin: '15px 0px 0px 26px', width: 210 }} >
          <DatePicker id='birthdate' name='birthdate' ref={ref => this.birthdate = ref} format={dateFormat} />
        </Form.Item>

        <Form.Item label='年龄' name='age' className='labelStyle' style={{ display: 'inline-block', margin: '15px 0px 0px 50px' }} >
          <Input id='age' ref={ref => this.age = ref} style={{ width: 66 }} readOnly={true} />
        </Form.Item>

        <Form.Item label='' name='photopath' className='labelStyle' style={{ display: 'inline-block', margin: '-140px 0px 0px 50px' }}>
          <Image id="photopath" height={180} src={this.state.student.photopath} style={{float:'left' }} />
        </Form.Item>


        <Form.Item label='身份证号' name='idnumber' className='labelStyle' style={{ margin: '15px 0px 0px 26px' }} >
          <Input id='idnumber' style={{ width: 300 }} ref={ref => this.idnumber = ref} />
        </Form.Item>

        <Form.Item label='所属院系' name='deptname' className='labelStyle' style={{ margin: '15px 0px 0px 26px' }} >
          <Select id='deptname'
            //options={this.deptOptions()}
            options={this.state.deptData} fieldNames={{ label: 'deptname', value: 'deptid' }}
            style={{ width: 300 }} ref={ref => this.deptname = ref} />
        </Form.Item>

        {/* <Form.Item label='个人兴趣' id='checkall' className='labelStyle' style={{margin:'15px 0px 0px 26px'}} >
            <Checkbox checked={this.state.checkallflag == 1} indeterminate={this.state.checkallflag == 2}
             onChange={this.handleChange_checkall.bind(this)}>全选</Checkbox>
          </Form.Item> */}

        <Form.Item name='checkallhobby' label='个人兴趣' className='labelStyle' style={{ margin: '15px 0px 0px 26px' }}>
          <Checkbox.Group id='checkallhobby' ref={ref => this.checkallhobby = ref} style={{ marginLeft: 20, marginTop: 4 }}>
            <Checkbox value="1" indeterminate={this.state.checkallflag == 2}>全选</Checkbox>
          </Checkbox.Group>
        </Form.Item>

        <Form.Item name='hobby'>
          <Checkbox.Group id='hobby' ref={ref => this.hobby = ref}
            options={this.hobbyOptions()}  //使用函数，每次渲染是都要执行，改成只执行一次
            style={{ margin: '0px 0px 0px 100px' }} />
        </Form.Item>

        <Form.Item label='个人简历' name='notes' className='labelStyle' style={{ margin: '15px 0px 0px 26px' }} >
          <TextArea id='notes' ref={ref => this.notes = ref} rows={4}
            style={{ height: 200, width: 700, marginBottom: 24, resize: 'none' }}
            //style={{height:200, width:700, marginBottom:24}} 
            placeholder="限输入100字" maxLength={100} showCount />
        </Form.Item>

        <Divider />

        <Button type="primary" name='okbtn' htmlType='submit' onClick={this.handleClick_ok} style={{ margin: '0px 0px 0px 200px', width: 80 }}>确定</Button>
        <Button type="default" name='resetbtn' onClick={this.handleClick_reset} style={{ margin: '0px 0px 0px 10px', width: 80 }}>重置</Button>
      </Form>
    );
  }
}
