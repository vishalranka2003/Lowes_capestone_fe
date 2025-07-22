import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Calendar, Wrench, Users, ArrowRight, CheckCircle } from 'lucide-react';

export const Home = () => {
  const features = [
    {
      icon: Shield,
      title: "Warranty Protection",
      description: "Never lose track of your appliance warranties with automated tracking"
    },
    {
      icon: Calendar,
      title: "Smart Reminders",
      description: "Get notified before your warranties expire and service due dates"
    },
    {
      icon: Wrench,
      title: "Easy Service Booking",
      description: "Schedule maintenance and repairs with certified technicians"
    },
    {
      icon: Users,
      title: "Expert Support",
      description: "Access to verified professionals for all your appliance needs"
    }
  ];

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-100 via-white to-blue-50 py-20 px-6 sm:px-8 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-7 gap-8 items-center min-h-[32rem] justify-center">
            {/* Hero Text */}
            <div className="space-y-8 animate-fade-in-up animation-delay-200 flex flex-col justify-center h-full items-start col-span-7 lg:col-span-4">
              <div className="flex items-center space-x-3 mb-6">
                <span className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 mr-2">
                  <Shield className="h-7 w-7 text-blue-600" />
                </span>
                <h1 className="text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900 drop-shadow-xl">
                  Service Pro
                </h1>
              </div>
              <div className="text-gray-700 text-xl font-medium mb-6 max-w-2xl">
                Effortlessly manage, track, and protect all your home appliances in one place.
              </div>
              <div className="text-gray-400 text-base mb-6 max-w-2xl">
                Trusted by thousands of homeowners and certified technicians across the country.
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  to="/signup" 
                  className="inline-flex items-center justify-center px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-lg transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 text-lg"
                >
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </div>
            </div>

            {/* Hero Visual */}
            <div className="flex justify-end items-center h-full animate-fade-in-up animation-delay-400 col-span-7 lg:col-span-3">
              <div className="bg-white/90 rounded-2xl p-8 shadow-xl border border-gray-200/50 backdrop-blur-sm transition-all duration-300 hover:scale-105 flex flex-col justify-center">
                <img
                  src="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=400&q=80"
                  alt="Modern TV"
                  className="rounded-xl w-40 h-40 object-cover mx-auto mb-4 border-4 border-blue-200 shadow"
                />
                <div className="flex items-center justify-between mb-2 w-full">
                  <h3 className="text-xl font-semibold text-gray-900 mt-0">Apple iPhone 16 Pro</h3>
                  <span className="inline-flex items-center px-4 py-2 bg-green-500/30 text-green-800 rounded-full text-sm font-medium ml-3">
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Active
                  </span>
                </div>
                <div className="space-y-4 mt-0">
                  <div className="space-y-2">
                    <p className="text-gray-600 text-sm">
                      <span className="font-medium">Model:</span> RF28R7351SG
                    </p>
                    <p className="text-gray-600 text-sm">
                      <span className="font-medium">Warranty Start:</span> Jan 15, 2024
                    </p>
                    <p className="text-gray-600 text-sm">
                      <span className="font-medium">Warranty Expires:</span> Jan 15, 2026 (45 days left)
                    </p>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-400 h-2 rounded-full transition-all duration-500" style={{ width: '75%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-6 sm:px-8 lg:px-12 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 animate-fade-in-up animation-delay-200">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Service Pro?
            </h2>
            <div className="w-24 h-1 bg-blue-600 mx-auto rounded"></div>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="bg-white/90 rounded-2xl p-6 shadow-xl border border-gray-200/50 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-2xl animate-fade-in-up"
                style={{ animationDelay: `${(index + 3) * 200}ms` }}
              >
                <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 text-blue-600 rounded-full mb-6">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};