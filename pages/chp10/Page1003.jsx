import React, { Component } from 'react'
import { deepCopy, myLocalTime, scrollTreeNode, findTreeNode, myNotice, toTreeData, reqdoTree, reqdoSQL } from '../../api/functions';
import { Dropdown, Table, Tabs, Layout, Menu, Image, Form, Tree, Input, Button, Space, Switch, Divider } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined, CloseOutlined } from '@ant-design/icons';
import { RedoOutlined, PlusCircleOutlined, SaveOutlined, EditOutlined, DeleteOutlined, FileAddOutlined, DownOutlined, UpOutlined, SettingOutlined, FileOutlined, DingdingOutlined, TwitterOutlined, PaperClipOutlined } from '@ant-design/icons';
//import { AntdInputBox, AntdCheckBox, AntdComboBox, AntdRadio, AntdCascader } from '../../api/antdClass.js';
const { Header, Content, Footer, Sider } = Layout;

const inputStyle = {
  border: '1px solid',
  color: 'white',
  backgroundColor: 'rgb(255, 128, 255)',
  borderRadius: '4px',
  //backgroundColor: '#95B8E7',
  //paddingLeft: 4, 
  //paddingRight: 0, 
  //marginBottom: 4, 
  marginRight: -8, //右边不会有空隙，与paddingRight值相反
  padding: '0px 8px 0px 4px',
  lineHeight: 28, height: 28, width: '400px',
  zIndex: 1
}

//生成树结点编码
export const genTreeNodes = (data, parent = null, rows = []) => {
  //递归查找一个节点
  let i = 1;
  for (let node of data) {
    if (parent) {
      //记录子节点的个数和序号
      if (!parent._childno) parent._childno = 1;
      node.id = parent.id + '_' + parent._childno;
      node.key = node.id;
      node.parentnodeid = parent.id;
      node.level = parseInt(parent.level) + 1;
      node.isparentflag = node.children ? 1 : 0;
      node.ancestor = parent.ancestor + parent.id + '#';
      parent._childno ++;
    } else {
      node.id = '' + i;
      node.key = node.id;
      node.parentnodeid = '';
      node.level = 1;
      node.isparentflag = node.children ? 1 : 0;
      node.ancestor = '';
      i++;
    }
    console.log(i, node.id, node.text, parent?.id)
    // let row = deepCopy(node);
    // delete row.children;
    // delete row._children;
    // delete row._parentnode;
    // delete row._priornode;
    // delete row._nextnode;
    // delete row._ancestors; 
    let row = {};
    row.id = node.id;
    row.text = node.text;
    row.parentnodeid = node.parentnodeid;
    row.isparentflag = node.isparentflag;
    row.level = node.level;
    row.ancestor = node.ancestor;
    rows.push(row);
    if (node.children && node.children.length > 0) {
      const treeNode = genTreeNodes(node.children, node, rows);
    }
  }
  return rows;
};

