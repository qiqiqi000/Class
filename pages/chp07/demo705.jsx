import React from 'react';
import { Collapse, Tabs, List, Layout, Menu, Form, Button, Image } from 'antd'
//import dayjs from 'dayjs';
//import 'dayjs/locale/zh-cn';
//import locale from 'antd/locale/zh_CN'
import '../../css/style.css';
import { mySetFormValues,myResetJsonValues } from '../../api/antdComponents.js'
import { ReadOutlined, FilePdfOutlined, SoundOutlined, CloseOutlined } from '@ant-design/icons';
//import ButtonGroup from 'antd/es/button/button-group';
//import { reqdoSQL, reqdoTree, myStr2JsonArray, myDatetoStr, myHeader} from '../../api/functions.js'
//import { Document, Page, pdfjs } from "react-pdf";
//pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
//https://www.npmjs.com/package/react-pdf
//https://www.jianshu.com/p/d07519a9b335
//tabs
const { Header, Content, Footer, Sider } = Layout;

export default class Page705 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      books:[{"isbn":"139780133970777","title":"数据库：原理、技术与应用"},{"isbn":"139781292094007","title":"管理信息系统"},{"isbn":"2022React-0905","title":"软件开发工具"},{"isbn":"datastructure-js","title":"数据结构"}],
      songs:[
        {"id":"1","title":"白狐"},
        {"id":"2","title":"爱江山更爱美人"},
        {"id":"3","title":"玛尼情歌"},
        {"id":"4","title":"你的样子"},
        {"id":"5","title":"可可托海的牧羊人-亚男"},
        {"id":"6","title":"深情败给时间-男"},
        {"id":"7","title":"深情败给时间-女"},
        {"id":"8","title":"骁"},
        {"id":"9","title":"早安隆回", filename:"早安隆回.flac"}
      ],
      fixedtabs:[{key:'myTab1', label:'图书', children:''},{key:'myTab2', label:'歌曲', children:''}],
      tabs:[],
      activeTabKey: 'myTab1',
      mp3file: '',
      pdffile: '',
      pdfPageno: 1
    };
  }  

  componentDidMount() {
    this.myTab1Children(); 
    this.myTab2Children(); 
  }

  componentWillUnmount() {
    //this.setState = (state, callback) => { return };
    //this.state.brush && clearTimeout(this.state.brush);
  }


  myTab1Children = () => {
    let rs=this.state.books.map((item, index)=>{
      return(
        <div key={'btn_'+index} style={{marginLeft:0, marginTop:4}}>
          <Button type='link' onClick={()=>this.handleClickTab1(item)}><img src={require('../../images/pdf24.png')} width="16" height="16" style={{marginRight:8}}/>{item.title}</Button>
        </div>             
      )
    })
    let tabs=[...this.state.fixedtabs];
    tabs[0].children=rs;
    tabs[0].label=<span><ReadOutlined />图书列表</span>
    tabs[0].closable=false;
    this.setState({fixedtabs: tabs});
  }

  myTab2Children = () => {
    let rs = this.state.songs.map((item, index)=>{
      return(
       <div key={"song_"+index} style={{marginLeft:12, marginTop:4}}>
          <a href="#" onClick={()=>this.handleClickTab2(item)}><img src={require('../../images/play.png')} width="20" height="20" style={{marginRight:8}}/>{item.title}</a>
       </div>             
    )})
    let tabs=[...this.state.fixedtabs];
    tabs[1].label=<span><SoundOutlined />歌曲列表</span>    
    tabs[1].children=
      <Layout style={{ width: '100%', height: '100%', position:'relative' }}>
        <Sider style={{ width: 300 }}>{rs}</Sider>
        <Content style={{ height: '100%', position:'relative' }}>
            <audio id="myMp3" src={this.state.mp3file}  
             controls="controls" autoPlay="autoplay" preload="auto" style={{position:'absolute', top:60, left:40, width:600}}></audio>
        </Content>
      </Layout>
    tabs[1].closable=false;
    this.setState({fixedtabs: tabs});
    //console.log(22,rs);    
  }

  handleClickTab1(item) {  //接受参数时，this在最后    
    let tabs=[...this.state.tabs];
    let flag=tabs.findIndex(row => row.isbn===item.isbn);
    //let file='/myServer/mybase/books/'+item.isbn+'.pdf'; 
    let file='http://localhost:8080/myServer/mybase/books/'+item.isbn+'.pdf'; 
    if (flag<0){
      //添加一个tabpanel
      let elem={};
      elem.isbn=item.isbn;
      elem.title=item.title;
      elem.filename=file;
      elem.key=elem.isbn; //'myTab'+parseInt(this.state.fixedtabs.length+this.state.tabs.length+1);
      //elem.id=elem.key;
      elem.label=<span><FilePdfOutlined />{elem.title}</span>;
      elem.closable= true;
      elem.children=(<iframe src={file} frameBorder="0" scrolling="no" height="100%" width="100%" ></iframe>)
      tabs.push(elem);
      console.log(111,flag,elem);
      this.setState({tabs: tabs, activeTabKey: elem.key}, () => {
        setTimeout(()=>{
            this.setState({pdfPageno:1})
        })
      });
    }else{  //选中已经存在的选项卡页面
      this.setState({activeTabKey: this.state.tabs[flag].key});
    }
  }

  handleClickTab2(item) {  //接受参数时，this在最后
    let file;
    if (item.filename === undefined) file='/myServer/mybase/mp3/'+item.title+'.mp3';
    else file='/myServer/mybase/mp3/'+item.filename;
    document.getElementById('myMp3').src=file;
    this.setState({mp3file: file}, () => {
      //this.setState({activeTabKey: this.state.fixedtabs[1].key});
    });
  }  

  handleTabSelect(key,e){
    //console.log(444,key,e)
    this.setState({activeTabKey: key});
  }

  handleTabEdit=(key)=>{
    console.log(11111, key);
    let tabs=[...this.state.tabs];
    tabs = tabs.filter((item) => item.key !== key);  //过滤掉这个元素
    this.setState({tabs: tabs}, () => {
       this.setState({activeTabKey: this.state.fixedtabs[0].key});
    });
  }

  render() {
    return (
      <Tabs type="editable-card" tabPosition='top' hideAdd activeKey={this.state.activeTabKey} 
       onChange={this.handleTabSelect.bind(this)}
       onEdit={this.handleTabEdit.bind(this)}
       style={{padding:0, height: '100%', width: '100%', position:'absolute', overflow:'hidden'}}
       items={[...this.state.fixedtabs, ...this.state.tabs]} />          
    )
  }
}