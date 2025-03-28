import React, { useState } from "react";
import axios from "axios";

const Payment = () => {
    const [amount, setAmount] = useState("");

    const handlePayment = async () => {
        try {
            const response = await axios.post("http://localhost:5000/api/payment", { amount });
            window.location.href = response.data.paymentUrl; // Redirect to payment gateway
        } catch (error) {
            console.error("Payment Error:", error);
            alert("Payment failed!");
        }
    };

    return (
        <div>
            <h2>Make a Payment</h2>
            <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
            />
            <button onClick={handlePayment}>Pay Now</button>
        </div>
    );
};

export default Payment;
