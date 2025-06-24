# Apollo API Integration

This document outlines the Apollo API integration implementation for the Leadfume application.

## Overview

The Apollo integration provides real-time people and company search functionality using the Apollo.io API. It includes proper credit management, error handling, responsive UI components, and **mandatory credit usage confirmation** before executing searches.

## Key Features

### ✅ **Credit Protection & Confirmation**
- **Mandatory Credit Confirmation Modal**: Users must explicitly confirm credit usage before any search
- **Real-time Credit Tracking**: Shows available credits and estimated costs
- **Insufficient Credits Protection**: Prevents searches when credits are insufficient
- **Cost Transparency**: Clear display of costs before and after searches
- **No Auto-Search**: Filters only update URL parameters, searches require explicit user action

### ✅ **Comprehensive Data Display**
- **Table-Based Results**: All search results displayed in comprehensive tables
- **Maximum Field Coverage**: Shows all available Apollo API response fields
- **People Results Include**: Photo, name, title, contact info, company details, location, seniority, departments, employment history, actions
- **Company Results Include**: Logo, company info, contact/web details, location, size/revenue, founded year, trading info, industry/keywords, funding details, actions
- **Responsive Tables**: Horizontal scrolling for wide data tables
- **Sortable Columns**: Easy data organization and filtering
- **Export Ready**: All displayed data ready for export functionality

### ✅ **Apollo API Integration**
1. **People Search Integration**
   - Apollo People Search API endpoint (`/api/apollo/people-search`)
   - Real-time search with proper filter mapping
   - Email status verification
   - Job title and location filtering
   - Organization data integration

2. **Company Search Integration**
   - Apollo Organization Search API endpoint (`/api/apollo/company-search`)
   - Company size and location filtering
   - Industry and keyword search
   - Revenue and funding information

3. **Filter Integrity**
   - Accurate parameter mapping to Apollo API format
   - URL parameter preservation without auto-triggering searches
   - Filter state management
   - Search type detection (people vs companies)

4. **UI/UX Components**
   - Modern search results display with cards
   - Avatar and logo support
   - Responsive layouts for all devices
   - Loading states and comprehensive error handling
   - Pagination with "Load More" functionality
   - Credit usage warnings and confirmations

## API Endpoints

### People Search
- **Endpoint:** `/api/apollo/people-search`
- **Method:** POST
- **Apollo API:** `https://api.apollo.io/api/v1/mixed_people/search`

### Company Search
- **Endpoint:** `/api/apollo/company-search`
- **Method:** POST
- **Apollo API:** `https://api.apollo.io/api/v1/mixed_companies/search`

## Environment Configuration

Add the following to your `.env.local` file:

```env
APOLLO_API_KEY="your_apollo_api_key_here"
```

## Filter Parameter Mapping

Based on Apollo API documentation, our internal parameters are mapped as follows:

### People Search Parameters
| Internal Parameter | Apollo API Parameter | Apollo Format | Description |
|-------------------|---------------------|---------------|-------------|
| `contactEmailStatusV2[]` | `contact_email_status` | Array | Email verification status |
| `personTitles[]` | `person_titles` | Array | Job titles |
| `personLocations[]` | `person_locations` | Array | Person locations |
| `personSeniorities[]` | `person_seniorities` | Array | Job seniority levels |
| `organizationLocations[]` | `organization_locations` | Array | Company locations |
| `organizationIds[]` | `organization_ids` | Array | Specific organization IDs |
| `organizationNotIds[]` | `organization_not_ids` | Array | Excluded organization IDs |
| `organizationNumEmployeesRanges[]` | `organization_num_employees_ranges` | Array | Employee count ranges |
| `qOrganizationKeywordTags[]` | `q_organization_keyword_tags` | Array | Industry keywords |
| `personDepartmentOrSubdepartments[]` | `person_department_or_subdepartments` | Array | Person departments |

### Company Search Parameters
| Internal Parameter | Apollo API Parameter | Apollo Format | Description |
|-------------------|---------------------|---------------|-------------|
| `organizationNumEmployeesRanges[]` | `organization_num_employees_ranges` | Array | Employee count ranges (e.g., "1,10") |
| `organizationLocations[]` | `organization_locations` | Array | Company locations |
| `organizationNotLocations[]` | `organization_not_locations` | Array | Excluded locations |
| `qOrganizationKeywordTags[]` | `q_organization_keyword_tags` | Array | Industry keywords |
| `qOrganizationName` | `q_organization_name` | String | Company name search |
| `organizationIds[]` | `organization_ids` | Array | Specific organization IDs |
| `organizationNotIds[]` | `organization_not_ids` | Array | Excluded organization IDs |
| `organizationTechnologySlugs[]` | `organization_technology_slugs` | Array | Technology stack |
| `organizationRevenueRanges[]` | `organization_revenue_ranges` | Array | Revenue ranges |
| `organizationFoundedYearRanges[]` | `organization_founded_year_ranges` | Array | Founded year ranges |

