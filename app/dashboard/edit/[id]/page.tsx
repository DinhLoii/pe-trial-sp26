import { createClient } from '@/lib/supabase/server'
import { ResourceForm } from '@/components/resource-form'
import { redirect } from 'next/navigation'

interface EditResourceProps {
  params: {
    id: string
  }
}

export default async function EditResourcePage({ params }: EditResourceProps) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Ensure params are awaited if Next.js version requires it but for standard app router params are accessible directly or as an awaited promise in later versions. Next 15+ needs await params.
  const resolvedParams = await params

  const { data: resource, error } = await supabase
    .from('resources')
    .select('*')
    .eq('id', resolvedParams.id)
    .single()

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
