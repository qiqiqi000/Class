import React from 'react';
export default class Demo126 extends React.Component {
  render() {
    const jsonTree = [{
      "id": 1, "name": "Node 1", 
      "children": [{
         "id": "1-1", "name": "Node 1.1",
         "children": [{
            "id": "1-1-1",
            "name": "Node 1.1.1",
            "children": []
          },{
            "id": "1-1-2",
            "name": "Node 1.1.2",
            "children": []
          }]
        },{
         "id": "1-2",
         "name": "Node 1.2",
         "children": [{
            "id": "1-2-1",
            "name": "Node 1.2.1",
            "children": []
          }]
        }
      ]
    },{
      "id": "2",
      "name": "Node 2",
      "children": [{
         "id": "2-1",
         "name": "Node 2.1",
         "children": [{
            "id": "2-1-1",
            "name": "Node 2.1.1",
            "children": []
          },{
            "id": "2-1-2",
            "name": "Node 2.1.2",
            "children": []
          }]
        },{
           "id": "2-2",
           "name": "Node 2.2"
        }
      ] 
    }];
    console.log(jsonTree)

    function traverseJsonTree(node, level = 0) {
      const indent = "  ".repeat(level);
      console.log(`${indent}${node.name}`);
      if (node.children && node.children.length > 0) {
        for (const child of node.children) {
          traverseJsonTree(child, level + 1);
        }
      }
    }    
    traverseJsonTree(jsonTree);
    return (  //输出各个元素变量    
      <div style={{marginLeft:12}}>
      </div>
    )
  }
}
