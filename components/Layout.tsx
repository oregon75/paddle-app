import Head from 'next/head'
import Link from 'next/link'

type LayoutProps = {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
      <Head>
        <title>Paddle - Personal Development</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <nav className="bg-white shadow-lg">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-between">
            <div className="flex space-x-7">
              <div>
                <Link href="/" className="flex items-center py-4 px-2">
                  <span className="font-semibold text-gray-500 text-lg">Paddle</span>
                </Link>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Link href="/login" className="py-2 px-2 font-medium text-gray-500 rounded hover:bg-purple-500 hover:text-white transition duration-300">Log In</Link>
              <Link href="/register" className="py-2 px-2 font-medium text-white bg-purple-500 rounded hover:bg-purple-400 transition duration-300">Sign Up</Link>
            </div>
          </div>
        </div>
      </nav>
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  )
}
