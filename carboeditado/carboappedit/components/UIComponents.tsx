import React from 'react';
import { Loader2, X, Check } from 'lucide-react';

// --- Buttons ---
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline' | 'success';
  isLoading?: boolean;
  icon?: React.ReactNode;
  // Added size prop to resolve TypeScript errors in multiple pages
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  className = '', 
  isLoading, 
  icon,
  size = 'md', // Default size is md
  ...props 
}) => {
  // iOS Style: Pill shapes or very soft rounded corners
  const baseStyles = "inline-flex items-center justify-center rounded-2xl font-bold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-4 focus:ring-opacity-20 tracking-wide active:scale-95 touch-manipulation";
  
  // Size-specific styles
  const sizeStyles = {
    sm: "px-4 py-2 text-xs",
    md: "px-6 py-3 text-sm",
    lg: "px-8 py-4 text-base",
    xl: "px-10 py-5 text-lg"
  };
  
  const variants = {
    primary: "bg-carbo-primary text-white hover:brightness-110 shadow-lg shadow-orange-500/30 focus:ring-orange-500",
    secondary: "bg-white/80 dark:bg-zinc-800/80 backdrop-blur-md text-gray-800 dark:text-zinc-200 border border-white/50 dark:border-white/10 hover:bg-white dark:hover:bg-zinc-700 shadow-soft hover:shadow-hover focus:ring-gray-200",
    outline: "bg-transparent border-2 border-carbo-primary text-carbo-primary hover:bg-orange-50/50 dark:hover:bg-orange-900/20 focus:ring-orange-500",
    danger: "bg-red-50/80 dark:bg-red-900/30 backdrop-blur-sm text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/50 border border-red-100 dark:border-red-800/30 focus:ring-red-200",
    success: "bg-green-500 text-white hover:bg-green-400 shadow-lg shadow-green-500/30 focus:ring-green-500",
    ghost: "bg-transparent text-gray-500 dark:text-gray-400 hover:text-carbo-primary hover:bg-white/40 dark:hover:bg-zinc-800/50",
  };

  return (
    <button 
      className={`${baseStyles} ${sizeStyles[size]} ${variants[variant]} ${className}`} 
      {...props}
    >
      {isLoading ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : icon && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
};

// --- Cards (THE WIDGET) ---
// Estilo iOS 26 + Dark Mode Comfort
export const Card: React.FC<{ children: React.ReactNode; className?: string; onClick?: () => void }> = ({ children, className = '', onClick }) => (
  <div 
    onClick={onClick} 
    className={`
      glass-panel relative overflow-hidden
      rounded-[2rem] p-6
      transition-all duration-500 ease-out
      ${onClick ? 'cursor-pointer hover:shadow-hover hover:-translate-y-1 hover:bg-white/90 dark:hover:bg-zinc-800/80' : ''} 
      ${className}
    `}
  >
    {/* Subtle Inner Highlight for Depth */}
    <div className="absolute inset-0 border border-white/40 dark:border-white/5 rounded-[2rem] pointer-events-none"></div>
    <div className="relative z-10 text-gray-900 dark:text-gray-100">
      {children}
    </div>
  </div>
);

// --- Badges ---
export const Badge: React.FC<{ children: React.ReactNode; variant?: 'success' | 'warning' | 'danger' | 'neutral' | 'primary'; className?: string }> = ({ children, variant = 'neutral', className = '' }) => {
  const styles = {
    success: "bg-green-100/50 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-200/50 dark:border-green-700/30",
    warning: "bg-yellow-100/50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 border-yellow-200/50 dark:border-yellow-700/30",
    danger: "bg-red-100/50 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-200/50 dark:border-red-700/30",
    neutral: "bg-gray-100/50 dark:bg-zinc-800/50 text-gray-600 dark:text-gray-300 border-gray-200/50 dark:border-zinc-700/30",
    primary: "bg-orange-100/50 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 border-orange-200/50 dark:border-orange-700/30",
  };
  
  return (
    <span className={`px-3 py-1.5 rounded-xl text-xs font-bold border backdrop-blur-sm ${styles[variant]} ${className}`}>
      {children}
    </span>
  );
};

// --- Inputs ---
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({ label, icon, className = '', ...props }) => (
  <div className="w-full">
    {label && <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 ml-1">{label}</label>}
    <div className="relative group">
      {icon && (
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 dark:text-gray-500 group-focus-within:text-carbo-primary transition-colors">
          {icon}
        </div>
      )}
      <input
        className={`
          w-full bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm 
          border border-gray-200/60 dark:border-zinc-700/60
          text-gray-900 dark:text-zinc-100 rounded-2xl py-3.5 
          ${icon ? 'pl-12' : 'pl-5'} pr-5 
          focus:ring-4 focus:ring-carbo-primary/10 focus:border-carbo-primary/50 focus:bg-white dark:focus:bg-zinc-800
          placeholder-gray-400 dark:placeholder-zinc-600 transition-all duration-300 shadow-sm
          ${className}
        `}
        {...props}
      />
    </div>
  </div>
);

// --- Section Title ---
export const SectionTitle: React.FC<{ title: string; subtitle?: string; className?: string }> = ({ title, subtitle, className = '' }) => (
  <div className={`mb-8 ${className}`}>
    <h2 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-zinc-100 tracking-tight leading-tight">{title}</h2>
    {subtitle && <p className="text-sm text-gray-500 dark:text-zinc-400 mt-2 font-medium leading-relaxed max-w-2xl">{subtitle}</p>}
  </div>
);

// --- Modal ---
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, footer }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center p-4 md:p-6">
      <div className="absolute inset-0 bg-gray-900/40 dark:bg-black/60 backdrop-blur-md transition-opacity duration-500" onClick={onClose} />
      
      <div className="
        relative z-10 w-full md:max-w-lg 
        glass-panel bg-white/90 dark:bg-zinc-900/95 shadow-2xl
        flex flex-col max-h-[90vh] 
        rounded-[2.5rem] 
        animate-in slide-in-from-bottom-10 fade-in duration-300
      ">
        {/* Mobile Drag Handle */}
        <div className="md:hidden w-full flex justify-center pt-4 pb-2" onClick={onClose}>
            <div className="w-12 h-1.5 bg-gray-300/80 dark:bg-zinc-700/80 rounded-full"></div>
        </div>

        <div className="flex justify-between items-center px-8 py-6 border-b border-gray-100/50 dark:border-zinc-800/50 shrink-0">
          <h3 className="text-xl font-black text-gray-900 dark:text-zinc-100 truncate pr-4">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-zinc-300 p-2.5 bg-gray-100/50 dark:bg-zinc-800/50 hover:bg-gray-200/50 dark:hover:bg-zinc-700/50 rounded-full transition-all">
            <X size={20}/>
          </button>
        </div>
        
        <div className="p-8 overflow-y-auto custom-scrollbar overscroll-contain text-gray-800 dark:text-zinc-300">
          {children}
        </div>
        
        {footer && (
          <div className="p-6 border-t border-gray-100/50 dark:border-zinc-800/50 bg-gray-50/50 dark:bg-zinc-800/30 rounded-b-[2.5rem] shrink-0 backdrop-blur-xl">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

// --- Tabs ---
export const Tabs: React.FC<{ tabs: string[]; activeTab: string; onChange: (t: string) => void }> = ({ tabs, activeTab, onChange }) => (
  <div className="flex gap-2 p-1.5 bg-gray-100/60 dark:bg-zinc-800/60 backdrop-blur-sm border border-white/20 dark:border-white/5 rounded-2xl w-full md:w-fit mb-8 overflow-x-auto shadow-inner">
    {tabs.map(tab => (
      <button
        key={tab}
        onClick={() => onChange(tab)}
        className={`
          flex-1 md:flex-none px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 whitespace-nowrap
          ${activeTab === tab 
            ? 'bg-white dark:bg-zinc-700 text-carbo-primary dark:text-orange-400 shadow-sm scale-[1.02]' 
            : 'text-gray-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-zinc-200 hover:bg-white/40 dark:hover:bg-zinc-700/40'
          }
        `}
      >
        {tab}
      </button>
    ))}
  </div>
);

// --- Stepper ---
export const Stepper: React.FC<{ steps: string[]; currentStep: number }> = ({ steps, currentStep }) => (
  <div className="flex items-center w-full mb-8 overflow-x-auto pb-4">
    {steps.map((step, index) => (
      <React.Fragment key={index}>
        <div className="flex flex-col items-center min-w-[70px]">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-black transition-all duration-500 border-2 ${
            index <= currentStep 
              ? 'bg-carbo-primary text-white border-carbo-primary shadow-glow scale-110' 
              : 'bg-white dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 text-gray-400 dark:text-zinc-500'
          }`}>
            {index < currentStep ? <Check size={16} strokeWidth={3} /> : index + 1}
          </div>
          <span className={`text-[10px] uppercase font-bold mt-3 text-center whitespace-nowrap tracking-wider transition-colors duration-300 ${index <= currentStep ? 'text-carbo-primary dark:text-orange-400' : 'text-gray-400 dark:text-zinc-600'}`}>{step}</span>
        </div>
        {index < steps.length - 1 && (
          <div className="flex-1 h-1 mx-3 rounded-full bg-gray-100 dark:bg-zinc-800 overflow-hidden">
             <div className={`h-full bg-carbo-primary transition-all duration-700 ease-out`} style={{ width: index < currentStep ? '100%' : '0%' }} />
          </div>
        )}
      </React.Fragment>
    ))}
  </div>
);

// --- Avatar ---
export const Avatar: React.FC<{ src?: string; fallback: React.ReactNode; size?: 'sm'|'md'|'lg'|'xl'|'full' }> = ({ src, fallback, size = 'md' }) => {
  const sizes = { sm: 'w-9 h-9 text-xs', md: 'w-11 h-11 text-sm', lg: 'w-16 h-16 text-lg', xl: 'w-24 h-24 text-2xl', full: 'w-full h-full' };
  return (
    <div className={`${sizes[size]} rounded-full bg-white dark:bg-zinc-800 flex items-center justify-center font-bold text-gray-600 dark:text-zinc-300 border-2 border-white dark:border-zinc-700 shadow-sm overflow-hidden shrink-0`}>
      {src ? <img src={src} alt="avatar" className="w-full h-full object-cover" /> : fallback}
    </div>
  );
}