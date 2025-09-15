import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import PrimeVue from 'primevue/config'
import App from './App.vue'
import Tooltip from 'primevue/tooltip'

// Import PrimeVue components
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import Card from 'primevue/card'
import Toast from 'primevue/toast'
import ToastService from 'primevue/toastservice'
import ConfirmDialog from 'primevue/confirmdialog'
import ConfirmationService from 'primevue/confirmationservice'

// Import Views
import Home from '../src/views/Home.vue'
import BlogDetail from '../src/views/BlogDetail.vue'
import Admin from '../src/views/Admin.vue'
import CreatePost from '../src/views/CreatePost.vue'
import EditPost from '../src/views/EditPost.vue'

// Import CSS
import 'primevue/resources/themes/lara-light-blue/theme.css'
import 'primevue/resources/primevue.min.css'
import 'primeicons/primeicons.css'
import './style.css'

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/post/:id', name: 'BlogDetail', component: BlogDetail },
  { path: '/admin', name: 'Admin', component: Admin },
  { path: '/admin/create', name: 'CreatePost', component: CreatePost },
  { path: '/admin/edit/:id', name: 'EditPost', component: EditPost },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

const app = createApp(App)

app.use(router)
app.use(PrimeVue)
app.use(ToastService)
app.use(ConfirmationService)

// Register PrimeVue components
app.component('Button', Button)
app.component('InputText', InputText)
app.component('Textarea', Textarea)
app.component('Card', Card)
app.component('Toast', Toast)
app.component('ConfirmDialog', ConfirmDialog)

// Register PrimeVue directives
app.directive('tooltip', Tooltip)

app.mount('#app')