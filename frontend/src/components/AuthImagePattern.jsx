const AuthImagePattern = ({ title, subtitle }) => {
  return (
    <div className="hidden lg:flex items-center justify-center bg-base-200 p-12">
      {/* Container for the image pattern */}
      <div className="max-w-md text-center">
        
        {/* Grid for generating 9 blocks in a 3x3 layout */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {[...Array(9)].map((_, i) => (
            <div
              key={i}
              className={`aspect-square rounded-2xl bg-primary/10 ${
                i % 2 === 0 ? "animate-pulse" : "" // Apply animation to even blocks
              }`}
            />
          ))}
        </div>

        {/* Title of the pattern */}
        <h2 className="text-2xl font-bold mb-4">{title}</h2>

        {/* Subtitle of the pattern */}
        <p className="text-base-content/60">{subtitle}</p>
      </div>
    </div>
  );
};

export default AuthImagePattern;
