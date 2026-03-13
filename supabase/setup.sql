-- 1. Create resources table
create table public.resources (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) not null,
  title text not null,
  link text not null,
  category text null,
  image_url text not null,
  created_at timestamp with time zone default now()
);

-- 2. Configure Row Level Security (RLS)
alter table public.resources enable row level security;

-- 3. Create Policies
-- Public can view all resources
create policy "Public can view all resources"
on public.resources for select
to public
using ( true );

-- Authenticated users can insert only their own resources
create policy "Users can insert their own resources"
on public.resources for insert
to authenticated
with check ( auth.uid() = user_id );

-- Users can update only their own resources
create policy "Users can update their own resources"
on public.resources for update
to authenticated
using ( auth.uid() = user_id )
with check ( auth.uid() = user_id );

-- Users can delete only their own resources
create policy "Users can delete their own resources"
on public.resources for delete
to authenticated
using ( auth.uid() = user_id );

-- 4. Enable Storage Bucket
insert into storage.buckets (id, name, public) 
values ('resource-images', 'resource-images', true)
on conflict (id) do nothing;

-- 5. Storage Policies for `resource-images` bucket
-- Public access for downloading images
create policy "Public Access"
on storage.objects for select
to public
using ( bucket_id = 'resource-images' );

-- Authenticated users can upload
create policy "Authenticated users can upload images"
on storage.objects for insert
to authenticated
with check ( bucket_id = 'resource-images' );

-- Users can delete their images
create policy "Users can delete their images"
on storage.objects for delete
to authenticated
using ( bucket_id = 'resource-images' and auth.uid() = owner );
