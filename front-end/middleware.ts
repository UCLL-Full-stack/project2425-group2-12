import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { roleRedirectPaths } from '@/constants';

const JWT_SECRET = process.env.NEXT_PUBLIC_JWT_SECRET || 'super_secure_secret';

export function middleware(req: NextRequest) {
//   try {
//     // Retrieve token from Authorization header
//     const authHeader = req.headers.get('authorization');
//     if (!authHeader || !authHeader.startsWith('Bearer ')) {
//       console.warn('Authorization header missing or malformed.');
//       return NextResponse.redirect(new URL('/login', req.url));
//     }

//     const token = authHeader.split(' ')[1];
//     console.log('Token extracted from Authorization header:', token);

//     // Verify and decode the token
//     const decoded = jwt.verify(token, JWT_SECRET) as { role: string };
//     console.log('Decoded token:', decoded);

//     if (!decoded.role) {
//       console.error('Role not found in token:', decoded);
//       return NextResponse.redirect(new URL('/login', req.url));
//     }

//     // Determine redirect path based on role
//     const rolePath = roleRedirectPaths[decoded.role] || '/login';
//     if (!req.nextUrl.pathname.startsWith(rolePath)) {
//       console.log(`Redirecting to role-based path: ${rolePath}`);
//       return NextResponse.redirect(new URL(rolePath, req.url));
//     }

//     // Allow the request to proceed
//     return NextResponse.next();
//   } catch (error) {
//     console.error('Error in middleware:', error);
//     return NextResponse.redirect(new URL('/login', req.url));
//   }
// }

// // Config to apply middleware to all paths except static assets
// export const config = {
//   matcher: ['/((?!_next|api|static|favicon.ico).*)'],
// };

return NextResponse.next();
}