import Svg, { Ellipse, Path, Rect, Line, Circle } from 'react-native-svg';

// Slide 1: Hoodie — purple theme
export function HoodieIllustration() {
  return (
    <Svg width="200" height="240" viewBox="0 0 200 240" fill="none">
      {/* Ground shadow */}
      <Ellipse cx="100" cy="228" rx="55" ry="10" fill="rgba(0,0,0,0.15)" />
      {/* Body */}
      <Path d="M45 95 C30 100 22 120 20 160 L18 220 Q18 226 24 226 L176 226 Q182 226 182 220 L180 160 C178 120 170 100 155 95 L140 88 C130 108 70 108 60 88 Z" fill="#6C5CE7" />
      {/* Body shadow left */}
      <Path d="M45 95 C30 100 22 120 20 160 L18 220 Q18 226 24 226 L55 226 L55 120 Z" fill="rgba(0,0,0,0.08)" />
      {/* Left sleeve */}
      <Path d="M45 95 L20 105 C10 110 5 125 8 145 L14 170 C16 178 24 180 30 175 L50 155 L55 120 Z" fill="#7D6FF0" />
      {/* Right sleeve */}
      <Path d="M155 95 L180 105 C190 110 195 125 192 145 L186 170 C184 178 176 180 170 175 L150 155 L145 120 Z" fill="#5A4ED4" />
      {/* Sleeve cuff left */}
      <Path d="M8 145 C8 155 14 163 14 170 L30 175 C24 165 18 157 18 147 Z" fill="#4A3EC4" />
      {/* Sleeve cuff right */}
      <Path d="M192 145 C192 155 186 163 186 170 L170 175 C176 165 182 157 182 147 Z" fill="#4A3EC4" />
      {/* Hood outer */}
      <Path d="M60 88 Q70 50 100 42 Q130 50 140 88 C130 108 70 108 60 88 Z" fill="#7D6FF0" />
      {/* Hood inner */}
      <Path d="M68 90 Q78 60 100 53 Q122 60 132 90 C122 104 78 104 68 90 Z" fill="#1a1042" />
      {/* Kangaroo pocket */}
      <Rect x="72" y="165" width="56" height="32" rx="8" fill="rgba(0,0,0,0.15)" />
      <Path d="M72 181 Q100 189 128 181" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" fill="none" />
      {/* Center seam */}
      <Line x1="92" y1="108" x2="88" y2="168" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
      <Line x1="108" y1="108" x2="112" y2="168" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
      {/* Drawstring holes */}
      <Circle cx="87" cy="172" r="4" fill="#4A3EC4" />
      <Circle cx="113" cy="172" r="4" fill="#4A3EC4" />
      {/* Highlight */}
      <Path d="M75 105 C72 120 70 140 72 160" stroke="rgba(255,255,255,0.2)" strokeWidth="3" strokeLinecap="round" fill="none" />
    </Svg>
  );
}

// Slide 2: Dress — green theme
export function DressIllustration() {
  return (
    <Svg width="200" height="250" viewBox="0 0 200 250" fill="none">
      {/* Ground shadow */}
      <Ellipse cx="100" cy="238" rx="58" ry="10" fill="rgba(0,0,0,0.12)" />
      {/* Skirt */}
      <Path d="M55 118 C30 140 15 175 12 230 Q12 238 20 238 L180 238 Q188 238 188 230 C185 175 170 140 145 118 Z" fill="#00B894" />
      {/* Skirt shadow */}
      <Path d="M55 118 C30 140 15 175 12 230 Q12 238 20 238 L45 238 C42 190 55 155 70 130 Z" fill="rgba(0,0,0,0.08)" />
      {/* Bodice */}
      <Path d="M68 60 L55 118 L145 118 L132 60 Q116 70 100 70 Q84 70 68 60 Z" fill="#00D2A8" />
      {/* Bodice shadow */}
      <Path d="M68 60 L55 118 L75 118 L80 68 Z" fill="rgba(0,0,0,0.08)" />
      {/* Neckline */}
      <Path d="M68 60 Q84 75 100 76 Q116 75 132 60 Q122 52 100 50 Q78 52 68 60 Z" fill="#00B894" />
      {/* Left strap */}
      <Path d="M80 68 L74 42 Q72 36 78 34 L86 32 Q90 31 90 37 L88 68 Z" fill="#00D2A8" />
      {/* Right strap */}
      <Path d="M120 68 L126 42 Q128 36 122 34 L114 32 Q110 31 110 37 L112 68 Z" fill="#00D2A8" />
      {/* Waist band */}
      <Rect x="55" y="112" width="90" height="12" rx="4" fill="rgba(0,0,0,0.15)" />
      {/* Floral dots */}
      <Circle cx="85" cy="145" r="3" fill="rgba(255,255,255,0.15)" />
      <Circle cx="115" cy="160" r="3" fill="rgba(255,255,255,0.15)" />
      <Circle cx="70" cy="175" r="2.5" fill="rgba(255,255,255,0.12)" />
      <Circle cx="130" cy="185" r="2.5" fill="rgba(255,255,255,0.12)" />
      <Circle cx="95" cy="200" r="3" fill="rgba(255,255,255,0.1)" />
      {/* Highlight */}
      <Path d="M80 78 C78 95 76 110 76 118" stroke="rgba(255,255,255,0.25)" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    </Svg>
  );
}

