import React from "react";
import Footer from "../components/Footer";

function Privacy() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          Privacy Policy
        </h1>
        <p className="text-sm text-gray-600 mb-8">
          Last Updated: January 10, 2026
        </p>

        <div className="bg-white rounded-lg shadow-md p-8 space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              1. Introduction
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Welcome to EcoCode. We are committed to protecting your personal
              information and your right to privacy. This Privacy Policy
              explains how we collect, use, disclose, and safeguard your
              information when you use our flood monitoring and alert
              application.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              2. Information We Collect
            </h2>

            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-4">
              2.1 Personal Information
            </h3>
            <p className="text-gray-700 leading-relaxed mb-3">
              We collect personal information that you voluntarily provide when
              registering or using our services:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Name and email address</li>
              <li>Phone number (for SMS alerts)</li>
              <li>Location data (to provide localized flood alerts)</li>
              <li>Account credentials (encrypted passwords)</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-4">
              2.2 Automatically Collected Information
            </h3>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Device information (browser type, operating system)</li>
              <li>IP address and general location</li>
              <li>Usage data (pages visited, features used)</li>
              <li>Cookies and similar tracking technologies</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-4">
              2.3 Location Data
            </h3>
            <p className="text-gray-700 leading-relaxed">
              With your permission, we collect precise location data to provide
              accurate flood risk assessments and timely alerts for your area.
              You can disable location services at any time through your device
              settings.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              3. How We Use Your Information
            </h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              We use the collected information for the following purposes:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>To provide and maintain our flood monitoring services</li>
              <li>To send critical flood alerts and notifications</li>
              <li>
                To personalize your experience and deliver relevant content
              </li>
              <li>To improve our application and develop new features</li>
              <li>
                To communicate with you about updates and safety information
              </li>
              <li>To analyze usage patterns and optimize performance</li>
              <li>To detect and prevent fraud or security issues</li>
              <li>To comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              4. Information Sharing and Disclosure
            </h2>

            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-4">
              4.1 Third-Party Services
            </h3>
            <p className="text-gray-700 leading-relaxed mb-3">
              We may share your information with trusted third-party service
              providers:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Weather and flood data providers</li>
              <li>SMS and notification services</li>
              <li>Cloud hosting providers</li>
              <li>Analytics platforms</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-4">
              4.2 Emergency Services
            </h3>
            <p className="text-gray-700 leading-relaxed">
              In emergency situations, we may share your location and contact
              information with emergency services or disaster response
              authorities to ensure your safety.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-4">
              4.3 Legal Requirements
            </h3>
            <p className="text-gray-700 leading-relaxed">
              We may disclose your information if required by law, court order,
              or governmental authority, or to protect our rights and safety.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              5. Data Security
            </h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              We implement industry-standard security measures to protect your
              personal information:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Encryption of data in transit and at rest</li>
              <li>Secure authentication mechanisms</li>
              <li>Regular security audits and updates</li>
              <li>Access controls and monitoring</li>
              <li>Secure data backup procedures</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-3">
              However, no method of transmission over the Internet is 100%
              secure, and we cannot guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              6. Your Privacy Rights
            </h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              You have the following rights regarding your personal information:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>
                <strong>Access:</strong> Request a copy of your personal data
              </li>
              <li>
                <strong>Correction:</strong> Update or correct inaccurate
                information
              </li>
              <li>
                <strong>Deletion:</strong> Request deletion of your account and
                data
              </li>
              <li>
                <strong>Opt-out:</strong> Unsubscribe from non-critical
                communications
              </li>
              <li>
                <strong>Data Portability:</strong> Request your data in a
                portable format
              </li>
              <li>
                <strong>Withdraw Consent:</strong> Revoke previously given
                permissions
              </li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-3">
              To exercise these rights, please contact us at privacy@ecocode.com
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              7. Cookies and Tracking
            </h2>
            <p className="text-gray-700 leading-relaxed">
              We use cookies and similar technologies to enhance your
              experience. You can control cookie preferences through your
              browser settings. Note that disabling cookies may affect
              application functionality.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              8. Children's Privacy
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Our services are not intended for children under 13 years of age.
              We do not knowingly collect personal information from children. If
              you believe we have collected information from a child, please
              contact us immediately.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              9. Data Retention
            </h2>
            <p className="text-gray-700 leading-relaxed">
              We retain your personal information only as long as necessary to
              fulfill the purposes outlined in this Privacy Policy, unless a
              longer retention period is required by law. Upon account deletion,
              we will remove or anonymize your data within 30 days.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              10. International Data Transfers
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Your information may be transferred to and processed in countries
              other than your own. We ensure appropriate safeguards are in place
              to protect your data in compliance with applicable laws.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              11. Changes to This Privacy Policy
            </h2>
            <p className="text-gray-700 leading-relaxed">
              We may update this Privacy Policy periodically. We will notify you
              of material changes via email or prominent notice within the
              application. Your continued use after changes constitutes
              acceptance of the updated policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              12. Contact Us
            </h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              If you have questions or concerns about this Privacy Policy,
              please contact us:
            </p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700">
                <strong>Email:</strong> privacy@ecocode.com
              </p>
              <p className="text-gray-700">
                <strong>Address:</strong> EcoCode Privacy Team, 123 Tech Avenue,
                San Francisco, CA 94105
              </p>
              <p className="text-gray-700">
                <strong>Phone:</strong> +1 (555) 123-4567
              </p>
            </div>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Privacy;
