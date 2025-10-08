'use client'

import { Search } from "lucide-react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { useDebounce } from '@/hooks/use-debounce'
import { Input } from "./input"

export function SearchInput() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('q') || '')
  const debouncedQuery = useDebounce(query, 300)

  useEffect(() => {
    const current = new URLSearchParams(Array.from(searchParams.entries()))

    if (!debouncedQuery) {
      current.delete('q')
    } else {
      current.set('q', debouncedQuery)
    }

    const search = current.toString()
    const newUrl = `${pathname}${search ? `?${search}` : ''}`

    // Only push if the URL has actually changed
    if (newUrl !== `${pathname}?${searchParams.toString()}`) {
        router.push(newUrl)
    }

  }, [debouncedQuery, pathname, router, searchParams])

  return (
    <div className="relative hidden md:block">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Buscar productos..."
        className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px] bg-background"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
    </div>
  )
}
