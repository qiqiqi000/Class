import React, { Component } from 'react';
import subtitleData from '../../data/滕王阁序.json';
export default class Page208 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      //src: require('../../data/滕王阁序(女).mp3'), //mp3文件
      src: 'myServer/mybase/mp3/滕王阁序(女).mp3', //mp3文件    
      showPlayer: true,  //是否显示播放器
      loopPlayer: true,  //是否循环播放
      subtitles: subtitleData,   //字幕
      currentSubtitleIndex: 0,  //字幕的数组下标
      scrollToIndex: -1  //滚动位置，对应哪条字幕的数组下标
    };
    this.subtitleContainerRef = React.createRef(); //生成一个ref  
    this.audioRef = React.createRef(); //生成一个ref  
  }

  componentDidMount() {
    if (!this.audioRef.current) return;
    this.audioRef.current.loop = this.state.loopPlayer;  //设置是否循环播放的初值
    this.audioRef.current.play();   //开始播放
    //this.showSubtitle();  //显示字幕
    this.scrollToVisibleSubtitle();  //处理滚动条
  }

  componentWillUnmount() {
    if (!this.audioRef.current) return;
    this.audioRef.current.pause();
    this.audioRef.current.currentTime = 0;
  }

  togglePlayer = () => {
    this.setState(prevState => ({ showPlayer: !prevState.showPlayer }));
  };
  loopPlayer = () => {
    this.setState(prevState => ({ loopPlayer: !prevState.loopPlayer }), () => (this.audioRef.current.loop = this.state.loopPlayer));  //设置循环播放的状态为原值的反值
  };

  startPlayer = () => {
    if (!this.audioRef.current) return;
    this.audioRef.current.currentTime = 0;  //从头开始播放
    this.setState({ currentSubtitleIndex: 0 });  //字幕重新设置为0开始
    this.audioRef.current.play();
  };

  handleTimeUpdate = () => {
    if (!this.audioRef.current) return;
    const currentTime = this.audioRef.current.currentTime;
    //if (this.audioRef.current.paused || currentTime < subtitleData[this.state.currentSubtitleIndex].starttime || currentTime >= subtitleData[this.state.currentSubtitleIndex].endtime) {
      let index = subtitleData.findIndex((item)=>(currentTime >= item.starttime && currentTime < item.endtime))
      if (index>=0) this.setState({currentSubtitleIndex: index}, () => this.scrollToVisibleSubtitle());
      /*
      for (let i = 0; i < subtitleData.length; i++) {
        if (currentTime >= subtitleData[i].starttime && currentTime < subtitleData[i].endtime) {
          this.setState({ currentSubtitleIndex: i }, () =>
            this.scrollToVisibleSubtitle()
          );
          break;
        }
      }
      */
    //}
  };

  /*另一种写法
  showSubtitle = () => {
    if (!this.audioRef.current) return;
    this.audioRef.current.ontimeupdate = () => {
      const currentTime = this.audioRef.current.currentTime;
      if (this.audioRef.current.paused || currentTime < subtitleData[this.state.currentSubtitleIndex].starttime || currentTime >= subtitleData[this.state.currentSubtitleIndex].endtime) {
        for (let i = 0; i < subtitleData.length; i++) {
          if (currentTime >= subtitleData[i].starttime && currentTime < subtitleData[i].endtime) {
            this.setState({ currentSubtitleIndex: i }, () =>
              this.scrollToVisibleSubtitle()
            );
            break;
          }
        }
      }
    };
  };
  */

  handleSubtitleClick = (index) => {  //点击字幕时触发
    if (!this.audioRef.current) return;
    this.audioRef.current.currentTime = subtitleData[index].starttime;
    this.audioRef.current.play();
    this.setState({ currentSubtitleIndex: index }, () => this.scrollToVisibleSubtitle());
  };

  scrollToVisibleSubtitle = () => {
    /*
    这段代码的意思是将包含指定字幕的元素滚动到可视区域内，使其居中显示，并且使用平滑的滚动效果。让我逐步解释一下代码的不同部分：
    subtitleElement.scrollIntoView({ ... });: 这是一个用于滚动元素到可视区域的方法调用。subtitleElement 是要滚动到可视区域的目标元素，这可能是一个包含特定字幕内容的 HTML 元素。
    behavior: 'smooth': 这是滚动行为的设置选项之一。通过将滚动行为设置为 'smooth'，滚动会以平滑的方式进行，而不是立即跳转到目标位置。
    block: 'center': 这是垂直方向对齐选项。'center' 表示将目标元素的中心对齐到可视区域的中心位置，从而使该元素在可视区域内居中显示。
    综合起来，这段代码的作用是以平滑的方式将包含特定字幕内容的元素滚动到可视区域内，并使其在垂直方向上居中显示。这在网页中常常用于在用户与页面交互时，将特定内容自动滚动到用户的视野范围内，以提供更好的用户体验。    
    */
    const {currentSubtitleIndex, scrollToIndex} = this.state;
    //this.subtitleContainerRef.current.children为这个层下面的各个元素，这里主要是字幕外面的层
    if (currentSubtitleIndex !== scrollToIndex && this.subtitleContainerRef.current) {
      const subtitleElement = this.subtitleContainerRef.current.children[currentSubtitleIndex];
      if (subtitleElement) {
        subtitleElement.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
        this.setState({ scrollToIndex: currentSubtitleIndex });
      }
    }
  };

  render() {
    return (
      <div style={{ textAlign: 'center', width: 700, margin: '0 auto', overflow: 'hidden' }}>
        <div>
        {this.state.showPlayer && <audio ref={this.audioRef} style={{ height: 60, width: 600 }} onTimeUpdate={this.handleTimeUpdate} controls>
            <source src={this.state.src} type="audio/mpeg" />
          </audio>}
        </div>
        <div>
          <button onClick={this.togglePlayer} style={{ marginLeft: 16 }}>
            {this.state.showPlayer ? '隐藏播放器' : '显示播放器'}
          </button>
          <button onClick={this.startPlayer}>重新播放</button>
          <label key="label1" id="label1" htmlFor="loopplayer" style={{ marginLeft: 12 }}>
            循环播放：
          </label>
          <label key="label11" style={{ marginRight: 10, display: 'inline-block' }}>
            <input type="radio" id="loopplayer1" key="loopplayer1" name="loopplayer" value="1"
              checked={this.state.loopPlayer} onChange={this.loopPlayer} />
            开
          </label>
          <label key="label12" style={{ marginRight: 10, display: 'inline-block' }}>
            <input
              type="radio" id="loopplayer2" key="loopplayer2" name="loopplayer" value="0"
              checked={!this.state.loopPlayer} onChange={this.loopPlayer} />
            关
          </label>
        </div>
        <div id="currentSubtitleContainer" ref={this.subtitleContainerRef} style={{ height: 360, marginTop: 20, textAlign: 'center', overflowY: 'auto', background: 'black', transition: 'all 0.5s' }}>
          {subtitleData.map((item, index) => {
            return (
              <div key={item + index} onClick={() => this.handleSubtitleClick(index)} style={{color: index === this.state.currentSubtitleIndex ? '#fff' : '#666',
               fontSize: index === this.state.currentSubtitleIndex ? 18 : 15, transition: 'all 0.5s', height: 20, marginTop: 10, cursor: 'pointer'}}>
                {item.words}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}