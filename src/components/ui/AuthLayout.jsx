import logo from "../../assets/logo.png";
export default function AuthLayout({ title, children }) {
    return (
        <div className="
      min-h-screen 
      flex items-center justify-center
      bg-gradient-to-br from-indigo-600 via-blue-600 to-purple-600
      p-4
    ">

            <div className="
        w-full max-w-md
        bg-white/10
        backdrop-blur-xl
        rounded-3xl
        p-8
        shadow-2xl
        border border-white/20
      ">
            <img
                src={logo}
                alt="Map Manager Logo"
                className="w-50 mx-auto mb-4"
                />


                {children}

            </div>
        </div>
    );
}
