import Link from "next/link";
import { BarChart3, Wallet, Calendar, FileText, ShieldCheck, TrendingUp } from "lucide-react";

export default function ServicesPage() {
  return (
    <main className="min-h-screen bg-gray-100">

      {/* Navbar (UNCHANGED) */}
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-blue-600">
            Expense Manager
          </Link>

          <ul className="flex space-x-6 text-gray-700 font-medium">
            <li><Link href="/" className="hover:text-blue-600">Home</Link></li>
            <li><Link href="/about" className="hover:text-blue-600">About</Link></li>
            <li>
              <Link href="/services" className="text-blue-600 font-semibold">
                Services
              </Link>
            </li>
            <li><Link href="/contact" className="hover:text-blue-600">Contact</Link></li>
          </ul>

          <Link href="/login">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
              Login
            </button>
          </Link>
        </div>
      </nav>

      {/* ===== Services Hero Section ===== */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-500 text-white py-16 text-center">
        <h1 className="text-4xl font-bold">Our Services</h1>
        <p className="mt-4 max-w-2xl mx-auto text-blue-100">
          Powerful tools designed to help you track, manage, and optimize your finances effortlessly.
        </p>
      </section>

      {/* ===== Services Cards ===== */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">

          {/* Card 1 */}
          <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition">
            <Wallet className="text-blue-600 w-10 h-10 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Expense Tracking</h3>
            <p className="text-gray-600">
              Easily record daily expenses and categorize your spending for better control.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition">
            <BarChart3 className="text-blue-600 w-10 h-10 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Spending Analysis</h3>
            <p className="text-gray-600">
              Visual insights and summaries help you understand where your money goes.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition">
            <Calendar className="text-blue-600 w-10 h-10 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Monthly Budgeting</h3>
            <p className="text-gray-600">
              Set monthly budgets and stay informed with real-time expense tracking.
            </p>
          </div>

          {/* Card 4 */}
          <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition">
            <FileText className="text-blue-600 w-10 h-10 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Financial Reports</h3>
            <p className="text-gray-600">
              Generate clear and detailed reports to review your financial performance.
            </p>
          </div>

          {/* Card 5 */}
          <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition">
            <TrendingUp className="text-blue-600 w-10 h-10 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Smart Insights</h3>
            <p className="text-gray-600">
              Get suggestions and trends to improve savings and reduce overspending.
            </p>
          </div>

          {/* Card 6 */}
          <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition">
            <ShieldCheck className="text-blue-600 w-10 h-10 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Secure Data</h3>
            <p className="text-gray-600">
              Your financial data is protected with strong security and privacy standards.
            </p>
          </div>

        </div>
      </section>

      {/* ===== Call To Action ===== */}
      <section className="bg-blue-50 py-14 text-center">
        <h2 className="text-3xl font-semibold text-gray-800">
          Take Control of Your Finances Today
        </h2>
        <p className="mt-4 text-gray-600 max-w-xl mx-auto">
          Start tracking expenses, planning budgets, and making smarter financial decisions with ease.
        </p>
        <Link href="/login">
          <button className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition">
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
