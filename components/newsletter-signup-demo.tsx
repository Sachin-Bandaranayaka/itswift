"use client"

import { NewsletterSignup } from "./newsletter-signup"

export function NewsletterSignupDemo() {
  return (
    <div className="space-y-8 p-8">
      <div>
        <h2 className="text-2xl font-bold mb-4">Newsletter Signup Component Demo</h2>
        <p className="text-muted-foreground mb-6">
          This demo showcases the different variants of the NewsletterSignup component.
        </p>
      </div>

      <div className="space-y-8">
        <div>
          <h3 className="text-lg font-semibold mb-4">Default Variant (Card)</h3>
          <div className="max-w-md">
            <NewsletterSignup />
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">Compact Variant</h3>
          <div className="max-w-md">
            <NewsletterSignup variant="compact" />
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">Inline Variant</h3>
          <div className="max-w-md">
            <NewsletterSignup variant="inline" />
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">Custom Props Example</h3>
          <div className="max-w-md">
            <NewsletterSignup
              title="Join Our Community"
              description="Get exclusive insights and updates delivered to your inbox."
              buttonText="Join Now"
              placeholder="your.email@example.com"
              showNameFields={false}
            />
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">Compact with Custom Styling</h3>
          <div className="max-w-md">
            <NewsletterSignup
              variant="compact"
              title="Weekly Newsletter"
              description="Stay informed with our weekly updates."
              buttonText="Subscribe Now"
              className="border-2 border-primary/20 bg-primary/5"
            />
          </div>
        </div>
      </div>
    </div>
  )
}