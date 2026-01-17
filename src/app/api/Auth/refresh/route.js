// app/api/auth/refresh/route.js
import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    // Extract all cookies from the incoming request
    const cookieHeader = request.headers.get('cookie') || ''
    
    console.log('Incoming cookies:', cookieHeader)

    // Prepare headers for backend request
    const headers = {
      'Content-Type': 'application/json',
      'Cookie': cookieHeader,
    }

    // Also forward the authorization header if it exists
    const authHeader = request.headers.get('authorization')
    if (authHeader) {
      headers['Authorization'] = authHeader
    }

    // Make request to backend
    const backendResponse = await fetch(
      `https://cityinbookingapi20251018160614-fxgqdkc6d4hwgjf8.canadacentral-01.azurewebsites.net/api/Auth/refresh`,
      {
        method: 'POST',
        headers: headers,
        // No need for credentials: 'include' in server-side fetch
        // because we're manually forwarding cookies
      }
    )

    console.log('Backend response status:', backendResponse.status)

    // Handle backend response
    if (!backendResponse.ok) {
      let errorMessage = 'Refresh failed'
      try {
        const errorData = await backendResponse.json()
        errorMessage = errorData.message || errorMessage
      } catch (e) {
        // Could not parse JSON error
      }

      // Clear cookies on client if refresh failed
      const response = NextResponse.json(
        { success: false, message: errorMessage },
        { status: backendResponse.status }
      )

      // Clear auth cookies
      response.cookies.delete('auth_token')
      response.cookies.delete('user_data')

      return response
    }

    // Parse successful response
    const data = await backendResponse.json()
    const newToken = data.token || data.Token

    if (!newToken) {
      throw new Error('No token in refresh response')
    }

    // Create response
    const response = NextResponse.json({
      success: true,
      token: newToken,
      user: data.user,
      expires: data.expires,
    })

    // Update the auth token cookie (client-accessible)
    response.cookies.set({
      name: 'auth_token',
      value: newToken,
      httpOnly: false, // Client needs to read this
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 1 day
      path: '/',
    })

    // Forward any Set-Cookie headers from backend (for HttpOnly cookies)
    const backendCookies = backendResponse.headers.get('set-cookie')
    if (backendCookies) {
      console.log('Backend Set-Cookie headers:', backendCookies)
      
      // Handle multiple cookies
      const cookiesArray = backendCookies.split(',').map(cookie => cookie.trim())
      
      for (const cookie of cookiesArray) {
        // Parse the cookie string
        const [cookiePart, ...options] = cookie.split(';')
        const [name, ...valueParts] = cookiePart.split('=')
        const value = valueParts.join('=')
        
        // Parse cookie options
        const cookieOptions = {}
        options.forEach(option => {
          const [key, val] = option.split('=').map(s => s.trim())
          if (key.toLowerCase() === 'httponly') {
            cookieOptions.httpOnly = true
          } else if (key.toLowerCase() === 'secure') {
            cookieOptions.secure = true
          } else if (key.toLowerCase() === 'samesite') {
            cookieOptions.sameSite = val || 'lax'
          } else if (key.toLowerCase() === 'max-age') {
            cookieOptions.maxAge = parseInt(val)
          } else if (key.toLowerCase() === 'expires') {
            cookieOptions.expires = new Date(val)
          } else if (key.toLowerCase() === 'path') {
            cookieOptions.path = val
          }
        })
        
        // Set the cookie in the response
        response.cookies.set(name, value, cookieOptions)
      }
    }

    console.log('Refresh successful, new token set')
    return response

  } catch (error) {
    console.error('Refresh API error:', error)
    
    const response = NextResponse.json(
      { success: false, message: error.message || 'Internal server error' },
      { status: 500 }
    )
    
    // Clear cookies on error
    response.cookies.delete('auth_token')
    response.cookies.delete('user_data')
    
    return response
  }
}