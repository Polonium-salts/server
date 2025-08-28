'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminSettings() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const router = useRouter();

  const handleReinitialize = async () => {
    if (!confirm('确定要重新初始化应用吗？这将清除所有数据并重新开始。')) {
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // 从localStorage获取token
      const token = localStorage.getItem('admin_token');
      
      if (!token) {
        setError('未登录');
        setLoading(false);
        return;
      }
      
      // 调用重新初始化API
      const response = await fetch('/api/admin/reinitialize', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || '重新初始化失败');
      }
      
      setSuccess('应用重新初始化成功！即将跳转到初始化页面...');
      
      // 3秒后跳转到初始化页面
      setTimeout(() => {
        router.push('/init');
      }, 3000);
    } catch (error) {
      console.error('Error reinitializing app:', error);
      setError((error as Error).message || '重新初始化失败');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 验证输入
    if (!newPassword || !confirmPassword) {
      setError('新密码和确认密码都是必填的');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setError('新密码和确认密码不匹配');
      return;
    }
    
    if (newPassword.length < 6) {
      setError('新密码长度至少为6位');
      return;
    }
    
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // 从localStorage获取token
      const token = localStorage.getItem('admin_token');
      
      if (!token) {
        setError('未登录');
        setLoading(false);
        return;
      }
      
      // 调用修改密码API
      const response = await fetch('/api/admin/change-password', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          newPassword
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || '修改密码失败');
      }
      
      setSuccess('密码修改成功');
      
      // 清空表单
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      console.error('Error changing password:', error);
      setError((error as Error).message || '修改密码失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="pb-5 border-b border-gray-200">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          设置
        </h3>
      </div>

      {/* 修改密码部分 */}
      <div className="mt-6 bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            修改密码
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            修改管理面板的登录密码
          </p>
        </div>
        <div className="border-t border-gray-200">
          <form onSubmit={handleChangePassword} className="px-4 py-5 sm:px-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                  新密码
                </label>
                <input
                  type="password"
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  确认新密码
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      修改中...
                    </>
                  ) : (
                    '修改密码'
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* 应用管理部分 */}
      <div className="mt-6 bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            应用管理
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            管理应用的初始化设置
          </p>
        </div>
        <div className="border-t border-gray-200">
          <dl>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">
                重新初始化应用
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <p className="mb-4">
                  此操作将清除所有数据并重新开始初始化过程。请谨慎操作。
                </p>
                <button
                  type="button"
                  onClick={handleReinitialize}
                  disabled={loading}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      处理中...
                    </>
                  ) : (
                    '重新初始化应用和数据库'
                  )}
                </button>
              </dd>
            </div>
          </dl>
        </div>
      </div>

      {error && (
        <div className="mt-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {success && (
        <div className="mt-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{success}</span>
        </div>
      )}
    </div>
  );
}