import ajax from './ajax'
import React, { Component } from 'react';
import { useEffect, useRef, useImperativeHandle } from 'react';
import axios from "axios";
import { Resizable } from 'react-resizable';
//import sys from './common.js'
import { Modal, Upload, notification, Form, Input, Select, InputNumber, Checkbox, Radio, DatePicker, Image, Button, ConfigProvider, Cascader, TreeSelect, Divider, QRCode, Rate } from 'antd'
import { WindowsOutlined, FormOutlined, PlusCircleOutlined, EditOutlined, DeleteOutlined, SaveOutlined, PrinterOutlined } from '@ant-design/icons';
import { scrollTreeNode, searchTreeNode, toTreeData, findTreeNode, myParseAntFormItemProps, myParseTableColumns, myParseTags, myDoFiles, myLocalTime, searchNodeInRows, addTreeChildrenData, reqdoTree, reqdoSQL, myStr2JsonArray, myStr2Json, myDatetoStr } from './functions.js'
import { MyFormComponent } from './antdFormClass.js'
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import locale from 'antd/locale/zh_CN';
import { BlockOutlined, DownOutlined, UpOutlined, FileOutlined, TagOutlined, PaperClipOutlined } from '@ant-design/icons';
import { Tree, Layout, Menu } from 'antd';
const { Header, Content, Footer, Sider } = Layout;
const sys = { ...React.sys };

const parseParams = (props) => {  //解析属性
  let attr = { ...props }
  let { id, type, antclass, label, labelwidth, top, left, height, width, value, visible, maxcount, count, spacing, labelfield, valuefield, textfield, precision } = attr;
  if (!height || isNaN(height) || height == 0) height = -1;
  if (!width || isNaN(width) || width == 0) width = -1;
  //labelwidth大写会提示警告
  if (labelwidth && !isNaN(labelwidth) && labelwidth > 0 && (!labelwidth || isNaN(labelwidth))) labelwidth = labelwidth;
  if (!labelwidth || isNaN(labelwidth) || labelwidth == 0) labelwidth = 80;  //labelwidth labelwidth
  if (!spacing || isNaN(spacing)) spacing = 8;  //列间距、行间距
  if (!count) count = -1;
  if (!value) value = '';
  width = parseInt(width);
  height = parseInt(height);
  labelwidth = parseInt(labelwidth);
  spacing = parseInt(spacing);
  if (top) top = parseInt(top);
  if (left) left = parseInt(left);
  count = parseInt(count);
  if (precision && !isNaN(precision)) precision = parseInt(precision);
  //visible部署原生属性，用变量
  if (visible !== undefined && !visible) visible = false;
  if (!labelfield && textfield) labelfield = textfield;
  if (labelfield == undefined || labelfield == '') labelfield = 'label';
  if (valuefield == undefined || valuefield == '') valuefield = 'value';
  textfield = labelfield;
  if (type === undefined) type = antclass;
  if (attr.onSearch) type = 'search';
  if (!type || type == '') type = 'text';
  if (type === 'datebox') type = 'date';
  else if (type === 'numberbox') type = 'number';
  else if (type === 'textbox') type = 'text';
  antclass = type;
  //赋值到attr
  attr = { ...attr, type, antclass, label, labelwidth, labelwidth, top, left, height, width, value, spacing, visible, labelfield, textfield, valuefield, precision }
  //处理showcount，大小写等同。
  if (attr.showcount && !attr.showCount) attr.showCount = attr.showcount;
  //处理resize，resize没有定义或定义为false时
  if (!attr.resize) attr.resize = 'none'; //默认不能改变大小
  if (attr.resize !== 'none') attr.resize = null;
  if (attr.readOnly === undefined && attr.readonly) attr.readOnly = attr.readonly;
  if (attr.readOnly === undefined || !attr.readOnly) attr.readOnly = false;
  else attr.readOnly = true;
  if (attr.disabled === undefined || !attr.disabled) attr.disabled = false;
  else attr.disabled = true;
  //visible部署原生属性，用变量
  attr.visible = 1;
  if (attr.visible !== undefined && !attr.visible) visible = 0;
  //绝对位置与相对位置定位
  attr.position = 'absolute';
  if (top !== undefined && !isNaN(top) && left !== undefined && !isNaN(left)) attr.position = 'absolute';
  else attr.position = 'relative';
  if (attr.position === 'absolute') attr.style = { position: 'absolute', top: attr.top, left: attr.left }
  else attr.style = {};
  if (height != undefined && !isNaN(height) && height > 0) attr.style.height = attr.height;
  //存储过程
  if (attr.sqlprocedure === undefined) attr.sqlprocedure = '';
  if (attr.sqlparams === undefined) attr.sqlparams = null;
  //console.log(2,attr.id,attr)
  return attr;
}

const parseData = (attr) => {
  if (attr.options != undefined && typeof attr.options === 'object') attr.data = attr.options;  //本身是json格式化数据
  if (attr.items != '' && typeof attr.items === 'string') {
    attr.data = attr.items.split(';').map((item, index) => {  //字符串,checkbox只能使用label,value？不能设置fieldNames
      let row = {};
      row[attr.id] = item;
      row[attr.labelfield] = item;
      row[attr.valuefield] = item;
      if (attr.labelfield != 'label') row.label = item;
      if (attr.valuefield != 'value') row.value = item;
      row.key = item + index;
      return (row)
    });
  }
  return attr;
}

const parseSQLParams = (attr) => {
  //解析sql存储过程需要用的参数，如果存在sqlparams属性，则以它为标准；否则从attr、props中提取（去掉json或其他对象变量）存储过程参数
  let { sqlprocedure, sqlparams } = attr;
  let p = null;
  if (sqlprocedure !== undefined && sqlprocedure !== '') {
    if (sqlparams && typeof sqlparams == 'object') {
      p = { ...sqlparams };
      p.sqlprocedure = sqlprocedure;
    } else {
      p = {};
      for (let key in attr) {
        if (typeof attr[key] !== 'object') p[key] = attr[key];   //必须去掉object，否则死循环
      }
    }
  }
  return p;
}

/*
const loadData = async (sqlprocedure, sqlparams) => {
    if (!sqlprocedure) return [];
    let p={...sqlparams};
    p.sqlprocedure = sqlprocedure;
    console.log(99,p);
    let rs = await reqdoSQL(p); //调用函数，执行存储过程
    console.log(999,rs.rows);
    return rs.rows;
}
*/

export class AntdInputBox extends React.Component {
  constructor(props) { //构造函数  子组件，被调用，参数属性传过来
    super(props);
    let attr = parseParams(props);
    //console.log(555, attr)    
    if (attr.width < 0) attr.width = 200;
    this.state = {
      attr: attr,  //attr.id  attr.value
      id: attr.id,
      value: attr.value,
      antclass: attr.antclass,
      readOnly: attr.readOnly,
      disabled: attr.disabled,
      visible: attr.visible > 0 ? true : false,
    }
  }
  hideArrow = () => {
    return null; // 返回 null 来隐藏 spinner 箭头
  };

