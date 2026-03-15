import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gray-100">

      {/* Navbar */}
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
              <Link href="/about" className="text-blue-600 font-semibold">About</Link>
            </li>
            <li>
              <Link href="/services" className="hover:text-blue-600">Services</Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-blue-600">Contact</Link>
            </li>
          </ul>

          <Link href="/login">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
              Login
            </button>
          </Link>
        </div>
      </nav>

      {/* Heading */}
      <section className="p-10 text-center">
        <h2 className="text-3xl font-semibold">About Us</h2>
      </section>

      {/* Core Information */}
      <section className="max-w-6xl mx-auto px-6 pb-16">

        <div className="grid md:grid-cols-3 gap-8">

          {/* Mission */}
          <div className="bg-white p-6 rounded-lg shadow-md text-center
          transition-shadow duration-300 hover:shadow-xl">
            <h3 className="text-xl font-semibold text-blue-600">Our Mission</h3>
            <p className="mt-3 text-gray-600">
              Our mission is to empower individuals to take control of their
              finances by offering a reliable and easy-to-use expense tracking
              platform.
            </p>
          </div>

          {/* Vision */}
          <div className="bg-white p-6 rounded-lg shadow-md text-center
          transition-shadow duration-300 hover:shadow-xl">
            <h3 className="text-xl font-semibold text-blue-600">Our Vision</h3>
            <p className="mt-3 text-gray-600">
              We aim to help users build better financial habits through
              clear insights and organized expense management.
            </p>
          </div>

          {/* Why Choose */}
          <div className="bg-white p-6 rounded-lg shadow-md text-center
          transition-shadow duration-300 hover:shadow-xl">
            <h3 className="text-xl font-semibold text-blue-600">
              Why Choose Expense Manager?
            </h3>
            <ul className="mt-3 text-gray-600 space-y-2">
              <li>✔ Simple & user-friendly</li>
              <li>✔ Responsive design</li>
              <li>✔ Accurate tracking</li>
              <li>✔ Secure data handling</li>
            </ul>
          </div>
        </div>

        {/* Website Builder Section */}
        <div className="mt-12 bg-white p-8 rounded-lg shadow-md
        transition-shadow duration-300 hover:shadow-xl">
          <h3 className="text-2xl font-semibold text-blue-600 text-center">
            About This Website
          </h3>

          <p className="mt-4 text-gray-600 text-center max-w-3xl mx-auto">
            This website is a personal project developed to demonstrate modern
            web development skills and best practices. It serves as a functional
            expense management platform, showcasing clean UI design, responsive
            layout, and interactive features built with Next.js and Tailwind CSS.
          </p>

          <div className="grid md:grid-cols-2 gap-8 mt-8">

            <div>
              <h4 className="text-lg font-semibold text-gray-800">
                Technologies Used
              </h4>
              <ul className="mt-3 text-gray-600 space-y-2">
                <li>• Next.js for fast and scalable frontend</li>
                <li>• Tailwind CSS for clean and responsive UI</li>
                <li>• JavaScript for interactivity and dynamic features</li>
                <li>• Node.js and MongoDB for backend data handling</li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-gray-800">
                Purpose & Learning
              </h4>
              <p className="mt-3 text-gray-600">
                The purpose of this project is to apply practical web development
                skills, including frontend design, backend integration, and
                responsive layouts, while creating a real-world application that
                can help users track expenses efficiently.
              </p>
            </div>

          </div>
        </div>

        {/* Built By Section */}
        <div className="mt-12 bg-blue-100 text-gray-800 p-8 rounded-lg shadow-md text-center
        transition-shadow duration-300 hover:shadow-xl">
          <h3 className="text-2xl font-semibold">Built By</h3>
          <p className="mt-3 text-lg font-medium">YUG VIROJA</p>
          <p className="mt-1 text-sm">Darshan University, Rajkot, India</p>
          <p className="mt-3">
            This project is built as part of learning and implementing modern
            full-stack web development techniques with a focus on clean UI,
            performance, and usability.
          </p>

          <div className="mt-4">
            <p className="font-semibold">Role:</p>
            <p> • Frontend Developer • UI Designer • Project Builder</p>
          </div>
        </div>

      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-300 py-8">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
          <p>
            &copy; {new Date().getFullYear()} Expense Manager. All rights reserved.
          </p>
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
