import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [{
    path: '/',
    redirect: {
      name: 'login'
    }
  },
  {
    path: '/home',
    name: 'home',
    // redirect:{name:'workbench'},
    redirect: () => {
      let type = sessionStorage.getItem('userType')
      if (type == 1) {
        return {
          name: 'workbench'
        }
      }
      if (type == 2) {
        return {
          name: 'worlbenchStaff'
        }
      }
    },
    component: () => import('../views/Home.vue'),
    children: [{
        path: '/workbench',
        name: 'workbench',
        component: () => import('../views/workbench/WorkbenchBoss.vue'),
        meta: {
          keepAlive: false
        }
      },
      {

        path: '/worlbenchStaff',
        name: 'worlbenchStaff',
        component: () => import('../views/workbench/worlbenchStaff.vue'),
        meta: {
          StaffAuthority: true, // true 表示对子账号开放这个路由
          BossAuthority: true, // true表示对老板屏蔽这个路由
          keepAlive: false
        }
      },
      {
        path: '/order',
        name: 'order',
        component: () => import('../views/order/manager.vue'),
        meta: {
          StaffAuthority: true,
          keepAlive: false
        }
      },
      {
        path: '/order/orderdetails',
        name: 'orderdetails',
        component: () => import('../views/order/details.vue'),
        meta: {
          StaffAuthority: true,
          keepAlive: false
        }
      },
      {
        path: '/room',
        name: 'room',
        component: () => import('../views/room/Room.vue'),
        meta: {
          keepAlive: false
        }
      },
      {
        path: '/room/addRoom',
        name: 'addRoom',
        component: () => import('../views/room/AddRoom.vue'),
        meta: {
          keepAlive: false
        }
      },
      {
        path: '/room/roomDetails',
        name: 'roomDetails',
        component: () => import('../views/room/RoomDetails.vue'),
        meta: {
          keepAlive: false
        }
      },
      {
        path: '/room/videoList',
        name: 'videoList',
        component: () => import('../views/room/VideoList.vue'),
        meta: {
          keepAlive: false
        }
      },
      {

        path: '/roleSet',
        name: 'roleSet',
        component: () => import('../views/RoleSet.vue'),
        meta: {
          keepAlive: false
        }
      },
      {

        path: '/hotelSet',
        name: 'hotelSet',
        component: () => import('../views/HotelSet.vue'),
        meta: {
          keepAlive: false
        }
      },
    ]
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/login.vue'),
    meta: {
      keepAlive: false
    }
  },
  {
    path: '/merchantEnter',
    name: 'merchantEnter',
    component: () => import('../views/merchantEnter/merchantEnter.vue'),
    meta: {
      keepAlive: false
    }
  },
  {
    path: '/uploadData',
    name: 'uploadData',
    component: () => import('../views/merchantEnter/uploadData.vue'),
  }
]






const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  let islogin = sessionStorage.getItem('token')
  let type = sessionStorage.getItem('userType')
  if (to.path == '/login' || to.path == '/merchantEnter' || to.path == '/uploadData') {
    next()
  } else {
    if (!islogin) {
      next('/login')
    } else {
      // type 1 表示主账号 2 表示子账号
      if (type == 1 && !to.meta.BossAuthority) {
        next()
      }
      if (type == 2 && to.meta.StaffAuthority) {
        next()
      }
    }
  }
})




export default router