import React, { Component, useRef } from 'react'
import { Layout, LayoutPanel, Panel, Label, CheckBox, TextBox, DateBox, NumberBox, RadioButton, ComboBox, LinkButton, MenuItem } from 'rc-easyui';
import {MyTextBox, MyDefTextBox, reqdoSQL, Timer, Weather} from '../../api/easyUIComponents.js';
import axios from 'axios';
export default class Page404 extends Component {
  constructor(props) {
    super(props);
    //在这里初始化 state
    this.state = {
      srcaudio:'',
      rate:[1,2,4,8],
      stri:''
    };
    //this.showOrders=this.showOrders.bind(this);
  }
  handleclick=()=>{
    this.setState({srcaudio:'/myServer/mybase/mp3/'+'滕王阁'+'.mp3'})
  }
  handlerate=(e)=>{
    this.audios.playbackRate=e.target.id
    
  }
  handleupdate=()=>{
    if(this.audios.currentTime<26) this.setState({stri:'豫章故郡，洪都新府。星分翼轸，地接衡庐。襟三江而带五湖，控蛮荆而引瓯越'})
    if(this.audios.currentTime<52 && this.audios.currentTime>26) this.setState({stri:'物华天宝，龙光射牛斗之墟；人杰地灵，徐孺下陈蕃之榻。雄州雾列，俊采星驰。台隍枕夷夏之交，宾主尽东南之美'})
    if(this.audios.currentTime<73 && this.audios.currentTime>52) this.setState({stri:'都督阎公之雅望，棨戟遥临；宇文新州之懿范，襜帷暂驻。十旬休假，胜友如云；千里逢迎，高朋满座。'})
  }
  render() {
    return (
      <div ref={c=>this.abc=c} id='abc'>
        <Layout style={{ width: '100%', height: '100%',position:'absolute' }}>
          <LayoutPanel region="west" style={{ width: 280 }} split={true}>
            <div style={{paddingLeft:20,paddingTop:20}}>
              <a href='#' style={{fontSize:20}} 
              onClick={this.handleclick}
              >
              滕王阁序</a>
            </div>
          </LayoutPanel>
          <LayoutPanel region="center" style={{ height: '100%' }}>
            <div>
              <Layout style={{ width: '100%', height: '100%', position:'absolute' }}>
                <LayoutPanel region="north" style={{ height: 240 }} split={true}>
                <audio src={this.state.srcaudio}
                id='audio'
                controls="controls" 
                preload="auto"
                autoPlay="autoplay"
                style={{paddingLeft:20,paddingTop:20}}
                ref={c=>this.audios=c}
                onTimeUpdate={this.handleupdate}
                >
                </audio>
                {
                  this.state.rate.map((item,index)=>{
                    return(
                      <button id={item} onClick={this.handlerate}
                      key={index+'btn'}
                      style={{marginLeft:10,marginTop:20,height:40,textAlign:'center'}}>
                        {item}倍速
                      </button>
                    );
                  })
                }
                </LayoutPanel>
                <LayoutPanel region="center" style={{height: '100%'}}>
                  <div>
                    {this.state.stri}
                  </div>
                </LayoutPanel>
              </Layout>            
            </div>
          </LayoutPanel>
        </Layout>
      </div>              
    )
  }
}