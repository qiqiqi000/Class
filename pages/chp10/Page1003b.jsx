import React, { Component } from 'react'
import { toTreeData, reqdoTree, reqdoSQL } from '../../api/functions';
import { Table, Tabs, Layout, Menu, Image, Form, Tree, Input, Button, Space, Switch } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined, CloseOutlined } from '@ant-design/icons';
import { FolderOpenOutlined, FolderOutlined, FileAddOutlined, DownOutlined, UpOutlined, SettingOutlined, FileOutlined, DingdingOutlined, TwitterOutlined, PaperClipOutlined } from '@ant-design/icons';
import { AntdInputBox, AntdCheckBox, AntdComboBox, AntdRadio, AntdCascader } from '../../api/antdClass.js';
const { Header, Content, Footer, Sider } = Layout;

export default class Page806 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      treeData: [],
      searchValue: '', // 搜索值
      searchPathResult: [], // 搜索结果的所有路径,包括自己
      index: 0,
      ctall: 0, // 初始状态和找不到时都是0
      draggable: true, // 控制节点是否能够拖动
      searchState: true, // 控制按钮是否出现
    };
  }

  async componentDidMount() {
    //提取所有
    let p = {};
    p.sqlprocedure = "demo806a";
    let rs = await reqdoSQL(p);
    let data = toTreeData(rs.rows);
    this.setState({ treeData: data }, () => {
      //console.log(data)
    });
  }

  // 移动功能函数，结合findNode
  onDrop = info => {
    console.log(info);
    const dropKey = info.node.key;
    const dragKey = info.dragNode.key;
    const dropPos = info.node.pos.split('-');
    const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1]);
    let dragObj;
    this.findNode(this.state.treeData, dragKey, (item, index, arr) => {
      arr.splice(index, 1);
      dragObj = item;
    });

    if (!info.dropToGap) {
      // Drop on the content
      this.findNode(this.state.treeData, dropKey, item => {
        item.children = item.children || [];
        item.children.push(dragObj);
      });
    } else {
      let ar;
      let i;
      this.findNode(this.state.treeData, dropKey, (item, index, arr) => {
        ar = arr;
        i = index;
      });

      if (dropPosition === -1) {
        ar.splice(i, 0, dragObj);
      } else {
        ar.splice(i + 1, 0, dragObj);
      }
    }
    this.setState({ treeData: [...this.state.treeData] });
  };

  findNode = (data, key, callback) => {
    for (let i = 0; i < data.length; i++) {
      if (data[i].key === key) {
        return callback(data[i], i, data);
      }
      if (data[i].children) {
        this.findNode(data[i].children, key, callback);
      }
    }
  };

  // 更改能否拖动的状态
  changeDraggable = () => {
    this.setState({ draggable: !this.state.draggable })
  }

  // 更新Input的输入值
  onSearchChange = e => {
    this.setState({ searchValue: e.target.value });
  };

  // 搜索功能，并默认展开选中第一个结果
  searchTree = () => {
    this.setState({ searchState: true })
    const { searchValue, treeData } = this.state;
    const keys = this.getExpandedKeys(treeData, searchValue);
    if (keys.length > 0) {
      // 找到有结果才展开
      this.setState({ ctall: keys.length, searchPathResult: keys }, () => { this.expandAction(); this.selectAction() });
    } else {
      this.setState({ ctall: 0, searchPathResult: [] });
    }
  };

  // 点击按钮，更新查找到的选中项，执行展开和选中
  updateIndex = (increment) => {
    this.setState(prevState => {
      // 计算新的 index 值
      let newIndex = prevState.index + increment;
      // 确保 newIndex 不小于 1 且不大于 this.state.qtyall
      newIndex = Math.max(0, Math.min(newIndex, prevState.ctall - 1));
      return { index: newIndex };
    }, () => { this.expandAction(); this.selectAction() });
  }

  // 搜索完后可以用小键盘上下箭头来切换查找，但是要Focus在选框
  handleKeyDown = (e) => {
    if (e.key === 'ArrowUp') {
      this.updateIndex(-1);
    } else if (e.key === 'ArrowDown') {
      this.updateIndex(1);
    }
  }

  // 关闭搜索状态
  closeSearch = () => {
    this.setState({ searchState: false })
  }

  // 根据路径展开节点，结合searchTree，updateIndex
  expandAction = () => {
    let keys = this.state.searchPathResult;
    let index = this.state.index;
    let lastkeys = this.myTree1.state.expandedKeys
    //  console.log('keys', keys, 'index', index)
    this.myTree1.setExpandedKeys([...lastkeys, ...keys[index]]);
  }
  // 选中搜索到的节点，结合searchTree，updateIndex
  selectAction = () => {
    let keys = this.state.searchPathResult;
    let index = this.state.index;
    let len = keys[index].length;
    let selectedKey = keys[index][len - 1];

    this.myTree1.setState({ selectedKeys: [selectedKey] });

    // 检查 this.myTree1 是否存在并且有 scrollTo 方法
    if (this.myTree1 && this.myTree1.scrollTo) {
      // 滚动到选中的节点
      this.myTree1.scrollTo({ key: selectedKey, align: 'top' });
    }
  }

  // 找到所有对应的路径
  getExpandedKeys = (data, searchValue, pnode = {}, path = []) => {
    let allPaths = []; // 用于存储所有匹配的路径
    for (const node of data) {
      // 构建当前节点的路径
      const currentPath = [...path, node.key];

      // 如果当前节点匹配搜索条件，将其路径添加到 allPaths
      if (node.text && node.text.indexOf(searchValue) > -1) {
        allPaths.push(currentPath);
      }

      // 如果有子节点，递归搜索子节点
      if (node.children) {
        const childPaths = this.getExpandedKeys(node.children, searchValue, node, currentPath);
        allPaths.push(...childPaths); // 将子节点的所有匹配路径添加到 allPaths
      }
    }

    return allPaths; // 返回包含所有匹配路径的数组
  }

  handleSearchFilter =()=>{

  }

  handleLocateIcon=()=>{

  }

  handleOk=()=>{

  }

  render() {
    const { treeData } = this.state;
    return (
      <Layout style={{overflow:'hidden'}}>
      <Header theme='light' style={{ padding:0, paddingLeft:4, height: 35, lineHeight:'30px', backgroundColor: '#E0ECFF', borderBottom:'1px solid #95B8E7', overflow:'hidden'}}>
        <Form name='filterbar'>
          <AntdInputBox id='filtertext' label='快速查找' labelwidth='72' left='16' width='350' type='search' ref={ref => this.filtertext = ref} onSearch={this.handleSearchFilter.bind(this)} />
          {/* <AntdInputBox params='filtercounter,,0,1,438,30,55,readonly' ref={ref => this.filtercounter = ref} /> */}
          <DownOutlined id='btnmovedown' onClick={this.handleLocateIcon.bind(this)} style={{position:'absolute', top:10, left:470}} />
          <UpOutlined  id='btnmoveup' onClick={this.handleLocateIcon.bind(this)} style={{position:'absolute', top:9, left:440}} />
          <Button type="primary" onClick={this.handleOk.bind(this)} style={{position:'absolute', top:1, left:500}}>确定</Button>

          {
            this.state.searchState &&
            <>
              <span style={{ fontSize: '12px', marginLeft: '10px' }}>第{this.state.index + 1}项，共{this.state.ctall}项</span>
              <Button type="text" shape="round" icon={<ArrowUpOutlined />} onClick={() => this.updateIndex(-1)} />
              <Button type="text" shape="round" icon={<ArrowDownOutlined />} onClick={() => this.updateIndex(1)} />
              <Button type="text" shape="round" icon={<CloseOutlined />} onClick={() => this.closeSearch()} />
            </>
          }
          <Switch checkedChildren="拖动" unCheckedChildren="不可拖动" defaultChecked onChange={this.changeDraggable} style={{ margin: '0px 20px' }} />
          </Form>

      </Header>
      <Content style={{marginLeft:0, borderLeft:'1px solid #95B8E7',position:'relative', overflow:'hidden', height:'100%'}}>
        <div>
          <Tree
            ref={ref => (this.myTree1 = ref)}
            fieldNames={{ title: 'text', key: 'key' }}
            expandAction="doubleClick"
            showLine
            draggable={this.state.draggable}
            onDrop={this.onDrop}
            treeData={treeData}
            height={700} // 为了使用scrollTo而使用的height
          />
        </div>
        </Content>
      </Layout>
    );
  }
}

