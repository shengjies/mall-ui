import React,{Component} from 'react'
import NProgress from "nprogress";
export default class TinymceView extends Component {
    constructor(props){
        super(props)
        this.state={
            spinningLoading:false,
            data:{
                token:window.sessionStorage.getItem('token'),
            }
        }
    }
    componentWillMount(){
        window.tinymce.init({
            selector:"#tinymceId"
        })
    }
    render(){
        return(
            <div>
                编辑详情
                <textarea v-model="tinymceHtml"  class="tinymce-textarea" id="tinymceId"></textarea>
            </div>
        )
    }
}