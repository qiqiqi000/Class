import React from 'react';
//import { pinyin } from 'pinyin-pro';
//const str = "zhejiangligongdaxue浙江理工大学jingjiguanlixueyuan经济管理学院25-308办公室";
export default class Demo114 extends React.Component {
  findLongestCommonSubstring = (str1, str2) => {
    //str1='456789112345'
    //str2='5612341444478'
    //定义一个二维数组dp[i][j]，用来str1中第i个字符在str2中第j个字符中有没有出现
    /*
    1: dp[1][6]=1 dp[1][8]=1 dp[1][9]=1 dp[1][10]=1 dp[1][11]=1 
    5: dp[2][1]=1 
    6: dp[3][2]=1  
    7: dp[4][12]=1 
    8: dp[5][13]=1 
    9: 
    1: dp[7][3]=1  dp[7][7]=1 
    1: dp[8][3]=1  dp[8][7]=1 
    2: dp[9][4]=dp[8][3]+1=2  
    3: dp[10][5]=dp[9][4]+1=3  
    4: dp[11][6]=dp[10][5]+1=4 dp[11][8]=1 dp[11][9]=1 dp[11][10]=1 dp[11][11]=1  
    5：dp[12][1]=1    
    */
    const len1 = str1.length;
    const len2 = str2.length;
    const m = str1.length;
    const n = str2.length;
    //const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
    let dp=[];
    for (let i = 0; i <= len1; i++) {
      dp[i] = new Array(len2 + 1).fill(0);  //dp[i]均为0
    }
    dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
    console.log(dp);
    let maxLength = 0;
    let endIndex = -1;
    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        if (str1[i - 1] === str2[j - 1]) {
          dp[i][j] = dp[i - 1][j - 1] + 1;
          if (dp[i][j] > maxLength) {
            maxLength = dp[i][j];
            endIndex = i - 1;
          }
        } else {
          dp[i][j] = 0;
        }
      }
    }
  
    if (maxLength > 0) {
      //return str1.slice(endIndex - maxLength + 1, endIndex + 1);
      return str1.substr(endIndex - maxLength + 1, maxLength);
    }  
    return '';
  }  

  render() {   
    let s1='456789112345'
    let s2='5612341444478'
    return (  //输出各个元素变量    
      <div style={{marginLeft: 10, marginTop: 20}}>
        <div>{s1}</div>
        <div>{s2}</div>
        { this.findLongestCommonSubstring(s1, s2) }
      </div>
    )
  }
}

