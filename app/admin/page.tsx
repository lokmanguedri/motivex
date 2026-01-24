"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useLanguage } from "@/contexts/language-context"
import { useAuth } from "@/contexts/auth-context"
import type { Product } from "@/lib/types"
import { mapApiProductsToUi } from "@/lib/product-mapper"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "sonner"
import {
  Package, ShoppingCart, Plus, Pencil, Trash2, ArrowLeft, LogOut, TrendingUp, Clock,
  Search, Filter
} from "lucide-react"
import { MotivexLogo } from "@/components/motivex-logo"
import { Suspense } from "react"
import Loading from "./loading"
import { ImageUpload } from "@/components/image-upload"

interface Category {
  id: string
  slug: string
  nameFr: string
  nameAr: string
}

interface ProductFormState {
  nameFr: string
  nameAr: string
  descriptionFr: string
  descriptionAr: string
  oldPrice: string
  newPrice: string
  category: string
  brand: string
  model: string
  year: string
  fitmentYearsFrom: string
  fitmentYearsTo: string
  stock: string
  sku: string
  imageUrl: string
}

interface ProductFormProps {
  productForm: ProductFormState
  setProductForm: React.Dispatch<React.SetStateAction<ProductFormState>>
  productImages: { url: string; isMain: boolean; file?: File }[]
  setProductImages: (images: { url: string; isMain: boolean; file?: File }[]) => void
  categories: Category[]
  language: string
  t: (key: any) => string
}

