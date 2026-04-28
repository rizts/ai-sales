import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import api from "../lib/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function Dashboard() {
  const [salesPages, setSalesPages] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    fetchSalesPages()
  }, [])

  const fetchSalesPages = async () => {
    try {
      const response = await api.get("/sales-pages")
      setSalesPages(response.data)
    } catch (error) {
      console.error("Failed to fetch sales pages", error)
    }
  }

  const handleLogout = async () => {
    try {
      await api.post("/logout")
      localStorage.removeItem("token")
      navigate("/login")
    } catch (error) {
      console.error("Logout failed", error)
    }
  }

  return (
    <div className="container py-10 mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <div className="space-x-4">
          <Button asChild>
            <Link to="/create">Create Sales Page</Link>
          </Button>
          <Button variant="outline" onClick={handleLogout}>Logout</Button>
        </div>
      </div>

      {salesPages.length === 0 ? (
        <Card className="text-center p-12">
          <CardHeader>
            <CardTitle>No sales pages found</CardTitle>
            <CardDescription>You haven't created any sales pages yet.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link to="/create">Generate your first page</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {salesPages.map((page: any) => (
            <Card key={page.id} className="flex flex-col">
              <CardHeader>
                <CardTitle className="truncate">{page.product_name}</CardTitle>
                <CardDescription>Status: {page.status}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {page.description}
                </p>
              </CardContent>
              <div className="p-6 pt-0 mt-auto">
                <Button asChild variant="secondary" className="w-full">
                  <Link to={`/sales-page/${page.id}`}>View Details</Link>
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
