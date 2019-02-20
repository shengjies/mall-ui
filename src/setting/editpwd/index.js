import React,{Component} from 'react'
import NProgress from 'nprogress'
export default class EditPwdView extends Component{
    componentWillMount(){
        NProgress.start();
    }
    componentDidMount(){
        NProgress.done();
    }
    render(){
        return(
            <div>EditPwdView</div>
        )
    }
}