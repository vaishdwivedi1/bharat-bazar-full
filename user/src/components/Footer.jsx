// components/Footer.jsx
import React from "react";
import {
  MapPin,
  Phone,
  Mail,
  Linkedin,
  Twitter,
  Facebook,
  Instagram,
} from "lucide-react";

const Footer = () => {
  const topCategories = [
    "Electronics & Electrical",
    "Textiles & Apparel",
    "Industrial Supplies",
    "Food & Agriculture",
    "Building Materials",
    "Furniture & Decor",
  ];

  const quickLinks = [
    "About Us",
    "Sell on JummaBaba",
    "Post Requirement",
    "Buyer Dashboard",
    "Help Center",
    "Contact Us",
  ];

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-2xl font-bold text-white mb-4">bharatBazar</h3>
            <p className="text-sm mb-4">
              India's leading B2B marketplace connecting buyers with verified
              suppliers for wholesale and bulk buying.
            </p>
          </div>

          {/* Top Categories */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">
              Top Categories
            </h4>
            <ul className="space-y-2">
              {topCategories.map((cat) => (
                <li key={cat}>
                  <a
                    href="#"
                    className="hover:text-[hsl(24,100%,50%)] transition-colors"
                  >
                    {cat}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="hover:text-[hsl(24,100%,50%)] transition-colors"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">
              Contact Us
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 flex-shrink-0 text-[hsl(24,100%,50%)]" />
                <span className="text-sm">
                  123 Business Hub, Andheri East, Mumbai - 400069, India
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-[hsl(24,100%,50%)]" />
                <span>+91 1800-XXX-XXXX</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-[hsl(24,100%,50%)]" />
                <span>support@bharatBazar</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Social Links */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex space-x-4 mb-4 md:mb-0">
              <a
                href="#"
                className="hover:text-[hsl(24,100%,50%)] transition-colors"
              >
                <Facebook size={20} />
              </a>
              <a
                href="#"
                className="hover:text-[hsl(24,100%,50%)] transition-colors"
              >
                <Twitter size={20} />
              </a>
              <a
                href="#"
                className="hover:text-[hsl(24,100%,50%)] transition-colors"
              >
                <Linkedin size={20} />
              </a>
              <a
                href="#"
                className="hover:text-[hsl(24,100%,50%)] transition-colors"
              >
                <Instagram size={20} />
              </a>
            </div>
            <div className="text-sm text-center">
              © 2024 bharatBazar. All rights reserved.
            </div>
            <div className="flex gap-4 text-sm mt-4 md:mt-0">
              <a href="#" className="hover:text-[hsl(24,100%,50%)]">
                Privacy Policy
              </a>
              <span>|</span>
              <a href="#" className="hover:text-[hsl(24,100%,50%)]">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
