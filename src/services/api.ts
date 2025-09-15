import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export interface BlogPost {
  _id: string
  title: string
  content: string
  author: string
  createdAt: string
  updatedAt: string
}

export interface CreateBlogPostDto {
  title: string
  content: string
  author: string
}

export interface UpdateBlogPostDto {
  title?: string
  content?: string
  author?: string
}

export const blogApi = {
  // Get all blog posts
  getAllPosts: async (): Promise<BlogPost[]> => {
    const response = await api.get('/posts')
    return response.data
  },
  // Get single blog post
  getPost: async (id: string): Promise<BlogPost> => {
    const response = await api.get(`/posts/${id}`)
    return response.data
  },
  // Create new blog post
  createPost: async (post: CreateBlogPostDto): Promise<BlogPost> => {
    const response = await api.post('/posts', post)
    return response.data
  },
  // Update blog post
  updatePost: async (id: string, post: UpdateBlogPostDto): Promise<BlogPost> => {
    const response = await api.put(`/posts/${id}`, post) // Changed from patch to put based on your backend
    return response.data
  },
  // Delete blog post
  deletePost: async (id: string): Promise<void> => {
    await api.delete(`/posts/${id}`)
  },
}

export default api;