  InputItem = ($this) => {
    let { id, type, height, width, label, top, left, labelwidth, showCount, resize, onChange, onSearch, style, position } = $this.state.attr;
    let { value, readOnly, disabled, editable, visible } = $this.state;
    if (type === 'search' || type === 'searchbox') {
      return (
        <Input.Search  {...this.state.attr} id={id} style={{ width: width }} ref={ref => this.myInput = ref}
          onFocus={(e) => { e.target.select() }} 
          value={this.state.value} readOnly={readOnly} disabled={disabled}
          onSearch={(e) => onSearch?.(e)}
          onChange={(e) => { this.setState({ value: e.target.value }); onChange?.(e) }}
          enterButton={this.state.attr.enterButton} size="medium" />
      )
    } else if (type === 'text' || type === 'textbox') {
      return (
        <Input {...this.state.attr} id={id} ref={ref => this.myInput = ref}
          onFocus={(e) => { e.target.select() }} readOnly={readOnly} disabled={disabled}
          onChange={(e) => { this.setState({ value: e.target.value }); onChange?.(e) }}
          style={{ width: width }} />
      )
    } else if (type === 'date' || type === 'datebox') {
      return (
        <DatePicker {...this.state.attr} id={id} ref={ref => this.myInput = ref}
          onFocus={(e) => { e.target.select() }} disabled={readOnly}
          onChange={(value) => { this.setState({ value: value || new Date() }); onChange?.(value) }}
          format={sys.format} style={{ width: width }} />
      )
    } else if (type === 'number' || type === 'numberbox') {
      return (
        <InputNumber {...this.state.attr} id={id} ref={ref => this.myInput = ref} keyboard
          className='numberboxStyle' value={this.state.value}
          //formatter={this.hideArrow} parser={this.hideArrow}  //没有效果
          onFocus={(e) => { e.target.select() }} readOnly={readOnly} disabled={disabled}
          onChange={(value) => { this.setState({ value: value }); onChange?.(value) }}
          style={{ width: width }} />

      )
    } else if (type === 'textarea') {
      if (showCount === undefined) showCount = true;  //默认显示字数
      if (showCount) height -= 24;
      return (
        <Input.TextArea {...this.state.attr} id={id} ref={ref => this.myInput = ref}
          onFocus={(e) => { e.target.select() }} readOnly={readOnly} disabled={disabled}
          //autoSize={{ minRows: 4, maxRows: 4 }} 
          onChange={(e) => { this.setState({ value: e.target.value }); onChange?.(e) }}
          showCount={showCount} style={{ resize: resize, height: height, width: width, marginBottom: 24 }} />
      )
    }
  }
  render() {
    let { form, id, type, height, width, label, top, left, labelwidth, showCount, resize, onChange, onSearch, style, position } = this.state.attr;
    let { readOnly, disabled, value, visible } = this.state;
    let { rules } = this.props;
    if (!value || isNaN(value) || value === '') value = '0';
    //console.log(id, visible);
    /*
    return (<div>
        {type === 'search' && 
           <Form.Item label={label} name={id} className='labelStyle' labelCol={{ style: { width: labelwidth } }} style={style} >
              <Input.Search  {...this.state.attr} id={id} style={{ width: width }} ref={ref => this.myInput = ref} enterButton={this.state.attr.enterButton} size="medium" onSearch={(e) => onSearch?.(e)} onChange={(e) => onChange?.(e)} />
           </Form.Item>
        }
        {type === 'text' &&
            <Form.Item label={label} {...this.attr} name={id} className='labelStyle' labelCol={{ style: { width: labelwidth } }}  style={style} >
              <Input {...this.state.attr} id={id} style={{ width: width }} ref={ref => this.myInput = ref} onChange={(e) => onChange?.(e)} />
            </Form.Item>
        }
        {type === 'date' &&
            <Form.Item label={label} {...this.attr} name={id} className='labelStyle' labelCol={{ style: { width: labelwidth } }}  style={style} >
              <DatePicker  {...this.state.attr} id={id} style={{ width: width }} ref={ref => this.myInput = ref} format={sys.format} onChange={(e) => onChange?.(e)} />
            </Form.Item>
        }
        {type === 'textarea' &&
            <Form.Item label={label} {...this.attr} name={id} className='labelStyle' labelCol={{ style: { width: labelwidth } }}  style={style} >
              <Input.TextArea {...this.state.attr} id={id} style={{ resize:'none', height:height-24, width: width, marginBottom:24 }} ref={ref => this.myInput = ref}                   
               //autoSize={{ minRows: 4, maxRows: 4 }} 
                showCount
               onChange={(e) => onChange?.(e)} />
            </Form.Item>
        }
    </div>)
   */
    return (
      <Form.Item label={label} name={id} rules={rules} className='labelStyle' labelCol={{ style: { width: labelwidth } }} style={{ ...style, display: visible ? 'block' : 'none' }} >
        {this.InputItem(this)}
      </Form.Item>
    )
  }
}

export class AntdCheckBox extends MyFormComponent { //Component {  
  constructor(props) {
    super(props);
    let attr = { ...this.props };  //this.props不能添加属性e.g.antclass
    //console.log(171,attr)
    attr.antclass = 'checkbox';
    attr = parseParams(attr);
    if (attr.buttontype != 'button') attr.buttontype = 'default';
    attr = parseData(attr);
    if (!attr.checkalltext) attr.checkalltext = '全选';
    if (attr.maxcount === undefined || isNaN(attr.maxcount)) attr.maxcount = 0;
    else attr.maxcount = parseInt(attr.maxcount);
    if (attr.checkall !== undefined && attr.checkall === 'true') attr.checkall = true;
    else attr.checkall = false;
    if (attr.checkall) attr.maxcount = 0;  //有全选时不控制选项个数
    //console.log(181, this.props)
    this.state = {
      attr: attr,
      page: attr.page,
      form: attr.form,
      id: attr.id,
      value: [],
      data: attr.data,
      checkall: attr.checkall,
      antclass: attr.antclass,
      visible: attr.visible > 0 ? true : false,
      disabled: attr.disabled,
      readOnly: attr.readOnly,
      checkallflag: 0,
      checkallvalue: [],
    }
  }

