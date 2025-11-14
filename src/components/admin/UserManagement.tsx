import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';
import { api, User } from '../../lib/api';

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<User>>({});
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const data = await api.getUsers();
      setUsers(data);
    } catch (error) {
      console.error('Failed to load users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setIsCreating(true);
    setFormData({ id: '', username: '', display_name: '', email: '', enabled: true });
  };

  const handleEdit = (user: User) => {
    setEditingId(user.id);
    setFormData(user);
  };

  const handleSave = async () => {
    try {
      if (isCreating) {
        await api.createUser(formData);
      } else if (editingId) {
        await api.updateUser(editingId, formData);
      }
      await loadUsers();
      handleCancel();
    } catch (error) {
      console.error('Failed to save user:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this user?')) {
      try {
        await api.deleteUser(id);
        await loadUsers();
      } catch (error) {
        console.error('Failed to delete user:', error);
      }
    }
  };

  const handleCancel = () => {
    setIsCreating(false);
    setEditingId(null);
    setFormData({});
  };

  if (loading) {
    return <div className="text-center py-8">Loading users...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-slate-900">User Management</h2>
        {!isCreating && (
          <button
            onClick={handleCreate}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add User
          </button>
        )}
      </div>

      {isCreating && (
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-3">
          <h3 className="font-medium text-slate-900">Create New User</h3>
          <div className="grid grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="User ID"
              value={formData.id || ''}
              onChange={(e) => setFormData({ ...formData, id: e.target.value })}
              className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Username"
              value={formData.username || ''}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Display Name"
              value={formData.display_name || ''}
              onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
              className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="email"
              placeholder="Email"
              value={formData.email || ''}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Save className="w-4 h-4" />
              Save
            </button>
            <button
              onClick={handleCancel}
              className="flex items-center gap-2 px-4 py-2 bg-slate-300 text-slate-700 rounded-lg hover:bg-slate-400 transition-colors"
            >
              <X className="w-4 h-4" />
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-100 border-b border-slate-200">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900">ID</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900">Username</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900">Display Name</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900">Email</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900">Status</th>
              <th className="px-4 py-3 text-right text-sm font-semibold text-slate-900">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-slate-50">
                {editingId === user.id ? (
                  <>
                    <td className="px-4 py-3 text-sm text-slate-600">{user.id}</td>
                    <td className="px-4 py-3">
                      <input
                        type="text"
                        value={formData.username || ''}
                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        className="px-2 py-1 border border-slate-300 rounded text-sm w-full"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="text"
                        value={formData.display_name || ''}
                        onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
                        className="px-2 py-1 border border-slate-300 rounded text-sm w-full"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="email"
                        value={formData.email || ''}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="px-2 py-1 border border-slate-300 rounded text-sm w-full"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={formData.enabled ? 'active' : 'inactive'}
                        onChange={(e) => setFormData({ ...formData, enabled: e.target.value === 'active' })}
                        className="px-2 py-1 border border-slate-300 rounded text-sm"
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={handleSave} className="text-green-600 hover:text-green-800 p-1">
                        <Save className="w-4 h-4" />
                      </button>
                      <button onClick={handleCancel} className="text-slate-600 hover:text-slate-800 p-1 ml-2">
                        <X className="w-4 h-4" />
                      </button>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="px-4 py-3 text-sm text-slate-600">{user.id}</td>
                    <td className="px-4 py-3 text-sm text-slate-900">{user.username}</td>
                    <td className="px-4 py-3 text-sm text-slate-900">{user.display_name}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">{user.email || '-'}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          user.enabled
                            ? 'bg-green-100 text-green-800'
                            : 'bg-slate-100 text-slate-800'
                        }`}
                      >
                        {user.enabled ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => handleEdit(user)}
                        className="text-blue-600 hover:text-blue-800 p-1"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="text-red-600 hover:text-red-800 p-1 ml-2"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {users.length === 0 && (
        <div className="text-center py-8 text-slate-600">No users found. Click "Add User" to create one.</div>
      )}
    </div>
  );
}
