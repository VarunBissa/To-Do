export const Badge = ({ children, variant = 'default', className = '' }) => {
  const variantClasses = {
    default: 'bg-gray-200 dark:bg-slate-700 text-gray-800 dark:text-gray-200',
    low: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300',
    medium: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300',
    high: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300',
    success: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300',
  };

  return (
    <span 
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variantClasses[variant]} ${className}`}
    >
      {children}
    </span>
  );
};
