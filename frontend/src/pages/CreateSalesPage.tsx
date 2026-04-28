import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

export default function CreateSalesPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    product_name: '',
    description: '',
    target_audience: '',
    price: '',
    unique_selling_points: '',
  });

  const [keyFeatures, setKeyFeatures] = useState(['']);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFeatureChange = (index: number, value: string) => {
    const updatedFeatures = [...keyFeatures];
    updatedFeatures[index] = value;
    setKeyFeatures(updatedFeatures);
  };

  const addFeature = () => {
    setKeyFeatures([...keyFeatures, '']);
  };

  const removeFeature = (index: number) => {
    const updatedFeatures = keyFeatures.filter((_, i) => i !== index);
    setKeyFeatures(updatedFeatures);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const payload = {
        ...formData,
        key_features: keyFeatures.filter(f => f.trim() !== ''),
      };

      await api.post('/api/pages', payload);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create sales page');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl p-8 mx-auto mt-10 bg-white rounded-lg shadow">
      <h1 className="mb-6 text-2xl font-bold">Create New Sales Page</h1>
      
      {error && <div className="p-3 mb-4 text-red-700 bg-red-100 rounded">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="title">Internal Title (e.g., Q3 Promo)</Label>
          <Input id="title" name="title" value={formData.title} onChange={handleChange} required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="product_name">Product/Service Name</Label>
          <Input id="product_name" name="product_name" value={formData.product_name} onChange={handleChange} required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" name="description" value={formData.description} onChange={handleChange} required />
        </div>

        <div className="space-y-2">
          <Label>Key Features</Label>
          {keyFeatures.map((feature, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <Input 
                value={feature} 
                onChange={(e) => handleFeatureChange(index, e.target.value)} 
                placeholder={`Feature ${index + 1}`}
                required
              />
              {keyFeatures.length > 1 && (
                <Button type="button" variant="destructive" onClick={() => removeFeature(index)}>Remove</Button>
              )}
            </div>
          ))}
          <Button type="button" variant="secondary" onClick={addFeature} className="mt-2">Add Feature</Button>
        </div>

        <div className="space-y-2">
          <Label htmlFor="target_audience">Target Audience</Label>
          <Input id="target_audience" name="target_audience" value={formData.target_audience} onChange={handleChange} required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="price">Price</Label>
          <Input id="price" name="price" value={formData.price} onChange={handleChange} required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="unique_selling_points">Unique Selling Points</Label>
          <Textarea id="unique_selling_points" name="unique_selling_points" value={formData.unique_selling_points} onChange={handleChange} required />
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Submitting...' : 'Generate Sales Page'}
        </Button>
      </form>
    </div>
  );
}
