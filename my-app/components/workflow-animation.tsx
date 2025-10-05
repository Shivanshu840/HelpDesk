"use client"

export function WorkflowAnimation() {
  return (
    <div className="relative w-full max-w-4xl mx-auto py-8">
      <style jsx>{`
        @keyframes nodeAppear {
          from { 
            opacity: 0; 
            transform: scale(0.8) translateY(20px); 
          }
          to { 
            opacity: 1; 
            transform: scale(1) translateY(0); 
          }
        }
        @keyframes edgeDraw {
          from { 
            stroke-dashoffset: 200; 
          }
          to { 
            stroke-dashoffset: 0; 
          }
        }
        @keyframes flowPulse {
          0%, 100% { 
            r: 6; 
            opacity: 0.8; 
          }
          50% { 
            r: 8; 
            opacity: 1; 
          }
        }
        @keyframes nodePulse {
          0%, 100% { 
            box-shadow: 0 0 20px rgba(168, 85, 247, 0.4); 
          }
          50% { 
            box-shadow: 0 0 30px rgba(168, 85, 247, 0.8); 
          }
        }
        .node-1 { 
          animation: nodeAppear 0.5s ease-out 0s forwards;
          opacity: 0;
        }
        .node-2 { 
          animation: nodeAppear 0.5s ease-out 1.2s forwards;
          opacity: 0;
        }
        .node-3 { 
          animation: nodeAppear 0.5s ease-out 2.4s forwards;
          opacity: 0;
        }
        .node-4 { 
          animation: nodeAppear 0.5s ease-out 3.6s forwards;
          opacity: 0;
        }
        .edge-1 {
          stroke-dasharray: 200;
          stroke-dashoffset: 200;
          animation: edgeDraw 0.8s ease-out 0.6s forwards;
        }
        .edge-2 {
          stroke-dasharray: 200;
          stroke-dashoffset: 200;
          animation: edgeDraw 0.8s ease-out 1.8s forwards;
        }
        .edge-3 {
          stroke-dasharray: 200;
          stroke-dashoffset: 200;
          animation: edgeDraw 0.8s ease-out 3s forwards;
        }
        .executing {
          animation: nodePulse 1.5s ease-in-out infinite;
        }
      `}</style>

      <div className="text-center mb-12">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
          Workflow Execution
        </h2>
        <p className="text-sm md:text-base text-white/80">
          Sequential ticket processing flow
        </p>
      </div>

      <div className="relative h-[450px]">
        {/* SVG Canvas for Edges */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 1000 400">
          <defs>
            <linearGradient id="edgeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#a855f7" />
              <stop offset="100%" stopColor="#c084fc" />
            </linearGradient>
            <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
              <polygon points="0 0, 10 3, 0 6" fill="#c084fc" />
            </marker>
          </defs>

          {/* Edge 1: Create -> Assign */}
          <path
            d="M 180 120 L 280 120"
            stroke="url(#edgeGradient)"
            strokeWidth="3"
            fill="none"
            markerEnd="url(#arrowhead)"
            className="edge-1"
          />

          {/* Edge 2: Assign -> Track */}
          <path
            d="M 430 120 L 530 120"
            stroke="url(#edgeGradient)"
            strokeWidth="3"
            fill="none"
            markerEnd="url(#arrowhead)"
            className="edge-2"
          />

          {/* Edge 3: Track -> Resolve */}
          <path
            d="M 680 120 L 780 120"
            stroke="url(#edgeGradient)"
            strokeWidth="3"
            fill="none"
            markerEnd="url(#arrowhead)"
            className="edge-3"
          />

          {/* Flow particles on edges */}
          <circle cx="0" cy="0" r="6" fill="#e879f9">
            <animateMotion
              dur="1.2s"
              repeatCount="indefinite"
              begin="1.4s"
              path="M 180 120 L 280 120"
            />
            <animate
              attributeName="opacity"
              values="0;1;1;0"
              dur="1.2s"
              repeatCount="indefinite"
              begin="1.4s"
            />
          </circle>

          <circle cx="0" cy="0" r="6" fill="#e879f9">
            <animateMotion
              dur="1.2s"
              repeatCount="indefinite"
              begin="2.6s"
              path="M 430 120 L 530 120"
            />
            <animate
              attributeName="opacity"
              values="0;1;1;0"
              dur="1.2s"
              repeatCount="indefinite"
              begin="2.6s"
            />
          </circle>

          <circle cx="0" cy="0" r="6" fill="#e879f9">
            <animateMotion
              dur="1.2s"
              repeatCount="indefinite"
              begin="3.8s"
              path="M 680 120 L 780 120"
            />
            <animate
              attributeName="opacity"
              values="0;1;1;0"
              dur="1.2s"
              repeatCount="indefinite"
              begin="3.8s"
            />
          </circle>
        </svg>

        {/* Node 1: Create Ticket */}
        <div className="absolute node-1" style={{ left: '8%', top: '20%' }}>
          <div className="flex flex-col items-center gap-3">
            <div className="relative w-24 h-24 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-xl border-2 border-purple-400 executing flex flex-col items-center justify-center">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span className="text-xs text-white font-bold mt-1">CREATE</span>
            </div>
            <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/20">
              <div className="text-sm font-semibold text-white text-center">New Ticket</div>
              <div className="text-xs text-white/70 text-center">Submit Request</div>
            </div>
          </div>
        </div>

        {/* Node 2: Auto Assign */}
        <div className="absolute node-2" style={{ left: '31%', top: '20%' }}>
          <div className="flex flex-col items-center gap-3">
            <div className="relative w-24 h-24 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-xl border-2 border-purple-400 executing flex flex-col items-center justify-center">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span className="text-xs text-white font-bold mt-1">ASSIGN</span>
            </div>
            <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/20">
              <div className="text-sm font-semibold text-white text-center">Auto Route</div>
              <div className="text-xs text-white/70 text-center">Smart Agent</div>
            </div>
          </div>
        </div>

        {/* Node 3: Track & Process */}
        <div className="absolute node-3" style={{ left: '54%', top: '20%' }}>
          <div className="flex flex-col items-center gap-3">
            <div className="relative w-24 h-24 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-xl border-2 border-purple-400 executing flex flex-col items-center justify-center">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-xs text-white font-bold mt-1">TRACK</span>
            </div>
            <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/20">
              <div className="text-sm font-semibold text-white text-center">In Progress</div>
              <div className="text-xs text-white/70 text-center">SLA Monitor</div>
            </div>
          </div>
        </div>

        {/* Node 4: Resolve */}
        <div className="absolute node-4" style={{ left: '77%', top: '20%' }}>
          <div className="flex flex-col items-center gap-3">
            <div className="relative w-24 h-24 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-xl border-2 border-purple-400 executing flex flex-col items-center justify-center">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-xs text-white font-bold mt-1">RESOLVE</span>
            </div>
            <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/20">
              <div className="text-sm font-semibold text-white text-center">Completed</div>
              <div className="text-xs text-white/70 text-center">Closed</div>
            </div>
          </div>
        </div>

        {/* Bottom Stats */}
        <div className="absolute bottom-0 left-0 right-0 grid grid-cols-3 gap-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20 text-center">
            <div className="text-2xl font-bold text-white">2.5min</div>
            <div className="text-xs text-white/70">Avg Time</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20 text-center">
            <div className="text-2xl font-bold text-white">98%</div>
            <div className="text-xs text-white/70">Success Rate</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20 text-center">
            <div className="text-2xl font-bold text-white">Auto</div>
            <div className="text-xs text-white/70">Processing</div>
          </div>
        </div>
      </div>
    </div>
  )
}