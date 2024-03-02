import React from 'react';
import '../../css/style.css';
import axios from "axios";
import { myPreventRightClick, myDoFiles, myFileSize, myLocalTime } from '../../api/functions.js';
import { notification, message,Layout, Form, Button, Upload } from 'antd';
import { FileOutlined, UploadOutlined, ReadOutlined, FilePdfOutlined, SoundOutlined, CloseOutlined } from '@ant-design/icons';

//https://ant.design/components/overview-cn/
//fileupload
const { Header, Content, Footer, Sider } = Layout;

export default class Page706 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rowheight: 42,
      uploading: false,
      fileList: [],
      previewfile: '',
      files: [  //uid属性是必须的，不是key属性。name属性也是必须的
        {uid:'1', name:'xxx1.png', url: 'http://www.baidu.com/xxx.png'},
        {uid:'2', name:'xxx2.png', url: 'http://www.baidu.com/xxx.png'},
        {uid:'3', name:'xxx3.png', url: 'http://www.baidu.com/xxx.png'}
      ]
    }
  }
    

  handleChange(e) {
    this.setState({ fileList: e.fileList })
  }

  handlePreview(file) {
    //点击预览文件
    let index=this.state.fileList.findIndex((f) => f.uid==file.uid);
    if (index<0 || this.state.fileList.length==0) return;
    let f=this.state.fileList[index];  
    let type=file.type;    
    if (type.indexOf('/pdf')>=0 && f.filename!=''){
      this.setState({previewfile: 'http://localhost:8080/myServer/'+f.filename})
    }else if (type.indexOf('image/')>=0 && f.filename!=''){
      console.log(123,type,f.filename);
      this.setState({previewfile: 'http://localhost:8080/myServer/'+f.filename})

    }
    return;
  }

  async handleRemoveFile(file) {
    //是否删除已经上传到服务器的文件
    //console.log(111,file);    
    let index=this.state.fileList.findIndex((f) => f.uid==file.uid);
    if (index<0 || this.state.fileList.length==0) return;
    let f=this.state.fileList[index];
    if (f.filename != undefined && f.filename != ''){
      var rs=myDoFiles('delete', f.filename,'');
    }   
    //let files = this.state.fileList.filter(f => f !== file);
    //this.setState({ fileList: files })
    return;
  }

  handleClear() {
    this.setState({ fileList: [] })
  }
  
  beforeUpload = (file) => {
    //选中文件时不上传文件，单独设置上传按钮。
    return false;  //不立即上传文件
  }

  async handleUpload() {
    this.setState({uploading: true});
    let n=0;
    let files = this.state.fileList;
    for (let i=0; i<files.length; i++){
       let formData = new FormData();
       //同一文件上传的文件名只有一个
       let targetfile;
       if (files[i].targetfile && files[i].targetfile!='') targetfile=files[i].targetfile;
       else targetfile="res_"+myLocalTime('').timestamp;  //文件名带时间戳
       formData.append("targetpath", "mybase\\resources");  //文件路径
       //formData.append("targetfile", "res_"+(i+1));  //目标文件名，不加文件扩展名
       formData.append("targetfile", targetfile);  //目标文件名，与时间戳有关       
       formData.append("file", files[i].originFileObj);  //上传第一个文件
       const config = { headers: {"Content-Type": "multipart/form-data"} }
       await axios.post("/myServer/doFileUpload", formData, config).then(res => {
         //服务器端返回文件名称，实际文件名。如果文件名为空表示文件上传失败
         let json=res.data;
         if (json.targetfile=='') n++;
         files[i].targetfile=targetfile;
         files[i].filename=json.filename;
         files[i].realfilename=json.realfilename;
       })       
     }
     //console.log(779,files)
     this.setState({fileList: files});
     if (n==0) notification.success({message:'系统通知', description: '共'+files.length+'个文件上传成功!', duration:2});
     else if (n<files.length) notification.warning({message:'系统通知', description: '共'+files.length+'个文件上传成功，'+n+'个文件上传失败！', duration:2});
     else notification.error({message:'系统通知', description: '共'+n+'个文件上传失败!', duration:2});
     this.setState({uploading: false});
   }

   render() {
     return (
      <Layout style={{overflow:'hidden'}}>
        <Sider theme='light' width={450} style={{marginLeft:3, borderRight:'1px solid #95B8E7',position:'relative', 
         overflow:'auto', height:'100%'}}>
           <Form name="myForm1" ref={ref=>this.myForm1=ref} autoComplete="off"
            style={{height:'100%', position:'absolute', overflow:'auto', marginLeft:10, marginTop:8}} >            
            <Upload multiple maxCount={5} listType="text" defaultFileList={this.state.fileList} 
              showUploadList={{
                showPreviewIcon: true,
                showDownloadIcon: true,  
                downloadIcon: '下载',                
                showRemoveIcon: true
              }} 
              progress={ {
                strokeColor: {
                  '0%': '#108ee9',
                  '100%': '#87d068',
                },
                strokeWidth: 3,
                format: (percent) => percent && `${parseFloat(percent.toFixed(2))}%`,
              }}
            
              onPreview={this.handlePreview.bind(this)}
              onRemove={this.handleRemoveFile.bind(this)}
              beforeUpload={this.beforeUpload.bind(this)}
              onChange={this.handleChange.bind(this)} action='' 
            >
            <Button type='primary' icon={<FileOutlined />}>选择文件</Button> 
            </Upload>
            <Button type="primary" onClick={this.handleUpload.bind(this)} disabled={this.state.fileList.length === 0} 
             loading={this.state.uploading} style={{ marginTop: 16, marginBottom: 16 }} icon={<UploadOutlined />}>
                {this.state.uploading ? '正在上传' : '开始上传'}
            </Button>
            
           </Form>                
        </Sider>
        <Content style={{height:'100%', width:'100%', padding:0, marginLeft:3, position:'relative', borderLeft:'1px solid #95B8E7'}}>
           <iframe src={this.state.previewfile} frameBorder="0"  height="100%" width="100%" ></iframe>

        </Content>
    </Layout>      
     )
  }
}
