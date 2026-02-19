import React, { useState } from 'react';
import axios from 'axios';

export default function ProductForm({ onProductAdded }) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await axios.post('http://127.0.0.1:8000/products', {
      name,
      price: parseFloat(price)
    });
    onProductAdded(response.data);
    setName('');
    setPrice('');
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
      <input placeholder="Name" value={name} onChange={e => setName(e.target.value)} required />
      <input placeholder="Price" type="number" value={price} onChange={e => setPrice(e.target.value)} required />
      <button type="submit">Add Product</button>
    </form>
  );
}