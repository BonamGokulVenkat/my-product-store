import React from 'react';
import axios from 'axios';

export default function ProductList({ products, onProductDeleted }) {
  const deleteItem = async (id) => {
    await axios.delete(`http://127.0.0.1:8000/products/${id}`);
    onProductDeleted(id);
  };

  return (
    <table border="1" width="100%">
      <thead>
        <tr><th>Name</th><th>Price</th><th>Action</th></tr>
      </thead>
      <tbody>
        {products.map(p => (
          <tr key={p.id}>
            <td>{p.name}</td>
            <td>${p.price}</td>
            <td><button onClick={() => deleteItem(p.id)}>Delete</button></td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}