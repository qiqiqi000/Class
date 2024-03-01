import ajax from './ajax'
import React, { Component } from 'react';
import { useEffect, useRef, useImperativeHandle } from 'react';
import axios from "axios";
//import sys from './common.js'
import { Modal, Upload, notification, Form, Input, Select, InputNumber, Checkbox, Radio, DatePicker, Image, Button, ConfigProvider, Cascader, TreeSelect, Divider, QRCode, Rate } from 'antd'
import { WindowsOutlined, FormOutlined, PlusCircleOutlined, EditOutlined, DeleteOutlined, SaveOutlined, PrinterOutlined } from '@ant-design/icons';
import { searchTreeNode, toTreeData, findTreeNode, myParseAntFormItemProps, myParseTableColumns, myParseTags, myDoFiles, myLocalTime, searchNodeInRows, addTreeChildrenData, reqdoTree, reqdoSQL, myStr2JsonArray, myStr2Json, myDatetoStr } from './functions.js'
import dayjs from 'dayjs';
import { AntdInputBox } from './antdClass.js';
import 'dayjs/locale/zh-cn';
import locale from 'antd/locale/zh_CN';
import { BlockOutlined, DownOutlined,  UpOutlined, FileOutlined, TagOutlined, PaperClipOutlined } from '@ant-design/icons';
import { Tree, Layout, Menu } from 'antd';
const { Header, Content, Footer, Sider } = Layout;
const sys={...React.sys};
const parseParams = (props) => {  //解析属性
    let attr = { ...props }
    let { id, type, antclass, label, labelwidth,  top, left, height, width, value, visible, maxcount, count, spacing, labelfield, valuefield,precision } = attr;
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
    if (precision && !isNaN(precision)) precision=parseInt(precision);
    //visible部署原生属性，用变量
    if (visible !== undefined && !visible) visible = false;
    if (labelfield==undefined || labelfield=='') labelfield='label';
    if (valuefield==undefined || valuefield=='') valuefield='value';
    if (type === undefined) type = antclass;
    if (attr.onSearch) type = 'search';
    if (type=='') type='text';
    antclass = type;
    //赋值到attr
    attr = {...attr, type, antclass, label, labelwidth, labelwidth, top, left, height, width, value, spacing, visible, labelfield, valuefield, precision}
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
    if (top && !isNaN(top) && left && !isNaN(left)) attr.position = 'absolute';
    else attr.position = 'relative';
    if (attr.position==='absolute') attr.style={position: 'absolute', top: attr.top, left: attr.left}
    else attr.style={};    
    if (attr.height>0) attr.style.height=attr.height;
    //存储过程
    if (attr.sqlprocedure===undefined) attr.sqlprocedure=''; 
    if (attr.sqlparams===undefined) attr.sqlparams=null; 
    //console.log(2,attr.id,attr)
    return attr;
}

const parseData = (attr) => {
    if (attr.options != undefined && typeof attr.options === 'object') attr.data=attr.options;  //本身是json格式化数据
    if (attr.items != '' && typeof attr.items ==='string') {
       attr.data = attr.items.split(';').map((item, index) => {  //字符串,checkbox只能使用label,value？不能设置fieldNames
          let row={}; 
          row[attr.id]=item; 
          row[attr.labelfield]=item; 
          row[attr.valuefield]=item; 
          if (attr.labelfield!='label') row.label=item; 
          if (attr.valuefield!='value') row.value=item; 
          row.key=item+index;  
          return (row)
       });
    }
    return attr;
}