  async componentDidMount() {
    /*
    let attr = this.state.attr;
    let {sqlprocedure, sqlparams} = attr;
    if (sqlprocedure !== undefined && sqlprocedure !== ''){      
      let p={};
      if (sqlparams && typeof sqlparams =='object'){
        p={...sqlparams};
        p.sqlprocedure=sqlprocedure;
      }else{
        for (let key in this.state.attr){
          if (typeof this.state.attr[key] !=='object') p[key]=this.state.attr[key]
        }
      }
    */
    let p = parseSQLParams(this.state.attr);
    if (p != null) {
      let rs = await reqdoSQL(p);
      this.setState({ data: rs.rows });
    }
    //this.setState({checkallflag:2, checkallvalue:'1'});
    //console.log(1444, this.props.xform('myForm1'));
  }

  handleChange_checkall = (value) => {  //全选或全不选
    let { page, form, data, id } = this.state;
    let tmp;
    if (value.length > 0) tmp = data.map((item) => item.value) //全选
    else tmp = [];   //全不选
    this.setState({ value: tmp, checkallflag: (tmp.length > 0 ? 1 : 0) }, () => page[form].setFieldValue(id, tmp));
  };

  handleChange_check = (values) => {  //单击单个checkbox
    let { page, form, data, id, checkall } = this.state;
    let flag = 0;
    let checkallvalue = 0;
    if (values.length == this.state.data.length) {
      flag = 1;
      checkallvalue = ['1']
    } else if (values.length > 0) {
      flag = 2;
      checkallvalue = [];
    }
    if (checkall) this.setState({ value: values, checkallflag: flag }, () => page[form].setFieldValue(id + '_checkall', checkallvalue));
    else this.setState({ value: values });
  }
  //checkbox.group 之后加上<row><col>可以分行显示选项
  formItems = () => {
    let { id, label, labelwidth, top, left, height, width, style, maxcount, spacing } = this.state.attr;
    let { value, checkallvalue, visible, data, checkall, readOnly } = this.state;
    //console.log(12345,data);
    if (!data) data = [];
    let html = [];
    //生成多个checkbox
    let options = data.map((item, index) => {
      return (<Checkbox id={id + index} key={id + index} disabled={maxcount > 0 && value.length >= maxcount && !value.includes(item.value)}
        ref={ref => this[id + index] = ref} value={item.value} className={checkall ? 'textdiv' : 'textdiv'} style={{ width: width > 0 ? width : null, marginRight: spacing }}>{item.label}</Checkbox>)
    })
    let hints = '';
    if (maxcount > 0) hints = <label className='labelStyle'>（限{maxcount}项）</label>;
    if (checkall) {
      html.push(<Form.Item label={label} id={id + '_checkall'} key={id + '_checkall'} className={checkall ? 'labelStyle' : 'labelStyle'}
        //valuePropName='checked' 
        labelCol={{ style: { width: labelwidth } }} style={{ ...style, top: top, left: left, display: visible ? 'block' : 'none' }} >
        <Checkbox.Group onChange={this.handleChange_checkall.bind(this)} id={id + '_checkall'} ref={ref => this.checkall = ref} disabled={readOnly} value={checkallvalue}>
          <Checkbox checked={this.state.checkallflag == 1} value="1" indeterminate={this.state.checkallflag == 2}>全选</Checkbox>
        </Checkbox.Group>
      </Form.Item>);
      left += labelwidth + spacing + 60;
      label = '';
      html.push(<Form.Item label={label} name={id} key={id} labelCol={{ style: { width: labelwidth } }}
        className='textdiv' style={{ ...style, top: top, left: left, display: visible ? 'block' : 'none' }} >
        <Checkbox.Group id={id} ref={ref => this.myCheckbox = ref} disabled={readOnly} value={value} onChange={(values) => this.handleChange_check(values)} {...this.props}>
          {options}
          {hints}
        </Checkbox.Group>
      </Form.Item>)
    } else {
      html.push(<Form.Item label={label} id={id + '_label'} key={id + '_label'} labelCol={{ style: { width: labelwidth } }}
        className={checkall ? 'labelStyle' : 'labelStyle'} style={{ ...style, top: top, left: left, display: visible ? 'block' : 'none' }} >
      </Form.Item>)
      html.push(<Form.Item label='' name={id} key={id} labelCol={{ style: { width: labelwidth } }}
        className='textdiv' style={{ ...style, top: top, left: left + labelwidth, display: visible ? 'block' : 'none' }} >
        <Checkbox.Group id={id} ref={ref => this.myCheckbox = ref} {...this.props} disabled={readOnly} value={value} onChange={(values) => this.handleChange_check(values)} {...this.props}>
          {options}
          {hints}
        </Checkbox.Group>
      </Form.Item>)
    }
    //return options;   
    return html;
  }

  render() {
    let { onChange, rules } = this.props;
    let { id, label, labelwidth, top, left, height, width, maxcount, style } = this.state.attr;
    let { visible, value } = this.state;
    return (<>
      {/* <Form.Item label={label} name={id+'_label'}  key={id+'_label'}  labelCol={{style:{ width: labelwidth }}} 
          style={{...style, display:visible? 'block':'none'}} >
          <Checkbox.Group id={id} ref={ref => this.myCheckbox = ref} {...this.props} 
          value={value} 
          onChange={(values)=>this.setState({value:values})} 
          { ...this.props }>
            {this.formItems()}
            {maxcount>0 && <label className='labelStyle'>（限{maxcount}项）</label>}
          </Checkbox.Group>
        </Form.Item>) */}
      {this.formItems()}
    </>)
  }
}

export class AntdRadio extends Component {
  constructor(props) {
    super(props);
    let attr = { ...this.props };  //this.props不能添加属性e.g.antclass
    attr.antclass = 'radio';
    attr = parseParams(attr);
    if (attr.buttontype != 'button') attr.buttontype = 'default';
    attr = parseData(attr);
    //console.log(181, this.props)
    if (attr.optionType == "button") attr.spacing = 0;
    this.state = {
      attr: attr,
      id: attr.id,
      value: [],
      readOnly: attr.readOnly,
      data: attr.data,
      antclass: attr.antclass,
      visible: attr.visible > 0 ? true : false,
    }
  }

  async componentDidMount() {
    let p = parseSQLParams(this.state.attr);
    if (p != null) {
      let rs = await reqdoSQL(p);
      this.setState({ data: rs.rows });
    }
  }

  formItems = () => {
    let { id, label, labelwidth, top, left, height, width, style, spacing, hint } = this.state.attr;
    let { value, visible, data, readOnly } = this.state;
    if (!data) data = [];
    let html = [];
    let options = [];
    for (let i = 0; i < data.length; i++) {
      options[i] = <Radio key={id + '_' + i} style={{ marginRight: spacing }} value={data[i][id]}>{data[i].label}</Radio>
    }
    let hints = '';
    if (hint != '') hints = <label className='labelStyle'>{hint}</label>;
    html.push(<Form.Item label={label} key={id + '_label'} id={id + '_label'} labelCol={{ style: { width: labelwidth } }}
      className='labelStyle' style={{ ...style, top: top, left: left, display: visible ? 'block' : 'none' }} >
    </Form.Item>)
    html.push(<Form.Item label='' key={id} name={id} labelCol={{ style: { width: labelwidth } }} className='textdiv' style={{ ...style, top: top, left: left + labelwidth, display: visible ? 'block' : 'none' }} >
      <Radio.Group id={id} key={id} ref={ref => this[id] = ref} {...this.props} readOnly={readOnly} buttonStyle="solid" style={{ marginLeft: 0 }} >
        {options}
        {hints}
      </Radio.Group>
    </Form.Item>)
    return html;
  }

