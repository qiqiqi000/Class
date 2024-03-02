import React, { Component } from 'react';
import {StarFilled} from '@ant-design/icons';

export  class Rate extends Component { //自定义的Rate组件
  constructor(props) {
    super(props);
    this.state = {
      index: 0,
      rateValue:null
    };
  }

  handleMouseOver (e,index) {
    this.setState({index})
  }
  handleMouseLeave (e,index) {
    this.setState({index:0})
  }
  handleChosen (e,index) {
    this.setState({rateValue: index})
  }
  render() {
    let {character,count,fontFamily,fontSize,style,interval} = this.props
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    const text = character;
    context.font = `${fontSize}px ${fontFamily}`;
    const textWidth = context.measureText(text).width;
    const textHeight = context.measureText(text).height;

    return (
          <div className='rate'style={{...style,fontFamily:fontFamily,display:'flex'}}>
            {Array.from({ length: count }, (item, index) => (
              <div key={`myindex${index}`} style={{position: 'relative' , marginRight:interval}}>
                <span style={{fontSize: fontSize ,color:'#f0f0f0'}}>{character}</span>
                <div className='lighted' key={`rate_${index+0.5}`}  style = {{display: 'flex', position: 'absolute',left: 0, top: 0}}>
                  <div className='leftMask' key={`ratescore_${index+0.5}`} 
                    onClick={(e) => {this.handleChosen(e,index+0.5)}}
                    onMouseOver={(e) => this.handleMouseOver(e,index+0.5)} 
                    onMouseLeave={(e) => this.handleMouseLeave(e,index)} 
                    style={{opacity: (this.state.index ==0 && index+0.5 <= this.state.rateValue) || index+0.5 <= this.state.index?1:0, width: typeof character === 'string' ? textWidth/2 : fontSize/2 ,height: typeof character === 'string' ? textHeight : fontSize , cursor: 'pointer',overflow: 'hidden'}}>
                    <span style={{fontSize: fontSize ,color:'#fadb14'}}>{character}</span>
                  </div>
                  <div className='rightMask' key={`ratescore_${index+1}`} 
                  onClick={(e) => {this.handleChosen(e,index+1)}}
                  onMouseOver={(e) => this.handleMouseOver(e,index+1)} 
                  onMouseLeave={(e) => this.handleMouseLeave(e,index)}
                  style={{opacity: (this.state.index ==0 && index+1 <= this.state.rateValue) || index+1 <= this.state.index? 1:0 ,width: typeof character === 'string' ? textWidth/2 : fontSize/2 ,height: typeof character === 'string' ? textHeight : fontSize,cursor: 'pointer',overflow: 'hidden'}} >
                    <span style={{fontSize: fontSize,color:'#fadb14',display:'inline-block', transform: 'translateX(-50%)'}}>{character}</span>
                </div>
            </div> 
          </div>
          ))}

        </div>
    
   
    )
  }
}

export default class Page211 extends Component { //演示Rate组件
  render(){
    return(
      <div style={{display:'flex',justifyContent: 'center',alignItems:'center', height:'80%'}}>
        <div style={{display: 'flex',flexDirection:'column',width:600,height:320,background:'#fff',border:'1px solid #fff',borderRadius:'20px',padding:'10px 20px'}}>
          <h1>评价</h1>
          {/* <Rate ref={ref=>this.rate1=ref} character={<StarFilled />} fontFamily='Arial' fontSize={48} count={5} style={{margin:'0 160px'}}></Rate> */}
          <Rate ref={ref=>this.rate2=ref} character='赞' fontFamily='Arial' fontSize={48} count={5} style={{margin:'0 160px'}}></Rate>
          <Rate ref={ref=>this.rate3=ref} character='A' fontFamily='Arial' fontSize={48} count={5} interval={20} style={{margin:'0 160px'}}></Rate>
        </div>
      </div>
    )
  }
}