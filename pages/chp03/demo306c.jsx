import React from 'react';
import { reqdoSQL,reqdoTree } from '../../api/functions.js';
const right = require('../../icons/right.png');
const down = require('../../icons/down.png');
const file = require('../../icons/file.png');
export default class Xdemo405 extends React.Component {
    constructor(props) { //构造函数
        super(props);
        this.state={
            treeData:[],
            data:[],
            selectedNode:{}
        }
    }
    async componentDidMount(){ //页面启动时就会执行执行，必须使用async异步 
        let p={};
        p.sqlprocedure='demo306a';
        let rs=await reqdoTree(p);
        this.setState({treeData:rs.rows});
        p={};
        p.sqlprocedure='demo306a';
        rs=await reqdoSQL(p);
        this.setState({data:rs.rows});
    }
  
    tree = (data) => {
        let selected=this.state.selectedNode;
        return(
        <ul key='_1' style={{paddingLeft:20}}>
            {data.map((item,index)=>{
                if(item.parentnodeid===''){
                return(
                    <li key={item.id} id={item.id} style={{marginTop:10,display:'block'}}>
                        <a href='#' onClick={(e)=>this.handleSelect(item)} className='custom-link' style={{color:selected.id===item.id?'SlateGray': null, backgroundColor:selected.id===item.id?'PapayaWhip': null}}>
                            <img id={'_'+item.id} src={right} width='10px' style={{marginRight:5}}/>
                            {item.text}
                        </a>
                        {item.children && this.tree(item.children)}
                    </li>
                )
                }else{
                    let xdata=this.state.data;
                    index = xdata.findIndex((node)=>item.id==node.categoryid);
                    // console.log(item.id,index);
                    if (index>0 && xdata[index] && xdata[index].isparentflag>0){
                        return(
                        <li key={item.id} id={item.id} style={{marginTop:10,display:'none'}}>
                            <a href='#' onClick={(e)=>this.handleSelect(item)} className='custom-link' style={{color:selected.id===item.id?'SlateGray': null, backgroundColor:selected.id===item.id?'PapayaWhip': null}}>
                                <img id={'_'+item.id} src={right} width='10px' style={{marginRight:5}}/>
                                {item.text}
                            </a>
                            {item.children && this.tree(item.children)}
                        </li>
                        )
                    }else{
                        return(
                        <li key={item.id} id={item.id} style={{marginTop:10, display:'none'}}>
                            <a href='#' onClick={(e)=>this.handleSelect(item)} className='custom-link' style={{color:selected.id===item.id?'SlateGray': null, backgroundColor:selected.id===item.id?'PapayaWhip': null}}>
                                <img id={'_'+item.id} src={file} width='10px' style={{marginRight:5}}/>
                                {item.text}
                            </a>
                        </li>
                        )
                    }
                }
                })}
            </ul>
        )
    }
    
    handleSelect = (item) => {
        if(item.isparentflag>0){
            this.setState({selectedNode:item});
            let id = item.id;
            let imageid=document.getElementById('_'+id);
            let xdata=this.state.data;
            xdata.map(item=>{
                let display=document.getElementById(item.categoryid).style.display;
                if(item.parentnodeid===id){
                    if(display==='block'){
                        imageid.setAttribute('src',right);
                        document.getElementById(item.categoryid).style.display='none';
                    }else{
                        imageid.setAttribute('src',down);
                        document.getElementById(item.categoryid).style.display='block';
                    }
                }
            })
        }else{
            this.setState({selectedNode:item});
        }
    }
    render() { 
        var html=this.tree(this.state.treeData);
        return (
            <div>
                <div>{html}</div>
            </div>
        )
    }
  }