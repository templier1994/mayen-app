//Test new head 2
import Vue from 'vue'
import Router from 'vue-router'
import home from '../pages/Home'

import temperature from '../pages/Temperature'
import humidity from '../pages/Humidity'
import contact from '../pages/Contact'
import statistic from '../pages/Statistic'

Vue.use(Router)
const router = new Router({
    routes: [
        {
            path: '/',
            name: 'home',
            component: home
        },
        {
            path: '/humidity/:sectorName',
            name: 'humidity',
            props: true,
            component: humidity
        },
        {
            path: '/temperature/:sectorName',
            name: 'temperature',
            props: true,
            component: temperature
        },
        {
            path: '/contact',
            name: 'contact',
            component: contact

        },
        {
            path :'/statistic',
            name : 'statistic',
            component: statistic
        },
    ],


})

export default router
