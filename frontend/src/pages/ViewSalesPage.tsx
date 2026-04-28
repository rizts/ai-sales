import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import api from "../lib/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

export default function ViewSalesPage() {
  const { id } = useParams()
  const [salesPage, setSalesPage] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSalesPage()
    
    // Poll every 5 seconds if status is pending or processing
    const interval = setInterval(() => {
      if (salesPage && (salesPage.status === 'pending' || salesPage.status === 'processing')) {
        fetchSalesPage()
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [id, salesPage?.status])

  const fetchSalesPage = async () => {
    try {
      const response = await api.get(`/sales-pages/${id}`)
      setSalesPage(response.data)
    } catch (error) {
      console.error("Failed to fetch sales page", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="p-10 text-center">Loading...</div>
  }

  if (!salesPage) {
    return <div className="p-10 text-center text-destructive">Sales page not found.</div>
  }

  return (
    <div className="container py-10 mx-auto max-w-4xl">
      <div className="mb-8">
        <Button variant="ghost" asChild className="pl-0">
          <Link to="/dashboard">← Back to Dashboard</Link>
        </Button>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">{salesPage.product_name}</CardTitle>
              <CardDescription>Target: {salesPage.target_audience}</CardDescription>
            </div>
            <div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium
                ${salesPage.status === 'completed' ? 'bg-green-100 text-green-800' : 
                  salesPage.status === 'failed' ? 'bg-red-100 text-red-800' : 
                  'bg-yellow-100 text-yellow-800'}`}>
                {salesPage.status.toUpperCase()}
              </span>
            </div>
          </div>
        </CardHeader>
      </Card>

      {(salesPage.status === 'pending' || salesPage.status === 'processing') && (
        <Card className="p-12 text-center">
          <CardTitle className="mb-4">Generating your sales page...</CardTitle>
          <CardDescription>
            Our AI is currently writing the copy. This usually takes about 30-60 seconds.
            The page will automatically update when it's ready.
          </CardDescription>
        </Card>
      )}

      {salesPage.status === 'completed' && salesPage.generated_content && (
        <Card>
          <CardHeader>
            <CardTitle>Generated Sales Page</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose dark:prose-invert max-w-none">
              {/* Very simple markdown renderer for demonstration */}
              {salesPage.generated_content.split('\n').map((line: string, i: number) => {
                if (line.startsWith('# ')) return <h1 key={i} className="text-4xl font-bold mt-6 mb-4">{line.substring(2)}</h1>
                if (line.startsWith('## ')) return <h2 key={i} className="text-3xl font-bold mt-5 mb-3">{line.substring(3)}</h2>
                if (line.startsWith('### ')) return <h3 key={i} className="text-2xl font-bold mt-4 mb-2">{line.substring(4)}</h3>
                if (line.trim() === '') return <br key={i} />
                if (line.startsWith('- ')) return <li key={i} className="ml-4 list-disc">{line.substring(2)}</li>
                return <p key={i} className="mb-2">{line}</p>
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {salesPage.status === 'failed' && (
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Generation Failed</CardTitle>
            <CardDescription>
              There was an error generating your sales page. Please try creating a new one.
            </CardDescription>
          </CardHeader>
        </Card>
      )}
    </div>
  )
}
