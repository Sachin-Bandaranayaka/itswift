# Contact Form Setup Guide

This guide explains how to set up the contact form functionality that allows users to submit contact requests through a separate contact page, and enables admins to view and manage these submissions.

## Features Implemented

### 1. Separate Contact Page
- **URL**: `/contact`
- **Location**: `app/contact/page.tsx`
- **Features**:
  - Professional contact form with validation
  - Company information display
  - Responsive design
  - Success/error handling
  - Form submission to API

### 2. Contact Form API
- **Endpoint**: `/api/contact`
- **Location**: `app/api/contact/route.ts`
- **Features**:
  - Form validation (required fields, email format)
  - Database storage
  - Error handling
  - JSON response

### 3. Admin Panel Integration
- **URL**: `/admin/contacts`
- **Location**: `app/admin/contacts/page.tsx`
- **Features**:
  - View all contact submissions
  - Filter by status (New, In Progress, Resolved, Closed)
  - Update submission status
  - Add/edit notes
  - Contact details view
  - Email/phone click-to-contact

### 4. Navigation Updates
- Updated navbar to point to `/contact` instead of `/#contact`
- Added "Contacts" section to admin sidebar
- Updated all internal links to use new contact page

## Database Setup

### Required Table: `contact_submissions`

You need to create this table in your Supabase database. Run this SQL in the Supabase SQL Editor:

```sql
-- Create contact_submissions table
CREATE TABLE contact_submissions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100),
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    company VARCHAR(200),
    message TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'new' CHECK (status IN ('new', 'in_progress', 'resolved', 'closed')),
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    responded_at TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_contact_submissions_status ON contact_submissions(status);
CREATE INDEX idx_contact_submissions_submitted_at ON contact_submissions(submitted_at DESC);
CREATE INDEX idx_contact_submissions_email ON contact_submissions(email);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_contact_submissions_updated_at 
    BEFORE UPDATE ON contact_submissions 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
```

## Testing

### 1. Test the Contact Form
1. Start your development server: `npm run dev`
2. Navigate to `http://localhost:3000/contact`
3. Fill out and submit the contact form
4. Verify success message appears

### 2. Test the Admin Panel
1. Navigate to `http://localhost:3000/admin/contacts`
2. Verify contact submissions appear
3. Test status updates and notes functionality

### 3. API Testing
You can test the API directly using the provided test script:

```bash
node test-contact-api.js
```

## File Structure

```
├── app/
│   ├── contact/
│   │   └── page.tsx                 # Contact page
│   ├── api/
│   │   └── contact/
│   │       └── route.ts             # Contact API endpoint
│   └── admin/
│       └── contacts/
│           └── page.tsx             # Admin contacts page
├── components/
│   ├── navbar.tsx                   # Updated navigation
│   └── admin/
│       └── admin-sidebar.tsx        # Updated admin navigation
├── lib/
│   └── supabase.ts                  # Updated database types
└── scripts/
    ├── create-contact-submissions-table.sql
    ├── run-contact-migration.js
    └── create-contact-table-simple.js
```

## Environment Variables

Ensure these environment variables are set in your `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

## Usage

### For Users
1. Click "Contact Us" in the navigation
2. Fill out the contact form with required information
3. Submit the form
4. Receive confirmation message

### For Admins
1. Access the admin panel at `/admin`
2. Navigate to "Contacts" in the sidebar
3. View all contact submissions
4. Filter by status or search
5. Click on a submission to view details
6. Update status and add notes as needed
7. Use email/phone links to contact customers directly

## Status Workflow

The contact submissions follow this status workflow:

1. **New** - Initial submission
2. **In Progress** - Admin is working on the inquiry
3. **Resolved** - Issue has been resolved
4. **Closed** - Inquiry is complete and closed

## Security Considerations

- Form validation on both client and server side
- Email format validation
- Required field validation
- Database constraints to ensure data integrity
- Admin-only access to contact management

## Future Enhancements

Potential improvements you could add:

1. **Email Notifications**: Send email alerts when new contacts are submitted
2. **Auto-responder**: Send confirmation emails to users
3. **Export Functionality**: Export contact data to CSV
4. **Advanced Filtering**: Filter by date range, company, etc.
5. **Response Templates**: Pre-defined response templates
6. **Integration**: Connect with CRM systems
7. **Analytics**: Track response times and resolution rates

## Troubleshooting

### Common Issues

1. **Table doesn't exist**: Make sure you've run the SQL to create the `contact_submissions` table
2. **API errors**: Check your Supabase environment variables
3. **Admin access**: Ensure you have proper authentication for admin routes
4. **Form not submitting**: Check browser console for JavaScript errors

### Verification Steps

1. Check if table exists in Supabase dashboard
2. Verify environment variables are loaded
3. Test API endpoint directly
4. Check browser network tab for API calls
5. Review server logs for errors