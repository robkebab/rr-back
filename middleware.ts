import { next } from '@vercel/functions';

const ROLLING_RELEASE_COOKIE = '_vcrr';

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
  runtime: 'nodejs',
};

export default function middleware(request: Request) {
  // Get all cookies as an array of { name, value } objects
  const cookies =
    request.headers
      .get('Cookie')
      ?.split(';')
      .map((pair) => {
        const [name, ...rest] = pair.trim().split('=');
        return { name, value: rest.join('=') };
      }) ?? [];

  // Find the cookie that starts with the ROLLING_RELEASE_COOKIE
  const rrCookie = cookies.find((cookie) =>
    cookie.name.startsWith(ROLLING_RELEASE_COOKIE),
  );

  console.log(
    JSON.stringify({
      path: request.url,
      cookie: rrCookie?.value ?? null,
      timestamp: new Date().toISOString(),
    }),
  );

  // eslint-disable-next-line
  return next();
}
