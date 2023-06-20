import React from "react";
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import Payment from "./payment";

const PUBLIC_KEY = "pk_test_51NGRgdJ3nzDMHlk3pNT8ttL9jCPDA2y57NRWniz7jJUOQjp5VOhDGgMesNUVtKiTlXvkSNImzjIiOecNJdlUviRg00c7JjinTh"

const stirpeTestPromise = loadStripe(PUBLIC_KEY)

const PaymentContainer = () => {

  // const options = {
  //   // passing the client secret obtained from the server
  //   clientSecret: ,
  // };


  return (  
    <Elements stripe={stirpeTestPromise} >
      <Payment />
    </Elements>
  );
};

export default PaymentContainer;
