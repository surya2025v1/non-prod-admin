"use client"

interface HinduDiyaProps {
  isLit?: boolean
  size?: 'small' | 'medium' | 'large'
  className?: string
}

export function HinduDiya({ isLit = true, size = 'medium', className = '' }: HinduDiyaProps) {
  const sizeClasses = {
    small: 'w-8 h-6',
    medium: 'w-12 h-9', 
    large: 'w-16 h-12'
  }

  const flameSizes = {
    small: 'w-1.5 h-3',
    medium: 'w-2 h-4',
    large: 'w-3 h-6'
  }

  const wickSizes = {
    small: 'w-0.5 h-2',
    medium: 'w-1 h-3',
    large: 'w-1.5 h-4'
  }

  return (
    <div className={`hindu-diya ${sizeClasses[size]} ${className}`}>
      {/* Diya Base */}
      <div className="diya-base w-full h-2/3 bg-gradient-to-br from-amber-800 via-amber-700 to-amber-900 relative">
        <div 
          className="absolute inset-0 rounded-full"
          style={{
            background: 'linear-gradient(145deg, #8B4513, #A0522D)',
            borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
            border: '1px solid #654321',
            boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3)'
          }}
        />
        
        {/* Oil/Ghee inside */}
        <div 
          className="absolute top-1 left-1 right-1 h-1/2 bg-gradient-to-br from-yellow-400 to-yellow-600 opacity-60"
          style={{
            borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%'
          }}
        />
        
        {/* Wick */}
        <div 
          className={`diya-wick absolute ${wickSizes[size]} bg-gray-800`}
          style={{
            top: '-6px',
            right: size === 'small' ? '6px' : size === 'medium' ? '8px' : '12px',
            borderRadius: '50% 50% 0 0'
          }}
        />
        
        {/* Flame */}
        {isLit && (
          <div 
            className={`diya-flame absolute ${flameSizes[size]} flame-dance`}
            style={{
              top: size === 'small' ? '-10px' : size === 'medium' ? '-12px' : '-18px',
              right: size === 'small' ? '5px' : size === 'medium' ? '7px' : '10px',
              background: 'radial-gradient(ellipse at center bottom, #FF6B35 0%, #F7931E 30%, #FFD700 70%, #FFF 100%)',
              borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
              filter: 'drop-shadow(0 0 8px rgba(255, 165, 0, 0.8))'
            }}
          />
        )}
        
        {/* Decorative dots on diya */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 flex space-x-1">
          <div className="w-1 h-1 bg-gold-400 rounded-full opacity-80"></div>
          <div className="w-1 h-1 bg-gold-400 rounded-full opacity-60"></div>
          <div className="w-1 h-1 bg-gold-400 rounded-full opacity-80"></div>
        </div>
      </div>
    </div>
  )
}

export default HinduDiya 