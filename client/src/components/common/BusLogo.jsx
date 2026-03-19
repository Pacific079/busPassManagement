const BusLogo = ({ 
  size = 48, 
  color = '#0f4c75', 
  accentColor = '#87ceeb',
  src = null,      // Path to custom SVG file (e.g., '/bus-logo.svg')
  svgContent = null // Custom SVG JSX content
}) => {
  // If custom SVG content is provided as JSX
  if (svgContent) {
    return <div style={{ width: size, height: size }}>{svgContent}</div>;
  }

  // If custom SVG file path is provided
  if (src) {
    return <img src={src} alt="Logo" style={{ width: size, height: size, objectFit: 'contain' }} />;
  }

  // Default Bus Logo
  return (
    <svg width={size} height={size} viewBox="0 -2 20 20" xmlns="http://www.w3.org/2000/svg">
      <g id="bus-left" transform="translate(-2 -3.997)">
        <path id="secondary" fill="#2ca9bc" d="M3,11H21v5a1,1,0,0,1-1,1H19a2,2,0,0,0-4,0H9a2,2,0,0,0-4,0H4a1,1,0,0,1-1-1V11Z"/>
        <path id="primary" d="M4.91,17H4a1,1,0,0,1-1-1V10.85L4.77,5.68a1,1,0,0,1,1-.68H20a1,1,0,0,1,1,1V16a1,1,0,0,1-1,1h-.91" fill="none" stroke="#000000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/>
        <path id="primary-2" data-name="primary" d="M3,11H21m-6.08,6H9.06M15,5H9v6h6Zm0,12a2,2,0,1,0,2-2A2,2,0,0,0,15,17ZM5,17a2,2,0,1,0,2-2A2,2,0,0,0,5,17Z" fill="none" stroke="#000000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/>
      </g>
    </svg>
  );
};

export default BusLogo;
