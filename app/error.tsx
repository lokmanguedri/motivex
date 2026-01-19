'use client'

import Link from 'next/link'
import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { AlertTriangle, Home, RefreshCcw } from 'lucide-react'

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        // Log the error to error reporting service
        console.error('Application error:', error)
    }, [error])

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <Card className="max-w-md w-full border-border">
                <CardContent className="pt-10 pb-10 text-center">
                    <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-destructive/10 flex items-center justify-center">
                        <AlertTriangle className="w-8 h-8 text-destructive" />
                    </div>
                    <h1 className="text-2xl font-bold text-foreground mb-2">
                        Une erreur s'est produite
                    </h1>
                    <p className="text-muted-foreground mb-8 text-sm">
                        {error.message || 'Quelque chose ne va pas. Veuillez réessayer.'}
                    </p>
                    <div className="flex flex-col gap-3">
                        <Button
                            onClick={reset}
                            className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground"
                        >
                            <RefreshCcw className="w-4 h-4 me-2" />
                            Réessayer
                        </Button>
                        <Link href="/">
                            <Button
                                variant="outline"
                                className="w-full h-11 bg-transparent border-border"
                            >
                                <Home className="w-4 h-4 me-2" />
                                Retour à l'accueil
                            </Button>
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
