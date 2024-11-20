import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Mail,
  Globe,
  Clock,
  Send,
  HeadphonesIcon,
  TwitterIcon,
  LinkedinIcon,
  FacebookIcon,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Footer from "@/components/Footer";
import Image from "next/image";
import PublicNav from "@/components/PublicNav";

const ContactPage = () => {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 via-gray-50 to-gray-100 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      <PublicNav />

      {/* Hero Section */}
      <section
        className="relative overflow-hidden pt-24"
        aria-label="About Hero"
      >
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-50 dark:opacity-30" />

        <div className="relative px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <Badge variant="outline" className="mb-8 animate-fade-in">
              <HeadphonesIcon className="h-3 w-3 mr-1" />
              24/7 Support Available
            </Badge>

            <div className="flex flex-col lg:flex-row items-center gap-12">
              <div className="flex-1">
                <h1 className="text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 dark:text-white mb-6 animate-fade-in-up">
                  Get in <span className="text-primary">Touch</span>
                </h1>

                <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mb-8 animate-fade-in-up delay-100">
                  Have questions about ChessHub? We&apos;re here to help! Choose
                  your preferred way to reach us and we&apos;ll get back to you
                  as soon as possible.
                </p>
              </div>

              <div className="flex-1 flex justify-center">
                <Image
                  width={500}
                  height={500}
                  src="/images/chesshub.png"
                  alt="ChessHub Team"
                  className="w-full max-w-md rounded-lg shadow-2xl animate-float"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Contact Section */}
      <section className="py-12 px-6" aria-label="Contact Information">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Information Cards */}
            <div className="space-y-6">
              <ContactCard
                icon={<Mail />}
                title="Email Us"
                description="support@chesshub.com"
                subtitle="Response within 24 hours"
              />
              <ContactCard
                icon={<Globe />}
                title="Live Chat"
                description="Available 24/7"
                subtitle="Typical response in 5 minutes"
              />
              <ContactCard
                icon={<Clock />}
                title="Business Hours"
                description="Monday - Friday"
                subtitle="9:00 AM - 6:00 PM EST"
              />
            </div>

            {/* Contact Form */}
            <Card className="lg:col-span-2 bg-white/50 dark:bg-gray-800/50">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Send us a message
                </h2>
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-900 dark:text-gray-200">
                        First Name
                      </label>
                      <Input placeholder="John" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-900 dark:text-gray-200">
                        Last Name
                      </label>
                      <Input placeholder="Doe" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-900 dark:text-gray-200">
                      Email
                    </label>
                    <Input type="email" placeholder="john@example.com" />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-900 dark:text-gray-200">
                      Topic
                    </label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a topic" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General Inquiry</SelectItem>
                        <SelectItem value="support">
                          Technical Support
                        </SelectItem>
                        <SelectItem value="billing">Billing</SelectItem>
                        <SelectItem value="partnership">Partnership</SelectItem>
                        <SelectItem value="feedback">Feedback</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-900 dark:text-gray-200">
                      Message
                    </label>
                    <Textarea
                      placeholder="How can we help you?"
                      className="min-h-[150px]"
                    />
                  </div>

                  <Button type="submit" size="lg" className="w-full">
                    Send Message
                    <Send className="ml-2 h-4 w-4" />
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section
        className="py-16 px-6 bg-gray-50 dark:bg-gray-900"
        aria-label="FAQ"
      >
        <div className="mx-auto max-w-7xl">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Frequently Asked Questions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FaqCard
              question="How do I reset my password?"
              answer="You can reset your password by clicking the 'Forgot Password' link on the login page. Follow the instructions sent to your email to create a new password."
            />
            <FaqCard
              question="Can I upgrade my membership?"
              answer="Yes! You can upgrade your membership at any time from your account settings. Premium members get access to advanced analytics and training features."
            />
            <FaqCard
              question="How do I report a bug?"
              answer="Use our bug reporting form in the Help Center or contact our support team directly. Please include as much detail as possible about the issue."
            />
            <FaqCard
              question="What payment methods do you accept?"
              answer="We accept all major credit cards, PayPal, and various local payment methods. All transactions are secure and encrypted."
            />
          </div>
        </div>
      </section>

      {/* Social Links */}
      <section className="py-12 px-6" aria-label="Social Media">
        <div className="mx-auto max-w-7xl text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Follow Us
          </h2>
          <div className="flex justify-center gap-6">
            <SocialLink icon={<TwitterIcon />} href="#" label="Twitter" />
            <SocialLink icon={<LinkedinIcon />} href="#" label="LinkedIn" />
            <SocialLink icon={<FacebookIcon />} href="#" label="Facebook" />
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
};

const ContactCard = ({ icon, title, description, subtitle }) => (
  <Card className="bg-white dark:bg-gray-800/50">
    <CardContent className="p-6">
      <div className="flex items-start gap-4">
        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
          {React.cloneElement(icon, { className: "h-5 w-5 text-primary" })}
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
            {title}
          </h3>
          <p className="text-gray-600 dark:text-gray-400">{description}</p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
            {subtitle}
          </p>
        </div>
      </div>
    </CardContent>
  </Card>
);

const FaqCard = ({ question, answer }) => (
  <Card className="bg-white dark:bg-gray-800/50">
    <CardContent className="p-6">
      <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
        {question}
      </h3>
      <p className="text-gray-600 dark:text-gray-400">{answer}</p>
    </CardContent>
  </Card>
);

const SocialLink = ({ icon, href, label }) => (
  <a
    href={href}
    className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors"
    aria-label={label}
  >
    {React.cloneElement(icon, { className: "h-5 w-5 text-primary" })}
  </a>
);

export default ContactPage;
