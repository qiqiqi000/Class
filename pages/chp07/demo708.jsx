import {Menu, Dropdown, Popconfirm, Alert, Drawer, Button, message, notification, Watermark, Switch, Form,  Layout, Modal} from 'antd'
import React, { Component } from 'react'
import { reqdoSQL, reqdoTree } from '../../api/functions'
//import '../../css/style.css';
import { mySetFormValues, AntTextBox, AntNumberBox, AntDateBox, AntComboBox, AntRadio, AntCheckBox, AntImage, AntLabel } from '../../api/antdComponents.js'
import { SaveOutlined, AppstoreOutlined, MailOutlined, UserOutlined, ShakeOutlined, ExclamationCircleOutlined, AuditOutlined, FolderOpenOutlined, FolderOutlined, FileAddOutlined, DownOutlined, UpOutlined, SettingOutlined, FileOutlined,WindowsOutlined, FileUnknownOutlined, FormOutlined, PlusCircleOutlined, EditOutlined,PrinterOutlined } from '@ant-design/icons';
const { Header, Content, Footer, Sider } = Layout;

//https://ant.design/components/overview-cn/
//使用modal+drawer+message+notification
const rowheight=42;
/*
主要知识点：npm
1）Modal的使用方法与主要属性，okText与cancelText的设置 
2）Drawer 的使用方法与主要属性，如何控制其关闭的方式,通过footer设置按钮
3）Modal与Drawer窗体的打开与关闭方法，如果把closable改成false，点击外框还是会自动关闭窗体
4）message与notification的使用方法
5）message与notification的onClose事件
6）定义右键


*/
//const [api, contextHolder] = notification.useNotification();
export default class Page708 extends Component {
  state={
    type: 'modal',   //单选按钮还是复选按钮
    openmyWin1: false,    //子窗体modal初始时为关闭状态
    openmyWin2: false,    //子窗体drawer初始时为关闭状态
    myWin2place: 'right',
    openAlert1: false,
    alert1Info: '',
    alert1Type: 'info',
    openConfirm1: false,
    openConfirm2: false,
    confirm2Title: '商品'
  }
          
  componentDidMount = async () => {
      //禁止右键
      //myPreventRightClick(); 
      //document.addEventListener('contextmenu', this.handleContextMenu)
  }
    
  handleOpenModal = (e) => {
    this.setState({openmyWin1: true});
  }

  handleOpenDrawer = (e) => {
    this.setState({openmyWin2: true});
  }

  handleOkClick = (e) => {
    notification.open({
      key: 'notice1', 
      message: '系统通知!', 
      description: '记录已经保存成功!',
      duration: 4,
      type: 'success',
      placement: 'bottomTop'
    });  //
    this.setState({openmyWin1: false});
  }

  handleCloseMyWin1 = (e) => {
    this.setState({openmyWin1: false})
  }
  
  handleCloseMyWin2 = (e) => {
    this.setState({openmyWin2: false})
  }
  
   
  handleContextMenu=(e)=>{
    /*    
    //右键设置，使用原生js，第一次点击时会显示默认菜单
    let id=document.getElementsByName('myForm1');
    id.oncontextmenu = function(e){
      e.preventDefault();      
    } 
    */   
  }

  handleSwitchChange=(checked, id)=>{
    console.log(id,checked);
    if (id=='switch2') this.setState({type:checked? 'radio':'checkbox'});
  }

  handleOpenMessage = () => {
    message.success('记录已经保存，请刷新数据!', 2);  //停留2秒时间后自动关闭
    message.info('记录已经保存，请刷新数据!', 2);  //停留2秒时间后自动关闭
    message.error('记录保存失败，请检查数据!', 2);  //停留2秒时间后自动关闭
    message.warning('记录保存失败，请检查数据!', 2);  //停留2秒时间后自动关闭    
    message.open({
      key:'msg1', 
      content:'记录已经保存，请刷新数据!', 
      duration: 5,
      type: 'success',
      overlayStyle: { width:350 },
      onClose: function(){message.info('ok')} 
    }); 
  } 

  handleOpenNotification = () => {
    notification.success({message:'系统通知', description: '密码修改成功，重新登录后生效!', duration:2});  //停留2秒时间后自动关闭
    notification.info({message:'系统通知', description: '记录已经保存，请刷新数据!', duration:2});  //停留2秒时间后自动关闭
    notification.error({message:'系统通知', description: '记录保存失败，请检查数据!', duration:2});  //停留2秒时间后自动关闭
    notification.warning({message:'系统通知', description: '记录保存失败，请检查数据!', duration:2,placement: 'topLeft'});  //停留2秒时间后自动关闭
    notification.open({
      key: 'notice1', 
      message: '系统提示!', 
      description: '记录已经保存，请刷新数据，手动关闭本通知框!',
      duration: null,
      type: 'success',
      placement: 'bottomRight',
      onClose: function(){alert('通知框已经关闭')}
    });  //停留2秒时间后自动关闭
  } 

