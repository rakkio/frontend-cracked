'use client'

import { useState, useEffect } from 'react'
import { api } from '@/lib/api'

export const useAppData = (slug) => {
    const [app, setApp] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [relatedApps, setRelatedApps] = useState([])

    useEffect(() => {
        if (slug) {
            fetchApp(slug)
        }
    }, [slug])

    const fetchApp = async (slug) => {
        try {
            setLoading(true)
            const response = await api.getAppBySlug(slug)
            setApp(response.app)
            
            if (response.app.category?._id) {
                try {
                    const relatedResponse = await api.getApps({
                        category: response.app.category._id,
                        limit: 4
                    })
                    const related = relatedResponse.data.apps.filter(relatedApp => 
                        relatedApp._id !== response.app._id
                    )
                    setRelatedApps(related.slice(0, 3))
                } catch (relatedError) {
                    console.warn('Could not fetch related apps:', relatedError)
                }
            }
        } catch (error) {
            console.error('Error fetching app:', error)
            setError(error.message)
        } finally {
            setLoading(false)
        }
    }

    return { app, loading, error, relatedApps }
}