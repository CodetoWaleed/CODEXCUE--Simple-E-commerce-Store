import { configureStore } from '@reduxjs/toolkit';
import  StripeReducer  from './reducers/stripeReducer';


export const store = configureStore({
  reducer: {
    stripe_session_id : StripeReducer
  },

 
});