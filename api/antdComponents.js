/**
 * 包含应用中使用请求接口的模块
 * 文件上传路径用/不能用\，例如targetpath='mybase/resources'
 */
import ajax from './ajax'
import React, { Component } from 'react';
import { useEffect,useRef, useImperativeHandle } from 'react';
import axios from "axios";
//import sys from './common.js'
import { Modal, Upload, notification, Form, Input, Select, InputNumber, Checkbox, Radio, DatePicker, Image, Button, ConfigProvider, Cascader, TreeSelect, Divider, QRCode, Rate} from 'antd'
import { WindowsOutlined, FormOutlined, PlusCircleOutlined, EditOutlined,DeleteOutlined,SaveOutlined,PrinterOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import locale from 'antd/locale/zh_CN'
//import { createRef } from 'react';
//import '../css/style.css';
//import styles from '../css/style.less';
import { myParseAntFormItemProps, myParseTableColumns, myParseTags, myDoFiles, myLocalTime, searchNodeInRows, addTreeChildrenData, reqdoTree, reqdoSQL, myStr2JsonArray, myStr2Json, myDatetoStr } from './functions.js'
import ReactDom from 'react-dom'
import { Model } from 'echarts';

//修改全局变量值
//React.sys.dateformat = 'YYYY/MM/DD';
const sys={...React.sys};
//sys.dateformat = 'YYYY/MM/DD';
//console.log(993, sys)
//console.log(12112, React.sys)

export class ConfirmModal  extends React.Component {
  constructor(props) {
     super(props);
     let attr={...this.props};  //this.props不能添加属性e.g.antclass
     attr.antclass = 'confirmmodal'; 
     if (attr.title===undefined) attr.title='系统提示';
     if (attr.description===undefined && attr.message!=undefined) attr.description=attr.message;
     if (attr.description===undefined) attr.description='是否确定删除这条记录？';
     if (attr.okText===undefined) attr.okText='确定';
     if (attr.cancelText===undefined) attr.cancelText='取消';
     if (attr.width===undefined) attr.width=340;
     if (attr.height===undefined) attr.height=200;
     attr.width=parseInt(attr.width);
     attr.height=parseInt(attr.height);
     this.state = {
       attr: attr,
       visible: false,
       title: attr.title,
       description: attr.description,
     }
  }
  render(){
    let { id, width, height, okText, cancelText } = this.state.attr;
    let { title, visible, description } = this.state;
    return (
      <Modal name='myMsg1' key='myMsg1' title={title} open={this.state.visible} width={width} centered maskClosable={false}
        style={{position:'relative', padding:0}} closable keyboard={false} 
        //bodyStyle={{ padding:0, margin:0 }} 
        styles={{body:{ padding:0, margin:0 }}}
        { ...this.props }
        onCancel={()=>this.setState({visible:false})}
        footer={[<Button key='_btnok' type='primary' onClick={(e)=>{this.props.onConfirm?.(e)}}>{okText}</Button>,
        <Button key='_btnclose' type='primary' onClick={()=>this.setState({visible:false})}>{cancelText}</Button>]}>
          {description}
      </Modal>
    )
  }
}

export class AntModal  extends React.Component {
  constructor(props) {
     super(props);
     let attr={...this.props};  //this.props不能添加属性e.g.antclass
     attr.antclass = 'modal'; 
     if (attr.title===undefined) attr.title='系统提示';
     if (attr.okText===undefined) attr.okText='确定';
     if (attr.cancelText===undefined) attr.cancelText='取消';
     if (attr.width===undefined) attr.width=500;
     if (attr.height===undefined) attr.height=400;
     attr.width=parseInt(attr.width);
     attr.height=parseInt(attr.height);
     this.state = {
       attr: attr,
       visible: false,
       title: attr.title,
     }
  }

  handleOkClick=(e)=>{
    this.setState({visible: false}, () => { 
      setTimeout(() => {
        this.state.attr.onOkClick?.(e);
      })
    });
  }

  render(){
    let { id, width, height, okText, cancelText } = this.state.attr;
    let { title, visible } = this.state;
    console.log(height,width);
    return (
      <Modal id='myModal1' key='myModal1' ref={ref=>this.myModal1=ref} 
       title={title} open={this.state.visible} 
       forceRender centered maskClosable={false}
       cancelText={cancelText} onCancel={()=>{this.setState({visible: false})}} 
       style={{position:'relative', padding:0}} closable keyboard={false} 
       //bodyStyle={{ padding:0, margin:0, width:width+'px', height:height+'px' }}
       styles={{body:{ padding:0, margin:0, width:width+'px', height:height+'px' }}}
       { ...this.props }
       footer={[
        <Button key='btnok' type='primary' htmltype='submit' onClick={this.handleOkClick}>{okText}</Button>,
        <Button key='btnclose' type='primary' onClick={()=>{this.setState({visible: false})}}>{cancelText}</Button>
       ]}>
      </Modal>
    )
  }
}

export class AntTextBox extends React.Component {  //class的名称必须大写字母开头
  constructor(props) {
    super(props);
    //console.log(9999,props);
    //可以有2种方式接受参数
    //调用方式1：<MyTextBox params='stuname,学生姓名,72, 70, 20, 28,240,诸葛孔明, ,' />
    //调用方式2：<MyTextBox id='supplierid' label='供应商' labelwidth='72' top={20+7*rowheight} left='20' width='200' ref={ref => this.supplierid = ref} addonRight={this.addon.bind(this, 'help')} />
    //let antclass='textbox';  //不同控件参数解析不同
    let p={...this.props};  //this.props不能添加属性e.g.antclass
    p.antclass = 'textbox';  //不同控件参数解析不同
    //let attr=myParseAntFormItemProps(this.props,'');
    let attr=myParseAntFormItemProps(p);
    //console.log(9991, attr);
    //console.log(9992, attr.height);
    this.state = {
      attr: attr,
      value: attr.value,
      antclass: attr.antclass,
      editable: attr.editable,
      display: 'block'
    }
  }  

  handleChange=(e)=>{
    //console.log(199);
    this.setState({value: e.target.value},() => {this.props.onChange?.(e)});
  }

  render() {    
    let { onChange, onSearch, rules }= this.props;
    let { id, label, labelwidth, top, left, height, width, value, style, hidden, disabled, editable, addon, multiline, message } = this.state.attr;
    //if (id=='filtertext') console.log(889,id,editable,this.state.editable, this.state.value,this.state.attr.value)
    /*
    let str;
    if (labelwidth==0 && label!=''){
      str=<br/>
      labelwidth=width;
    } 
    */
    if (addon=='search'){
      //  if (id=='filtertext') console.log(id,this.state.value)
        return (          
          <Form.Item label={label} labelCol={{style:{ width: labelwidth }}} name={id} className='labelStyle' style={{position:'absolute', top:top, left:left>=0? left:null, right:left<0? -left:null, display:hidden? 'none' : this.state.display}} rules={[{required: this.state.attr.required, message:message }]}>
             <Input.Search id={id} ref={ref => this[id] = ref} style={{width: width, height:height}} 
             readOnly={editable? !this.state.editable : true} disabled={disabled} value={this.state.value}
             //onFocus={()=>{document.getElementById(id).select()}} 
             onFocus={(e)=>{e.target.select()}}
             onChange={this.handleChange.bind(this)}
             //xonChange={(e) => {console.log(999); this.setState({ value: e.target.value }); onChange?.(e)}}
             { ...this.props } />
          </Form.Item>     
        )
    }else if (multiline){
     // console.log(id,this.state.attr)
      return (
          <Form.Item label={label} labelCol={{style:{ width: labelwidth }}} name={id} className='labelStyle' style={{position:'absolute', top:top, left:left>=0? left:null, right:left<0? -left:null, display:hidden? 'none' : this.state.display}} rules={[{required: this.state.attr.required, message:message }]}>
             <Input.TextArea id={id} key={id} ref={ref => this[id] = ref} style={{width: width, height:height}} 
              readOnly={ editable? !this.state.editable : true } disabled={disabled} value={this.state.value}
              autoSize={{ minRows: this.state.attr.rows, maxRows: this.state.attr.rows }} 
              onChange={this.handleChange.bind(this)}
              { ...this.props } />
          </Form.Item>     
        )
    }else{
        return (
          <Form.Item label={label} labelCol={{style:{ width: labelwidth }}} name={id} className='labelStyle' 
           style={{position:'absolute', top:top, left:left>=0? left:null, right:left<0? -left:null, display:hidden? 'none' : this.state.display}} rules={[{required: this.state.attr.required, message:message }]}>
             <Input id={id} key={id} ref={ref => this.textbox = ref} style={{width: width, height:height}}
              readOnly={ !this.state.editable } disabled={disabled} value={this.state.value}
              //onFocus={(e)=>{document.getElementById(id).select()}} 
              onFocus={(e)=>{e.target.select()}}
              onChange={this.handleChange.bind(this)}          
              { ...this.props } />
          </Form.Item>     
        )        
    }    
  }
}

export class AntHiddenField extends React.Component {  //class的名称必须大写字母开头
  constructor(props) {
    super(props);
    let attr={...this.props};  //this.props不能添加属性e.g.antclass
    attr.antclass = 'textbox';  //不同控件参数解析不同
    //let attr=myParseAntFormItemProps(this.props,'');
    this.state = {
      attr:attr,
      value:attr.value,
      antclass: attr.antclass
    }
  }  
  render() {    
    let { onChange } = this.props;
    let id = this.state.attr.id;
    return (
      <Form.Item label='' labelCol={{style:{ width: 0 }}} name={id} style={{position:'absolute', top:0, left:0, display:'none'}}>
         <Input style={{width: 0, height: 1}} id={id} key={id} ref={ref => this[id] = ref} disabled { ...this.props } />
      </Form.Item>     
    )        
  }
}

export class AntSearchBox extends React.Component {  //class的名称必须大写字母开头
  constructor(props) {
    super(props);
    let p={...this.props};  //this.props不能添加属性e.g.antclass
    p.antclass = 'searchbox';  //不同控件参数解析不同
    let attr=myParseAntFormItemProps(p);
    this.state = {
      attr:attr,
      value:attr.value,
      antclass: attr.antclass,
      labeltext:'',
      editable:attr.editable,
      display:'block',
      options: attr.label.split(';').map((item,index)=><Select.Option onChange={(value)=>{this.setState({labeltext:value})}} key={item} label={index} value={item} />)
    }
  }  

  handleChange=(e)=>{
    this.setState({value: e.target.value});
  }

  render() {
    const selectBefore = (
      <Select defaultValue={this.state.options[0]}>
        {this.state.options}
      </Select>
    );
    let { onChange, onSearch, rules }= this.props;
    let { id, label, labelwidth, top, left, height, width, value, style, hidden, disabled, editable, addon, multiline, message } = this.state.attr;
    return (
      <Form.Item label='' labelCol={0} name={id} colon={false} className='labelStyle' style={{position:'absolute', top:top, left:left>=0? left:null, right:left<0? -left:null, display:hidden? 'none' : this.state.display}} rules={[{required: this.state.attr.required, message:message }]}>
         <Input.Search style={{width: width+labelwidth, height:height}} id={id} key={id} ref={ref => this[id] = ref} 
          value={this.state.value}
          readOnly={editable? !this.state.editable : true} disabled={disabled} addonBefore={selectBefore}
          //onFocus={()=>{document.getElementById(id).select()}} 
          onFocus={(e)=>{e.target.select()}}          
          onChange={this.handleChange.bind(this)}
          { ...this.props } />
      </Form.Item>     
    )
  }
}

export class AntNumberBox extends React.Component {  //class的名称必须大写字母开头
  constructor(props) {
    super(props);
    let p={...this.props};  //this.props不能添加属性e.g.antclass
    p.antclass = 'numberbox';  //不同控件参数解析不同
    //let attr=myParseAntFormItemProps(this.props,'');
    let attr=myParseAntFormItemProps(p);
    this.state = {
      attr:attr,
      value:attr.value,
      antclass: attr.antclass,
      editable:attr.editable,
      display:'block'
    }
  }  

  handleChange=(value)=>{
    //console.log(444,value);
    this.setState({value});
  }

  render() {
    let { onChange, onSearch, rules }= this.props;
    let { id, label, labelwidth, top, left, height, width, value, style, hidden, disabled, editable, addon, multiline, message } = this.state.attr;
    return (
      <ConfigProvider locale={locale}>
      <Form.Item label={label} labelCol={{style:{ width: labelwidth }}} name={id} className='labelStyle' style={{position:'absolute', top:top, left:left>=0? left:null, right:left<0? -left:null, display:hidden? 'none' : this.state.display}} rules={[{required: this.state.attr.required, message:message }]}>
         <InputNumber className='numberboxStyle' style={{width: width, height:height, textAlign:'right'}} id={id} key={id} ref={ref => this[id] = ref} 
          readOnly={ editable? !this.state.editable : true } disabled={disabled} value={this.state.value}
          //onFocus={()=>{document.getElementById(id).select()}} 
          onFocus={(e)=>{e.target.select()}}
          onChange={this.handleChange.bind(this)}          
          { ...this.props } />
      </Form.Item>  
      </ConfigProvider>  
    ) 
  }
}

export class AntRadio extends React.Component {  
  //<AntRadio params='gender,性别,82,0,14,0,10,,男;女' top={16+rowheight*3} />
  constructor(props) {
    super(props);
    let p={...this.props};  //this.props不能添加属性e.g.antclass
    p.antclass = 'radio';  //不同控件参数解析不同
    let attr=myParseAntFormItemProps(p);
    if (attr.buttontype!='button') attr.buttontype='default';
    attr.options=attr.data;    
    for (let i=0; i<attr.data.length; i++){    
      attr.data[i]=<Radio key={attr.id+'_'+i} style={{marginLeft: i>0? attr.width:0}} value={attr.data[i][attr.id]}>{attr.data[i].label}</Radio>
    }
    this.state = {
      attr: attr,
      value: attr.value,
      antclass: attr.antclass,
      editable: attr.editable,
      display: 'block'
    }
  }  
  //radio
  render() {
    let { onChange, rules }= this.props;
    let { id, label, labelwidth, top, left, height, width, value, style, hidden, editable, data, textfield, message, buttontype } = this.state.attr;
    return (
      <Form.Item label={label} name={id} labelCol={{style:{ width: labelwidth }}} className='labelStyle' style={{position:'absolute', top:top, left:left>=0? left:null, right:left<0? -left:null, display:hidden? 'none' : this.state.display}} rules={[{required: this.state.attr.required, message:message }]}>
        <Radio.Group id={id} key={id} ref={ref => this[id] = ref} fieldNames={{value: id, label:textfield}} optionType={buttontype}
         buttonStyle="solid" style={{marginLeft:0}} { ...this.props } >
          {data}
        </Radio.Group>
      </Form.Item>     
     )
   }
}

export class AntCheckBox extends Component {  
  //<AntCheckBox params='hobby,个人兴趣,82,0,14,0,16,,下棋;钓鱼;唱歌;书法;弹琴;编程' top={16+rowheight*7} count={3} />
  constructor(props) {
    super(props);
    let p={...this.props};  //this.props不能添加属性e.g.antclass
    p.antclass = 'checkbox';  //不同控件参数解析不同
    let attr=myParseAntFormItemProps(p);    
    if (attr.maxcheckedcount === undefined || isNaN(attr.maxcheckedcount)) attr.maxcheckedcount=0;
    else attr.maxcheckedcount=parseInt(attr.maxcheckedcount);
    if (attr.maxCheckedCount!==undefined && !isNaN(attr.maxCheckedCount)) attr.maxcheckedcount=parseInt(attr.maxCheckedCount);
    this.state = {
      attr: attr,
      value: [],
      antclass: attr.antclass,
      display: 'block'
    }
  }  
  
  handleChange = (values) => {
    this.setState({value: values});    
  }

  //checkbox.group 之后加上<row><col>可以分行显示选项
  SetCheckbox = () => {
    let { id, width, data, maxcheckedcount } = this.state.attr;
    let htmlstr;
    if (maxcheckedcount==0){  //不限制个数
      htmlstr=<Checkbox.Group id={id} ref={ref => this.checkbox = ref} options={data} { ...this.props } />
    }else{ //多个checkbox，限制个数
      let str=data.map((item, index) => {
        return (<Checkbox id={id+index} key={id+index} disabled={this.state.value.length>=maxcheckedcount && !this.state.value.includes(item.value)}
        ref={ref => this[id+index] = ref} value={item.value} style={{ marginLeft:index>0? width : 0 }}>{item.label}</Checkbox>)
      })
      let label=<label className='labelStyle'>（限{maxcheckedcount}项）</label>
      htmlstr=<Checkbox.Group id={id} ref={ref => this.checkbox = ref} onChange={(values)=>this.handleChange(values)} { ...this.props }>{str}{label}</Checkbox.Group>
    }   
    return htmlstr;
  }

  render() {
    let { onChange, rules }= this.props;
    let { id, label, labelwidth, top, left, height, width, value, style, hidden, editable, data, textfield, message, buttontype } = this.state.attr;
    return (      
      <Form.Item label={label} name={id} labelCol={{style:{ width: labelwidth }}} className='labelStyle' style={{position:'absolute', top:top, left:left>=0? left:null, right:left<0? -left:null, display:hidden? 'none' : this.state.display}} rules={[{required: this.state.attr.required, message:message }]}>
        {this.SetCheckbox()} 
      </Form.Item>     
     )
   }
}

export const AntCheckBoxx = (props)=> {
   const { parent } = props;
   let p={...props};  //this.props不能添加属性e.g.antclass
   p.antclass = 'checkbox';  //不同控件参数解析不同
   let attr=myParseAntFormItemProps(p);
   if (attr.count === undefined) attr.count = 0;
   const state = {
     attr: attr,
     value: attr.value,
     antclass: attr.antclass,
     editable: attr.editable,     
     display: 'block'
   }
   const checkbox1=React.createRef();   

   const handleChange = (values) => {     
    //console.log(668,state.attr.parent);

     return;
   }

   let { id, label, labelwidth, top, left, height, width, value, style, hidden, editable, data, textfield, message, buttontype } = state.attr;
   return (
     <Form.Item label={label} name={id} labelCol={{style:{ width: labelwidth }}} className='labelStyle' style={{position:'absolute', top:top, left:left>=0? left:null, right:left<0? -left:null, display:hidden? 'none' : state.display}} rules={[{required: state.attr.required, message:message }]}>
       <Checkbox.Group id={id} key={id} value={state.value}
       options={data} { ...props } onChange={(values)=>handleChange(values)} />
     </Form.Item>     
    )
}

export class AntDateBox extends React.Component {  //class的名称必须大写字母开头
  constructor(props) {
    super(props);
    let p={...this.props};  //this.props不能添加属性e.g.antclass
    p.antclass = 'datebox';  //不同控件参数解析不同
    let attr=myParseAntFormItemProps(p);
    if (attr.value=='') attr.value= myDatetoStr(new Date());
    //dayjs('2000-01-01', sys.dateformat);
    this.state = {
      attr: attr,
      value: attr.value,
      antclass: attr.antclass,
      editable: attr.editable,
      display: 'block'
    }
  }  

  handleChange = (value)=>{
    //console.log(991,value);
    this.setState({value: value});
    //if (value == null) value = myDatetoStr(new Date());    
    //this.setState({value: value});
  }

  render() {
    let { onChange, rules }= this.props;
    let { id, label, labelwidth, top, left, height, width, value, style, hidden, editable, dateformat, message } = this.state.attr;
    return (
      <ConfigProvider locale={locale}>
      <Form.Item label={label} name={id} labelCol={{style:{ width: labelwidth }}} className='labelStyle' mode='date' style={{position:'absolute', top:top, left:left>=0? left:null, right:left<0? -left:null, display:hidden? 'none' : this.state.display}} rules={[{required: this.state.attr.required, message:message }]}>
         <DatePicker id={id} key={id} style={{width:width, height:height}} format={sys.dateformat} value={this.state.value} antclass="datebox"
          onChange={(value) => {this.setState({ value: value }); onChange?.(value)}}
         //onChange={this.handleChange.bind(this)}
        />
      </Form.Item>
      </ConfigProvider>
     )
   }
}

export class AntComboBox extends React.Component {  //
  // <AntComboBox params='deptname,所属院系,82,0,14,0,260,,信息管理与信息系统;大数据管理与应用;工商管理;计算机科学与技术;会计学' top={16+rowheight*5} ref={ref=>this.deptname=ref}/>
  //供应商编码区分大小写
  constructor(props) {
    super(props);
    let p={...this.props};  //this.props不能添加属性e.g.antclass
    p.antclass = 'combobox';  //不同控件参数解析不同
    let attr=myParseAntFormItemProps(p);
    //if (attr.buttontype!='button') attr.buttontype='default';
    this.state = {
      attr: attr,
      value: attr.value,
      row: {},
      antclass: attr.antclass,
      editable: attr.editable,
      display: 'block'
    }
  }  

  async componentDidMount(){
    let { sqlprocedure } = this.state.attr;
    if (sqlprocedure!=undefined && sqlprocedure!=''){
      let p={...this.state.attr}
      let rs=await reqdoSQL(p);
      let attr={...this.state.attr};
      attr.data=rs.rows;
      //console.log(3777,rs.rows);
      this.setState({attr});
    }
  }

  xhandleChange=(e)=>{
    this.setState({value: e.target.value});
  }

  render() {
    let { onChange, rules }= this.props;
    let { id, label, labelwidth, top, left, height, width, value, style, hidden, textfield, editable, data, message, buttontype } = this.state.attr;
    //console.log(1777,id,textfield,data)
    return (
      <Form.Item label={label} name={id} labelCol={{style:{ width: labelwidth }}} className='labelStyle' style={{position:'absolute', top:top, left:left>=0? left:null, right:left<0? -left:null, display:hidden? 'none' : this.state.display}} rules={[{required: this.state.attr.required, message:message }]}>
         <Select id={id} key={id} style={{width:width}} ref={ref => this[id] = ref} fieldNames={{value: id, label:textfield}} options={data} 
          onChange={(value,row) => {this.setState({ value: value, row:row }); onChange?.(value, row)}}
          { ...this.props } />
      </Form.Item>     
     )
   }
}

export class AntComboTree extends React.Component {  //
  //<AntComboTree params='subcategoryid,类别编码,82,0,14,0,300,cascader,,categoryname' top={16+rowheight*5} ref={ref=>this.subcategoryid=ref} sqlprocedure='demo505a' treestyle='full' onChange={this.handleCategoryChange.bind(this)} /> 
  constructor(props) {
    super(props);
    let p={...this.props};  //this.props不能添加属性e.g.antclass
    p.antclass = 'combotree';  //不同控件参数解析不同
    let attr=myParseAntFormItemProps(p);
    //if (attr.buttontype!='button') attr.buttontype='default';
    this.state = {
      attr: attr,
      value: attr.value,
      antclass: attr.antclass,
      editable: attr.editable,
      data: [],
      selectedKeys: [],
      display: 'block'
    }
  }  
  
  async componentDidMount(){
    let { sqlprocedure, treestyle, options } = this.state.attr;
    if (options==undefined && sqlprocedure!=undefined && sqlprocedure!=''){
      let p={...this.state.attr}
      p.parentnodeid='';
      p.style=treestyle;
      let rs=await reqdoTree(p);
      //console.log(11111,rs.rows);
      let attr={...this.state.attr};
      attr.data=rs.rows;
      this.setState({attr});
    }
  }

  loadData = async (node) => {
    //节点展开时加载数据时触发
    let data =[...this.state.data];
    if (node && node.children && node.children.length==1 && node.children[0].text.trim()==''){        
      let p = {};
      p.style = "expand";
      p.parentnodeid = node.id;
      p.sqlprocedure = this.state.attr.sqlprocedure;
      let rs = await reqdoTree(p);
      //必须设置叶子节点的isLeaf属性为true
      let rows=rs.rows;
      //console.log(991,rows);
      rows.forEach((item)=>{
        if (item.isparentflag==0) item.isLeaf=true;
      })
      //替换原数组data中的children值
      data = addTreeChildrenData(data, node, rows); //将rs.rows数据添加为node的子节点
      this.setState({data: data}, () => {
         setTimeout(()=>{
           //this.myTree1.setState({selectedKeys: [node.id]});
         })
      });
    }
    return data;      
  }

  handleDoubleClick=(e, node)=>{
    //双节结点时选中这个结点，注意需要使用数组
    if (!node) return;
    this.myTree1.setState({selectedKeys: [node.id]});
  }

  render() {
    let { onChange, rules }= this.props;
    let { id, label, labelwidth, top, left, height, width, value, style, hidden, textfield, editable, data, message, buttontype,panelheight } = this.state.attr;
    //console.log(888,data);
    let htmlstr;
    htmlstr=<TreeSelect id={id} key={id} ref={ref => this[id] = ref} treeIcon treeLine style={{ width: width }} 
      dropdownStyle={{maxHeight: panelheight, overflow: 'auto'}} fieldNames={{value: id, label:textfield}} 
      onDoubleClick={this.handleDoubleClick.bind(this)} treeData={data}
      loadData = {this.loadData.bind(this)}  
      onChange={(value, row) => {this.setState({ value, row }); onChange?.(value, row)}}
      { ...this.props } />
    return (
      <Form.Item label={label} name={id} labelCol={{style:{ width: labelwidth }}} className='labelStyle' style={{position:'absolute', top:top, left:left>=0? left:null, right:left<0? -left:null, display:hidden? 'none' : this.state.display}} rules={[{required: this.state.attr.required, message:message }]}>
        {htmlstr}
      </Form.Item>     
     )
   }
}

export class AntCascader extends React.Component {  //
  //<AntComboTree params='subcategoryid,类别编码,82,0,14,0,300,cascader,,categoryname' top={16+rowheight*5} ref={ref=>this.subcategoryid=ref} sqlprocedure='demo505a' treestyle='full' onChange={this.handleCategoryChange.bind(this)} /> 
  constructor(props) {
    super(props);
    let p={...this.props};  //this.props不能添加属性e.g.antclass
    p.antclass = 'cascader';  //不同控件参数解析不同
    let attr=myParseAntFormItemProps(p);
    //if (attr.buttontype!='button') attr.buttontype='default';
    this.state = {
      attr: attr,
      value: attr.value,
      antclass: attr.antclass,
      data: [],
      selectedKeys: [],
      display: 'block'
    }
  }  
  
  async componentDidMount(){
    let { sqlprocedure, treestyle, options } = this.state.attr;
    if (options==undefined && sqlprocedure!=undefined && sqlprocedure!=''){
      let p={...this.state.attr}
      p.parentnodeid='';
      p.style=treestyle;
      let rs=await reqdoTree(p);
      //console.log(11111,rs.rows);
      //console.log(11112,rs.nodes);
      let attr={...this.state.attr};
      attr.data=rs.rows;
      attr.nodes=rs.nodes;
      this.setState({attr});
    }
  }

  render() {
    let { onChange, rules }= this.props;
    let { id, label, labelwidth, top, left, height, width, value, style, hidden, textfield, editable, data, message, buttontype, panelheight } = this.state.attr;
    //console.log(888,data);
    let htmlstr;
    htmlstr=<Cascader id={id} key={id} ref={ref => this[id] = ref} fieldNames={{value: id, label:textfield}} 
    options={data} style={{width:width}}      
    onChange={(value, row) => {this.setState({ value, row }); onChange?.(value, row)}}
    { ...this.props }/>
    return (
      <Form.Item label={label} name={id} labelCol={{style:{ width: labelwidth }}} className='labelStyle' style={{position:'absolute', top:top, left:left>=0? left:null, right:left<0? -left:null, display:hidden? 'none' : this.state.display}} rules={[{required: this.state.attr.required, message:message }]}>
        {htmlstr}
      </Form.Item>     
     )
   }
}

export class AntLabel extends React.Component {  //class的名称必须大写字母开头
  constructor(props) {
    super(props);
    let p={...this.props};  //this.props不能添加属性e.g.antclass
    p.antclass = 'label';  //不同控件参数解析不同
    let attr=myParseAntFormItemProps(p);
    if (attr.height==0) attr.height=sys.fontSize;
    this.state = {
      attr: attr,
      antclass: attr.antclass,
      display: 'block'
    }
  }
  render() {
    //<Header style={{height:30,lineHeight:'30px', paddingLeft:12, borderBottom:'1px solid #95B8E7', background:'#E0ECFF', fontSize:14}}>    <WindowsOutlined />    <label style={{marginLeft:8}} className='headerStyle'>学生详细信息</label>    </Header>   
    let { id, label, labelwidth, top, left, height, width, style, hidden, icon } = this.state.attr;
    return (
      <Form.Item label={label} name={id} key={id} labelCol={{style:{ width: labelwidth }}} className='labelStyle' colon={false} 
       style={{fontSize:height, position:'absolute', top:top, left:left>=0? left:null, right:left<0? -left:null, display:hidden? 'none' : this.state.display}} />
    )
   }
}

export class AntImage extends React.Component {  //class的名称必须大写字母开头
  //规定文件名称的属性名为filename，或者由fieldnames指定
  constructor(props) {
    super(props);
    this.refs = {};
    let p={...this.props};  //this.props不能添加属性e.g.antclass
    p.antclass = 'image';  //不同控件参数解析不同
    let attr=myParseAntFormItemProps(p);
    if (attr.height==0) attr.height=sys.fontSize;
    if (attr.fieldNames?.url) attr.urlfield=attr.fieldNames.url;
    if (attr.urlfield===undefined || attr.urlfield && attr.urlfield=='') attr.urlfield='url';   
    this.state = {
      attr: attr,
      src: attr.src,
      value: attr.src,
      datatype: attr.datatype,
      antclass: attr.antclass,
      display: 'block'
    }
  } 
  render() {
    let { id, label, labelwidth, top, left, height, width, style, urlfield, hidden, form, datatype, maxCount } = this.state.attr;
    let src = this.state.src;  //不是从state.attr中提取
    let value = this.state.value;  //不是从state.attr中提取
    let html=[];
    //console.log(114, this.state.attr);
    console.log(115,src, datatype);
    if (datatype == 'json'){
      src=myStr2JsonArray(src);
    }
    console.log(116,src, datatype);
    if (src && typeof src === 'object'){
      if (maxCount<=0) maxCount=src.length;    
      //console.log(116,src, maxCount,urlfield,src[0][urlfield]);       
      for (let i=0; i<maxCount; i++){  //多个图片文件,json格式中使用filename属性指定图片文件
        if (src[i][urlfield]!=undefined){
          //let url=sys.serverpath+'/'+src[i].filename+'?time='+myLocalTime('').timestamp;
          let url=sys.serverpath+'/'+src[i][urlfield]+'?time='+myLocalTime('').timestamp;
          //console.log(1117,url,id)
          let key=id+'_'+i;
          html.push(<Image key={key} style={{marginRight:10}} width={width>0? width:null} height={height>0? height:null} src={url} placeholder={<Image width={width>0? width:null} height={height>0? height:null} preview={false} src={url+"?x-oss-process=image/blur,r_50,s_50/quality,q_1/resize,m_mfit,h_200,w_200"}/>} />)
        }
      }       
    }else{ //一个图片
      if (src!=undefined) {
        let url=sys.serverpath+'/'+src+'?time='+myLocalTime('').timestamp;
        //console.log(1118,url,id)
        html.push(<Image key={id} ref={ref => this.image = ref} width={width>0? width:null} height={height>0? height:null} src={url} placeholder={<Image width={width>0? width:null} height={height>0? height:null} preview={false} src={url+"?x-oss-process=image/blur,r_50,s_50/quality,q_1/resize,m_mfit,h_200,w_200"}/>} />)
      }
    }
    //console.log(1119, html);
    if (form){
      return (
        <Form.Item label={label} name={id} labelCol={{style:{ width: labelwidth }}} className='labelStyle' style={{position:'absolute', top:top, left:left>=0? left:null, right:left<0? -left:null, display:hidden? 'none' : this.state.display}} >
          <>{html}</>
        </Form.Item>
      )
    }else{  //无表单
      return (
        <div style={{position:(top>=0 && left>=0)? 'absolute':'relative', top:top, left:left>=0? left:null, right:left<0? -left:null, display:hidden? 'none' : this.state.display}} >
          {html}
        </div>
      )
    }
   }
}

export class AntImageUpload extends React.Component {  //class的名称必须大写字母开头
  constructor(props) {
    super(props);
    let p={...this.props};  //this.props不能添加属性e.g.antclass
    p.antclass = 'imageupload';  //不同控件参数解析不同
    //p.datatype='json';  //多个图片时
    let attr=myParseAntFormItemProps(p);
    if (attr.fieldNames?.url) attr.urlfield=attr.fieldNames.url;
    if (attr.urlfield===undefined || attr.urlfield && attr.urlfield=='') attr.urlfield='url';   
    if (attr.timeStamp == undefined) attr.timeStamp=false;
    if (attr.tag == undefined) attr.tag='';  //文件上传文件名标识
    this.state = {
      attr: attr,
      src: attr.src,
      filelist: [],
      formvalues: {},  //保存表单中其他控件的值
      deletedfiles: [],   //删除的文件
      uploadedfiles: [],   //新上传的文件
      datatype: attr.datatype,
      antclass: attr.antclass,
      flag: false,
      display: 'none'
    }
  }

  handleChange = async (e) => {
    //console.log(999,e);
    let file = e.file;
    if (!file) return;
    let filelist = [...this.state.filelist]   
    let deletedfiles = [...this.state.deletedfiles];
    let uploadedfiles = [...this.state.uploadedfiles];    
    let fileno='';
    if (file.status!=='removed') { 
      let formData = new FormData(); 
      console.log(888,this.state.attr.tag)
      let targetfile='';
      fileno=(filelist.length>0? '_'+(filelist.length) : '');
      if (this.state.attr.tag!==undefined){
        targetfile=this.state.attr.tag+fileno; 
        if (this.state.attr.timeStamp) targetfile+='_'+myLocalTime('').timestamp;
      }else{
        targetfile='tmp_'+myLocalTime('').timestamp;
      }
      let targetpath=this.state.attr.targetpath;
      //console.log(9922,e.file,targetpath,targetfile);
      formData.append("targetpath", targetpath);  //文件路径
      formData.append("targetfile", targetfile);  //目标文件名，与时间戳有关       
      formData.append("file", file.originFileObj);  //上传第一个文件
      const config = { headers: {"Content-Type": "multipart/form-data"} }
      await axios.post("/myServer/doFileUpload", formData, config).then(res => {
        //服务器端返回文件名称，实际文件名。如果文件名为空表示文件上传失败
        let json=res.data;
        file.targetfile=targetfile;
        //服务器端返回的内容
        file.filename=json.filename;
        file.url=sys.serverpath+'/'+json.filename;
        file.realfilename=json.realfilename;
        file.uid=this.state.attr.id+'_'+filelist.length+'_'+myLocalTime('').timestamp;
        file.status='done'
        file.fileno=fileno;
        file.fileext=json.fileext;
        filelist.push(file);
        uploadedfiles.push(file);
      })
    }else{
      //console.log(771,deletedfiles,e.file.filename);
      deletedfiles.push({filename:e.file.filename})
      filelist=e.fileList;
    }
    //console.log(771,filelist);
    //console.log(1777,uploadedfiles);
    this.setState({filelist: filelist, deletedfiles, uploadedfiles});
     //if (n==0) notification.success({message:'系统通知', description: '共'+files.length+'个文件上传成功!', duration:2});
     //else if (n<files.length) notification.warning({message:'系统通知', description: '共'+files.length+'个文件上传成功，'+n+'个文件上传失败！', duration:2});
     //else notification.error({message:'系统通知', description: '共'+n+'个文件上传失败!', duration:2});
     //this.setState({uploading: false});       
  }

  handlePreview = async (file)=>{
    console.log(file);
    let src = file.url;
    this.setState({src:src, myWin1:true, flag:true})
    /*
    this[this.state.attr.id].setPreviewImage(file.url || (file.preview));
    this[this.state.attr.id].setPreviewOpen(true);
    this[this.state.attr.id].setPreviewTitle(file.name);
    */
  }; 
  render() {
    let { id, label, labelwidth, top, left, height, width, style, hidden, maxCount, filetag } = this.state.attr;
    let filelist = this.state.filelist;  //不是从state.attr中提取
    //console.log(5551, filelist);
    //console.log(5552, this.state.formvalues);
    //console.log(5553, this.state.deletedfiles);
    //destroyOnClose使用modal的这个属性，可以每次打开时生成组件
    this.state.attr.tag='';
    if (filetag!=''){
      let sys=this.state.formvalues;
      this.state.attr.tag=eval(filetag);
      //console.log(5554, filetag, this.state.attr.tag);
    }    
    return (<>
      <Form.Item label={label} name={id} labelCol={{style:{ width: labelwidth }}}  
       style={{width:width, position:'absolute', top:top, left:left>=0? left:null, right:left<0? -left:null }} >
         <Upload key={id} listType="picture-card" fileList={filelist} ref={ref => this.imageupload = ref} 
          //className={styles.imageuploadx}
          onPreview={this.handlePreview.bind(this)}
          onChange={this.handleChange.bind(this)}  >
          {maxCount<0 || filelist.length < maxCount && '+ 上传'}
         </Upload>
      </Form.Item>
      <Form.Item>
        <Image src={this.state.src} style={{ width: '100%', display:this.state.display}} 
         preview={{ visible:this.state.flag, src:this.state.src, onVisibleChange: (value) => {this.setState({flag: value})}
        }} />
      </Form.Item>
    </>)
   }
}
