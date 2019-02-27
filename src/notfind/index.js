import React,{Component} from 'react'
import NProgress from 'nprogress'
export default class NotFindView extends Component{
    componentWillMount(){
        NProgress.start();
    }
    componentDidMount(){
        NProgress.done();
    }
    render(){
        return(
            <div style={{margin:'0 auto'}}>
                <h2 style={{color:"#000",maxHeight:100,textAlign:'center'}}>404</h2>
            </div>
        )
    }
} 