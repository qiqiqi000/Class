import React, { Component } from 'react'
import '../../css/style.css';
export default class Page209 extends Component {
  constructor(props) { //构造函数  子组件，被调用，参数属性传过来
    super(props);
    this.state = {
      rowheight: 40,
    }
  };

  handleButtonClick = (param) => {  //箭头函数
    console.log('按钮已点击:', param);
  };

  handleImageClick(e,imageName) {  //普通函数
    console.log('图片已点击:', imageName);
    //alert(`Image clicked: ${imageName}`);
  };

  render(){
    let imageUrl;
    try {
        imageUrl = require('../../images/camera.png');    
    } catch (error) {
        imageUrl = null;
    }
    return (
      <div>
        <p><button onClick={() => this.handleButtonClick('confirm')}>点击确定</button></p>
        <p><button onClick={() => this.handleButtonClick('cancel')}>点击取消</button></p>
        <p><img src={imageUrl} alt="数码相机" width="100" onClick={() => this.handleImageClick('image.jpg')} /></p>
        <p><img src="/myServer/mybase/products/3.jpg" alt="数码相机" width="100" onClick={(e) => this.handleImageClick(e,'3.jpg')} /></p>
      </div>
    );
  }
}    