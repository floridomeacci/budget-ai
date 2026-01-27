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

export function AssetProvider({ children }: { children: ReactNode }) {
  const [assets, setAssets] = useState<Asset[]>([])

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
