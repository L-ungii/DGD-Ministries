import ContactForm from "@/components/ContactForm";
import Reveal from "@/components/Reveal";
import Link from "next/link";

export const metadata = {
  title: "Contact Us — DGD Ministries",
  description:
    "Reach Divine Grace & Deliverance Ministries in Mahikeng for prayers, questions or any inquiries.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-100 pt-[12vh]">
      {/* Header */}
      <div className="bg-blue-950 text-white py-16">
        <div className="w-[90%] xl:w-[80%] mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Contact Us</h1>
          <p className="text-gray-200 max-w-2xl mx-auto">
            We would love to hear from you. Reach out for prayers, questions, or
            any inquiries about Divine Grace &amp; Deliverance Ministries.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="w-[90%] xl:w-[80%] mx-auto py-16 grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Contact Info */}
        <Reveal>
          <div className="bg-white rounded-lg shadow-md p-8 h-full">
            <h2 className="text-2xl font-semibold mb-6 text-blue-950">
              Get in Touch
            </h2>

            <div className="space-y-4 text-gray-700">
              <p>
                <span className="font-semibold">📍 Address:</span>
                <br />
                73 Signal Hill <br />
                Mahikeng <br />
                North West <br />
                South Africa
              </p>

              <p>
                <span className="font-semibold">📞 Phone:</span>
                <br />
                <a
                  href="tel:+27722462869"
                  className="text-blue-900 hover:underline"
                >
                  +27 72 246 2869
                </a>
              </p>

              <p>
                <span className="font-semibold">⏰ Service Times:</span>
                <br />
                Sundays: 10:00 AM &amp; 11:00 AM
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-100">
              <p className="text-sm text-gray-600 mb-3">
                Need prayer instead? We would love to stand with you.
              </p>
              <Link
                href="/prayer"
                className="inline-block px-6 py-2.5 border-2 border-blue-950 text-blue-950 rounded-lg font-semibold hover:bg-blue-950 hover:text-white transition-all duration-300"
              >
                🙏 Submit a Prayer Request
              </Link>
            </div>
          </div>
        </Reveal>

        {/* Contact Form */}
        <Reveal delay={120}>
          <div className="bg-white rounded-lg shadow-md p-8 h-full">
            <h2 className="text-2xl font-semibold mb-6 text-blue-950">
              Send Us a Message
            </h2>

            <ContactForm />
          </div>
        </Reveal>
      </div>
    </div>
  );
}
