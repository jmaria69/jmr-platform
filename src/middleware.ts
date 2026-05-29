import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, SESSION_COOKIE } from '@/lib/auth/session';

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Excluir /admin/demo de protección
    if (pathname === '/admin/demo') {
        return NextResponse.next();
    }

    if (pathname.startsWith('/admin') && !pathname.startsWith('/login')) {
        const token = request.cookies.get(SESSION_COOKIE)?.value;

        if (!token) {
            return NextResponse.redirect(new URL('/login', request.url));
        }

        try {
            const session = await verifyToken(token);
            if (!session) {
                return NextResponse.redirect(new URL('/login', request.url));
            }
        } catch {
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*'],
};