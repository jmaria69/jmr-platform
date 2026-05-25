import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const secret = new TextEncoder().encode(
    process.env.JWT_SECRET || 'your-secret-key-min-32-characters-long'
);

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
        const token = request.cookies.get('auth_token')?.value;

        if (!token) {
            return NextResponse.redirect(new URL('/admin/login', request.url));
        }

        try {
            await jwtVerify(token, secret);
            return NextResponse.next();
        } catch (err) {
            return NextResponse.redirect(new URL('/admin/login', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*'],
};