<template>
  <div class="space-y-6">
    <div class="text-center py-8">
      <h1 class="text-4xl font-bold text-gray-800 mb-4">
        Welcome to Mini Blog
      </h1>
      <p class="text-lg text-gray-600 max-w-2xl mx-auto">
        Discover amazing articles, tutorials, and insights from our community of writers.
      </p>
    </div>
    <div v-if="loading" class="text-center py-12">
      <i class="pi pi-spin pi-spinner text-4xl text-blue-500"></i>
      <p class="mt-4 text-gray-600">Loading posts...</p>
    </div>
    <div v-else-if="error" class="text-center py-12">
      <i class="pi pi-exclamation-triangle text-4xl text-red-500"></i>
      <p class="mt-4 text-red-600">{{ error }}</p>
      <Button
        @click="loadPosts"
        class="mt-4"
        label="Try Again"
        icon="pi pi-refresh"
      />
    </div>
    <div v-else-if="posts.length === 0" class="text-center py-12">
      <i class="pi pi-file text-4xl text-gray-400"></i>
      <p class="mt-4 text-gray-600">No posts available yet.</p>
      <router-link to="/admin/create">
        <Button
          class="mt-4"
          label="Create First Post"
          icon="pi pi-plus"
        />
      </router-link>
    </div>
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card
        v-for="post in posts"
        :key="post._id"
        class="hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
        @click="goToPost(post._id)"
      >
        <template #header>
          <div class="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6">
            <h3 class="text-xl font-bold mb-2 line-clamp-2">
              {{ post.title }}
            </h3>
            <div class="flex items-center text-blue-100 text-sm">
              <i class="pi pi-user mr-2"></i>
              <span>{{ post.author }}</span>
            </div>
          </div>
        </template>
        <template #content>
          <div class="p-6">
            <p class="text-gray-600 mb-4 line-clamp-3">
              {{ truncateContent(post.content) }}
            </p>
            <div class="flex items-center justify-between text-sm text-gray-500">
              <div class="flex items-center">
                <i class="pi pi-calendar mr-2"></i>
                <span>{{ formatDate(post.createdAt) }}</span>
              </div>
              <span class="text-blue-600 font-medium hover:underline">
                Read more →
              </span>
            </div>
          </div>
        </template>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { blogApi, type BlogPost } from '../services/api'
import Card from 'primevue/card'
import Button from 'primevue/button'

const router = useRouter()
const posts = ref<BlogPost[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

const loadPosts = async () => {
  try {
    loading.value = true
    error.value = null
    posts.value = await blogApi.getAllPosts()
  } catch (err: any) {
    error.value = 'Failed to load posts. Please try again.'
    console.error('Error loading posts:', err)
  } finally {
    loading.value = false
  }
}

const goToPost = (id: string) => {
  router.push(`/post/${id}`)
}

const truncateContent = (content: string, maxLength: number = 150) => {
  if (content.length <= maxLength) return content
  return content.substring(0, maxLength) + '...'
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

onMounted(() => {
  loadPosts()
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>