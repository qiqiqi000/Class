import React from 'react';
const Demo109 = () => {
    const firstname = 'Cliton'; 
    const lastname = 'Hillary';      
    const alias = 'Bill Cliton\'s wife'; 
    const gender = 'female'
    const birthdate = '1952-10-11'  // "elderly" "senior citizens"。
    const iselderly = birthdate <= '1963-07-08';
    const title = 'the Secretary of State from 2009 to 2013'; 
    //const str = ['Character Introduction', iselderly ? 'senior' : 'young'+' Senator', title].join(' ');
    //console.log(str); 
    //字符串中的单引号处理，遇到单引号，可以外面用双引号。遇到双引号，可以外面用单引号。
    console.log(lastname+" "+firstname+", "+title+", is Bill Cliton's wife"); 
    console.log('The word "peace" is always in '+lastname+'\'s heart');
    //使用模板字符串，可以不考虑字符串中的单引号或双引号问题
    console.log("The word 'OpenAI' is always in Tom's heart");
    console.log('The word "OpenAI" is always in his heart'); 
    console.log("The word \"OpenAI\" is always in Tom's heart");   
    console.log(`${lastname+' '+firstname}, ${title}, is Bill Cliton's wife`);
    return (
      <div>
        <div>传统字符串拼接方式：</div>
        <h4>{'Character Introduction: '+lastname+' '+firstname+', Bill Cliton\'s wife, was born in '+birthdate+'. '+(gender=='male' ? 'he':'she')+' has been '+title}</h4>
        <div>模板字符串拼接方式：</div>
        <h5>{`Character Introduction: ${lastname} ${firstname}, Bill Cliton's wife, was born in ${birthdate}. ${(gender=='male' ? 'he':'she')} has been ${title}`}</h5>
        <div>加号与模板字符混合使用拼接方式：</div>
        <h5>{`${lastname+' '+firstname}, Bill Cliton's wife, was born in ${birthdate}. ${(gender=='male' ? 'he':'she')} has been `+title}</h5>
      </div>
    );
  };  
  export default Demo109;