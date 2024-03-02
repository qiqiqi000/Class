import React from 'react';
import { Collapse, Table, List, Layout, Menu, Form, Button, ConfigProvider,Image } from 'antd'
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import locale from 'antd/locale/zh_CN'
import { createRef } from 'react';
//import '../../css/style.css';
import { AntComboTree, AntTextBox, AntDateBox, AntComboBox, AntRadio, AntCheckBox, AntLabel } from '../../api/antdComponents.js'
import { myResetJsonValues } from '../../api/functions.js'
import { MyFormComponent } from '../../api/antdFormClass.js';
import { WindowsOutlined, FormOutlined, PlusCircleOutlined, EditOutlined,DeleteOutlined,SaveOutlined,PrinterOutlined } from '@ant-design/icons';
//import ButtonGroup from 'antd/es/button/button-group';
import { reqdoSQL, reqdoTree, myStr2JsonArray, myDatetoStr, myHeader} from '../../api/functions.js'

const { Header, Content, Footer, Sider } = Layout;

//https://ant.design/components/overview-cn/ 
//https://ant.design/components/button
//https://ant.design/docs/react/introduce

const rowheight = 45;
export default class Page704 extends MyFormComponent {  
  constructor(props) {
    super(props);  
    this.state = {
      supplierdata: [{"supplierid":"AZGYL","companyname":"上海爱泽供应链管理有限公司","sysrowno":"1"},{"supplierid":"BCWSP","companyname":"杭州百草味食品有限公司","sysrowno":"2"},{"supplierid":"BDHNY","companyname":"黑龙江北大荒农业股份有限公司","sysrowno":"3"},{"supplierid":"BLSP","companyname":"波力食品工业有限公司","sysrowno":"4"},{"supplierid":"BWPJ","companyname":"百威（武汉）啤酒有限公司","sysrowno":"5"},{"supplierid":"DCHCY","companyname":"上海大昌行储运有限公司","sysrowno":"6"},{"supplierid":"DGTW","companyname":"东古调味食品有限公司","sysrowno":"7"},{"supplierid":"DLSP","companyname":"达利食品集团有限公司","sysrowno":"8"},{"supplierid":"DWSP","companyname":"湖南大旺食品有限公司","sysrowno":"9"},{"supplierid":"FXSY","companyname":"山东凤祥实业有限公司","sysrowno":"10"},{"supplierid":"GGSP","companyname":"桂格(上海)食品有限公司","sysrowno":"11"},{"supplierid":"GMLY","companyname":"光明乳业股份有限公司","sysrowno":"12"},{"supplierid":"GSYSP","companyname":"上海冠生园食品有限公司","sysrowno":"13"},{"supplierid":"HBGT","companyname":"广东海宝罐头食品有限公司","sysrowno":"14"},{"supplierid":"HDHY","companyname":"青岛海都汇源商贸有限公司","sysrowno":"15"},{"supplierid":"HDSP","companyname":"重庆恒都食品开发有限公司","sysrowno":"16"},{"supplierid":"HNWTM","companyname":"红牛维他命饮料有限公司","sysrowno":"17"},{"supplierid":"HRSP","companyname":"华润食品饮料(深圳)有限公司","sysrowno":"18"},{"supplierid":"HSSP","companyname":"亨氏青岛食品有限公司","sysrowno":"19"},{"supplierid":"HTTW","companyname":"海天调味食品有限公司","sysrowno":"20"},{"supplierid":"HWHSP","companyname":"杭州华味亨食品有限公司","sysrowno":"21"},{"supplierid":"HXNJK","companyname":"好想你健康食品股份有限公司","sysrowno":"22"},{"supplierid":"HXSC","companyname":"湛江市鸿鑫水产有限公司","sysrowno":"23"},{"supplierid":"HYYL","companyname":"北京汇源饮料食品集团有限公司","sysrowno":"24"},{"supplierid":"HYYLX","companyname":"洪雅雅腊香食品有限公司","sysrowno":"25"},{"supplierid":"HZBX","companyname":"苏州市横中霸蟹业有限公司","sysrowno":"26"},{"supplierid":"JHHT","companyname":"金华金字火腿有限公司","sysrowno":"27"},{"supplierid":"JPHCP","companyname":"威海金鹏海产品有限公司","sysrowno":"28"},{"supplierid":"KGHY","companyname":"山东帆歌海洋食品有限公司","sysrowno":"29"},{"supplierid":"KSF","companyname":"康师傅控股有限公司","sysrowno":"30"},{"supplierid":"LHJK","companyname":"莲花健康产业集团股份有限公司","sysrowno":"31"},{"supplierid":"LJJSP","companyname":"李锦记(广州)食品有限公司","sysrowno":"32"},{"supplierid":"LPPZ","companyname":"湖北良品铺子食品有限公司","sysrowno":"33"},{"supplierid":"LTSP","companyname":"乐天（上海）食品有限公司","sysrowno":"34"},{"supplierid":"LYNY","companyname":"湖北绿念农业科技有限公司","sysrowno":"35"},{"supplierid":"LYSY","companyname":"内蒙古伊利实业集团股份有限公司","sysrowno":"36"},{"supplierid":"MNLY","companyname":"内蒙古蒙牛乳业（集团）股份有限公司","sysrowno":"37"},{"supplierid":"MSSP","companyname":"玛氏食品（中国）有限公司","sysrowno":"38"},{"supplierid":"MZCYY","companyname":"美赞臣营养品（中国）有限公司","sysrowno":"39"},{"supplierid":"NESTLE","companyname":"雀巢(中国)有限公司深圳分公司","sysrowno":"40"},{"supplierid":"NFSQ","companyname":"农夫山泉股份有限公司","sysrowno":"41"},{"supplierid":"PXYSM","companyname":"宿迁市品鲜肴商贸有限公司","sysrowno":"42"},{"supplierid":"QJDJT","companyname":"中国全聚德集团股份有限公司","sysrowno":"43"},{"supplierid":"QTPJ","companyname":"青岛啤酒集团有限公司","sysrowno":"44"},{"supplierid":"RYSP","companyname":"广东荣业食品有限公司","sysrowno":"45"},{"supplierid":"SBLJY","companyname":"东莞市圣堡露酒业有限公司","sysrowno":"46"},{"supplierid":"SHJT","companyname":"双汇集团股份有限公司","sysrowno":"47"},{"supplierid":"SMYL","companyname":"上海申美饮料食品有限公司","sysrowno":"48"},{"supplierid":"SSGS","companyname":"莱阳盛世果蔬种植专业合作社","sysrowno":"49"},{"supplierid":"TTLSP","companyname":"上海太太乐食品有限公司","sysrowno":"50"},{"supplierid":"WHH","companyname":"杭州娃哈哈集团有限公司","sysrowno":"51"},{"supplierid":"WHMSP","companyname":"上海味好美食品有限公司","sysrowno":"52"},{"supplierid":"WLJ","companyname":"广州王老吉大健康产业有限公司","sysrowno":"53"},{"supplierid":"XFJSP","companyname":"东莞徐记食品有限公司","sysrowno":"54"},{"supplierid":"XHSP","companyname":"烟台欣和企业食品有限公司","sysrowno":"55"},{"supplierid":"XJGY","companyname":"新疆果业股份有限公司","sysrowno":"56"},{"supplierid":"XJSP","companyname":"珠海（澳门）香记食品有限公司","sysrowno":"57"},{"supplierid":"XMSP","companyname":"河北西麦食品有限公司","sysrowno":"58"},{"supplierid":"XSFTC","companyname":"抚松县御参坊特产有限公司","sysrowno":"59"},{"supplierid":"XXWTX","companyname":"新希望天香乳业有限公司","sysrowno":"60"},{"supplierid":"XYNY","companyname":"恩施硒源农业科技股份有限公司","sysrowno":"61"},{"supplierid":"XZLSP","companyname":"南京喜之郎食品有限公司","sysrowno":"62"},{"supplierid":"YFSC","companyname":"洋风食材进口食品馆","sysrowno":"63"},{"supplierid":"YXDZP","companyname":"榆树市榆乡豆制品有限公司","sysrowno":"64"},{"supplierid":"YXSM","companyname":"跃翔商贸有限公司","sysrowno":"65"},{"supplierid":"YZLHZ","companyname":"烟台渔知乐海珍品有限公司","sysrowno":"66"},{"supplierid":"YZSP","companyname":"亿滋食品（北京）有限公司","sysrowno":"67"},{"supplierid":"ZHYT","companyname":"珠海一统实业有限公司","sysrowno":"68"},{"supplierid":"ZWGSP","companyname":"杭州知味观食品有限公司","sysrowno":"69"},{"supplierid":"ZXJD","companyname":"赵小姐的店","sysrowno":"70"}],
      data: [{"unit":"袋","supplierid":"DWSP","productid":"10","quantityperunit":"20g*20包","productiondate":"2018-10-11","companyname":"湖南大旺食品有限公司","productname":"旺仔QQ糖","subcategoryid":"C1","categoryname":"糖果蜜饯","unitprice":"19.60","categoryid":"C","sysrowno":"1"},{"unit":"袋","supplierid":"HSSP","productid":"14","quantityperunit":"252g","productiondate":"2018-10-11","companyname":"亨氏青岛食品有限公司","productname":"亨氏婴幼儿面条","subcategoryid":"E3","categoryname":"谷类食品","unitprice":"22.50","categoryid":"E","sysrowno":"2"},{"unit":"包","supplierid":"JHHT","productid":"15","quantityperunit":"288g","productiondate":"2018-10-11","companyname":"金华金字火腿有限公司","productname":"金华火腿切片","subcategoryid":"F2","categoryname":"肉与肉制品","unitprice":"50.00","categoryid":"F","sysrowno":"3"},{"unit":"箱","supplierid":"YXSM","productid":"16","quantityperunit":"2500g","productiondate":"2018-10-11","companyname":"跃翔商贸有限公司","productname":"芳泰樱桃小番茄","subcategoryid":"G1","categoryname":"农产品","unitprice":"19.90","categoryid":"G","sysrowno":"4"},{"unit":"瓶","supplierid":"WHMSP","productid":"19","quantityperunit":"20g","productiondate":"2018-10-11","companyname":"上海味好美食品有限公司","productname":"哈奇黑胡椒粉","subcategoryid":"B4","categoryname":"调味品","unitprice":"17.50","categoryid":"B","sysrowno":"5"},{"unit":"箱","supplierid":"WHH","productid":"20","quantityperunit":"596ml*12瓶","productiondate":"2018-10-11","companyname":"杭州娃哈哈集团有限公司","productname":"娃哈哈纯净水","subcategoryid":"A3","categoryname":"饮料","unitprice":"18.00","categoryid":"A","sysrowno":"6"},{"unit":"瓶","supplierid":"HTTW","productid":"21","quantityperunit":"230ml","productiondate":"2018-10-11","companyname":"海天调味食品有限公司","productname":"海天烧烤汁","subcategoryid":"B3","categoryname":"调味品","unitprice":"6.75","categoryid":"B","sysrowno":"7"},{"unit":"箱","supplierid":"AZGYL","productid":"22","quantityperunit":"2500g","productiondate":"2018-10-11","companyname":"上海爱泽供应链管理有限公司","productname":"菲律宾进口香蕉","subcategoryid":"G1","categoryname":"农产品","unitprice":"39.80","categoryid":"G","sysrowno":"8"},{"unit":"箱","supplierid":"SSGS","productid":"27","quantityperunit":"2500g","productiondate":"2018-10-11","companyname":"莱阳盛世果蔬种植专业合作社","productname":"水果小黄瓜","subcategoryid":"G1","categoryname":"农产品","unitprice":"29.80","categoryid":"G","sysrowno":"9"},{"unit":"箱","supplierid":"MNLY","productid":"28","quantityperunit":"250ml*6盒","productiondate":"2018-10-11","companyname":"内蒙古蒙牛乳业（集团）股份有限公司","productname":"蒙牛特仑苏纯牛奶","subcategoryid":"D101","categoryname":"乳制品","unitprice":"32.50","categoryid":"D","sysrowno":"10"},{"unit":"箱","supplierid":"XJGY","productid":"29","quantityperunit":"2500g","productiondate":"2018-10-11","companyname":"新疆果业股份有限公司","productname":"新疆库尔勒香梨","subcategoryid":"G1","categoryname":"农产品","unitprice":"45.50","categoryid":"G","sysrowno":"11"},{"unit":"包","supplierid":"BCWSP","productid":"31","quantityperunit":"200g","productiondate":"2018-10-11","companyname":"杭州百草味食品有限公司","productname":"百草味雪花酥","subcategoryid":"C2","categoryname":"糖果蜜饯","unitprice":"18.50","categoryid":"C","sysrowno":"12"},{"unit":"盒","supplierid":"XFJSP","productid":"35","quantityperunit":"182g","productiondate":"2018-10-11","companyname":"东莞徐记食品有限公司","productname":"徐福记凤梨酥","subcategoryid":"C2","categoryname":"糖果蜜饯","unitprice":"9.90","categoryid":"C","sysrowno":"13"},{"unit":"箱","supplierid":"XYNY","productid":"37","quantityperunit":"2500g","productiondate":"2018-10-11","companyname":"恩施硒源农业科技股份有限公司","productname":"恩施富硒小土豆","subcategoryid":"G1","categoryname":"农产品","unitprice":"20.00","categoryid":"G","sysrowno":"14"},{"unit":"袋","supplierid":"BCWSP","productid":"40","quantityperunit":"210g","productiondate":"2018-10-11","companyname":"杭州百草味食品有限公司","productname":"百草味猪肉脯","subcategoryid":"F2","categoryname":"肉与肉制品","unitprice":"28.80","categoryid":"F","sysrowno":"15"},{"unit":"包","supplierid":"XFJSP","productid":"42","quantityperunit":"525g","productiondate":"2018-10-11","companyname":"东莞徐记食品有限公司","productname":"徐福记鸡蛋沙琪玛","subcategoryid":"C2","categoryname":"糖果蜜饯","unitprice":"17.00","categoryid":"C","sysrowno":"16"},{"unit":"包","supplierid":"RYSP","productid":"43","quantityperunit":"250g","productiondate":"2018-10-11","companyname":"广东荣业食品有限公司","productname":"荣业广式腊肠","subcategoryid":"F2","categoryname":"肉与肉制品","unitprice":"14.90","categoryid":"F","sysrowno":"17"},{"unit":"包","supplierid":"MSSP","productid":"45","quantityperunit":"270g","productiondate":"2018-10-11","companyname":"玛氏食品（中国）有限公司","productname":"绿箭薄荷口香糖","subcategoryid":"C1","categoryname":"糖果蜜饯","unitprice":"22.80","categoryid":"C","sysrowno":"18"},{"unit":"袋","supplierid":"XSFTC","productid":"47","quantityperunit":"250g","productiondate":"2018-10-11","companyname":"抚松县御参坊特产有限公司","productname":"东北猴头菇","subcategoryid":"G2","categoryname":"农产品","unitprice":"24.00","categoryid":"G","sysrowno":"19"},{"unit":"袋","supplierid":"LPPZ","productid":"48","quantityperunit":"128g","productiondate":"2018-10-11","companyname":"湖北良品铺子食品有限公司","productname":"良品铺子泡椒凤爪","subcategoryid":"F2","categoryname":"肉与肉制品","unitprice":"24.50","categoryid":"F","sysrowno":"20"},{"unit":"箱","supplierid":"AZGYL","productid":"51","quantityperunit":"2500g","productiondate":"2018-10-11","companyname":"上海爱泽供应链管理有限公司","productname":"赣南脐橙","subcategoryid":"G1","categoryname":"农产品","unitprice":"50.00","categoryid":"G","sysrowno":"21"},{"unit":"瓶","supplierid":"SBLJY","productid":"52","quantityperunit":"52度500ml","productiondate":"2018-10-11","companyname":"东莞市圣堡露酒业有限公司","productname":"五粮液100年传奇佳酿白酒","subcategoryid":"A202","categoryname":"饮料","unitprice":"65.00","categoryid":"A","sysrowno":"22"},{"unit":"箱","supplierid":"GMLY","productid":"53","quantityperunit":"200ml*12盒","productiondate":"2018-10-11","companyname":"光明乳业股份有限公司","productname":"莫斯利安常温酸奶","subcategoryid":"D102","categoryname":"乳制品","unitprice":"49.80","categoryid":"D","sysrowno":"23"},{"unit":"瓶","supplierid":"DGTW","productid":"56","quantityperunit":"200ml","productiondate":"2018-10-11","companyname":"东古调味食品有限公司","productname":"东古鱼生寿司酱油","subcategoryid":"B2","categoryname":"调味品","unitprice":"11.50","categoryid":"B","sysrowno":"24"},{"unit":"袋","supplierid":"XSFTC","productid":"58","quantityperunit":"250g","productiondate":"2018-10-11","companyname":"抚松县御参坊特产有限公司","productname":"金针菇","subcategoryid":"G2","categoryname":"农产品","unitprice":"9.50","categoryid":"G","sysrowno":"25"}],
      categorydata: [{"level":"1","ancestor":"","description":"","isparentflag":"1","parentnodeid":"","englishname":"Beverages","children":[{"englishname":"Non-alcoholic beverages","level":"2","children":[{"englishname":"Coffee, tea, and energy drinks","level":"3","ancestor":"A#A1#","description":"","categoryname":"茶、咖啡与功能饮料","id":"A101","isparentflag":"0","text":"A101 茶、咖啡与功能饮料","_rowindex":"3","categoryid":"A101","parentnodeid":"A1"},{"englishname":"Fruit and vegetable juices","level":"3","ancestor":"A#A1#","description":"","categoryname":"果汁与蔬菜汁","id":"A102","isparentflag":"0","text":"A102 果汁与蔬菜汁","_rowindex":"4","categoryid":"A102","parentnodeid":"A1"},{"englishname":"Carbonated and milk drinks","level":"3","ancestor":"A#A1#","description":"","categoryname":"碳酸类与乳饮料","id":"A103","isparentflag":"0","text":"A103 碳酸类与乳饮料","_rowindex":"5","categoryid":"A103","parentnodeid":"A1"}],"ancestor":"A#","description":"","categoryname":"非酒精饮料","id":"A1","isparentflag":"1","text":"A1 非酒精饮料","_rowindex":"2","categoryid":"A1","parentnodeid":"A"},{"englishname":"Alcoholic beverages","level":"2","children":[{"englishname":"Beer","level":"3","ancestor":"A#A2#","description":"","categoryname":"啤酒","id":"A201","isparentflag":"0","text":"A201 啤酒","_rowindex":"7","categoryid":"A201","parentnodeid":"A2"},{"englishname":"Liquors","level":"3","ancestor":"A#A2#","description":"","categoryname":"白酒","id":"A202","isparentflag":"0","text":"A202 白酒","_rowindex":"8","categoryid":"A202","parentnodeid":"A2"}],"ancestor":"A#","description":"","categoryname":"酒精饮料","id":"A2","isparentflag":"1","text":"A2 酒精饮料","_rowindex":"6","categoryid":"A2","parentnodeid":"A"},{"englishname":"Drinking water","level":"2","ancestor":"A#","description":"","categoryname":"饮用水","id":"A3","isparentflag":"0","text":"A3 饮用水","_rowindex":"9","categoryid":"A3","parentnodeid":"A"}],"_total":"1","categoryname":"饮料","id":"A","text":"A 饮料","_rowindex":"1","categoryid":"A"},{"englishname":"Flavourings","level":"1","children":[{"englishname":"Sauce products","level":"2","ancestor":"B#","description":"","categoryname":"酱品类产品","id":"B1","isparentflag":"0","text":"B1 酱品类产品","_rowindex":"11","categoryid":"B1","parentnodeid":"B"},{"englishname":"Soy sauce products","level":"2","ancestor":"B#","description":"","categoryname":"酱油类产品","id":"B2","isparentflag":"0","text":"B2 酱油类产品","_rowindex":"12","categoryid":"B2","parentnodeid":"B"},{"englishname":"Juice products","level":"2","ancestor":"B#","description":"","categoryname":"汁水类产品","id":"B3","isparentflag":"0","text":"B3 汁水类产品","_rowindex":"13","categoryid":"B3","parentnodeid":"B"},{"englishname":"Flavor powder products","level":"2","ancestor":"B#","description":"","categoryname":"味粉类产品","id":"B4","isparentflag":"0","text":"B4 味粉类产品","_rowindex":"14","categoryid":"B4","parentnodeid":"B"},{"englishname":"Solid products","level":"2","ancestor":"B#","description":"","categoryname":"味精","id":"B5","isparentflag":"0","text":"B5 味精","_rowindex":"15","categoryid":"B5","parentnodeid":"B"}],"ancestor":"","description":"","categoryname":"调味品","id":"B","isparentflag":"1","text":"B 调味品","_rowindex":"10","categoryid":"B","parentnodeid":""},{"englishname":"Confections","level":"1","children":[{"englishname":"Candies","level":"2","ancestor":"C#","description":"","categoryname":"糖果","id":"C1","isparentflag":"0","text":"C1 糖果","_rowindex":"17","categoryid":"C1","parentnodeid":"C"},{"englishname":"Desserts","level":"2","ancestor":"C#","description":"","categoryname":"甜点","id":"C2","isparentflag":"0","text":"C2 甜点","_rowindex":"18","categoryid":"C2","parentnodeid":"C"},{"englishname":"Chocolate","level":"2","ancestor":"C#","description":"","categoryname":"巧克力","id":"C3","isparentflag":"0","text":"C3 巧克力","_rowindex":"19","categoryid":"C3","parentnodeid":"C"},{"englishname":"Preserves","level":"2","ancestor":"C#","description":"","categoryname":"蜜饯","id":"C4","isparentflag":"0","text":"C4 蜜饯","_rowindex":"20","categoryid":"C4","parentnodeid":"C"}],"ancestor":"","description":"","categoryname":"糖果蜜饯","id":"C","isparentflag":"1","text":"C 糖果蜜饯","_rowindex":"16","categoryid":"C","parentnodeid":""},{"englishname":"Dairy Products","level":"1","children":[{"englishname":"Milk and dairy-based drinks","level":"2","children":[{"englishname":"Milk","level":"3","ancestor":"D#D1#","description":"","categoryname":"鲜奶","id":"D101","isparentflag":"0","text":"D101 鲜奶","_rowindex":"23","categoryid":"D101","parentnodeid":"D1"},{"englishname":"Yogurt","level":"3","ancestor":"D#D1#","description":"","categoryname":"酸奶","id":"D102","isparentflag":"0","text":"D102 酸奶","_rowindex":"24","categoryid":"D102","parentnodeid":"D1"}],"ancestor":"D#","description":"","categoryname":"液体乳类","id":"D1","isparentflag":"1","text":"D1 液体乳类","_rowindex":"22","categoryid":"D1","parentnodeid":"D"},{"englishname":"Milk Powder","level":"2","ancestor":"D#","description":"","categoryname":"乳粉类","id":"D2","isparentflag":"0","text":"D2 乳粉类","_rowindex":"25","categoryid":"D2","parentnodeid":"D"},{"englishname":"Condensed milk, cheese and others","level":"2","ancestor":"D#","description":"","categoryname":"炼乳、干酪和其他","id":"D3","isparentflag":"0","text":"D3 炼乳、干酪和其他","_rowindex":"26","categoryid":"D3","parentnodeid":"D"}],"ancestor":"","description":"","categoryname":"乳制品","id":"D","isparentflag":"1","text":"D 乳制品","_rowindex":"21","categoryid":"D","parentnodeid":""},{"englishname":"Grains/Cereals","level":"1","children":[{"englishname":"Breads","level":"2","ancestor":"E#","description":"","categoryname":"面包","id":"E1","isparentflag":"0","text":"E1 面包","_rowindex":"28","categoryid":"E1","parentnodeid":"E"},{"englishname":"Crackers","level":"2","ancestor":"E#","description":"","categoryname":"饼干","id":"E2","isparentflag":"0","text":"E2 饼干","_rowindex":"29","categoryid":"E2","parentnodeid":"E"},{"englishname":"Pasta and noodles","level":"2","ancestor":"E#","description":"","categoryname":"面和面条","id":"E3","isparentflag":"0","text":"E3 面和面条","_rowindex":"30","categoryid":"E3","parentnodeid":"E"},{"englishname":"Oatmeal","level":"2","ancestor":"E#","description":"","categoryname":"麦片","id":"E4","isparentflag":"0","text":"E4 麦片","_rowindex":"31","categoryid":"E4","parentnodeid":"E"}],"ancestor":"","description":"","categoryname":"谷类食品","id":"E","isparentflag":"1","text":"E 谷类食品","_rowindex":"27","categoryid":"E","parentnodeid":""}],
      product: {}
    }
  }

