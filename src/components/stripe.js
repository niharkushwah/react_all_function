import React, { useEffect, useState } from "react";
import Stripe from "stripe";
import Card from 'react-bootstrap/Card';
import { onetimeplan } from "../auth/auth.service";
import { redirect } from "react-router";

const stripe = Stripe("sk_test_51NlTfRSC6eBuCJlad13u1ZHgndEIAiVewzpwEHIdcAv8x7MekBtQ9B1tJsxV1L6w11vGiZ2hHVwslm1OqTiqotGy00TD6DMgtk");

const StripeComponent = () => {
  const [stripeProducts, setStripeProducts] = useState([]);

  useEffect(() => {
    async function fetchStripeProducts() {
      try {
        const products = await stripe.products.list();
        setStripeProducts(products.data);
      } catch (err) {
        console.error("Failed to fetch Stripe products:", err);
      }
    }
    fetchStripeProducts();
  }, []);

  console.log(stripeProducts);

  const handleOneTimePlan = async (id) => {
    try {
      const plan = await onetimeplan(id);
      window.location.href = plan;
    } catch (err) {
      console.error("Failed to fetch Stripe products:", err);
    }
  };

  return (
    <div>
      <h1>Stripe Products</h1>
      <div className="product-cards">
        {stripeProducts.map((product) => (
          <Card key={product.id} className="product-card">
            <Card.Body>
              <Card.Title>{product.name}</Card.Title>
              <Card.Text>Price: ${product.metadata.price}</Card.Text>
              <Card.Text>{product.metadata.desc}</Card.Text>
              <button onClick={() => handleOneTimePlan(product.id)}>Buy Now</button>
            </Card.Body>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default StripeComponent;
