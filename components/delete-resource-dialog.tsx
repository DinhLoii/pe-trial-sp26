'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Resource } from '@/types/resource'
import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

export function DeleteResourceDialog({ resource }: { resource: Resource }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function handleDelete() {
    setLoading(true)
    try {
      // First try deleting image from storage if applicable
      if (resource.image_url) {
        const urlObj = new URL(resource.image_url)
        const pathParts = urlObj.pathname.split('/')
        const fileName = pathParts[pathParts.length - 1]
        
        if (fileName) {
          const { error: storageError } = await supabase.storage
            .from('resource-images')
            .remove([fileName])
            
          if (storageError) {
            console.error('Error removing storage image:', storageError)
          }
        }
      }

      const { error } = await supabase
        .from('resources')
        .delete()
        .eq('id', resource.id)

      if (error) throw error
      
      router.refresh()
    } catch (error) {
      console.error('Error deleting resource:', error)
      alert("Error deleting resource. See console.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger
        render={
          <Button variant="destructive" size="sm" className="flex items-center gap-1">
            <Trash2 className="w-4 h-4" /> Delete
          </Button>
        }
      />
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            resource &quot;{resource.title}&quot; and remove the image from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} disabled={loading} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
            {loading ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
