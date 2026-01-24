"use client"

import { useState, useRef, ChangeEvent, DragEvent } from "react"
import { Button } from "@/components/ui/button"
import { X, Upload, Image as ImageIcon, Star } from "lucide-react"
import { toast } from "sonner"
import { useLanguage } from "@/contexts/language-context"

interface ImageUploadProps {
    value: { url: string; isMain: boolean; file?: File }[]
    onChange: (value: { url: string; isMain: boolean; file?: File }[]) => void
    onRemove: (url: string) => void
}

export function ImageUpload({ value, onChange, onRemove }: ImageUploadProps) {
    const { t, language } = useLanguage()
    const [isDragging, setIsDragging] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const onDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        setIsDragging(true)
    }

    const onDragLeave = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        setIsDragging(false)
    }

    const onDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        setIsDragging(false)

        const files = Array.from(e.dataTransfer.files)
        handleFiles(files)
    }

    const onFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const files = Array.from(e.target.files)
            handleFiles(files)
        }
    }

    const handleFiles = (files: File[]) => {
        // Filter images only
        const imageFiles = files.filter(file => file.type.startsWith('image/'))

        if (imageFiles.length === 0) {
            toast.error(language === "fr" ? "Veuillez sélectionner des images" : "يرجى اختيار صور")
            return
        }

        const newImages = imageFiles.map(file => ({
            url: URL.createObjectURL(file), // Preview URL
            isMain: false,
            file: file
        }))

        // Verify if we should set the first one as main (if no images exist yet)
        if (value.length === 0 && newImages.length > 0) {
            newImages[0].isMain = true
        }

        onChange([...value, ...newImages])
    }

    const handleSetMain = (index: number) => {
        const updated = value.map((img, i) => ({
            ...img,
            isMain: i === index
        }))
        onChange(updated)
    }

    return (
        <div className="space-y-4">
            <div
                className={`
                    border-2 border-dashed rounded-xl p-8 transition-colors text-center cursor-pointer
                    ${isDragging ? "border-primary bg-primary/5" : "border-border hover:bg-secondary/50"}
                `}
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
                onClick={() => fileInputRef.current?.click()}
            >
                <input
                    type="file"
                    multiple
                    className="hidden"
                    ref={fileInputRef}
                    onChange={onFileInputChange}
                    accept="image/*"
                />
                <div className="flex flex-col items-center gap-2">
                    <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center mb-2">
                        <Upload className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <p className="text-sm font-medium text-foreground">
                        {language === "fr"
                            ? "Cliquez ou glissez des images ici"
                            : "انقر أو اسحب الصور هنا"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                        {language === "fr"
                            ? "JPG, PNG jusqu'à 5MB"
                            : "JPG, PNG حتى 5 ميجابايت"}
                    </p>
                </div>
            </div>

            {/* Preview Grid */}
            {value.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {value.map((image, index) => (
                        <div key={index} className="relative aspect-square group rounded-lg overflow-hidden border border-border bg-card">
                            <img
                                src={image.url}
                                alt="Preview"
                                className="w-full h-full object-cover"
                            />

                            {/* Actions Overlay */}
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-end p-2 gap-2">
                                <Button
                                    variant="destructive"
                                    size="icon"
                                    className="h-6 w-6 rounded-full"
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        onRemove(image.url)
                                    }}
                                >
                                    <X className="w-3 h-3" />
                                </Button>

                                <Button
                                    variant={image.isMain ? "default" : "secondary"}
                                    size="sm"
                                    className={`mt-auto w-full text-[10px] h-7 gap-1 ${image.isMain ? "bg-primary text-primary-foreground" : "bg-white/90 text-black hover:bg-white"}`}
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        handleSetMain(index)
                                    }}
                                >
                                    <Star className={`w-3 h-3 ${image.isMain ? "fill-current" : ""}`} />
                                    {image.isMain
                                        ? (language === "fr" ? "Principale" : "الرئيسية")
                                        : (language === "fr" ? "Définir Principale" : "تعيين كرئيسية")
                                    }
                                </Button>
                            </div>

                            {/* Main Badge for non-hover state */}
                            {image.isMain && (
                                <div className="absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-bold bg-primary text-primary-foreground">
                                    {language === "fr" ? "Principale" : "الرئيسية"}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
