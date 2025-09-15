<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
        <p class="text-gray-600 mt-2">Manage your blog posts</p>
      </div>
      <router-link to="/admin/create">
        <Button
          label="Create New Post"
          icon="pi pi-plus"
          class="p-button-success"
        />
      </router-link>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <Card class="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
        <template #content>
          <div class="p-4">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-blue-100 text-sm">Total Posts</p>
                <p class="text-2xl font-bold">{{ posts.length }}</p>
              </div>
              <i class="pi pi-file text-3xl opacity-75"></i>
            </div>
          </div>
        </template>
      </Card>
      <Card class="bg-gradient-to-r from-green-500 to-green-600 text-white">
        <template #content>
          <div class="p-4">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-green-100 text-sm">Published Today</p>
                <p class="text-2xl font-bold">{{ todayPosts }}</p>
              </div>
              <i class="pi pi-calendar text-3xl opacity-75"></i>
            </div>
          </div>
        </template>
      </Card>
      <Card class="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
        <template #content>
          <div class="p-4">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-purple-100 text-sm">Authors</p>
                <p class="text-2xl font-bold">{{ uniqueAuthors }}</p>
              </div>
              <i class="pi pi-users text-3xl opacity-75"></i>
            </div>
          </div>
        </template>
      </Card>
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
    <Card v-else>
      <template #header>
        <div class="p-4 border-b">
          <h2 class="text-xl font-semibold text-gray-800">All Posts</h2>
        </div>
      </template>
      <template #content>
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="border-b bg-gray-50">
                <th class="text-left p-4 font-semibold text-gray-700">Title</th>
                <th class="text-left p-4 font-semibold text-gray-700">Author</th>
                <th class="text-left p-4 font-semibold text-gray-700">Created</th>
                <th class="text-left p-4 font-semibold text-gray-700">Updated</th>
                <th class="text-center p-4 font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="post in posts"
                :key="post._id"
                class="border-b hover:bg-gray-50 transition-colors"
              >
                <td class="p-4">
                  <div>
                    <h3 class="font-medium text-gray-900 mb-1">{{ post.title }}</h3>
                    <p class="text-sm text-gray-500 truncate max-w-xs">
                      {{ truncateContent(post.content, 100) }}
                    </p>
                  </div>
                </td>
                <td class="p-4 text-gray-700">{{ post.author }}</td>
                <td class="p-4 text-gray-500 text-sm">{{ formatDate(post.createdAt) }}</td>
                <td class="p-4 text-gray-500 text-sm">{{ formatDate(post.updatedAt) }}</td>
                <td class="p-4">
                  <div class="flex justify-center space-x-2">
                    <router-link :to="`/post/${post._id}`">
                      <Button
                        icon="pi pi-eye"
                        class="p-button-text p-button-sm"
                        v-tooltip.top="'View Post'"
                      />
                    </router-link>
                    <router-link :to="`/admin/edit/${post._id}`">
                      <Button
                        icon="pi pi-pencil"
                        class="p-button-text p-button-warning p-button-sm"
                        v-tooltip.top="'Edit Post'"
                      />
                    </router-link>
                    <Button
                      @click="confirmDelete(post)"
                      icon="pi pi-trash"
                      class="p-button-text p-button-danger p-button-sm"
                      v-tooltip.top="'Delete Post'"
                    />
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useToast } from 'primevue/usetoast'
import { useConfirm } from 'primevue/useconfirm'
import { blogApi, type BlogPost } from '../services/api'
import Card from 'primevue/card'
import Button from 'primevue/button'

const toast = useToast()
const confirm = useConfirm()
const posts = ref<BlogPost[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

const todayPosts = computed(() => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return posts.value.filter(post => {
    const postDate = new Date(post.createdAt)
    postDate.setHours(0, 0, 0, 0)
    return postDate.getTime() === today.getTime()
  }).length
})

const uniqueAuthors = computed(() => {
  const authors = new Set(posts.value.map(post => post.author))
  return authors.size
})

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

const confirmDelete = (post: BlogPost) => {
  confirm.require({
    message: `Are you sure you want to delete "${post.title}"? This action cannot be undone.`,
    header: 'Confirm Delete',
    icon: 'pi pi-exclamation-triangle',
    acceptClass: 'p-button-danger',
    accept: () => deletePost(post),
  })
}

const deletePost = async (post: BlogPost) => {
  try {
    await blogApi.deletePost(post._id)
    posts.value = posts.value.filter(p => p._id !== post._id)
    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Post deleted successfully!',
      life: 3000
    })
  } catch (err: any) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to delete post. Please try again.',
      life: 3000
    })
    console.error('Error deleting post:', err)
  }
}

const truncateContent = (content: string, maxLength: number) => {
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