// Slide 3: Jacket + Pants — orange/dark theme
export function OutfitIllustration() {
  return (
    <Svg width="200" height="260" viewBox="0 0 200 260" fill="none">
      {/* Ground shadow */}
      <Ellipse cx="100" cy="250" rx="52" ry="9" fill="rgba(0,0,0,0.13)" />
      {/* Pants */}
      <Path d="M62 148 L58 248 Q58 252 64 252 L88 252 Q93 252 93 247 L96 178 L104 178 L107 247 Q107 252 112 252 L136 252 Q142 252 142 248 L138 148 Z" fill="#2C3E50" />
      {/* Pants shadow */}
      <Path d="M62 148 L58 248 Q58 252 64 252 L74 252 L70 152 Z" fill="rgba(0,0,0,0.1)" />
      {/* Pants center seam */}
      <Path d="M95 178 L96 252 L104 252 L105 178 Z" fill="rgba(0,0,0,0.12)" />
      {/* Belt */}
      <Rect x="60" y="144" width="80" height="10" rx="3" fill="#1a252f" />
      <Rect x="95" y="144" width="10" height="10" rx="1" fill="#C0A060" />
      {/* Jacket body */}
      <Path d="M50 72 C35 78 26 98 24 130 L22 148 L90 148 L90 100 Q90 80 100 76 Q110 80 110 100 L110 148 L178 148 L176 130 C174 98 165 78 150 72 L134 65 L120 90 L100 94 L80 90 Z" fill="#E17055" />
      {/* Jacket shadow */}
      <Path d="M50 72 C35 78 26 98 24 130 L22 148 L50 148 L50 100 Z" fill="rgba(0,0,0,0.1)" />
      {/* Left sleeve */}
      <Path d="M50 72 L24 84 C14 90 10 108 13 128 L18 148 L50 148 L50 100 Z" fill="#C0604A" />
      {/* Right sleeve */}
      <Path d="M150 72 L176 84 C186 90 190 108 187 128 L182 148 L150 148 L150 100 Z" fill="#C0604A" />
      {/* Left lapel */}
      <Path d="M80 90 L68 148 L90 148 L90 100 Z" fill="#CC5D44" />
      {/* Right lapel */}
      <Path d="M120 90 L132 148 L110 148 L110 100 Z" fill="#CC5D44" />
      {/* Collar */}
      <Path d="M80 90 Q90 100 100 100 Q110 100 120 90 L114 70 Q100 80 86 70 Z" fill="#C0604A" />
      {/* Zipper */}
      <Line x1="100" y1="95" x2="100" y2="148" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" strokeDasharray="4,3" />
      {/* Left pocket */}
      <Rect x="28" y="112" width="28" height="20" rx="5" fill="rgba(0,0,0,0.12)" />
      {/* Right pocket */}
      <Rect x="144" y="112" width="28" height="20" rx="5" fill="rgba(0,0,0,0.12)" />
      {/* Highlight */}
      <Path d="M60 80 C58 100 56 120 56 138" stroke="rgba(255,255,255,0.2)" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    </Svg>
  );
}