// Extracted ProductFormFields component to prevent remounting on state changes
function ProductFormFields({ productForm, setProductForm, productImages, setProductImages, categories, language, t }: ProductFormProps) {
  return (
    <div className="space-y-5 max-h-[60vh] overflow-y-auto pe-2">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-sm font-medium">{t("productName")} (FR)</Label>
          <Input className="h-10 bg-card border-border" value={productForm.nameFr} onChange={e => setProductForm(p => ({ ...p, nameFr: e.target.value }))} />
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-medium">{t("productName")} (AR)</Label>
          <Input className="h-10 bg-card border-border" value={productForm.nameAr} onChange={e => setProductForm(p => ({ ...p, nameAr: e.target.value }))} dir="rtl" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-sm font-medium">{t("description")} (FR)</Label>
          <Input className="h-10 bg-card border-border" value={productForm.descriptionFr} onChange={e => setProductForm(p => ({ ...p, descriptionFr: e.target.value }))} />
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-medium">{t("description")} (AR)</Label>
          <Input className="h-10 bg-card border-border" value={productForm.descriptionAr} onChange={e => setProductForm(p => ({ ...p, descriptionAr: e.target.value }))} dir="rtl" />
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium">{language === "fr" ? "Images du produit" : "صور المنتج"}</Label>
        <ImageUpload
          value={productImages}
          onChange={setProductImages}
          onRemove={(url) => setProductImages(productImages.filter(img => img.url !== url))}
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label className="text-sm font-medium">{t("oldPrice")} (DZD)</Label>
          <Input className="h-10 bg-card border-border" type="number" value={productForm.oldPrice} onChange={e => setProductForm(p => ({ ...p, oldPrice: e.target.value }))} />
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-medium">{t("newPrice")} (DZD)</Label>
          <Input className="h-10 bg-card border-border" type="number" value={productForm.newPrice} onChange={e => setProductForm(p => ({ ...p, newPrice: e.target.value }))} />
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-medium">{t("stock")}</Label>
          <Input className="h-10 bg-card border-border" type="number" value={productForm.stock} onChange={e => setProductForm(p => ({ ...p, stock: e.target.value }))} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-sm font-medium">{t("category")}</Label>
          <Select value={productForm.category} onValueChange={(v: string) => setProductForm(p => ({ ...p, category: v }))}>
            <SelectTrigger className="h-10 bg-card border-border"><SelectValue /></SelectTrigger>
            <SelectContent>
              {categories.map(cat => (
                <SelectItem key={cat.id} value={cat.slug}>
                  {language === "fr" ? cat.nameFr : cat.nameAr}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-medium">SKU</Label>
          <Input className="h-10 bg-card border-border" value={productForm.sku} onChange={e => setProductForm(p => ({ ...p, sku: e.target.value }))} />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label className="text-sm font-medium">{language === "fr" ? "Marque" : "العلامة"}</Label>
          <Input className="h-10 bg-card border-border" value={productForm.brand} onChange={e => setProductForm(p => ({ ...p, brand: e.target.value }))} />
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-medium">{language === "fr" ? "Modèle" : "الموديل"}</Label>
          <Input className="h-10 bg-card border-border" value={productForm.model} onChange={e => setProductForm(p => ({ ...p, model: e.target.value }))} />
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-medium">{language === "fr" ? "Année (compatible)" : "السنة (متوافق)"}</Label>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Input
                className="h-10 bg-card border-border"
                placeholder={language === "fr" ? "De" : "من"}
                value={productForm.fitmentYearsFrom}
                onChange={e => setProductForm(p => ({ ...p, fitmentYearsFrom: e.target.value }))}
              />
            </div>
            <div>
              <Input
                className="h-10 bg-card border-border"
                placeholder={language === "fr" ? "À" : "إلى"}
                value={productForm.fitmentYearsTo}
                onChange={e => setProductForm(p => ({ ...p, fitmentYearsTo: e.target.value }))}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function AdminDashboard() {
  const router = useRouter()
  const { t, language } = useLanguage()
  const { user, logout } = useAuth()

  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [orders, setOrders] = useState<any[]>([])
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null)
  const [stats, setStats] = useState({
    productsCount: 0,
    ordersCount: 0,
    pendingOrders: 0,
    revenue: 0
  })
  const [isLoading, setIsLoading] = useState(true)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [isAddingProduct, setIsAddingProduct] = useState(false)

  // Filters
  const [productSearch, setProductSearch] = useState("")
  const [productCategory, setProductCategory] = useState<string>("all")

  // Multi-image state
  const [productImages, setProductImages] = useState<{ url: string; isMain: boolean; file?: File }[]>([])

  const [productForm, setProductForm] = useState({
    nameFr: "", nameAr: "", descriptionFr: "", descriptionAr: "",
    oldPrice: "", newPrice: "", category: "carrosserie",
    brand: "", model: "", year: "", fitmentYearsFrom: "", fitmentYearsTo: "",
    stock: "", sku: "",
    // imageUrl kept for compatibility but not used in UI
    imageUrl: "",
  })

  // Fetch categories and products on mount
  useEffect(() => {
    let isMounted = true

    async function fetchData() {
      try {
        // Fetch categories first
        const categoriesRes = await fetch('/api/categories')
        if (categoriesRes.ok) {
          const categoriesData = await categoriesRes.json()
          if (isMounted) {
            setCategories(categoriesData.categories)
            // Set default category if available
            if (categoriesData.categories.length > 0) {
              setProductForm(prev => ({ ...prev, category: categoriesData.categories[0].slug }))
            }
          }
        }

        // Fetch products
        const res = await fetch('/api/admin/products', { cache: 'no-store' })
        if (!res.ok) {
          if (res.status === 401 || res.status === 403) {
            router.push('/account')
            toast.error(language === 'fr' ? 'Authentification requise' : 'مطلوب المصادقة')
            return
          }
          throw new Error('Failed to fetch')
        }
        const data = await res.json()
        if (!isMounted) return

        const mapped = mapApiProductsToUi(data.products)
        setProducts(mapped)

        // Fetch orders
        const ordersRes = await fetch('/api/admin/orders', { cache: 'no-store' })
        if (ordersRes.ok) {
          const ordersData = await ordersRes.json()
          if (isMounted) {
            setOrders(ordersData.orders)
          }
        }

        // Fetch stats
        const statsRes = await fetch('/api/admin/stats', { cache: 'no-store' })
        if (statsRes.ok) {
          const statsData = await statsRes.json()
          if (isMounted) {
            setStats(statsData)
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error)
        if (isMounted) {
          toast.error(language === 'fr' ? 'Erreur de chargement' : 'خطأ في التحميل')
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    fetchData()
    return () => { isMounted = false }
  }, [router, language])

  // Check admin access
  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md w-full mx-4 text-center border-border">
          <CardContent className="py-10">
            <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
              <Package className="w-7 h-7 text-primary" />
            </div>
            <h2 className="text-lg font-semibold text-foreground mb-2">
              {language === "fr" ? "Accès restreint" : "وصول مقيد"}
            </h2>
            <p className="text-muted-foreground mb-6">{t("loginRequired")}</p>
            <Link href="/account">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                {t("login")}
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (isLoading) {
    return <Loading />
  }

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  const resetProductForm = () => {
    setProductForm({
      nameFr: "", nameAr: "", descriptionFr: "", descriptionAr: "",
      oldPrice: "", newPrice: "", category: categories[0]?.slug || "carrosserie",
      brand: "", model: "", year: "", fitmentYearsFrom: "", fitmentYearsTo: "",
      stock: "", sku: "",
      imageUrl: "",
    })
    setProductImages([])
  }

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product)
    setProductForm({
      nameFr: product.nameFr, nameAr: product.nameAr,
      descriptionFr: product.descriptionFr, descriptionAr: product.descriptionAr,
      oldPrice: String(product.oldPrice || ""), newPrice: String(product.newPrice),
      category: product.category, brand: product.brand, model: product.model,
      year: product.year, fitmentYearsFrom: product.fitmentYearsFrom || "", fitmentYearsTo: product.fitmentYearsTo || "",
      stock: String(product.stock), sku: product.sku,
      imageUrl: product.image || "",
    })

    // Convert string array to ImageUpload format
    // If product.images comes as string[] (from Product interface), map it
    // If product comes from API with full object, it might function differently, 
    // but the mapper maps it to string[].
    const images = product.images.length > 0
      ? product.images.map((url, i) => ({ url, isMain: url === product.image }))
      : product.image
        ? [{ url: product.image, isMain: true }]
        : []

    setProductImages(images)
  }

  const handleSaveProduct = async () => {
    try {
      const categoryObj = categories.find(c => c.slug === productForm.category)
      if (!categoryObj) {
        toast.error(language === 'fr' ? 'Catégorie introuvable' : 'الفئة غير موجودة')
        return
      }

      // 1. Upload any new files first
      let finalImages = [...productImages]

      // Filter images that have a file object (new uploads)
      const filesToUpload = finalImages.filter(img => img.file)

      if (filesToUpload.length > 0) {
        toast.loading(language === 'fr' ? 'Téléchargement des images...' : 'جاري تحميل الصور...')

        for (const img of filesToUpload) {
          try {
            const formData = new FormData()
            formData.append('file', img.file!)

            const uploadRes = await fetch('/api/upload', {
              method: 'POST',
              body: formData
            })

            if (!uploadRes.ok) {
              const error = await uploadRes.json()
              throw new Error(error.error || 'Upload failed')
            }

            const data = await uploadRes.json()

            // Update the image URL in our list
            finalImages = finalImages.map(existing =>
              existing.url === img.url ? { ...existing, url: data.url, file: undefined } : existing
            )
          } catch (err: any) {
            console.error("Upload failed for file", img.file?.name, err)
            toast.dismiss()
            toast.error(language === 'fr'
              ? `Erreur de téléchargement: ${err.message}`
              : `خطأ في التحميل: ${err.message}`
            )
            return // Stop saving if upload fails
          }
        }
        toast.dismiss()
      }

      const payload = {
        sku: productForm.sku,
        nameFr: productForm.nameFr,
        nameAr: productForm.nameAr,
        descFr: productForm.descriptionFr || null,
        descAr: productForm.descriptionAr || null,
        price: Number(productForm.newPrice),
        oldPrice: productForm.oldPrice ? Number(productForm.oldPrice) : null,
        stock: Number(productForm.stock),
        brand: productForm.brand || null,
        model: productForm.model || null,
        year: productForm.year ? parseInt(productForm.year) : null,
        fitmentYearsFrom: productForm.fitmentYearsFrom ? parseInt(productForm.fitmentYearsFrom) : null,
        fitmentYearsTo: productForm.fitmentYearsTo ? parseInt(productForm.fitmentYearsTo) : null,
        categoryId: categoryObj.id,
        images: finalImages.map((img, index) => ({
          url: img.url,
          isMain: img.isMain,
          sortOrder: index
        }))
      }

      const url = editingProduct
        ? `/api/admin/products/${editingProduct.id}`
        : `/api/admin/products`
      const method = editingProduct ? 'PATCH' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          router.push('/account')
          toast.error(language === 'fr' ? 'Authentification requise' : 'مطلوب المصادقة')
          return
        }
        const error = await res.json()
        throw new Error(error.error || 'Failed to save')
      }

      toast.success(language === 'fr'
        ? (editingProduct ? 'Produit mis à jour' : 'Produit ajouté')
        : (editingProduct ? 'تم تحديث المنتج' : 'تمت إضافة المنتج')
      )

      // Refresh products
      const refreshRes = await fetch('/api/admin/products', { cache: 'no-store' })
      if (refreshRes.ok) {
        const data = await refreshRes.json()
        setProducts(mapApiProductsToUi(data.products))
      }

      setEditingProduct(null)
      setIsAddingProduct(false)
      resetProductForm()
    } catch (error: any) {
      console.error('Error saving product:', error)
      toast.error(error.message || (language === 'fr' ? 'Erreur lors de la sauvegarde' : 'خطأ في الحفظ'))
    }
  }

  const handleDeleteProduct = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: 'DELETE'
      })

      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          router.push('/account')
          toast.error(language === 'fr' ? 'Authentification requise' : 'مطلوب المصادقة')
          return
        }
        throw new Error('Failed to delete')
      }

      toast.success(language === 'fr' ? 'Produit supprimé' : 'تم حذف المنتج')

      // Refresh products
      const refreshRes = await fetch('/api/admin/products', { cache: 'no-store' })
      if (refreshRes.ok) {
        const data = await refreshRes.json()
        setProducts(mapApiProductsToUi(data.products))
      }
    } catch (error) {
      console.error('Error deleting product:', error)
      toast.error(language === 'fr' ? 'Erreur lors de la suppression' : 'خطأ في الحذف')
    }
  }

  const handleUpdateOrder = async (orderId: string, updates: { status?: string; paymentStatus?: string }) => {
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      })

      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          router.push('/account')
          toast.error(language === 'fr' ? 'Authentification requise' : 'مطلوب المصادقة')
          return
        }
        throw new Error('Failed to update order')
      }

      toast.success(language === 'fr' ? 'Commande mise à jour' : 'تم تحديث الطلب')

      // Refresh orders
      const refreshRes = await fetch('/api/admin/orders', { cache: 'no-store' })
      if (refreshRes.ok) {
        const data = await refreshRes.json()
        setOrders(data.orders)
      }

      // Close dialog if open
      setSelectedOrder(null)
    } catch (error) {
      console.error('Error updating order:', error)
      toast.error(language === 'fr' ? 'Erreur lors de la mise à jour' : 'خطأ في التحديث')
    }
  }

  // Filtered products
  const filteredProducts = products.filter(product => {
    const matchesSearch = productSearch === "" ||
      product.nameFr.toLowerCase().includes(productSearch.toLowerCase()) ||
      product.nameAr.includes(productSearch) ||
      product.sku.toLowerCase().includes(productSearch.toLowerCase()) ||
      (product.brand || "").toLowerCase().includes(productSearch.toLowerCase())
    const matchesCategory = productCategory === "all" || product.category === productCategory
    return matchesSearch && matchesCategory
  })

  // Stats
  const totalProducts = products.length
  const totalRevenue = 0 // Orders not wired yet

  return (
    <Suspense fallback={<Loading />}>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="bg-card border-b border-border sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
              <MotivexLogo size="sm" />
              <div className="border-s border-border ps-4 hidden sm:block">
                <h1 className="font-bold text-lg text-foreground">{t("adminDashboard")}</h1>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </div>
            </div>
            <Button variant="outline" className="bg-transparent border-border text-muted-foreground hover:text-foreground" onClick={handleLogout}>
              <LogOut className="w-4 h-4 me-2" />
              <span className="hidden sm:inline">{t("logout")}</span>
            </Button>
          </div>
        </header>

        <main className="container mx-auto px-4 py-6 lg:py-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mb-6 lg:mb-8">
            <Card className="border-border">
              <CardContent className="p-4 lg:p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 lg:w-10 lg:h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Package className="w-4 h-4 lg:w-5 lg:h-5 text-primary" />
                  </div>
                  <span className="text-[10px] lg:text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    {t("products")}
                  </span>
                </div>
                <p className="text-xl lg:text-2xl font-bold text-foreground">{stats.productsCount}</p>
                <p className="text-[10px] lg:text-xs text-muted-foreground mt-1">
                  {language === "fr" ? "Total en stock" : "إجمالي المخزون"}
                </p>
              </CardContent>
            </Card>
            <Card className="border-border">
              <CardContent className="p-4 lg:p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 lg:w-10 lg:h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                    <ShoppingCart className="w-4 h-4 lg:w-5 lg:h-5 text-blue-600" />
                  </div>
                  <span className="text-[10px] lg:text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    {language === "fr" ? "Commandes" : "الطلبات"}
                  </span>
                </div>
                <p className="text-xl lg:text-2xl font-bold text-foreground">{stats.ordersCount}</p>
                <p className="text-[10px] lg:text-xs text-muted-foreground mt-1">
                  {language === "fr" ? "Total commandes" : "إجمالي الطلبات"}
                </p>
              </CardContent>
            </Card>
            <Card className="border-border">
              <CardContent className="p-4 lg:p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 lg:w-10 lg:h-10 rounded-xl bg-amber-50 flex items-center justify-center">
                    <Clock className="w-4 h-4 lg:w-5 lg:h-5 text-amber-600" />
                  </div>
                  <span className="text-[10px] lg:text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    {t("pending")}
                  </span>
                </div>
                <p className="text-xl lg:text-2xl font-bold text-foreground">{stats.pendingOrders}</p>
                <p className="text-[10px] lg:text-xs text-muted-foreground mt-1">
                  {language === "fr" ? "En attente" : "قيد الانتظار"}
                </p>
              </CardContent>
            </Card>
            <Card className="border-border">
              <CardContent className="p-4 lg:p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 lg:w-10 lg:h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 lg:w-5 lg:h-5 text-emerald-600" />
                  </div>
                  <span className="text-[10px] lg:text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    {language === "fr" ? "Revenus" : "الإيرادات"}
                  </span>
                </div>
                <p className="text-xl lg:text-2xl font-bold text-foreground">{stats.revenue.toLocaleString()}</p>
                <p className="text-[10px] lg:text-xs text-muted-foreground mt-1">DZD</p>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="products">
            <TabsList className="h-11 mb-6 bg-secondary/50 p-1 w-full sm:w-auto">
              <TabsTrigger value="products" className="h-9 gap-2 data-[state=active]:bg-card flex-1 sm:flex-none">
                <Package className="w-4 h-4" />
                <span className="hidden sm:inline">{t("manageProducts")}</span>
                <span className="sm:hidden">{t("products")}</span>
              </TabsTrigger>
              <TabsTrigger value="orders" className="h-9 gap-2 data-[state=active]:bg-card flex-1 sm:flex-none">
                <ShoppingCart className="w-4 h-4" />
                <span className="hidden sm:inline">{t("manageOrders")}</span>
                <span className="sm:hidden">{language === "fr" ? "Commandes" : "الطلبات"}</span>
              </TabsTrigger>
            </TabsList>

            {/* Products Tab */}
            <TabsContent value="products">
              <Card className="border-border">
                <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4">
                  <div>
                    <CardTitle className="text-lg">{t("manageProducts")}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {language === "fr" ? "Gérez votre catalogue produits" : "إدارة كتالوج المنتجات"}
                    </p>
                  </div>
                  <Dialog open={isAddingProduct} onOpenChange={setIsAddingProduct}>
                    <DialogTrigger asChild>
                      <Button className="bg-primary hover:bg-primary/90 text-primary-foreground h-10 w-full sm:w-auto" onClick={() => { resetProductForm(); setEditingProduct(null); setProductImages([]); }}>
                        <Plus className="w-4 h-4 me-2" />
                        {t("addProduct")}
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden">
                      <DialogHeader>
                        <DialogTitle>{t("addProduct")}</DialogTitle>
                      </DialogHeader>
                      <ProductFormFields
                        productForm={productForm}
                        setProductForm={setProductForm}
                        productImages={productImages}
                        setProductImages={setProductImages}
                        categories={categories}
                        language={language}
                        t={t}
                      />
                      <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-border">
                        <Button variant="outline" className="bg-transparent h-10" onClick={() => setIsAddingProduct(false)}>{t("cancel")}</Button>
                        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground h-10" onClick={handleSaveProduct}>{t("save")}</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardHeader>
                <CardContent>
                  {/* Search & Filter */}
                  <div className="flex flex-col sm:flex-row gap-3 mb-4">
                    <div className="relative flex-1">
                      <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        className="ps-9 h-10 bg-card border-border"
                        placeholder={language === "fr" ? "Rechercher produit, SKU, marque..." : "بحث عن منتج، SKU، علامة..."}
                        value={productSearch}
                        onChange={e => setProductSearch(e.target.value)}
                      />
                    </div>
                    <Select value={productCategory} onValueChange={setProductCategory}>
                      <SelectTrigger className="w-full sm:w-40 h-10 bg-card border-border">
                        <Filter className="w-4 h-4 me-2 text-muted-foreground" />
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">{language === "fr" ? "Toutes catégories" : "جميع الفئات"}</SelectItem>
                        {categories.map(cat => (
                          <SelectItem key={cat.id} value={cat.slug}>
                            {language === "fr" ? cat.nameFr : cat.nameAr}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Products Table */}
                  <div className="overflow-x-auto rounded-lg border border-border">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-secondary/50 hover:bg-secondary/50">
                          <TableHead className="font-medium">{language === "fr" ? "Produit" : "المنتج"}</TableHead>
                          <TableHead className="font-medium hidden md:table-cell">{t("category")}</TableHead>
                          <TableHead className="font-medium">{t("price")}</TableHead>
                          <TableHead className="font-medium hidden sm:table-cell">{t("stock")}</TableHead>
                          <TableHead className="font-medium text-end">{t("actions")}</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredProducts.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                              {language === "fr" ? "Aucun produit trouvé" : "لم يتم العثور على منتجات"}
                            </TableCell>
                          </TableRow>
                        ) : (
                          filteredProducts.map(product => (
                            <TableRow key={product.id} className="hover:bg-secondary/30">
                              <TableCell>
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-lg overflow-hidden bg-secondary shrink-0">
                                    <Image src={product.image || "/placeholder.svg"} alt="" width={48} height={48} className="w-full h-full object-cover" />
                                  </div>
                                  <div className="min-w-0">
                                    <p className="font-medium text-foreground truncate text-sm">{language === "fr" ? product.nameFr : product.nameAr}</p>
                                    <p className="text-[10px] lg:text-xs text-muted-foreground font-mono">{product.sku}</p>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell className="hidden md:table-cell">
                                <span className="px-2 py-1 rounded-md text-xs font-medium bg-secondary text-foreground">
                                  {categories.find(c => c.slug === product.category)?.[language === "fr" ? "nameFr" : "nameAr"] || product.category}
                                </span>
                              </TableCell>
                              <TableCell>
                                <p className="font-semibold text-foreground text-sm">{product.newPrice.toLocaleString()}</p>
                                {product.oldPrice > 0 && (
                                  <p className="text-[10px] lg:text-xs text-muted-foreground line-through">{product.oldPrice.toLocaleString()}</p>
                                )}
                              </TableCell>
                              <TableCell className="hidden sm:table-cell">
                                <span className={`px-2 py-1 rounded-md text-xs font-medium ${product.stock > 10
                                  ? "bg-emerald-50 text-emerald-700"
                                  : product.stock > 0
                                    ? "bg-amber-50 text-amber-700"
                                    : "bg-rose-50 text-rose-700"
                                  }`}>
                                  {product.stock}
                                </span>
                              </TableCell>
                              <TableCell>
                                <div className="flex gap-1 justify-end">
                                  <Dialog open={editingProduct?.id === product.id} onOpenChange={(open) => { if (!open) setEditingProduct(null) }}>
                                    <DialogTrigger asChild>
                                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" onClick={() => handleEditProduct(product)}>
                                        <Pencil className="w-4 h-4" />
                                      </Button>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden">
                                      <DialogHeader>
                                        <DialogTitle>{t("editProduct")}</DialogTitle>
                                      </DialogHeader>
                                      <ProductFormFields
                                        productForm={productForm}
                                        setProductForm={setProductForm}
                                        productImages={productImages}
                                        setProductImages={setProductImages}
                                        categories={categories}
                                        language={language}
                                        t={t}
                                      />
                                      <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-border">
                                        <Button variant="outline" className="bg-transparent h-10" onClick={() => setEditingProduct(null)}>{t("cancel")}</Button>
                                        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground h-10" onClick={handleSaveProduct}>{t("save")}</Button>
                                      </div>
                                    </DialogContent>
                                  </Dialog>
                                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10" onClick={() => handleDeleteProduct(product.id)}>
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                  <p className="text-xs text-muted-foreground mt-3">
                    {language === "fr"
                      ? `${filteredProducts.length} produit(s) sur ${products.length}`
                      : `${filteredProducts.length} منتج من ${products.length}`}
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Orders Tab */}
            <TabsContent value="orders">
              <Card className="border-border">
                <CardHeader className="pb-4">
                  <div>
                    <CardTitle className="text-lg">{t("manageOrders")}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {language === "fr" ? "Suivez et gérez les commandes  clients" : "تتبع وإدارة طلبات العملاء"}
                    </p>
                  </div>
                </CardHeader>
                <CardContent>
                  {orders.length === 0 ? (
                    <div className="text-center py-16 px-4">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-secondary flex items-center justify-center">
                        <ShoppingCart className="w-8 h-8 text-muted-foreground" />
                      </div>
                      <h3 className="text-lg font-medium text-foreground mb-2">
                        {language === "fr" ? "Aucune commande" : "لا توجد طلبات"}
                      </h3>
                      <p className="text-muted-foreground">
                        {language === "fr"
                          ? "Les nouvelles commandes apparaîtront ici"
                          : "ستظهر الطلبات الجديدة هنا"
                        }
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="overflow-x-auto rounded-lg border border-border">
                        <Table>
                          <TableHeader>
                            <TableRow className="bg-secondary/50 hover:bg-secondary/50">
                              <TableHead className="font-medium">{language === "fr" ? "ID" : "المعرف"}</TableHead>
                              <TableHead className="font-medium hidden md:table-cell">{language === "fr" ? "Date" : "التاريخ"}</TableHead>
                              <TableHead className="font-medium">{language === "fr" ? "Client" : "العميل"}</TableHead>
                              <TableHead className="font-medium">{language === "fr" ? "Total" : "المجموع"}</TableHead>
                              <TableHead className="font-medium hidden lg:table-cell">{language === "fr" ? "Paiement" : "الدفع"}</TableHead>
                              <TableHead className="font-medium hidden xl:table-cell">{language === "fr" ? "Code" : "الكود"}</TableHead>
                              <TableHead className="font-medium">{language === "fr" ? "Statut" : "الحالة"}</TableHead>
                              <TableHead className="font-medium text-end">{t("actions")}</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {orders.map((order: any) => (
                              <TableRow key={order.id} className="hover:bg-secondary/30">
                                <TableCell className="font-mono text-xs">
                                  {order.paymentCode?.split('-').slice(-1)[0] || order.id.slice(-6)}
                                </TableCell>
                                <TableCell className="hidden md:table-cell text-sm">
                                  {new Date(order.createdAt).toLocaleDateString(language === 'fr' ? 'fr-DZ' : 'ar-DZ')}
                                </TableCell>
                                <TableCell>
                                  <p className="text-sm font-medium text-foreground truncate max-w-[150px]">
                                    {order.shippingFullName}
                                  </p>
                                  <p className="text-xs text-muted-foreground">{order.shippingPhone}</p>
                                </TableCell>
                                <TableCell className="font-semibold text-foreground text-sm">
                                  {Number(order.total).toLocaleString()} DZD
                                </TableCell>
                                <TableCell className="hidden lg:table-cell">
                                  <div className="space-y-1">
                                    <span className="px-2 py-1 rounded-md text-xs font-medium bg-secondary text-foreground">
                                      {order.payment?.method}
                                    </span>
                                    <p className={`text-xs font-medium ${order.payment?.status === 'PAID' ? 'text-emerald-600' : 'text-amber-600'
                                      }`}>
                                      {order.payment?.status}
                                    </p>
                                    {order.payment?.reference && (
                                      <p className="text-xs text-muted-foreground font-mono truncate max-w-[100px]">
                                        {order.payment.reference}
                                      </p>
                                    )}
                                  </div>
                                </TableCell>
                                <TableCell className="hidden xl:table-cell font-mono text-xs text-muted-foreground">
                                  {order.paymentCode}
                                </TableCell>
                                <TableCell>
                                  <span className={`px-2 py-1 rounded-md text-xs font-medium ${order.status === 'DELIVERED' ? 'bg-emerald-50 text-emerald-700' :
                                    order.status === 'SHIPPED' ? 'bg-blue-50 text-blue-700' :
                                      order.status === 'CONFIRMED' ? 'bg-cyan-50 text-cyan-700' :
                                        order.status === 'RETURNED' ? 'bg-rose-50 text-rose-700' :
                                          'bg-amber-50 text-amber-700'
                                    }`}>
                                    {order.status}
                                  </span>
                                </TableCell>
                                <TableCell className="text-end">
                                  <Dialog>
                                    <DialogTrigger asChild>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-8 text-xs"
                                        onClick={() => setSelectedOrder(order)}
                                      >
                                        {language === "fr" ? "Détails" : "التفاصيل"}
                                      </Button>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                                      <DialogHeader>
                                        <DialogTitle>{language === "fr" ? "Détails de la commande" : "تفاصيل الطلب"}</DialogTitle>
                                      </DialogHeader>
                                      {order && (
                                        <div className="space-y-4">
                                          {/* Payment Code */}
                                          <div className="bg-primary/10 rounded-lg p-4">
                                            <p className="text-sm font-medium text-foreground mb-1">
                                              {language === "fr" ? "Code Paiement" : "كود الدفع"}
                                            </p>
                                            <p className="font-mono font-bold text-lg text-foreground">
                                              {order.paymentCode}
                                            </p>
                                          </div>

                                          {/* Customer Info */}
                                          <div className="grid grid-cols-2 gap-4">
                                            <div>
                                              <Label className="text-xs text-muted-foreground">{t("fullName")}</Label>
                                              <p className="text-sm font-medium">{order.shippingFullName}</p>
                                            </div>
                                            <div>
                                              <Label className="text-xs text-muted-foreground">{t("phone")}</Label>
                                              <p className="text-sm font-medium" dir="ltr">{order.shippingPhone}</p>
                                            </div>
                                            <div className="col-span-2">
                                              <Label className="text-xs text-muted-foreground">{t("address")}</Label>
                                              <p className="text-sm">{order.shippingAddress1}</p>
                                              <p className="text-sm text-muted-foreground">
                                                {order.shippingCommune}, {order.shippingWilaya}
                                              </p>
                                            </div>
                                          </div>

                                          {/* Payment Info */}
                                          <div className="border-t border-border pt-4">
                                            <h4 className="font-medium mb-2">{language === "fr" ? "Paiement" : "الدفع"}</h4>
                                            <div className="grid grid-cols-2 gap-4">
                                              <div>
                                                <Label className="text-xs text-muted-foreground">
                                                  {t("paymentMethod")}
                                                </Label>
                                                <p className="text-sm font-medium">{order.payment?.method}</p>
                                              </div>
                                              <div>
                                                <Label className="text-xs text-muted-foreground">
                                                  {language === "fr" ? "Statut Paiement" : "حالة الدفع"}
                                                </Label>
                                                <p className={`text-sm font-medium ${order.payment?.status === 'PAID' ? 'text-emerald-600' : 'text-amber-600'
                                                  }`}>
                                                  {order.payment?.status}
                                                </p>
                                              </div>
                                              {order.payment?.reference && (
                                                <div className="col-span-2">
                                                  <Label className="text-xs text-muted-foreground">
                                                    {language === "fr" ? "Référence BaridiMob" : "مرجع BaridiMob"}
                                                  </Label>
                                                  <p className="text-sm font-mono">{order.payment.reference}</p>
                                                </div>
                                              )}
                                            </div>

                                            {/* Payment Verification for BARIDIMOB */}
                                            {order.payment?.method === 'BARIDIMOB' && order.payment?.status === 'PENDING' && (
                                              <Button
                                                className="mt-3 w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                                                onClick={() => handleUpdateOrder(order.id, { paymentStatus: 'PAID' })}
                                              >
                                                {language === "fr" ? "Marquer comme PAYÉ" : "تعيين كمدفوع"}
                                              </Button>
                                            )}
                                          </div>

                                          {/* Items */}
                                          <div className="border-t border-border pt-4">
                                            <h4 className="font-medium mb-2">{language === "fr" ? "Articles" : "المواد"}</h4>
                                            <div className="space-y-2">
                                              {order.items?.map((item: any) => (
                                                <div key={item.id} className="flex justify-between text-sm">
                                                  <span>
                                                    {language === "fr" ? item.snapshotNameFr : item.snapshotNameAr} x{item.quantity}
                                                  </span>
                                                  <span className="font-medium">
                                                    {Number(item.subtotal).toLocaleString()} DZD
                                                  </span>
                                                </div>
                                              ))}
                                            </div>
                                          </div>

                                          {/* Totals */}
                                          <div className="border-t border-border pt-4 space-y-1 text-sm">
                                            <div className="flex justify-between">
                                              <span className="text-muted-foreground">{t("subtotal")}</span>
                                              <span className="font-medium">{Number(order.subtotal).toLocaleString()} DZD</span>
                                            </div>
                                            <div className="flex justify-between">
                                              <span className="text-muted-foreground">{t("shipping")}</span>
                                              <span className="font-medium">{Number(order.shippingPrice).toLocaleString()} DZD</span>
                                            </div>
                                            <div className="flex justify-between font-bold text-base pt-2 border-t">
                                              <span>{t("total")}</span>
                                              <span>{Number(order.total).toLocaleString()} DZD</span>
                                            </div>
                                          </div>

                                          {/* Order Status Update */}
                                          <div className="border-t border-border pt-4">
                                            <Label className="text-sm font-medium mb-2 block">
                                              {language === "fr" ? "Changer le statut" : "تغيير الحالة"}
                                            </Label>
                                            <Select
                                              value={order.status}
                                              onValueChange={(value) => handleUpdateOrder(order.id, { status: value })}
                                            >
                                              <SelectTrigger className="h-10 bg-card border-border">
                                                <SelectValue />
                                              </SelectTrigger>
                                              <SelectContent>
                                                <SelectItem value="PENDING">PENDING</SelectItem>
                                                <SelectItem value="CONFIRMED">CONFIRMED</SelectItem>
                                                <SelectItem value="SHIPPED">SHIPPED</SelectItem>
                                                <SelectItem value="DELIVERED">DELIVERED</SelectItem>
                                                <SelectItem value="RETURNED">RETURNED</SelectItem>
                                              </SelectContent>
                                            </Select>
                                          </div>
                                        </div>
                                      )}
                                    </DialogContent>
                                  </Dialog>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                      <p className="text-xs text-muted-foreground mt-3">
                        {language === "fr"
                          ? `${orders.length} commande(s) au total`
                          : `${orders.length} طلب إجمالاً`}
                      </p>
                    </>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </Suspense>
  )
}
