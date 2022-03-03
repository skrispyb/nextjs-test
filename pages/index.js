import React, { useState } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { prefix } from '../prefix'
import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';
import { useRouter } from 'next/router';

export default function Home() {  
  const router = useRouter();
  const { status } = router.query;

  const [loading, setLoading] = useState(false);

  const [item, setItem] = useState({
    name: 'Apple AirPods',
    description: 'Latest Apple AirPods.',
    quantity: 0,
    price: 999,
  });
  
  const changeQuantity = (value) => {
    // Don't allow the quantity less than 0, if the quantity is greater than value entered by user then the user entered quantity is used, else 0
    setItem({ ...item, quantity: Math.max(0, value) });
  };
  
  const onQuantityPlus = () => {
    changeQuantity(item.quantity + 1);
  };
  
  const onQuantityMinus = () => {
    changeQuantity(item.quantity - 1);
  };
  
  const onInputChange = (e) => {
    changeQuantity(parseInt(e.target.value));
  };

  const publishableKey = `${process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY}`;
  const stripePromise = loadStripe(publishableKey);
  
  const createCheckOutSession = async () => {
    setLoading(true);
    const stripe = await stripePromise;
    const checkoutSession = await axios.post(`/api/create-stripe-session`, {
      item: item,
    });
    const result = await stripe.redirectToCheckout({
      sessionId: checkoutSession.data.id,
    });
    if (result.error) {
      alert(result.error.message);
    }
    setLoading(false);
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Complete Step By Step Tutorial for integrating Stripe Checkout with Next.js" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title} style={{margin: "12px 0"}}>
          Welcome to my Next.js test project!
        </h1>
        {status && status === 'success' && (
          <div className='bg-green-100 text-green-700 p-2 rounded border mb-2 border-green-700' style={{backgroundColor: "rgb(0,200,0)", padding: "1rem", margin:"24px 0", fontSize: "24px", fontWeight: "600"}}>
            Payment Successful
          </div>
        )}
        {status && status === 'cancel' && (
          <div className='bg-red-100 text-red-700 p-2 rounded border mb-2 border-red-700' style={{backgroundColor: "rgb(200,0,0)", padding: "1rem", margin:"24px 0", fontSize: "24px", fontWeight: "600"}}>
            Payment Unsuccessful
          </div>
        )}

        <div className='shadow-lg border rounded p-2 '>
          <h2 className='text-2xl'>$ {item.price}</h2>
          <h3 className='text-xl'>{item.name}</h3>
          <p className='text-gray-500'>{item.description}</p>
          <p className='text-sm text-gray-600 mt-1'>Quantity:</p>
          <div className='border rounded'>
            <button onClick={onQuantityMinus}
              className='bg-blue-500 py-2 px-4 text-white rounded hover:bg-blue-600'
            >
              -
            </button>
            <input
              type='number'
              className='p-2'
              onChange={onInputChange}
              defaultValue={item.quantity}
            />
            <button onClick={onQuantityPlus}
              className='bg-blue-500 py-2 px-4 text-white rounded hover:bg-blue-600'
            >
              +
            </button>
          </div>
          <p>Total: ${item.quantity * item.price}</p>
          <button
            disabled={item.quantity === 0 || loading}
            onClick={createCheckOutSession}
            className='bg-blue-500 hover:bg-blue-600 text-white block w-full py-2 rounded mt-2 disabled:cursor-not-allowed disabled:bg-blue-100'
          >
            {loading ? 'Processing...' : 'Buy'}
          </button>
        </div>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span className={styles.logo}>
            <Image src={`${prefix}/vercel.svg`} alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  )
}
