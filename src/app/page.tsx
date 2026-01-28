'use client'

import { useState } from 'react'
import { 
  Camera, 
  ImagePlus, 
  CheckCircle, 
  Video, 
  FolderOpen,
  Leaf
} from 'lucide-react'
import { AssetProvider } from '@/context/AssetContext'
import RestylePhoto from '@/components/tabs/RestylePhoto'
import CreatePhoto from '@/components/tabs/CreatePhoto'
import CreativeReviewer from '@/components/tabs/CreativeReviewer'
import UGCVideoCreator from '@/components/tabs/UGCVideoCreator'
import AssetLibrary from '@/components/tabs/AssetLibrary'

type TabId = 'restyle' | 'create' | 'review' | 'video' | 'library'

interface Tab {
  id: TabId
  label: string
  icon: React.ReactNode
  description: string
}

const tabs: Tab[] = [
  {
    id: 'restyle',
    label: 'Restyle Photo',
    icon: <Camera className="w-5 h-5" />,
    description: 'Transform images into BudgetThuis style'
  },
  {
    id: 'create',
    label: 'Create Photo',
    icon: <ImagePlus className="w-5 h-5" />,
    description: 'Generate new photos with actors'
  },
  {
    id: 'review',
    label: 'Creative Reviewer',
    icon: <CheckCircle className="w-5 h-5" />,
    description: 'Review assets for brand compliance'
  },
  {
    id: 'video',
    label: 'UGC Video Creator',
    icon: <Video className="w-5 h-5" />,
    description: 'Create UGC-style videos'
  },
  {
    id: 'library',
    label: 'Asset Library',
    icon: <FolderOpen className="w-5 h-5" />,
    description: 'Manage all generated assets'
  },
]

function DashboardContent() {
  const [activeTab, setActiveTab] = useState<TabId>('restyle')

  return (
    <div className="min-h-screen bg-bt-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-bt-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <img src="/images/btlogo.svg" alt="BudgetThuis" className="h-10" />
            </div>

            {/* User info */}
            <div className="flex items-center gap-4">
              <span className="text-sm text-bt-gray-600">Welkom terug!</span>
              <div className="w-10 h-10 bg-bt-green-100 rounded-full flex items-center justify-center">
                <span className="text-bt-green-600 font-semibold">BT</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <nav className="bg-white border-b border-bt-gray-200 shadow-bt">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-1 py-3 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-bt font-medium text-sm whitespace-nowrap transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'tab-active'
                    : 'tab-inactive'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Tab Description */}
      <div className="bg-bt-green-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-black font-bold text-lg">
            {tabs.find(t => t.id === activeTab)?.description}
          </p>
        </div>
      </div>

      {/* Main Content - All tabs rendered, visibility controlled by CSS */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        <div className={activeTab === 'restyle' ? '' : 'hidden'}>
          <RestylePhoto />
        </div>
        <div className={activeTab === 'create' ? '' : 'hidden'}>
          <CreatePhoto />
        </div>
        <div className={activeTab === 'review' ? '' : 'hidden'}>
          <CreativeReviewer />
        </div>
        <div className={activeTab === 'video' ? '' : 'hidden'}>
          <UGCVideoCreator />
        </div>
        <div className={activeTab === 'library' ? '' : 'hidden'}>
          <AssetLibrary />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-bt-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <p className="text-sm text-bt-gray-500">
              © 2026 BudgetThuis AI Creative Studio. Bij ons is het gras gewoon groener.
            </p>
            <div className="flex items-center gap-2 text-bt-green-500">
              <Leaf className="w-4 h-4" />
              <span className="text-sm font-medium">Simpel, betaalbaar én groen</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default function Dashboard() {
  return (
    <AssetProvider>
      <DashboardContent />
    </AssetProvider>
  )
}
