'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

export interface Asset {
  id: string
  url: string
  type: 'restyle' | 'create' | 'ugc'
  label: 'red' | 'yellow' | 'green'
  createdAt: Date
  prompt?: string
  actor?: string
  product?: string
}

interface AssetContextType {
  assets: Asset[]
  addAsset: (asset: Omit<Asset, 'id' | 'createdAt'>) => void
  updateAssetLabel: (id: string, label: 'red' | 'yellow' | 'green') => void
  deleteAsset: (id: string) => void
}

const AssetContext = createContext<AssetContextType | undefined>(undefined)

// Demo assets that are always available
const demoAssets: Asset[] = [
  {
    id: 'demo-photo-1',
    url: '/demo/demo-photo.jpg',
    type: 'create',
    label: 'green',
    createdAt: new Date('2026-01-28'),
    prompt: 'Demo photo asset',
  },
  {
    id: 'demo-video-1',
    url: '/demo/demo-video.mp4',
    type: 'ugc',
    label: 'green',
    createdAt: new Date('2026-01-28'),
    prompt: 'Demo video asset',
  },
]

export function AssetProvider({ children }: { children: ReactNode }) {
  const [assets, setAssets] = useState<Asset[]>(demoAssets)

  const addAsset = (asset: Omit<Asset, 'id' | 'createdAt'>) => {
    const newAsset: Asset = {
      ...asset,
      id: Date.now().toString(),
      createdAt: new Date(),
    }
    setAssets(prev => [newAsset, ...prev])
  }

  const updateAssetLabel = (id: string, label: 'red' | 'yellow' | 'green') => {
    setAssets(prev => prev.map(asset => 
      asset.id === id ? { ...asset, label } : asset
    ))
  }

  const deleteAsset = (id: string) => {
    setAssets(prev => prev.filter(asset => asset.id !== id))
  }

  return (
    <AssetContext.Provider value={{ assets, addAsset, updateAssetLabel, deleteAsset }}>
      {children}
    </AssetContext.Provider>
  )
}

export function useAssets() {
  const context = useContext(AssetContext)
  if (context === undefined) {
    throw new Error('useAssets must be used within an AssetProvider')
  }
  return context
}
