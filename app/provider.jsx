"use client"
import React, { Suspense } from 'react'
import { ConvexProvider, ConvexReactClient } from "convex/react";
import AuthProvider from './AuthProvider';

function Provider({children}) {
    const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL);
  return (
    <div>
        <ConvexProvider client={convex}>
         <Suspense>
        <AuthProvider>
        {children}
        </AuthProvider>
        </Suspense> 
        </ConvexProvider>
    </div>
  )
}

export default Provider