'use client'
import { Button } from '@/components/ui/button'
import { useState, useEffect, useRef } from 'react'
import { useSearchParams, useParams } from 'next/navigation'
import { User } from '@prisma/client'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Loader2, Search, Mail, Building, MapPin, Users, ExternalLink, Download, User as UserIcon, AlertCircle, CreditCard, Phone, Calendar, DollarSign, Globe, Trophy } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { createPortal } from 'react-dom'

// Types for Apollo API responses
interface ApolloPersonResult {
  id: string
  first_name: string
  last_name: string
  name: string
  title: string
  email: string
  email_status: string
  linkedin_url: string
  twitter_url?: string
  github_url?: string
  facebook_url?: string
  organization: {
    id: string
    name: string
    website_url: string
    logo_url: string
    primary_domain: string
    locations: Array<{
      city: string
      state: string
      country: string
    }>
  }
  photo_url: string
  headline: string
  city?: string
  state?: string
  country?: string
  seniority?: string
  departments?: string[]
  subdepartments?: string[]
  functions?: string[]
  employment_history?: Array<{
    _id: string
    created_at?: string
    current: boolean
    degree?: string
    description?: string
    emails?: string[]
    end_date?: string
    grade_level?: string
    kind?: string
    major?: string
    organization_id: string
    organization_name: string
    raw_address?: string
    start_date: string
    title: string
    updated_at?: string
    id: string
    key: string
  }>
  phone_numbers?: Array<{
    raw_number: string
    sanitized_number: string
    type: string
    position: number
    status: string
    dnc_status?: string
    dnc_other_info?: string
    dialer_flags?: any
  }>
}

interface ApolloCompanyResult {
  id: string
  name: string
  website_url: string
  logo_url: string
  primary_domain: string
  organization_num_employees: number
  retail_location_count: number
  raw_address: string
  publicly_traded_symbol: string
  publicly_traded_exchange: string
  linkedin_url: string
  crunchbase_url: string
  primary_phone: {
    number: string
  }
  keywords: string[]
  estimated_num_employees: number
  snippets_loaded: boolean
  industry: string
  subindustries: string[]
  annual_revenue: number
  founded_year: number
  total_funding?: number
  total_funding_printed?: string
  latest_funding_stage?: string
  latest_funding_round_date?: string
  funding_events?: any[]
}

interface ApolloSearchResponse {
  people?: ApolloPersonResult[]
  organizations?: ApolloCompanyResult[]
  pagination: {
    page: number
    per_page: number
    total_entries: number
    total_pages: number
  }
  partial_results_only: boolean
  partial_results_limit: number
  breadcrumbs: Array<{
    label: string
    signal_field_name: string
    value: string
    display_name: string
  }>
}

interface SearchResultsProps {
  results: ApolloSearchResponse | null
  searchType: 'people' | 'companies'
  isLoading: boolean
  error: string | null
  onLoadMore: () => void
  onExport: () => void
  hasMore: boolean
  creditsConsumed: number
  remainingCredits: number
  isUserPremium: boolean
  handleEnrich: (row: any, type: 'people' | 'companies') => void
  enrichingId: string | null
  selectedIds: string[]
  handleSelectRow: (id: string) => void
  handleSelectAll: (ids: string[]) => void
  handleBulkEnrich: () => void
  maxBulk: number
}

// Credit Usage Confirmation Modal
const CreditUsageModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  searchType, 
  estimatedCost,
  remainingCredits 
}: {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  searchType: 'people' | 'companies'
  estimatedCost: number
  remainingCredits: number
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-primary" />
            Confirm Credit Usage
          </DialogTitle>
          <DialogDescription className="space-y-3">
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-amber-800 dark:text-amber-200">
                  <strong>Leadfume {searchType} search</strong> will consume credits from your account.
                </div>
              </div>
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Estimated cost:</span>
                <span className="font-medium">{estimatedCost} credits</span>
              </div>
              <div className="flex justify-between">
                <span>Available credits:</span>
                <span className={`font-medium ${remainingCredits < estimatedCost ? 'text-red-600' : 'text-green-600'}`}>
                  {remainingCredits}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span>After search:</span>
                <span className={`font-medium ${remainingCredits - estimatedCost < 0 ? 'text-red-600' : 'text-foreground'}`}>
                  {Math.max(0, remainingCredits - estimatedCost)} credits remaining
                </span>
              </div>
            </div>

            {remainingCredits < estimatedCost && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-red-800 dark:text-red-200">
                    <strong>Insufficient credits!</strong> Please upgrade your plan or purchase more credits.
                  </div>
                </div>
              </div>
            )}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={onConfirm} 
            disabled={remainingCredits < estimatedCost}
            className="min-w-24"
          >
            {remainingCredits < estimatedCost ? 'Insufficient Credits' : 'Confirm Search'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

const SearchResults = ({ 
  results, 
  searchType, 
  isLoading, 
  error, 
  onLoadMore, 
  onExport, 
  hasMore, 
  creditsConsumed, 
  remainingCredits, 
  isUserPremium, 
  handleEnrich, 
  enrichingId, 
  selectedIds, 
  handleSelectRow, 
  handleSelectAll, 
  handleBulkEnrich, 
  maxBulk 
}: SearchResultsProps) => {
  const [isFullScreenOpen, setIsFullScreenOpen] = useState(false)

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50 dark:bg-red-900/20">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
            <span className="font-medium">Search Error:</span>
            <span>{error}</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (isLoading && !results) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Searching Leadfume database...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!results) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-muted-foreground">
            <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Configure your filters and click "Search Leadfume" to find {searchType}</p>
            <p className="text-xs mt-2">Note: Searching will consume credits from your account</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const { pagination } = results

  return (
    <div className="space-y-4">
      {/* Search Stats */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <Badge variant="secondary" className="bg-primary/10">
                {pagination.total_entries.toLocaleString()} results found
              </Badge>
              <Badge variant="outline">
                Page {pagination.page} of {pagination.total_pages}
              </Badge>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="destructive" className="bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300">
                Credits Used: {creditsConsumed}
              </Badge>
              <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                Remaining: {remainingCredits}
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsFullScreenOpen(true)}
                className="flex items-center gap-2"
              >
                <ExternalLink className="h-4 w-4" />
                View Full Screen
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {searchType === 'people' ? (
        <PeopleResultsTable people={results.people || []} onExport={onExport} isUserPremium={isUserPremium} handleEnrich={handleEnrich} enrichingId={enrichingId} selectedIds={selectedIds} handleSelectRow={handleSelectRow} handleSelectAll={handleSelectAll} handleBulkEnrich={handleBulkEnrich} maxBulk={maxBulk} />
      ) : (
        <CompanyResultsTable companies={results.organizations || []} onExport={onExport} isUserPremium={isUserPremium} handleEnrich={handleEnrich} enrichingId={enrichingId} selectedIds={selectedIds} handleSelectRow={handleSelectRow} handleSelectAll={handleSelectAll} handleBulkEnrich={handleBulkEnrich} maxBulk={maxBulk} />
      )}

      {/* Load More */}
      {hasMore && (
        <div className="flex justify-center">
          <Button 
            onClick={onLoadMore} 
            disabled={isLoading}
            variant="outline"
            className="min-w-32"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Loading...
              </>
            ) : (
              'Load More Results'
            )}
          </Button>
        </div>
      )}

      {/* Full Screen Modal */}
      <FullScreenModal
        isOpen={isFullScreenOpen}
        onClose={() => setIsFullScreenOpen(false)}
        results={results}
        searchType={searchType}
        onExport={onExport}
        onLoadMore={onLoadMore}
        hasMore={hasMore}
        isLoading={isLoading}
        creditsConsumed={creditsConsumed}
        remainingCredits={remainingCredits}
        isUserPremium={isUserPremium}
        handleEnrich={handleEnrich}
        enrichingId={enrichingId}
        selectedIds={selectedIds}
        handleSelectRow={handleSelectRow}
        handleSelectAll={handleSelectAll}
        handleBulkEnrich={handleBulkEnrich}
        maxBulk={maxBulk}
      />
    </div>
  )
}

