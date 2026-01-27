'use client'

import { useState } from 'react'
import { 
  Search, 
  Filter, 
  Download, 
  CheckCircle, 
  Clock, 
  XCircle,
  Image as ImageIcon,
  Video,
  FileText,
  Grid,
  List,
  MoreVertical,
  Eye,
  Trash2,
  FolderDown,
  ChevronDown
} from 'lucide-react'

type AssetType = 'all' | 'image' | 'video' | 'document'
type AssetStatus = 'all' | 'pending' | 'approved' | 'rejected' | 'processing'
type ViewMode = 'grid' | 'list'

interface Asset {
  id: string
  name: string
  type: 'image' | 'video' | 'document'
  category: string
  status: 'pending' | 'approved' | 'rejected' | 'processing'
  createdAt: Date
  createdBy: string
  thumbnail: string
  size: string
  dimensions?: string
  duration?: string
  formats: string[]
}

const sampleAssets: Asset[] = [
  {
    id: '1',
    name: 'Homepage_Banner_Winter_2026.jpg',
    type: 'image',
    category: 'Restyle Photo',
    status: 'approved',
    createdAt: new Date('2026-01-25'),
    createdBy: 'AI Generator',
    thumbnail: '',
    size: '2.4 MB',
    dimensions: '1920x1080',
    formats: ['JPG', 'PNG', 'WEBP']
  },
  {
    id: '2',
    name: 'Social_Energy_Promo.mp4',
    type: 'video',
    category: 'UGC Video',
    status: 'pending',
    createdAt: new Date('2026-01-25'),
    createdBy: 'AI Generator',
    thumbnail: '',
    size: '12.8 MB',
    duration: '0:28',
    formats: ['MP4', 'MOV', 'GIF']
  },
  {
    id: '3',
    name: 'Actor_Sophie_Kitchen.png',
    type: 'image',
    category: 'Create Photo',
    status: 'approved',
    createdAt: new Date('2026-01-24'),
    createdBy: 'AI Generator',
    thumbnail: '',
    size: '1.8 MB',
    dimensions: '1080x1080',
    formats: ['PNG', 'JPG', 'WEBP']
  },
  {
    id: '4',
    name: 'Email_Header_Groene_Stroom.jpg',
    type: 'image',
    category: 'Restyle Photo',
    status: 'rejected',
    createdAt: new Date('2026-01-24'),
    createdBy: 'AI Generator',
    thumbnail: '',
    size: '890 KB',
    dimensions: '600x200',
    formats: ['JPG', 'PNG']
  },
  {
    id: '5',
    name: 'UGC_Mark_Internet.mp4',
    type: 'video',
    category: 'UGC Video',
    status: 'processing',
    createdAt: new Date('2026-01-26'),
    createdBy: 'AI Generator',
    thumbnail: '',
    size: '15.2 MB',
    duration: '0:32',
    formats: ['MP4']
  },
  {
    id: '6',
    name: 'Familie_Woonkamer_Budget.png',
    type: 'image',
    category: 'Create Photo',
    status: 'pending',
    createdAt: new Date('2026-01-23'),
    createdBy: 'AI Generator',
    thumbnail: '',
    size: '2.1 MB',
    dimensions: '1920x1080',
    formats: ['PNG', 'JPG', 'WEBP']
  },
  {
    id: '7',
    name: 'Social_Story_Mobiel.mp4',
    type: 'video',
    category: 'UGC Video',
    status: 'approved',
    createdAt: new Date('2026-01-22'),
    createdBy: 'AI Generator',
    thumbnail: '',
    size: '8.4 MB',
    duration: '0:15',
    formats: ['MP4', 'MOV', 'GIF']
  },
  {
    id: '8',
    name: 'Banner_Alles_in_1.jpg',
    type: 'image',
    category: 'Restyle Photo',
    status: 'approved',
    createdAt: new Date('2026-01-21'),
    createdBy: 'AI Generator',
    thumbnail: '',
    size: '1.5 MB',
    dimensions: '728x90',
    formats: ['JPG', 'PNG', 'GIF']
  },
]

