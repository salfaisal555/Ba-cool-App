import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateQuantity, removeItem, clearCart } from "../redux/cartSlice"; // Tambahkan `clearCart`
import { updateProducts } from "../redux/productsSlice"; // Action untuk memperbarui stok produk
import { useNavigate } from "react-router-dom";

const CartPage = () => {
  const cartItems = useSelector((state) => state.cart.items);
  const products = useSelector((state) => state.products.items);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleCheckout = () => {
    const updatedProducts = products.map((product) => {
      const cartItem = cartItems.find((item) => item.productId === product.id);

      if (cartItem && cartItem.quantity <= product.stock) {
        return { ...product, stock: product.stock - cartItem.quantity }; // Kurangi stok
      }
      return product; // Tidak ada perubahan untuk produk tanpa checkout
    });

    // Dispatch perubahan stok ke Redux
    dispatch(updateProducts(updatedProducts));

    // Hapus item yang telah berhasil di-checkout dari keranjang
    const remainingItems = cartItems.filter((item) => {
      const product = products.find((prod) => prod.id === item.productId);
      return item.quantity > (product ? product.stock : 0); // Sisakan jika stok tidak mencukupi
    });

    if (remainingItems.length === 0) {
      dispatch(clearCart()); // Kosongkan keranjang jika semua berhasil
    } else {
      // Hapus hanya item yang berhasil di-checkout
      remainingItems.forEach((item) => dispatch(removeItem(item.productId)));
    }

    navigate("/"); // Redirect ke halaman utama
  };

  if (!cartItems.length) {
    return (
      <div className="container text-center mt-5">
        <h2>Keranjang Kosong</h2>
        <p>Belum ada barang di keranjang Anda.</p>
        <a href="/" className="btn btn-primary">
          Kembali Belanja
        </a>
      </div>
    );
  }

  const totalOrder = cartItems.reduce((total, item) => {
    const product = products.find((prod) => prod.id === item.productId);
    return product ? total + product.price * item.quantity : total;
  }, 0);

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">My Cart</h1>
      <table className="table table-bordered">
        <thead className="table-light">
          <tr>
            <th>Image</th>
            <th>Product Name</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Total</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {cartItems.map((item) => {
            const product = products.find((prod) => prod.id === item.productId);
            if (!product) {
              return (
                <tr key={item.productId}>
                  <td colSpan="6" className="text-center">
                    Product Not Found
                  </td>
                </tr>
              );
            }

            const totalPrice = (product.price * item.quantity).toFixed(2);
            const isOutOfStock = item.quantity > product.stock;

            return (
              <tr key={item.productId}>
                <td>
                  <img
                    src={product.image}
                    alt={product.title}
                    style={{
                      width: "80px",
                      height: "80px",
                      objectFit: "contain",
                    }}
                  />
                </td>
                <td>{product.title}</td>
                <td>${product.price.toFixed(2)}</td>
                <td>
                  <input
                    type="number"
                    className={`form-control ${
                      isOutOfStock ? "is-invalid" : ""
                    }`}
                    style={{ width: "80px" }}
                    value={item.quantity}
                    onChange={(e) =>
                      dispatch(
                        updateQuantity({
                          productId: item.productId,
                          quantity: Math.max(1, +e.target.value),
                        })
                      )
                    }
                  />
                  {isOutOfStock && (
                    <div className="invalid-feedback">
                      Insufficient stock (stock available : {product.stock})
                    </div>
                  )}
                </td>
                <td>${totalPrice}</td>
                <td>
                  <button
                    className="btn btn-danger"
                    onClick={() => dispatch(removeItem(item.productId))}
                  >
                    Remove
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="text-end mt-4">
        <h4>Total Order: ${totalOrder.toFixed(2)}</h4>
        <button
          className="btn btn-success mt-3"
          onClick={handleCheckout}
          disabled={cartItems.some((item) => {
            const product = products.find((prod) => prod.id === item.productId);
            return item.quantity > (product ? product.stock : 0);
          })}
        >
          Checkout
        </button>
      </div>
    </div>
  );
};

export default CartPage;
