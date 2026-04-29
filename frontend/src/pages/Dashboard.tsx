import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../lib/axios';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, Loader2, PlusCircle, Trash2, Eye } from 'lucide-react';

interface SalesPageSummary {
  id: number;
  title: string;
  status: 'pending' | 'processing' | 'done' | 'failed';
  created_at: string;
}

export default function Dashboard() {
  const [pages, setPages] = useState<SalesPageSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const navigate = useNavigate();

  const fetchPages = async () => {
    try {
      const response = await api.get('/api/pages');
      setPages(response.data);
      setError('');
    } catch (err: any) {
      setError('Failed to fetch sales pages.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPages();
  }, []);

  useEffect(() => {
    const hasActiveJobs = pages.some(p => p.status === 'pending' || p.status === 'processing');
    
    if (hasActiveJobs) {
      timeoutRef.current = setTimeout(() => {
        fetchPages();
      }, 5000);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [pages]);

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this page?')) return;
    
    // Optimistic UI update
    setPages(pages.filter(p => p.id !== id));
    
    try {
      await api.delete(`/api/pages/${id}`);
    } catch (err) {
      // Revert if failed
      fetchPages();
      alert('Failed to delete the page.');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(date);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'done': return <Badge className="bg-green-500 hover:bg-green-600">Done</Badge>;
      case 'failed': return <Badge variant="destructive">Failed</Badge>;
      case 'processing': return <Badge className="bg-yellow-500 hover:bg-yellow-600">Processing</Badge>;
      case 'pending':
      default:
        return <Badge variant="secondary">Pending</Badge>;
    }
  };

  if (loading && pages.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Your Sales Pages</h1>
          <p className="text-gray-500 mt-1">Manage and view your generated AI landing pages.</p>
        </div>
        <Button onClick={() => navigate('/pages/new')} className="flex items-center gap-2">
          <PlusCircle className="w-4 h-4" />
          Create New Page
        </Button>
      </div>

      {error && <div className="bg-red-50 text-red-600 p-4 rounded-md mb-6">{error}</div>}

      {pages.length === 0 ? (
        <div className="bg-white border border-dashed border-gray-300 rounded-xl p-12 text-center flex flex-col items-center justify-center">
          <div className="bg-indigo-50 p-4 rounded-full mb-4">
            <FileText className="w-10 h-10 text-indigo-600" />
          </div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">No sales pages yet</h3>
          <p className="text-gray-500 mb-6 max-w-sm">
            Create your first AI-generated sales page in seconds. Provide some product details and we'll do the rest!
          </p>
          <Button onClick={() => navigate('/pages/new')}>
            Create your first one!
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pages.map(page => (
            <Card key={page.id} className="flex flex-col h-full hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start gap-4">
                  <CardTitle className="text-xl leading-tight line-clamp-2">{page.title}</CardTitle>
                  {getStatusBadge(page.status)}
                </div>
              </CardHeader>
              <CardContent className="flex-1">
                <p className="text-sm text-gray-500">Created {formatDate(page.created_at)}</p>
              </CardContent>
              <CardFooter className="pt-3 border-t bg-gray-50/50 flex gap-2">
                <Button 
                  variant="default" 
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700" 
                  onClick={() => navigate(`/pages/${page.id}`)}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View Preview
                </Button>
                <Button 
                  variant="outline" 
                  size="icon"
                  className="text-red-500 border-red-200 hover:bg-red-50"
                  onClick={() => handleDelete(page.id)}
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
