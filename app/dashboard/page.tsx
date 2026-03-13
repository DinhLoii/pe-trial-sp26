import { createClient } from '@/lib/supabase/server'
import { ResourceCard } from '@/components/resource-card'
import { Resource } from '@/types/resource'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { redirect } from 'next/navigation'

export const revalidate = 0

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: resources, error } = await supabase
    .from('resources')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Your Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Manage your personal study resources.
          </p>
        </div>
        <Link href="/dashboard/new">
          <Button className="flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add Resource
          </Button>
        </Link>
      </div>

      {error ? (
        <div className="bg-destructive/10 text-destructive p-4 rounded-md">
          {error.message || 'Error loading your resources.'}
        </div>
      ) : resources && resources.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resources.map((resource: Resource) => (
            <ResourceCard key={resource.id} resource={resource} isOwner={true} />
          ))}
        </div>
      ) : (
        <div className="text-center py-24 bg-background rounded-lg border border-dashed flex flex-col items-center">
          <h2 className="text-lg font-medium">No resources yet</h2>
          <p className="text-muted-foreground mt-1 mb-4">Start by adding a new resource to your collection.</p>
          <Link href="/dashboard/new">
            <Button variant="outline">Create your first resource</Button>
          </Link>
        </div>
      )}
    </div>
  )
}
