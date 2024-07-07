import Layout from '../components/Layout'

export default function Home() {
  return (
    <Layout>
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-4">
          Welcome to Paddle
        </h1>
        <p className="text-xl text-white mb-8">
          The Ultimate Personal Development and Lifestyle Management Solution
        </p>
        <div className="space-y-4">
          <p className="text-white">
            Paddle helps you track your personal growth, manage your lifestyle choices, and stay accountable to your goals.
          </p>
          <p className="text-white">
            Whether you're a mentor guiding others or an individual committed to self-improvement, Paddle provides the tools you need to succeed.
          </p>
        </div>
      </div>
    </Layout>
  )
}
