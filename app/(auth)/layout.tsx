export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-black text-xl">P1</span>
            </div>
            <div className="text-left">
              <h1 className="text-2xl font-black text-white">PORTAL ONE</h1>
              <p className="text-gray-500 text-sm">College Coach Database</p>
            </div>
          </div>
        </div>

        {children}
      </div>
    </div>
  )
}
