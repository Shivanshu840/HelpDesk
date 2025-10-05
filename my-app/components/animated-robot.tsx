export function AnimatedRobot() {
  return (
    <div className="relative w-[320px] h-[380px] mx-auto">
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        @keyframes wave {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-15deg); }
          75% { transform: rotate(15deg); }
        }
        @keyframes blink {
          0%, 90%, 100% { opacity: 1; }
          95% { opacity: 0.2; }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.1); opacity: 1; }
        }
        @keyframes floatIcon {
          0% { opacity: 0; transform: translateY(0) scale(0.5); }
          20% { opacity: 1; transform: translateY(-30px) scale(1); }
          80% { opacity: 1; transform: translateY(-60px) scale(1); }
          100% { opacity: 0; transform: translateY(-90px) scale(0.5); }
        }
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 10px rgba(168, 85, 247, 0.5); }
          50% { box-shadow: 0 0 20px rgba(168, 85, 247, 0.8); }
        }
        .float { animation: float 3s ease-in-out infinite; }
        .wave-left { animation: wave 2s ease-in-out infinite; }
        .wave-right { animation: wave 2s ease-in-out infinite 1s; }
        .blink { animation: blink 3s ease-in-out infinite; }
        .pulse { animation: pulse 2s ease-in-out infinite; }
        .float-icon { animation: floatIcon 4s ease-in-out infinite; }
        .glow { animation: glow 2s ease-in-out infinite; }
      `}</style>

      {/* Floating Support Icons */}
      <div className="absolute top-10 left-8 text-3xl float-icon" style={{ animationDelay: '0s' }}>
        🎫
      </div>
      <div className="absolute top-24 right-10 text-3xl float-icon" style={{ animationDelay: '1.3s' }}>
        💬
      </div>
      <div className="absolute bottom-24 left-12 text-3xl float-icon" style={{ animationDelay: '2.6s' }}>
        ✨
      </div>

      {/* Main Container with Float Animation */}
      <div className="absolute inset-0 float">
        {/* Helmet/Head */}
        <div className="absolute left-1/2 top-8 -translate-x-1/2">
          {/* Helmet Glass */}
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-400/30 to-purple-600/20 backdrop-blur-sm border-4 border-purple-500/40 relative overflow-hidden">
            {/* Helmet Shine */}
            <div className="absolute top-2 left-4 w-12 h-12 rounded-full bg-white/20 blur-xl"></div>
            
            {/* Face */}
            <div className="absolute inset-0 flex items-center justify-center">
              {/* Eyes */}
              <div className="flex gap-6 mt-2">
                <div className="relative">
                  <div className="w-6 h-6 rounded-full bg-slate-800">
                    <div className="absolute top-1 left-1 w-4 h-4 rounded-full bg-purple-500 glow blink"></div>
                  </div>
                </div>
                <div className="relative">
                  <div className="w-6 h-6 rounded-full bg-slate-800">
                    <div className="absolute top-1 left-1 w-4 h-4 rounded-full bg-purple-500 glow blink" style={{ animationDelay: '0.1s' }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Smile */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-10 h-5 border-b-4 border-slate-700 rounded-b-full"></div>
            {/* Smile dimples */}
            <div className="absolute bottom-10 left-8 w-2 h-2 bg-slate-700 rounded-full"></div>
            <div className="absolute bottom-10 right-8 w-2 h-2 bg-slate-700 rounded-full"></div>

            {/* Display Panel */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-slate-800 px-3 py-1 rounded text-xs font-mono text-purple-400">
              HELP
            </div>
          </div>

          {/* Antenna */}
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-1 h-8 bg-slate-400">
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-purple-500 pulse"></div>
          </div>
        </div>

        {/* Body/Suit */}
        <div className="absolute left-1/2 top-36 -translate-x-1/2">
          <div className="w-40 h-48 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 relative shadow-2xl shadow-purple-500/40">
            {/* Suit Details */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 w-24 h-8 bg-slate-800/30 rounded-lg"></div>
            
            {/* Control Panel */}
            <div className="absolute top-16 left-1/2 -translate-x-1/2 flex gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500 pulse"></div>
              <div className="w-3 h-3 rounded-full bg-purple-400 pulse" style={{ animationDelay: '0.5s' }}></div>
              <div className="w-3 h-3 rounded-full bg-pink-500 pulse" style={{ animationDelay: '1s' }}></div>
            </div>

            {/* Support Badge */}
            <div className="absolute top-28 left-1/2 -translate-x-1/2 bg-white/90 px-3 py-1 rounded-full text-xs font-bold text-purple-600 shadow-lg">
              SUPPORT
            </div>

            {/* Life Support Lines */}
            <div className="absolute top-4 left-2 w-1 h-40 bg-slate-700/30 rounded"></div>
            <div className="absolute top-4 right-2 w-1 h-40 bg-slate-700/30 rounded"></div>
          </div>
        </div>

        {/* Arms */}
        <div className="absolute left-[72px] top-[160px] origin-top-right wave-left">
          <div className="w-4 h-20 bg-gradient-to-b from-purple-500 to-purple-600 rounded-lg shadow-lg">
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-purple-400 shadow-md"></div>
          </div>
        </div>
        <div className="absolute right-[72px] top-[160px] origin-top-left wave-right">
          <div className="w-4 h-20 bg-gradient-to-b from-purple-500 to-purple-600 rounded-lg shadow-lg">
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-purple-400 shadow-md"></div>
          </div>
        </div>

        {/* Legs */}
        <div className="absolute left-[100px] top-[280px]">
          <div className="w-5 h-16 bg-gradient-to-b from-purple-600 to-purple-700 rounded-lg shadow-lg">
            <div className="absolute -bottom-2 -left-1 w-8 h-4 bg-purple-500 rounded-lg shadow-md"></div>
          </div>
        </div>
        <div className="absolute right-[100px] top-[280px]">
          <div className="w-5 h-16 bg-gradient-to-b from-purple-600 to-purple-700 rounded-lg shadow-lg">
            <div className="absolute -bottom-2 -right-1 w-8 h-4 bg-purple-500 rounded-lg shadow-md"></div>
          </div>
        </div>

        {/* Jetpack */}
        <div className="absolute left-1/2 top-40 -translate-x-1/2 -z-10">
          <div className="w-28 h-36 bg-gradient-to-b from-slate-600 to-slate-700 rounded-xl shadow-xl">
            {/* Jetpack Flames */}
            <div className="absolute -bottom-8 left-6 w-4 h-8 bg-gradient-to-b from-purple-500 to-transparent rounded-full opacity-70 pulse"></div>
            <div className="absolute -bottom-8 right-6 w-4 h-8 bg-gradient-to-b from-purple-500 to-transparent rounded-full opacity-70 pulse" style={{ animationDelay: '0.3s' }}></div>
          </div>
        </div>
      </div>

      {/* Helper Text Bubble */}
      <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-purple-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg whitespace-nowrap">
        Here to Help! 🚀
      </div>
    </div>
  )
}