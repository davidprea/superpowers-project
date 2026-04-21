import { Routes, Route } from 'react-router-dom'
import PageLayout from '../layouts/PageLayout'

// Public pages
import Home from '../pages/public/Home'
import About from '../pages/public/About'
import Blog from '../pages/public/Blog'
import BlogPost from '../pages/public/BlogPost'
import Login from '../pages/public/Login'
import Members from '../pages/public/Members'
import Resources from '../pages/public/Resources'
import NewsletterSignup from '../pages/public/NewsletterSignup'
import Unsubscribe from '../pages/public/Unsubscribe'

// Admin pages
import AdminRoute from './AdminRoute'
import AdminLayout from '../layouts/AdminLayout'
import Dashboard from '../pages/admin/Dashboard'
import AdminSubscribers from '../pages/admin/Subscribers'
import AdminSubscriberDetail from '../pages/admin/SubscriberDetail'
import AdminTags from '../pages/admin/Tags'
import AdminBlog from '../pages/admin/BlogManager'
import AdminBlogEdit from '../pages/admin/BlogEdit'
import AdminResources from '../pages/admin/ResourceManager'
import AdminEmail from '../pages/admin/Email'
import AdminMemberSchools from '../pages/admin/MemberSchools'

export default function AppRouter() {
  return (
    <Routes>
      <Route element={<PageLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
        <Route path="/login" element={<Login />} />
        <Route path="/members" element={<Members />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/subscribe" element={<NewsletterSignup />} />
        <Route path="/unsubscribe" element={<Unsubscribe />} />
      </Route>

      <Route element={<AdminRoute />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<Dashboard />} />
          <Route path="/admin/subscribers" element={<AdminSubscribers />} />
          <Route path="/admin/subscribers/:id" element={<AdminSubscriberDetail />} />
          <Route path="/admin/tags" element={<AdminTags />} />
          <Route path="/admin/blog" element={<AdminBlog />} />
          <Route path="/admin/blog/new" element={<AdminBlogEdit />} />
          <Route path="/admin/blog/:id/edit" element={<AdminBlogEdit />} />
          <Route path="/admin/resources" element={<AdminResources />} />
          <Route path="/admin/members" element={<AdminMemberSchools />} />
          <Route path="/admin/email" element={<AdminEmail />} />
        </Route>
      </Route>
    </Routes>
  )
}
