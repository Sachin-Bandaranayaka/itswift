'use client'

import { useEffect, useMemo, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useToast } from '@/hooks/use-toast'
import { DEFAULT_HEADER_CONFIG, DEFAULT_FOOTER_CONFIG } from '@/lib/config/site-layout'
import type { HeaderConfig, FooterConfig } from '@/types/site-layout'

const JSON_SPACING = 2

type LayoutKind = 'header' | 'footer'

type LayoutResponse<T> = {
  success?: boolean
  data?: T
  isDefault?: boolean
  error?: string
}

function prettyStringify(value: unknown) {
  return JSON.stringify(value, null, JSON_SPACING)
}

function parseJson<T>(value: string): T {
  return JSON.parse(value) as T
}

export default function LayoutSettingsPage() {
  const { toast } = useToast()
  const [headerJson, setHeaderJson] = useState(() => prettyStringify(DEFAULT_HEADER_CONFIG))
  const [footerJson, setFooterJson] = useState(() => prettyStringify(DEFAULT_FOOTER_CONFIG))
  const [headerDirty, setHeaderDirty] = useState(false)
  const [footerDirty, setFooterDirty] = useState(false)
  const [headerLoading, setHeaderLoading] = useState(true)
  const [footerLoading, setFooterLoading] = useState(true)
  const [headerError, setHeaderError] = useState<string | null>(null)
  const [footerError, setFooterError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<LayoutKind>('header')

  useEffect(() => {
    void loadConfig('header')
    void loadConfig('footer')
  }, [])

  async function loadConfig(kind: LayoutKind) {
    try {
      const response = await fetch(`/api/admin/layout/${kind}`, {
        cache: 'no-store',
      })

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`)
      }

      const payload: LayoutResponse<HeaderConfig | FooterConfig> = await response.json()

      if (!payload || !payload.data) {
        throw new Error(payload.error || 'No configuration returned')
      }

      if (kind === 'header') {
        setHeaderJson(prettyStringify(payload.data))
        setHeaderDirty(false)
        setHeaderError(null)
        setHeaderLoading(false)
      } else {
        setFooterJson(prettyStringify(payload.data))
        setFooterDirty(false)
        setFooterError(null)
        setFooterLoading(false)
      }
    } catch (error) {
      console.error(`Failed to load ${kind} configuration:`, error)
      toast({
        title: 'Unable to load configuration',
        description: `We could not load the ${kind} settings. Using defaults instead.`,
        variant: 'destructive',
      })

      if (kind === 'header') {
        setHeaderLoading(false)
        setHeaderError(error instanceof Error ? error.message : 'Unknown error')
      } else {
        setFooterLoading(false)
        setFooterError(error instanceof Error ? error.message : 'Unknown error')
      }
    }
  }

  async function handleSave(kind: LayoutKind) {
    try {
      const parsed = parseJson(kind === 'header' ? headerJson : footerJson)

      const response = await fetch(`/api/admin/layout/${kind}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed),
      })

      if (!response.ok) {
        const body = await response.json().catch(() => ({}))
        throw new Error(body.error || 'Failed to save configuration')
      }

      toast({
        title: 'Configuration saved',
        description: `${kind === 'header' ? 'Header' : 'Footer'} layout updated successfully.`,
      })

      if (kind === 'header') {
        setHeaderJson(prettyStringify(parsed))
        setHeaderDirty(false)
      } else {
        setFooterJson(prettyStringify(parsed))
        setFooterDirty(false)
      }
    } catch (error) {
      console.error(`Failed to save ${kind} configuration:`, error)
      toast({
        title: 'Save failed',
        description: error instanceof Error ? error.message : 'Unable to save configuration',
        variant: 'destructive',
      })
    }
  }

  function handleFormat(kind: LayoutKind) {
    try {
      const formatted = kind === 'header'
        ? prettyStringify(parseJson<HeaderConfig>(headerJson))
        : prettyStringify(parseJson<FooterConfig>(footerJson))

      if (kind === 'header') {
        setHeaderJson(formatted)
        setHeaderDirty(true)
      } else {
        setFooterJson(formatted)
        setFooterDirty(true)
      }
    } catch (error) {
      toast({
        title: 'Invalid JSON',
        description: 'Please fix JSON syntax errors before formatting.',
        variant: 'destructive',
      })
    }
  }

  function handleReset(kind: LayoutKind) {
    if (kind === 'header') {
      setHeaderJson(prettyStringify(DEFAULT_HEADER_CONFIG))
      setHeaderDirty(true)
    } else {
      setFooterJson(prettyStringify(DEFAULT_FOOTER_CONFIG))
      setFooterDirty(true)
    }

    toast({
      title: 'Defaults applied',
      description: `${kind === 'header' ? 'Header' : 'Footer'} settings reset to defaults. Remember to save.`,
    })
  }

  function renderEditor(kind: LayoutKind) {
    const isHeader = kind === 'header'
    const loading = isHeader ? headerLoading : footerLoading
    const error = isHeader ? headerError : footerError
    const json = isHeader ? headerJson : footerJson
    const isDirty = isHeader ? headerDirty : footerDirty

    return (
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>{isHeader ? 'Header configuration' : 'Footer configuration'}</CardTitle>
          <CardDescription>
            Update the JSON representation of your {isHeader ? 'site header' : 'site footer'} layout. All fields are validated before saving.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <Badge variant={loading ? 'outline' : isDirty ? 'secondary' : 'default'}>
              {loading ? 'Loading defaults' : isDirty ? 'Unsaved changes' : 'Up to date'}
            </Badge>
            {error && (
              <Badge variant="destructive">
                {error}
              </Badge>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => handleFormat(kind)} disabled={loading}>
              Format JSON
            </Button>
            <Button variant="outline" onClick={() => handleReset(kind)} disabled={loading}>
              Reset to defaults
            </Button>
            <Button onClick={() => handleSave(kind)} disabled={loading}>
              Save changes
            </Button>
          </div>

          <ScrollArea className="h-[480px] w-full rounded-md border">
            <Textarea
              value={json}
              onChange={(event) => {
                const value = event.target.value
                if (kind === 'header') {
                  setHeaderJson(value)
                  setHeaderDirty(true)
                } else {
                  setFooterJson(value)
                  setFooterDirty(true)
                }
              }}
              className="h-[480px] w-full font-mono text-sm"
              placeholder={`{\n  "example": true\n}`}
            />
          </ScrollArea>
        </CardContent>
      </Card>
    )
  }

  const pageDescription = useMemo(
    () => (
      activeTab === 'header'
        ? 'Manage navigation items, logo, and CTA button copy for the site header.'
        : 'Control footer links, social profiles, and legal details displayed across the site.'
    ),
    [activeTab],
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Site layout settings</h1>
        <p className="text-muted-foreground">
          {pageDescription}
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as LayoutKind)}>
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="header">Header</TabsTrigger>
          <TabsTrigger value="footer">Footer</TabsTrigger>
        </TabsList>
        <TabsContent value="header" className="mt-4">
          {renderEditor('header')}
        </TabsContent>
        <TabsContent value="footer" className="mt-4">
          {renderEditor('footer')}
        </TabsContent>
      </Tabs>
    </div>
  )
}
