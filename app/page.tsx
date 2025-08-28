'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkInitStatus = async () => {
      try {
        // 检查应用是否已初始化
        const response = await fetch('/api/init-status');
        const data = await response.json();
        
        if (data.isInitialized) {
          // 已初始化，重定向到管理面板登录页面
          router.push('/admin/login');
        } else {
          // 未初始化，重定向到初始化页面
          router.push('/init');
        }
      } catch (error) {
        console.error('检查初始化状态失败:', error);
        // 出错时默认重定向到初始化页面
        router.push('/init');
      } finally {
        setLoading(false);
      }
    };

    checkInitStatus();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">正在加载...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-lg">正在重定向...</p>
    </div>
  );
}