  render() {
    let { onChange, rules } = this.props;
    let { id, label, labelwidth, top, left, height, width, value, style, hidden, editable, data, labelfield, textfield, message, buttontype } = this.state.attr;
    let { visible } = this.state;
    return (
      <>
        {this.formItems()}
      </>
    )
  }
}

export class AntdComboBox extends React.Component {  //
  // <AntComboBox params='deptname,所属院系,82,0,14,0,260,,信息管理与信息系统;大数据管理与应用;工商管理;计算机科学与技术;会计学' top={16+rowheight*5} ref={ref=>this.deptname=ref}/>
  //供应商编码区分大小写
  constructor(props) {
    super(props);
    let attr = { ...this.props };  //this.props不能添加属性e.g.antclass
    attr.antclass = 'combobox';
    attr = parseParams(attr);
    attr = parseData(attr);
    //if (attr.buttontype!='button') attr.buttontype='default';
    this.state = {
      attr: attr,
      id: attr.id,
      value: [],
      row: [],
      data: attr.data,
      antclass: attr.antclass,
      visible: attr.visible > 0 ? true : false,
      readOnly: attr.readOnly,
      editable: attr.editable,
      disabled: attr.disabled,
      display: 'block',

    }
  }

  async componentDidMount() {
    let p = parseSQLParams(this.state.attr);
    if (p != null) {
      let rs = await reqdoSQL(p);
      this.setState({ data: rs.rows });
    }
  }

  render() {
    let { onChange, rules } = this.props;
    let { label, labelwidth, top, left, height, width, style, hidden, textfield, message, labelfield, valuefield } = this.state.attr;
    let { id, value, editable, data, visible, readOnly } = this.state;
    //console.log(1777,id,textfield,data)
    //console.log(666,valuefield, labelfield)
    return (
      <Form.Item label={label} name={id} key={id} labelCol={{ style: { width: labelwidth } }} className='labelStyle' style={{ ...style, display: visible ? 'block' : 'none' }} >
        <Select id={id} key={id} style={{ width: width }} ref={ref => this[id] = ref}
          fieldNames={{ value: valuefield, label: labelfield }}
          options={data} disabled={readOnly}
          onChange={(value, row) => { this.setState({ value: value, row: row }); onChange?.(value, row) }}
          {...this.props} />
      </Form.Item>
    )
  }
}

export class AntdCascader extends React.Component {
  //不考虑初值设置，在setformvalue设置初值
  //<AntComboTree params='subcategoryid,类别编码,82,0,14,0,300,cascader,,categoryname' top={16+rowheight*5} ref={ref=>this.subcategoryid=ref} sqlprocedure='demo505a' treestyle='full' onChange={this.handleCategoryChange.bind(this)} /> 
  constructor(props) {
    super(props);
    let attr = { ...this.props };  //this.props不能添加属性e.g.antclass
    attr.antclass = 'cascader';  //不同控件参数解析不同
    attr = parseParams(attr);
    attr = parseData(attr);
    this.state = {
      attr: attr,
      page: attr.page,
      form: attr.form,
      id: attr.id,
      value: attr.value,
      readOnly: attr.readOnly,
      disabled: attr.disabled,
      antclass: attr.antclass,
      data: [],
      selectedKeys: [],
      display: 'block',
      visible: attr.visible,
    }
  }

  async componentDidMount() {
    let { id, page, form } = this.state;
    let p = parseSQLParams(this.state.attr);
    if (p != null) {
      p.style = 'full';
      //let rs = await reqdoTree(p);
      //let data = rs.rows; 
      let rs = await reqdoSQL(p);
      let data = toTreeData(rs.rows);  //转成树型结构
      let { attr } = this.state;
      attr.data = data;
      attr.nodes = rs.rows;
      this.setState({ attr, data }, () => {
        this.setValue(rs.rows); //设置cascader的初值，变成一个数组
      });
    }
  }

  setValue = (data) => {
    let { id, page, form } = this.state;
    if (!page || !page[form]) return;
    let value = page[form].getFieldValue(id);  //initialvalue之后
    //console.log(23451,value,page,page[form])
    if (value && value != '' && !Array.isArray(value) && typeof (value) === 'string') {  //判断是不是已经是数组
      //线性表中查节点
      let node = data.find((item) => item.id === value || item.key == value);  //线性表中找到这个结点
      if (node) {
        let pnodes = node.ancestor.split('#');
        if (pnodes.length > 0) pnodes.pop();
        pnodes.push(value);
        //console.log(23456,pnodes,page,page[form])
        page[form].setFieldValue(id, pnodes);  //重新设置值
      }
      //树形结构递归找节点
      /*
      let node = findTreeNode(data,value);  //找到这个结点
      if (node?.node){
        let pnodes = node.node.ancestor.split('#');
        if (pnodes.length>0) pnodes.pop();
        pnodes.push(value);
        page[form].setFieldValue(id, pnodes);  //重新设置值
      }
      */
    }
  }
  render() {
    let { onChange, rules } = this.props;
    let { id, label, labelwidth, top, left, height, width, value, style, hidden, valuefield, textfield, editable, data, message, buttontype, panelheight } = this.state.attr;
    let { readOnly } = this.state;
    //console.log(888,data);
    let htmlstr;
    htmlstr = <Cascader id={id} key={id} ref={ref => this[id] = ref} fieldNames={{ value: valuefield, label: textfield }}
      options={data} style={{ width: width }} disabled={readOnly}
      onChange={(value, row) => { this.setState({ value, row }); onChange?.(value, row) }}
      {...this.props} />
    return (
      <Form.Item label={label} name={id} labelCol={{ style: { width: labelwidth } }} className='labelStyle' style={{ position: 'absolute', top: top, left: left >= 0 ? left : null, right: left < 0 ? -left : null, display: hidden ? 'none' : this.state.display }} rules={[{ required: this.state.attr.required, message: message }]}>
        {htmlstr}
      </Form.Item>
    )
  }
}
export class AntdCascader1 extends React.Component {
  constructor(props) {
    super(props);
    let attr = { ...this.props };  //this.props不能添加属性e.g.antclass
    attr = parseParams(props);
    attr = parseData(attr);
    //if (attr.buttontype!='button') attr.buttontype='default';
    this.state = {
      attr: attr,
      id: attr.id,
      page: attr.page,
      form: attr.form,
      value: '',
      row: [],
      data: attr.data,
      antclass: attr.antclass,
      visible: true,
      editable: attr.editable,
      display: 'block',
    }
  }