  async componentDidMount() {
    this.handleLink(this.state.data[0]);
    /*
    var p={};
    p.filter='2';
    p.sqlprocedure="demo502a";
    let rs = await reqdoSQL(p); //调用函数，执行存储过程保存数据。必须加await
    console.log(333,JSON.stringify(rs.rows));
    this.setState({product: rs.rows[0]})  
    return;
    var p={};
    p.style='full';
    p.sqlprocedure="demo502d";
    let rs1 = await reqdoSQL(p); //调用函数，执行存储过程保存数据。必须加await
    console.log(332,JSON.stringify(rs1.rows));
    //console.log(999,this.state.data[0])
    this.setState({product: this.state.data[0]})      */
    
  }
  
  handleLink = (row) => {
    console.log(991,row);
    this.setFormValues('myForm1', row);
    /*
    for (var key in data) {      
      this.myForm1.setFieldValue(key, data[key]);
    }
    */
    this.setState({product: row});
  }

  onFinish = (data) => { //提交时触发
    data=myResetJsonValues(data);
    /*
    for (var key in json) {
      if (typeof json[key] === 'object' && typeof json[key].$d === 'object'){ //将日期型数据转成字符串
        //json[key] = myDatetoStr(json[key].$d);
        json[key] = json[key].format(dateFormat);        
      }
    }
    */
    console.log(662, data);
  }    
  
