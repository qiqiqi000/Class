import React, { Component } from 'react'
import captions from '../../data/滕王阁序.json';
//React.sys.rowheight = 55 ;
export default class Page208 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showPlayer: true,
      loopPlayer: true,
      subtitles: captions,
      currentSubtitleIndex: 0,
      src: 'myServer/mybase/mp3/滕王阁序(女).mp3', //mp3文件
      //src: require('../../data/滕王阁序(女).mp3')  // '/myServer/mybase/mp3/滕王阁序(女).mp3'      
    };
  }

  componentDidMount() {
    React.sys.rowheight = 55 ;
    this.audioRef.loop = this.state.loopPlayer;    
    this.audioRef.play();
    //this.showSubtitle();
  }

  componentWillUnmount() {
    this.audioRef.pause();
    this.audioRef.currentTime = 0;
  }

  togglePlayer = () => {
    this.setState(prevState => ({ showPlayer: !prevState.showPlayer }));  //prevState时修改之前的state状态值
  };

  startPlayer = () => {
    if (!this.audioRef) return;
    this.audioRef.currentTime = 0;
    //重新播放以后从头开始显示字幕
    this.setState({ currentSubtitleIndex: 0 });
    //this.showSubtitle();
    this.audioRef.play();
  };

  loopPlayer = () => {  //循环播放
    if (!this.audioRef) return;
    this.setState(prevState => ({ loopPlayer: !prevState.loopPlayer }), ()=>this.audioRef.loop = this.state.loopPlayer);
    //this.audioRef.loop = true;  //false
  };

  //按照时间显示字幕
  showSubtitle = () => {//可以直接写在onTimeUpdate里面不用单独写一个方法
    this.audioRef.ontimeupdate = () => {
      //if (this.audioRef.currentTime >= captions[this.state.currentSubtitleIndex].endtime) {
      //  this.setState({ currentSubtitleIndex: this.state.currentSubtitleIndex+1 });
      //}
      //如将进度条往前往后拖动，字幕也要跟着变化
      //if (this.audioRef.currentTime < captions[this.state.currentSubtitleIndex].starttime) {
      //  this.setState({ currentSubtitleIndex: this.state.currentSubtitleIndex-1 });
      //}
      //上面的方法有问题，如果拖动进度条，字幕会一条一条的显示，而不是直接显示当前时间对应的字幕

      //拖动进度条时，字幕也要跟着变化，直接显示当前时间对应的字幕而不是一条一条的显示
      for (let i = 0; i < captions.length; i++) {
        if (this.audioRef.currentTime >= captions[i].starttime && this.audioRef.currentTime < captions[i].endtime) {
          this.setState({ currentSubtitleIndex: i });
        }
        this.subtitlescroll();
      }
    }
  }

  handleTimeUpdate = (e) => {
    //拖动进度条时，字幕也要跟着变化，直接显示当前时间对应的字幕而不是一条一条的显示
    //console.log(444,this.audioRef);
    if (!this.audioRef) return;
    console.log(this.audioRef.currentTime);
    for (let i = 0; i < captions.length; i++) {
      if (this.audioRef.currentTime >= captions[i].starttime && this.audioRef.currentTime < captions[i].endtime) {
        this.setState({ currentSubtitleIndex: i });
      }
      this.subtitlescroll();
    }
  }

  //如果当前播放的歌词超出了屏幕，就让它自动滚动,这个方法歌词的位置不太精确，有待改进
  subtitlescroll = () => {
    let currentSubtitle = document.getElementById('currentSubtitle');
    let currentSubtitleTop = currentSubtitle.offsetTop;
    let currentSubtitleHeight = currentSubtitle.offsetHeight;
    let currentSubtitleContainer = document.getElementById('currentSubtitleContainer');
    let currentSubtitleContainerHeight = currentSubtitleContainer.offsetHeight;
    // 计算使当前播放歌词处于歌词容器中间的滚动位置
    let scrollOffset = currentSubtitleTop - (currentSubtitleContainerHeight - currentSubtitleHeight) / 2;
    // 设置歌词容器的滚动位置，使当前播放歌词处于中间
    currentSubtitleContainer.scrollTop = scrollOffset;
  }

  handleSubtitleClick = (index) => {
    const subtitle = captions[index];
    this.audioRef.currentTime = subtitle.starttime;
    //this.audioRef.play();
    this.setState({ currentSubtitleIndex: index }, () =>
      this.scrollToVisibleSubtitle()
    );
  }

  render() {
    return (
      <div style={{ textAlign: 'center', width: 700, margin: '0 auto', overflow: 'hidden'}}>
        <div>
          {this.state.showPlayer && <audio ref={ref=>this.audioRef=ref} style={{height:60, width: 600 }} 
          onTimeUpdate={this.handleTimeUpdate} controls >
            <source src={this.state.src} type="audio/mpeg" />
          </audio>}
        </div>
        <div>
          <button onClick={this.togglePlayer} style={{marginLeft: 16}} >
            {this.state.showPlayer ? '隐藏播放器' : '显示播放器'}          
          </button>
          <button onClick={this.startPlayer}>重新播放</button>
          <label key='label1' id='label1' htmlFor='loopplayer' style={{marginLeft:12}}>循环播放：</label>
          <label key='label11' style={{marginRight: 10, display: 'inline-block'}}>
            <input type='radio' id='loopplayer1' key='loopplayer1' name='loopplayer' value='1' checked={this.state.loopPlayer} onChange={this.loopPlayer} />
            开
          </label>
          <label key='label12' style={{marginRight: 10, display: 'inline-block'}}>
            <input type='radio' id='loopplayer2' key='loopplayer2' name='loopplayer' value='0' checked={!this.state.loopPlayer} onChange={this.loopPlayer} />
            关
          </label>
        </div>        
        <div id='currentSubtitleContainer' style={{ height: 360, marginTop: 20, textAlign: 'center', overflowY: 'auto', background: 'black', border:'1px solid #95B8E7', transition: 'all 0.5s' }}>
          {captions.map((item, index) => {
            if (index === this.state.currentSubtitleIndex) {
              return <div id='currentSubtitle' key={item + index} style={{ color: '#fff', fontSize: 18, transition: 'all 0.5s', height: 20, marginTop: 10 }}>{item.words}</div>
            } else {
              return <div key={item + index} style={{ color: '#666', fontSize: 14, transition: 'all 0.5s', height: 20, marginTop: 10 }}
              onClick={() => this.handleSubtitleClick(index)}
              >
                {item.words}
              </div>
            }
          })}
        </div>
      </div>
    );
  }
}
