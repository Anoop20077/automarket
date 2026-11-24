import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-8xl font-black text-primary-600 dark:text-primary-400">404</h1>
      <h2 className="text-3xl font-bold mt-4 text-gray-900 dark:text-white">Page Not Found</h2>
      <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-md">
        The vehicle or page you are looking for doesn't exist or may have been removed.
      </p>
      <Link href="/" className="btn-primary mt-6 inline-block">
        Return to Home
      </Link>
    </div>
  );
}