export default class Page1003 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      node: null,
      prenode: null,
      searchValue: '', // 搜索值
      searchPathResult: [], // 搜索结果的所有路径,包括自己
      index: 0,
      ctall: 0, // 初始状态和找不到时都是0
      draggable: true, // 控制节点是否能够拖动
      searchState: true, // 控制按钮是否出现
      editable: false,
      menuitems: [{ label: '新增兄弟结点', key: 'menu-add', icon: <PlusCircleOutlined /> }, { label: '新增子结点', key: 'menu-addchild', icon: <PlusCircleOutlined /> }, { type: 'divider', key: 'sep11', }, { label: '修改结点', key: 'menu-edit', icon: <EditOutlined /> }, { type: 'divider', key: 'sep12', }, { label: '删除结点', key: 'menu-delete', icon: <DeleteOutlined /> }, { type: 'divider', key: 'sep13', }, { label: '保存', key: 'menu-save', icon: <SaveOutlined /> }],
      tmpnodeid: '_tmp',
      selectedKeys: [],
    };
  }

  async componentDidMount() {
    //提取所有
    let p = {};
    p.sqlprocedure = "demo1003a";
    let rs = await reqdoSQL(p);
    let data = toTreeData(rs.rows);
    this.setState({ data: data }, () => {
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
    this.findNode(this.state.data, dragKey, (item, index, arr) => {
      arr.splice(index, 1);
      dragObj = item;
    });

    if (!info.dropToGap) {
      // Drop on the content
      this.findNode(this.state.data, dropKey, item => {
        item.children = item.children || [];
        item.children.push(dragObj);
      });
    } else {
      let ar;
      let i;
      this.findNode(this.state.data, dropKey, (item, index, arr) => {
        ar = arr;
        i = index;
      });

      if (dropPosition === -1) {
        ar.splice(i, 0, dragObj);
      } else {
        ar.splice(i + 1, 0, dragObj);
      }
    }
    this.setState({ data: [...this.state.data] });
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
    const { searchValue, data } = this.state;
    const keys = this.getExpandedKeys(data, searchValue);
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

  handleRefresh = async () => {
    let p = {};
    p.sqlprocedure = "demo1003a";
    let rs = await reqdoSQL(p);
    let data = toTreeData(rs.rows);
    this.setState({ data: data }, () => {
      //console.log(data)
    });
  }

  expandTreeNode = (key) => {
    //强制用语句展开结点
    if (this.myTree1.state.expandedKeys.indexOf(key) < 0) this.myTree1.setExpandedKeys([...this.myTree1.state.expandedKeys, ...[key]]);
  }

  handleMyMenu1Click = (e) => {  //右键菜单程序
    let key = e.key;
    if (key == 'menu-delete') this.handleDeleteClick(e);
    else if (key == 'menu-addchild') this.handleAddChildClick(e);
    else if (key == 'menu-add') this.handleAddClick(e);
    else if (key == 'menu-edit') this.handleEditClick(e);
    else if (key == 'menu-save') this.handleSaveClick(e);
  }

  addChildNode = (pnode) => { //增加子节点
    let { node, prenode } = this.state;
    if (node.text.trim() === '') return null;
    let data = [...this.state.data];
    let xnode = {};
    console.log(11112, node.id, prenode?.id)
    if (node && node.text.trim() !== '') {
      node = findTreeNode(data, node.id);
      if (node) node.editable = false;
    }
    xnode.editable = true;
    xnode.text = '';
    xnode.isLeaf = true;
    if (pnode != null) {
      xnode.parentnodeid = pnode.id;
      xnode.parentnode = pnode;  //记录父结点
      xnode.level = parseInt(pnode.level) + 1;
      xnode.ancestor = pnode.ancestor.trim() + pnode.id + '#';
      xnode.isparentflag = 0;
      if (pnode.children === undefined) {
        pnode.children = [];
      }
      xnode.id = pnode.id + '_' + myLocalTime().timeid;  //加时间戳
      xnode.key = xnode.id;
      pnode.children.push(xnode);
      pnode.isLeaf = false;
      pnode.isparentflag = 1;
      this.expandTreeNode(pnode.id);
    } else {
      xnode.parentnodeid = '';
      xnode.parentnode = null;  //记录父结点
      xnode.level = 1;
      xnode.ancestor = '';
      xnode.id = 'root_' + myLocalTime().timeid;
      xnode.key = xnode.id;
      data.push(xnode);
    }
    this.setState({ data: [...data], node: xnode, prenode: node }, () => {
      setTimeout(() => {
        this.handleSelectNode(xnode); scrollTreeNode(); //需要滚动节点
      })
    });
    return xnode;
  }

  handleAddChildClick = async (e) => {  //aaaaaa
    //增加子结点
    let { node, data } = this.state;
    let parentnode = findTreeNode(data, node.id);
    let xnode = this.addChildNode(parentnode);
  }

  handleAddClick = async (e) => {  //aaaaaa
    //增加兄弟结点
    let { node, data, tmpnodeid } = this.state;
    let parentnode = null;
    if (node.parentnodeid != '') {
      parentnode = findTreeNode(data, node.parentnodeid);
    }
    if (node.id != tmpnodeid && node.text.trim() != '') {
      let xnode = this.addChildNode(parentnode);
    }
  }

  handleDeleteClick = async (e) => {
    //先删除树中节点，再执行数据库存储过程
    let { node, data, treefield, keyfield } = this.state;
    let xnode = findTreeNode(data, node.id);
    //定位到新节点
    if (xnode._nextnode != null) {
      this.handleSelectNode(xnode._nextnode);
    } else if (xnode._priornode != null) {
      this.handleSelectNode(xnode._priornode);
    } else if (xnode._parentnode != null) {
      this.handleSelectNode(xnode._parentnode);
      xnode._parentnode.isparentflag = 0;
      xnode._parentnode.isLeaf = true;
    }
    //删除原来节点
    //console.log(89,node);     
    if (xnode._parentnode != null) {
      let pnode = findTreeNode(data, xnode._parentnode.id);  //找到与data关联的父节点
      let children = pnode.children;
      pnode.children = children.filter(item => item.id != node.id);
    } else {
      data = data.filter(item => item.id != node.id);
    }
    this.setState({ data: [...data] }, () => {
      setTimeout(() => {
        scrollTreeNode();  //滚动节点
      })
    })
  }

  handleSaveClick = async (e) => {  //sssssssssssssave
    let { data } = this.state;
    console.log(11111,data);
    let copydata = deepCopy(data)
    console.log(22222,copydata);
    data = genTreeNodes(copydata);
    console.log(33333,data);
    //console.log(555, data)
    //console.log(551, JSON.stringify(data));
    let p = {};
    p.sqlprocedure = 'demo1003b';  //一次性保存数据
    p.data = data;
    p.flag = 1;
    let rs = await reqdoSQL(p);
    console.log(44444,rs);
  }

  /*
  selectTreeNode = (node) => {
    let key = node.id;
    this.myTree1.setState({ selectedKeys: [key] }, () => {
      scrollTreeNode();
      let e = {};
      e.node = node;
      this.handleSelectNode(node);
    });
  }
  */

  handleSelectNode = (node) => {
    console.log(123);
    //选中一个结点时，判断是否需要删除假结点（如果存在的话）
    let prenode = this.state.node;  //记录上一个结点 
    let { addoredit, data } = this.state;
    //设置菜单按钮的disabled状态
    console.log(11110, node, prenode)
    console.log(11111, node.id, prenode?.id)
    if (prenode && node.id != prenode.id && prenode.text.trim() === '') {
      //删除新增的假结点
      let pnode = prenode.parentnode;
      if (pnode) {
        pnode = findTreeNode(data, pnode.id);
        if (pnode.children) {
          let children = pnode.children;
          pnode.children = children.filter((item) => item.text.trim() !== '');  //删除之前的空节点
        }
      } else {
        data = data.filter((item) => item.text.trim() !== '');  //删除之前的空节点
      }
    }
    if (prenode) {
      //将上一个节点设置为editable=false
      prenode = findTreeNode(data, prenode.id);
      if (prenode && node.id != prenode.id) {
        prenode.editable = false;
      } else {
        //node=findTreeNode(data, node.id);
        //node.editable = true;
      }
    }
    this.setState({ data: [...data], addoredit, node, prenode }, () => {
      setTimeout(() => {
        //选中，但有时候不需要滚动
        this.myTree1.setState({ selectedKeys: [node.key] });
      })
    });
  }

  handleRightClick = (e) => {
    //this.setState({menupos:{y: e.event.pageY}})
    //右键时选中这个结点，注意需要使用数组    
    this.handleSelectNode(e.node); //选中节点但不滚动节点
    //this.myTree1.setState({ selectedKeys: [e.node.id] });
  }

  handleEditClick = async (e) => {  //eeeeeeeeeee
    console.log(125, e);
    let { node, prenode, data } = this.state;
    //进入编辑状态
    if (!node) return
    node = findTreeNode(data, node.key)
    if (prenode && prenode.id !== node.id) {
      prenode = findTreeNode(data, prenode.key)
      prenode.editable = false;
    }
    node.editable = true;
    //this.myNodeTextbox.focus();
    this.setState({ data: [...data] })
  }

  handleInputBlur = () => {

  }

  handleInputChange = (e, nodeKey) => {
    const { data, node } = this.state;
    const newData = [...data];
    const targetNode = findTreeNode(data, nodeKey);
    if (targetNode) {
      targetNode.text = e.target.value;
      this.setState({ data: [...data] });
    }
  };

  render() {
    const { data } = this.state;
    return (
      <Layout style={{ overflow: 'hidden' }}>
        <Header theme='light' style={{ padding: 0, paddingLeft: 4, height: 35, lineHeight: '30px', backgroundColor: '#f0f2f5', borderBottom: '1px solid #95B8E7', overflow: 'hidden' }}>
          <div style={{ marginTop: 1, paddingTop: 1 }}>
            <Divider type='vertical' style={{ height: 21 }} />
            <Button type="text" icon={<SaveOutlined />} style={{ padding: 0, width: 65, height: 30 }} onClick={this.handleSaveClick.bind(this)}>保存</Button>
            <Divider type='vertical' style={{ height: 21 }} />
            <Button type="text" icon={<RedoOutlined />} style={{ padding: 0, width: 65, height: 30 }} onClick={this.handleRefresh.bind(this)}>刷新</Button>
            <Divider type='vertical' style={{ height: 21 }} />
          </div>
          <Switch checkedChildren="拖动" unCheckedChildren="不可拖动" defaultChecked onChange={this.changeDraggable} style={{ margin: '0px 20px' }} />
        </Header>
        <Dropdown menu={{ items: this.state.menuitems, onClick: this.handleMyMenu1Click.bind(this) }} overlayStyle={{ width: 160 }} trigger={['contextMenu']}>
          <Content style={{ marginLeft: 0, borderLeft: '1px solid #95B8E7', position: 'relative', overflow: 'auto', height: '100%' }}>
            <Tree ref={ref => (this.myTree1 = ref)} fieldNames={{ title: 'text', key: 'key' }}
              expandAction="doubleClick" showLine treeData={data}
              //height={700} // 为了使用scrollTo而使用的height
              draggable={this.state.draggable}
              onDrop={this.onDrop}
              onRightClick={this.handleRightClick.bind(this)}
              onSelect={(key, e) => this.handleSelectNode(e.node)}
              titleRender={(node) => {
                //node.editable=true;
                return (
                  <div>
                    {
                      node.editable ?
                        <Input value={node.text} ref={ref => this.myNodeTextbox = ref} style={inputStyle}
                          autoFocus
                          onChange={(e) => this.handleInputChange(e, node.key)}
                          onFocus={(e) => { e.target.select() }}
                          onBlur={this.handleInputBlur} /> :
                        <div style={{ marginLeft: 4 }} >
                          {node.text}
                          <EditOutlined style={{ zIndex: 0, fontSize: '12px', margin: '0px 4px 0px 8px' }} onClick={() => { this.setState({ node: node }, () => this.handleEditClick(node)) }} />
                        </div>
                    }

                    {/* <Input value={node.text} style={{lineHeight:28, marginBottom:4, height:'28px', width:'300px'}}
                      onChange={(e) => {console.log(e.target.value); node.text = e.target.value }}
                      /> */}
                  </div>
                );
              }}
            />
          </Content>
        </Dropdown>
      </Layout>
    );
  }
}