  handleMenu1Click = (e) => {
    if (e.key=='menu11') this.setState({openConfirm1: true})
    else{
      this.setState({openConfirm2: true, confirm2Title: e.key=='menu12'? '商品':'客户'})
    }
  } 
  
  handleMenu2Click = (e) => {
    if (e.key=='menu21') this.setState({openAlert1:true, alert1Info:'密码已经修改成功，重新登录后生效', alert1Type:'info'})
    else if (e.key=='menu22') this.setState({openAlert1:true, alert1Info:'记录已经保存成功，刷新表格后生效', alert1Type:'success'})  
  } 

  handleMenu3Click = (e) => {
    console.log(333,e)
  } 

  handleOpenConfirm = (e) => {
    console.log(e);
    this.setState({openConfirm1: true})
  } 
  
  handleOpenAlert = () => {
    this.setState({openAlert1: true})
  } 

  handleDeleteClick = () => {
    this.setState({openConfirm1: false});
    message.info('已确定删除');
  }  

  render() {    
    const items1 = [{
      key: 'menu11',
      label: '定制宽度的确认框',
      icon: <FileAddOutlined />
    },{
      key: 'menu12',
      label: '除商品的确认框',
      icon: <PlusCircleOutlined />
    },{
      key: 'menu13',
      label: '删除客户的确认框',
      icon: <EditOutlined />
    }];
    
    const menuProps = {
      items1,
      onClick: this.handleMenu1Click,
    };

    const items2 = [{
      key: 'menu21',
      label: '修改密码提示',
      icon: <FileAddOutlined />
    },{
      key: 'menu22',
      label: '数据保存提示',
      icon: <PlusCircleOutlined />
    }];
    
    const items3 = [{
       label: '新增',
       key: 'menu31',
       icon: <AuditOutlined />
    },{
      label: '修改',
      key: 'menu32',
      icon: <ShakeOutlined />
    },{
      type: 'divider',
      key: 'menu33',      
    },{
      label: '保存',
      key: 'menu34',
      icon: <SaveOutlined />
    }];
    
    //const contextmenu=(<Menu onClick={this.handleMenu2Click.bind(this)} mode="horizontal" items={items3}/>)

    //FolderOpenOutlined, FolderOutlined, FileAddOutlined, DownOutlined, UpOutlined, SettingOutlined, FileOutlined
    const {data, pagesize, total, addoredit, pageno} = this.state;
    return (
      <>
      <Layout style={{overflow:'hidden',position:'relative'}}>
        <Header style={{ padding:0, paddingLeft:4, height: 35, lineHeight:'30px', backgroundColor: '#E0ECFF', borderBottom:'1px solid #95B8E7', overflow:'auto'}}>
           <Button type="text" icon={<PlusCircleOutlined />} onClick={this.handleOpenModal.bind(this)}>Modal窗体</Button>
           <Button type="text" icon={<EditOutlined />} onClick={this.handleOpenDrawer.bind(this)}>Drawer窗体</Button>
           <Button type="text" icon={<FileUnknownOutlined />}  onClick={this.handleOpenMessage.bind(this)} >消息框</Button>
           <Button type="text" icon={<FormOutlined />}  onClick={this.handleOpenNotification.bind(this)} >通知框</Button>
           <Dropdown id='myMenu1' menu={{ items: items1, onClick: this.handleMenu1Click }} placement="topRight">
              <Button type="text" icon={<ShakeOutlined />} >确认框<DownOutlined /></Button>
           </Dropdown>
           <Dropdown menu={{ items:items2, onClick: this.handleMenu2Click }} icon={<UserOutlined />} >
              <Button type="text" icon={<SettingOutlined />}>警告框<DownOutlined /></Button>
           </Dropdown>         

           <Button type="text" icon={<img style={{width:10, height:10,marginRight:6}} src={require("../../images/refresh.gif")}/>} >刷新</Button>
        </Header>
        
        <Content style={{overflow:'hidden', position:'relative'}}>
          <div style={{textAlign:'center'}}>            
            <Popconfirm open={this.state.openConfirm1} arrow title='系统确认' description='是否确定删除这条记录？'
            onConfirm={this.handleDeleteClick.bind(this)} onCancel={()=>this.setState({openConfirm1: false})}
            okText="确定" cancelText="取消" overlayStyle={{width:350}} placement='bottom' />
          </div>

          <div style={{textAlign:'center'}}>
            <Popconfirm open={this.state.openConfirm2} arrow title='系统确认' description={`是否确定删除这个${this.state.confirm2Title}？`}
             onCancel={()=>this.setState({openConfirm2: false})}
             okText="是" cancelText="否" overlayStyle={{width:350}} placement='right' />
          </div>          

          <Alert showIcon closable banner={false} message='系统警告' open={this.state.openAlert1} description={this.state.alert1Info} 
           type={this.state.alert1Type} action={<Button type='primary' size="small">详情...</Button>} />

        </Content>
      </Layout>
      <Modal name='myWin1' title='商品详细信息' open={this.state.openmyWin1} width={480} centered closable='true' 
       okText='保存' onOk={this.handleOkClick} cancelText='取消' onCancel={this.handleCloseMyWin1} 
       maskClosable={false}
       style={{position:'relative'}} >
        <Watermark content={['Ant Design', 'Modal窗体显示']} style={{height:'100%'}}>        
          <Form name="myForm1" ref={ref=>this.myForm1=ref} autoComplete="off" style={{position:'relative', height:440, overflow:'auto'}} >
             <AntTextBox params='productid,商品编码,82,0,4,0,160,disabled' top={16+rowheight*0} ref={this.productid} />
             <AntTextBox params='productname,商品名称,82,0,4,0,300,readonly' top={16+rowheight*1} />
             <AntTextBox params='quantityperunit,规格型号,82,0,4,0,300,readonly' top={16+rowheight*2} />
             <AntTextBox params='unit,计量单位,82,0,4,0,160,readonly' top={16+rowheight*3}  />
             <AntNumberBox params='unitprice,单价,82,0,4,0,160' top={16+rowheight*4} min={0.01} precision={2} />
             <AntTextBox params='categoryid,类别编码,82,0,4,0,160,readonly' top={16+rowheight*5}  />
             <AntTextBox params='categoryname,类别名称,82,0,4,0,300,readonly' top={16+rowheight*6}  />
             <AntTextBox params='supplierid,供应商编码,82,0,4,0,160,readonly' top={16+rowheight*7}  />
             <AntTextBox params='suppliername,供应商名称,82,0,4,0,300,readonly' top={16+rowheight*8}  />
             <AntImage params='imagepath,图片预览,82,0,4,0,300' top={16+rowheight*9} ref={ref=>this.imagepath=ref} 
              src={'mybase/products/20.jpg'} />
          </Form>
        </Watermark>        
     </Modal>

     <Drawer name='myWin2' title='学生基本信息' placement={this.state.myWin2place} open={this.state.openmyWin2} 
      width={500} centered maskClosable={false}
      onClose={this.handleCloseMyWin2} style={{position:'relative', padding:0}} closable={true} 
      xcloseIcon={<WindowsOutlined/>}
      footer={[
        <Button key='btnclose' type='primary' onClick={this.handleCloseMyWin2} style={{float:'right', marginRight:4}}>关闭</Button>,
        <Button key='btnok' type='primary' onClick={this.handleCloseMyWin2} style={{float:'right', marginRight:4}}>确定</Button>
      ]} >
      <Dropdown menu={{ items:items3, onClick:this.handleMenu3Click.bind(this) }} overlayStyle={{width:160}} trigger={['contextMenu']}>
        <Form name="myForm2" ref={ref=>this.myForm2=ref} autoComplete="off" style={{margin:0, position:'relative', height:'100%', overflow:'auto'}} >
            <AntTextBox params='stuid,学生学号,82,0,4,0,160' top={rowheight*0} message='学号不能为空' ref={this.stuid} />
            <AntTextBox params='stuname,学生姓名,82,0,4,0,260,required' top={rowheight*1} />
            <AntTextBox params='pycode,姓名拼音,82,0,4,0,260,required;search' top={rowheight*2} />
            <AntRadio params='gender,性别,82,0,4,0,0,button,男;女' top={rowheight*3} />
            <AntDateBox params='birthdate,出生日期,82,0,4,0,160' top={rowheight*4} ref={ref=>this.birthdate=ref} />
            <AntTextBox params='age,年龄,52,0,250,0,50,readonly' top={rowheight*4}  />          
            <AntComboBox params='deptname,所属院系,82,0,4,0,260, ,信息管理与信息系统;大数据管理与应用;工商管理;计算机科学与技术;会计学' top={rowheight*5} ref={ref=>this.deptname=ref}/>  
            <AntTextBox params='idnumber,身份证号,82,0,4,0,260,search' top={rowheight*6} enterButton='设置' />
            <AntCheckBox params='hobby,个人兴趣,82,0,4,0,2,,下棋;钓鱼;唱歌;编程' top={rowheight*7} maxcheckedcount={3} />
            <AntTextBox params='notes,个人简历,82,0,14,190,350,textarea' top={rowheight*8} rows={6} />
        </Form>
       </Dropdown>
     </Drawer>
     </>   
    )
  }
}
