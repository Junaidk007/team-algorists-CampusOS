import React from 'react';

interface AvatarProps {
  name?: string;
  role?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const Avatar: React.FC<AvatarProps> = ({
  name = 'User',
  role = 'attendee',
  size = 'md',
  className = '',
}) => {
  // Get initials (up to 2 characters)
  const getInitials = (n: string) => {
    const parts = n.trim().split(/\s+/);
    if (parts.length === 0) return 'U';
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const initials = getInitials(name);

  // Generate a consistent gradient based on the name or role
  const getGradientClass = (roleStr: string, nameStr: string) => {
    const roleLower = roleStr.toLowerCase();
    if (roleLower === 'admin') {
      return 'bg-gradient-to-tr from-violet-600 to-indigo-600 text-white';
    }
    if (roleLower === 'organizer') {
      return 'bg-gradient-to-tr from-indigo-500 to-teal-500 text-white';
    }
    
    // Fallback based on name string hash
    let hash = 0;
    for (let i = 0; i < nameStr.length; i++) {
      hash = nameStr.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % 4;
    const gradients = [
      'bg-gradient-to-tr from-blue-500 to-indigo-500 text-white',
      'bg-gradient-to-tr from-emerald-500 to-teal-500 text-white',
      'bg-gradient-to-tr from-amber-500 to-orange-500 text-white',
      'bg-gradient-to-tr from-purple-500 to-pink-500 text-white',
    ];
    return gradients[index];
  };

  const gradient = getGradientClass(role, name);

  // Sizing styles
  const sizeStyles = {
    xs: 'w-6 h-6 text-[10px] font-bold rounded-md',
    sm: 'w-8 h-8 text-xs font-bold rounded-lg',
    md: 'w-10 h-10 text-sm font-bold rounded-xl',
    lg: 'w-12 h-12 text-base font-bold rounded-xl',
    xl: 'w-14 h-14 text-lg font-bold rounded-2xl',
  };

  return (
    <div
      className={`flex items-center justify-center select-none shadow-sm border border-white/10 ${sizeStyles[size]} ${gradient} ${className}`}
      title={`${name} (${role})`}
    >
      {initials}
    </div>
  );
};

export default Avatar;
export { Avatar };
