import React from 'react';
import { Panel, SideMenu, LinkButton, Dialog, ButtonGroup, Layout, LayoutPanel, Menu, MenuItem, MenuButton, SubMenu, MenuSep, Messager } from 'rc-easyui';
import '../../css/style.css';
import { MyTextBox, MyDefTextBox, MyComboBox, MyDefComboBox } from '../../api/easyUIComponents.js'
import easyuicn from 'rc-easyui/dist/locale/easyui-lang-zh_CN';
//menu,menubutton
const rowheight=42;

export default class Page407 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          width: 280,
          collapsed: false,
          selection: null,          
          menus: []
        }
    }

    componentDidMount() { 
      const menuitems = [
        ['Demo101-常量','Demo102-变量','Demo103-模板字符串','Demo104-JSON对象及赋值','Demo105-数组定义与赋值','Demo106-数组合并','Demo107-JSON数组对象','Demo108-数组map遍历','Demo109-数据forEach遍历 ','Demo110-eval函数与计算器','Demo111-传统函数与箭头函数','Demo112-类与模块'],
        ['Demo201-直接渲染HTML','Demo202-数组渲染HTML','Demo203-字符串渲染HTML','Demo204-控件的事件与取值','Demo205-动态添加组件值','Demo206-使用div+span标签','Demo207-类式组件页面跳转','Demo208-函数组件页面跳转','Demo209-Link页面跳转参数传递','Demo210-Tabs选项卡跳转'],
        ['Demo301-axios远程访问服务器','  Demo302-axios连接数据库','Demo303-span数据展示','Demo304-数据联动','Demo305-数据分页显示'],
        ['Demo401-EasyUI基础控件','Demo402-函数组件的定义与使用','Demo403-类组件的定义与使用','Demo404-layout控件','Demo405-Tabs选项卡','Demo406-filebutton文件上传','Demo407-菜单','Demo408-window窗体','Demo409-综合应用'],
        ['Demo501-combobox联动','Demo502-datalist','Demo503-datagrid分页','Demo504-tree一次性加载','Demo505-tree逐级展开']
      ];
      let menus=[];
      for (let i=1; i<=menuitems.length; i++){
        let item={key:i, id:i, text:'第'+i+'章', iconCls: "arrowforwardIcon"};
        let subitems=[];
        for (let j=1; j<=menuitems[i-1].length; j++){
            subitems.push({key:i+'_'+j, id:i+'_'+j, text:menuitems[i-1][j-1], iconCls: "arrowforwardIcon"});
        }
        item.children=subitems;
        menus.push(item);
      }
      console.log(menus);
      this.setState({menus: menus}, () => {
        setTimeout(()=>{
          //
        })
      });      
    }

  componentWillUnmount() { 

  }

    
  editMenu() {
    return (
      <Menu ref={ref => this.menu = ref} onItemClick={() => { alert('!!!') }}>
        <MenuItem text="剪切"></MenuItem>
        <MenuItem text="复制"></MenuItem>
        <MenuItem text="粘贴"></MenuItem>
        <MenuSep></MenuSep>
        <MenuItem text="工具栏">
          <SubMenu>
            <MenuItem text="地址栏"></MenuItem>
            <MenuItem text="导航工具栏"></MenuItem>
            <MenuItem text="收藏工具栏"></MenuItem>
            <MenuSep></MenuSep>
            <MenuItem text="新工具栏..."></MenuItem>
          </SubMenu>
        </MenuItem>
        <MenuItem text="删除" iconCls="icon-remove"></MenuItem>
        <MenuItem text="全选"></MenuItem>
      </Menu>
    )
  }

  helpMenu() {
    return (
      <Menu>
        <MenuItem text="帮助"></MenuItem>
        <MenuItem text="更新"></MenuItem>
        <MenuItem text="关于..."></MenuItem>
      </Menu>
    )
  }

  aboutMenu() {
    return (
      <Menu noline>
         <div style={{ padding: '10px' }}>
             <img src=" require('../../images/jiabaoyu.jpg" style={{ width: 150, height: 50 }} />
         </div>
      </Menu>
    )
  }

  handleClick() {
     this.setState({
        collapsed: !this.state.collapsed,
        width: this.state.collapsed ? 200 : 50
     })
  }

  header() {
      return <div>Please Confirm</div>
  }

  footer() {
     return (
       <div>
          <ButtonGroup style={{ width: '100%', height: '70px' }}>
             <LinkButton className="f-full mybtn" plain>确定</LinkButton>
             <LinkButton className="f-full mybtn" plain>取消</LinkButton>
          </ButtonGroup>
       </div>
    )
  }        

  handleMessage(type) {
     this.messager1.alert({
        title: "系统提示",
        icon: type,
        msg: "商品已经保存成功！"
     });
  }

  handleConfirm() {
     this.messager2.confirm({
        title: "系统确定",
        msg: "是否确定删除这条记录？",
        result: r => {
           if (r) {
              alert("确定删除: " + r);
           }
        }
     });
  }

  handleContextMenu(event) {  //定义右键菜单
     event.preventDefault();
     this.menu.showContextMenu(event.pageX, event.pageY);
  }  

  render() {
     /*
     document.addEventListener('contextmenu', function(e){
       //
       e.preventDefault();
       this.menu.showContextMenu(e.pageX, e.pageY);
     });
     */
     const sepstyle=(<span style={{borderLeft:'1px solid lightgrey'}}></span>);     
     return (
        <div>
          <div style={{ position: 'absolute', width: '100%', height: '100%' }} onContextMenu={this.handleContextMenu.bind(this)}>
            <Layout style={{ width: '100%', height: '100%', position:'absolute' }}>
              <LayoutPanel region="north" className="dialog-toolbar" style={{ height: 40 }}>
                  <LinkButton onClick={this.handleClick.bind(this)} style={{ marginBottom: 3 }} plain>收缩菜单</LinkButton>{sepstyle}
                  <LinkButton onClick={this.handleMessage.bind(this,'info')} style={{ marginBottom: 3 }} plain>打开会话框</LinkButton>
                  <LinkButton onClick={this.handleConfirm.bind(this)} style={{ marginBottom: 3 }} plain>打开确认框</LinkButton>{sepstyle}
                  <LinkButton onClick={()=>this.win1.open()} style={{ marginBottom: 3 }} plain>打开表单窗体</LinkButton>
                  <LinkButton onClick={()=>this.win2.open()} style={{ marginBottom: 3 }} plain>打开表格窗体</LinkButton>{sepstyle}
                  <MenuButton text="帮助" plain iconCls="icon-help" menu={this.helpMenu}></MenuButton>{sepstyle}
              </LayoutPanel>
              <LayoutPanel region="center" style={{ height: '100%' }}>
                  <SideMenu style={{ width: this.state.width }}
                    data={this.state.menus}
                    collapsed={this.state.collapsed}
                    onSelectionChange={(selection) => this.setState({ selection: selection })} />
                  <div>{this.editMenu()}</div>
              </LayoutPanel>
            </Layout>
            <Dialog title="编辑客户" style={{height: 420,  width: 440}}  bodyCls="f-column"  modal closed ref={ref => this.win1 = ref}>
                <div className="dialog-toolbar">
                   <LinkButton iconCls="icon-edit" plain>编辑</LinkButton>
                   <LinkButton iconCls="icon-help" plain>帮助</LinkButton>
                </div>
                <div className="f-full">
                   <MyTextBox attr={MyDefTextBox('customerid','客户编码', 72, 45+0*rowheight, 20, 0, 300,'','')} ref={ref => this.customerid = ref} />
                   <MyTextBox attr={MyDefTextBox('companyname','客户名称', 72, 45+1*rowheight, 20, 0, 300,'','')} ref={ref => this.companyname = ref} />
                   <MyTextBox attr={MyDefTextBox('region','所属省份', 72, 45+2*rowheight, 20, 0, 300,'','')} ref={ref => this.region = ref} />
                   <MyTextBox attr={MyDefTextBox('city','所在城市', 72, 45+3*rowheight, 20, 0, 300,'','')} ref={ref => this.city = ref} />
                   <MyTextBox attr={MyDefTextBox('address','客户地址', 72, 45+4*rowheight, 20, 0, 300,'','')} ref={ref => this.address = ref} />
                   <MyTextBox attr={MyDefTextBox('contactname','联系人',   72, 45+5*rowheight, 20, 0, 300,'','')} ref={ref => this.contactname = ref} />
                   <MyTextBox attr={MyDefTextBox('phone','联系电话', 72, 45+6*rowheight, 20, 0, 300,'','')} ref={ref => this.phone = ref} />
                </div>
                <div className="dialog-button">
                   <LinkButton style={{ width: 80 }}>确定</LinkButton>
                   <LinkButton style={{ width: 80 }} onClick={() => this.win1.close()}>取消</LinkButton>
                </div>
           </Dialog>
           <Dialog title="编辑框" style={{width:'440px',height:'360px', position: 'relative'}} modal closed id="win1" ref={ref=>this.win2=ref}></Dialog>
           <Messager ref={ref => this.messager1 = ref}></Messager>
           <Messager ref={ref => this.messager2 = ref}></Messager>
          </div>
        </div>
      );
   }
}
