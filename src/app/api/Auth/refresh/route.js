// app/api/auth/refresh/route.js
import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    // Get all headers from the incoming request
    const headers = {}
    request.headers.forEach((value, key) => {
      headers[key] = value
    })

    // Get cookies specifically
    const cookies = headers.cookie || ''
    
    // Call the backend refresh endpoint
    const backendRes = await fetch(
      "https://cityinbookingapi20251018160614-fxgqdkc6d4hwgjf8.canadacentral-01.azurewebsites.net/api/Auth/refresh",
      {
        method: "POST",
        headers: {
          'Cookie': cookies, // Forward all cookies
          'Content-Type': 'application/json',
          // Forward the authorization header if present
          'Authorization': headers.authorization || '',
        },
        // IMPORTANT: In server-side fetch, credentials mode should be 'same-origin' or omit it
      }
    )

    // Check response
    if (!backendRes.ok) {
      const errorText = await backendRes.text()
      console.error('Backend refresh failed:', backendRes.status, errorText)
      
      return NextResponse.json(
        { success: false, message: 'Token refresh failed' },
        { status: backendRes.status }
      )
    }

    const data = await backendRes.json()
    
    // Create the response
    const response = NextResponse.json({
      success: true,
      token: data.token || data.Token,
      expires: data.expires,
    })

    // Forward any Set-Cookie headers from the backend
    const setCookieHeader = backendRes.headers.get('set-cookie')
    if (setCookieHeader) {
      // Set the cookie in the response
      response.headers.set('Set-Cookie', setCookieHeader)
    }

    return response

  } catch (error) {
    console.error('Refresh token error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}