  async componentDidMount() {
    let { sqlprocedure, sqlparams, data } = this.state.attr;
    let { page, form, id } = this.state;
    let rows;
    if (sqlprocedure !== '') {
      let p = { ...sqlparams };
      p.sqlprocedure = sqlprocedure;
      let rs = await reqdoSQL(p);
      rows = toTreeData(rs.rows);
    }
    let value = page[form].getFieldValue(id);
    if (form && value === undefined || value === '') //当没有给初值时，从树形数据中获取第一个数据赋值
      page[form].setFieldValue(id, this.findFirst(rows))
    else if (value != '' && !Array.isArray(value) && typeof (value) === 'string')  ////判断是不是已经是数组
      page[form].setFieldValue(id, this.findTreeNode(rows, value))
    this.setState({ data: rows });
  }

  async componentDidUpdate(prevProps, prevState) {  //当父组件的state中的sqlparams变化时，触发
    //prevState 是处理过的state  prevProps 是传过来原来的属性
    let { page, form, id } = this.state;
    if (prevProps.sqlparams !== this.props.sqlparams) {
      let { sqlprocedure, sqlparams } = this.props;
      if (sqlprocedure !== '') {
        let p = { ...sqlparams };
        p.sqlprocedure = sqlprocedure;
        let rs = await reqdoSQL(p);
        let rows = toTreeData(rs.rows);
        if (form) page[form].setFieldValue(id, this.findFirst(rows))
        this.setState({ data: rows });
      }
    }
  }

  findTreeNode = (data, key, path = []) => { //找一个节点的祖先节点
    for (const node of data) {
      if (node.id == key) {
        path.push(key);
        return path;
      }
      if (node.children) {
        const result = this.findTreeNode(node.children, key, path.concat(node.id)); //必须用concat
        if (result.length > 0) {
          return result;
        }
      }
    }
    return [];
  }

  findFirst = (tree) => {   //，从树形数据中获取第一个数据
    if (!Array.isArray(tree) || tree.length === 0) {
      return [];
    }
    if (Array.isArray(tree)) {
      for (let i = 0; i < tree.length; i++) {
        const item = tree[i];
        if (item.children && item.children.length > 0) {
          const childValue = this.findFirst(item.children);
          if (childValue.length > 0) {
            return [item.id, ...childValue];
          }
        } else {
          return [item.id];
        }
      }
    }
    return [];
  }

  handleChange = async (value, row) => {
    if (value && value.length > 0) {
      let lastValue = row[value.length - 1].text;
      this.setState({ value: lastValue, row });
    } else {
      this.setState({ value: '', row });
    }
  };

  render() {
    let { onChange, rules } = this.props;
    let { label, labelwidth, top, left, height, width, style, hidden, textfield, message, labelfield, valuefield } = this.state.attr;
    let { id, value, editable, data, visible } = this.state;
    return (
      <Form.Item name={id} label={label} className='labelStyle'
        style={{ ...style, display: visible ? 'block' : 'none' }} {...this.props}>
        <Cascader
          {...this.props}
          id={id}
          style={{ width: width }}
          options={data}
          fieldNames={{ value: 'id', label: 'text' }}
          onChange={(value, row) => { this.handleChange(value, row); onChange?.(value, row) }}
        />
      </Form.Item>
    );
  }
}

export class AntdImage extends React.Component {  //class的名称必须大写字母开头
  //规定文件名称的属性名为filename，或者由fieldnames指定
  constructor(props) {
    super(props);
    this.refs = {};
    //let p={...this.props};  //this.props不能添加属性e.g.antclass
    let attr = parseParams(props);
    //let attr=myParseAntFormItemProps(p);
    attr.antclass = 'image';  //不同控件参数解析不同
    if (attr.height == 0) attr.height = sys.fontSize;
    if (attr.fieldNames?.url) attr.urlfield = attr.fieldNames.url;
    if (attr.urlfield === undefined || attr.urlfield && attr.urlfield == '') attr.urlfield = 'url';
    this.state = {
      attr: attr,
      id: attr.id,
      src: attr.src,
      value: attr.src,
      datatype: attr.datatype,
      antclass: attr.antclass,
      display: 'block'
    }
  }
  render() {
    let { id, label, labelwidth, top, left, height, width, style, urlfield, hidden, form, datatype, maxcount } = this.state.attr;
    //let src = this.state.src;  //不是从state.attr中提取
    let { src } = this.props;  //必须写props，这样才会刷新值
    let html = [];
    // console.log(114, this.state.attr);
    if (datatype == 'json') {
      src = myStr2JsonArray(src);
    }
    console.log(115, src, datatype);
    if (src && typeof src === 'object') {
      if (!maxcount || maxcount <= 0) maxcount = src.length;
      console.log(116, src, maxcount, urlfield, src[0][urlfield]);
      for (let i = 0; i < maxcount; i++) {  //多个图片文件,json格式中使用filename属性指定图片文件
        if (src[i][urlfield] != undefined) {
          let url = sys.serverpath + '/' + src[i][urlfield] + '?time=' + myLocalTime('').timestamp;
          console.log(1117, url, id)
          let key = id + '_' + i;
          //html.push(<Image key={key} {...this.attr} style={{ marginRight: 10 }} width={width > 0 ? width : null} height={height > 0 ? height : null} src={url} placeholder={<Image width={width > 0 ? width : null} height={height > 0 ? height : null} preview={false} src={url + "&&x-oss-process=image/blur,r_50,s_50/quality,q_1/resize,m_mfit,h_200,w_200"} />} />)
          html.push(<Image key={key} {...this.attr} style={{ marginRight: 10 }} width={width > 0 ? width : null} height={height > 0 ? height : null} src={url} placeholder={<Image width={width > 0 ? width : null} height={height > 0 ? height : null} preview={false} src={url} />} />)
        }
      }
    } else { //一个图片
      if (src != undefined) {
        //let url = sys.serverpath + src + '?time=' + myLocalTime('').timestamp;
        let url = sys.serverpath + src; // + '?time=' + myLocalTime('').timestamp;
        console.log(1118, url, id)
        //html.push(<Image key={id} ref={ref => this.image = ref} width={width > 0 ? width : null} height={height > 0 ? height : null} src={url} placeholder={<Image width={width > 0 ? width : null} height={height > 0 ? height : null} preview={false} src={url + " &&x-oss-process=image/blur,r_50,s_50/quality,q_1/resize,m_mfit,h_200,w_200"} />} />)
        html.push(<Image key={id} {...this.attr} ref={ref => this.image = ref} width={width > 0 ? width : null} height={height > 0 ? height : null} src={url} placeholder={<Image width={width > 0 ? width : null} height={height > 0 ? height : null} preview={false} src={url} />} />)
      }
    }
    if (form) {
      return (
        <Form.Item label={label} name={id} labelCol={{ style: { width: labelwidth } }} className='labelStyle' style={{ position: 'absolute', top: top, left: left >= 0 ? left : null, right: left < 0 ? -left : null, display: hidden ? 'none' : this.state.display }} >
          <>{html}</>
        </Form.Item>
      )
    } else {  //无表单
      return (
        <div style={{ position: (top >= 0 && left >= 0) ? 'absolute' : 'relative', top: top, left: left >= 0 ? left : null, right: left < 0 ? -left : null, display: hidden ? 'none' : this.state.display }} >
          {html}
        </div>
      )
    }
  }
}

