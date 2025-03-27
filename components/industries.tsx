import { MoveRight } from "lucide-react"

export default function Industries() {
  const industries = [
    "Healthcare and Life Sciences",
    "Information Technology",
    "Banking and Financial Services",
    "Manufacturing",
    "Retail and E-Commerce",
    "Education and Training Providers"
  ]

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">Industries We Serve</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {industries.map((industry, index) => (
              <div 
                key={index} 
                className="p-6 rounded-lg border-2 border-gray-100 flex items-center hover:border-[#FF6B38] transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-[#FF6B38] bg-opacity-10 flex items-center justify-center mr-4 flex-shrink-0">
                  <MoveRight className="h-5 w-5 text-[#FF6B38]" />
                </div>
                <p className="font-medium text-lg">{industry}</p>
              </div>
            ))}
          </div>
          
          <div className="mt-12 text-center max-w-3xl mx-auto">
            <p className="text-gray-600">
              From custom elearning services to outsourcing learning and development, we help industries train smarter and perform better.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
} 