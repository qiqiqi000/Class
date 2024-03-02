import React from 'react';
//import jsonData from '../../data/school.json';
let data = {
  "schoolname": "ABC School",
  "address": {
     "street": "123 Main St",
     "city": "New York",
     "country": "USA"
   },
   "courses": [
     { //第一门课
       "id": 1,
       "name": "Math",
       "teacher": {
         "name": "John Smith",
         "age": 35
       },
       "students": [
         { //第一个学生
           "name": "Alice",
           "grade": 95
         }, { //第二个学生
           "name": "Bob",
           "grade": 80
         }
       ]
     },{  //第二门课
       "id": 2,
       "name": "Science",
       "teacher": {
         "name": "Jane Doe",
         "age": 40
       },
       "students": [
         { //第一个学生
           "name": "Charlie",
           "grade": 90
         }, { //第二个学生
           "name": "Diana",
           "grade": 85
         }
       ]
    },{  //第三门课
      "id": 2,
      "name": "Physics",
      "teacher": {
        "name": "Albert Einstein",
        "age": 55
       },
      "students": [
        { //第一个学生
          "name": "Missa",
          "grade": 75
        }, { //第二个学生
          "name": "Lyndia",
          "grade": 80
        }
      ]
    }
   ]
 };
  
data= {
  "schoolName": "ABC School",
  "address": {"street": "123 Main St", "city": "New York", "country": "USA"},
   "courses": [
     {"id": 1, "name": "Math", 
      "teacher": {"name": "John Smith", "age": 35},
      "students": [{"name": "Alice", "grade": 95}, {"name": "Bob", "grade": 80}]
     },{"id": 2, "name": "Science", 
      "teacher": {"name": "Jane Doe", "age": 40}, 
      "students": [{"name": "Charlie", "grade": 90},{"name": "Diana", "grade": 85}]
     },{ "id": 2, "name": "Physics",
      "teacher": { "name": "Albert Einstein", "age": 55 },
      "students": [{"name": "Missa", "grade": 75}, {"name": "Lyndia", "grade": 80}]
    }
   ]
};

export default class Demo121 extends React.Component {  
  render() { 
    //console.log(jsonData);
    //1）提取data对象的第一层属性值，解构赋值到3个变量中
    var { schoolname, address, courses} = data;
    console.log(schoolname, address, courses);
    //2）提取第二层address，courses的属性值。由于address属性值为JSON对象，使用花括号解构赋值；courses属性值为数组的，使用方括号解构赋值，按数组下标提取。
    var { schoolname, address: { city }, courses: [mathCourse, scienceCourse] } = data;
    console.log(schoolname, city, mathCourse, scienceCourse);
    //3）解构赋值时修改变量名name为mathTeacherName。
    var { name: mathTeacherName } = mathCourse.teacher;
    console.log("Math Teacher Name:", mathTeacherName);
    //4）解构赋值时从数组中提取某门课程2个学生元素的数据。
    var [student1, student2] = scienceCourse.students;
    //5）解构赋值时，使用省略号...提取JSON对象剩余的属性集。
    var {country, ...rest} = data.address;
    console.log("rest address:", rest);
    return (  //输出各个元素变量    
      <div style={{marginLeft:10, marginTop:10}}>
        <div></div>
      </div>
    )
  }
}