const categories = ['Alle', 'Restyle Photo', 'Create Photo', 'UGC Video']

export default function AssetLibrary() {
  const [assets] = useState<Asset[]>(sampleAssets)
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState<AssetType>('all')
  const [statusFilter, setStatusFilter] = useState<AssetStatus>('all')
  const [categoryFilter, setCategoryFilter] = useState('Alle')
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [selectedAssets, setSelectedAssets] = useState<string[]>([])
  const [showDownloadMenu, setShowDownloadMenu] = useState<string | null>(null)

  const filteredAssets = assets.filter(asset => {
    const matchesSearch = asset.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = typeFilter === 'all' || asset.type === typeFilter
    const matchesStatus = statusFilter === 'all' || asset.status === statusFilter
    const matchesCategory = categoryFilter === 'Alle' || asset.category === categoryFilter
    return matchesSearch && matchesType && matchesStatus && matchesCategory
  })

  const toggleAssetSelection = (id: string) => {
    setSelectedAssets(prev => 
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    )
  }

  const selectAll = () => {
    if (selectedAssets.length === filteredAssets.length) {
      setSelectedAssets([])
    } else {
      setSelectedAssets(filteredAssets.map(a => a.id))
    }
  }

  const getStatusBadge = (status: Asset['status']) => {
    switch (status) {
      case 'approved':
        return (
          <span className="badge badge-approved flex items-center gap-1">
            <CheckCircle className="w-3 h-3" />
            Goedgekeurd
          </span>
        )
      case 'pending':
        return (
          <span className="badge badge-pending flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Wachtend
          </span>
        )
      case 'rejected':
        return (
          <span className="badge badge-rejected flex items-center gap-1">
            <XCircle className="w-3 h-3" />
            Afgewezen
          </span>
        )
      case 'processing':
        return (
          <span className="badge badge-processing flex items-center gap-1">
            <div className="w-3 h-3 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
            Verwerken
          </span>
        )
    }
  }

  const getTypeIcon = (type: Asset['type']) => {
    switch (type) {
      case 'image':
        return <ImageIcon className="w-5 h-5 text-bt-green-500" />
      case 'video':
        return <Video className="w-5 h-5 text-purple-500" />
      case 'document':
        return <FileText className="w-5 h-5 text-blue-500" />
    }
  }

  const statusCounts = {
    all: assets.length,
    pending: assets.filter(a => a.status === 'pending').length,
    approved: assets.filter(a => a.status === 'approved').length,
    rejected: assets.filter(a => a.status === 'rejected').length,
    processing: assets.filter(a => a.status === 'processing').length,
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { key: 'all' as const, label: 'Totaal', color: 'bg-bt-gray-100 text-bt-dark-700' },
          { key: 'pending' as const, label: 'Wachtend', color: 'bg-yellow-100 text-yellow-700' },
          { key: 'processing' as const, label: 'Verwerken', color: 'bg-blue-100 text-blue-700' },
          { key: 'approved' as const, label: 'Goedgekeurd', color: 'bg-bt-green-100 text-bt-green-700' },
          { key: 'rejected' as const, label: 'Afgewezen', color: 'bg-red-100 text-red-700' },
        ].map((stat) => (
          <button
            key={stat.key}
            onClick={() => setStatusFilter(stat.key)}
            className={`p-4 rounded-bt-lg transition-all ${
              statusFilter === stat.key 
                ? 'ring-2 ring-bt-green-500 ring-offset-2' 
                : ''
            } ${stat.color}`}
          >
            <p className="text-2xl font-bold">{statusCounts[stat.key]}</p>
            <p className="text-sm opacity-80">{stat.label}</p>
          </button>
        ))}
      </div>

      {/* Filters Bar */}
      <div className="card">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-bt-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Zoek op bestandsnaam..."
              className="input-field pl-10"
            />
          </div>

          {/* Type Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-bt-gray-400" />
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as AssetType)}
              className="input-field w-auto"
            >
              <option value="all">Alle types</option>
              <option value="image">Afbeeldingen</option>
              <option value="video">Videos</option>
              <option value="document">Documenten</option>
            </select>
          </div>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="input-field w-auto"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 bg-bt-gray-100 rounded-bt p-1 flex-shrink-0">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded transition-colors ${
                viewMode === 'grid' ? 'bg-white shadow-sm' : 'hover:bg-bt-gray-200'
              }`}
            >
              <Grid className="w-5 h-5 text-bt-dark-600" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded transition-colors ${
                viewMode === 'list' ? 'bg-white shadow-sm' : 'hover:bg-bt-gray-200'
              }`}
            >
              <List className="w-5 h-5 text-bt-dark-600" />
            </button>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedAssets.length > 0 && (
          <div className="mt-4 pt-4 border-t border-bt-gray-200 flex items-center gap-4">
            <span className="text-sm text-bt-gray-600">
              {selectedAssets.length} geselecteerd
            </span>
            <button className="btn-primary py-2 flex items-center gap-2">
              <FolderDown className="w-4 h-4" />
              Download Selectie
            </button>
            <button className="btn-secondary py-2 flex items-center gap-2 text-red-600 hover:text-red-700">
              <Trash2 className="w-4 h-4" />
              Verwijderen
            </button>
            <button
              onClick={() => setSelectedAssets([])}
              className="text-sm text-bt-gray-500 hover:text-bt-dark-700"
            >
              Deselecteer alles
            </button>
          </div>
        )}
      </div>

      {/* Asset Grid/List */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-sm text-bt-gray-600 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedAssets.length === filteredAssets.length && filteredAssets.length > 0}
                onChange={selectAll}
                className="accent-bt-green-500 w-4 h-4"
              />
              Selecteer alles
            </label>
          </div>
          <p className="text-sm text-bt-gray-500">{filteredAssets.length} assets</p>
        </div>

        {viewMode === 'grid' ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredAssets.map((asset) => (
              <div
                key={asset.id}
                className={`group rounded-bt-lg border-2 overflow-hidden transition-all ${
                  selectedAssets.includes(asset.id)
                    ? 'border-bt-green-500 bg-bt-green-50'
                    : 'border-bt-gray-200 hover:border-bt-green-300'
                }`}
              >
                {/* Thumbnail */}
                <div className="aspect-video bg-bt-gray-100 relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    {asset.type === 'video' ? (
                      <Video className="w-12 h-12 text-bt-gray-300" />
                    ) : (
                      <ImageIcon className="w-12 h-12 text-bt-gray-300" />
                    )}
                  </div>
                  
                  {/* Selection Checkbox */}
                  <div className="absolute top-2 left-2">
                    <input
                      type="checkbox"
                      checked={selectedAssets.includes(asset.id)}
                      onChange={() => toggleAssetSelection(asset.id)}
                      className="accent-bt-green-500 w-5 h-5 rounded"
                    />
                  </div>

                  {/* Type Badge */}
                  <div className="absolute top-2 right-2">
                    {getTypeIcon(asset.type)}
                  </div>

                  {/* Hover Actions */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button className="p-2 bg-white rounded-full hover:bg-bt-green-50">
                      <Eye className="w-4 h-4 text-bt-dark-700" />
                    </button>
                    <div className="relative">
                      <button 
                        onClick={() => setShowDownloadMenu(showDownloadMenu === asset.id ? null : asset.id)}
                        className="p-2 bg-white rounded-full hover:bg-bt-green-50"
                      >
                        <Download className="w-4 h-4 text-bt-dark-700" />
                      </button>
                      {showDownloadMenu === asset.id && (
                        <div className="absolute top-full right-0 mt-2 bg-white rounded-bt shadow-bt-md border border-bt-gray-200 py-2 min-w-[140px] z-10">
                          {asset.formats.map(format => (
                            <button
                              key={format}
                              className="w-full px-4 py-2 text-left text-sm hover:bg-bt-gray-50 flex items-center justify-between"
                            >
                              <span>Download {format}</span>
                              <ChevronDown className="w-4 h-4 text-bt-gray-400 rotate-[-90deg]" />
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    <button className="p-2 bg-white rounded-full hover:bg-red-50">
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </div>

                  {/* Processing Overlay */}
                  {asset.status === 'processing' && (
                    <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-8 h-8 border-3 border-bt-green-200 border-t-bt-green-500 rounded-full animate-spin mx-auto" />
                        <p className="text-xs text-bt-gray-600 mt-2">Verwerken...</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="p-3">
                  <p className="font-medium text-bt-dark-700 text-sm truncate" title={asset.name}>
                    {asset.name}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-bt-gray-500">{asset.size}</span>
                    {getStatusBadge(asset.status)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full table-fixed">
              <thead>
                <tr className="border-b border-bt-gray-200">
                  <th className="py-3 px-4 text-left">
                    <input
                      type="checkbox"
                      checked={selectedAssets.length === filteredAssets.length && filteredAssets.length > 0}
                      onChange={selectAll}
                      className="accent-bt-green-500"
                    />
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-bt-gray-600">Naam</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-bt-gray-600">Type</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-bt-gray-600">Categorie</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-bt-gray-600">Status</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-bt-gray-600">Grootte</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-bt-gray-600">Datum</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-bt-gray-600">Acties</th>
                </tr>
              </thead>
              <tbody>
                {filteredAssets.map((asset) => (
                  <tr 
                    key={asset.id} 
                    className={`border-b border-bt-gray-100 hover:bg-bt-gray-50 ${
                      selectedAssets.includes(asset.id) ? 'bg-bt-green-50' : ''
                    }`}
                  >
                    <td className="py-3 px-4">
                      <input
                        type="checkbox"
                        checked={selectedAssets.includes(asset.id)}
                        onChange={() => toggleAssetSelection(asset.id)}
                        className="accent-bt-green-500"
                      />
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-bt-gray-100 rounded flex items-center justify-center">
                          {getTypeIcon(asset.type)}
                        </div>
                        <span className="font-medium text-bt-dark-700 text-sm">{asset.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-bt-gray-600 capitalize">{asset.type}</td>
                    <td className="py-3 px-4 text-sm text-bt-gray-600">{asset.category}</td>
                    <td className="py-3 px-4">{getStatusBadge(asset.status)}</td>
                    <td className="py-3 px-4 text-sm text-bt-gray-600">{asset.size}</td>
                    <td className="py-3 px-4 text-sm text-bt-gray-600">
                      {asset.createdAt.toLocaleDateString('nl-NL')}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <button className="p-1.5 hover:bg-bt-gray-100 rounded">
                          <Eye className="w-4 h-4 text-bt-gray-500" />
                        </button>
                        <button className="p-1.5 hover:bg-bt-gray-100 rounded">
                          <Download className="w-4 h-4 text-bt-gray-500" />
                        </button>
                        <button className="p-1.5 hover:bg-bt-gray-100 rounded">
                          <MoreVertical className="w-4 h-4 text-bt-gray-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {filteredAssets.length === 0 && (
          <div className="text-center py-16">
            <FolderDown className="w-16 h-16 text-bt-gray-300 mx-auto mb-4" />
            <p className="text-bt-gray-500 text-lg">Geen assets gevonden</p>
            <p className="text-bt-gray-400 text-sm mt-1">Pas je filters aan of maak nieuwe assets</p>
          </div>
        )}
      </div>
    </div>
  )
}
