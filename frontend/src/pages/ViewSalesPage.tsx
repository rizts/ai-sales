import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../lib/axios';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { CheckCircle, Loader2 } from 'lucide-react';

interface Feature {
  title: string;
  description: string;
}

interface GeneratedContent {
  headline: string;
  sub_headline: string;
  product_description: string;
  benefits: string[];
  features_breakdown: Feature[];
  social_proof_placeholder: string;
  pricing_display: string;
  call_to_action: string;
}

interface SalesPage {
  id: number;
  title: string;
  status: 'pending' | 'processing' | 'done' | 'failed';
  generated_content: GeneratedContent | null;
}

export default function ViewSalesPage() {
  const { id } = useParams<{ id: string }>();
  const [page, setPage] = useState<SalesPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const fetchPage = async () => {
    try {
      const response = await api.get(`/api/pages/${id}`);
      setPage(response.data);
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch sales page');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPage();
  }, [id]);

  useEffect(() => {
    if (page && (page.status === 'pending' || page.status === 'processing')) {
      timeoutRef.current = setTimeout(() => {
        fetchPage();
      }, 3000);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [page]);

  const handleRegenerate = async () => {
    setLoading(true);
    try {
      const response = await api.post(`/api/pages/${id}/regenerate`);
      setPage(response.data.page);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to regenerate');
      setLoading(false);
    }
  };

  if (loading && !page) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (error && !page) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-white border-b shadow-sm">
        <Link to="/dashboard" className="text-blue-600 hover:underline">
          &larr; Back to Dashboard
        </Link>
        <div className="font-semibold text-gray-800">{page?.title || 'Loading...'}</div>
        <div className="w-24"></div> {/* spacer for centering */}
      </div>

      <div className="pt-20 pb-10">
        {(page?.status === 'pending' || page?.status === 'processing') && (
          <div className="flex flex-col items-center justify-center pt-20">
            <Loader2 className="w-12 h-12 mb-4 text-blue-600 animate-spin" />
            <h2 className="text-xl font-medium text-gray-700">Generating your sales page...</h2>
            <p className="mt-2 text-gray-500">This may take up to a minute.</p>
          </div>
        )}

        {page?.status === 'failed' && (
          <div className="flex items-center justify-center pt-20">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle className="text-red-600">Generation Failed</CardTitle>
                <CardDescription>We encountered an error while generating your sales page.</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <p>Generation failed. Please try again.</p>
                <Button onClick={handleRegenerate} className="w-full">Regenerate</Button>
              </CardContent>
            </Card>
          </div>
        )}

        {page?.status === 'done' && page.generated_content && (
          <div className="flex flex-col bg-white">
            {/* Hero Section */}
            <section className="w-full py-20 text-center text-white bg-indigo-600 px-4">
              <h1 className="max-w-4xl mx-auto mb-6 text-4xl font-bold leading-tight md:text-5xl">
                {page.generated_content.headline}
              </h1>
              <p className="max-w-2xl mx-auto text-xl text-indigo-100">
                {page.generated_content.sub_headline}
              </p>
            </section>

            {/* Product Description */}
            <section className="w-full py-12 px-4 mx-auto max-w-2xl text-center">
              <p className="text-lg leading-relaxed text-gray-700">
                {page.generated_content.product_description}
              </p>
            </section>

            {/* Benefits */}
            <section className="w-full py-16 bg-gray-50 px-4">
              <div className="max-w-3xl mx-auto">
                <h2 className="mb-10 text-3xl font-bold text-center text-gray-900">Why Choose Us</h2>
                <div className="space-y-4">
                  {page.generated_content.benefits.map((benefit, i) => (
                    <div key={i} className="flex items-start">
                      <CheckCircle className="flex-shrink-0 w-6 h-6 mr-3 text-green-500" />
                      <p className="text-lg text-gray-700">{benefit}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Features Breakdown */}
            <section className="w-full py-16 px-4">
              <div className="max-w-5xl mx-auto">
                <h2 className="mb-10 text-3xl font-bold text-center text-gray-900">What You Get</h2>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {page.generated_content.features_breakdown.map((feature, i) => (
                    <Card key={i}>
                      <CardHeader>
                        <CardTitle>{feature.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-600">{feature.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </section>

            {/* Social Proof */}
            <section className="w-full py-20 bg-gray-100 px-4 text-center">
              <div className="max-w-3xl mx-auto">
                <blockquote className="text-2xl font-medium italic text-gray-800">
                  "{page.generated_content.social_proof_placeholder}"
                </blockquote>
              </div>
            </section>

            {/* Pricing */}
            <section className="w-full py-16 px-4 text-center">
              <div className="max-w-md mx-auto p-10 rounded-xl bg-indigo-50 border border-indigo-100">
                <h3 className="text-xl font-medium text-gray-600 uppercase tracking-wide mb-4">Investment</h3>
                <div className="text-5xl font-extrabold text-indigo-700">
                  {page.generated_content.pricing_display}
                </div>
              </div>
            </section>

            {/* CTA */}
            <section className="w-full py-20 px-4 text-center">
              <Button size="lg" className="text-xl px-10 py-8 rounded-full shadow-lg hover:scale-105 transition-transform bg-indigo-600 hover:bg-indigo-700">
                {page.generated_content.call_to_action}
              </Button>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
