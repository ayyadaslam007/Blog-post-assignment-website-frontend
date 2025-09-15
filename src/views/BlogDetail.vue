<template>
  <div>
    <div v-if="loading" class="text-center py-12">
      <i class="pi pi-spin pi-spinner text-4xl text-blue-500"></i>
      <p class="mt-4 text-gray-600">Loading post...</p>
    </div>
    <div v-else-if="error" class="text-center py-12">
      <i class="pi pi-exclamation-triangle text-4xl text-red-500"></i>
      <p class="mt-4 text-red-600">{{ error }}</p>
      <div class="mt-4 space-x-4">
        <Button
          @click="loadPost"
          label="Try Again"
          icon="pi pi-refresh"
        />
        <router-link to="/">
          <Button
            label="Back to Home"
            icon="pi pi-arrow-left"
            class="p-button-secondary"
          />
        </router-link>
      </div>
    </div>
    <div v-else-if="post" class="max-w-4xl mx-auto">
      <div class="mb-6">
        <router-link to="/">
          <Button
            label="← Back to Posts"
            class="p-button-text p-button-secondary"
            icon="pi pi-arrow-left"
          />
        </router-link>
      </div>
      <div class="bg-gradient-to-r from-blue-600 to-purple-700 text-white rounded-lg p-8 mb-8">
        <h1 class="text-3xl md:text-4xl font-bold mb-4">
          {{ post.title }}
        </h1>
        <div class="flex flex-col md:flex-row md:items-center md:justify-between text-blue-100">
          <div class="flex items-center mb-2 md:mb-0">
            <i class="pi pi-user mr-2"></i>
            <span class="text-lg">By {{ post.author }}</span>
          </div>
          <div class="flex items-center space-x-4 text-sm">
            <div class="flex items-center">
              <i class="pi pi-calendar mr-2"></i>
              <span>Published {{ formatDate(post.createdAt) }}</span>
            </div>
            <div v-if="post.updatedAt !== post.createdAt" class="flex items-center">
              <i class="pi pi-clock mr-2"></i>
              <span>Updated {{ formatDate(post.updatedAt) }}</span>
            </div>
          </div>
        </div>
      </div>
      <Card class="shadow-lg">
        <template #content>
          <div class="prose prose-lg max-w-none p-6">
            <div class="whitespace-pre-line text-gray-700 leading-relaxed">
              {{ post.content }}
            </div>
          </div>
        </template>
      </Card>
      <div class="mt-8 flex justify-center space-x-4">
        <router-link :to="`/admin/edit/${post._id}`">
          <Button
            label="Edit Post"
            icon="pi pi-pencil"
            class="p-button-warning"
          />
        </router-link>
        <Button
          @click="confirmDelete"
          label="Delete Post"
          icon="pi pi-trash"
          class="p-button-danger"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import { useConfirm } from 'primevue/useconfirm'
import { blogApi, type BlogPost } from '../services/api'
import Card from 'primevue/card'
import Button from 'primevue/button'

const route = useRoute()
const router = useRouter()
const toast = useToast()
const confirm = useConfirm()

const post = ref<BlogPost | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)

const loadPost = async () => {
  try {
    loading.value = true
    error.value = null
    const id = route.params.id as string
    post.value = await blogApi.getPost(id)
  } catch (err: any) {
    error.value = err.response?.status === 404
      ? 'Post not found.'
      : 'Failed to load post. Please try again.'
    console.error('Error loading post:', err)
  } finally {
    loading.value = false
  }
}

const confirmDelete = () => {
  confirm.require({
    message: 'Are you sure you want to delete this post? This action cannot be undone.',
    header: 'Confirm Delete',
    icon: 'pi pi-exclamation-triangle',
    acceptClass: 'p-button-danger',
    accept: deletePost,
  })
}

const deletePost = async () => {
  if (!post.value) return
  try {
    await blogApi.deletePost(post.value._id)
    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Post deleted successfully!',
      life: 3000
    })
    router.push('/')
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

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

onMounted(() => {
  loadPost()
})
</script>

<style scoped>
.prose {
  line-height: 1.75;
}
.prose p {
  margin-bottom: 1.5rem;
}
</style>