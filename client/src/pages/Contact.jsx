import React from "react";

const Contact = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">

        {/* Header */}
        <div className="text-center px-6 py-10 bg-gray-50 border-b border-gray-200">
          <p className="text-sm font-medium text-gray-500 mb-3">
            GET IN TOUCH
          </p>

          <h1 className="text-3xl md:text-4xl font-semibold text-gray-900">
            Let's talk about your project.
          </h1>

          <p className="text-gray-500 mt-4 max-w-xl mx-auto">
            Have a question or an idea? We'd love to hear from you.
            Send us a message and we'll get back to you soon.
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-2">

          {/* Contact Information */}
          <div className="bg-gray-50 p-8 md:p-10">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              Contact information
            </h2>

            <p className="text-gray-500 text-sm leading-6 mb-8">
              Feel free to reach out using the details below or fill out
              the contact form.
            </p>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="bg-white border border-gray-200 rounded-lg p-3">
                  <span className="text-gray-700">✉</span>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-900">
                    Email
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    hello@example.com
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-white border border-gray-200 rounded-lg p-3">
                  <span className="text-gray-700">☎</span>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-900">
                    Phone
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    +91 98765 43210
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-white border border-gray-200 rounded-lg p-3">
                  <span className="text-gray-700">⌖</span>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-900">
                    Location
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Himachal Pradesh, India
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-10 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                We usually respond within 24–48 hours.
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="p-8 md:p-10">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Send us a message
            </h2>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert("Message submitted successfully!");
              }}
              className="space-y-5"
            >
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Full name
                </label>

                <input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  required
                  className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Email address
                </label>

                <input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  required
                  className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
                />
              </div>

              <div>
                <label
                  htmlFor="subject"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Subject
                </label>

                <input
                  id="subject"
                  type="text"
                  placeholder="How can we help?"
                  required
                  className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Message
                </label>

                <textarea
                  id="message"
                  rows="4"
                  placeholder="Write your message here..."
                  required
                  className="w-full resize-none rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-lg bg-gray-900 px-6 py-3.5 text-sm font-medium text-white transition hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
              >
                Send Message →
              </button>

              <p className="text-xs text-center text-gray-400">
                Your information will be kept private.
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;