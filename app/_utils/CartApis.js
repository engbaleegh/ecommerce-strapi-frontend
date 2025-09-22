const { default: axiosClient } = require("./axiosClient");

const addToCart = (payload) => axiosClient.post("/carts", payload);




const getUserCartItems = (email) =>
  axiosClient.get(
    `carts?populate[products][populate]=image&filters[email][$eq]=${email}`
  );

  const deleteCartItem = (id) => axiosClient.delete(`/carts/${id}`);
  const updateCart = (id) => axiosClient.put(`/carts/${id}`);

  const removeProductFromCart = (cartId, productId) =>
  axiosClient.put(`/carts/${cartId}`, {
    data: {
      products: {
        disconnect: [productId], // افصل المنتج من الكارت
      },
    },
  });

  export default { 
    addToCart,
    getUserCartItems,
    deleteCartItem,
    updateCart,
    removeProductFromCart
};