**Note:** Apollo API expects array parameters without the `[]` brackets in the parameter names when sending the request body. The transformation is handled automatically by our API routes.

## User Flow

### 1. **Filter Application (No Auto-Search)**
- Users apply filters via sidebar components
- Filters update URL parameters only
- No automatic search execution
- Filter state preserved in URL

### 2. **Search Initiation**
- User clicks "Search Apollo" button
- Credit usage confirmation modal appears
- Shows estimated cost and remaining credits
- User must explicitly confirm to proceed

### 3. **Credit Confirmation Modal**
- **Estimated Cost**: Shows approximate credits needed
- **Available Credits**: Current user credit balance
- **After Search**: Projected remaining credits
- **Insufficient Credits Warning**: Prevents search if credits too low
- **Cancel/Confirm Options**: User choice required

### 4. **Search Execution**
- Only proceeds after user confirmation
- Real-time credit deduction
- Results displayed in modern card layout
- Pagination with "Load More" (no additional confirmation needed)

## Navigation Structure Verification

The navigation structure in `app/config/navigation.ts` correctly maps to filter options:

### People Category
- `/dashboard/people/email-status` → Email Status Filter ✅
- `/dashboard/people/job-title` → Job Title Filter ✅
- `/dashboard/people/company` → Company Filter ✅
- `/dashboard/people/employees` → Employee Filter ✅
- `/dashboard/people/industry` → Industry & Keywords Filter ✅
- `/dashboard/people/location` → Location Filter ✅

### Companies Category
- `/dashboard/companies/company` → Company Filter ✅
- `/dashboard/companies/account-location` → Account Location Filter ✅
- `/dashboard/companies/employees` → Employee Filter ✅
- `/dashboard/companies/industry` → Industry & Keywords Filter ✅

## Error Handling

- **Insufficient Credits**: Modal prevents search execution
- **API Errors**: Detailed error messages with status codes
- **Authentication**: Requires user login via Clerk
- **Rate Limiting**: Respects Apollo API limits
- **Network Issues**: Graceful error display and retry options

## Credit Usage System

### Credit Consumption
- **People Search**: ~1 credit per search (estimated)
- **Company Search**: ~1 credit per search (estimated)
- **Load More**: Additional credits for pagination
- **Real-time Tracking**: Immediate credit balance updates

### Credit Protection
- **Pre-search Confirmation**: Required for all new searches
- **Insufficient Credits Block**: Prevents unauthorized searches  
- **Premium Requirements**: Apollo features require subscription
- **Credit Balance Display**: Always visible to users

## Security Features

- **API Key Protection**: Stored securely in environment variables
- **User Authentication**: Clerk-based authentication required
- **Credit Validation**: Server-side credit checking
- **Input Sanitization**: Proper parameter validation
- **Rate Limiting**: Respects Apollo API guidelines

## Performance Optimizations

- **Background Search Execution**: Non-blocking UI
- **Optimistic UI Updates**: Immediate feedback
- **Efficient Pagination**: Load more functionality
- **Responsive Design**: Works on all devices
- **Loading States**: Clear user feedback
- **Error Boundaries**: Graceful failure handling

## Future Enhancements

- **Export Functionality**: CSV, JSON export options
- **Saved Searches**: Bookmark frequent searches
- **Advanced Filtering**: More sophisticated filter combinations
- **Bulk Operations**: Process multiple records
- **Analytics Dashboard**: Usage and performance metrics
- **Credit Packages**: Purchase additional credits
- **Search History**: Track previous searches

## Testing

To test the Apollo integration:

1. **Set up Apollo API Key** in `.env.local`
2. **Navigate to Dashboard** (`/dashboard/people/email-status`)
3. **Apply Filters** using sidebar (no automatic search)
4. **Click "Search Apollo"** button
5. **Confirm Credit Usage** in modal dialog
6. **Review Results** in card layout
7. **Test Pagination** with "Load More" button

## Compliance

- **Apollo API Guidelines**: Follows official documentation
- **Credit Usage Transparency**: Clear cost communication
- **User Consent**: Explicit confirmation required
- **Data Protection**: Secure handling of search results
- **Rate Limiting**: Respects API constraints 