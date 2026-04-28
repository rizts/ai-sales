import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import api from "../lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function CreateSalesPage() {
  const [productName, setProductName] = useState("")
  const [description, setDescription] = useState("")
  const [targetAudience, setTargetAudience] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await api.post("/sales-pages", {
        product_name: productName,
        description,
        target_audience: targetAudience,
      })
      navigate(`/sales-page/${response.data.id}`)
    } catch (error) {
      console.error("Failed to create sales page", error)
      setLoading(false)
    }
  }

  return (
    <div className="container max-w-2xl py-10 mx-auto">
      <div className="mb-8">
        <Button variant="ghost" asChild className="pl-0">
          <Link to="/dashboard">← Back to Dashboard</Link>
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Generate New Sales Page</CardTitle>
          <CardDescription>
            Provide details about your product to generate a high-converting sales page using AI.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="productName">Product Name</Label>
              <Input
                id="productName"
                value={productName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setProductName(e.target.value)}
                placeholder="e.g. AI Sales Pro"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="targetAudience">Target Audience</Label>
              <Input
                id="targetAudience"
                value={targetAudience}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTargetAudience(e.target.value)}
                placeholder="e.g. Small business owners, digital marketers"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Product Description & Key Features</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
                placeholder="Describe what your product does and its main benefits..."
                className="min-h-[150px]"
                required
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Generating..." : "Generate Sales Page"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
