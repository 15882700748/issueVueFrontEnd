import Vue from 'vue'
import VueRouter from 'vue-router'
import HomePage from '../views/home/Home'
import Login from '../views/Login'
import ForgetPassword from '../views/ForgetPassword'


Vue.use(VueRouter)

const routes = [
    {
        path : '/homePage',
        name : '首页',
        component:HomePage,
        children : [
            // {
            //     path : '/012',
            //     name : '样式1',
            //     component:Style012
            // },
            // {
            //     path : '/021',
            //     name : '样式2',
            //     component:Style021
            // },
            // {
            //     path : '/102',
            //     name : '样式3',
            //     component:Style102
            // },
            // {
            //     path : '/201',
            //     name : '样式4',
            //     component:Style201
            // },
        ]
    },
    {
        path : '/login',
        name : '前台登录',
        component:Login
    },
    {
        path : '/forgetPassword',
        name : '忘记密码',
        component:ForgetPassword
    }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})
router.beforeEach((to, from, next) =>{
    let isSelect = window.sessionStorage.getItem('isSelect')
    let paths = ['/','']
    if (paths.indexOf(to.path)!== -1 && !isSelect) return next(); //  是‘/’ 但为选择 放行
    if(!isSelect){// 不是 ‘/’ 也没有选择 则跳转 /
        return next('/')
    }else{
        if ('/reset'.indexOf(to.path)!== -1 && !isSelect){
            window.sessionStorage.removeItem('isSelect')
        }
        return next()
    }

})


export default router
