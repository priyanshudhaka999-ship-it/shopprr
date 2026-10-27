import React, { useContext, useState } from "react";
import toast from "react-hot-toast";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import CartTotal from "../components/CartTotal";

const PlaceOrder = () => {

  const { navigate, cartItems, setCartItems, products, axios } = useContext(ShopContext);
  const [method, setMethod] = useState("COD");

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: "",
  });

  const loadRazorpay = () =>
    new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement("script");

      script.src =
        "https://checkout.razorpay.com/v1/checkout.js";

      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);

      document.body.appendChild(script);
    });

  const onChangeHandler = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    setFormData((data) => ({ ...data, [name]: value }));
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      const orderItems = [];

      for (const itemId in cartItems) {
        for (const size in cartItems[itemId]) {
          if (cartItems[itemId][size] > 0) {
            const itemInfo = structuredClone(
              products.find((product) => product._id === itemId)
            );

            if (itemInfo) {
              itemInfo.size = size;
              itemInfo.quantity = cartItems[itemId][size];
              orderItems.push(itemInfo);
            }
          }
        }
      }

      const items = orderItems.map((item) => ({
        product: item._id,
        quantity: item.quantity,
        size: item.size,
      }));

      // Cash on Delivery
      if (method === "COD") {
        const { data } = await axios.post("/api/order/cod", {
          items,
          address: formData,
        });

        if (data.success) {
          toast.success(data.message);
          setCartItems({});
          navigate("/my-orders");
        } else {
          toast.error(data.message);
        }

        return;
      }

      // Razorpay
      const loaded = await loadRazorpay();

      if (!loaded) {
        return toast.error("Razorpay failed to load");
      }

      const { data: orderData } = await axios.post(
        "/api/order/razorpay",
        { items, address: formData }
      );

      console.log("Razorpay order response:", orderData);

      if (!orderData.success) {
        return toast.error(orderData.message);
      }

      const options = {
        key: orderData.key,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Shopprr",
        order_id: orderData.razorpayOrderId,

        handler: async (response) => {
          try {
            const { data } = await axios.post(
              "/api/order/verify-razorpay",
              {
                mongoOrderId: orderData.mongoOrderId,
                razorpay_payment_id:
                  response.razorpay_payment_id,
              }
            );

            if (data.success) {
              toast.success("Payment successful");
              setCartItems({});
              navigate("/my-orders");
            } else {
              toast.error(data.message);
            }
          } catch (error) {
            toast.error("Payment verification failed");
          }
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();

    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  return (
    <div className="max-padd-container py-16 pt-28 bg-primary">
      {/* Container */}
      <form onSubmit={onSubmitHandler}>
        <div className="flex flex-col xl:flex-row gap-20 xl:gap-28">
          {/* LEFT SIDE */}
          <div className="flex flex-[2] flex-col gap-3 text-[95%]">
            <Title
              title1={"Delivery"}
              title2={"Information"}
              titleStyles={"pb-5"}
            />
            <div className="flex gap-3">
              <input
                onChange={onChangeHandler}
                value={formData.firstName}
                type="text"
                name="firstName"
                placeholder="First Name"
                className="ring-1 ring-slate-900/15 p-1 pl-3 rounded-sm bg-white outline-none w-1/2"
                required
              />
              <input
                onChange={onChangeHandler}
                value={formData.lastName}
                type="text"
                name="lastName"
                placeholder="Last Name"
                className="ring-1 ring-slate-900/15 p-1 pl-3 rounded-sm bg-white outline-none w-1/2"
                required
              />
            </div>
            <input
              onChange={onChangeHandler}
              value={formData.email}
              type="email"
              name="email"
              placeholder="Email"
              className="ring-1 ring-slate-900/15 p-1 pl-3 rounded-sm bg-white outline-none"
              required
            />
            <input
              onChange={onChangeHandler}
              value={formData.phone}
              type="phone"
              name="phone"
              placeholder="Phone"
              className="ring-1 ring-slate-900/15 p-1 pl-3 rounded-sm bg-white outline-none"
              required
            />
            <input
              onChange={onChangeHandler}
              value={formData.street}
              type="text"
              name="street"
              placeholder="Street"
              className="ring-1 ring-slate-900/15 p-1 pl-3 rounded-sm bg-white outline-none"
              required
            />
            <div className="flex gap-3">
              <input
                onChange={onChangeHandler}
                value={formData.city}
                type="text"
                name="city"
                placeholder="City"
                className="ring-1 ring-slate-900/15 p-1 pl-3 rounded-sm bg-white outline-none w-1/2"
                required
              />
              <input
                onChange={onChangeHandler}
                value={formData.state}
                type="text"
                name="state"
                placeholder="State"
                className="ring-1 ring-slate-900/15 p-1 pl-3 rounded-sm bg-white outline-none w-1/2"
                required
              />
            </div>
            <div className="flex gap-3">
              <input
                onChange={onChangeHandler}
                value={formData.zipcode}
                type="text"
                name="zipcode"
                placeholder="Zipcode"
                className="ring-1 ring-slate-900/15 p-1 pl-3 rounded-sm bg-white outline-none w-1/2"
                required
              />
              <input
                onChange={onChangeHandler}
                value={formData.country}
                type="text"
                name="country"
                placeholder="Country"
                className="ring-1 ring-slate-900/15 p-1 pl-3 rounded-sm bg-white outline-none w-1/2"
                required
              />
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="flex flex-1 flex-col">
            <div className="max-w-[360px] w-full bg-white p-5 py-10 max-md:mt-16">
              <CartTotal method={method} setMethod={setMethod} />
              <button type="submit" className="btn-dark w-full mt-8">Proceed to Order</button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default PlaceOrder;