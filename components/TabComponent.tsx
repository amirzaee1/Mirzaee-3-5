
import React, { useState } from 'react';
import { TabItem } from '../types';

interface TabComponentProps {
  tabs: TabItem[];
  initialTabId?: string;
}

const TabComponent: React.FC<TabComponentProps> = ({ tabs, initialTabId }) => {
  const [activeTab, setActiveTab] = useState<string>(initialTabId || (tabs.length > 0 ? tabs[0].id : ''));

  if (!tabs || tabs.length === 0) {
    return <div className="text-center p-4">محتوایی برای نمایش وجود ندارد.</div>;
  }

  const activeTabContent = tabs.find(tab => tab.id === activeTab)?.content;

  return (
    <div className="w-full">
      <div className="border-b border-gray-700 mb-6">
        <nav className="-mb-px flex space-x-4 space-x-reverse overflow-x-auto" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`whitespace-nowrap py-3 px-4 border-b-2 font-medium text-sm transition-colors duration-200
                ${
                  activeTab === tab.id
                    ? 'border-purple-500 gold-text'
                    : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'
                }
              `}
              aria-current={activeTab === tab.id ? 'page' : undefined}
            >
              {tab.title}
            </button>
          ))}
        </nav>
      </div>
      <div className="p-2 bg-gray-800 bg-opacity-50 rounded-lg shadow-inner">
        {activeTabContent || <div className="text-center p-4">محتوای این تب یافت نشد.</div>}
      </div>
    </div>
  );
};

export default TabComponent;