  handleAddClick = ()=>{

  }
  
  handleEditClick = ()=>{

  }
  
  handleDeleteClick = ()=>{

  }

  handleSaveClick = ()=>{

  }
  
  handleSearchFilter=()=>{

  }
  
  handleValuesChange = (obj1, obj2) => {  
    //表单中所有数据变化时触发
    console.log(361,obj1);
    console.log(362,obj2);    
    //console.log(364,this.myForm1);
    let id, value;
    for (var key in obj1) {  //只有一个列，提取其id和value值。有没有其他简单方法？
      id=key;
      value=obj1[key];
      if (value == null && this[id].state != undefined && this[id].state.antclass=='datebox'){
        value = myDatetoStr(new Date());
        this.myForm1.setFieldValue(id, value); 
      } 
    }  
  };

  render() {
    /*1.设置layout，掌握其规律，同一方向的可以不重新写layout，但是sider与content或footer一起时，之前要重新写layout
      2.设置layout之下各个插件的border与高度、宽度等style属性
      3.设置layout及其各个插件的滚动条属性:
      1) 设置第一个layout，<Layout style={{overflow:'hidden'}}>; 
      2) 设置sider style={{overflow:'auto', height:'100%', position:'relative'}}>
      3) 设置form的style={{position:'relative', overflow:'auto', height:'100%'}}
      4)在content中添加layout，否则滚动条没有下面的箭头      
      5)设置footer的padding为0
      思考题:
      1）如何设置表单的初值，能不能在didmount时间中写代码？
      2）“学生详细信息”如何添加图标，如果改变滚动条下方出现箭头
      3）左边list的按钮事件中如果不使用箭头函数，会产生什么后果？
    */
    return (
      <Layout style={{overflow:'hidden'}}>
        <Header style={{ padding:0, paddingLeft:4, height: 35, lineHeight:'30px', backgroundColor: '#E0ECFF', borderBottom:'1px solid #95B8E7', overflow:'hidden'}}>
           <Button type="text" icon={<PlusCircleOutlined />} onClick={this.handleAddClick.bind(this)}>新增</Button>
           <Button type="text" icon={<EditOutlined />} onClick={this.handleEditClick.bind(this)}>修改</Button>
           <Button type="text" icon={<DeleteOutlined />} onClick={this.handleDeleteClick.bind(this)}>删除</Button>
           <Button type="text" icon={<SaveOutlined />} onClick={this.handleSaveClick.bind(this)}>保存</Button>
           <Button type="text" icon={<img style={{width:10, height:10,marginRight:6}} src={require("../../images/refresh.gif")}/>} onClick={this.handleSaveClick.bind(this)}>刷新</Button>
           <Form name='filterbar'><AntTextBox params='filtertext,快速过滤,70,0,420,30,350,search' ref={ref => this.filtertext = ref} onSearch={this.handleSearchFilter.bind(this)} /></Form>
        </Header>
        <Layout>
          <Sider theme='light' width={300} collapsible={false} collapsedWidth={40} style={{overflow:'auto', height:'100%', position:'relative', marginLeft:0, padding:0, borderRight:'1px solid #95B8E7'}}>
             <List bordered={false} dataSource={this.state.data} 
              renderItem={(item) => <List.Item style={{padding:2}}><Button type='link' onClick={()=>this.handleLink(item)}>{item.productid+','+item.productname+','+item.supplierid}</Button></List.Item>} />
          </Sider>
          <Content style={{marginLeft:3, borderLeft:'1px solid #95B8E7',position:'relative', overflow:'hidden', height:'100%'}}>
            <Layout>
              <Header style={{height:30,lineHeight:'30px', paddingLeft:12, borderBottom:'1px solid #95B8E7', background:'#E0ECFF', fontSize:14}}>
                <WindowsOutlined />
                <label style={{marginLeft:8}} className='headerStyle'>学生详细信息</label>
              </Header>
              <Content>
                <Form name="myForm1" ref={ref=>this.myForm1=ref} autoComplete="off" onFinish={this.onFinish} onValuesChange={this.handleValuesChange.bind(this)}
                 style={{height:'100%', position:'relative', overflow:'auto'}} >
                  <AntTextBox params='productid,商品编码,82,0,14,0,160' top={16+rowheight*0} message='商品编码不能为空' ref={this.studentid} />
                  <AntTextBox params='productname,商品名称,82,0,14,0,260,required' top={16+rowheight*1} ref={ref=>this.name=ref} />
                  <AntTextBox params='quantityperunit,规格型号,82,0,14,0,260' top={16+rowheight*2}  />
                  <AntTextBox params='unit,计量单位,82,0,14,0,160' top={16+rowheight*3} />
                  <AntTextBox params='unitprice,单价,82,0,14,0,160' top={16+rowheight*4} />
                  <AntComboBox params='supplierid,供应商,82,0,14,0,260' top={16+rowheight*5} textfield='companyname' options={this.state.supplierdata} ref={ref=>this.supplierid=ref}/>
                  <AntComboTree params='categoryid,商品类别,82,0,14,0,260,cascader' top={16+rowheight*6} textfield='categoryname' options={this.state.categorydata} ref={ref=>this.categoryid=ref} />
                  <AntDateBox params='productiondate,上架时间,82,0,14,0,160' top={16+rowheight*7} ref={ref=>this.productiondate=ref}/>
                  <Image style={{position:'absolute', top:16+rowheight*8, left:96}} preview={false} width={300}
                   src={"/myServer/mybase/products/"+this.state.product.productid+".jpg"} />
                </Form>                
              </Content>
            </Layout>
          </Content>
        </Layout>
        <Footer style={{padding:0, paddingLeft:10, position:'relative',borderTop:'1px solid #95B8E7', height:28, lineHeight:'28px'}}>系统提示</Footer>
      </Layout>
    );
  }
}
