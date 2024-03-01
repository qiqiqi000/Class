import ajax from './ajax'
import React, { Component } from 'react';
import { Modal, Upload, notification, Form, Input, Select, InputNumber, Checkbox, Radio, DatePicker, Image, Button, ConfigProvider, Cascader, TreeSelect, Divider, QRCode, Rate } from 'antd'
import { WindowsOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { ComboTree, DataGrid, GridColumn } from 'rc-easyui';
import { myStr2JsonArray, searchNodeInRows, myDoFiles, myLocalTime, myDeleteFiles, reqdoSQL, reqdoTree, myNotice } from './functions';
import axios from "axios";
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import pinyinData from '../data/pinyin.json';
import { getByAltText, render } from '@testing-library/react';
import locale from 'antd/locale/zh_CN'
import ReactDom from 'react-dom'

const sys = { ...React.sys };

export class MyFormComponent extends Component {
  constructor(props) {
    super(props)
  }
  getFormFields(form) {
    let fields = [];
    if (this[form]) {
      let data = this[form].getFieldsValue();
      for (var key in data) {
        fields.push(key);
      }
    }
    return fields;
  }
  setFormValues(form, row, fields) { //保存数据到表单中
    if (!row) return;
    let formdata = {};
    if (fields == undefined || fields == '') fields = this.getFormFields(form); //myGetFormFields(this, form);
    //console.log(112,fields,row);
    for (let i = 0; i < fields.length; i++) {
      let key = fields[i];
      //图片和jsons数据必须定义ref
      let str = row[key];
      let datatype = this[key]?.state?.datatype || '';
      let antclass = this[key]?.state?.antclass || '';
      //console.log(100,key,str, antclass,typeof str)

      if (datatype == 'json') { //处理json数据
        str = myStr2JsonArray(row[key]);  //将数据库中的json字符串转换成js的json
      }
      if (antclass === 'number') {
        //处理数值型数据
        str = parseFloat(str);
      } else if (antclass === 'date') {
        //处理日期特殊格式,例如2010-01-10    
        str = dayjs(str, sys.dateformat)
      } else if (antclass === 'cascader' && typeof str == 'string') {
        let node = searchNodeInRows(this[key].state?.attr.nodes, str);  //从线性表数组中找到这个元素节点
        //console.log(12346, str, typeof str, node)
        if (node?.ancestor && node?.ancestor != '') {
          str = (node.ancestor + str).split('#');
        } else {
          str = [str];  //是数组
        }
        //console.log(112, key, str, this[key]?.state?.antclass, node)
      }
      if (antclass === 'image') {
        //显示图片
        this[key]?.setState({ src: str }); //图片用js赋值，处理图片的特殊赋值方式 
      } else if (antclass === 'imageupload') {
        //上传图片，处理图片的特殊赋值方式
        let urlfield = this[key]?.state.attr.urlfield;
        //console.log(111,key,str,this$1[key]?.state?.antclass,typeof str)
        if (str != null && typeof str == 'object') {
          str.forEach((item, index) => {
            item.uid = key + '_' + index
            if (!item.name) item.name = '图片';
            item.status = 'done'
            item.url = sys.serverpath + '/' + item[urlfield]
          })
        }
        this[key]?.setState({ filelist: str, deletedfiles: [], uploadedfiles: [] }); //上传图片用filelist存储。
      }
      this[form].setFieldValue(key, str);
      //将数据保存起来，用于记录旧的数据
      //console.log(110,key,str, antclass,typeof str)
      formdata[key] = str;
      //当前控件把表单中其他控件的值保存起来,需要在控件定义时候写ref。在AntImageUpload中使用到
      this[key]?.setState({ formvalues: row });
    }
    return formdata;
  }
  getFormValues(form, data, fields) { //从表单提取值，保存数据时候使用
    if (!data || data == '' || data == {}) data = this[form].getFieldsValue();
    if (fields == undefined || fields == '') fields = this.getFormFields(form);
    for (let i = 0; i < fields.length; i++) {
      let key = fields[i];
      let str = data[key];
      let datatype = this[key]?.state?.datatype || '';
      let antclass = this[key]?.state?.antclass || '';
      if (datatype == 'json') { //处理json数据
        //图片和jsons数据必须定义ref
        if (antclass === 'imageupload' || antclass === 'fileupload') {
          //从filelist提取files
          str = this[key].state.filelist.map((item, index) => {
            let s = item.url;
            let x1 = s.indexOf(sys.serverpath + '//');
            let x2 = s.indexOf(sys.serverpath + '/');
            let x3 = s.indexOf(sys.serverpath + '\\\\');
            let x4 = s.indexOf(sys.serverpath + '\\');
            if (x1 >= 0) s = s.substring(x1 + sys.serverpath.length + 2);
            else if (x2 >= 0) s = s.substring(x2 + sys.serverpath.length + 1);
            else if (x3 >= 0) s = s.substring(x3 + sys.serverpath.length + 2);
            else if (x4 >= 0) s = s.substring(x4 + sys.serverpath.length + 1);
            let tmp = {};
            tmp[this[key].state.attr.urlfield] = s;
            if (item.name != undefined && item.name != '') tmp.name = item.name;
            return (tmp)
          })
          if (this[key]?.state?.deletedfiles?.length > 0) {
            //上传时做删除标记的文件在服务器端删除
            let sourcefile = JSON.stringify(this[key]?.state?.deletedfiles);
            //console.log(155,sourcefile);
            myDoFiles('delete', sourcefile);
          }
        }
      } else if (antclass === 'date') {
        //处理日期特殊格式,例如2010-01-10
        str = str.format(sys.dateformat);
      } else if (antclass === 'cascader' && typeof str == 'object') {
        //取数组最后一个元素
        str = (str.length > 0) ? str.pop() : [];
      }
      //console.log(159,key,str);
      data[key] = str;
    }
    return data;
  }
  resetFormValues(form) { //清空表单列和其他列（图片和上传的文件）数据
    let data = this[form].getFieldsValue();
    for (let key in data) {
      let str = '';
      if (this[key]) {
        if (this[key].state?.antclass == 'image' && this[key].state?.datatype == 'json') { //清空json数据      
          this[key].setState({ src: [], readOnly: false });
        } else if (this[key].state?.antclass == 'imageupload' && this[key].state?.datatype == 'json') {
          //清空json数据
          this[key].setState({ filelist: [], uploadedfiles: [], deletedfiles: [], formvalues: {}, readOnly: false });
        } else if (this[key].state?.antclass == 'date') {
          str = dayjs(new Date());
          this[key].setState({ readOnly: false })
        } else {
          this[key].setState({ readOnly: false })
        }
      }
      this[form].setFieldValue(key, str); //清空表单数据,有些key没有ref，this[key]为null，但也要清空
    }
    //dayjs.locale('zh-cn');
    //this[form].resetFields(); //清空表单数据，日期会出错
  } //resetformvalues  

  setFormFields(form, type, flag) { //清空表单列和其他列（图片和上传的文件）数据
    let data = this[form].getFieldsValue();
    for (let key in data) {
      if (this[key]) {
        this[key].setState({ [type]: flag })
      }
    }
  } //setFormFields

  renameUploadedFiles(form, row) {
    //保存记录后，将一个表单中上传的文件重新命名，把id列对应的文件名称修改成row这一行对应的值
    //修改上传的文件名称，因为上传时自增列未知
    let sys = row;
    let data = {};
    let fields = this.getFormFields(form);
    for (let i = 0; i < fields.length; i++) {
      let id = fields[i];
      let s = '';
      s = this[id]?.state?.antclass;
      if (s == 'imageupload' || s == 'fileupload') {
        let { tag, filetag, timeStamp, targetpath } = this[id].state.attr;
        let { uploadedfiles, deletedfiles } = this[id].state;
        tag = eval(filetag);
        //设置修改文件的源文件和目标文件
        let files = uploadedfiles.map((item) => {
          let r = {};
          r.targetfilename = targetpath + '/' + tag + item.fileno + (timeStamp ? '_' + myLocalTime('').timestamp : '') + item.fileext;
          r.filename = item.filename;
          return r;
        })
        myDoFiles('rename', JSON.stringify(files));
        data[id] = files.map((item) => { return ({ filename: item.targetfilename }) });
      }
    }
    return data;
  }  //rename  
  deleteUploadedFiles(form, rows) {
    //删除记录后，删除附件文件，一行可能有多个列是上传文件类型
    let fields = this.getFormFields(form);
    let data = [];
    for (let i = 0; i < fields.length; i++) {
      let id = fields[i];
      let s = '';
      s = this[id]?.state?.antclass;
      if (s == 'imageupload' || s == 'fileupload') {
        let f = [];
        let url = this[id]?.state.attr.urlfield;
        rows.forEach(item => {
          let s1 = myStr2JsonArray(item[id]);
          f.push(...s1);
        });
        myDeleteFiles(JSON.stringify(f), url);
      }
    }
    return data;
  }//deleteUploadedFiles

  //删除table中的一行
  deleteTableRow = async (table, form, sqlprocedure) => {
    /*
    let {selectedkeys, pageno, pagesize, row, rowindex, total, rowselection} = table.state;
    let xdata = { ...row };
    //xdata[keyfield] = row[keyfield];
    xdata._action = 'delete';
    xdata._reloadrow = 0;
    let p = {};
    p.sqlprocedure = sqlprocedure;
    p.data = [];
    p.data.push(xdata);
    let rs = await reqdoSQL(p); //调用函数，执行存储过程保存数据。必须加await 
    this.deleteUploadedFiles(form, p.data);
    //删除记录后，重新定位到下一行。计算下一行的行号。
    let rowno = (pageno - 1) * pagesize + rowindex + 1;  //实际行号
    if (rowno >= total) rowindex--;
    //console.log(333, rowindex, rowno, total, pageno);
    if (rowindex < 0) {
      pageno--;
      rowindex = 0;   //定位到上一页第一行
    }
    */
    let { rowselection, selectedkeys, row, rowindex, keyfield, pageno, pagesize, total, data } = table.state;
    if (rowselection != 'multiple' && row) selectedkeys = [row[keyfield]];
    console.log(999, rowselection, selectedkeys, row, rowindex)
    //一次删除一行
    let p = {};
    p.sqlprocedure = sqlprocedure;
    let rows = [];
    rowindex = -1;
    for (let i = 0; i < selectedkeys.length; i++) {
      let n = data.findIndex((item) => item[keyfield] == selectedkeys[i]);
      if (n >= 0) {
        rowindex = rowindex < 0 ? n : Math.min(n, rowindex);
        let xdata = { ...data[n] };
        xdata._action = 'delete';
        xdata._reloadrow = 0;
        rows.push(xdata);
        p.data = [xdata];
        let rs = await reqdoSQL(p);
      }
    }
    total = total - selectedkeys.length;
    //删除服务器端上传的文件，调用函数
    this.deleteUploadedFiles(form, rows);
    //删除记录后，重新定位到下一行。计算下一行的行号。
    let rowno = (pageno - 1) * pagesize + rowindex + 1;  //实际行号
    if (rowno >= total) rowindex = total - 1 - (pageno - 1) * pagesize;
    if (rowindex < 0) {
      pageno--;
      rowindex = 0;   //定位到上一页第一行
    }
    if (pageno <= 0) pageno = 0;
    // this.myDeleteModal.setState({ visible: false });
    // this.setState({ myTable1: { ...table, pageno, rowindex }, deleteconfirm: false }, () => { //自动触发1次，先清空data
    //   setTimeout(() => {
    //     this.loadTableData();
    //   })
    // });     
    return { pageno, rowindex }
  } //deleterow

  //保存表格一行数据
  saveTableRow = async (table, form, sqlprocedure) => {
    //let table={...this.state.myTable1}
    let { pageno, pagesize, total, rowindex, row, keyfield, keytitle } = table.state;
    let { lastrow, addoredit } = this.state;
    let data = this.getFormValues(form);  //转换数据内容
    //if (data._action=='add') data[this.state.myTable1.keyfield]=0;  //主键值自动生成
    //console.log(664, addoredit, data);
    data._action = addoredit;
    data._reloadrow = 1;
    data._treeflag = 0;
    let p = {};
    //将table.state的以及属性赋值给p，可以从父类传存储过程所需要的参数给这个函数。
    for (let key in table.state){
      if (typeof table.state[key]!=='object') p[key] = table.state[key];
    }
    p.sqlprocedure = sqlprocedure;  //"demo504a";
    p.data = [];
    p.data.push(data);
    if (addoredit != 'add') {
      p.data.push(lastrow);  //旧的没有修改过的数据
    }
    //console.log(p.data);
    console.log(JSON.stringify(p.data));
    let rs = await reqdoSQL(p); //调用函数，执行存储过程保存数据。必须加await
    let error = '';
    if (rs.rows.length > 0 && (rs.rows[0]._error == undefined || rs.rows[0]._error == '')) { //数据验证
      //替换数组中的这个元素
      console.log(777,rs.rows);
      if (addoredit == 'add') {
        //data[keyfield]=rs.rows[0][keyfield];  //提取主键列
        data = Object.assign({}, data, rs.rows[0]);  //合并对象属性，主键可能不止一个列
        //修改新增时上传文件的名称，可能需要把临时文件改成与主键列相关的文件名
        let data0 = this.renameUploadedFiles(form, rs.rows[0]);
        data = Object.assign({}, data, data0);  //合并对象属性
        data._action = 'update';
        data._reloadrow = 1;
        data._treeflag = 0;
        let p = {};
        p.sqlprocedure = sqlprocedure;
        p.data = [];
        p.data.push(data);  //p.data只有一行时，where修改条件取第一行的值
        //console.log(775,JSON.stringify(p.data));
        let rs1 = await reqdoSQL(p);
      }
      //新增记录或修改记录后可能排序次序发生变化，重新进行分页，计算行号定位到新行的这一页这一行
      let rowno = parseInt(rs.rows[0]._rowno);
      if (pagesize > 0) {  //分页时计算页码和行号
        //console.log(666,rowno);
        pageno = parseInt((rowno - 1) / pagesize) + 1;
        rowindex = rowno - (pageno - 1) * pagesize - 1;
        total++;
      } else { //不分页不计算行号
        rowindex = rowno - 1;
      }
      myNotice(keytitle + '记录已经保存，请刷新数据!', '', 200);
    } else {
      error = '_error';
      myNotice(keytitle + '保存失败，检查主键是否重复或其他错误!', '', 200);
    }
    return { pageno, rowindex, total, error, rows:rs.rows, data}  //data为原始输入的数据
  }  //savetablerow

}
