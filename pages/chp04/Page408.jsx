import React from 'react';
import { Panel, DataList, FileButton, LinkButton, ButtonGroup } from 'rc-easyui';
import '../../css/style.css';
import axios from "axios";
import { myFileSize } from '../../api/functions.js';
//filebutton
export default class Page408 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            rowheight: 42,
            files: []
        }
    }
    
    componentWillUnmount() { //释放内存
        this.state.files.forEach(file => {
            let url = window.URL.createObjectURL(file);
            window.URL.revokeObjectURL(url);
        })
    }

    handleSelect(files) {
        files.forEach(file => {
            file.url = window.URL.createObjectURL(file);
            console.log(file);
        })
        this.setState({
            files: this.state.files.concat(files)  //可多次选择文件，选择之后的文件合在一起 
        })
    }

    handleRemoveFile(file) {
        const files = this.state.files.filter(f => f !== file);
        this.setState({
            files: files
        })
    }

    handleClear() {
        this.setState({ files: [] })
    }


    async handleUpload() {
        let files = this.state.files;
        for (let i=0; i<files.length; i++){
            let formData = new FormData();
            formData.append("targetpath", "\\mybase\\resources");  //文件路径
            formData.append("targetfile", "res_"+(i+1));  //目标文件名，不加文件扩展名
            formData.append("file", files[i]);  //上传第一个文件
            const config = {
                headers: {
                    "Content-Type": "multipart/form-data"
                },
            }
            await axios.post("/myServer/doFileUpload", formData, config).then(res => {
              console.log(res)
            })
        }
    }

    renderItem({ row }) {
        return (
            <div>
                <img alt="" src={row.url} />
                <div style={{float:'left', width:30, display:'inline-block'}}><LinkButton iconCls="icon-clear" plain onClick={() => this.handleRemoveFile(row)}></LinkButton></div>
                <div className="textdiv" style={{float:'left', width:600, display:'inline-block', marginTop:4}}>{row.name}</div>
                <div className="textdiv" style={{float:'left', width:100, display:'inline-block', marginTop:4}}>{myFileSize(row.size)}</div>
                <div style={{clear:'both'}}></div>
            </div>
        )
    }

    render() {
        return (
            <div>
                <Panel  title="文件上传" iconCls="panelIcon" style={{ width: 750, height:300 }}>
                    <div className="panel-header" style={{ border: 0 }}>
                        <ButtonGroup>
                            <FileButton style={{ width: 200 }} text="选择文件" accept="/*" multiple onSelect={this.handleSelect.bind(this)} />
                            <LinkButton style={{ width: 72 }} iconCls="uploadIcon" onClick={this.handleUpload.bind(this)} autoUpload = {false}>上传</LinkButton>
                        </ButtonGroup>
                    </div>
                    <DataList style={{ minHeight: 100 }} border={false} data={this.state.files} renderItem={this.renderItem.bind(this)} />
                </Panel>
            </div>
        )
    }
}