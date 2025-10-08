'use client'

import { useEffect, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { createClient } from '@/lib/supabase'

export function ProductFilters() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [badges, setBadges] = useState<string[]>([])
  const supabase = createClient()

  useEffect(() => {
    async function fetchBadges() {
      const { data, error } = await supabase.from('products').select('badge')
      if (data) {
        const uniqueBadges = [...new Set(data.map(item => item.badge).filter(Boolean))] as string[]
        setBadges(uniqueBadges)
      }
    }
    fetchBadges()
  }, [])

  const handleFilterChange = (type: 'sort' | 'badge', value: string) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()))

    if (!value || value === 'all') {
      current.delete(type)
    } else {
      current.set(type, value)
    }

    const search = current.toString()
    const query = search ? `?${search}` : ''

    router.push(`${pathname}${query}`)
  }

  return (
    <div className="flex flex-col md:flex-row gap-4 mb-8">
      <div className="flex-1">
        <Select onValueChange={(value) => handleFilterChange('sort', value)} defaultValue={searchParams.get('sort') || ''}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Ordenar por" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="price-asc">Precio: Menor a mayor</SelectItem>
            <SelectItem value="price-desc">Precio: Mayor a menor</SelectItem>
            <SelectItem value="rating-desc">Calificación: Mejor a peor</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex-1">
        <Select onValueChange={(value) => handleFilterChange('badge', value)} defaultValue={searchParams.get('badge') || ''}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Filtrar por etiqueta" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las etiquetas</SelectItem>
            {badges.map(badge => (
              <SelectItem key={badge} value={badge}>{badge}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
