import React from 'react';
//1.11 for循环
export default class Demo111 extends React.Component {
  render() {
    let sum = 0;
    for (let i=0; i<100; i++){
        sum += i;
    }
    sum = 0;
    let i = 1;
    while (i <= 100){
        sum += i;
        i ++;
    }    
    console.log("sum=" + sum);
    
    sum = 0;
    i = 1;
    do {
        sum += i;
        i ++;
    } while (i <= 100);
    console.log("sum=" + sum);
    
    let person = {
        name: "John",
        age: 30,
        gender: "male"
    };
      
    for (let key in person) {
        console.log(key + ": " + person[key]);
    }
    for (let key in person) {
       if (person.hasOwnProperty(key)) {
         console.log(key + ": " + person[key]);
       }
    }

    for (let i = 2; i <= 100; i++) {
       //console.log("外部循环:", i);        
       let flag = 1;
       for (let j = 2; j < Math.sqrt(i); j++) {
         //console.log("内部循环:", j);          
         if (i % j == 0) {
           //console.log("跳出内部循环");
           flag = 0;
           break;
         }
       }  
       if ( flag ==1 ) {
          console.log("质数："+i);
       }

       let limit=20;
       let primes = [];
       let sieve = new Array(limit + 1).fill(true);
       sieve[0] = sieve[1] = false;
   
       for (let i = 2; i <= Math.sqrt(limit); i++) {
         if (sieve[i]) {
           for (let j = i * i; j <= limit; j += i) {
             sieve[j] = false;
           }
         }
         console.log(111,sieve)
       }
   
       for (let i = 2; i <= limit; i++) {
         if (sieve[i]) {
           primes.push(i);
         }
       }
       console.log(112,sieve,primes);
    
    // 遍历素数数组，验证哥德巴赫猜想
    for (let i = 0; i < primes.length; i++) {
        let prime1 = primes[i];
        let prime2 = limit - prime1; 
        if (primes.includes(prime2)) {
            console.log(113, prime1, prime2);
        }
    }



    }    

    return (
      <div>
        demo111-js循环语句
      </div>
    );
  }
}