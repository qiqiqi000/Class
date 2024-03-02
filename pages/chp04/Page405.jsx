import React, { Component } from 'react'
import { Tabs, TabPanel, LinkButton, Label, Layout, LayoutPanel } from 'rc-easyui';
import { Document, Page, pdfjs } from "react-pdf";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
//https://www.npmjs.com/package/react-pdf
//https://www.jianshu.com/p/d07519a9b335
//tabs
export default class Page405 extends Component {
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
        {"id":"8","title":"骁"}
      ],
      tabs:[],
      tabindex: 0,
      mp3file: '',
      pdffile: '',
      pdfPageno: 1
    };
  }  

  componentWillUnmount() {
    this.setState = (state, callback) => { return };
    this.state.brush && clearTimeout(this.state.brush);
  }


  handleClickTab1(item, e) {  //接受参数时，this在最后
    var tabs=[];
    tabs=[...this.state.tabs];
    var flag=-1;
    for (var i=0; i<tabs.length; i++){
      if (tabs[i].isbn === item.isbn) {
        flag=i;
        break;
      } 
    }
    console.log(111,flag,tabs);
    let file='http://localhost:8080/myServer/mybase/books/'+item.isbn+'.pdf'; 
    if (flag<0){
      //添加一个tabpanel
      let elem={};
      elem.isbn=item.isbn;
      elem.title=item.title;
      elem.filename=file;
      tabs.push(elem);
      this.setState({tabs: tabs}, () => {
        setTimeout(()=>{
            this.setState({pdfPageno:1})
            //this.setState({tabindex: tabs.length + 1})
            this.myTabs.select(tabs.length + 1);
        })
      });
    }else{  //选中已经存在的选项卡页面
      //let panel=this.myTabs.getPanel(flag+2);
      //this.setState({tabindex: flag+2});
      this.myTabs.select(flag+2);
    }
  }

  handleClickTab2(item, e) {  //接受参数时，this在最后
    let file='/myServer/mybase/mp3/'+item.title+'.mp3';    //file='/myServer/mybase/mp3/1.mp3';
    this.setState({mp3file: file}, () => {
        this.myTabs.select(1);
    });
  }  

  handleTabSelect(panel){
    //let index=this.myTabs.getPanelIndex(panel);
    //this.setState({tabindex: index});
  }

  handleTabClose(panel){
    var tabs=[];
    tabs=[...this.state.tabs];
  /*
    for (let i=0; i<tabs.length; i++){
      if (tabs[i].isbn === panel.props.isbn){
        tabs.splice(i,1);
        break;
      }
    }
  */    
    var tabs = this.state.tabs.filter(item => item.isbn !== panel.props.isbn);  //过滤掉这个元素
    //let index=this.myTabs.getPanelIndex(panel);
    this.setState({tabs: tabs}, () => {
        this.myTabs.select(0);
    });
  }

  render() {
    const tabHeader = (panel) => {
      return (
        <div className="tt-inner">
          <img alt="" src={require('../../images/pdf24.png')} />
          <p>{panel.title}</p>
        </div>
      )
    }
    return (
      <div>
        <Tabs ref={ref => this.myTabs = ref} tabPosition='top' style={{height: '100%', width: '100%', position:'absolute'}}
         xonTabSelect={(panel) => {this.handleTabSelect(panel)}} 
         onTabClose={(panel) => {this.handleTabClose(panel)}} plain>
          <TabPanel ref={ref => this.myTab1 = ref} key="myTab1" title="图书列表" iconCls="pdfIcon">
            {
              this.state.books.map((item, index)=>{
                return(
                  <div key={"div1_"+index} style={{marginLeft:12, marginTop:6}}>
                    <a href="#" onClick={this.handleClickTab1.bind(this, item)}><img src={require('../../images/pdf24.png')} width="16" height="16" style={{marginRight:8}}/>{item.title}</a>
                  </div>             
                )
              })
            }
          </TabPanel>
          <TabPanel ref={(ref) => this.myTab2 = ref} title="歌曲列表">
            <Layout style={{ width: '100%', height: '100%', position:'absolute' }}>
                <LayoutPanel region="west" style={{ width: 280 }} split={true}>
                  {
                    this.state.songs.map((item, index)=>{
                      return(
                        <div key={"div2_"+index} style={{marginLeft:12, marginTop:4}}>
                          <a href="#" onClick={this.handleClickTab2.bind(this, item, 'tab2')}><img src={require('../../images/play.png')} width="20" height="20" style={{marginRight:8}}/>{item.title}</a>
                        </div>             
                      )
                    })
                  }
                </LayoutPanel>
                <LayoutPanel region="center" style={{ height: '100%' }}>
                  <audio id="myMp3" src={this.state.mp3file} controls="controls" autoPlay="autoplay" preload="auto" style={{position:'absolute', top:60, left:40, width:600}}></audio>
                </LayoutPanel>
            </Layout>
          </TabPanel>
            {
              this.state.tabs.map((item, index) => {
                  return(
                    <TabPanel isbn={item.isbn} key={"myTab_"+item.isbn} title={item.title} closable>
                       <iframe src={item.filename} frameBorder="0" width="100%" height="100%"></iframe>
                    </TabPanel>
                  )
              })
            }
        </Tabs>        
      </div>
    )
  }
}