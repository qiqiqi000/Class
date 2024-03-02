import React from 'react';
const carlist="Toyota;Volkswagen;Ford;Chevrolet;Honda;BMW;Mercedes-Benz;Audi;Chevrolat;Nissan;Tesla;Hyundai;Kia;Subaru;Porsche;Ferrari;Lamborghini;Jaguar;Volvo;Mazda";
export default class Demo115 extends React.Component {
  render() { 
    var arr1 = [134, 18, 38, 15, 131, 58, 26, 67, 891, 900];
    var arr2 = [67, 128, 315, 36, 74, 58, 175, 38, 215];
    for (let i=0; i<arr1.length; i++){
      //判断第二个数组中是否存在这个元素
      if (arr2.includes(arr1[i])){
        //删除arr1中的这个元素，arr1.length会发生变化吗？
        arr1.splice(i,1);
      }        
    }
    console.log(arr1);
    console.log(arr2);
    /*
    var array = [1, 2, 3, 4, 5];
    array.splice(3, 1)
    console.log(array)
    array.splice(3, 1, 6, 7, 8)
    console.log(array)
    array.splice(3, 0, 4,5)
    console.log(array)
    //var fruits = ["Banana", "Orange", "Apple", "Mango"];
    //fruits.splice(2,0,"Lemon","Kiwi");
    */    
    //var arr=new Array(arr1.length+arr2.length).fill(0); //定义一个新数组
    /*第一种方法是新定义一个空数组，交替插入元素
    let arr=[];
    while (k<n1 && j<n2){
      if (i<arr1.length) arr.push(arr1[i]);
      if (i<arr2.length) arr.push(arr2[i]);
    }
    console.log(arr);
    */
    //第二种方法是直接插入到第一个数组中去
    let i=0, j=0, k=0;
    let n1=arr1.length;
    let n2=arr2.length;
    while (k<n1 && j<n2){
      //使用splice插入一个元素，而不需要数组中元素的位置移动
      if (j<arr2.length) arr1.splice(i+1, 0, arr2[j]);
      i=i+2; 
      j++; k++;
    }
    console.log(n1,n2,j);
    //如果第二个数组还有剩余的，则逐个添加
    while (j<n2){
      arr1.push(arr2[j]);
      j++;
    }         
    console.log(arr1);      
    return (  //输出各个元素变量    
      <div style={{marginLeft:10, marginTop:20}}>
        {arr1.join(';')}
      </div>
    )
  }
}