const parseSQLParams = (attr) => {
  //解析sql存储过程需要用的参数，如果存在sqlparams属性，则以它为标准；否则从attr、props中提取（去掉json或其他对象变量）存储过程参数
  let {sqlprocedure, sqlparams} = attr;
  let p=null;
  if (sqlprocedure !== undefined && sqlprocedure !== ''){
    if (sqlparams && typeof sqlparams =='object'){
      p = {...sqlparams};
      p.sqlprocedure=sqlprocedure;
    }else{
      p={};
      for (let key in attr){
        if (typeof attr[key] !=='object') p[key] = attr[key];   //必须去掉object，否则死循环
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

//antdTree   tttttttttttttttree
export class AntdTree extends Component {
  constructor(props) {
      super(props);
      let attr = parseParams(props);
      if (!attr.loadall || attr.loadall.toLocaleLowerCase() == 'true' || attr.loadall === '1') attr.loadall = true;
      else attr.loadall = false;
      if (attr.filter && (attr.filter.toLocaleLowerCase() == 'true' || attr.filter === '1')) attr.filter = true;
      else attr.filter = false;
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
    let {loadall, sqlprocedure, root} =this.state;
    let onShow=this.state.attr.onShow;
    console.log(999,onShow);
    p.style = loadall? "full" : "expand";
    p.sqlprocedure = sqlprocedure;
    p.parentnodeid = "";
    console.log(99,p);
    let rs = await reqdoTree(p);
    let rows=rs.rows;
    rows.forEach((item)=>{
      if (item.isparentflag==0) item.isLeaf =true;
    });
    let rootnode;
    if (root){  //如果不要添加一个根节点，那么把原来的根节点变成它的children
      rootnode = {id:'_root', key:'_root', text: root, level:0, parentnodeid:'', ancestor:'', isparentflag:1, isLeaf:false, children: rows};
      //console.log(111,rootnode);
      rows = [rootnode];
    }
    this.setState({data: rows}, () => {
      setTimeout(()=>{
        if (root) this.expandTreeNode(rootnode.id)
        this.myTree1.setState({selectedKeys: [rows[0].id]});
        onShow?.();
      })
    });
  }

  expandTreeNode = (key) => {
    //强制用语句展开结点
    if (this.myTree1.state.expandedKeys.indexOf(key)<0) this.myTree1.setExpandedKeys([...this.myTree1.state.expandedKeys, ...[key]]);
  }
  
  handleExpand = async (key,e)=>{
    //let node=e.node;
    //if (!e.expanded) return;
  }

  handleLoadData = async(node) => {
    let data =[...this.state.data];
    data = await this.loadTreeData(data, node)
    this.setState({data: data}, () => {
       setTimeout(()=>{
         //this.myTree1.setState({selectedKeys: [node.id]});
       })
    });
    return data;      
  }

  loadTreeData = async (data, node) => {
    let {sqlprocedure, loadall, root} = this.state;
    let p = parseSQLParams(this.state.attr);
    if (p == null) return;
    //节点展开时加载数据时触发
    //if (node?.children[0].id=='_'+node.id && node?.children[0].text.trim()==''){
    if (node.children && node.children.length>0 && node.children[0].id=='_'+node.id && node.children[0].text.trim()==''){
      p.style = "expand";
      p.parentnodeid = node.id;
      p.sqlprocedure = sqlprocedure;
      let rs = await reqdoTree(p);
      //必须设置叶子节点的isLeaf属性为true
      let rows=rs.rows;
      rows.forEach((item)=>{
        if (item.isparentflag==0) item.isLeaf=true;
      })
      //data = addTreeChildrenData(data, node, rows); //将rs.rows数据添加为node的子节点
      let pnode = findTreeNode(data, node.id);
      if (pnode){
        pnode.children = rows; //替换原数组data中的children值
        pnode.isLeaf = false;
      }
    }
    return data;
  }

  handleSelect = (key, e)=>{
    let {onSelect}=this.props;
    console.log(887,e.node);
    this.setState({node: e.node}, (e,key)=>{console.log(888,e.node);onSelect?.(key,e)});   //执行父组件的onselect事件
  }

  handleDoubleClick=(e, node)=>{
    //双节结点时选中这个结点，注意需要使用数组
    this.myTree1.setState({selectedKeys: [node.id]});
  }  
  
  handleSearchFilter = async () => {
    let {filterno, filterprocedure} = this.state;    
    filterno = 0;
    let p = {};
    p.filter = this.filtertext.state.value;
    p.sqlprocedure = filterprocedure;
    let rs=await reqdoSQL(p);  //提取全部的满足条件的记录
    this.setState({filteredData:rs.rows, filterno}, ()=>this.locateNode());
  }

  locateNode= async ()=>{
    let {filterno, filteredData} = this.state;
    let data = [...this.state.data];  //不能放到上面解构
    if (filteredData.length>0){
      if (filterno >= filteredData.length) filterno = filteredData.length-1;
      if (filterno < 0) filterno = 0;      
      let row = filteredData[filterno];
      //找到各层父节点，展开父节点
      if (row.ancestor.trim()!=''){
        let array=row.ancestor.split('#');  
        for (let i=0; i<array.length-1; i++){
           let node = findTreeNode(data, array[i]);
           data = await this.loadTreeData(data, node)
           this.expandTreeNode(node.id);
        } //for
      }
      this.setState({data:data, filterno}, () => {
        setTimeout(()=>{
          this.myTree1.setState({selectedKeys: [row.id]}, ()=>{
            if (document.getElementsByClassName('ant-tree-treenode-selected').length>0){
                document.getElementsByClassName('ant-tree-treenode-selected')[0].scrollIntoView()
            }
            //this.myTree1.scrollTo({key: rs.rows[0].id});  //没有效果                    
          });//选中结点    
        })
      });
    }  
  }

  handleMoveClick = async(id) => {      
    let {filterno, data, filteredData}=this.state;
    if (id=='movedown') filterno ++;
    else if (id=='moveup' && filterno>0)  filterno --;
    this.setState({filterno}, () => this.locateNode());
  }
      
  render() {
    let {width, onSelectNode, onSelect} = this.state.attr;
    let {loadall, filter} = this.state;    
    //console.log(666,filter);
    return (
      <Layout style={{overflow:'hidden', height:'100%', position:'relative'}}>
        {filter && <Header style={{ padding:0, paddingLeft:4, height: 35, lineHeight:'30px', backgroundColor: '#E0ECFF', borderBottom:'1px solid #95B8E7', overflow:'hidden'}}>
           <Form name='treefilterbar'>
              <AntdInputBox id='filtertext' ref={ref => this.filtertext = ref} top='2' left='6' width={width-80} type='search'onSearch={this.handleSearchFilter.bind(this)} />
              <Button type='link' id='moveup' style={{position:'absolute', top :1, right:30, width:20}} onClick={(e)=>this.handleMoveClick('moveup')}>{<UpOutlined />}</Button>
              <Button type='link' id='movedown' style={{position:'absolute', top :1, right:6, width:20}} onClick={(e)=>this.handleMoveClick('movedown')}>{<DownOutlined />}</Button>
           </Form>
        </Header>}
      <Content style={{overflow:'hidden', position:'relative', height:'100%'}}>
         <Tree ref={ref => this.myTree1 = ref} {...this.props}
          treeData={this.state.data}
          style={{margin:0, padding:0, overflow:'auto', width: width, position:'absolute', height:'100%', maxHeight:'100%'}}
          fieldNames={{title:'text', key:'id'}} showLine ={ true } checkable={false} icon={<PaperClipOutlined />} showIcon={true} blockNode={true}
          //switcherIcon={<DownOutlined /> }
          //autoExpandParent virtual             
          expandAction="doubleClick" 
          //onSelect={this.handleSelect.bind(this)} 
          onSelect={(key,e) =>{this.setState({node: e.node}); onSelectNode?.(key,e)}} //换个事件名称，不用onSelect,否则这里事件就被跳过
          onDoubleClick={this.handleDoubleClick.bind(this)}
          onExpand = {this.handleExpand.bind(this)}
          loadData = {loadall? undefined: this.handleLoadData.bind(this)}
          // titleRender = {(node)=>{
          //   let html
          //   if (node.isLeaf) html=<span style={{marginLeft:8}}><FileOutlined style={{marginRight:2}} />{node.text}</span>
          //   else html=<span style={{marginLeft:8}}><BlockOutlined style={{marginRight:2}} />{node.text}</span>                  
          //   return(html)
          // }} 
          >
         </Tree>
         </Content>
      </Layout>
    )
  }
}


export class AntdImage extends React.Component {  //class的名称必须大写字母开头
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

export class AntdImageUpload extends React.Component {  //class的名称必须大写字母开头
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

export class AntdHiddenField extends React.Component {  //class的名称必须大写字母开头
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
