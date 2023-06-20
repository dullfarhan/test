import React from 'react'
import BlankLayout from 'src/@core/layouts/BlankLayout'
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useState } from 'react';
import { useEffect } from 'react';
import { Box, Button, Input, InputLabel } from '@mui/material';

const Paypal = () => {
    const [show, setShow] = useState(false);
    const [success, setSuccess] = useState(false);
    const [ErrorMessage, setErrorMessage] = useState("");
    const [orderID, setOrderID] = useState(false);

    const createOrder = (data, actions) => {
        return actions.order.create({
            purchase_units: [
                {
                    description: "Sunflower",
                    amount: {
                        currency_code: "USD",
                        value: 20,
                    },
                },
            ],
        }).then((orderID) => {
            setOrderID(orderID);
            
            return orderID;
        });
    };

    // check Approval
    const onApprove = (data, actions) => {
        return actions.order.capture().then(function (details) {
            const { payer } = details;
            setSuccess(true);
        });
    };

    //capture likely error
    const onError = (data, actions) => {
        setErrorMessage("An Error occured with your payment ");
    };

    useEffect(() => {
        if (success) {
            alert("Payment successful!!");
            console.log('Order successful . Your order id is--', orderID);
        }
    }, [success]);

    return (
        <PayPalScriptProvider options={{ "client-id": 'Ab253c9Kog-5G_-nu5t0XiWYKNLi35VdMw3Gqz1zt2yqSBVBEViBfxzSdUUOX25skz2tgu3B5dN8UCOd' }}>
            <div>

                <PayPalButtons
                    style={{ layout: "vertical" }}
                    createOrder={createOrder}
                    
                // onApprove={onApprove}
                />
            </div>
        </PayPalScriptProvider>
    )
}

Paypal.getLayout = (page) => <BlankLayout>{page}</BlankLayout>
Paypal.acl = {
    subject: 'both'
}

export default Paypal