import Link from "next/link";
import router from "next/navigation";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-100">

      {/* Navbar (UNCHANGED) */}
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

          <Link href="/" className="text-2xl font-bold text-blue-600">
            Expense Manager
          </Link>

          <ul className="flex space-x-6 text-gray-700 font-medium">
            <li>
              <Link href="/" className="text-blue-600 font-semibold">
                Home
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-blue-600">
                About
              </Link>
            </li>
            <li>
              <Link href="/services" className="hover:text-blue-600">
                Services
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-blue-600">
                Contact
              </Link>
            </li>
          </ul>

          <Link href="/login">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
              Login
            </button>
          </Link>

        </div>
      </nav>

      {/* ===== Hero Section ===== */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-500 text-white py-20 text-center">
        <h1 className="text-4xl font-bold">
          Manage Your Expenses Smarter
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-blue-100">
          Track daily expenses, manage budgets, and gain insights into your
          spending habits with a simple and powerful expense manager.
        </p>

        <div className="mt-6 flex justify-center space-x-4">
          <Link href="/login">
            <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100">
              Get Started
            </button>
          </Link>
          <Link href="/services">
            <button className="border border-white px-6 py-3 rounded-lg hover:bg-white hover:text-blue-600">
              View Services
            </button>
          </Link>
        </div>
      </section>

      {/* ===== Features Section ===== */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-semibold text-center">
          Why Use Expense Manager?
        </h2>

        <div className="grid md:grid-cols-3 gap-8 mt-10">

          <div className="bg-white p-6 rounded-lg shadow-md text-center
          transition-shadow duration-300 hover:shadow-xl">
            <h3 className="text-xl font-semibold text-blue-600">
              Easy Expense Tracking
            </h3>
            <p className="mt-3 text-gray-600">
              Record your daily expenses quickly and keep everything organized
              in one place.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md text-center
          transition-shadow duration-300 hover:shadow-xl">
            <h3 className="text-xl font-semibold text-blue-600">
              Budget Management
            </h3>
            <p className="mt-3 text-gray-600">
              Set monthly budgets and monitor your spending to avoid overspending.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md text-center
          transition-shadow duration-300 hover:shadow-xl">
            <h3 className="text-xl font-semibold text-blue-600">
              Clear Financial Insights
            </h3>
            <p className="mt-3 text-gray-600">
              Understand your spending habits through clear summaries and reports.
            </p>
          </div>

        </div>
      </section>

      {/* ===== How It Works ===== */}
      <section className="bg-gray-50 py-16">
        <h2 className="text-3xl font-semibold text-center">
          How It Works
        </h2>

        <div className="max-w-5xl mx-auto px-6 grid md:grid-cols-3 gap-8 mt-10 text-center">

          <div>
            <div className="text-4xl font-bold text-blue-600">1</div>
            <h3 className="mt-3 font-semibold text-lg">Add Expenses</h3>
            <p className="mt-2 text-gray-600">
              Enter your daily expenses with ease.
            </p>
          </div>

          <div>
            <div className="text-4xl font-bold text-blue-600">2</div>
            <h3 className="mt-3 font-semibold text-lg">Track & Analyze</h3>
            <p className="mt-2 text-gray-600">
              View organized data and analyze spending.
            </p>
          </div>

          <div>
            <div className="text-4xl font-bold text-blue-600">3</div>
            <h3 className="mt-3 font-semibold text-lg">Save Smarter</h3>
            <p className="mt-2 text-gray-600">
              Improve financial habits and save more.
            </p>
          </div>

        </div>
      </section>

      {/* ===== Call To Action ===== */}
      <section className="py-16 text-center">
        <h2 className="text-3xl font-semibold">
          Start Managing Your Expenses Today
        </h2>
        <p className="mt-4 text-gray-600 max-w-xl mx-auto">
          Join now and take control of your finances with a simple, secure, and
          efficient expense tracking system.
        </p>

        <Link href="/login">
          <button className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
            Get Started
          </button>
        </Link>
      </section>

      {/* Footer (UNCHANGED) */}
      <footer className="bg-gray-800 text-gray-300 py-8">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
          <p>&copy; {new Date().getFullYear()} Expense Manager. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="/" className="hover:text-white">Home</Link>
            <Link href="/about" className="hover:text-white">About</Link>
            <Link href="/services" className="hover:text-white">Services</Link>
            <Link href="/contact" className="hover:text-white">Contact</Link>
          </div>
        </div>
      </footer>

    </main>
  );
}
