import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Clock, User, Mail, Phone, Search, Plus, LogIn, LogOut, Home, BookOpen, Award } from 'lucide-react';

// Types
interface Event {
  id: number;
  name: string;
  description: string;
  date: string;
  time?: string;
  location: string;
  category: string;
  organizer: string;
  contact?: string;
  email?: string;
  image: string;
  registrationOpen: boolean;
}

interface User {
  id: number;
  username: string;
  email: string;
  phone?: string;
}

// Main App Component
function App() {
  // Application state
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [events, setEvents] = useState<Event[]>([
    {
      id: 1,
      name: "Live Music Festival",
      description: "Experience live music, local food and beverages. Here it is, the 12th edition of our Live Musical Festival! Once again we assembled the most legendary bands in Rock history. Bands like Bar Fighters, Led Slippers and Link Floyd will offer you the show of the century during our three day event. This is the perfect place for spending a nice time with your friends while listening to some of the most iconic rock songs of all times! For any additional information, please contact us at events@yourcompany.com.",
      date: "Aug 14",
      time: "1:30 PM - 5:30 PM",
      location: "Silver Auditorium, Ahmedabad, Gujarat",
      category: "cultural",
      organizer: "Marc Demo",
      contact: "+1 555-555-5555",
      email: "info@yourcompany.com",
      image: "https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      registrationOpen: true
    },
    {
      id: 2,
      name: "Jewelry exhibition",
      description: "Join us for an exquisite jewelry exhibition showcasing unique handcrafted pieces from local artisans brought together. Discover stunning pieces, from timeless classics to modern treasures.",
      date: "Aug 11-12",
      location: "Crown Museum, Ahmedabad",
      category: "exhibition",
      organizer: "Art Committee",
      email: "artshow@ahmedabad.gov.in",
      image: "https://images.pexels.com/photos/1413420/pexels-photo-1413420.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      registrationOpen: true
    },
    {
      id: 3,
      name: "Tennis Tournament",
      description: "Don't miss the excitement of our local tennis tournament! Watch talented players from the community battle it out for the title and a grand prize.",
      date: "Jun 22",
      location: "Central Courts, Ahmedabad",
      category: "sports",
      organizer: "Sports Club",
      email: "tennis@sportsclub.org",
      image: "https://images.pexels.com/photos/8224057/pexels-photo-8224057.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      registrationOpen: false
    },
    {
      id: 4,
      name: "Tennis Match",
      description: "Don't miss the excitement of our local tennis match! Watch talented players from the community battle it out for the title and a grand prize.",
      date: "Jun 25",
      location: "Central Courts, Ahmedabad",
      category: "sports",
      organizer: "Sports Club",
      email: "tennis@sportsclub.org",
      image: "https://images.pexels.com/photos/8224057/pexels-photo-8224057.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      registrationOpen: true
    }
  ]);
  const [registeredEvents, setRegisteredEvents] = useState<number[]>([]);
  const [myEvents, setMyEvents] = useState<number[]>([]);
  const [currentRoute, setCurrentRoute] = useState('home');
  const [routeParams, setRouteParams] = useState<{[key: string]: any}>({});
  const [searchQuery, setSearchQuery] = useState('');

  // Navigation function
  const navigateTo = (route: string, params = {}) => {
    setCurrentRoute(route);
    setRouteParams(params);
    window.scrollTo(0, 0);
  };

  // Authentication functions
  const login = (username: string, password: string) => {
    if (username && password) {
      setCurrentUser({
        id: Date.now(),
        username,
        email: `${username.toLowerCase()}@example.com`
      });
      navigateTo('home');
      return true;
    }
    return false;
  };

  const register = (username: string, email: string, phone: string, password: string) => {
    if (username && email && password) {
      setCurrentUser({
        id: Date.now(),
        username,
        email,
        phone
      });
      navigateTo('home');
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    navigateTo('home');
  };

  // Event handling functions
  const registerForEvent = (eventId: number) => {
    if (!currentUser) {
      navigateTo('login');
      return;
    }
    
    if (!registeredEvents.includes(eventId)) {
      setRegisteredEvents([...registeredEvents, eventId]);
      alert('Successfully registered for the event!');
    }
  };

  const createEvent = (eventData: Partial<Event>) => {
    if (!currentUser) {
      navigateTo('login');
      return;
    }
    
    const newEvent: Event = {
      id: Date.now(),
      ...eventData as Omit<Event, 'id'>,
      organizer: currentUser.username,
      email: currentUser.email,
      registrationOpen: true
    };
    
    setEvents([...events, newEvent]);
    setMyEvents([...myEvents, newEvent.id]);
    
    alert('Event created successfully!');
    navigateTo('eventDetails', { id: newEvent.id });
  };

  // Helper functions
  const getCategoryName = (category: string) => {
    const categories: {[key: string]: string} = {
      'sports': 'Sports',
      'cultural': 'Cultural',
      'exhibition': 'Exhibition',
      'volunteer': 'Volunteer',
      'education': 'Education'
    };
    return categories[category] || category;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minutes} ${ampm}`;
  };

  // Filter events based on search query
  const filteredEvents = events.filter(event => 
    event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    getCategoryName(event.category).toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Render components for different pages
  const renderNavbar = () => (
    <nav className="bg-white shadow-md p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigateTo('home')}>
          <Calendar className="h-6 w-6 text-teal-500" />
          <h1 className="text-xl font-bold text-gray-800">Community Pulse</h1>
        </div>
        <div className="flex items-center space-x-2">
          {currentUser ? (
            <div className="flex items-center space-x-4">
              <button onClick={() => navigateTo('myEvents')} className="flex items-center space-x-1 text-gray-700 hover:text-teal-500">
                <Award className="h-4 w-4" />
                <span>My Events</span>
              </button>
              <button onClick={() => navigateTo('registeredEvents')} className="flex items-center space-x-1 text-gray-700 hover:text-teal-500">
                <BookOpen className="h-4 w-4" />
                <span>Registered</span>
              </button>
              <button onClick={() => navigateTo('addEvent')} className="flex items-center space-x-1 bg-teal-500 text-white px-3 py-1 rounded-md hover:bg-teal-600 transition">
                <Plus className="h-4 w-4" />
                <span>Add Event</span>
              </button>
              <div className="flex items-center space-x-2 border-l pl-4 border-gray-300">
                <span className="text-gray-700">{currentUser.username}</span>
                <button onClick={logout} className="text-red-500 hover:text-red-700">
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            </div>
          ) : (
            <>
              <button onClick={() => navigateTo('login')} className="flex items-center space-x-1 text-teal-500 border border-teal-500 px-3 py-1 rounded-md hover:bg-teal-50">
                <LogIn className="h-4 w-4" />
                <span>Login</span>
              </button>
              <button onClick={() => navigateTo('register')} className="flex items-center space-x-1 bg-teal-500 text-white px-3 py-1 rounded-md hover:bg-teal-600">
                <User className="h-4 w-4" />
                <span>Register</span>
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );

  const renderHomePage = () => (
    <div className="py-4">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Discover Events</h2>
        <div className="flex items-center border-2 border-teal-500 rounded-full overflow-hidden w-full md:w-auto">
          <input 
            type="text" 
            placeholder="Search events" 
            className="py-2 px-4 outline-none w-full md:w-64"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className="bg-teal-500 px-4 py-2 text-white">
            <Search className="h-5 w-5" />
          </button>
        </div>
      </div>
      
      {filteredEvents.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500 mb-4">No events found matching your search.</p>
          <button onClick={() => setSearchQuery('')} className="bg-teal-500 text-white px-4 py-2 rounded-md hover:bg-teal-600">
            Clear Search
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map(event => (
            <div key={event.id} className="bg-white overflow-hidden shadow-lg rounded-lg border-2 border-teal-500 hover:shadow-xl transition-transform hover:scale-[1.02]">
              <img src={event.image} alt={event.name} className="w-full h-48 object-cover" />
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <span className={`inline-block px-2 py-1 text-xs font-semibold text-white rounded-full ${
                      event.category === 'sports' ? 'bg-teal-500' : 
                      event.category === 'cultural' ? 'bg-blue-500' : 
                      event.category === 'exhibition' ? 'bg-purple-500' : 
                      event.category === 'volunteer' ? 'bg-orange-500' : 
                      'bg-gray-500'
                    }`}>
                      {getCategoryName(event.category)}
                    </span>
                    <div className="flex items-center mt-1 text-sm text-gray-600">
                      <Calendar className="h-4 w-4 mr-1" />
                      <p>{event.date}</p>
                    </div>
                  </div>
                </div>
                <h3 className="text-xl font-semibold mt-2">{event.name}</h3>
                <p className="text-gray-600 mt-1 line-clamp-2">{event.description}</p>
                <div className="flex items-center mt-2 text-sm text-gray-500">
                  <MapPin className="h-4 w-4 mr-1" />
                  <p>{event.location}</p>
                </div>
                <div className="mt-4 flex justify-end">
                  <button 
                    onClick={() => navigateTo('eventDetails', {id: event.id})} 
                    className="bg-teal-500 text-white px-4 py-2 rounded-md hover:bg-teal-600 transition flex items-center"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderLoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (login(username, password)) {
        // Login successful
      } else {
        setError('Invalid credentials. Please try again.');
      }
    };

    return (
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden mt-10">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Login to Community Pulse</h2>
          {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700">Username</label>
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-teal-500" 
                required 
              />
            </div>
            <div>
              <label className="block text-gray-700">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-teal-500" 
                required 
              />
            </div>
            <div className="flex justify-between items-center">
              <button type="submit" className="w-full bg-teal-500 text-white px-4 py-2 rounded-md hover:bg-teal-600 transition">Login</button>
            </div>
          </form>
          <div className="mt-4 text-center">
            <p className="text-gray-600">Don't have an account? 
              <button onClick={() => navigateTo('register')} className="text-teal-500 hover:underline ml-1">Register</button>
            </p>
          </div>
        </div>
      </div>
    );
  };

  const renderRegistrationPage = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (register(username, email, phone, password)) {
        // Registration successful
      } else {
        setError('Registration failed. Please check your information and try again.');
      }
    };

    return (
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden mt-10">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Create an Account</h2>
          {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700">Username</label>
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-teal-500" 
                required 
              />
            </div>
            <div>
              <label className="block text-gray-700">Email</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-teal-500" 
                required 
              />
            </div>
            <div>
              <label className="block text-gray-700">Phone</label>
              <input 
                type="tel" 
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-teal-500"
              />
            </div>
            <div>
              <label className="block text-gray-700">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-teal-500" 
                required 
              />
            </div>
            <div className="flex justify-center">
              <button type="submit" className="w-full bg-teal-500 text-white px-4 py-2 rounded-md hover:bg-teal-600 transition">Register</button>
            </div>
          </form>
          <div className="mt-4 text-center">
            <p className="text-gray-600">Already have an account? 
              <button onClick={() => navigateTo('login')} className="text-teal-500 hover:underline ml-1">Login</button>
            </p>
          </div>
        </div>
      </div>
    );
  };

  const renderEventDetails = () => {
    const eventId = parseInt(routeParams.id as string);
    const event = events.find(e => e.id === eventId);
    
    if (!event) {
      navigateTo('home');
      return null;
    }
    
    const isRegistered = registeredEvents.includes(eventId);
    const isMyEvent = myEvents.includes(eventId);
    
    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden my-6">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/2">
            <img src={event.image} alt={event.name} className="w-full h-64 object-cover" />
          </div>
          <div className="p-6 md:w-1/2">
            <div className="flex justify-between items-start">
              <div>
                <span className={`inline-block px-2 py-1 text-xs font-semibold text-white rounded-full ${
                  event.category === 'sports' ? 'bg-teal-500' : 
                  event.category === 'cultural' ? 'bg-blue-500' : 
                  event.category === 'exhibition' ? 'bg-purple-500' : 
                  event.category === 'volunteer' ? 'bg-orange-500' : 
                  'bg-gray-500'
                }`}>
                  {getCategoryName(event.category)}
                </span>
                <h1 className="text-3xl font-bold mt-2">{event.name}</h1>
                <div className="flex items-center mt-1 text-lg text-gray-600">
                  <Calendar className="h-5 w-5 mr-1" />
                  <p>{event.date}{event.time ? ' • ' + event.time : ''}</p>
                </div>
              </div>
              {isMyEvent && (
                <div>
                  <button className="border border-teal-500 text-teal-500 px-3 py-1 rounded-md hover:bg-teal-50 mr-2">Edit</button>
                  <button className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600">Delete</button>
                </div>
              )}
            </div>
            
            <div className="mt-6">
              <h3 className="text-xl font-semibold">Description</h3>
              <p className="text-gray-700 mt-2">{event.description}</p>
            </div>
            
            <div className="mt-6">
              <h3 className="text-xl font-semibold">Location</h3>
              <div className="flex items-center mt-2 text-gray-700">
                <MapPin className="h-5 w-5 mr-2 text-teal-500" />
                <p>{event.location}</p>
              </div>
            </div>
            
            <div className="mt-6">
              <h3 className="text-xl font-semibold">Organizer</h3>
              <div className="flex items-center mt-2 text-gray-700">
                <User className="h-5 w-5 mr-2 text-teal-500" />
                <p>{event.organizer}</p>
              </div>
              {event.contact && (
                <div className="flex items-center mt-1 text-gray-700">
                  <Phone className="h-5 w-5 mr-2 text-teal-500" />
                  <p>{event.contact}</p>
                </div>
              )}
              {event.email && (
                <div className="flex items-center mt-1 text-gray-700">
                  <Mail className="h-5 w-5 mr-2 text-teal-500" />
                  <p>{event.email}</p>
                </div>
              )}
            </div>
            
            <div className="mt-8">
              {isRegistered ? (
                <button 
                  className="w-full border-2 border-teal-500 text-teal-500 px-4 py-2 rounded-md opacity-75 cursor-not-allowed"
                  disabled
                >
                  Already Registered
                </button>
              ) : event.registrationOpen ? (
                <button 
                  onClick={() => registerForEvent(event.id)} 
                  className="w-full bg-teal-500 text-white px-4 py-2 rounded-md hover:bg-teal-600 transition"
                >
                  Register for Event
                </button>
              ) : (
                <button 
                  className="w-full border-2 border-gray-300 text-gray-400 px-4 py-2 rounded-md opacity-75 cursor-not-allowed"
                  disabled
                >
                  Registration Not Yet Open
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderAddEventForm = () => {
    if (!currentUser) {
      navigateTo('login');
      return null;
    }
    
    const [eventName, setEventName] = useState('');
    const [eventDescription, setEventDescription] = useState('');
    const [eventLocation, setEventLocation] = useState('');
    const [eventDate, setEventDate] = useState('');
    const [eventTime, setEventTime] = useState('');
    const [eventEndDate, setEventEndDate] = useState('');
    const [eventEndTime, setEventEndTime] = useState('');
    const [eventCategory, setEventCategory] = useState('cultural');
    const [regStartDate, setRegStartDate] = useState('');
    const [regEndDate, setRegEndDate] = useState('');
    
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      
      let formattedDate = eventDate ? formatDate(eventDate) : '';
      if (eventEndDate && eventDate !== eventEndDate) {
        formattedDate += '-' + formatDate(eventEndDate);
      }
      
      let formattedTime = '';
      if (eventTime) {
        formattedTime = formatTime(eventTime);
        if (eventEndTime) {
          formattedTime += ' - ' + formatTime(eventEndTime);
        }
      }
      
      const eventData: Partial<Event> = {
        name: eventName,
        description: eventDescription,
        location: eventLocation,
        date: formattedDate,
        time: formattedTime || undefined,
        category: eventCategory,
        image: `https://images.pexels.com/photos/2747449/pexels-photo-2747449.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1`,
        registrationOpen: true
      };
      
      createEvent(eventData);
    };
    
    return (
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md overflow-hidden my-10">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Add New Event</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700">Event Name</label>
                <input 
                  type="text" 
                  value={eventName}
                  onChange={(e) => setEventName(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-teal-500" 
                  required 
                />
              </div>
              <div>
                <label className="block text-gray-700">Location</label>
                <input 
                  type="text" 
                  value={eventLocation}
                  onChange={(e) => setEventLocation(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-teal-500" 
                  required 
                />
              </div>
            </div>
            
            <div>
              <label className="block text-gray-700">Description</label>
              <textarea 
                rows={4} 
                value={eventDescription}
                onChange={(e) => setEventDescription(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-teal-500" 
                required 
              ></textarea>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700">Start Date</label>
                <input 
                  type="date" 
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-teal-500" 
                  required 
                />
              </div>
              <div>
                <label className="block text-gray-700">Start Time</label>
                <input 
                  type="time" 
                  value={eventTime}
                  onChange={(e) => setEventTime(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-teal-500"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700">End Date</label>
                <input 
                  type="date" 
                  value={eventEndDate}
                  onChange={(e) => setEventEndDate(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-teal-500"
                />
              </div>
              <div>
                <label className="block text-gray-700">End Time</label>
                <input 
                  type="time" 
                  value={eventEndTime}
                  onChange={(e) => setEventEndTime(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-teal-500"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-gray-700">Category</label>
              <select 
                value={eventCategory}
                onChange={(e) => setEventCategory(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-teal-500" 
                required
              >
                <option value="sports">Sports</option>
                <option value="cultural">Cultural</option>
                <option value="exhibition">Exhibition</option>
                <option value="volunteer">Volunteer</option>
                <option value="education">Education</option>
              </select>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700">Registration Start Date</label>
                <input 
                  type="date" 
                  value={regStartDate}
                  onChange={(e) => setRegStartDate(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-teal-500"
                />
              </div>
              <div>
                <label className="block text-gray-700">Registration End Date</label>
                <input 
                  type="date" 
                  value={regEndDate}
                  onChange={(e) => setRegEndDate(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-teal-500"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-gray-700">Event Image</label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H8m36-12h-4m4 0H20" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <div className="flex text-sm text-gray-600">
                    <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-teal-600 hover:text-teal-500 focus-within:outline-none">
                      <span>Upload a file</span>
                      <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                </div>
              </div>
            </div>
            
            <div className="flex justify-center">
              <button type="submit" className="w-full bg-teal-500 text-white px-4 py-2 rounded-md hover:bg-teal-600 transition">Create Event</button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const renderMyEventsPage = () => {
    if (!currentUser) {
      navigateTo('login');
      return null;
    }
    
    const myEventsList = events.filter(event => myEvents.includes(event.id));
    
    return (
      <div className="py-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">My Events</h2>
          <button 
            onClick={() => navigateTo('addEvent')} 
            className="bg-teal-500 text-white px-4 py-2 rounded-md hover:bg-teal-600 transition flex items-center"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add New Event
          </button>
        </div>
        
        {myEventsList.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-lg shadow-md">
            <p className="text-gray-500 mb-4">You haven't created any events yet.</p>
            <button 
              onClick={() => navigateTo('addEvent')} 
              className="bg-teal-500 text-white px-4 py-2 rounded-md hover:bg-teal-600 transition"
            >
              Create Your First Event
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myEventsList.map(event => (
              <div key={event.id} className="bg-white overflow-hidden shadow-lg rounded-lg border-2 border-teal-500 hover:shadow-xl transition-transform hover:scale-[1.02]">
                <img src={event.image} alt={event.name} className="w-full h-48 object-cover" />
                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className={`inline-block px-2 py-1 text-xs font-semibold text-white rounded-full ${
                        event.category === 'sports' ? 'bg-teal-500' : 
                        event.category === 'cultural' ? 'bg-blue-500' : 
                        event.category === 'exhibition' ? 'bg-purple-500' : 
                        event.category === 'volunteer' ? 'bg-orange-500' : 
                        'bg-gray-500'
                      }`}>
                        {getCategoryName(event.category)}
                      </span>
                      <div className="flex items-center mt-1 text-sm text-gray-600">
                        <Calendar className="h-4 w-4 mr-1" />
                        <p>{event.date}</p>
                      </div>
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mt-2">{event.name}</h3>
                  <p className="text-gray-600 mt-1 line-clamp-2">{event.description}</p>
                  <div className="flex items-center mt-2 text-sm text-gray-500">
                    <MapPin className="h-4 w-4 mr-1" />
                    <p>{event.location}</p>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <button 
                      onClick={() => navigateTo('eventDetails', {id: event.id})} 
                      className="bg-teal-500 text-white px-4 py-2 rounded-md hover:bg-teal-600 transition"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderRegisteredEventsPage = () => {
    if (!currentUser) {
      navigateTo('login');
      return null;
    }
    
    const registeredEventsList = events.filter(event => registeredEvents.includes(event.id));
    
    return (
      <div className="py-4">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800">My Registered Events</h2>
        </div>
        
        {registeredEventsList.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-lg shadow-md">
            <p className="text-gray-500 mb-4">You haven't registered for any events yet.</p>
            <button 
              onClick={() => navigateTo('home')} 
              className="bg-teal-500 text-white px-4 py-2 rounded-md hover:bg-teal-600 transition"
            >
              Explore Events
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {registeredEventsList.map(event => (
              <div key={event.id} className="bg-white overflow-hidden shadow-lg rounded-lg border-2 border-teal-500 hover:shadow-xl transition-transform hover:scale-[1.02]">
                <img src={event.image} alt={event.name} className="w-full h-48 object-cover" />
                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className={`inline-block px-2 py-1 text-xs font-semibold text-white rounded-full ${
                        event.category === 'sports' ? 'bg-teal-500' : 
                        event.category === 'cultural' ? 'bg-blue-500' : 
                        event.category === 'exhibition' ? 'bg-purple-500' : 
                        event.category === 'volunteer' ? 'bg-orange-500' : 
                        'bg-gray-500'
                      }`}>
                        {getCategoryName(event.category)}
                      </span>
                      <div className="flex items-center mt-1 text-sm text-gray-600">
                        <Calendar className="h-4 w-4 mr-1" />
                        <p>{event.date}</p>
                      </div>
                    </div>
                    <div className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                      Registered
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mt-2">{event.name}</h3>
                  <p className="text-gray-600 mt-1 line-clamp-2">{event.description}</p>
                  <div className="flex items-center mt-2 text-sm text-gray-500">
                    <MapPin className="h-4 w-4 mr-1" />
                    <p>{event.location}</p>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <button 
                      onClick={() => navigateTo('eventDetails', {id: event.id})} 
                      className="bg-teal-500 text-white px-4 py-2 rounded-md hover:bg-teal-600 transition"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  // Render the current route
  const renderCurrentRoute = () => {
    switch (currentRoute) {
      case 'home':
        return renderHomePage();
      case 'login':
        return renderLoginPage();
      case 'register':
        return renderRegistrationPage();
      case 'eventDetails':
        return renderEventDetails();
      case 'addEvent':
        return renderAddEventForm();
      case 'myEvents':
        return renderMyEventsPage();
      case 'registeredEvents':
        return renderRegisteredEventsPage();
      default:
        return <div className="text-center p-10">Page not found</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {renderNavbar()}
      <div className="container mx-auto p-4">
        {renderCurrentRoute()}
      </div>
      <footer className="bg-white shadow-inner p-6 mt-10">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <Calendar className="h-6 w-6 text-teal-500 mr-2" />
              <h3 className="text-lg font-semibold text-gray-800">Community Pulse</h3>
            </div>
            <div className="text-gray-600 text-sm">
              © {new Date().getFullYear()} Community Pulse. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;