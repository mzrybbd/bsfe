import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import(/* webpackChunkName: "home" */ './components/home/index.vue'),
      children: [
        {
          path: 'index',
          name: 'index',
          component: () => import(/* webpackChunkName: "index" */ './components/home/chirdren/index.vue')
        },
        {
          path: 'detail',
          name: 'detail',
          component: () => import(/* webpackChunkName: "detail" */ './components/home/chirdren/detail.vue')
        },
        {
          path: 'experiment',
          name: 'experiment',
          component: () => import(/* webpackChunkName: "experiment" */ './components/experiment/index.vue')
        },
        {
          path: 'coursetable',
          name: 'coursetable',
          component: () => import(/* webpackChunkName: "coursetable" */ './components/coursetable/index.vue')
        },
        {
          path: 'message',
          name: 'message',
          component: () => import(/* webpackChunkName: "message" */ './components/message/index.vue')
        },
        {
          path: 'personalCenter',
          name: 'personalCenter',
          component: () => import(/* webpackChunkName: "personalCenter" */ './components/personalCenter/index.vue')
        }
      ]
    },
    {
      path: '/teacher',
      name: 'teacher',
      component: () => import(/* webpackChunkName: "teacher" */ './components/teacher/index.vue'),
      children: [
        {
          path: 'introduction',
          name: 'introduction',
          component: () => import(/* webpackChunkName: "introduction" */ './components/teacher/chirdren/introduction.vue')
        },
        {
          path: 'class_manager',
          name: 'class_manager',
          component: () => import(/* webpackChunkName: "class_manager" */ './components/teacher/chirdren/class_manager.vue')
        },
        {
          path: 'score_manager',
          name: 'score_manager',
          component: () => import(/* webpackChunkName: "score_manager" */ './components/teacher/chirdren/score_manager.vue')
        },
        {
          path: 'kq_manager',
          name: 'kq_manager',
          component: () => import(/* webpackChunkName: "kq_manager" */ './components/teacher/chirdren/kq_manager.vue')
        },
        {
          path: 'coursetable_manager',
          name: 'coursetable_manager',
          component: () => import(/* webpackChunkName: "coursetable_manager" */ './components/teacher/chirdren/coursetable_manager.vue')
        },
        {
          path: 'expriment_manager',
          name: 'expriment_manager',
          component: () => import(/* webpackChunkName: "expriment_manager" */ './components/teacher/chirdren/expriment_manager.vue')
        },
        {
          path: 'expriment_record',
          name: 'expriment_record',
          component: () => import(/* webpackChunkName: "expriment_record" */ './components/teacher/chirdren/expriment_record.vue')
        },
        {
          path: 'message_manager',
          name: 'message_manager',
          component: () => import(/* webpackChunkName: "message" */ './components/teacher/chirdren/message_manager.vue')
        },
        {
          path: 'person_info',
          name: 'person_info',
          component: () => import(/* webpackChunkName: "person_info" */ './components/teacher/chirdren/person_info.vue')
        }
      ]
    },
    {
      path: '/register',
      name: 'register',
      component: () => import(/* webpackChunkName: "register" */ './components/register/index.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import(/* webpackChunkName: "login" */ './components/login/index.vue')
    },
    {
      path: '/syster',
      name: 'syster',
      component: () => import(/* webpackChunkName: "syster" */ './components/syster/index.vue'),
      children: [{
        path: 'user',
        name: 'user',
        component: () => import(/* webpackChunkName: "user" */ './components/syster/children/user_manager.vue')
      },
      {
        path: 'class',
        name: 'class',
        component: () => import(/* webpackChunkName: "class" */ './components/syster/children/class_manager.vue')
      },
      {
        path: 'home',
        name: 'homes',
        component: () => import(/* webpackChunkName: "home" */ './components/syster/children/home_manager.vue')
      },
      {
        path: 'teacher',
        name: 'teachers',
        component: () => import(/* webpackChunkName: "teachers" */ './components/syster/children/teacher_manager.vue')
      },
      {
        path: 'student',
        name: 'student',
        component: () => import(/* webpackChunkName: "student" */ './components/syster/children/student_manager.vue')
      }]
    },
    {
      path: '*',
      name: 'notFound',
      component: () => import(/* webpackChunkName: "notFound" */ './components/public/404.vue')
    }
  ]
})
