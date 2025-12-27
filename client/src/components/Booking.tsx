import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, User, CreditCard, CheckCircle } from 'lucide-react';

interface Service {
  id: number;
  name: string;
  price: number;
  duration: number;
}

interface TimeSlot {
  time: string;
  available: boolean;
}

const Booking: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [bookingComplete, setBookingComplete] = useState(false);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    notes: ''
  });

  useEffect(() => {
    // Mock services data
    const mockServices: Service[] = [
      { id: 1, name: 'Luxury Facial Treatment', price: 120, duration: 90 },
      { id: 2, name: 'Premium Hair Styling', price: 85, duration: 60 },
      { id: 3, name: 'Relaxing Full Body Massage', price: 150, duration: 75 },
      { id: 4, name: 'Gel Manicure & Pedicure', price: 95, duration: 120 },
      { id: 5, name: 'Professional Makeup', price: 75, duration: 60 },
      { id: 6, name: 'Hot Stone Therapy', price: 180, duration: 90 }
    ];
    setServices(mockServices);

    // Generate time slots
    const slots: TimeSlot[] = [];
    const startTime = 9; // 9 AM
    const endTime = 18; // 6 PM
    
    for (let hour = startTime; hour < endTime; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        slots.push({ time, available: Math.random() > 0.3 }); // 70% availability
      }
    }
    setTimeSlots(slots);
  }, []);

  const handleDateChange = (date: string) => {
    setSelectedDate(date);
    setSelectedTime('');
  };

  const handleServiceSelect = (service: Service) => {
    setSelectedService(service);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setBookingComplete(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const getNextAvailableDate = () => {
    const today = new Date();
    today.setDate(today.getDate() + 1); // Tomorrow
    return today.toISOString().split('T')[0];
  };

  const steps = [
    { number: 1, title: 'Select Service', icon: <User className="w-5 h-5" /> },
    { number: 2, title: 'Choose Date & Time', icon: <Calendar className="w-5 h-5" /> },
    { number: 3, title: 'Your Details', icon: <CreditCard className="w-5 h-5" /> },
    { number: 4, title: 'Confirmation', icon: <CheckCircle className="w-5 h-5" /> }
  ];

  if (bookingComplete) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-gradient-to-br from-primary-50 to-rose-50 flex items-center justify-center px-4 py-8"
      >
        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-16 sm:w-20 h-16 sm:h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6"
          >
            <CheckCircle className="w-8 sm:w-10 h-8 sm:h-10 text-green-600" />
          </motion.div>
          <h2 className="text-xl sm:text-2xl font-bold text-neutral-800 mb-3 sm:mb-4">Booking Confirmed!</h2>
          <p className="text-neutral-600 mb-4 sm:mb-6 text-sm sm:text-base">
            Thank you for booking with Elegance Beauty Salon. We've sent a confirmation email to {formData.email}.
          </p>
          <div className="bg-neutral-50 p-3 sm:p-4 rounded-lg mb-4 sm:mb-6 text-left">
            <h3 className="font-semibold text-neutral-800 mb-2 text-sm sm:text-base">Appointment Details:</h3>
            <p className="text-xs sm:text-sm text-neutral-600">Service: {selectedService?.name}</p>
            <p className="text-xs sm:text-sm text-neutral-600">Date: {selectedDate}</p>
            <p className="text-xs sm:text-sm text-neutral-600">Time: {selectedTime}</p>
            <p className="text-xs sm:text-sm text-neutral-600">Duration: {selectedService?.duration} minutes</p>
          </div>
          <button
            onClick={() => window.location.href = '/'}
            className="w-full bg-primary-600 text-white py-2 sm:py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors text-sm sm:text-base"
          >
            Back to Home
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-primary-50 to-rose-50 py-20 sm:py-24 md:pt-28 px-4"
    >
      <div className="container mx-auto max-w-4xl">
        {/* Progress Steps */}
        <div className="mb-8 sm:mb-12">
          <div className="flex justify-between items-center mb-4 sm:mb-8">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div className={`flex items-center justify-center w-8 sm:w-10 h-8 sm:h-10 rounded-full ${
                  currentStep >= step.number 
                    ? 'bg-primary-600 text-white' 
                    : 'bg-neutral-200 text-neutral-500'
                }`}>
                  {step.icon}
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-8 sm:w-16 h-1 mx-1 sm:mx-2 ${
                    currentStep > step.number ? 'bg-primary-600' : 'bg-neutral-200'
                  }`}></div>
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-xs sm:text-sm">
            {steps.map((step) => (
              <div key={step.number} className={`text-center ${
                currentStep >= step.number ? 'text-primary-600' : 'text-neutral-500'
              }`}>
                <div className="font-medium">{step.title}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 md:p-8">
          {/* Step 1: Select Service */}
          {currentStep === 1 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <h2 className="text-xl sm:text-2xl font-bold text-neutral-800 mb-4 sm:mb-6">Select Your Service</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {services.map((service) => (
                  <div
                    key={service.id}
                    onClick={() => handleServiceSelect(service)}
                    className={`p-3 sm:p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      selectedService?.id === service.id
                        ? 'border-primary-600 bg-primary-50'
                        : 'border-neutral-200 hover:border-primary-300'
                    }`}
                  >
                    <h3 className="font-semibold text-neutral-800 mb-2 text-sm sm:text-base">{service.name}</h3>
                    <p className="text-xs sm:text-sm text-neutral-600 mb-2">{service.duration} minutes</p>
                    <p className="text-base sm:text-lg font-bold text-primary-600">{service.price} €</p>
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-6 sm:mt-8 gap-3">
                <button
                  onClick={() => window.location.href = '/'}
                  className="px-4 sm:px-6 py-2 sm:py-3 border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors text-sm sm:text-base"
                >
                  Back to Home
                </button>
                <button
                  onClick={() => setCurrentStep(2)}
                  disabled={!selectedService}
                  className="px-4 sm:px-6 py-2 sm:py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm sm:text-base"
                >
                  Next Step
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 2: Choose Date & Time */}
          {currentStep === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <h2 className="text-xl sm:text-2xl font-bold text-neutral-800 mb-4 sm:mb-6">Choose Date & Time</h2>
              
              <div className="mb-4 sm:mb-6">
                <label className="block text-sm font-medium text-neutral-700 mb-2">Select Date</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => handleDateChange(e.target.value)}
                  min={getNextAvailableDate()}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm sm:text-base"
                />
              </div>

              {selectedDate && (
                <div className="mb-4 sm:mb-6">
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Available Time Slots</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                    {timeSlots.map((slot) => (
                      <button
                        key={slot.time}
                        onClick={() => setSelectedTime(slot.time)}
                        disabled={!slot.available}
                        className={`p-2 sm:p-3 rounded-lg border transition-colors text-sm ${
                          selectedTime === slot.time
                            ? 'bg-primary-600 text-white border-primary-600'
                            : slot.available
                            ? 'bg-white border-neutral-300 hover:border-primary-500'
                            : 'bg-neutral-100 text-neutral-400 border-neutral-200 cursor-not-allowed'
                        }`}
                      >
                        {slot.time}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-between gap-3">
                <button
                  onClick={() => setCurrentStep(1)}
                  className="px-4 sm:px-6 py-2 sm:py-3 border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors text-sm sm:text-base"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentStep(3)}
                  disabled={!selectedDate || !selectedTime}
                  className="px-4 sm:px-6 py-2 sm:py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm sm:text-base"
                >
                  Next Step
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Your Details */}
          {currentStep === 3 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <h2 className="text-xl sm:text-2xl font-bold text-neutral-800 mb-4 sm:mb-6">Your Details</h2>
              
              <form onSubmit={handleFormSubmit} className="space-y-3 sm:space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">First Name *</label>
                    <input
                      type="text"
                      name="firstName"
                      required
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm sm:text-base"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">Last Name *</label>
                    <input
                      type="text"
                      name="lastName"
                      required
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm sm:text-base"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm sm:text-base"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">Phone Number *</label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm sm:text-base"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Additional Notes</label>
                  <textarea
                    name="notes"
                    rows={3}
                    value={formData.notes}
                    onChange={handleInputChange}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm sm:text-base"
                    placeholder="Any special requests or notes..."
                  ></textarea>
                </div>

                {/* Booking Summary */}
                <div className="bg-neutral-50 p-3 sm:p-4 rounded-lg">
                  <h3 className="font-semibold text-neutral-800 mb-2 text-sm sm:text-base">Booking Summary</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm">
                    <div>
                      <p className="text-neutral-600">Service: <span className="font-medium">{selectedService?.name}</span></p>
                      <p className="text-neutral-600">Date: <span className="font-medium">{selectedDate}</span></p>
                    </div>
                    <div>
                      <p className="text-neutral-600">Time: <span className="font-medium">{selectedTime}</span></p>
                      <p className="text-neutral-600">Duration: <span className="font-medium">{selectedService?.duration} min</span></p>
                    </div>
                  </div>
                  <p className="text-base sm:text-lg font-bold text-primary-600 mt-2">Total: {selectedService?.price} €</p>
                </div>

                <div className="flex justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="px-4 sm:px-6 py-2 sm:py-3 border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors text-sm sm:text-base"
                  >
                    Previous
                  </button>
                  <button
                    type="submit"
                    className="px-4 sm:px-6 py-2 sm:py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm sm:text-base"
                  >
                    Confirm Booking
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Booking;