import React, { useState, useEffect } from "react";
import AnimatedPageWrapper from "../../components/AnimatedPageWrapper";
import AnimatedCard from "../../components/AnimatedCard";
import AnimatedStats from "../../components/AnimatedStats";
import AnimatedButton from "../../components/AnimatedButton";
import AnimatedProgress from "../../components/AnimatedProgress";
import AnimatedBadge from "../../components/AnimatedBadge";
import AnimatedList from "../../components/AnimatedList";
import SkeletonLoader from "../../components/SkeletonLoader";

/**
 * EnhancedDashboard - Fully animated dashboard showcase
 */
export default function EnhancedDashboard() {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  // Simulated data
  const stats = [
    {
      label: "Total Employees",
      value: "250",
      icon: "👥",
      change: 5,
    },
    {
      label: "Present Today",
      value: "245",
      icon: "✓",
      change: 2,
    },
    {
      label: "Leave Requests",
      value: "12",
      icon: "📋",
      change: -3,
    },
    {
      label: "New Applicants",
      value: "8",
      icon: "📧",
      change: 8,
    },
  ];

  const recentActivities = [
    { id: 1, title: "John submitted leave request", time: "2 hours ago" },
    { id: 2, title: "New applicant: Jane Smith", time: "4 hours ago" },
    { id: 3, title: "Payroll processed for March", time: "1 day ago" },
    { id: 4, title: "Department meeting scheduled", time: "2 days ago" },
  ];

  return (
    <AnimatedPageWrapper delay={0.1}>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-8 shadow-lg animate-slide-in-down">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-4xl font-bold mb-2">Welcome Back! 👋</h1>
            <p className="text-blue-100">
              Here's your HR management dashboard with real-time insights
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Stats Overview */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6 animate-slide-in-left">
              📊 Key Metrics
            </h2>
            <AnimatedStats stats={stats} layout="grid" />
          </section>

          {/* Tabs Section */}
          <section className="mb-12">
            <div className="flex gap-4 mb-6">
              {["overview", "analytics", "tasks"].map((tab, idx) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    animation: `slideInLeft 0.4s ease-out ${idx * 0.1}s both`
                  }}
                  className={`
                    px-6 py-2 rounded-lg font-semibold transition-all duration-300
                    ${activeTab === tab
                      ? "bg-blue-600 text-white shadow-lg scale-105"
                      : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
                    }
                  `}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="animate-fade-in">
              {activeTab === "overview" && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Recent Activities */}
                  <div className="lg:col-span-2 bg-white p-6 rounded-lg border border-gray-200 shadow-md hover:shadow-lg transition-all">
                    <h3 className="text-xl font-bold mb-4">📋 Recent Activities</h3>
                    <AnimatedList
                      items={recentActivities}
                      renderItem={(activity) => (
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-semibold text-gray-800">
                              {activity.title}
                            </p>
                            <p className="text-sm text-gray-500 mt-1">
                              {activity.time}
                            </p>
                          </div>
                          <AnimatedBadge variant="primary" size="sm">
                            New
                          </AnimatedBadge>
                        </div>
                      )}
                    />
                  </div>

                  {/* Quick Stats */}
                  <div className="space-y-4">
                    <div
                      className="bg-white p-6 rounded-lg border border-gray-200 shadow-md hover:shadow-lg transition-all"
                      style={{ animation: "slideInRight 0.5s ease-out" }}
                    >
                      <p className="text-sm font-medium text-gray-600 mb-3">
                        Attendance Rate
                      </p>
                      <AnimatedProgress
                        value={98}
                        max={100}
                        color="green"
                        showLabel={false}
                      />
                      <p className="text-2xl font-bold text-green-600 mt-2">
                        98%
                      </p>
                    </div>

                    <div
                      className="bg-white p-6 rounded-lg border border-gray-200 shadow-md hover:shadow-lg transition-all"
                      style={{ animation: "slideInRight 0.5s ease-out 0.1s both" }}
                    >
                      <p className="text-sm font-medium text-gray-600 mb-3">
                        Payroll Status
                      </p>
                      <AnimatedProgress
                        value={75}
                        max={100}
                        color="blue"
                        showLabel={false}
                      />
                      <p className="text-2xl font-bold text-blue-600 mt-2">
                        75%
                      </p>
                    </div>

                    <div
                      className="bg-white p-6 rounded-lg border border-gray-200 shadow-md hover:shadow-lg transition-all"
                      style={{ animation: "slideInRight 0.5s ease-out 0.2s both" }}
                    >
                      <p className="text-sm font-medium text-gray-600 mb-3">
                        Leave Approvals
                      </p>
                      <AnimatedProgress
                        value={45}
                        max={100}
                        color="purple"
                        showLabel={false}
                      />
                      <p className="text-2xl font-bold text-purple-600 mt-2">
                        45%
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "analytics" && (
                <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-md">
                  <h3 className="text-xl font-bold mb-6">📈 Analytics Data</h3>
                  <SkeletonLoader count={3} variant="card" />
                </div>
              )}

              {activeTab === "tasks" && (
                <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-md">
                  <h3 className="text-xl font-bold mb-6">✓ Tasks</h3>
                  <SkeletonLoader count={4} variant="text" />
                </div>
              )}
            </div>
          </section>

          {/* Action Cards */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6 animate-slide-in-left">
              ⚡ Quick Actions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { icon: "👤", title: "Add Employee", color: "blue" },
                { icon: "📅", title: "Mark Attendance", color: "green" },
                { icon: "📊", title: "View Reports", color: "purple" },
                { icon: "⚙️", title: "Settings", color: "yellow" },
              ].map((action, idx) => (
                <button
                  key={idx}
                  style={{
                    animation: `slideInUp 0.4s ease-out ${idx * 0.1}s both`
                  }}
                  className="group relative bg-white p-6 rounded-lg border border-gray-200 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
                >
                  <div className="text-4xl mb-3 group-hover:animate-bounce-slow">
                    {action.icon}
                  </div>
                  <p className="font-semibold text-gray-800">{action.title}</p>
                  <div className={`
                    mt-4 h-1 bg-gradient-to-r
                    ${action.color === "blue" ? "from-blue-400 to-blue-600" : ""}
                    ${action.color === "green" ? "from-green-400 to-green-600" : ""}
                    ${action.color === "purple" ? "from-purple-400 to-purple-600" : ""}
                    ${action.color === "yellow" ? "from-yellow-400 to-yellow-600" : ""}
                    rounded-full scale-0 group-hover:scale-100 transition-transform origin-left
                  `} />
                </button>
              ))}
            </div>
          </section>

          {/* Call to Action */}
          <section className="mb-12">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 rounded-lg shadow-lg text-center animate-scale-in">
              <h2 className="text-2xl font-bold mb-4">
                🚀 Explore All Features
              </h2>
              <p className="mb-6 text-blue-100">
                Access all HR management tools and real-time analytics
              </p>
              <div className="flex gap-4 justify-center">
                <AnimatedButton variant="primary">
                  Get Started
                </AnimatedButton>
                <AnimatedButton variant="outline">
                  Learn More
                </AnimatedButton>
              </div>
            </div>
          </section>

          {/* Feature Showcase */}
          <section>
            <h2 className="text-2xl font-bold mb-6 animate-slide-in-left">
              ✨ Platform Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                "Real-time Attendance Tracking",
                "Leave Management System",
                "Payroll Processing",
                "Performance Analytics",
                "Recruitment Tools",
                "Document Management",
              ].map((feature, idx) => (
                <div
                  key={idx}
                  style={{
                    animation: `slideInUp 0.4s ease-out ${idx * 0.08}s both`
                  }}
                  className="bg-white p-6 rounded-lg border border-gray-200 shadow-md hover:shadow-lg transition-all hover:scale-105"
                >
                  <div className="text-3xl mb-3">✓</div>
                  <h3 className="font-semibold text-gray-800">{feature}</h3>
                  <p className="text-sm text-gray-600 mt-2">
                    Streamline your HR operations with this feature
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="bg-gray-900 text-gray-300 p-8 mt-16">
          <div className="max-w-7xl mx-auto text-center">
            <p className="mb-2">HR-NEXUS © 2024 - All Rights Reserved</p>
            <p className="text-sm opacity-75">
              Built with love and cutting-edge animations ✨
            </p>
          </div>
        </div>
      </div>
    </AnimatedPageWrapper>
  );
}
