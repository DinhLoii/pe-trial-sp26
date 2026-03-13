import { createClient } from '@/lib/supabase/server'
import { ResourceCard } from '@/components/resource-card'
import { Resource } from '@/types/resource'

export const revalidate = 0 // Opt out of static rendering

export default async function HomePage() {
  const supabase = await createClient()

  const { data: resources, error } = await supabase
    .from('resources')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Public Study Resources</h1>
        <p className="text-muted-foreground mt-2">
          A collection of learning materials curated by our community.
        </p>
      </div>

      {error ? (
        <div className="bg-destructive/10 text-destructive p-4 rounded-md">
          {error.message || 'Error loading resources.'}
        </div>
      ) : resources && resources.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resources.map((resource: Resource) => (
            <ResourceCard key={resource.id} resource={resource} />
          ))}
        </div>
      ) : (
        <div className="text-center py-24 bg-background rounded-lg border border-dashed">
          <h2 className="text-lg font-medium">No resources found</h2>
          <p className="text-muted-foreground mt-1">Be the first to add a resource!</p>
        </div>
      )}
    </div>
  )
}
