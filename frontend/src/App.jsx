import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Users, TrendingUp, Trophy, DollarSign, Calendar, Settings, LogOut, Home, Shield, Plus, Edit2, Trash2, Search, Filter, Eye } from 'lucide-react';

const FootballDashboard = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPosition, setFilterPosition] = useState('all');
  const [filterNationality, setFilterNationality] = useState('all');

  // Sample data (in real app, fetch from MongoDB via Express API)
  const [players, setPlayers] = useState([
    { id: 1, firstName: 'Diego', lastName: 'Maradona', jersey: 21, dob: '1989-01-01', position: 'Striker', nationality: 'Argentina', salary: 55000, clubId: 1 },
    { id: 2, firstName: 'Sunil', lastName: 'Chhetri', jersey: 2, dob: '1998-02-02', position: 'Striker', nationality: 'India', salary: 66000, clubId: 2 },
    { id: 3, firstName: 'Lionel', lastName: 'Messi', jersey: 10, dob: '1990-06-11', position: 'Right Winger', nationality: 'Argentina', salary: 88000, clubId: 3 },
    { id: 4, firstName: 'Cristiano', lastName: 'Ronaldo', jersey: 7, dob: '1988-07-15', position: 'Striker', nationality: 'Portugal', salary: 99000, clubId: 4 },
    { id: 5, firstName: 'Neymar', lastName: 'Junior', jersey: 11, dob: '1995-10-21', position: 'Left Winger', nationality: 'Brazil', salary: 110000, clubId: 5 }
  ]);

  const [clubs, setClubs] = useState([
    { id: 1, name: 'Barcelona', crest: 'FCB', jersey: 45, stadiumId: 1 },
    { id: 2, name: 'Real Madrid', crest: 'RM', jersey: 4, stadiumId: 2 },
    { id: 3, name: 'Chelsea', crest: 'CFC', jersey: 3, stadiumId: 3 },
    { id: 4, name: 'Mumbai City', crest: 'MFC', jersey: 2, stadiumId: 4 },
    { id: 5, name: 'FC Goa', crest: 'GFC', jersey: 5, stadiumId: 5 }
  ]);

  const [stadiums, setStadiums] = useState([
    { id: 1, name: 'Camp Nou', country: 'Spain', city: 'Barcelona', capacity: 60000 },
    { id: 2, name: 'Bernabeu', country: 'Spain', city: 'Madrid', capacity: 70000 },
    { id: 3, name: 'Stamford Bridge', country: 'England', city: 'London', capacity: 30000 },
    { id: 4, name: 'Mumbai Sports Arena', country: 'India', city: 'Mumbai', capacity: 40000 },
    { id: 5, name: 'PJ Nehra', country: 'India', city: 'Goa', capacity: 20000 }
  ]);

  const [revenue, setRevenue] = useState([
    { id: 1, clubId: 1, ticketSales: 20000, jerseySales: 30000 },
    { id: 2, clubId: 2, ticketSales: 30000, jerseySales: 40000 },
    { id: 3, clubId: 3, ticketSales: 40000, jerseySales: 50000 },
    { id: 4, clubId: 4, ticketSales: 50000, jerseySales: 60000 },
    { id: 5, clubId: 5, ticketSales: 60000, jerseySales: 70000 }
  ]);

  const [salaryLogs, setSalaryLogs] = useState([
    { id: 1, playerId: 5, oldSalary: 100000, newSalary: 110000, changeDate: '2025-01-15T10:30:00' },
    { id: 2, playerId: 2, oldSalary: 60000, newSalary: 66000, changeDate: '2025-02-01T14:20:00' }
  ]);

  // Calculate age from DOB
  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  // Get club name by ID
  const getClubName = (clubId) => {
    const club = clubs.find(c => c.id === clubId);
    return club ? club.name : 'N/A';
  };

  // Get stadium by club ID
  const getStadiumByClub = (clubId) => {
    const club = clubs.find(c => c.id === clubId);
    if (club) {
      return stadiums.find(s => s.id === club.stadiumId);
    }
    return null;
  };

  // Calculate total revenue
  const getTotalRevenue = (clubId) => {
    const rev = revenue.find(r => r.clubId === clubId);
    return rev ? rev.ticketSales + rev.jerseySales : 0;
  };

  // Login Page
  const LoginPage = () => (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black opacity-20"></div>
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-700"></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
      </div>
      
      <div className="relative bg-white/10 backdrop-blur-lg rounded-3xl p-8 w-full max-w-md border border-white/20 shadow-2xl">
        <div className="text-center mb-8">
          <div className="inline-block p-3 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl mb-4 shadow-lg">
            <Trophy className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Football Manager</h1>
          <p className="text-gray-300">Dashboard Login</p>
        </div>
        
        <form onSubmit={(e) => { e.preventDefault(); setIsLoggedIn(true); }} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">Username</label>
            <input
              type="text"
              className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 backdrop-blur-sm"
              placeholder="Enter username"
              defaultValue="admin"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">Password</label>
            <input
              type="password"
              className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 backdrop-blur-sm"
              placeholder="Enter password"
              defaultValue="admin123"
            />
          </div>
          
          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            Sign In
          </button>
        </form>
        
        <div className="mt-6 text-center text-sm text-gray-300">
          <p>Demo: admin / admin123</p>
        </div>
      </div>
    </div>
  );

  // Sidebar Navigation
  const Sidebar = () => (
    <div className="w-64 bg-gradient-to-b from-indigo-900 to-purple-900 text-white h-screen fixed left-0 top-0 overflow-y-auto shadow-2xl">
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Football Manager</h2>
            <p className="text-xs text-gray-300">Admin Dashboard</p>
          </div>
        </div>
      </div>
      
      <nav className="p-4 space-y-2">
        {[
          { id: 'dashboard', icon: Home, label: 'Dashboard' },
          { id: 'players', icon: Users, label: 'Players' },
          { id: 'clubs', icon: Shield, label: 'Clubs' },
          { id: 'revenue', icon: TrendingUp, label: 'Revenue' },
          { id: 'analytics', icon: Calendar, label: 'Analytics' },
          { id: 'logs', icon: Settings, label: 'Audit Logs' }
        ].map(item => (
          <button
            key={item.id}
            onClick={() => setCurrentPage(item.id)}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 ${
              currentPage === item.id
                ? 'bg-white/20 shadow-lg transform scale-105'
                : 'hover:bg-white/10'
            }`}
          >
            <item.icon className="w-5 h-5" />
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>
      
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
        <button
          onClick={() => setIsLoggedIn(false)}
          className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-red-600/20 hover:bg-red-600/30 rounded-xl transition-all"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );

  // Dashboard Overview
  const DashboardPage = () => {
    const totalPlayers = players.length;
    const totalClubs = clubs.length;
    const totalSalaries = players.reduce((sum, p) => sum + p.salary, 0);
    const totalRevenue = revenue.reduce((sum, r) => sum + r.ticketSales + r.jerseySales, 0);

    const revenueData = clubs.map(club => ({
      name: club.name,
      revenue: getTotalRevenue(club.id)
    }));

    const salaryByPosition = players.reduce((acc, player) => {
      const pos = player.position;
      if (!acc[pos]) acc[pos] = 0;
      acc[pos] += player.salary;
      return acc;
    }, {});

    const positionData = Object.keys(salaryByPosition).map(pos => ({
      name: pos,
      value: salaryByPosition[pos]
    }));

    const COLORS = ['#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6'];

    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard Overview</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: 'Total Players', value: totalPlayers, icon: Users, color: 'from-purple-500 to-pink-500' },
            { label: 'Total Clubs', value: totalClubs, icon: Shield, color: 'from-blue-500 to-cyan-500' },
            { label: 'Total Salaries', value: `$${(totalSalaries/1000).toFixed(0)}K`, icon: DollarSign, color: 'from-green-500 to-emerald-500' },
            { label: 'Total Revenue', value: `$${(totalRevenue/1000).toFixed(0)}K`, icon: TrendingUp, color: 'from-orange-500 to-red-500' }
          ].map((stat, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
                </div>
                <div className={`p-4 bg-gradient-to-br ${stat.color} rounded-xl shadow-lg`}>
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Revenue by Club</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff' }} />
                <Bar dataKey="revenue" fill="url(#colorRevenue)" radius={[8, 8, 0, 0]} />
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8b5cf6" />
                    <stop offset="100%" stopColor="#ec4899" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Salary Distribution by Position</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={positionData} cx="50%" cy="50%" outerRadius={100} fill="#8884d8" dataKey="value" label>
                  {positionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Top Paid Players</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Player</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Position</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Club</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Salary</th>
                </tr>
              </thead>
              <tbody>
                {players.sort((a, b) => b.salary - a.salary).slice(0, 5).map((player, idx) => (
                  <tr key={player.id} className="border-b border-gray-100 hover:bg-purple-50 transition-colors">
                    <td className="py-3 px-4">{player.firstName} {player.lastName}</td>
                    <td className="py-3 px-4">{player.position}</td>
                    <td className="py-3 px-4">{getClubName(player.clubId)}</td>
                    <td className="py-3 px-4 font-semibold text-green-600">${player.salary.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  // Players Page
  const PlayersPage = () => {
    const filteredPlayers = players.filter(p => {
      const matchesSearch = `${p.firstName} ${p.lastName}`.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesPosition = filterPosition === 'all' || p.position === filterPosition;
      const matchesNationality = filterNationality === 'all' || p.nationality === filterNationality;
      return matchesSearch && matchesPosition && matchesNationality;
    });

    const positions = [...new Set(players.map(p => p.position))];
    const nationalities = [...new Set(players.map(p => p.nationality))];

    const handleAddPlayer = () => {
      setModalType('addPlayer');
      setSelectedItem(null);
      setShowModal(true);
    };

    const handleEditPlayer = (player) => {
      setModalType('editPlayer');
      setSelectedItem(player);
      setShowModal(true);
    };

    const handleDeletePlayer = (playerId) => {
      if (confirm('Are you sure you want to delete this player?')) {
        setPlayers(players.filter(p => p.id !== playerId));
      }
    };

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800">Player Management</h1>
          <button
            onClick={handleAddPlayer}
            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg"
          >
            <Plus className="w-5 h-5" />
            <span>Add Player</span>
          </button>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search players..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            
            <select
              value={filterPosition}
              onChange={(e) => setFilterPosition(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">All Positions</option>
              {positions.map(pos => <option key={pos} value={pos}>{pos}</option>)}
            </select>

            <select
              value={filterNationality}
              onChange={(e) => setFilterNationality(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">All Nationalities</option>
              {nationalities.map(nat => <option key={nat} value={nat}>{nat}</option>)}
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Name</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Jersey</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Age</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Position</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Nationality</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Club</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Salary</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPlayers.map(player => (
                  <tr key={player.id} className="border-b border-gray-100 hover:bg-purple-50 transition-colors">
                    <td className="py-3 px-4 font-medium">{player.firstName} {player.lastName}</td>
                    <td className="py-3 px-4">#{player.jersey}</td>
                    <td className="py-3 px-4">{calculateAge(player.dob)}</td>
                    <td className="py-3 px-4">{player.position}</td>
                    <td className="py-3 px-4">{player.nationality}</td>
                    <td className="py-3 px-4">{getClubName(player.clubId)}</td>
                    <td className="py-3 px-4 font-semibold text-green-600">${player.salary.toLocaleString()}</td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditPlayer(player)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeletePlayer(player.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  // Clubs Page
  const ClubsPage = () => {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-800">Club Management</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clubs.map(club => {
            const stadium = getStadiumByClub(club.id);
            const clubPlayers = players.filter(p => p.clubId === club.id);
            const totalRevenue = getTotalRevenue(club.id);

            return (
              <div key={club.id} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                      {club.crest}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">{club.name}</h3>
                      <p className="text-sm text-gray-500">Jersey #{club.jersey}</p>
                    </div>
                  </div>
                </div>

                {stadium && (
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 mb-4">
                    <h4 className="font-semibold text-gray-700 mb-2">Stadium Info</h4>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p><span className="font-medium">Name:</span> {stadium.name}</p>
                      <p><span className="font-medium">Location:</span> {stadium.city}, {stadium.country}</p>
                      <p><span className="font-medium">Capacity:</span> {stadium.capacity.toLocaleString()}</p>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-blue-50 rounded-lg p-3">
                    <p className="text-xs text-gray-600 mb-1">Players</p>
                    <p className="text-2xl font-bold text-blue-600">{clubPlayers.length}</p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-3">
                    <p className="text-xs text-gray-600 mb-1">Revenue</p>
                    <p className="text-2xl font-bold text-green-600">${(totalRevenue/1000).toFixed(0)}K</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">Squad</h4>
                  <div className="space-y-2">
                    {clubPlayers.slice(0, 3).map(player => (
                      <div key={player.id} className="flex justify-between items-center text-sm">
                        <span className="text-gray-700">{player.firstName} {player.lastName}</span>
                        <span className="text-gray-500">#{player.jersey}</span>
                      </div>
                    ))}
                    {clubPlayers.length > 3 && (
                      <p className="text-xs text-gray-500">+{clubPlayers.length - 3} more players</p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Revenue Page
  const RevenuePage = () => {
    const revenueWithClubs = revenue.map(rev => {
      const club = clubs.find(c => c.id === rev.clubId);
      return {
        ...rev,
        clubName: club ? club.name : 'Unknown',
        total: rev.ticketSales + rev.jerseySales
      };
    });

    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-800">Revenue Dashboard</h1>

        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Revenue Breakdown by Club</h3>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={revenueWithClubs}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="clubName" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff' }} />
              <Legend />
              <Bar dataKey="ticketSales" fill="#8b5cf6" name="Ticket Sales" radius={[8, 8, 0, 0]} />
              <Bar dataKey="jerseySales" fill="#ec4899" name="Jersey Sales" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Total Revenue by Source</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={[
                    { name: 'Ticket Sales', value: revenue.reduce((sum, r) => sum + r.ticketSales, 0) },
                    { name: 'Jersey Sales', value: revenue.reduce((sum, r) => sum + r.jerseySales, 0) }
                  ]}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label
                >
                  <Cell fill="#8b5cf6" />
                  <Cell fill="#ec4899" />
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Revenue Details</h3>
            <div className="space-y-4">
              {revenueWithClubs.sort((a, b) => b.total - a.total).map((rev, idx) => (
                <div key={rev.id} className="border-l-4 border-purple-500 pl-4 py-2">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-semibold text-gray-800">{rev.clubName}</h4>
                    <span className="text-lg font-bold text-green-600">${rev.total.toLocaleString()}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                    <div>Tickets: ${rev.ticketSales.toLocaleString()}</div>
                    <div>Jerseys: ${rev.jerseySales.toLocaleString()}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Update Revenue</h3>
          <form onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const clubId = parseInt(formData.get('clubId'));
            const ticketSales = parseFloat(formData.get('ticketSales'));
            const jerseySales = parseFloat(formData.get('jerseySales'));
            
            setRevenue(revenue.map(r => 
              r.clubId === clubId 
                ? { ...r, ticketSales, jerseySales }
                : r
            ));
            alert('Revenue updated successfully! (Trigger logged)');
            e.target.reset();
          }} className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <select name="clubId" className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" required>
              <option value="">Select Club</option>
              {clubs.map(club => (
                <option key={club.id} value={club.id}>{club.name}</option>
              ))}
            </select>
            <input
              type="number"
              name="ticketSales"
              placeholder="Ticket Sales"
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
            <input
              type="number"
              name="jerseySales"
              placeholder="Jersey Sales"
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
            <button
              type="submit"
              className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all"
            >
              Update Revenue
            </button>
          </form>
        </div>
      </div>
    );
  };

  // Analytics Page
  const AnalyticsPage = () => {
    const upcomingBirthdays = players.filter(p => {
      const birthMonth = new Date(p.dob).getMonth();
      const currentMonth = new Date().getMonth();
      return birthMonth === currentMonth || birthMonth === (currentMonth + 1) % 12;
    }).map(p => ({
      ...p,
      birthDate: new Date(p.dob)
    })).sort((a, b) => a.birthDate - b.birthDate);

    const ageDistribution = players.reduce((acc, player) => {
      const age = calculateAge(player.dob);
      const ageGroup = age < 25 ? 'Under 25' : age < 30 ? '25-29' : age < 35 ? '30-34' : '35+';
      acc[ageGroup] = (acc[ageGroup] || 0) + 1;
      return acc;
    }, {});

    const ageData = Object.keys(ageDistribution).map(group => ({
      name: group,
      count: ageDistribution[group]
    }));

    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-800">Date & Time Analytics</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Age Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={ageData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff' }} />
                <Bar dataKey="count" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Upcoming Birthdays</h3>
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {upcomingBirthdays.length > 0 ? upcomingBirthdays.map(player => (
                <div key={player.id} className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
                  <div>
                    <p className="font-semibold text-gray-800">{player.firstName} {player.lastName}</p>
                    <p className="text-sm text-gray-600">
                      {new Date(player.dob).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-purple-600">{calculateAge(player.dob)}</p>
                    <p className="text-xs text-gray-500">years old</p>
                  </div>
                </div>
              )) : (
                <p className="text-center text-gray-500 py-8">No upcoming birthdays</p>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Player Age Details</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Player</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Date of Birth</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Age (Calculated)</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Position</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Days Since Birth</th>
                </tr>
              </thead>
              <tbody>
                {players.map(player => {
                  const dob = new Date(player.dob);
                  const today = new Date();
                  const daysSinceBirth = Math.floor((today - dob) / (1000 * 60 * 60 * 24));
                  
                  return (
                    <tr key={player.id} className="border-b border-gray-100 hover:bg-purple-50 transition-colors">
                      <td className="py-3 px-4 font-medium">{player.firstName} {player.lastName}</td>
                      <td className="py-3 px-4">{dob.toLocaleDateString()}</td>
                      <td className="py-3 px-4 font-semibold text-purple-600">{calculateAge(player.dob)} years</td>
                      <td className="py-3 px-4">{player.position}</td>
                      <td className="py-3 px-4 text-gray-600">{daysSinceBirth.toLocaleString()} days</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  // Logs Page
  const LogsPage = () => {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-800">Audit Logs</h1>

        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Salary Update Logs</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Log ID</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Player</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Old Salary</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">New Salary</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Change</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Date & Time</th>
                </tr>
              </thead>
              <tbody>
                {salaryLogs.map(log => {
                  const player = players.find(p => p.id === log.playerId);
                  const change = log.newSalary - log.oldSalary;
                  const changePercent = ((change / log.oldSalary) * 100).toFixed(1);
                  
                  return (
                    <tr key={log.id} className="border-b border-gray-100 hover:bg-purple-50 transition-colors">
                      <td className="py-3 px-4">#{log.id}</td>
                      <td className="py-3 px-4 font-medium">
                        {player ? `${player.firstName} ${player.lastName}` : 'Unknown'}
                      </td>
                      <td className="py-3 px-4 text-red-600">${log.oldSalary.toLocaleString()}</td>
                      <td className="py-3 px-4 text-green-600 font-semibold">${log.newSalary.toLocaleString()}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          change > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {change > 0 ? '+' : ''}{changePercent}%
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        {new Date(log.changeDate).toLocaleString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Recent Activity Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4">
              <p className="text-sm text-gray-600 mb-1">Total Salary Updates</p>
              <p className="text-3xl font-bold text-blue-600">{salaryLogs.length}</p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4">
              <p className="text-sm text-gray-600 mb-1">Total Salary Increase</p>
              <p className="text-3xl font-bold text-green-600">
                ${salaryLogs.reduce((sum, log) => sum + (log.newSalary - log.oldSalary), 0).toLocaleString()}
              </p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4">
              <p className="text-sm text-gray-600 mb-1">Avg Salary Increase</p>
              <p className="text-3xl font-bold text-purple-600">
                {(salaryLogs.reduce((sum, log) => sum + ((log.newSalary - log.oldSalary) / log.oldSalary * 100), 0) / salaryLogs.length).toFixed(1)}%
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Modal Component
  const Modal = () => {
    if (!showModal) return null;

    const handleSubmit = (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      
      if (modalType === 'addPlayer' || modalType === 'editPlayer') {
        const playerData = {
          id: selectedItem?.id || players.length + 1,
          firstName: formData.get('firstName'),
          lastName: formData.get('lastName'),
          jersey: parseInt(formData.get('jersey')),
          dob: formData.get('dob'),
          position: formData.get('position'),
          nationality: formData.get('nationality'),
          salary: parseFloat(formData.get('salary')),
          clubId: parseInt(formData.get('clubId'))
        };

        if (modalType === 'addPlayer') {
          setPlayers([...players, playerData]);
        } else {
          setPlayers(players.map(p => p.id === playerData.id ? playerData : p));
          
          // Log salary change if salary was updated
          if (selectedItem.salary !== playerData.salary) {
            setSalaryLogs([...salaryLogs, {
              id: salaryLogs.length + 1,
              playerId: playerData.id,
              oldSalary: selectedItem.salary,
              newSalary: playerData.salary,
              changeDate: new Date().toISOString()
            }]);
          }
        }
      }
      
      setShowModal(false);
    };

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            {modalType === 'addPlayer' ? 'Add New Player' : 'Edit Player'}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  defaultValue={selectedItem?.firstName || ''}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  defaultValue={selectedItem?.lastName || ''}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Jersey Number</label>
                <input
                  type="number"
                  name="jersey"
                  defaultValue={selectedItem?.jersey || ''}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                <input
                  type="date"
                  name="dob"
                  defaultValue={selectedItem?.dob || ''}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
              <select
                name="position"
                defaultValue={selectedItem?.position || ''}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              >
                <option value="">Select Position</option>
                <option value="Striker">Striker</option>
                <option value="Right Winger">Right Winger</option>
                <option value="Left Winger">Left Winger</option>
                <option value="Midfielder">Midfielder</option>
                <option value="Defender">Defender</option>
                <option value="Goalkeeper">Goalkeeper</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nationality</label>
              <input
                type="text"
                name="nationality"
                defaultValue={selectedItem?.nationality || ''}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Salary ($)</label>
              <input
                type="number"
                name="salary"
                step="0.01"
                defaultValue={selectedItem?.salary || ''}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Club</label>
              <select
                name="clubId"
                defaultValue={selectedItem?.clubId || ''}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              >
                <option value="">Select Club</option>
                {clubs.map(club => (
                  <option key={club.id} value={club.id}>{club.name}</option>
                ))}
              </select>
            </div>

            <div className="flex space-x-3 pt-4">
              <button
                type="submit"
                className="flex-1 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all font-semibold"
              >
                {modalType === 'addPlayer' ? 'Add Player' : 'Update Player'}
              </button>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="flex-1 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all font-semibold"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  if (!isLoggedIn) {
    return <LoginPage />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Sidebar />
      <div className="ml-64 p-8">
        {currentPage === 'dashboard' && <DashboardPage />}
        {currentPage === 'players' && <PlayersPage />}
        {currentPage === 'clubs' && <ClubsPage />}
        {currentPage === 'revenue' && <RevenuePage />}
        {currentPage === 'analytics' && <AnalyticsPage />}
        {currentPage === 'logs' && <LogsPage />}
      </div>
      <Modal />
    </div>
  );
};

export default FootballDashboard;