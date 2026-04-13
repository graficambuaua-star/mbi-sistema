'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AutoRefresh() {
  const router = useRouter()

  useEffect(() => {
    // Atualiza os dados a cada 20 segundos em segundo plano
    const interval = setInterval(() => {
      router.refresh()
    }, 20000)

    return () => clearInterval(interval)
  }, [router])

  return null
}
