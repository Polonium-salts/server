'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function InitPage() {
  const [step, setStep] = useState(1); // 1: 检查状态, 2: 数据库配置, 3: 管理员设置, 4: 完成
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dbConfig, setDbConfig] = useState({
    host: 'sjc1.clusters.zeabur.com',
    user: 'root',
    password: '',
    database: 'zeabur',
    port: '30237'
  });
  const [adminData, setAdminData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const router = useRouter();

  // 检查初始化状态
  useEffect(() => {
    const checkInitStatus = async () => {
      try {
        const response = await fetch('/api/init-status');
        const data = await response.json();
        
        if (data.isInitialized) {
          // 已初始化，重定向到登录页面
          router.push('/admin/login');
        } else {
          // 未初始化，显示数据库配置表单
          setStep(2);
        }
      } catch (err) {
        setError('检查初始化状态失败');
      } finally {
        setLoading(false);
      }
    };

    checkInitStatus();
  }, [router]);

  const handleDbConfigChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDbConfig(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAdminChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAdminData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDbConfigSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // 测试数据库连接
      const response = await fetch('/api/test-db', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dbConfig),
      });

      const data = await response.json();

      if (response.ok) {
        // 数据库连接成功，进入下一步
        setStep(3);
      } else {
        setError(data.error || '数据库连接失败');
      }
    } catch (err) {
      setError('网络错误，请稍后再试');
    } finally {
      setLoading(false);
    }
  };

  const handleAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // 验证密码
    if (adminData.password !== adminData.confirmPassword) {
      setError('两次输入的密码不一致');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/init', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          dbConfig,
          admin: {
            username: adminData.username || 'admin',
            email: adminData.email || 'admin@example.com',
            password: adminData.password || 'admin123'
          }
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setStep(4); // 显示完成页面
      } else {
        setError(data.error || '初始化失败');
      }
    } catch (err) {
      setError('网络错误，请稍后再试');
    } finally {
      setLoading(false);
    }
  };

  if (loading && step === 1) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">正在检查初始化状态...</p>
        </div>
      </div>
    );
  }

  if (step === 2) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              数据库配置
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              请设置数据库连接信息
            </p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleDbConfigSubmit}>
            <div className="rounded-md shadow-sm space-y-4">
              <div>
                <label htmlFor="host" className="block text-sm font-medium text-gray-700 mb-1">
                  数据库主机
                </label>
                <input
                  id="host"
                  name="host"
                  type="text"
                  value={dbConfig.host}
                  onChange={handleDbConfigChange}
                  className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="数据库主机地址"
                  required
                />
              </div>
              <div>
                <label htmlFor="port" className="block text-sm font-medium text-gray-700 mb-1">
                  端口
                </label>
                <input
                  id="port"
                  name="port"
                  type="text"
                  value={dbConfig.port}
                  onChange={handleDbConfigChange}
                  className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="数据库端口"
                  required
                />
              </div>
              <div>
                <label htmlFor="user" className="block text-sm font-medium text-gray-700 mb-1">
                  用户名
                </label>
                <input
                  id="user"
                  name="user"
                  type="text"
                  value={dbConfig.user}
                  onChange={handleDbConfigChange}
                  className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="数据库用户名"
                  required
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  密码
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={dbConfig.password}
                  onChange={handleDbConfigChange}
                  className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="数据库密码"
                  required
                />
              </div>
              <div>
                <label htmlFor="database" className="block text-sm font-medium text-gray-700 mb-1">
                  数据库名
                </label>
                <input
                  id="database"
                  name="database"
                  type="text"
                  value={dbConfig.database}
                  onChange={handleDbConfigChange}
                  className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="数据库名称"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="text-red-500 text-sm text-center">
                {error}
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    测试连接中...
                  </>
                ) : (
                  '测试连接并继续'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  if (step === 3) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              管理员账户设置
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              请设置管理员账户信息
            </p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleAdminSubmit}>
            <div className="rounded-md shadow-sm space-y-4">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                  管理员用户名
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  value={adminData.username}
                  onChange={handleAdminChange}
                  className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="admin"
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  管理员邮箱
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={adminData.email}
                  onChange={handleAdminChange}
                  className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="admin@example.com"
                  required
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  管理员密码
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  value={adminData.password}
                  onChange={handleAdminChange}
                  className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="至少6位字符"
                  required
                />
              </div>
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  确认密码
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  value={adminData.confirmPassword}
                  onChange={handleAdminChange}
                  className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="再次输入密码"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="text-red-500 text-sm text-center">
                {error}
              </div>
            )}

            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="group relative w-full flex justify-center py-2 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                上一步
              </button>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    初始化中...
                  </>
                ) : (
                  '初始化应用'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  if (step === 4) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
            <svg className="h-6 w-6 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              初始化完成!
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              您的应用已成功初始化
            </p>
          </div>
          <div className="mt-8">
            <button
              onClick={() => router.push('/admin/login')}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              前往登录页面
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}