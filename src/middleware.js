import { NextRequest, NextResponse } from 'next/server'
import * as jose from 'jose';
import { generateAccessToken, verifyAccessToken, verifyRefreshToken } from './utils/auth';
import { redirect } from 'next/dist/server/api-utils';
const { pathToRegexp } = require("path-to-regexp");

export async function middleware(request) {
    // return NextResponse.next();

    //  console.log("middlewawre 1----->",request.nextUrl)
    let accessToken = request.cookies.get('token')?.value;
    let refreshToken = request.cookies.get('refresh-token')?.value;
    const refreshTokenPayload = await verifyRefreshToken(refreshToken);
    const accessTokenPayload =await verifyAccessToken(accessToken)
    if (!refreshTokenPayload) {
    //    console.log("NextResponse-->",request.nextUrl.pathname)
       return NextResponse.next();
        // return NextResponse.redirect(new URL('/', request.url));
    }
    if (!accessTokenPayload) {
        const newAccessToken = await generateAccessToken({ phone: refreshTokenPayload.phone, role: refreshTokenPayload.role });
        const response = NextResponse.next()
        response.cookies.set({
            name: 'token',
            value: newAccessToken,
            path: '/',
            httpOnly: true,
        })
        return response
    }
    // }
    // console.log("<---- MiddleWare is ok---->",verifyAccessToken(accessToken))
    return NextResponse.next();
}

export const config = {
    matcher: ['/p-modir/:path*',  '/((?!api|api/auth|api/unit|api/user|_next/static|_next/image|auth|favicon.ico|robots.txt|images|fonts|$).*)']
}

// // '/api/:path*',
// , '/((?!api/auth|_next/static|_next/image|auth|favicon.ico|robots.txt|images|$).*)'

// if (request.nextUrl.pathname.startsWith('/')) {
//     return NextResponse.rewrite(new URL('/p-modir', request.url))
// }



// const paths = [

//     "/p-modir",
//     "/favicon.ico",
//     "/_next/something",
//     "/a",
//   ];
  
//   const matcher = pathToRegexp("/((?!about|contact|sales).{1,})");
  
//   paths.forEach((path) => {
//     console.log({ path, test: matcher.test(path) });
//   });

// if (request.nextUrl.pathname.startsWith('/p-lecturer/verify')) {
//     // console.log("Hiiiii")    
//     return NextResponse.redirect(new URL('https://amar.razaviedu.ir/account/login', request.url))
    
// }