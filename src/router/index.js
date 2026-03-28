import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LearningModuleLayout from '../views/LearningModule/LearningModuleLayout.vue'
import ScamDetector from '@/views/scamDetector/ScamDetector.vue'
import SimulationGames from '@/views/game/SimulationGames.vue'
import TrueOrFalse from '@/views/game/TrueOrFalse.vue'
import ChooseTheClue from '@/views/game/ChooseTheClue.vue'
import ClickAndMatch from '@/views/game/ClickAndMatch.vue'
import ActionGuide from '@/views/ActionGuide.vue'
import ScenarioStories from '@/views/ScenarioStories.vue'
import ScenarioView from '@/views/scenarios/ScenarioView.vue'
import ScamStatistics from '@/views/ScamStatistics.vue'
import NotFound from '@/views/NotFound.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [

    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/home',
      name: 'home',
      component: HomeView
    },
    {
      path: '/learning-module/:moduleName?',
      name: 'learningmodule',
      component: LearningModuleLayout,
      props: true,
      meta: { requiresAuth: true }
    },
    {
      path: '/scam-detector',
      name: 'scamdetector',
      component: ScamDetector,
      meta: { requiresAuth: true }
    },
    {
      path: '/simulation-games',
      name: 'simulationgames',
      component: SimulationGames,
      meta: { requiresAuth: true }
    },
    {
      path: '/simulation-games/true-or-false',
      name: 'trueorfalse',
      component: TrueOrFalse,
      meta: { requiresAuth: true }
    },
    {
      path: '/simulation-games/choose-the-clue',
      name: 'choosetheclue',
      component: ChooseTheClue,
      meta: { requiresAuth: true }
    },
    {
      path: '/simulation-games/click-and-match',
      name: 'clickandmatch',
      component: ClickAndMatch,
      meta: { requiresAuth: true }
    },
    {
      path: '/simulation-scenarios',
      name: 'simulationscenarios',
      component: ScenarioStories,
      meta: { requiresAuth: true }
    },
    {
      path: '/simulation-scenarios/:scenarioType',
      name: 'ScenarioPlay',
      component: ScenarioView,
      meta: { requiresAuth: true }
    },
    {
      path: '/action-guide',
      name: 'actionguide',
      component: ActionGuide,
      meta: { requiresAuth: true }
    },
    {
      path: '/scam-statistics',
      name: 'scamstatistics',
      component: ScamStatistics,
      meta: { requiresAuth: true }
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'notfound',
      component: NotFound,
      meta: { requiresAuth: true }
    }
  ],
})

//Route guard to check authentication
// router.beforeEach((to, from, next) => {
//   const isAuthenticated = sessionStorage.getItem('scamspot_auth') === 'true'

//   if (to.meta.requiresAuth && !isAuthenticated) {
//     next(`/?redirect=${to.path}`);
//   } else {
//     next()
//   }
// })


export default router
