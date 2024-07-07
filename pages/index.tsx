import Layout from '../components/Layout'

export default function Home() {
  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-screen py-2">
        <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
          <h1 className="text-6xl font-bold text-white mb-8">
            Welcome to Paddle
          </h1>
          <p className="text-2xl text-white mb-8">
            The Ultimate Personal Development and Lifestyle Management Solution
          </p>
          <div className="space-y-4 max-w-xl">
            <p className="text-white text-lg">
              Paddle helps you track your personal growth, manage your lifestyle choices, and stay accountable to your goals.
            </p>
            <p className="text-white text-lg">
              Whether you're a mentor guiding others or an individual committed to self-improvement, Paddle provides the tools you need to succeed.
            </p>
          </div>
        </main>
      </div>
    </Layout>
  )
}
