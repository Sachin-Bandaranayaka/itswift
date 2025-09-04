# Design Document

## Overview

The database connection issue is caused by incorrect usage of the Supabase client across multiple service files. The services are importing `getSupabaseAdmin` function correctly but then attempting to use `supabaseAdmin` as a direct variable instead of calling the function. This creates a reference error because `supabaseAdmin` is not exported as a variable - only the getter function `getSupabaseAdmin()` is available.

## Architecture

### Current Problem Pattern

```typescript
// ❌ INCORRECT - This is what's currently happening
import { getSupabaseAdmin } from '@/lib/supabase';

// Later in the code:
const { data, error } = await supabaseAdmin  // ❌ supabaseAdmin is undefined
  .from('table_name')
  .select('*');
```

### Correct Pattern

```typescript
// ✅ CORRECT - This is what should happen
import { getSupabaseAdmin } from '@/lib/supabase';

// Later in the code:
const supabaseAdmin = getSupabaseAdmin();  // ✅ Call the function
const { data, error } = await supabaseAdmin
  .from('table_name')
  .select('*');
```

### Alternative Pattern (More Efficient)

```typescript
// ✅ ALSO CORRECT - Direct function call
import { getSupabaseAdmin } from '@/lib/supabase';

// Later in the code:
const { data, error } = await getSupabaseAdmin()  // ✅ Direct function call
  .from('table_name')
  .select('*');
```

## Components and Interfaces

### Affected Files

The following files need to be updated to use the correct pattern:

1. **lib/services/newsletter-data.ts** - Multiple instances of `supabaseAdmin` usage
2. **lib/services/social-data.ts** - Multiple instances of `supabaseAdmin` usage  
3. **lib/services/ai-usage-data.ts** - Multiple instances of `supabaseAdmin` usage
4. **lib/database/services/social-posts.ts** - Multiple instances of `supabaseAdmin` usage
5. **lib/database/services/ai-content-log.ts** - Multiple instances of `supabaseAdmin` usage

### Fix Strategy

For each affected file, we need to:

1. **Option A: Initialize at function level**
   ```typescript
   async someFunction() {
     const supabaseAdmin = getSupabaseAdmin();
     const { data, error } = await supabaseAdmin.from('table').select('*');
   }
   ```

2. **Option B: Direct function calls**
   ```typescript
   async someFunction() {
     const { data, error } = await getSupabaseAdmin().from('table').select('*');
   }
   ```

We'll use **Option A** for better readability when there are multiple database operations in the same function, and **Option B** for single operations.

## Data Models

No changes to data models are required. The existing database schema and TypeScript interfaces remain the same.

## Error Handling

### Current Error State
- Build succeeds but runtime errors occur
- API endpoints return 500 errors due to undefined `supabaseAdmin`
- Dashboard fails to load data

### After Fix
- Clean builds with no reference errors
- API endpoints return proper data or handled errors
- Dashboard loads successfully with real data

## Testing Strategy

### Verification Steps

1. **Build Test**: Run `npm run build` to ensure no reference errors
2. **Runtime Test**: Start the development server and test API endpoints
3. **Dashboard Test**: Access admin dashboard and verify data loads
4. **Function Test**: Test each major function (social posts, newsletters, AI logs)

### Test Cases

1. **Social Media Management**
   - Create a social post
   - View scheduled posts
   - Check social analytics

2. **Newsletter Management**
   - View subscriber list
   - Check newsletter campaigns
   - View newsletter analytics

3. **AI Content Generation**
   - Generate content with AI
   - View AI usage statistics
   - Check AI activity logs

## Implementation Approach

### Phase 1: Core Service Files
Fix the main service files that handle data operations:
- `lib/services/newsletter-data.ts`
- `lib/services/social-data.ts`
- `lib/services/ai-usage-data.ts`

### Phase 2: Database Service Layer
Fix the database service layer files:
- `lib/database/services/social-posts.ts`
- `lib/database/services/ai-content-log.ts`

### Phase 3: Verification
- Run build tests
- Test all API endpoints
- Verify dashboard functionality

## Security Considerations

No security changes are required. The fix maintains the same security model:
- Server-side operations use the admin client with service role key
- Client-side operations use the regular client with anon key
- Row Level Security (RLS) policies remain unchanged

## Performance Impact

The fix will have minimal performance impact:
- Function calls are lightweight
- Lazy initialization is preserved
- No additional database connections are created
- Memory usage remains the same