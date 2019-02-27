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
const LoadableLogin = Loadable({
  loader: () => import('./login'),
  loading: ()=>(''),
})
const LoadableNotFindView = Loadable({
  loader: () => import('./notfind'),
  loading: ()=>(''),
})

class App extends Component {
  render(){
    return(
      <LocaleProvider locale={zhCN}>
       <HashRouter>
          <Switch>
            <Route exact path='/' component={LoadableLogin}/>
            <Redirect exact path='/login' to='/'/>
            <Route path='/home'  render={props => window.sessionStorage.getItem('isLogin') === '1' ? (<LoadLayoutView {...props}/>):(<Redirect to='/login'/>)}/>
            <Route component={LoadableNotFindView} />
          </Switch>
        </HashRouter>
      </LocaleProvider>
    )
  }
}

export default App;