// People Results Table Component
const PeopleResultsTable = ({ people, onExport, isUserPremium, handleEnrich, enrichingId, selectedIds, handleSelectRow, handleSelectAll, handleBulkEnrich, maxBulk }: {
  people: ApolloPersonResult[],
  onExport: () => void,
  isUserPremium: boolean,
  handleEnrich: (row: any, type: 'people' | 'companies') => void,
  enrichingId: string | null,
  selectedIds: string[],
  handleSelectRow: (id: string) => void,
  handleSelectAll: (ids: string[]) => void,
  handleBulkEnrich: () => void,
  maxBulk: number
}) => {
  const allIds = people.map(p => p.id)
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-foreground">People Results</h3>
        <div className="flex gap-2">
          {isUserPremium && (
            <Button
              onClick={handleBulkEnrich}
              disabled={selectedIds.length === 0 || selectedIds.length > maxBulk}
              variant="default"
              size="sm"
            >
              Bulk Enrich (max 10)
            </Button>
          )}
          <Button onClick={onExport} variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export to Excel
          </Button>
        </div>
      </div>
      <div className="max-w-[77rem] overflow-x-scroll border rounded-lg ">
        <div className="">
          <table className="w-full text-sm border-collapse bg-card">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="p-3 text-left font-medium min-w-[40px]">
                  <input
                    type="checkbox"
                    checked={selectedIds.length > 0 && selectedIds.length === allIds.length}
                    onChange={() => handleSelectAll(allIds)}
                  />
                </th>
                <th className="p-3 text-left font-medium min-w-[60px]">Photo</th>
                <th className="p-3 text-left font-medium min-w-[200px]">Name & Contact</th>
                <th className="p-3 text-left font-medium min-w-[180px]">Title & Company</th>
                <th className="p-3 text-left font-medium min-w-[150px]">Location</th>
                <th className="p-3 text-left font-medium min-w-[120px]">Email Status</th>
                <th className="p-3 text-left font-medium min-w-[100px]">Seniority</th>
                <th className="p-3 text-left font-medium min-w-[150px]">Departments</th>
                <th className="p-3 text-left font-medium min-w-[120px]">Phone</th>
                <th className="p-3 text-left font-medium min-w-[200px]">Employment History</th>
                <th className="p-3 text-left font-medium min-w-[150px]">Links</th>
                <th className="p-3 text-left font-medium min-w-[120px]">Actions</th>
                <th className="p-3 text-left font-medium min-w-[120px]">Enrich</th>
              </tr>
            </thead>
            <tbody>
              {people.map((person, index) => (
                <tr key={person.id || index} className="border-b hover:bg-muted/30 transition-colors">
                  <td className="p-3">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(person.id)}
                      onChange={() => handleSelectRow(person.id)}
                      disabled={
                        !selectedIds.includes(person.id) && selectedIds.length >= maxBulk
                      }
                    />
                  </td>
                  <td className="p-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={person.photo_url} alt={person.name} />
                      <AvatarFallback>
                        {person.first_name?.[0]}{person.last_name?.[0]}
                      </AvatarFallback>
                    </Avatar>
                  </td>
                  
                  <td className="p-3">
                    <div className="space-y-1">
                      <div className="font-medium text-foreground">{person.name}</div>
                      {person.email && (
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Mail className="h-3 w-3" />
                          {person.email}
                        </div>
                      )}
                      {person.headline && (
                        <div className="text-xs text-muted-foreground max-w-[180px] truncate">
                          {person.headline}
                        </div>
                      )}
                    </div>
                  </td>
                  
                  <td className="p-3">
                    <div className="space-y-1">
                      <div className="font-medium text-sm">{person.title}</div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Building className="h-3 w-3" />
                        {person.organization?.name}
                      </div>
                      {person.organization?.website_url && (
                        <div className="text-xs text-muted-foreground">
                          {person.organization.website_url}
                        </div>
                      )}
                    </div>
                  </td>
                  
                  <td className="p-3">
                    <div className="space-y-1">
                      {(person.city || person.state || person.country) && (
                        <div className="flex items-center gap-1 text-sm">
                          <MapPin className="h-3 w-3" />
                          <span>{[person.city, person.state, person.country].filter(Boolean).join(', ')}</span>
                        </div>
                      )}
                      {person.organization?.locations?.[0] && (
                        <div className="text-xs text-muted-foreground">
                          Org: {[
                            person.organization.locations[0].city,
                            person.organization.locations[0].state,
                            person.organization.locations[0].country
                          ].filter(Boolean).join(', ')}
                        </div>
                      )}
                    </div>
                  </td>
                  
                  <td className="p-3">
                    <Badge variant={
                      person.email_status === 'verified' ? 'default' :
                      person.email_status === 'likely' ? 'secondary' :
                      'destructive'
                    }>
                      {person.email_status || 'Unknown'}
                    </Badge>
                  </td>
                  
                  <td className="p-3">
                    <div className="space-y-1">
                      {person.seniority && (
                        <Badge variant="outline">{person.seniority}</Badge>
                      )}
                      {person.functions && person.functions.length > 0 && (
                        <div className="text-xs text-muted-foreground">
                          {person.functions.join(', ')}
                        </div>
                      )}
                    </div>
                  </td>
                  
                  <td className="p-3">
                    <div className="space-y-1">
                      {person.departments && person.departments.length > 0 && (
                        <div className="text-xs">
                          <div className="font-medium">Dept:</div>
                          {person.departments.join(', ')}
                        </div>
                      )}
                      {person.subdepartments && person.subdepartments.length > 0 && (
                        <div className="text-xs text-muted-foreground">
                          <div className="font-medium">Sub:</div>
                          {person.subdepartments.join(', ')}
                        </div>
                      )}
                    </div>
                  </td>
                  
                  <td className="p-3">
                    {person.phone_numbers && person.phone_numbers.length > 0 && (
                      <div className="space-y-1">
                        {person.phone_numbers.slice(0, 2).map((phone, idx) => (
                          <div key={idx} className="flex items-center gap-1 text-sm">
                            <Phone className="h-3 w-3" />
                            <span>{phone.raw_number}</span>
                            {phone.type && (
                              <Badge variant="outline" className="text-xs">
                                {phone.type}
                              </Badge>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </td>
                  
                  <td className="p-3">
                    {person.employment_history && person.employment_history.length > 0 && (
                      <div className="space-y-1 max-w-[180px]">
                        {person.employment_history.slice(0, 3).map((job, idx) => (
                          <div key={idx} className="text-xs">
                            <div className="font-medium">{job.title}</div>
                            <div className="text-muted-foreground">{job.organization_name}</div>
                            {job.start_date && (
                              <div className="text-muted-foreground">
                                {job.start_date} - {job.current ? 'Present' : job.end_date || 'Unknown'}
                              </div>
                            )}
                          </div>
                        ))}
                        {person.employment_history.length > 3 && (
                          <div className="text-xs text-muted-foreground">
                            +{person.employment_history.length - 3} more
                          </div>
                        )}
                      </div>
                    )}
                  </td>
                  
                  <td className="p-3">
                    <div className="flex flex-col gap-1">
                      {person.linkedin_url && (
                        <a href={person.linkedin_url} target="_blank" rel="noopener noreferrer" 
                           className="text-blue-600 hover:text-blue-800 text-xs">
                          <ExternalLink className="h-3 w-3 inline mr-1" />
                          LinkedIn
                        </a>
                      )}
                      {person.twitter_url && (
                        <a href={person.twitter_url} target="_blank" rel="noopener noreferrer"
                           className="text-blue-600 hover:text-blue-800 text-xs">
                          <ExternalLink className="h-3 w-3 inline mr-1" />
                          Twitter
                        </a>
                      )}
                      {person.github_url && (
                        <a href={person.github_url} target="_blank" rel="noopener noreferrer"
                           className="text-blue-600 hover:text-blue-800 text-xs">
                          <ExternalLink className="h-3 w-3 inline mr-1" />
                          GitHub
                        </a>
                      )}
                    </div>
                  </td>
                  
                  <td className="p-3">
                    <div className="flex flex-col gap-1">
                      <Button variant="outline" size="sm" className="text-xs h-7">
                        <UserIcon className="h-3 w-3 mr-1" />
                        View
                      </Button>
                      <Button variant="outline" size="sm" className="text-xs h-7">
                        <Mail className="h-3 w-3 mr-1" />
                        Contact
                      </Button>
                    </div>
                  </td>
                  <td className="p-3">
                    <Button
                      variant={isUserPremium ? 'default' : 'outline'}
                      size="sm"
                      className="text-xs h-7"
                      disabled={enrichingId === person.id}
                      onClick={() => handleEnrich(person, 'people')}
                    >
                      {enrichingId === person.id ? (
                        <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                      ) : (
                        <Trophy className="h-3 w-3 mr-1" />
                      )}
                      {isUserPremium ? 'Enrich Data' : 'Upgrade to Enrich'}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// Company Results Table Component
const CompanyResultsTable = ({ companies, onExport, isUserPremium, handleEnrich, enrichingId, selectedIds, handleSelectRow, handleSelectAll, handleBulkEnrich, maxBulk }: {
  companies: ApolloCompanyResult[],
  onExport: () => void,
  isUserPremium: boolean,
  handleEnrich: (row: any, type: 'people' | 'companies') => void,
  enrichingId: string | null,
  selectedIds: string[],
  handleSelectRow: (id: string) => void,
  handleSelectAll: (ids: string[]) => void,
  handleBulkEnrich: () => void,
  maxBulk: number
}) => {
  const allIds = companies.map(c => c.id)
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-foreground">Company Results</h3>
        <div className="flex gap-2">
          {isUserPremium && (
            <Button
              onClick={handleBulkEnrich}
              disabled={selectedIds.length === 0 || selectedIds.length > maxBulk}
              variant="default"
              size="sm"
            >
              Bulk Enrich (max 10)
            </Button>
          )}
          <Button onClick={onExport} variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export to Excel
          </Button>
        </div>
      </div>
      <div className="max-w-[77rem] overflow-x-scroll border rounded-lg">
        <div className="">
          <table className="w-full text-sm border-collapse bg-card">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="p-3 text-left font-medium min-w-[40px]">
                  <input
                    type="checkbox"
                    checked={selectedIds.length > 0 && selectedIds.length === allIds.length}
                    onChange={() => handleSelectAll(allIds)}
                  />
                </th>
                <th className="p-3 text-left font-medium min-w-[60px]">Logo</th>
                <th className="p-3 text-left font-medium min-w-[200px]">Company Info</th>
                <th className="p-3 text-left font-medium min-w-[180px]">Contact & Web</th>
                <th className="p-3 text-left font-medium min-w-[150px]">Location</th>
                <th className="p-3 text-left font-medium min-w-[120px]">Size & Revenue</th>
                <th className="p-3 text-left font-medium min-w-[100px]">Founded</th>
                <th className="p-3 text-left font-medium min-w-[150px]">Trading Info</th>
                <th className="p-3 text-left font-medium min-w-[200px]">Industry & Keywords</th>
                <th className="p-3 text-left font-medium min-w-[160px]">Funding Details</th>
                <th className="p-3 text-left font-medium min-w-[120px]">Actions</th>
                <th className="p-3 text-left font-medium min-w-[120px]">Enrich</th>
              </tr>
            </thead>
            <tbody>
              {companies.map((company, index) => (
                <tr key={company.id || index} className="border-b hover:bg-muted/30 transition-colors">
                  <td className="p-3">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(company.id)}
                      onChange={() => handleSelectRow(company.id)}
                      disabled={
                        !selectedIds.includes(company.id) && selectedIds.length >= maxBulk
                      }
                    />
                  </td>
                  <td className="p-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={company.logo_url} alt={company.name} />
                      <AvatarFallback>
                        <Building className="h-6 w-6" />
                      </AvatarFallback>
                    </Avatar>
                  </td>
                  
                  <td className="p-3">
                    <div className="space-y-1">
                      <div className="font-medium text-foreground">{company.name}</div>
                      {company.primary_domain && (
                        <div className="text-sm text-muted-foreground">{company.primary_domain}</div>
                      )}
                      {company.raw_address && (
                        <div className="text-xs text-muted-foreground max-w-[180px] truncate">
                          {company.raw_address}
                        </div>
                      )}
                    </div>
                  </td>
                  
                  <td className="p-3">
                    <div className="space-y-1">
                      {company.website_url && (
                        <div className="flex items-center gap-1 text-sm">
                          <Globe className="h-3 w-3" />
                          <a href={company.website_url} target="_blank" rel="noopener noreferrer" 
                             className="text-blue-600 hover:text-blue-800 truncate max-w-[150px]">
                            {company.website_url}
                          </a>
                        </div>
                      )}
                      {company.primary_phone && (
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Phone className="h-3 w-3" />
                          {company.primary_phone.number}
                        </div>
                      )}
                      {company.linkedin_url && (
                        <a href={company.linkedin_url} target="_blank" rel="noopener noreferrer"
                           className="text-blue-600 hover:text-blue-800 text-xs">
                          <ExternalLink className="h-3 w-3 inline mr-1" />
                          LinkedIn
                        </a>
                      )}
                    </div>
                  </td>
                  
                  <td className="p-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-sm">
                        <MapPin className="h-3 w-3" />
                        <span className="max-w-[130px] truncate">
                          {company.raw_address || 'Not specified'}
                        </span>
                      </div>
                      {company.retail_location_count && (
                        <div className="text-xs text-muted-foreground">
                          {company.retail_location_count} retail locations
                        </div>
                      )}
                    </div>
                  </td>
                  
                  <td className="p-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        <Badge variant="secondary" className="text-xs">
                          {company.organization_num_employees || company.estimated_num_employees || 'Unknown'} employees
                        </Badge>
                      </div>
                      {company.annual_revenue && (
                        <div className="flex items-center gap-1 text-sm">
                          <DollarSign className="h-3 w-3" />
                          <span className="text-green-600">
                            ${(company.annual_revenue / 1000000).toFixed(1)}M
                          </span>
                        </div>
                      )}
                    </div>
                  </td>
                  
                  <td className="p-3">
                    {company.founded_year && (
                      <div className="flex items-center gap-1 text-sm">
                        <Calendar className="h-3 w-3" />
                        <span>{company.founded_year}</span>
                      </div>
                    )}
                  </td>
                  
                  <td className="p-3">
                    <div className="space-y-1">
                      {company.publicly_traded_symbol && (
                        <div className="space-y-1">
                          <Badge variant="default" className="text-xs">
                            {company.publicly_traded_symbol}
                          </Badge>
                          {company.publicly_traded_exchange && (
                            <div className="text-xs text-muted-foreground">
                              {company.publicly_traded_exchange}
                            </div>
                          )}
                        </div>
                      )}
                      {!company.publicly_traded_symbol && (
                        <div className="text-xs text-muted-foreground">Private</div>
                      )}
                    </div>
                  </td>
                  
                  <td className="p-3">
                    <div className="space-y-1">
                      {company.industry && (
                        <div className="text-sm font-medium">{company.industry}</div>
                      )}
                      {company.subindustries && company.subindustries.length > 0 && (
                        <div className="text-xs text-muted-foreground">
                          {company.subindustries.slice(0, 2).join(', ')}
                          {company.subindustries.length > 2 && ` +${company.subindustries.length - 2}`}
                        </div>
                      )}
                      {company.keywords && company.keywords.length > 0 && (
                        <div className="text-xs text-muted-foreground">
                          Keywords: {company.keywords.slice(0, 3).join(', ')}
                          {company.keywords.length > 3 && ` +${company.keywords.length - 3}`}
                        </div>
                      )}
                    </div>
                  </td>
                  
                  <td className="p-3">
                    <div className="space-y-1">
                      {company.total_funding && (
                        <div className="flex items-center gap-1 text-sm">
                          <Trophy className="h-3 w-3" />
                          <span className="text-purple-600">
                            {company.total_funding_printed || `$${(company.total_funding / 1000000).toFixed(1)}M`}
                          </span>
                        </div>
                      )}
                      {company.latest_funding_stage && (
                        <Badge variant="outline" className="text-xs">
                          {company.latest_funding_stage}
                        </Badge>
                      )}
                      {company.latest_funding_round_date && (
                        <div className="text-xs text-muted-foreground">
                          {company.latest_funding_round_date}
                        </div>
                      )}
                    </div>
                  </td>
                  
                  <td className="p-3">
                    <div className="flex flex-col gap-1">
                      <Button variant="outline" size="sm" className="text-xs h-7">
                        <Building className="h-3 w-3 mr-1" />
                        View
                      </Button>
                      <Button variant="outline" size="sm" className="text-xs h-7">
                        <Mail className="h-3 w-3 mr-1" />
                        Contact
                      </Button>
                    </div>
                  </td>
                  <td className="p-3">
                    <Button
                      variant={isUserPremium ? 'default' : 'outline'}
                      size="sm"
                      className="text-xs h-7"
                      disabled={enrichingId === company.id}
                      onClick={() => handleEnrich(company, 'companies')}
                    >
                      {enrichingId === company.id ? (
                        <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                      ) : (
                        <Trophy className="h-3 w-3 mr-1" />
                      )}
                      {isUserPremium ? 'Enrich Data' : 'Upgrade to Enrich'}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// Custom Modal Component
const CustomModal = ({ isOpen, onClose, children }: { isOpen: boolean, onClose: () => void, children: React.ReactNode }) => {
  const modalRef = useRef<HTMLDivElement>(null)

  // Close on ESC
  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  // Scroll lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  // Click outside to close
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === modalRef.current) {
      onClose()
    }
  }

  if (!isOpen) return null
  return createPortal(
    <div
      ref={modalRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
      onMouseDown={handleOverlayClick}
      aria-modal="true"
      role="dialog"
    >
      <div className="relative bg-background rounded-xl shadow-2xl w-[90vw] h-[90vh] flex flex-col overflow-hidden border border-border animate-in fade-in zoom-in-95">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-muted hover:bg-muted-foreground/20 transition"
          aria-label="Close"
        >
          <span className="sr-only">Close</span>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M6 6l8 8M6 14L14 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
        </button>
        {children}
      </div>
    </div>,
    typeof window !== 'undefined' ? document.body : (null as any)
  )
}

// Full Screen Modal Component (now using CustomModal)
const FullScreenModal = ({
  isOpen,
  onClose,
  results,
  searchType,
  onExport,
  onLoadMore,
  hasMore,
  isLoading,
  creditsConsumed,
  remainingCredits,
  isUserPremium,
  handleEnrich,
  enrichingId,
  selectedIds,
  handleSelectRow,
  handleSelectAll,
  handleBulkEnrich,
  maxBulk
}: {
  isOpen: boolean
  onClose: () => void
  results: ApolloSearchResponse
  searchType: 'people' | 'companies'
  onExport: () => void
  onLoadMore: () => void
  hasMore: boolean
  isLoading: boolean
  creditsConsumed: number
  remainingCredits: number
  isUserPremium: boolean
  handleEnrich: (row: any, type: 'people' | 'companies') => void
  enrichingId: string | null
  selectedIds: string[]
  handleSelectRow: (id: string) => void
  handleSelectAll: (ids: string[]) => void
  handleBulkEnrich: () => void
  maxBulk: number
}) => {
  const { pagination } = results

  return (
    <CustomModal isOpen={isOpen} onClose={onClose}>
      {/* Header */}
      <div className="px-6 py-4 border-b flex-shrink-0 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Search className="h-5 w-5" />
          Leadfume {searchType === 'people' ? 'People' : 'Company'} Search Results - Full Screen
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="bg-primary/10 text-primary">
            {pagination.total_entries.toLocaleString()} results
          </Badge>
          <Badge variant="outline">
            Page {pagination.page} of {pagination.total_pages}
          </Badge>
        </div>
      </div>
      {/* Content */}
      <div className="flex-1 overflow-hidden p-6 min-h-0 flex flex-col">
        {/* Stats Bar */}
        <div className="flex-shrink-0">
          <Card>
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Badge variant="destructive" className="bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300">
                    Credits Used: {creditsConsumed}
                  </Badge>
                  <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                    Remaining: {remainingCredits}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Button onClick={onExport} variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export to Excel
                  </Button>
                  {hasMore && (
                    <Button 
                      onClick={onLoadMore} 
                      disabled={isLoading}
                      variant="outline"
                      size="sm"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Loading...
                        </>
                      ) : (
                        'Load More'
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        {/* Results Table */}
        <div className="h-full flex-1 min-h-0 flex flex-col overflow-y-hidden">
          {searchType === 'people' ? (
            <FullScreenPeopleTable
              people={results.people || []}
              isUserPremium={isUserPremium}
              handleEnrich={handleEnrich}
              enrichingId={enrichingId}
              selectedIds={selectedIds}
              handleSelectRow={handleSelectRow}
              handleSelectAll={handleSelectAll}
              handleBulkEnrich={handleBulkEnrich}
              maxBulk={maxBulk}
            />
          ) : (
            <FullScreenCompanyTable
              companies={results.organizations || []}
              isUserPremium={isUserPremium}
              handleEnrich={handleEnrich}
              enrichingId={enrichingId}
              selectedIds={selectedIds}
              handleSelectRow={handleSelectRow}
              handleSelectAll={handleSelectAll}
              handleBulkEnrich={handleBulkEnrich}
              maxBulk={maxBulk}
            />
          )}
          {/* Bottom Load More Button */}
          {hasMore && (
            <div className="flex justify-center py-4">
              <Button 
                onClick={onLoadMore} 
                disabled={isLoading}
                variant="outline"
                className="min-w-32"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Loading...
                  </>
                ) : (
                  'Load More Results'
                )}
              </Button>
            </div>
          )}
        </div>
      </div>
    </CustomModal>
  )
}

// Full Screen People Table (optimized for large screens)
const FullScreenPeopleTable = ({ people, isUserPremium, handleEnrich, enrichingId, selectedIds, handleSelectRow, handleSelectAll, handleBulkEnrich, maxBulk }: {
  people: ApolloPersonResult[],
  isUserPremium: boolean,
  handleEnrich: (row: any, type: 'people' | 'companies') => void,
  enrichingId: string | null,
  selectedIds: string[],
  handleSelectRow: (id: string) => void,
  handleSelectAll: (ids: string[]) => void,
  handleBulkEnrich: () => void,
  maxBulk: number
}) => {
  const allIds = people.map(p => p.id)
  return (
    <div className="space-y-4 h-full flex flex-col">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-foreground">People Results</h3>
        <div className="flex gap-2">
          {isUserPremium && (
            <Button
              onClick={handleBulkEnrich}
              disabled={selectedIds.length === 0 || selectedIds.length > maxBulk}
              variant="default"
              size="sm"
            >
              Bulk Enrich (max 10)
            </Button>
          )}
        </div>
      </div>
      <div className="border rounded-lg overflow-x-auto max-h-[33rem]">
        <div className="min-w-[1400px]">
          <table className="w-full text-sm border-collapse bg-card">
            <thead className="sticky top-0 bg-muted/80 backdrop-blur">
              <tr className="border-b">
                <th className="p-3 text-left font-medium min-w-[40px]">
                  <input
                    type="checkbox"
                    checked={selectedIds.length > 0 && selectedIds.length === allIds.length}
                    onChange={() => handleSelectAll(allIds)}
                  />
                </th>
                <th className="p-3 text-left font-medium min-w-[60px]">Photo</th>
                <th className="p-3 text-left font-medium min-w-[200px]">Name & Contact</th>
                <th className="p-3 text-left font-medium min-w-[180px]">Title & Company</th>
                <th className="p-3 text-left font-medium min-w-[150px]">Location</th>
                <th className="p-3 text-left font-medium min-w-[120px]">Email Status</th>
                <th className="p-3 text-left font-medium min-w-[100px]">Seniority</th>
                <th className="p-3 text-left font-medium min-w-[150px]">Departments</th>
                <th className="p-3 text-left font-medium min-w-[120px]">Phone</th>
                <th className="p-3 text-left font-medium min-w-[200px]">Employment History</th>
                <th className="p-3 text-left font-medium min-w-[150px]">Links</th>
                <th className="p-3 text-left font-medium min-w-[120px]">Actions</th>
                <th className="p-3 text-left font-medium min-w-[120px]">Enrich</th>
              </tr>
            </thead>
            <tbody>
              {people.map((person, index) => (
                <tr key={person.id || index} className="border-b hover:bg-muted/30 transition-colors">
                  <td className="p-3">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(person.id)}
                      onChange={() => handleSelectRow(person.id)}
                      disabled={
                        !selectedIds.includes(person.id) && selectedIds.length >= maxBulk
                      }
                    />
                  </td>
                  <td className="p-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={person.photo_url} alt={person.name} />
                      <AvatarFallback>
                        {person.first_name?.[0]}{person.last_name?.[0]}
                      </AvatarFallback>
                    </Avatar>
                  </td>
                  
                  <td className="p-3">
                    <div className="space-y-1">
                      <div className="font-medium text-foreground">{person.name}</div>
                      {person.email && (
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Mail className="h-3 w-3" />
                          {person.email}
                        </div>
                      )}
                      {person.headline && (
                        <div className="text-xs text-muted-foreground max-w-[180px] truncate">
                          {person.headline}
                        </div>
                      )}
                    </div>
                  </td>
                  
                  <td className="p-3">
                    <div className="space-y-1">
                      <div className="font-medium text-sm">{person.title}</div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Building className="h-3 w-3" />
                        {person.organization?.name}
                      </div>
                      {person.organization?.website_url && (
                        <div className="text-xs text-muted-foreground">
                          {person.organization.website_url}
                        </div>
                      )}
                    </div>
                  </td>
                  
                  <td className="p-3">
                    <div className="space-y-1">
                      {(person.city || person.state || person.country) && (
                        <div className="flex items-center gap-1 text-sm">
                          <MapPin className="h-3 w-3" />
                          <span>{[person.city, person.state, person.country].filter(Boolean).join(', ')}</span>
                        </div>
                      )}
                      {person.organization?.locations?.[0] && (
                        <div className="text-xs text-muted-foreground">
                          Org: {[
                            person.organization.locations[0].city,
                            person.organization.locations[0].state,
                            person.organization.locations[0].country
                          ].filter(Boolean).join(', ')}
                        </div>
                      )}
                    </div>
                  </td>
                  
                  <td className="p-3">
                    <Badge variant={
                      person.email_status === 'verified' ? 'default' :
                      person.email_status === 'likely' ? 'secondary' :
                      'destructive'
                    }>
                      {person.email_status || 'Unknown'}
                    </Badge>
                  </td>
                  
                  <td className="p-3">
                    <div className="space-y-1">
                      {person.seniority && (
                        <Badge variant="outline">{person.seniority}</Badge>
                      )}
                      {person.functions && person.functions.length > 0 && (
                        <div className="text-xs text-muted-foreground">
                          {person.functions.join(', ')}
                        </div>
                      )}
                    </div>
                  </td>
                  
                  <td className="p-3">
                    <div className="space-y-1">
                      {person.departments && person.departments.length > 0 && (
                        <div className="text-xs">
                          <div className="font-medium">Dept:</div>
                          {person.departments.join(', ')}
                        </div>
                      )}
                      {person.subdepartments && person.subdepartments.length > 0 && (
                        <div className="text-xs text-muted-foreground">
                          <div className="font-medium">Sub:</div>
                          {person.subdepartments.join(', ')}
                        </div>
                      )}
                    </div>
                  </td>
                  
                  <td className="p-3">
                    {person.phone_numbers && person.phone_numbers.length > 0 && (
                      <div className="space-y-1">
                        {person.phone_numbers.slice(0, 2).map((phone, idx) => (
                          <div key={idx} className="flex items-center gap-1 text-sm">
                            <Phone className="h-3 w-3" />
                            <span>{phone.raw_number}</span>
                            {phone.type && (
                              <Badge variant="outline" className="text-xs">
                                {phone.type}
                              </Badge>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </td>
                  
                  <td className="p-3">
                    {person.employment_history && person.employment_history.length > 0 && (
                      <div className="space-y-1 max-w-[180px]">
                        {person.employment_history.slice(0, 3).map((job, idx) => (
                          <div key={idx} className="text-xs">
                            <div className="font-medium">{job.title}</div>
                            <div className="text-muted-foreground">{job.organization_name}</div>
                            {job.start_date && (
                              <div className="text-muted-foreground">
                                {job.start_date} - {job.current ? 'Present' : job.end_date || 'Unknown'}
                              </div>
                            )}
                          </div>
                        ))}
                        {person.employment_history.length > 3 && (
                          <div className="text-xs text-muted-foreground">
                            +{person.employment_history.length - 3} more
                          </div>
                        )}
                      </div>
                    )}
                  </td>
                  
                  <td className="p-3">
                    <div className="flex flex-col gap-1">
                      {person.linkedin_url && (
                        <a href={person.linkedin_url} target="_blank" rel="noopener noreferrer" 
                           className="text-blue-600 hover:text-blue-800 text-xs">
                          <ExternalLink className="h-3 w-3 inline mr-1" />
                          LinkedIn
                        </a>
                      )}
                      {person.twitter_url && (
                        <a href={person.twitter_url} target="_blank" rel="noopener noreferrer"
                           className="text-blue-600 hover:text-blue-800 text-xs">
                          <ExternalLink className="h-3 w-3 inline mr-1" />
                          Twitter
                        </a>
                      )}
                      {person.github_url && (
                        <a href={person.github_url} target="_blank" rel="noopener noreferrer"
                           className="text-blue-600 hover:text-blue-800 text-xs">
                          <ExternalLink className="h-3 w-3 inline mr-1" />
                          GitHub
                        </a>
                      )}
                    </div>
                  </td>
                  
                  <td className="p-3">
                    <div className="flex flex-col gap-1">
                      <Button variant="outline" size="sm" className="text-xs h-7">
                        <UserIcon className="h-3 w-3 mr-1" />
                        View
                      </Button>
                      <Button variant="outline" size="sm" className="text-xs h-7">
                        <Mail className="h-3 w-3 mr-1" />
                        Contact
                      </Button>
                    </div>
                  </td>
                  <td className="p-3">
                    <Button
                      variant={isUserPremium ? 'default' : 'outline'}
                      size="sm"
                      className="text-xs h-7"
                      disabled={enrichingId === person.id}
                      onClick={() => handleEnrich(person, 'people')}
                    >
                      {enrichingId === person.id ? (
                        <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                      ) : (
                        <Trophy className="h-3 w-3 mr-1" />
                      )}
                      {isUserPremium ? 'Enrich Data' : 'Upgrade to Enrich'}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// Full Screen Company Table (optimized for large screens)
const FullScreenCompanyTable = ({ companies, isUserPremium, handleEnrich, enrichingId, selectedIds, handleSelectRow, handleSelectAll, handleBulkEnrich, maxBulk }: {
  companies: ApolloCompanyResult[],
  isUserPremium: boolean,
  handleEnrich: (row: any, type: 'people' | 'companies') => void,
  enrichingId: string | null,
  selectedIds: string[],
  handleSelectRow: (id: string) => void,
  handleSelectAll: (ids: string[]) => void,
  handleBulkEnrich: () => void,
  maxBulk: number
}) => {
  const allIds = companies.map(c => c.id)
  return (
    <div className="space-y-4 h-full flex flex-col">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-foreground">Company Results</h3>
        <div className="flex gap-2">
          {isUserPremium && (
            <Button
              onClick={handleBulkEnrich}
              disabled={selectedIds.length === 0 || selectedIds.length > maxBulk}
              variant="default"
              size="sm"
            >
              Bulk Enrich (max 10)
            </Button>
          )}
        </div>
      </div>
      <div className="border rounded-lg overflow-x-auto h-full">
        <div className="min-w-[1400px]">
          <table className="w-full text-sm border-collapse bg-card">
            <thead className="sticky top-0 bg-muted/80 backdrop-blur">
              <tr className="border-b">
                <th className="p-3 text-left font-medium min-w-[40px]">
                  <input
                    type="checkbox"
                    checked={selectedIds.length > 0 && selectedIds.length === allIds.length}
                    onChange={() => handleSelectAll(allIds)}
                  />
                </th>
                <th className="p-3 text-left font-medium min-w-[60px]">Logo</th>
                <th className="p-3 text-left font-medium min-w-[200px]">Company Info</th>
                <th className="p-3 text-left font-medium min-w-[180px]">Contact & Web</th>
                <th className="p-3 text-left font-medium min-w-[150px]">Location</th>
                <th className="p-3 text-left font-medium min-w-[120px]">Size & Revenue</th>
                <th className="p-3 text-left font-medium min-w-[100px]">Founded</th>
                <th className="p-3 text-left font-medium min-w-[150px]">Trading Info</th>
                <th className="p-3 text-left font-medium min-w-[200px]">Industry & Keywords</th>
                <th className="p-3 text-left font-medium min-w-[160px]">Funding Details</th>
                <th className="p-3 text-left font-medium min-w-[120px]">Actions</th>
                <th className="p-3 text-left font-medium min-w-[120px]">Enrich</th>
              </tr>
            </thead>
            <tbody>
              {companies.map((company, index) => (
                <tr key={company.id || index} className="border-b hover:bg-muted/30 transition-colors">
                  <td className="p-3">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(company.id)}
                      onChange={() => handleSelectRow(company.id)}
                      disabled={
                        !selectedIds.includes(company.id) && selectedIds.length >= maxBulk
                      }
                    />
                  </td>
                  <td className="p-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={company.logo_url} alt={company.name} />
                      <AvatarFallback>
                        <Building className="h-6 w-6" />
                      </AvatarFallback>
                    </Avatar>
                  </td>
                  
                  <td className="p-3">
                    <div className="space-y-1">
                      <div className="font-medium text-foreground">{company.name}</div>
                      {company.primary_domain && (
                        <div className="text-sm text-muted-foreground">{company.primary_domain}</div>
                      )}
                      {company.raw_address && (
                        <div className="text-xs text-muted-foreground max-w-[180px] truncate">
                          {company.raw_address}
                        </div>
                      )}
                    </div>
                  </td>
                  
                  <td className="p-3">
                    <div className="space-y-1">
                      {company.website_url && (
                        <div className="flex items-center gap-1 text-sm">
                          <Globe className="h-3 w-3" />
                          <a href={company.website_url} target="_blank" rel="noopener noreferrer" 
                             className="text-blue-600 hover:text-blue-800 truncate max-w-[150px]">
                            {company.website_url}
                          </a>
                        </div>
                      )}
                      {company.primary_phone && (
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Phone className="h-3 w-3" />
                          {company.primary_phone.number}
                        </div>
                      )}
                      {company.linkedin_url && (
                        <a href={company.linkedin_url} target="_blank" rel="noopener noreferrer"
                           className="text-blue-600 hover:text-blue-800 text-xs">
                          <ExternalLink className="h-3 w-3 inline mr-1" />
                          LinkedIn
                        </a>
                      )}
                    </div>
                  </td>
                  
                  <td className="p-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-sm">
                        <MapPin className="h-3 w-3" />
                        <span className="max-w-[130px] truncate">
                          {company.raw_address || 'Not specified'}
                        </span>
                      </div>
                      {company.retail_location_count && (
                        <div className="text-xs text-muted-foreground">
                          {company.retail_location_count} retail locations
                        </div>
                      )}
                    </div>
                  </td>
                  
                  <td className="p-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        <Badge variant="secondary" className="text-xs">
                          {company.organization_num_employees || company.estimated_num_employees || 'Unknown'} employees
                        </Badge>
                      </div>
                      {company.annual_revenue && (
                        <div className="flex items-center gap-1 text-sm">
                          <DollarSign className="h-3 w-3" />
                          <span className="text-green-600">
                            ${(company.annual_revenue / 1000000).toFixed(1)}M
                          </span>
                        </div>
                      )}
                    </div>
                  </td>
                  
                  <td className="p-3">
                    {company.founded_year && (
                      <div className="flex items-center gap-1 text-sm">
                        <Calendar className="h-3 w-3" />
                        <span>{company.founded_year}</span>
                      </div>
                    )}
                  </td>
                  
                  <td className="p-3">
                    <div className="space-y-1">
                      {company.publicly_traded_symbol && (
                        <div className="space-y-1">
                          <Badge variant="default" className="text-xs">
                            {company.publicly_traded_symbol}
                          </Badge>
                          {company.publicly_traded_exchange && (
                            <div className="text-xs text-muted-foreground">
                              {company.publicly_traded_exchange}
                            </div>
                          )}
                        </div>
                      )}
                      {!company.publicly_traded_symbol && (
                        <div className="text-xs text-muted-foreground">Private</div>
                      )}
                    </div>
                  </td>
                  
                  <td className="p-3">
                    <div className="space-y-1">
                      {company.industry && (
                        <div className="text-sm font-medium">{company.industry}</div>
                      )}
                      {company.subindustries && company.subindustries.length > 0 && (
                        <div className="text-xs text-muted-foreground">
                          {company.subindustries.slice(0, 2).join(', ')}
                          {company.subindustries.length > 2 && ` +${company.subindustries.length - 2}`}
                        </div>
                      )}
                      {company.keywords && company.keywords.length > 0 && (
                        <div className="text-xs text-muted-foreground">
                          Keywords: {company.keywords.slice(0, 3).join(', ')}
                          {company.keywords.length > 3 && ` +${company.keywords.length - 3}`}
                        </div>
                      )}
                    </div>
                  </td>
                  
                  <td className="p-3">
                    <div className="space-y-1">
                      {company.total_funding && (
                        <div className="flex items-center gap-1 text-sm">
                          <Trophy className="h-3 w-3" />
                          <span className="text-purple-600">
                            {company.total_funding_printed || `$${(company.total_funding / 1000000).toFixed(1)}M`}
                          </span>
                        </div>
                      )}
                      {company.latest_funding_stage && (
                        <Badge variant="outline" className="text-xs">
                          {company.latest_funding_stage}
                        </Badge>
                      )}
                      {company.latest_funding_round_date && (
                        <div className="text-xs text-muted-foreground">
                          {company.latest_funding_round_date}
                        </div>
                      )}
                    </div>
                  </td>
                  
                  <td className="p-3">
                    <div className="flex flex-col gap-1">
                      <Button variant="outline" size="sm" className="text-xs h-7">
                        <Building className="h-3 w-3 mr-1" />
                        View
                      </Button>
                      <Button variant="outline" size="sm" className="text-xs h-7">
                        <Mail className="h-3 w-3 mr-1" />
                        Contact
                      </Button>
                    </div>
                  </td>
                  <td className="p-3">
                    <Button
                      variant={isUserPremium ? 'default' : 'outline'}
                      size="sm"
                      className="text-xs h-7"
                      disabled={enrichingId === company.id}
                      onClick={() => handleEnrich(company, 'companies')}
                    >
                      {enrichingId === company.id ? (
                        <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                      ) : (
                        <Trophy className="h-3 w-3 mr-1" />
                      )}
                      {isUserPremium ? 'Enrich Data' : 'Upgrade to Enrich'}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

const FilterResults = ({ isUserPremium, user }: { isUserPremium: boolean, user: User | null }) => {
    const searchParams = useSearchParams()
    const params = useParams()
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState<ApolloSearchResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [creditsConsumed, setCreditsConsumed] = useState(0)
  const [remainingCredits, setRemainingCredits] = useState(user?.creditsAvailable || 0)
  const [showCreditModal, setShowCreditModal] = useState(false)
  const [showExportModal, setShowExportModal] = useState(false)
  const [pendingSearch, setPendingSearch] = useState<{ page: number; loadMore: boolean } | null>(null)
  const [isExporting, setIsExporting] = useState(false)
  const [enrichingId, setEnrichingId] = useState<string | null>(null)
  const [enrichedData, setEnrichedData] = useState<any>(null)
  const [showEnrichModal, setShowEnrichModal] = useState(false)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [pendingEnrich, setPendingEnrich] = useState<any>(null)
  const [enrichCost, setEnrichCost] = useState(5) // Example: 5 credits per enrichment
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [selectedCompanyIds, setSelectedCompanyIds] = useState<string[]>([])
  const MAX_BULK_ENRICH = 10;
  const CREDIT_PER_ENRICH = 5;

  console.log(enrichedData, showUpgradeModal )

  // Determine search type from URL
  const searchType = params.category?.toString().includes('companies') ? 'companies' : 'people'

  // Storage key for persisting results
  const storageKey = `apollo_results_${searchType}_${JSON.stringify(Array.from(searchParams.entries()))}`

  // Load persisted results on component mount
  useEffect(() => {
    try {
      const savedResults = localStorage.getItem(storageKey)
      if (savedResults) {
        const parsed = JSON.parse(savedResults)
        setResults(parsed.results)
        setCurrentPage(parsed.currentPage)
        setCreditsConsumed(parsed.creditsConsumed)
      }
    } catch (error) {
      console.error('Error loading saved results:', error)
    }
  }, [storageKey])

  // Save results to localStorage whenever they change
  useEffect(() => {
    if (results) {
      try {
        localStorage.setItem(storageKey, JSON.stringify({
          results,
          currentPage,
          creditsConsumed,
          timestamp: Date.now()
        }))
      } catch (error) {
        console.error('Error saving results:', error)
      }
    }
  }, [results, currentPage, creditsConsumed, storageKey])

  // Convert search params to object
    const allParams = Array.from(searchParams.entries()).reduce((acc, [key, value]) => {
        if (acc[key]) {
          if (Array.isArray(acc[key])) {
            acc[key].push(value);
          } else {
            acc[key] = [acc[key], value];
          }
        } else {
          acc[key] = value;
        }
        return acc;
    }, {} as Record<string, string | string[]>);
      
  // Estimate credit cost (approximate values based on Apollo pricing)
  const estimateSearchCost = () => {
    // Apollo typically charges 1 credit per search for most basic searches
    // More complex searches or enrichment may cost more
    return 1;
  }

  // Estimate credit cost for export (typically costs more than search)
  const estimateExportCost = () => {
    if (!results) return 0
    const totalResults = searchType === 'people' 
      ? (results.people?.length || 0)
      : (results.organizations?.length || 0)
    
    // Export typically costs 1 credit per 10 records (minimum 1 credit)
    return Math.max(1, Math.ceil(totalResults / 10))
  }

  const performSearch = async (page = 1, loadMore = false) => {
    if (!user) {
      toast.error('Please log in to search')
            return
        }

    // Show credit confirmation modal for new searches (not for load more)
    if (!loadMore) {
      setPendingSearch({ page, loadMore })
      setShowCreditModal(true)
      return
    }

    await executeSearch(page, loadMore)
  }

  const executeSearch = async (page = 1, loadMore = false) => {
    if (!user) {
      toast.error('Please log in to search')
      return
    }

    if (user.creditsAvailable <= 0) {
      toast.error('Insufficient credits. Please upgrade your plan.')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const endpoint = searchType === 'people' 
        ? '/api/apollo/people-search' 
        : '/api/apollo/company-search'

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...allParams,
          page,
          per_page: 25
        })
      })

      const responseData = await response.json()

      if (!response.ok) {
        throw new Error(responseData.error || 'Search failed')
      }

      if (loadMore && results) {
        // Append new results
        const newResults = { ...responseData.data }
        if (searchType === 'people') {
          newResults.people = [...(results.people || []), ...(newResults.people || [])]
        } else {
          newResults.organizations = [...(results.organizations || []), ...(newResults.organizations || [])]
        }
        setResults(newResults)
      } else {
        setResults(responseData.data)
      }

      setCreditsConsumed(prev => prev + responseData.creditsConsumed)
      setRemainingCredits(responseData.remainingCredits)
      setCurrentPage(page)

      toast.success(`Found ${responseData.data.pagination.total_entries} results. ${responseData.creditsConsumed} credits used.`)

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Search failed'
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreditConfirm = () => {
    setShowCreditModal(false)
    if (pendingSearch) {
      executeSearch(pendingSearch.page, pendingSearch.loadMore)
      setPendingSearch(null)
    }
  }

  const handleCreditCancel = () => {
    setShowCreditModal(false)
    setPendingSearch(null)
  }

  const handleLoadMore = () => {
    if (results && currentPage < results.pagination.total_pages) {
      // Load more doesn't need credit confirmation since user already confirmed the initial search
      executeSearch(currentPage + 1, true)
    }
  }

  const handleExportToExcel = async () => {
    if (!results || !user) {
      toast.error('No results to export or user not authenticated')
      return
    }

    const exportCost = estimateExportCost()
    if (user.creditsAvailable < exportCost) {
      toast.error('Insufficient credits for export')
      return
    }

    setShowExportModal(true)
  }

  const executeExport = async () => {
    if (!results || !user) return

    setIsExporting(true)
    setShowExportModal(false)

    try {
      const exportCost = estimateExportCost()
      
      // Update user credits
      await fetch('/api/user/update-credits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ creditsToDeduct: exportCost })
      })

      // Prepare data for export
      const dataToExport = searchType === 'people' 
        ? results.people?.map(person => ({
            Name: person.name,
            Email: person.email,
            'Email Status': person.email_status,
            Title: person.title,
            Company: person.organization?.name,
            'Company Website': person.organization?.website_url,
            Location: [person.city, person.state, person.country].filter(Boolean).join(', '),
            Seniority: person.seniority,
            Departments: person.departments?.join(', '),
            'Phone Numbers': person.phone_numbers?.map(p => p.raw_number).join(', '),
            LinkedIn: person.linkedin_url,
            Headline: person.headline
          }))
        : results.organizations?.map(company => ({
            'Company Name': company.name,
            Domain: company.primary_domain,
            Website: company.website_url,
            Industry: company.industry,
            'Employee Count': company.organization_num_employees || company.estimated_num_employees,
            'Annual Revenue': company.annual_revenue,
            'Founded Year': company.founded_year,
            Location: company.raw_address,
            'Trading Symbol': company.publicly_traded_symbol,
            'Trading Exchange': company.publicly_traded_exchange,
            'Total Funding': company.total_funding_printed,
            'Latest Funding Stage': company.latest_funding_stage,
            LinkedIn: company.linkedin_url,
            Phone: company.primary_phone?.number,
            Keywords: company.keywords?.join(', ')
          }))

      // Create CSV content
      if (dataToExport && dataToExport.length > 0) {
        const headers = Object.keys(dataToExport[0])
        const csvContent = [
          headers.join(','),
          ...dataToExport.map(row => 
            headers.map(header => `"${(row as any)[header] || ''}"`).join(',')
          )
        ].join('\n')

        // Create and download file
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
        const link = document.createElement('a')
        const url = URL.createObjectURL(blob)
        link.setAttribute('href', url)
        link.setAttribute('download', `apollo_${searchType}_export_${new Date().toISOString().split('T')[0]}.csv`)
        link.style.visibility = 'hidden'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)

        // Update remaining credits
        setRemainingCredits(prev => Math.max(0, prev - exportCost))
        
        toast.success(`Export completed! ${exportCost} credits used.`)
      } else {
        toast.error('No data available for export')
      }

    } catch (error) {
      console.error('Export error:', error)
      toast.error('Export failed. Please try again.')
    } finally {
      setIsExporting(false)
    }
  }

  // Handler for enrichment
  const handleEnrich = (row: any, type: 'people' | 'companies') => {
    if (!isUserPremium) {
      setShowUpgradeModal(true)
            return
        }
    setPendingEnrich({ row, type })
    setShowEnrichModal(true)
  }

  // Confirm enrichment (deduct credits, call API, show result)
  const confirmEnrich = async () => {
    if (!pendingEnrich || !user) return
    setShowEnrichModal(false)
    setEnrichingId(pendingEnrich.row.id)
    try {
      // Deduct credits first (simulate or call your API)
      const res = await fetch('/api/user/update-credits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ creditsToDeduct: enrichCost })
      })
      const creditData = await res.json()
      if (!res.ok) throw new Error(creditData.error || 'Credit deduction failed')
      // Call enrichment API (mocked here)
      const enrichRes = await fetch(`/api/apollo/enrich`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: pendingEnrich.row.id, type: pendingEnrich.type })
      })
      const enrichData = await enrichRes.json()
      if (!enrichRes.ok) throw new Error(enrichData.error || 'Enrichment failed')
      setEnrichedData(enrichData.data)
      toast.success('Data enriched!')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Enrichment failed')
    } finally {
      setEnrichingId(null)
      setPendingEnrich(null)
    }
  }

  // Handler for selecting/deselecting a row
  const handleSelectRow = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id)
        ? prev.filter(x => x !== id)
        : prev.length < MAX_BULK_ENRICH
          ? [...prev, id]
          : prev
    )
  }
  // Handler for select all (up to 10)
  const handleSelectAll = (ids: string[]) => {
    if (selectedIds.length === ids.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(ids.slice(0, MAX_BULK_ENRICH))
    }
  }
  // Handler for bulk enrich
  const [showBulkEnrichModal, setShowBulkEnrichModal] = useState(false)
  const [bulkEnriching, setBulkEnriching] = useState(false)
  const [bulkEnrichedData, setBulkEnrichedData] = useState<any>(null)

  console.log(bulkEnrichedData, showBulkEnrichModal, bulkEnriching)
  
  const handleBulkEnrich = () => {
    setShowBulkEnrichModal(true)
  }
  const confirmBulkEnrich = async () => {
    setShowBulkEnrichModal(false)
    setBulkEnriching(true)
    try {
      // Get selected people rows
      const selectedRows = (results?.people || []).filter(p => selectedIds.includes(p.id))
      // Deduct credits
      const res = await fetch('/api/user/update-credits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ creditsToDeduct: CREDIT_PER_ENRICH * selectedRows.length })
      })
      const creditData = await res.json()
      if (!res.ok) throw new Error(creditData.error || 'Credit deduction failed')
      // Call Apollo bulk enrichment API (mocked here)
      const enrichRes = await fetch(`/api/apollo/bulk-enrich`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'people', records: selectedRows })
      })
      const enrichData = await enrichRes.json()
      if (!enrichRes.ok) throw new Error(enrichData.error || 'Bulk enrichment failed')
      setBulkEnrichedData(enrichData.data)
      toast.success('Bulk enrichment complete!')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Bulk enrichment failed')
    } finally {
      setBulkEnriching(false)
      setSelectedIds([])
    }
  }

  // // Handler for selecting/deselecting a company row
  // const handleSelectCompanyRow = (id: string) => {
  //   setSelectedCompanyIds(prev =>
  //     prev.includes(id)
  //       ? prev.filter(x => x !== id)
  //       : prev.length < MAX_BULK_ENRICH
  //         ? [...prev, id]
  //         : prev
  //   )
  // }
  // // Handler for select all companies (up to 10)
  // const handleSelectAllCompanies = (ids: string[]) => {
  //   if (selectedCompanyIds.length === ids.length) {
  //     setSelectedCompanyIds([])
  //   } else {
  //     setSelectedCompanyIds(ids.slice(0, MAX_BULK_ENRICH))
  //   }
  // }
  // Handler for bulk enrich companies
  const [showBulkCompanyEnrichModal, setShowBulkCompanyEnrichModal] = useState(false)
  const [bulkCompanyEnriching, setBulkCompanyEnriching] = useState(false)
  const [bulkCompanyEnrichedData, setBulkCompanyEnrichedData] = useState<any>(null)

  // const handleBulkCompanyEnrich = () => {
  //   setShowBulkCompanyEnrichModal(true)
  // }

  useEffect(() => {
    setEnrichCost(3)
  }, [])

  console.log(bulkCompanyEnrichedData, showBulkCompanyEnrichModal, bulkCompanyEnriching)

  const confirmBulkCompanyEnrich = async () => {
    setShowBulkCompanyEnrichModal(false)
    setBulkCompanyEnriching(true)
    try {
      // Get selected company rows
      const selectedRows = (results?.organizations || []).filter(c => selectedCompanyIds.includes(c.id))
      // Deduct credits
      const res = await fetch('/api/user/update-credits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ creditsToDeduct: CREDIT_PER_ENRICH * selectedCompanyIds.length })
      })
      const creditData = await res.json()
      if (!res.ok) throw new Error(creditData.error || 'Credit deduction failed')
      // Call Apollo bulk enrichment API
      const enrichRes = await fetch(`/api/apollo/bulk-enrich`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'companies', records: selectedRows })
      })
      const enrichData = await enrichRes.json()
      if (!enrichRes.ok) throw new Error(enrichData.error || 'Bulk enrichment failed')
      setBulkCompanyEnrichedData(enrichData.data)
      toast.success('Bulk company enrichment complete!')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Bulk enrichment failed')
    } finally {
      setBulkCompanyEnriching(false)
      setSelectedCompanyIds([])
    }
  }

  const hasFilters = Object.keys(allParams).length > 0
  const hasMore = results && currentPage < results.pagination.total_pages

  // Update remaining credits when user prop changes
  useEffect(() => {
    if (user) {
      setRemainingCredits(user.creditsAvailable)
    }
  }, [user])

    return (
    <div className="h-full flex flex-col space-y-6">
      {/* Credit Usage Modal */}
      <CreditUsageModal
        isOpen={showCreditModal}
        onClose={handleCreditCancel}
        onConfirm={handleCreditConfirm}
        searchType={searchType}
        estimatedCost={estimateSearchCost()}
        remainingCredits={remainingCredits}
      />

      {/* Export Confirmation Modal */}
      <Dialog open={showExportModal} onOpenChange={setShowExportModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Download className="h-5 w-5 text-primary" />
              Confirm Excel Export
            </DialogTitle>
            <DialogDescription className="space-y-3">
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-blue-800 dark:text-blue-200">
                    <strong>Export {searchType} results</strong> will consume credits from your account.
                  </div>
                </div>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Records to export:</span>
                  <span className="font-medium">
                    {searchType === 'people' 
                      ? (results?.people?.length || 0)
                      : (results?.organizations?.length || 0)
                    }
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Export cost:</span>
                  <span className="font-medium">{estimateExportCost()} credits</span>
                </div>
                <div className="flex justify-between">
                  <span>Available credits:</span>
                  <span className={`font-medium ${remainingCredits < estimateExportCost() ? 'text-red-600' : 'text-green-600'}`}>
                    {remainingCredits}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span>After export:</span>
                  <span className={`font-medium ${remainingCredits - estimateExportCost() < 0 ? 'text-red-600' : 'text-foreground'}`}>
                    {Math.max(0, remainingCredits - estimateExportCost())} credits remaining
                  </span>
                </div>
              </div>

              {remainingCredits < estimateExportCost() && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-red-800 dark:text-red-200">
                      <strong>Insufficient credits!</strong> Please upgrade your plan or purchase more credits.
                    </div>
                  </div>
                </div>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowExportModal(false)}>
              Cancel
                    </Button>
            <Button 
              onClick={executeExport} 
              disabled={remainingCredits < estimateExportCost() || isExporting}
              className="min-w-24"
            >
              {isExporting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Exporting...
                </>
              ) : remainingCredits < estimateExportCost() ? (
                'Insufficient Credits'
              ) : (
                'Confirm Export'
              )}
                    </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Enrich Confirmation Modal */}
      <Dialog open={showEnrichModal} onOpenChange={setShowEnrichModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-primary" />
              Confirm Enrichment
            </DialogTitle>
            <DialogDescription className="space-y-3">
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-green-800 dark:text-green-200">
                    <strong>Enrich {searchType} data</strong> will consume credits from your account.
                </div>
            </div>
        </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Enrich cost:</span>
                  <span className="font-medium">{enrichCost} credits</span>
                </div>
                <div className="flex justify-between">
                  <span>Available credits:</span>
                  <span className={`font-medium ${remainingCredits < enrichCost ? 'text-red-600' : 'text-green-600'}`}>
                    {remainingCredits}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span>After enrichment:</span>
                  <span className={`font-medium ${remainingCredits - enrichCost < 0 ? 'text-red-600' : 'text-foreground'}`}>
                    {Math.max(0, remainingCredits - enrichCost)} credits remaining
                  </span>
                </div>
              </div>

              {remainingCredits < enrichCost && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-red-800 dark:text-red-200">
                      <strong>Insufficient credits!</strong> Please upgrade your plan or purchase more credits.
                    </div>
                  </div>
                </div>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowEnrichModal(false)}>
              Cancel
                    </Button>
            <Button 
              onClick={confirmEnrich} 
              disabled={remainingCredits < enrichCost || isExporting}
              className="min-w-24"
            >
              {isExporting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Enriching...
                </>
              ) : remainingCredits < enrichCost ? (
                'Insufficient Credits'
              ) : (
                'Confirm Enrichment'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Search Controls */}
      <div className="flex-shrink-0">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Search className="h-5 w-5" />
              Leadfume {searchType === 'people' ? 'People' : 'Company'} Search
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                {hasFilters ? 'Apply filters and click search to find results' : 'Select filters to start searching'}
                </div>
              <Badge variant="secondary" className="text-xs">
                Available Credits: {remainingCredits}
              </Badge>
            </div>

            {hasFilters && (
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-2">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-blue-800 dark:text-blue-200">
                    <strong>Ready to search:</strong> {Object.keys(allParams).length} filters applied. 
                    Estimated cost: ~{estimateSearchCost()} credits per search.
        </div>
                </div>
              </div>
            )}
            
            <div className="flex gap-2">
              <Button 
                onClick={() => performSearch(1)} 
                disabled={isLoading || !hasFilters}
                className="min-w-32"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="h-4 w-4 mr-2" />
                    Search Leadfume
                  </>
                )}
                    </Button>
              
              {results && (
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setResults(null)
                    setError(null)
                    setCreditsConsumed(0)
                    setCurrentPage(1)
                    // Clear localStorage
                    localStorage.removeItem(storageKey)
                  }}
                  size="sm"
                >
                  Clear Results
                </Button>
              )}
                </div>

          </CardContent>
        </Card>
      </div>

      {/* Search Results - Constrained container with both vertical and horizontal scroll */}
      <div className="flex-1 min-h-0 overflow-hidden">
        <div className="h-full overflow-y-auto overflow-x-hidden">
          <SearchResults
            results={results}
            searchType={searchType}
            isLoading={isLoading}
            error={error}
            onLoadMore={handleLoadMore}
            onExport={handleExportToExcel}
            hasMore={!!hasMore}
            creditsConsumed={creditsConsumed}
            remainingCredits={remainingCredits}
            isUserPremium={isUserPremium}
            handleEnrich={handleEnrich}
            enrichingId={enrichingId}
            selectedIds={selectedIds}
            handleSelectRow={handleSelectRow}
            handleSelectAll={handleSelectAll}
            handleBulkEnrich={handleBulkEnrich}
            maxBulk={MAX_BULK_ENRICH}
          />
        </div>
      </div>

      {/* Bulk Enrich Confirmation Modal */}
      <Dialog open={showBulkEnrichModal} onOpenChange={setShowBulkEnrichModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-primary" />
              Confirm Bulk Enrichment
            </DialogTitle>
            <DialogDescription className="space-y-3">
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-green-800 dark:text-green-200">
                    <strong>Bulk enrich</strong> {selectedIds.length} people. This will consume credits from your account.
                  </div>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Records to enrich:</span>
                  <span className="font-medium">{selectedIds.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total cost:</span>
                  <span className="font-medium">{CREDIT_PER_ENRICH * selectedIds.length} credits</span>
                </div>
                <div className="flex justify-between">
                  <span>Available credits:</span>
                  <span className={`font-medium ${remainingCredits < CREDIT_PER_ENRICH * selectedIds.length ? 'text-red-600' : 'text-green-600'}`}>{remainingCredits}</span>
                </div>
              </div>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowBulkEnrichModal(false)}>
              Cancel
            </Button>
            <Button
              onClick={confirmBulkEnrich}
              disabled={remainingCredits < CREDIT_PER_ENRICH * selectedIds.length || bulkEnriching}
              className="min-w-24"
            >
              {bulkEnriching ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Enriching...
                </>
              ) : remainingCredits < CREDIT_PER_ENRICH * selectedIds.length ? (
                'Insufficient Credits'
              ) : (
                'Confirm Enrich'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showBulkCompanyEnrichModal} onOpenChange={setShowBulkCompanyEnrichModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-primary" />
              Confirm Bulk Company Enrichment
            </DialogTitle>
            <DialogDescription className="space-y-3">
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-green-800 dark:text-green-200">
                    <strong>Bulk enrich</strong> {selectedCompanyIds.length} companies. This will consume credits from your account.
                  </div>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Records to enrich:</span>
                  <span className="font-medium">{selectedCompanyIds.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total cost:</span>
                  <span className="font-medium">{CREDIT_PER_ENRICH * selectedCompanyIds.length} credits</span>
                </div>
                <div className="flex justify-between">
                  <span>Available credits:</span>
                  <span className={`font-medium ${remainingCredits < CREDIT_PER_ENRICH * selectedCompanyIds.length ? 'text-red-600' : 'text-green-600'}`}>{remainingCredits}</span>
                </div>
              </div>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowBulkCompanyEnrichModal(false)}>
              Cancel
            </Button>
            <Button
              onClick={confirmBulkCompanyEnrich}
              disabled={remainingCredits < CREDIT_PER_ENRICH * selectedCompanyIds.length || bulkCompanyEnriching}
              className="min-w-24"
            >
              {bulkCompanyEnriching ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Enriching...
                </>
              ) : remainingCredits < CREDIT_PER_ENRICH * selectedCompanyIds.length ? (
                'Insufficient Credits'
              ) : (
                'Confirm Enrich'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
            </div>
        )
}

export default FilterResults