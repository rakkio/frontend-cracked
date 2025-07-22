'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import ProtectedRoute from '@/components/ProtectedRoute'
import { api } from '@/lib/api'
import { FaSearch, FaEdit, FaTrash, FaSpinner, FaUser, FaUserShield, FaUserCheck } from 'react-icons/fa'

export default function UsersManagement() {
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [roleFilter, setRoleFilter] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const [pagination, setPagination] = useState({})

    const router = useRouter()

    useEffect(() => {
        fetchUsers()
    }, [])

    const fetchUsers = async () => {
        try {
            setLoading(true)
            // Since we don't have a users endpoint yet, we'll show a placeholder
            setUsers([])
        } catch (error) {
            console.error('Error fetching users:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleRoleChange = async (userId, newRole) => {
        if (!confirm(`Are you sure you want to change this user's role to ${newRole}?`)) return

        try {
            await api.updateUserRole(userId, { role: newRole })
            fetchUsers()
        } catch (error) {
            console.error('Error updating user role:', error)
            alert('Error updating user role: ' + error.message)
        }
    }

    const handleDeleteUser = async (userId) => {
        if (!confirm('Are you sure you want to delete this user?')) return

        try {
            await api.deleteUser(userId)
            fetchUsers()
        } catch (error) {
            console.error('Error deleting user:', error)
            alert('Error deleting user: ' + error.message)
        }
    }

    const getRoleIcon = (role) => {
        switch (role) {
            case 'admin':
                return <FaUserShield className="text-red-400" />
            case 'moderator':
                return <FaUserCheck className="text-yellow-400" />
            default:
                return <FaUser className="text-gray-400" />
        }
    }

    const getRoleBadgeColor = (role) => {
        switch (role) {
            case 'admin':
                return 'bg-red-500/20 text-red-400'
            case 'moderator':
                return 'bg-yellow-500/20 text-yellow-400'
            default:
                return 'bg-gray-500/20 text-gray-400'
        }
    }

    const filteredUsers = users.filter(user =>
        (user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
         user.email?.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (roleFilter === '' || user.role === roleFilter)
    )

    return (
        <ProtectedRoute requireAdmin={true}>
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-red-900 p-4">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-3xl font-bold text-white mb-8">Users Management</h1>
                    
                    <div className="bg-gray-800/50 p-8 rounded-xl text-center">
                        <h2 className="text-xl text-white mb-4">Users Management Coming Soon</h2>
                        <p className="text-gray-400">This feature will allow you to manage user accounts, roles, and permissions.</p>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    )
} 