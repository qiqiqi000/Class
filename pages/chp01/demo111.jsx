import React from 'react';
export default class Demo111 extends React.Component {
  verifyGoldbachConjecture = (limit) => {
    let n = 0;
    let primes = []; //存储素数
    for (let i = 6; i <= limit; i++) {
      let flag = 1;
      for (let j = 2; j <= Math.sqrt(i); j++) {
         n++;
         if (i % j == 0) {
           flag = 0;
           break;
         }
      }
      if (flag == 1) primes.push(i);
    }
    console.log(111, primes, n)
    //遍历素数数组，验证哥德巴赫猜想
    let prime1, prime2;
    for (let i = 0; i < primes.length; i++) {
      prime1 = primes[i];
      prime2 = limit - prime1;
      if (primes.includes(prime2)) {
        console.log(prime1, prime2);
        return (<div>偶数{limit} = 素数{prime1}+素数{prime2}</div>)
        break;
      }
    }
    return false;
  }
  render() {
    //循环验证各个偶数。
    let flag = true;
    let i=200;
    do {
      flag = this.verifyGoldbachConjecture(i);
      i += 2;
    } while (i<=300 && flag);

    return (
      <div>
        demo111-js循环语句
        {this.verifyGoldbachConjecture(100)}
        {this.verifyGoldbachConjecture(200)}
        {this.verifyGoldbachConjecture(145)}
      </div>
    );
  }
}