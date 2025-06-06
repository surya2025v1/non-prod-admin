"use client"

import { useState } from "react"
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff,
  Save,
  X,
  Shield,
  User,
  UserCheck,
  Mail,
  Calendar,
  Lock
} from "lucide-react"

interface AdminUser {
  id: number
  username: string
  email: string
  full_name: string
  role: 'admin' | 'editor' | 'viewer'
  permissions: string[]
  last_login: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export default function UsersManagement() {
  const [users, setUsers] = useState<AdminUser[]>([
    {
      id: 1,
      username: "admin",
      email: "admin@temple.org",
      full_name: "Temple Administrator",
      role: "admin",
      permissions: ["all_permissions"],
      last_login: "2024-01-15T10:30:00Z",
      is_active: true,
      created_at: "2024-01-01T00:00:00Z",
      updated_at: "2024-01-15T10:30:00Z"
    },
    {
      id: 2,
      username: "editor1",
      email: "editor@temple.org",
      full_name: "Content Editor",
      role: "editor",
      permissions: ["homepage_edit", "services_edit", "temple_info_edit"],
      last_login: "2024-01-14T16:45:00Z",
      is_active: true,
      created_at: "2024-01-02T00:00:00Z",
      updated_at: "2024-01-14T16:45:00Z"
    },
    {
      id: 3,
      username: "viewer1",
      email: "viewer@temple.org",
      full_name: "Content Viewer",
      role: "viewer",
      permissions: ["view_only"],
      last_login: null,
      is_active: false,
      created_at: "2024-01-03T00:00:00Z",
      updated_at: "2024-01-03T00:00:00Z"
    }
  ])

  const [showForm, setShowForm] = useState(false)
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null)
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    full_name: "",
    role: 'viewer' as 'admin' | 'editor' | 'viewer',
    permissions: [] as string[],
    password: "",
    confirm_password: "",
    is_active: true
  })

  const rolePermissions = {
    admin: ["all_permissions"],
    editor: ["homepage_edit", "services_edit", "temple_info_edit", "slider_edit", "welcome_edit"],
    viewer: ["view_only"]
  }

  const availablePermissions = [
    "all_permissions",
    "homepage_edit",
    "services_edit", 
    "temple_info_edit",
    "slider_edit",
    "welcome_edit",
    "user_management",
    "view_only"
  ]

  const handleEdit = (user: AdminUser) => {
    setEditingUser(user)
    setFormData({
      username: user.username,
      email: user.email,
      full_name: user.full_name,
      role: user.role,
      permissions: [...user.permissions],
      password: "",
      confirm_password: "",
      is_active: user.is_active
    })
    setShowForm(true)
  }

  const handleDelete = (id: number) => {
    const user = users.find(u => u.id === id)
    if (user?.role === 'admin' && users.filter(u => u.role === 'admin' && u.is_active).length <= 1) {
      alert("Cannot delete the last active admin user!")
      return
    }
    
    if (confirm("Are you sure you want to delete this user?")) {
      setUsers(prev => prev.filter(user => user.id !== id))
    }
  }

  const toggleActive = (id: number) => {
    const user = users.find(u => u.id === id)
    if (user?.role === 'admin' && users.filter(u => u.role === 'admin' && u.is_active).length <= 1 && user.is_active) {
      alert("Cannot deactivate the last active admin user!")
      return
    }

    setUsers(prev => 
      prev.map(user => 
        user.id === id ? { ...user, is_active: !user.is_active } : user
      )
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validation
    if (!editingUser && formData.password !== formData.confirm_password) {
      alert("Passwords do not match!")
      return
    }

    if (!editingUser && formData.password.length < 6) {
      alert("Password must be at least 6 characters long!")
      return
    }

    if (editingUser) {
      // Update existing user
      setUsers(prev => 
        prev.map(user => 
          user.id === editingUser.id 
            ? { 
                ...user, 
                username: formData.username,
                email: formData.email,
                full_name: formData.full_name,
                role: formData.role,
                permissions: formData.permissions,
                is_active: formData.is_active,
                updated_at: new Date().toISOString() 
              }
            : user
        )
      )
    } else {
      // Add new user
      const newUser: AdminUser = {
        id: Math.max(...users.map(user => user.id)) + 1,
        username: formData.username,
        email: formData.email,
        full_name: formData.full_name,
        role: formData.role,
        permissions: formData.permissions,
        last_login: null,
        is_active: formData.is_active,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      setUsers(prev => [...prev, newUser])
    }

    resetForm()
  }

  const resetForm = () => {
    setShowForm(false)
    setEditingUser(null)
    setFormData({
      username: "",
      email: "",
      full_name: "",
      role: 'viewer',
      permissions: [],
      password: "",
      confirm_password: "",
      is_active: true
    })
  }

  const handleRoleChange = (role: 'admin' | 'editor' | 'viewer') => {
    setFormData(prev => ({
      ...prev,
      role,
      permissions: [...rolePermissions[role]]
    }))
  }

  const togglePermission = (permission: string) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permission)
        ? prev.permissions.filter(p => p !== permission)
        : [...prev.permissions, permission]
    }))
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800'
      case 'editor': return 'bg-blue-100 text-blue-800'
      case 'viewer': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return Shield
      case 'editor': return Edit
      case 'viewer': return Eye
      default: return User
    }
  }

  const formatLastLogin = (lastLogin: string | null) => {
    if (!lastLogin) return 'Never'
    return new Date(lastLogin).toLocaleDateString() + ' ' + new Date(lastLogin).toLocaleTimeString()
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="mt-2 text-gray-600">
            Manage user accounts, roles, and permissions for the temple admin system.
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center px-4 py-2 bg-maroon-700 text-white rounded-lg hover:bg-maroon-800 transition-colors"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add User
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <Shield className="h-8 w-8 text-red-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Admins</p>
              <p className="text-2xl font-semibold text-gray-900">
                {users.filter(u => u.role === 'admin' && u.is_active).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <Edit className="h-8 w-8 text-blue-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Editors</p>
              <p className="text-2xl font-semibold text-gray-900">
                {users.filter(u => u.role === 'editor' && u.is_active).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <Eye className="h-8 w-8 text-gray-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Viewers</p>
              <p className="text-2xl font-semibold text-gray-900">
                {users.filter(u => u.role === 'viewer' && u.is_active).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <UserCheck className="h-8 w-8 text-green-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Active Users</p>
              <p className="text-2xl font-semibold text-gray-900">
                {users.filter(u => u.is_active).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Add/Edit Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingUser ? 'Edit User' : 'Add New User'}
              </h3>
              <button onClick={resetForm} className="text-gray-400 hover:text-gray-600">
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Username
                  </label>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-maroon-500 focus:border-maroon-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-maroon-500 focus:border-maroon-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.full_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-maroon-500 focus:border-maroon-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => handleRoleChange(e.target.value as any)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-maroon-500 focus:border-maroon-500"
                >
                  <option value="viewer">Viewer - View only access</option>
                  <option value="editor">Editor - Can edit content</option>
                  <option value="admin">Admin - Full access</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Permissions
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {availablePermissions.map(permission => (
                    <label key={permission} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.permissions.includes(permission)}
                        onChange={() => togglePermission(permission)}
                        className="rounded border-gray-300 text-maroon-600 focus:ring-maroon-500"
                      />
                      <span className="ml-2 text-sm text-gray-700 capitalize">
                        {permission.replace('_', ' ')}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {!editingUser && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Password
                    </label>
                    <input
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-maroon-500 focus:border-maroon-500"
                      required={!editingUser}
                      minLength={6}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      value={formData.confirm_password}
                      onChange={(e) => setFormData(prev => ({ ...prev, confirm_password: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-maroon-500 focus:border-maroon-500"
                      required={!editingUser}
                    />
                  </div>
                </div>
              )}

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
                  className="rounded border-gray-300 text-maroon-600 focus:ring-maroon-500"
                />
                <label htmlFor="is_active" className="ml-2 text-sm text-gray-700">
                  Active (user can login)
                </label>
              </div>

              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="flex-1 flex items-center justify-center px-4 py-2 bg-maroon-700 text-white rounded-lg hover:bg-maroon-800 transition-colors"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {editingUser ? 'Update' : 'Create'} User
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Users List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Users ({users.filter(user => user.is_active).length} active)
          </h3>
        </div>
        
        <div className="divide-y divide-gray-200">
          {users.map((user) => {
            const RoleIcon = getRoleIcon(user.role)
            
            return (
              <div key={user.id} className="p-6 flex items-center space-x-4">
                {/* User Avatar */}
                <div className="flex-shrink-0 w-12 h-12 bg-maroon-100 rounded-full flex items-center justify-center">
                  <RoleIcon className="h-6 w-6 text-maroon-600" />
                </div>

                {/* User Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className="text-lg font-medium text-gray-900">{user.full_name}</h4>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getRoleBadgeColor(user.role)}`}>
                      {user.role}
                    </span>
                    {user.is_active ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                        Inactive
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-1" />
                      {user.username}
                    </div>
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 mr-1" />
                      {user.email}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      Last login: {formatLastLogin(user.last_login)}
                    </div>
                  </div>
                  <div className="mt-1 text-xs text-gray-400">
                    Permissions: {user.permissions.join(', ')}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2">
                  {/* Toggle active */}
                  <button
                    onClick={() => toggleActive(user.id)}
                    className={`p-1 ${user.is_active ? 'text-green-600 hover:text-green-700' : 'text-gray-400 hover:text-gray-600'}`}
                  >
                    {user.is_active ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                  </button>

                  {/* Edit */}
                  <button
                    onClick={() => handleEdit(user)}
                    className="p-1 text-blue-600 hover:text-blue-700"
                  >
                    <Edit className="h-4 w-4" />
                  </button>

                  {/* Delete */}
                  <button
                    onClick={() => handleDelete(user.id)}
                    className="p-1 text-red-600 hover:text-red-700"
                    disabled={user.role === 'admin' && users.filter(u => u.role === 'admin' && u.is_active).length <= 1}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Help Text */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-sm font-medium text-blue-800 mb-2">
          User Management Guidelines:
        </h3>
        <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
          <li><strong>Admin:</strong> Full access to all features including user management</li>
          <li><strong>Editor:</strong> Can edit content but cannot manage users or system settings</li>
          <li><strong>Viewer:</strong> Read-only access to view content and reports</li>
          <li>At least one admin user must remain active at all times</li>
          <li>Use strong passwords and regularly review user permissions</li>
          <li>Inactive users cannot login but their data is preserved</li>
        </ul>
      </div>
    </div>
  )
} 