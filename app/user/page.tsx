'use client'

import { useState } from 'react';
import { Mail, CreditCard, LogOut } from 'lucide-react';

export default function UserPage() {
  const [email, setEmail] = useState('user@example.com');
  const [isSubscribed, setIsSubscribed] = useState(true);

  const handleEmailChange = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Here you would typically make an API call to update the email
    alert('メールアドレスが更新されました');
  };

  const handleUnsubscribe = () => {
    // Here you would typically make an API call to cancel the subscription
    setIsSubscribed(false);
    alert('サブスクリプションが解除されました');
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-4 py-5 sm:px-6">
          <h2 className="text-lg leading-6 font-medium text-gray-900">ユーザー設定</h2>
        </div>
        <div className="border-t border-gray-200">
          <dl>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500 flex items-center">
                <Mail className="mr-2" /> メールアドレス
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <form onSubmit={handleEmailChange} className="flex">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-grow px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded-r-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    更新
                  </button>
                </form>
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500 flex items-center">
                <CreditCard className="mr-2" /> サブスクリプション
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {isSubscribed ? (
                  <button
                    onClick={handleUnsubscribe}
                    className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                  >
                    <LogOut className="inline mr-2" /> サブスクリプション解除
                  </button>
                ) : (
                  <span className="text-gray-500">サブスクリプションは解除されています</span>
                )}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}

