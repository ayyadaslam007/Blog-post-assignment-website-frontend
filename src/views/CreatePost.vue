<template>
  <div class="max-w-2xl mx-auto space-y-8">
    <div class="text-center">
      <h1 class="text-3xl font-bold text-gray-800">Create New Post ✍️</h1>
      <p class="text-gray-600 mt-2">Fill in the details to publish a new blog post.</p>
    </div>
    <Card>
      <template #content>
        <form @submit.prevent="submitPost" class="p-4 space-y-6">
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
              label="Publish Post"
              icon="pi pi-check"
              :loading="loading"
            />
          </div>
        </form>
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import { blogApi, type CreateBlogPostDto } from '../services/api'
import Card from 'primevue/card'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'

const router = useRouter()
const toast = useToast()

const loading = ref(false)
const post = ref<CreateBlogPostDto>({
  title: '',
  content: '',
  author: ''
})

const errors = reactive({
  title: '',
  content: '',
  author: ''
})

const validateForm = () => {
  let isValid = true
  errors.title = post.value.title.trim() === '' ? 'Title is required.' : ''
  errors.content = post.value.content.trim() === '' ? 'Content is required.' : ''
  errors.author = post.value.author.trim() === '' ? 'Author is required.' : ''
  if (errors.title || errors.content || errors.author) {
    isValid = false
  }
  return isValid
}

const submitPost = async () => {
  if (!validateForm()) {
    toast.add({
      severity: 'error',
      summary: 'Validation Error',
      detail: 'Please fill in all required fields.',
      life: 3000
    })
    return
  }
  try {
    loading.value = true
    await blogApi.createPost(post.value)
    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Post created successfully!',
      life: 3000
    })
    router.push('/admin')
  } catch (err: any) {
    console.error('Error creating post:', err)
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to create post. Please try again.',
      life: 3000
    })
  } finally {
    loading.value = false
  }
}
</script>