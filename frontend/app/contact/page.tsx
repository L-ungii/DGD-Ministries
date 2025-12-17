export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-100 pt-[12vh]">
      {/* Header */}
      <div className="bg-blue-950 text-white py-16">
        <div className="w-[90%] xl:w-[80%] mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Contact Us</h1>
          <p className="text-gray-200 max-w-2xl mx-auto">
            We would love to hear from you. Reach out for prayers, questions, or
            any inquiries about Divine Grace & Deliverance Ministries.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="w-[90%] xl:w-[80%] mx-auto py-16 grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Contact Info */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-semibold mb-6 text-blue-950">
            Get in Touch
          </h2>

          <div className="space-y-4 text-gray-700">
            <p>
              <span className="font-semibold">Address:</span>
              <br />
              73 Signal Hill <br />
              Mahikeng <br />
              North west <br />
              South Africa
            </p>

            <p>
              <span className="font-semibold">📞 Phone:</span>
              <br />
              +27722462869
            </p>

            <p>
              <span className="font-semibold">⏰ Service Times:</span>
              <br />
              Sundays: 10:00 AM & 11:00 AM
              <br />
            </p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-semibold mb-6 text-blue-950">
            Send Us a Message
          </h2>

          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Full Name
              </label>
              <input
                type="text"
                placeholder="Your name"
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Email Address
              </label>
              <input
                type="email"
                placeholder="your@email.com"
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Message</label>
              <textarea
                rows={5}
                placeholder="Write your message here..."
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-900"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-950 text-white py-3 rounded-md font-semibold hover:bg-blue-900 transition"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
