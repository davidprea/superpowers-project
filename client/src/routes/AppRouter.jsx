import { Routes, Route } from 'react-router-dom'
import PageLayout from '../layouts/PageLayout'

// Public pages
import Home from '../pages/public/Home'
import About from '../pages/public/About'
import Blog from '../pages/public/Blog'
import BlogPost from '../pages/public/BlogPost'
import Login from '../pages/public/Login'
import Register from '../pages/public/Register'
import MemberProfile from '../pages/public/MemberProfile'
import Members from '../pages/public/Members'

// Member pages
import MemberRoute from './MemberRoute'
import Resources from '../pages/members/Resources'
import EditProfile from '../pages/members/EditProfile'

// Admin pages
import AdminRoute from './AdminRoute'
import AdminLayout from '../layouts/AdminLayout'
import Dashboard from '../pages/admin/Dashboard'
import AdminUsers from '../pages/admin/Users'
import AdminUserDetail from '../pages/admin/UserDetail'
import AdminTags from '../pages/admin/Tags'
import AdminBlog from '../pages/admin/BlogManager'
import AdminBlogEdit from '../pages/admin/BlogEdit'
import AdminResources from '../pages/admin/ResourceManager'
import AdminEmail from '../pages/admin/Email'

export default function AppRouter() {
  return (
    <Routes>
      <Route element={<PageLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/members" element={<Members />} />
        <Route path="/members/:id" element={<MemberProfile />} />

        <Route element={<MemberRoute />}>
          <Route path="/resources" element={<Resources />} />
          <Route path="/profile/edit" element={<EditProfile />} />
        </Route>
      </Route>

      <Route element={<AdminRoute />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<Dashboard />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/users/:id" element={<AdminUserDetail />} />
          <Route path="/admin/tags" element={<AdminTags />} />
          <Route path="/admin/blog" element={<AdminBlog />} />
          <Route path="/admin/blog/new" element={<AdminBlogEdit />} />
          <Route path="/admin/blog/:id/edit" element={<AdminBlogEdit />} />
          <Route path="/admin/resources" element={<AdminResources />} />
          <Route path="/admin/email" element={<AdminEmail />} />
        </Route>
      </Route>
    </Routes>
  )
}
