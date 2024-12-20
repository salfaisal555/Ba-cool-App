import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchProducts } from "../redux/productsSlice";
import { addToCart } from "../redux/cartSlice";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const products = useSelector((state) => state.products.items); // Ambil produk dari Redux
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  useEffect(() => {
    if (!products.length) {
      dispatch(fetchProducts());
    }
  }, [dispatch, products.length]);

  const handleAddToCart = (product) => {
    if (!isLoggedIn) {
      navigate("/login");
      alert("Please log in first to add products to your cart!");
    } else {
      dispatch(addToCart({ productId: product.id, quantity: 1 }));
      alert("Product successfully added to cart!");
    }
  };

  const handleViewDetails = (id) => {
    navigate(`/product/${id}`);
  };

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">Products</h1>
      <div className="row">
        {products.map((product) => (
          <div key={product.id} className="col-md-4 col-sm-6 mb-4">
            <div className="card h-100">
              <img
                src={product.image}
                className="card-img-top"
                alt={product.title}
                style={{ height: "200px", objectFit: "contain" }}
              />
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{product.title}</h5>
                <p className="card-text">
                  <strong>Price:</strong> ${product.price}
                </p>
                <div className="mt-auto">
                  <button
                    className="btn btn-primary me-2"
                    onClick={() => handleViewDetails(product.id)}
                  >
                    Detail
                  </button>
                  <button
                    className="btn btn-success"
                    onClick={() => handleAddToCart(product)}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
