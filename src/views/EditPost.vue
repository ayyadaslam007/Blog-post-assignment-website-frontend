<template>
  <div class="max-w-2xl mx-auto space-y-8">
    <div class="text-center">
      <h1 class="text-3xl font-bold text-gray-800">Edit Post ✏️</h1>
      <p class="text-gray-600 mt-2">Update the details of your blog post.</p>
    </div>
    <div v-if="loading" class="text-center py-12">
      <i class="pi pi-spin pi-spinner text-4xl text-blue-500"></i>
      <p class="mt-4 text-gray-600">Loading post data...</p>
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
        <router-link to="/admin">
          <Button
            label="Back to Admin"
            icon="pi pi-arrow-left"
            class="p-button-secondary"
          />
        </router-link>
      </div>
    </div>
    <Card v-else-if="post">
      <template #content>
        <form @submit.prevent="updatePost" class="p-4 space-y-6">
          <div>
            <label for="title" class="block text-sm font-medium text-gray-700 mb-2">Title</label>
            <InputText
              id="title"
              v-model="post.title"
              :class="{ 'p-invalid': errors.title }"
              class="w-full"
              placeholder="Enter post title"
            />
            <small v-if="errors.title" class="p-error">{{ errors.title }}</small>
          </div>
          <div>
            <label for="author" class="block text-sm font-medium text-gray-700 mb-2">Author</label>
            <InputText
              id="author"
              v-model="post.author"
              :class="{ 'p-invalid': errors.author }"
              class="w-full"
              placeholder="Enter your name"
            />
            <small v-if="errors.author" class="p-error">{{ errors.author }}</small>
          </div>
          <div>
            <label for="content" class="block text-sm font-medium text-gray-700 mb-2">Content</label>
            <Textarea
              id="content"
              v-model="post.content"
              :class="{ 'p-invalid': errors.content }"
              rows="10"
              class="w-full"
              placeholder="Write your blog post here..."
            />
            <small v-if="errors.content" class="p-error">{{ errors.content }}</small>
          </div>
          <div class="flex justify-end space-x-4">
            <router-link to="/admin">
              <Button
                label="Cancel"
                class="p-button-secondary"
                icon="pi pi-times"
              />
            </router-link>
            <Button
              type="submit"
              label="Save Changes"
              icon="pi pi-save"
              :loading="isUpdating"
            />
          </div>
        </form>
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import { blogApi, type BlogPost } from '../services/api'
import Card from 'primevue/card'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'

const route = useRoute()
const router = useRouter()
const toast = useToast()
const post = ref<BlogPost | null>(null)
const loading = ref(true)
const isUpdating = ref(false)
const error = ref<string | null>(null)
const errors = reactive({
  title: '',
  content: '',
  author: ''
})

const validateForm = () => {
  let isValid = true
  errors.title = post.value?.title.trim() === '' ? 'Title is required.' : ''
  errors.content = post.value?.content.trim() === '' ? 'Content is required.' : ''
  errors.author = post.value?.author.trim() === '' ? 'Author is required.' : ''
  if (errors.title || errors.content || errors.author) {
    isValid = false
  }
  return isValid
}

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

const updatePost = async () => {
  if (!post.value || !validateForm()) {
    toast.add({
      severity: 'error',
      summary: 'Validation Error',
      detail: 'Please fill in all required fields.',
      life: 3000
    })
    return
  }
  try {
    isUpdating.value = true
    await blogApi.updatePost(post.value._id, {
      title: post.value.title,
      content: post.value.content,
      author: post.value.author
    })
    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Post updated successfully!',
      life: 3000
    })
    router.push('/admin')
  } catch (err: any) {
    console.error('Error updating post:', err)
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to update post. Please try again.',
      life: 3000
    })
  } finally {
    isUpdating.value = false
  }
}

onMounted(() => {
  loadPost()
})
</script>