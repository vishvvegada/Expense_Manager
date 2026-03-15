import Link from "next/link";

export default function Contact() {
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
              <Link href="/" className="hover:text-blue-600">Home</Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-blue-600">About</Link>
            </li>
            <li>
              <Link href="/services" className="hover:text-blue-600">Services</Link>
            </li>
            <li>
              <Link href="/contact" className="text-blue-600 font-semibold">
                Contact
              </Link>
            </li>
          </ul>

          <Link href="/login">
            <button
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
              Login
            </button>
          </Link>
        </div>
      </nav>

      {/* Contact Content */}
      <section className="max-w-6xl mx-auto px-6 py-12">

        {/* Heading */}
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-blue-600">
            Contact Us
          </h2>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

          {/* LEFT SIDE - Contact Info ONLY */}
          <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition">

            {/* Highlight Box */}
            <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded-md mb-6">
              <p className="text-gray-700">
                💡 Feel free to contact us for any queries, suggestions,
                or feedback related to this project.
              </p>
            </div>

            {/* Contact Details */}
            <div className="space-y-4 text-gray-700 text-lg">
              <p>
                📧 <strong>Email:</strong> support@expensemanager.com
              </p>
              <p>
                📞 <strong>Phone:</strong> +91 12334 77466
              </p>
              <p>
                📍 <strong>Address:</strong> Rajkot, Gujarat, India
              </p>
            </div>
          </div>

          {/* RIGHT SIDE - Send Message */}
          <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition">
            <h3 className="text-xl font-semibold mb-6 text-gray-800">
              Send Us a Message
            </h3>

            <form className="space-y-4">
              <div>
                <label className="block text-gray-600 mb-1">
                  Your Name
                </label>
                <input
                  type="text"
                  placeholder="Enter your name"
                  className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-600 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-600 mb-1">
                  Message
                </label>
                <textarea
                  rows={4}
                  placeholder="Write your message"
                  className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Send Message
              </button>
            </form>
          </div>

        </div>
      </section>
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
