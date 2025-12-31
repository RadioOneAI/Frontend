import React from "react";

export default function ContactUs() {
  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log("Form submitted");
  };

  return (
    <div className="min-h-svh bg-base-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-extrabold text-base-content sm:text-4xl">
            Get in Touch
          </h2>
          <p className="mt-4 text-xl text-base-content/70">
            Have questions about our AI-assisted reporting models? We're here to help.
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-12 items-start">
          
          {/* Left Side: Contact Info Details */}
          <div className="space-y-8 order-2 xl:order-1">
            <div className="card bg-base-200 shadow-xl border border-base-300">
              <div className="card-body">
                <h3 className="card-title text-2xl mb-4 text-emerald-600">Contact Information</h3>
                
                {/* Phone */}
                <div className="flex items-start gap-4 mb-6">
                  <div className="p-3 bg-emerald-100 text-emerald-600 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">Phone</h4>
                    <p className="text-base-content/70">+1 (555) 123-4567</p>
                    <p className="text-sm text-base-content/50">Mon-Fri 9am to 6pm</p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-4 mb-6">
                  <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">Email</h4>
                    <p className="text-base-content/70">support@med-ai-reports.com</p>
                    <p className="text-base-content/70">sales@med-ai-reports.com</p>
                  </div>
                </div>

                {/* Office */}
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-purple-100 text-purple-600 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">Office</h4>
                    <p className="text-base-content/70">
                      123 Innovation Drive,<br />
                      Tech City, TC 90210
                    </p>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* Right Side: Form Container */}
          <div className="card bg-base-100 shadow-2xl border border-base-200 order-1 xl:order-2">
            <div className="card-body p-8">
              <h3 className="card-title text-2xl mb-6">Send us a message</h3>
              <form onSubmit={handleSubmit}>
                
                {/* --- NEW GRID LAYOUT FOR FORM --- */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  
                  {/* Left Column of Form (Inputs) */}
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="form-control w-full">
                        <label className="label">
                          <span className="label-text font-medium">First Name</span>
                        </label>
                        <input type="text" placeholder="John" className="input input-bordered w-full bg-base-200 focus:bg-base-100 transition-colors" />
                      </div>
                      <div className="form-control w-full">
                        <label className="label">
                          <span className="label-text font-medium">Last Name</span>
                        </label>
                        <input type="text" placeholder="Doe" className="input input-bordered w-full bg-base-200 focus:bg-base-100 transition-colors" />
                      </div>
                    </div>

                    <div className="form-control w-full">
                      <label className="label">
                        <span className="label-text font-medium">Email Address</span>
                      </label>
                      <input type="email" placeholder="john@example.com" className="input input-bordered w-full bg-base-200 focus:bg-base-100 transition-colors" />
                    </div>

                    <div className="form-control w-full">
                      <label className="label">
                        <span className="label-text font-medium">Subject</span>
                      </label>
                      <select className="select select-bordered w-full bg-base-200 focus:bg-base-100 transition-colors" defaultValue={"Pick a topic"}>
                        <option disabled>Pick a topic</option>
                        <option>General Inquiry</option>
                        <option>Technical Support</option>
                        <option>Sales & Pricing</option>
                        <option>Partnership</option>
                      </select>
                    </div>
                  </div>

                  {/* Right Column of Form (Message Box positioned to the right) */}
                  <div className="form-control w-full h-full">
                    <label className="label">
                      <span className="label-text font-medium">Message</span>
                    </label>
                    {/* Added h-full and min-h to make it stretch nicely on the right */}
                    <textarea className="textarea textarea-bordered h-full min-h-[250px] bg-base-200 focus:bg-base-100 transition-colors resize-none" placeholder="How can we help you?"></textarea>
                  </div>

                </div>
                {/* --- END GRID LAYOUT --- */}

                <div className="card-actions justify-end mt-8">
                  <button type="submit" className="btn btn-success text-white w-full sm:w-auto px-8 text-lg">
                    Send Message
                  </button>
                </div>
              </form>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}