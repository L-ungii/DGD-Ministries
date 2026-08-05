import PrayerForm from "@/components/PrayerForm";
import Reveal from "@/components/Reveal";

export const metadata = {
  title: "Prayer Requests — DGD Ministries",
  description:
    "Submit a prayer request and our ministry team will stand with you in prayer.",
};

export default function PrayerPage() {
  return (
    <div className="min-h-screen bg-gray-100 pt-[12vh]">
      <div className="bg-blue-950 text-white py-16">
        <div className="w-[90%] xl:w-[80%] mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Prayer Requests
          </h1>
          <p className="text-gray-200 max-w-2xl mx-auto">
            &ldquo;Again I say unto you, that if two of you shall agree on earth
            as touching any thing that they shall ask, it shall be done for them
            of my Father which is in heaven.&rdquo; — Matthew 18:19
          </p>
        </div>
      </div>

      <div className="w-[90%] xl:w-[80%] max-w-2xl mx-auto py-16">
        <Reveal>
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-semibold mb-2 text-blue-950">
              Let us pray with you
            </h2>
            <p className="text-gray-600 text-sm mb-8">
              Share whatever is on your heart. Our ministry team reads every
              request and prays over it.
            </p>

            <PrayerForm />
          </div>
        </Reveal>
      </div>
    </div>
  );
}
