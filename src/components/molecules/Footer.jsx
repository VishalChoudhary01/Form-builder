import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-slate-100 text-gray-700 px-4 py-6 md:px-10 md:py-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-12 text-sm md:text-base">
        {/* Column 1 */}
        <div>
          <h2 className="font-semibold text-lg mb-2">Your Form</h2>
          <p className="text-xs md:text-sm leading-relaxed">
            A powerful and flexible form builder for modern applications. Simplify data collection across platforms.
          </p>
        </div>

        {/* Column 2 */}
        <div>
          <h3 className="font-semibold text-lg mb-2">Quick Links</h3>
          <ul className="space-y-1">
            <li><a href="#" className="hover:underline">Home</a></li>
            <li><a href="#" className="hover:underline">Application</a></li>
            <li><a href="#" className="hover:underline">Support</a></li>
          </ul>
        </div>

        {/* Column 3 */}
        <div>
          <h3 className="font-semibold text-lg mb-2">Contact Us</h3>
          <p className="text-xs md:text-sm">Email: support@yourform.com</p>
          <p className="text-xs md:text-sm">Phone: +1 123 456 7890</p>
        </div>
      </div>

      {/* Bottom */}
      <div className="mt-6 pt-4 border-t border-gray-300 text-center text-xs md:text-sm text-gray-500">
        © {new Date().getFullYear()} Your Form. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
