'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent, CardFooter, CardHeader } from './ui/card'
import { Badge } from './ui/badge'
import { Resource } from '@/types/resource'
import { ExternalLink, Edit } from 'lucide-react'
import { Button } from './ui/button'
import { DeleteResourceDialog } from './delete-resource-dialog'

interface ResourceCardProps {
  resource: Resource
  isOwner?: boolean
}

export function ResourceCard({ resource, isOwner = false }: ResourceCardProps) {
  return (
    <Card className="overflow-hidden flex flex-col h-full hover:shadow-md transition-shadow">
      <div className="relative w-full h-48 bg-muted">
        {resource.image_url ? (
          <Image
            src={resource.image_url}
            alt={resource.title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full text-muted-foreground">
            No image
          </div>
        )}
      </div>
      <CardHeader className="p-4 pb-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-lg line-clamp-2">{resource.title}</h3>
          {resource.category && (
            <Badge variant="secondary" className="shrink-0">{resource.category}</Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0 flex-1">
        <a 
          href={resource.link} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-sm text-primary hover:underline flex items-center gap-1"
        >
          <ExternalLink className="w-3 h-3" /> Visit Resource
        </a>
      </CardContent>
      {isOwner && (
        <CardFooter className="p-4 pt-0 flex gap-2 justify-end">
          <Link href={`/dashboard/edit/${resource.id}`}>
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <Edit className="w-4 h-4" /> Edit
            </Button>
          </Link>
          <DeleteResourceDialog resource={resource} />
        </CardFooter>
      )}
    </Card>
  )
}
