import { useRouter } from 'next/navigation';
import { Chapter } from '../types/chapter';

type ChapterCardProps = Chapter;

export default function ChapterCard({
    id,
    title,
    description,
}: ChapterCardProps) {
    const router = useRouter();

    const handleViewDetails = () => {
        window.scrollTo(0, 0);
        router.push(`/chapters/${id}`);
    };

    return (
        <div className="bg-[#252526] p-6 rounded-lg shadow-2xl m-6 hover:bg-[#2d2d2d] transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-blue-500/20">
            <h2 className="text-xl font-semibold text-gray-100 mb-4 transition-colors duration-300">
                {title}
            </h2>
            <div className="mb-4">
                <div className="text-right text-gray-400 mb-2">
                    100% completed
                </div>
                <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
                    <div className="bg-blue-600 h-3 rounded-full transition-all duration-1000 ease-out animate-pulse"></div>
                </div>
            </div>

            <p className="text-gray-300 p-3 mb-4 transition-colors duration-300">
                {description}
            </p>
            <button
                onClick={handleViewDetails}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg hover:shadow-blue-500/30"
            >
                Προβολή Λεπτομερειών
            </button>
        </div>
    );
}
