import React from 'react';
//定义一个json常量
const user = {
    name: '诸葛亮',
    courtesyname: '孔明',
    age: 35,
    alias: '卧龙',
    hometown: '四川省绵阳市茂县人',
    title: '蜀汉丞相'
};
const noteContent = '诸葛亮早年随叔父诸葛玄到荆州，诸葛玄死后，诸葛亮就在隆中隐居。后刘备三顾茅庐请出诸葛亮，联合东吴孙权于赤壁之战大败曹军。形成三国鼎足之势，又夺占荆州。建安十六年（211年），攻取益州。继又击败曹军，夺得汉中。蜀章武元年（221年），刘备在成都建立蜀汉政权，诸葛亮被任命为丞相，主持朝政。后主刘禅继位，诸葛亮被封为武乡侯，领益州牧。勤勉谨慎，大小政事必亲自处理，赏罚严明；与东吴联盟，改善和西南各族的关系；实行屯田政策，加强战备。前后五次北伐中原，多以粮尽无功。终因积劳成疾，于蜀建兴十二年（234年）病逝于五丈原（今陕西省宝鸡市岐山境内），享年五十四岁。刘禅追谥他为忠武侯，后世常以武侯尊称诸葛亮。东晋桓温追封他为武兴王。';
//定义类组件
export default class Demo106 extends React.Component {
  //构造一个箭头函数，显示个人简介 
  showNote = () => {
    let id = document.getElementById('note');
    id.innerHTML=noteContent;
    //id.readOnly=true;  //设置个人简历为只读状态
  }

  //构造一个箭头函数，清空个人简介 
  hideNote = () => {
    let id = document.getElementById('note');
    id.value=''
    //id.innerHTML='';  //为什么无效？什么时候有效？
  }
  render() { 
    //定义5个元素变量，都是合法的html标签，可以是多行的html语句
    const elem1 = <h1>{user.name}，字{user.courtesyname}，别称：{user.alias}</h1>
    const elem2 = <p>年龄: {user.age}</p>;
    const elem3 = <p>{user.hometown}</p>;
    const elem4 = <p>职位: {user.title}</p>;
    const elem5 = <p><textarea id="note" rows="6" cols="100" value={noteContent} readOnly></textarea></p>;  //为textarea设置一个id
    //直接定义一个超链接，只有一行。
    //const link = <div style={{marginBottom: 10}}><a key="name" href="#" onClick={() => this.showNote()}>{user.name+'，字'+user.courtesyname+'，'+user.age+'岁'+'，'+user.hometown+'，'+user.title}</a></div>;
    //也可以将各个React元素变量组合起来定义为一个超链接
    const link = <a key="name" href="#" onClick={() => this.showNote()}>{elem1}{elem3}{elem4}</a>;
    //定义一个按钮元素变量
    const btn = <button style={{marginBottom: 10}} onClick={() => this.hideNote()}>点击隐藏简历</button>;
    return (  //输出各个元素变量
      <div style={{marginLeft:10, marginTop:20}}>
         {elem1}
         {elem2}
         {elem3}
         {elem4}
         {link}
         {btn}
         {elem5}
      </div>
    )}
}
