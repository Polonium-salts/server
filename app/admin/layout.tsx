'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // 检查用户是否已登录
    const token = localStorage.getItem('admin_token');
    setIsLoggedIn(!!token);
    
    // 如果没有token且不在登录页面，重定向到登录页面
    if (!token && pathname !== '/admin/login') {
      router.push('/admin/login');
    }
  }, [pathname, router]);

  const handleLogout = () => {
    // 清除token并重定向到登录页面
    localStorage.removeItem('admin_token');
    setIsLoggedIn(false);
    router.push('/admin/login');
  };

  const navItems = [
    { name: 'Dashboard', href: '/admin' },
    { name: 'Users', href: '/admin/users' },
    { name: 'Database', href: '/admin/database' },
    { name: 'Settings', href: '/admin/settings' },
  ];

  // 如果用户未登录且不在登录页面，不渲染布局
  if (!isLoggedIn && pathname !== '/admin/login') {
    return <div className="min-h-screen flex items-center justify-center">正在重定向到登录页面...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {isLoggedIn && (
        <nav className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex">
                <div className="flex-shrink-0 flex items-center">
                  <h1 className="text-xl font-bold text-gray-900">管理面板</h1>
                </div>
                <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                  {navItems.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`${
                        pathname === item.href
                          ? 'border-indigo-500 text-gray-900'
                          : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                      } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>
              <div className="flex items-center">
                <button
                  onClick={handleLogout}
                  className="ml-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  登出
                </button>
              </div>
            </div>
          </div>
        </nav>
      )}

      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  );
}