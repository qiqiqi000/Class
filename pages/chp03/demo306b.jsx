import React, { useState } from 'react'
import treeData from '../../data/categorytree.json'
import { PlusCircleOutlined, MinusCircleOutlined } from '@ant-design/icons';

export default function Demo306() {
  // const [flag, setFlag] = useState(true);
  //设置每一个按钮的flag状态，这里没办法只能分开写，写在searchAllTreeNodes里setState会无限render
  const setFlag = (data, obj = {}) => {
    data.forEach((item) => {
      obj[item.categoryid] = false;
      if (item.isparentflag === '1' || item.children?.length > 0)
      setFlag(item.children, obj);
    });
    return obj;
  }

  const [obj, setObj] = useState(setFlag(treeData, {}));//设置状态

  const searchAllTreeNodes = (data, nodes = []) => {//该函数直接返回输出的元素
    data.forEach((item) => {
      if (item.isparentflag === '1' || item.children?.length > 0)
        nodes.push(//第一个li是父节点，后面跟着一个ul+li即为它展开的结点
          <li key={'span' + item.categoryid} id={item.categoryid}//通过level属性设置margin、list-style等
            style={{ listStyle: item.level === '1' ? 'disc' : item.level === '2' ? 'circle' : 'square', marginLeft: Number(item.level) * 15 }} >
            {obj[item.categoryid] ? <MinusCircleOutlined onClick={() => handleClick(item.categoryid)} /> :
              <PlusCircleOutlined onClick={() => handleClick(item.categoryid)} />}&nbsp;
            {`${item.categoryid} ${item.categoryname}`}
          </li>,
          <ul key={'ul' + item.categoryid}
            style={{ paddingInlineStart: 0, display: obj[item.categoryid] ? 'block' : 'none' }}>
            {searchAllTreeNodes(item.children, nodes[nodes.length])}
          </ul>
        );
      else nodes.push(<li key={'ul' + item.categoryid} id={item.categoryid}//没有子结点的li，通过level属性设置margin、list-style等
        style={{ listStyle: item.level === '1' ? 'disc' : item.level === '2' ? 'circle' : 'square', marginLeft: Number(item.level) * 15 }}>
        <span key={'span' + item.categoryid}>{`${item.categoryid} ${item.categoryname}`}</span>
      </li>);
    });
    return nodes;//返回需要渲染的元素
  }

  const handleClick = (categoryid) => {//设置状态，点击后改变flag值以修改图标、展开结点
    setObj({ ...obj, [categoryid]: !obj[categoryid] });
  }

  return (
    <div>
      <ul style={{ margin: 20, padding: 0 }}>
        {searchAllTreeNodes(treeData)}
      </ul>
    </div>
  )
}