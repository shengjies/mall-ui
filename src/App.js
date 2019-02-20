import React, { Component } from 'react';
import {LocaleProvider} from 'antd'
import {HashRouter,Switch,BrowserRouter as Router,Route,Redirect} from 'react-router-dom'
import Loadable from 'react-loadable'
import zhCN from 'antd/lib/locale-provider/zh_CN';
import 'nprogress/nprogress.css'
const LoadLayoutView = Loadable({
  loader: () => import('./layout'),
  loading: ()=>(''),
})
class App extends Component {
  render(){
    return(
      <LocaleProvider locale={zhCN}>
       <HashRouter>
          <Switch>
          <Redirect exact path='/' to='/home'/>
          {/* <Route exact path='/home' component={LoadLayoutView}/> */}
            <Route path='/home'  render={props =>  <LoadLayoutView {...props}/>}/>
          </Switch>
        </HashRouter>
      </LocaleProvider>
    )
  }
}

export default App;
