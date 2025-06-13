import React from 'react';
import { Link } from 'react-router-dom';
import { Package, CreditCard, Heart, User, Settings, LogOut } from 'lucide-react';

const AccountPage: React.FC = () => {
  // Mock user data
  const user = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    memberSince: 'January 2023'
  };
  
  const AccountCard = ({ 
    title, 
    icon, 
    description, 
    linkText, 
    linkTo 
  }: { 
    title: string; 
    icon: React.ReactNode; 
    description: string; 
    linkText: string; 
    linkTo: string; 
  }) => (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start">
        <div className="mr-4 text-[#FF9900]">
          {icon}
        </div>
        <div>
          <h3 className="font-medium text-lg mb-2">{title}</h3>
          <p className="text-gray-600 text-sm mb-4">{description}</p>
          <Link to={linkTo} className="text-[#007185] hover:text-[#FF9900] hover:underline text-sm">
            {linkText}
          </Link>
        </div>
      </div>
    </div>
  );
  
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-medium mb-2">Your Account</h1>
        <p className="text-gray-600">
          Hello, {user.name} • Member since {user.memberSince}
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AccountCard
          title="Your Orders"
          icon={<Package size={24} />}
          description="Track, return, or buy things again"
          linkText="View your orders"
          linkTo="/orders"
        />
        
        <AccountCard
          title="Payment Methods"
          icon={<CreditCard size={24} />}
          description="Manage payment methods and settings"
          linkText="Manage payment options"
          linkTo="/payment-methods"
        />
        
        <AccountCard
          title="Your Lists"
          icon={<Heart size={24} />}
          description="View, create, and manage your wish lists"
          linkText="View your lists"
          linkTo="/wishlists"
        />
        
        <AccountCard
          title="Login & Security"
          icon={<User size={24} />}
          description="Edit login, name, and mobile number"
          linkText="Edit your profile"
          linkTo="/security"
        />
        
        <AccountCard
          title="Prime"
          icon={<Settings size={24} />}
          description="View benefits and payment settings"
          linkText="Manage your Prime account"
          linkTo="/prime"
        />
        
        <AccountCard
          title="Sign Out"
          icon={<LogOut size={24} />}
          description="Sign out of your account"
          linkText="Sign out"
          linkTo="/logout"
        />
      </div>
      
      <div className="mt-12 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-medium mb-4">Recently Viewed Items</h2>
        <p className="text-gray-600">
          You haven't viewed any items yet. Start shopping to see your recently viewed items.
        </p>
        <Link to="/" className="inline-block mt-4 bg-[#FF9900] hover:bg-[#e88e00] text-white px-6 py-2 rounded-md transition-colors">
          Shop Now
        </Link>
      </div>
    </div>
  );
};

export default AccountPage;