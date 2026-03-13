import { createClient } from '@/lib/supabase/server'
import { ResourceForm } from '@/components/resource-form'
import { redirect } from 'next/navigation'

export default async function NewResourcePage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <ResourceForm userId={user.id} />
    </div>
  )
}
