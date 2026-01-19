import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Search, Home } from 'lucide-react'
import { MotivexLogo } from '@/components/motivex-logo'

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <Card className="max-w-md w-full border-border">
                <CardContent className="pt-10 pb-10 text-center">
                    <div className="mb-4">
                        <MotivexLogo size="md" />
                    </div>
                    <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-secondary flex items-center justify-center">
                        <Search className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h1 className="text-6xl font-bold text-foreground mb-2">404</h1>
                    <h2 className="text-xl font-semibold text-foreground mb-2">
                        Page non trouvée
                    </h2>
                    <p className="text-muted-foreground mb-2">
                        الصفحة غير موجودة
                    </p>
                    <p className="text-sm text-muted-foreground mb-8">
                        La page que vous cherchez n'existe pas ou a été déplacée.
                    </p>
                    <Link href="/">
                        <Button className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground">
                            <Home className="w-4 h-4 me-2" />
                            Retour à l'accueil
                        </Button>
                    </Link>
                </CardContent>
            </Card>
        </div>
    )
}
