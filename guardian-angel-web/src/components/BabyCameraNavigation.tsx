import { Baby } from 'lucide-react';


const Navigation = () => {
    return (
        <nav className="bg-white border-b border-rose-100 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center space-x-3">
                        <div className="bg-gradient-to-br from-rose-100 to-blue-100 p-2 rounded-xl">
                            <Baby className="w-6 h-6 text-rose-500" />
                        </div>
                        <h1 className="text-2xl font-semibold bg-gradient-to-r from-rose-400 to-blue-400 bg-clip-text text-transparent">
                            Guardian Angel
                        </h1>
                    </div>

                    <div className="flex space-x-1">
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navigation;
