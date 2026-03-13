'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import { Resource } from '@/types/resource'
import { Database } from '@/types/supabase'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'

interface ResourceFormProps {
  initialData?: Resource
  userId: string
}

export function ResourceForm({ initialData, userId }: ResourceFormProps) {
  const router = useRouter()
  const supabase = createClient()
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [title, setTitle] = useState(initialData?.title || '')
  const [link, setLink] = useState(initialData?.link || '')
  const [category, setCategory] = useState(initialData?.category || '')
  const [imageFile, setImageFile] = useState<File | null>(null)
  
  // To handle image preview
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialData?.image_url || null)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      setImageFile(file)
      setPreviewUrl(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      let imageUrl = initialData?.image_url || ''

      // If there's a new file, upload to Supabase Storage
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop()
        const fileName = `${userId}-${Date.now()}.${fileExt}`
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('resource-images')
          .upload(fileName, imageFile)
          
        if (uploadError) throw uploadError

        const { data: publicUrlData } = supabase.storage
          .from('resource-images')
          .getPublicUrl(fileName)
          
        imageUrl = publicUrlData.publicUrl
      } else if (!imageUrl) {
        throw new Error('An image is required.')
      }

      const resourceData = {
        user_id: userId,
        title,
        link,
        category: category || null,
        image_url: imageUrl,
      }

      if (initialData) {
        // Update
        const { error: updateError } = await (supabase
          .from('resources') as any)
          .update(resourceData)
          .eq('id', initialData.id)
          
        if (updateError) throw updateError
      } else {
        // Insert
        const { error: insertError } = await (supabase
          .from('resources') as any)
          .insert([resourceData])
          
        if (insertError) throw insertError
      }

      router.push('/dashboard')
      router.refresh()
    } catch (err: any) {
      setError(err.message || 'An error occurred during save.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle>{initialData ? 'Edit Resource' : 'Create New Resource'}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title <span className="text-red-500">*</span></Label>
            <Input 
              id="title" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              placeholder="e.g. Next.js Documentation"
              required 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="link">Link/URL <span className="text-red-500">*</span></Label>
            <Input 
              id="link" 
              type="url"
              value={link} 
              onChange={(e) => setLink(e.target.value)} 
              placeholder="https://nextjs.org/docs"
              required 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Input 
              id="category" 
              value={category} 
              onChange={(e) => setCategory(e.target.value)} 
              placeholder="e.g. Web Development"
            />
          </div>
          <div className="space-y-2 flex flex-col">
            <Label htmlFor="image">Image Thumbnail <span className="text-red-500">*</span></Label>
            <Input 
              id="image" 
              type="file" 
              accept="image/*"
              onChange={handleImageChange}
              required={!initialData?.image_url}
              className="cursor-pointer"
            />
            {previewUrl && (
              <div className="mt-2 relative w-40 h-40 bg-muted rounded-md overflow-hidden border">
                <Image src={previewUrl} alt="Preview" fill className="object-cover" />
              </div>
            )}
          </div>
          {error && <div className="text-sm font-medium text-red-500">{error}</div>}
        </CardContent>
        <CardFooter className="flex justify-between border-t p-4">
          <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Saving...' : 'Save Resource'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