export class AntdImageUpload extends React.Component {  //class的名称必须大写字母开头
  constructor(props) {
    super(props);
    let attr = parseParams(props);
    attr.antclass = 'imageupload';  //不同控件参数解析不同
    if (attr.fieldNames?.url) attr.urlfield = attr.fieldNames.url;
    if (attr.urlfield === undefined || attr.urlfield && attr.urlfield == '') attr.urlfield = 'url';
    if (attr.timeStamp == undefined) attr.timeStamp = false;
    if (attr.tag == undefined) attr.tag = '';  //文件上传文件名标识
    this.state = {
      attr: attr,
      src: attr.src,
      filelist: [],
      readOnly: attr.readOnly,
      disabled: attr.readOnly,
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
    let fileno = '';
    if (file.status !== 'removed') {
      let formData = new FormData();
      console.log(888, this.state.attr.tag)
      let targetfile = '';
      fileno = (filelist.length > 0 ? '_' + (filelist.length) : '');
      if (this.state.attr.tag !== undefined) {
        targetfile = this.state.attr.tag + fileno;
        if (this.state.attr.timeStamp) targetfile += '_' + myLocalTime('').timestamp;
      } else {
        targetfile = 'tmp_' + myLocalTime('').timestamp;
      }
      let targetpath = this.state.attr.targetpath;
      //console.log(9922,e.file,targetpath,targetfile);
      formData.append("targetpath", targetpath);  //文件路径
      formData.append("targetfile", targetfile);  //目标文件名，与时间戳有关       
      formData.append("file", file.originFileObj);  //上传第一个文件
      const config = { headers: { "Content-Type": "multipart/form-data" } }
      await axios.post("/myServer/doFileUpload", formData, config).then(res => {
        //服务器端返回文件名称，实际文件名。如果文件名为空表示文件上传失败
        let json = res.data;
        file.targetfile = targetfile;
        //服务器端返回的内容
        file.filename = json.filename;
        file.url = sys.serverpath + '/' + json.filename;
        file.realfilename = json.realfilename;
        file.uid = this.state.attr.id + '_' + filelist.length + '_' + myLocalTime('').timestamp;
        file.status = 'done'
        file.fileno = fileno;
        file.fileext = json.fileext;
        filelist.push(file);
        uploadedfiles.push(file);
      })
    } else {
      //console.log(771,deletedfiles,e.file.filename);
      deletedfiles.push({ filename: e.file.filename })
      filelist = e.fileList;
    }
    //console.log(771,filelist);
    //console.log(1777,uploadedfiles);
    this.setState({ filelist: filelist, deletedfiles, uploadedfiles });
    //if (n==0) notification.success({message:'系统通知', description: '共'+files.length+'个文件上传成功!', duration:2});
    //else if (n<files.length) notification.warning({message:'系统通知', description: '共'+files.length+'个文件上传成功，'+n+'个文件上传失败！', duration:2});
    //else notification.error({message:'系统通知', description: '共'+n+'个文件上传失败!', duration:2});
    //this.setState({uploading: false});       
  }

  handlePreview = async (file) => {
    console.log(file);
    let src = file.url;
    this.setState({ src: src, myWin1: true, flag: true })
    /*
    this[this.state.attr.id].setPreviewImage(file.url || (file.preview));
    this[this.state.attr.id].setPreviewOpen(true);
    this[this.state.attr.id].setPreviewTitle(file.name);
    */
  };
  render() {
    let { id, label, labelwidth, top, left, height, width, style, hidden, maxCount, filetag } = this.state.attr;
    let { readOnly } = this.state;
    let filelist = this.state.filelist;  //不是从state.attr中提取
    //console.log(5551, filelist);
    //console.log(5552, this.state.formvalues);
    //console.log(5553, this.state.deletedfiles);
    //destroyOnClose使用modal的这个属性，可以每次打开时生成组件
    this.state.attr.tag = '';
    if (filetag != '') {
      let sys = this.state.formvalues;
      this.state.attr.tag = eval(filetag);
      //console.log(5554, filetag, this.state.attr.tag);
    }
    return (<>
      <Form.Item label={label} name={id} labelCol={{ style: { width: labelwidth } }}
        style={{ width: width, position: 'absolute', top: top, left: left >= 0 ? left : null, right: left < 0 ? -left : null }} >
        <Upload key={id} listType="picture-card" fileList={filelist} ref={ref => this.imageupload = ref}
          disabled={readOnly}
          //className={styles.imageuploadx}
          onPreview={this.handlePreview.bind(this)}
          onChange={this.handleChange.bind(this)}  >
          {maxCount < 0 || filelist.length < maxCount && '+ 上传'}
        </Upload>
      </Form.Item>
      <Form.Item>
        <Image src={this.state.src} style={{ width: '100%', display: this.state.display }}
          preview={{
            visible: this.state.flag, src: this.state.src, onVisibleChange: (value) => { this.setState({ flag: value }) }
          }} />
      </Form.Item>
    </>)
  }
}

export class AntdHiddenField extends React.Component {  //class的名称必须大写字母开头
  constructor(props) {
    super(props);
    let attr = { ...this.props };  //this.props不能添加属性e.g.antclass
    attr.antclass = 'textbox';  //不同控件参数解析不同
    //let attr=myParseAntFormItemProps(this.props,'');
    this.state = {
      attr: attr,
      value: attr.value,
      antclass: attr.antclass
    }
  }
  render() {
    let { onChange } = this.props;
    let id = this.state.attr.id;
    return (
      <Form.Item label='' labelCol={{ style: { width: 0 } }} name={id} style={{ position: 'absolute', top: 0, left: 0, display: 'none' }}>
        <Input style={{ width: 0, height: 1 }} id={id} key={id} ref={ref => this[id] = ref} disabled {...this.props} />
      </Form.Item>
    )
  }
}

export class AntLabel extends React.Component {  //class的名称必须大写字母开头
  constructor(props) {
    super(props);
    //let attr=myParseAntFormItemProps(props);
    let attr = parseParams(props);
    attr.antclass = 'label';  //不同控件参数解析不同
    if (attr.height == 0) attr.height = sys.fontSize;
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
      <Form.Item label={label} name={id} key={id} labelCol={{ style: { width: labelwidth } }} className='labelStyle' colon={false}
        style={{ fontSize: height, position: 'absolute', top: top, left: left >= 0 ? left : null, right: left < 0 ? -left : null, display: hidden ? 'none' : this.state.display }} />
    )
  }
}

