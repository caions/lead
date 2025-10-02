interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  padding?: 'sm' | 'md' | 'lg';
}

export default function Card({ 
  children, 
  className = '', 
  hover = false,
  padding = 'md'
}: CardProps) {
  const paddingClass = {
    'sm': 'p-4',
    'md': 'p-6',
    'lg': 'p-8'
  }[padding];

  const hoverClass = hover ? 'card-hover' : '';

  return (
    <div className={`card ${paddingClass} ${hoverClass} ${className}`}>
      {children}
    </div>
  );
}
