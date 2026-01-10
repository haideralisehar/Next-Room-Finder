import { NextResponse } from 'next/headers'
import jwt from 'jsonwebtoken' 

export async function GET(req) {
   const cookies = req.cookies;

    
    const token = cookies.get("token")?.value;
  
  if (!token) {
    return Response.json({ error: 'No token found' }, { status: 401 })
  }

  // OPTION 1: Using jsonwebtoken library (Decode ONLY)
  // This extracts data without checking the signature.
  const data = jwt.decode(token)

  // OPTION 2: Manual zero-dependency decode
  const parts = token.split('.')
  const payload = JSON.parse(
    Buffer.from(parts[1], 'base64').toString()
  )

  return Response.json({ payload: data  })
}