export class ConfirmModal extends React.Component {
  constructor(props) {
    super(props);
    let attr = { ...this.props };  //this.props不能添加属性e.g.antclass
    attr.antclass = 'confirmmodal';
    if (attr.title === undefined) attr.title = '系统提示';
    if (attr.description === undefined && attr.message != undefined) attr.description = attr.message;
    if (attr.description === undefined) attr.description = '是否确定删除这条记录？';
    if (attr.okText === undefined) attr.okText = '确定';
    if (attr.cancelText === undefined) attr.cancelText = '取消';
    if (attr.width === undefined) attr.width = 340;
    if (attr.height === undefined) attr.height = 200;
    attr.width = parseInt(attr.width);
    attr.height = parseInt(attr.height);
    this.state = {
      attr: attr,
      visible: false,
      title: attr.title,
      description: attr.description,
    }
  }
  render() {
    let { id, width, height, okText, cancelText } = this.state.attr;
    let { title, visible, description } = this.state;
    return (
      <Modal name='myMsg1' key='myMsg1' title={title} open={this.state.visible} width={width} centered maskClosable={false}
        style={{ position: 'relative', padding: 0 }} closable keyboard={false}
        //bodyStyle={{ padding:0, margin:0 }} 
        styles={{ body: { padding: 0, margin: 0 } }}
        {...this.props}
        onCancel={() => this.setState({ visible: false })}
        footer={[<Button key='_btnok' type='primary' onClick={(e) => { this.props.onConfirm?.(e) }}>{okText}</Button>,
        <Button key='_btnclose' type='primary' onClick={() => this.setState({ visible: false })}>{cancelText}</Button>]}>
        {description}
      </Modal>
    )
  }
}

export class AntdModal extends React.Component {
  constructor(props) {
    super(props);
    let attr = { ...this.props };  //this.props不能添加属性e.g.antclass
    attr.antclass = 'modal';
    if (attr.title === undefined) attr.title = '系统提示';
    if (attr.okText === undefined) attr.okText = '确定';
    if (attr.cancelText === undefined) attr.cancelText = '取消';
    if (attr.width === undefined) attr.width = 500;
    if (attr.height === undefined) attr.height = 400;
    attr.width = parseInt(attr.width);
    attr.height = parseInt(attr.height);
    this.state = {
      attr: attr,
      visible: false,
      title: attr.title,
    }
  }

  handleOkClick = (e) => {
    this.setState({ visible: false }, () => {
      setTimeout(() => {
        this.state.attr.onOkClick?.(e);
      })
    });
  }

  render() {
    let { id, width, height, okText, cancelText } = this.state.attr;
    let { title, visible } = this.state;
    console.log(height, width);
    return (
      <Modal {...this.props} id='myModal' name='myModal' key='myModal' ref={ref => this.myModal = ref}
        title={title} open={this.state.visible}
        forceRender centered maskClosable={false}
        cancelText={cancelText} onCancel={() => { this.setState({ visible: false }) }}
        style={{ position: 'relative', padding: 0 }} closable keyboard={false}
        styles={{ body: { padding: 0, margin: 0, width: width + 'px', height: height + 'px' } }}
        footer={[
          <Button key='btnok' type='primary' htmltype='submit' onClick={this.handleOkClick}>{okText}</Button>,
          <Button key='btnclose' type='primary' onClick={() => { this.setState({ visible: false }) }}>{cancelText}</Button>
        ]}>
      </Modal>
    )
  }
}


//antdTree   tttttttttttttttree
export class AntdTree extends Component {
  constructor(props) {
    super(props);
    let attr = parseParams(props);
    console.log(111, attr.filter, attr.loadall);
    if (typeof attr.loadall !== 'boolean') {
      if (!attr.loadall || attr.loadall.toLowerCase() == 'true' || attr.loadall === '1') attr.loadall = true;
      else attr.loadall = false;
    }
    if (typeof attr.filter !== 'boolean') {
      if (attr.filter && (attr.filter.toLowerCase() === 'true' || attr.filter === '1')) attr.filter = true;
      else attr.filter = false;
    }
    //console.log(112, attr.filter, attr.loadall);
    this.state = {
      attr: attr,
      sqlprocedure: attr.sqlprocedure,
      filterprocedure: attr.filterprocedure,
      loadall: attr.loadall,
      filter: attr.filter,
      data: [],
      node: {},
      filteredData: [],
      filterno: -1,
      root: attr.root,
    }
  }
  async componentDidMount() {
    //提取节点
    let p = parseSQLParams(this.state.attr);
    if (p == null) return;
    let { loadall, sqlprocedure, root } = this.state;
    let onShow = this.state.attr.onShow;
    console.log(999, onShow);

    p.style = loadall ? "full" : "expand";
    p.sqlprocedure = sqlprocedure;
    p.parentnodeid = "";
    console.log(99, p);
    let rs = await reqdoTree(p);
    let rows = rs.rows;
    rows.forEach((item) => {
      if (item.isparentflag == 0) item.isLeaf = true;
    });
    let rootnode;
    if (root) {  //如果不要添加一个根节点，那么把原来的根节点变成它的children
      rootnode = { id: '_root', key: '_root', text: root, level: 0, parentnodeid: '', ancestor: '', isparentflag: 1, isLeaf: false, children: rows };
      //console.log(111,rootnode);
      rows = [rootnode];
    }
    this.setState({ data: rows }, () => {
      setTimeout(() => {
        if (root) this.expandTreeNode(rootnode.id)
        this.AntdTree.setState({selectedKeys:[rows[0].id]}, ()=>scrollTreeNode());
        onShow?.();
      })
    });
  }

  expandTreeNode = (key) => {
    //强制用语句展开结点
    if (this.AntdTree.state.expandedKeys.indexOf(key) < 0) this.AntdTree.setExpandedKeys([...this.AntdTree.state.expandedKeys, ...[key]]);
  }

  handleExpand = async (key, e) => {
    //let node=e.node;
    //if (!e.expanded) return;
  }

  handleLoadData = async (node) => {
    let data = [...this.state.data];
    data = await this.loadTreeData(data, node)
    this.setState({ data: data }, () => {
      setTimeout(() => {
        //this.AntdTree.setState({selectedKeys: [node.id]});
      })
    });
    return data;
  }

