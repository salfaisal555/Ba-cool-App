import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { addToCart } from "../redux/cartSlice";

const ProductDetailPage = () => {
  const { id } = useParams(); // Ambil ID produk dari URL
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const products = useSelector((state) => state.products.items); // Ambil produk dari Redux store
  const product = products.find((prod) => prod.id === parseInt(id)); // Cari produk berdasarkan ID
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (!product) {
      navigate("/");
    }
  }, [product, navigate]);

  const handleAddToCart = () => {
    const token = localStorage.getItem("token");
    if (!token || token.trim() === "") {
      alert("Please log in first to add products to your cart!");
      navigate("/login");
      return;
    }
    dispatch(addToCart({ productId: product.id, quantity }));
    alert("Product successfully added to cart!");
  };

  if (!product) {
    return (
      <div className="alert alert-danger text-center">Product not found.</div>
    );
  }

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-6">
          <img
            src={product.image}
            alt={product.title}
            className="img-fluid rounded shadow-sm"
            style={{ objectFit: "contain", height: "400px" }}
          />
        </div>
        <div className="col-md-6">
          <h1 className="mb-3">{product.title}</h1>
          <p className="text-muted">{product.description}</p>
          <h4 className="text-success mb-4">${product.price.toFixed(2)}</h4>

          <div className="d-flex align-items-center mb-3">
            <label htmlFor="quantity" className="me-2 fw-bold">
              Quantity:
            </label>
            <input
              type="number"
              id="quantity"
              className="form-control"
              style={{ width: "80px" }}
              value={quantity}
              onChange={(e) =>
                setQuantity(Math.max(1, Math.min(20, parseInt(e.target.value))))
              }
              min="1"
              max="20"
            />
          </div>

          <button
            onClick={handleAddToCart}
            className="btn btn-primary btn-lg me-3"
          >
            Add to Cart
          </button>
          <button
            onClick={() => navigate(-1)}
            className="btn btn-outline-secondary btn-lg"
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
