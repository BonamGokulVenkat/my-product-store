import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = "https://my-store-api-f13u.onrender.com/products";

export default function App() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: '', price: '', description: '', image_url: '' });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => { fetchProducts(); }, []);

  const fetchProducts = async () => {
    const res = await axios.get(API_URL);
    setProducts(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isEditing) {
      await axios.put(`${API_URL}/${form.id}`, form);
    } else {
      await axios.post(API_URL, form);
    }
    setForm({ name: '', price: '', description: '', image_url: '' });
    setIsEditing(false);
    fetchProducts();
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      {/* Navigation */}
      <nav className="bg-white shadow-sm py-4 px-8 flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-indigo-600">LuxeStore</h1>
        <div className="text-gray-500 text-sm">Inventory Management System</div>
      </nav>

      <main className="max-w-6xl mx-auto p-4 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: Management Form */}
        <section className="lg:col-span-1">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-8">
            <h2 className="text-lg font-semibold mb-4">
              {isEditing ? "Edit Product" : "Add New Product"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase">Product Name</label>
                <input className="w-full p-3 bg-gray-50 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase">Price (USD)</label>
                <input type="number" className="w-full p-3 bg-gray-50 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={form.price} onChange={e => setForm({...form, price: e.target.value})} required />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase">Image URL</label>
                <input className="w-full p-3 bg-gray-50 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={form.image_url} onChange={e => setForm({...form, image_url: e.target.value})} placeholder="https://..." />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase">Description</label>
                <textarea className="w-full p-3 bg-gray-50 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none h-24"
                  value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
              </div>
              <button className={`w-full py-3 rounded-lg font-bold text-white transition-all ${isEditing ? 'bg-orange-500 hover:bg-orange-600' : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200 shadow-lg'}`}>
                {isEditing ? "Update Product" : "Create Product"}
              </button>
            </form>
          </div>
        </section>

        {/* Right Side: Product Gallery */}
        <section className="lg:col-span-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {products.map(product => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onEdit={() => { setForm(product); setIsEditing(true); }}
                onDelete={async () => { await axios.delete(`${API_URL}/${product.id}`); fetchProducts(); }}
              />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

function ProductCard({ product, onEdit, onDelete }) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100">
      <img src={product.image_url || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000&auto=format&fit=crop'} 
           className="w-full h-48 object-cover" alt={product.name} />
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-lg">{product.name}</h3>
          <span className="bg-indigo-50 text-indigo-700 px-2 py-1 rounded text-sm font-bold">${product.price}</span>
        </div>
        <p className="text-gray-500 text-sm mb-4 line-clamp-2">{product.description}</p>
        <div className="flex gap-2">
          <button onClick={onEdit} className="flex-1 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-semibold">Edit</button>
          <button onClick={onDelete} className="flex-1 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-sm font-semibold">Delete</button>
        </div>
      </div>
    </div>
  );
}