  loadTreeData = async (data, node) => {
    let { sqlprocedure, loadall, root } = this.state;
    let p = parseSQLParams(this.state.attr);
    if (p == null) return;
    //节点展开时加载数据时触发
    //if (node?.children[0].id=='_'+node.id && node?.children[0].text.trim()==''){
    if (node.children && node.children.length > 0 && node.children[0].id == '_' + node.id && node.children[0].text.trim() == '') {
      p.style = "expand";
      p.parentnodeid = node.id;
      p.sqlprocedure = sqlprocedure;
      let rs = await reqdoTree(p);
      //必须设置叶子节点的isLeaf属性为true
      let rows = rs.rows;
      rows.forEach((item) => {
        if (item.isparentflag == 0) item.isLeaf = true;
      })
      //data = addTreeChildrenData(data, node, rows); //将rs.rows数据添加为node的子节点
      let pnode = findTreeNode(data, node.id);
      if (pnode) {
        pnode.children = rows; //替换原数组data中的children值
        pnode.isLeaf = false;
      }
    }
    return data;
  }

  // handleSelect = (key, e) => {
  //   let { onSelect } = this.props;
  //   console.log(887, e.node);
  //   this.setState({ node: e.node }, (e, key) => { console.log('selectednode=', e.node); onSelect?.(key, e) });   //执行父组件的onselect事件
  // }

  handleDoubleClick = (e, node) => {
    //双节结点时选中这个结点，注意需要使用数组
    this.AntdTree.setState({selectedKeys:[node.id]}, ()=>scrollTreeNode());
  }

  handleSearchFilter = async () => {
    let { filterno, filterprocedure } = this.state;
    filterno = 0;
    let p = {};
    p.filter = this.filtertext.state.value;
    p.sqlprocedure = filterprocedure;
    let rs = await reqdoSQL(p);  //提取全部的满足条件的记录
    this.setState({ filteredData: rs.rows, filterno }, () => this.locateNode());
  }

  locateNode = async () => {
    let { filterno, filteredData } = this.state;
    let data = [...this.state.data];  //不能放到上面解构
    if (filteredData.length > 0) {
      if (filterno >= filteredData.length) filterno = filteredData.length - 1;
      if (filterno < 0) filterno = 0;
      let row = filteredData[filterno];
      //找到各层父节点，展开父节点
      if (row.ancestor.trim() != '') {
        let array = row.ancestor.split('#');
        for (let i = 0; i < array.length - 1; i++) {
          let node = findTreeNode(data, array[i]);
          data = await this.loadTreeData(data, node)
          this.expandTreeNode(node.id);
        } //for
      }
      this.setState({ data: data, filterno }, () => {
        setTimeout(() => {
          this.AntdTree.setState({ selectedKeys: [row.id] }, () => {
            // if (document.getElementsByClassName('ant-tree-treenode-selected').length > 0) {
            //   document.getElementsByClassName('ant-tree-treenode-selected')[0].scrollIntoView()
            // }
            scrollTreeNode();
            //this.AntdTree.scrollTo({key: rs.rows[0].id});  //没有效果                    
          });//选中结点    
        })
      });
    }
  }

  handleMoveClick = async (id) => {
    let { filterno, data, filteredData } = this.state;
    if (id == 'movedown') filterno++;
    else if (id == 'moveup' && filterno > 0) filterno--;
    this.setState({ filterno }, () => this.locateNode());
  }

  render() {
    let { width, onSelectNode, onSelect } = this.state.attr;
    let { loadall, filter } = this.state;
    //console.log(666,filter);
    return (
      <Layout style={{ overflow: 'hidden', height: '100%', position: 'relative' }}>
        {filter && <Header style={{ padding: 0, paddingLeft: 4, height: 35, lineHeight: '30px', backgroundColor: '#E0ECFF', borderBottom: '1px solid #95B8E7', overflow: 'hidden' }}>
          <Form name='treefilterbar'>
            <AntdInputBox id='filtertext' ref={ref => this.filtertext = ref} top='2' left='6' width={width - 80} type='search' onSearch={this.handleSearchFilter.bind(this)} />
            <Button type='link' id='moveup' style={{ position: 'absolute', top: 1, right: 30, width: 20 }} onClick={(e) => this.handleMoveClick('moveup')}>{<UpOutlined />}</Button>
            <Button type='link' id='movedown' style={{ position: 'absolute', top: 1, right: 6, width: 20 }} onClick={(e) => this.handleMoveClick('movedown')}>{<DownOutlined />}</Button>
          </Form>
        </Header>}
        <Content style={{ overflow: 'auto', position: 'relative', height: '100%' }}>
          <Tree ref={ref => this.AntdTree = ref} {...this.props} treeData={this.state.data}
            style={{ margin: 0, paddingTop: 4, overflow: 'hidden', width: width, position: 'relative' }}
            fieldNames={{ title: 'text', key: 'id' }} showLine={true} checkable={false}
            blockNode={this.props.blockNode === undefined? true: this.props.blockNode}
            className='textdiv'  //两边都要加，render中也要加写
            showIcon={true} 
            //switcherIcon={<DownOutlined /> }
            //autoExpandParent virtual             
            expandAction="doubleClick"
            //onSelect={this.handleSelect.bind(this)} 
            onSelect={(key, e) => { this.setState({ node: e.node }, () => onSelectNode?.(key, e)) }} //换个事件名称，不用onSelect,否则这里事件就被跳过
            onDoubleClick={this.handleDoubleClick.bind(this)}
            onExpand={this.handleExpand.bind(this)}
            loadData={loadall ? undefined : this.handleLoadData.bind(this)}
            titleRender={(node) => {
              return (<span style={{ marginLeft: 4 }} className='textdiv'>{node.text}</span>)
              //   //   let html
              //   //   if (node.isLeaf) html=<span style={{marginLeft:8}}><FileOutlined style={{marginRight:2}} />{node.text}</span>
              //   //   else html=<span style={{marginLeft:8}}><BlockOutlined style={{marginRight:2}} />{node.text}</span>                  
              //   //   return(html)
            }}
          >
          </Tree>
        </Content>
      </Layout>
    )
  }
}

/*
export class AntdResizable extends Component {
  constructor(props) {
    super(props);
    let attr = parseParams(props);  
    this.state={
      width
    }
  }

  handleResize=(e)=>{
    this.setState({siderwidth: e.width, treewidth:e.width});
  }

  onResize = (event, { element, size }) => {
    if (!this.state.resizing) {
        this.setState({ resizing: true });
    }
    window.requestAnimationFrame(() => this.setState({ siderwidth: size.width }));
  };

  onResizeStop = () => {
    this.setState({ resizing: false });
  };

  render(){
    return(
      <Resizable width={this.state.siderwidth} height={0} onResize={this.onResize} onResizeStop={this.onResizeStop} handle={<div className='resizeHandleStyle' />} resizeHandles={['e']}>

      </Resizable>
  )
}
*/