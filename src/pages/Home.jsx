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
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Hero Text */}
            <div className="space-y-8">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                Welcome to <span className="text-blue-100">Service Pro</span>
              </h1>
              <p className="text-xl text-blue-100 leading-relaxed max-w-2xl">
                Track your appliances, manage service requests, and never miss a warranty again. 
                Your complete solution for appliance management and maintenance scheduling.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  to="/signup" 
                  className="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-50 transition-colors duration-200 shadow-lg hover:shadow-xl"
                >
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </div>
            </div>

            {/* Hero Visual */}
            <div className="flex justify-center">
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-2xl max-w-sm w-full">
                <div className="flex justify-end mb-6">
                  <span className="inline-flex items-center px-4 py-2 bg-green-500/20 text-green-100 rounded-full text-sm font-medium">
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Active
                  </span>
                </div>
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-white">Samsung Refrigerator</h3>
                  <p className="text-blue-100">Warranty expires in 45 days</p>
                  <div className="w-full bg-white/20 rounded-full h-2">
                    <div className="bg-green-400 h-2 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Service Pro?
            </h2>
            <div className="w-24 h-1 bg-blue-600 mx-auto"></div>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center p-6 rounded-xl hover:bg-gray-50 transition-colors duration-200">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 text-blue-600 rounded-full mb-6">
                  <feature.icon className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Ready to Protect Your Appliances?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of homeowners who trust Service Pro to manage their appliances
          </p>
          <Link 
            to="/signup" 
            className="inline-flex items-center justify-center px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            Start Your Free Trial
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>
    </main>
  );
};