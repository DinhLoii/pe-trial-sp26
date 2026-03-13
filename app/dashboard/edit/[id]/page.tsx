import { createClient } from '@/lib/supabase/server'
import { ResourceForm } from '@/components/resource-form'
import { redirect } from 'next/navigation'
import { Resource } from '@/types/resource'

interface EditResourceProps {
  params: Promise<{
    id: string
  }>
}

export default async function EditResourcePage({ params }: EditResourceProps) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const resolvedParams = await params

  const { data, error } = await supabase
    .from('resources')
    .select('*')
    .eq('id', resolvedParams.id)
    .single()

  const resource = data as Resource | null

  if (error || !resource) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-destructive/10 text-destructive p-4 rounded-md">
          Resource not found or error loading resource.
        </div>
      </div>
    )
  }

  // Verify ownership
  if (resource.user_id !== user.id) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-destructive/10 text-destructive p-4 rounded-md">
          Unauthorized. You can only edit your own resources.
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <ResourceForm initialData={resource} userId={user.id} />
    </div>
  )
}

